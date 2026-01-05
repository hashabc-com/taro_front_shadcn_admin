---
applyTo: '**'
---
# Copilot 技术工作总结指令模板（近七天 · 北京时间）

本模板用于在 VS Code 中由 Copilot 统一拉取近 7 天（北京时间）各仓库的 Git 提交，并按「Ownership / Impact / Quality / Collaboration / Next Steps」五部分生成结构化技术总结。

---

## 使用说明
- **第一步**：使用 `#git_push` 工具同步本地提交到远端（确保数据完整性）
  - Copilot 会自动对目标仓库执行 `git push` 操作
  - 若无待推送提交则无变更
- **第二步**：脚本会自动从 `git config --global user.email` 或 `user.name` 读取作者信息
  - 若需要手动指定作者，可在脚本开头修改 `$Author` 变量
- **第三步**：在 VS Code 终端（PowerShell）中直接复制粘贴完整脚本并运行
- **第四步**：Copilot 收集 JSON 输出后，按"汇总生成规则"自动生成结构化总结
- 若远程 PR/Review/Issue 需要统计，请参考"扩展"

## 参数说明
- **作者过滤**：自动读取 git 全局配置，留空则统计所有作者
- **仓库路径列表**：`$Repos = @("D:\\work\\taro_front_shadcn_admin", "D:\\work\\taropay_merchant_admin")`
- **时间窗口**：近 7 天（北京时间）
- **编码处理**：脚本已设置 UTF-8 输出，避免中文乱码

## 数据采集脚本（PowerShell）
```powershell
# === 配置参数 ===
# 自动读取 git 全局配置的邮箱或用户名作为作者过滤
$globalEmail = git config --global user.email
$globalName = git config --global user.name
if (-not [string]::IsNullOrEmpty($globalEmail)) {
  $Author = $globalEmail
} elseif (-not [string]::IsNullOrEmpty($globalName)) {
  $Author = $globalName
} else {
  $Author = ""  # 留空将统计所有作者
}

$Repos  = @(
  "D:\work\taro_front_shadcn_admin",
  "D:\work\taropay_merchant_admin"
)

# === 北京时间窗口（过去 7 天）===
$tzId = "China Standard Time"
$nowBeijing   = [System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([datetime]::UtcNow, $tzId)
$sinceBeijing = $nowBeijing.AddDays(-7)
$sinceStr     = $sinceBeijing.ToString("yyyy-MM-dd HH:mm:ss")

function Normalize-GitRemoteUrl($url) {
  if ($url -match '^git@github.com:(.+)\.git$') { return "https://github.com/" + $matches[1] }
  elseif ($url -match '^https?://github.com/.+\.git$') { return ($url -replace '\.git$','') }
  else { return $url }
}

$allResults = @()
foreach ($repo in $Repos) {
  if (-not (Test-Path $repo)) { Write-Host "[warn] 路径不存在: $repo"; continue }
  Push-Location $repo
  $remote = git config --get remote.origin.url
  $remoteHttp = Normalize-GitRemoteUrl $remote

  # 构建 git log 参数（处理作者为空的情况）
  $authorParam = if ([string]::IsNullOrEmpty($Author)) { @() } else { @("--author=$Author") }
  
  # 提交列表（哈希|日期|主题）- 使用 UTF-8 编码
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
  $commits = git log --since=$sinceStr @authorParam --pretty=format:"%H|%ad|%s" --date=iso-local

  # 变更统计（增删行 & 文件）
  $stats = git log --since=$sinceStr @authorParam --numstat --pretty=""
  $added=0; $deleted=0; $files=0
  foreach($line in $stats){ if($line -match '^\d+\s+\d+\s+'){
    $parts = $line -split '\s+'
    $added += [int]$parts[0]
    $deleted += [int]$parts[1]
    $files += 1
  }}
  $commitCount = (git log --since=$sinceStr @authorParam --pretty=oneline | Measure-Object).Count

  $result = [pscustomobject]@{
    RepoPath     = $repo
    RemoteUrl    = $remoteHttp
    CommitCount  = $commitCount
    FilesChanged = $files
    LinesAdded   = $added
    LinesDeleted = $deleted
    Commits      = @()
  }

  foreach($c in $commits){
    if ([string]::IsNullOrEmpty($c)) { continue }
    $parts = $c -split '\|', 3  # 限制最多分割为3部分，避免主题中包含 | 时被切断
    if ($parts.Length -ge 3){
      $hash=$parts[0]; $date=$parts[1]; $subject=$parts[2]
      $commitUrl = if($remoteHttp -match '^https://github.com/.+/.+$'){ "$remoteHttp/commit/$hash" } else { $hash }
      $result.Commits += [pscustomobject]@{ Hash=$hash; Date=$date; Subject=$subject; Url=$commitUrl }
    }
  }

  $allResults += $result
  Pop-Location
}

# 输出为表格与 JSON，便于 Copilot 消化
Write-Host "`n=== 近 7 天提交统计 ===" -ForegroundColor Cyan
Write-Host "作者过滤: $(if([string]::IsNullOrEmpty($Author)){'<所有作者>'}else{$Author})" -ForegroundColor Yellow
Write-Host "时间窗口: $sinceStr ~ $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n" -ForegroundColor Yellow

$allResults | Format-Table RepoPath, CommitCount, FilesChanged, LinesAdded, LinesDeleted -AutoSize
$allResults | ConvertTo-Json -Depth 5 | Out-String | Write-Output
```

## 汇总生成规则（Copilot 执行）
- 归档范围：近 7 天（北京时间）内本人在 `$Repos` 的提交与增删行统计。
- 分类标签（用于 Impact/Quality）：
  - fix/bug（关键词：`fix|bug|hotfix|patch`）
  - perf（关键词：`perf|performance|cache|memo|latency`）
  - refactor（关键词：`refactor|cleanup|restructure|modular`）
  - feat（关键词：`feat|feature|add|support`）
  - docs/tooling（关键词：`docs|readme|chore|lint|format|build`）
  - security/compliance（关键词：`security|auth|permission|compliance`）
- 生成 5 部分总结：
  1) Ownership：列出本人深度参与的仓库/模块、角色（主导/关键实现/维护/兜底）与基本指标（提交次数、增删行、变更文件）。
  2) Impact：挑选关键提交（附链接），说明对稳定性/性能/成本/合规的影响与覆盖范围。
  3) Quality：总结重构/抽象/规范化工作与复杂度下降点，以及可维护性与可扩展性提升。
  4) Collaboration：列出 unblock、评审、方案沉淀、公共能力/工具/文档的放大作用（若远程数据缺失则标注局限）。
  5) Next Steps：给出 1～2 个重点推进方向与影响力拉升路径。
- 数据缺失策略：若提交为 0，仍输出结构化总结，并标注“数据范围与局限”。

## 输出模板（粘贴到周报/复盘）
```
数据范围与局限
- 时间：过去 7 天（北京时间），窗口：{{DATE_RANGE}}
- 仓库：{{REPOS_LIST}}
- 说明：{{DATA_LIMITATION_NOTE}}

1. Ownership（我负责 / 深度参与）
- 仓库/模块：{{REPO_NAME}}（角色：{{ROLE}}）
  - 提交：{{COMMIT_COUNT}} 次（+{{LINES_ADDED}} / -{{LINES_DELETED}} 行；变更文件：{{FILES_CHANGED}}）
  - 链接：{{REPO_URL}}
- （可重复列出多仓库）

2. Impact（关键问题与影响）
- 稳定性/性能/成本/合规：{{IMPACT_ITEMS}}
- 代表性提交：
  - {{SUBJECT}}（{{DATE}}）→ {{COMMIT_URL}}（标签：{{TAGS}}）
  - （可列出 2～4 条）

3. Quality（系统性改进）
- 重构/抽象/规范化：{{QUALITY_ITEMS}}
- 复杂度下降点：{{COMPLEXITY_REDUCED}}
- 可维护性/扩展性提升：{{MAINTAINABILITY_IMPROVED}}

4. Collaboration（放大作用）
- Unblock/Review/讨论：{{COLLAB_ITEMS}}
- 沉淀：公共能力 / 工具 / 文档 / 最佳实践：{{ASSETS}}
- 团队收益：{{TEAM_BENEFITS}}

5. Next Steps（下一阶段计划）
- 关键问题：{{NEXT_ISSUES}}
- 重点推进：{{NEXT_FOCUS_1}}、{{NEXT_FOCUS_2}}
- 影响力方向：{{INFLUENCE_DIRECTION}}
```

## 失败与数据缺失处理
- 若某仓库不存在或无 Git 记录：在“数据范围与局限”中标注并继续输出整体总结。
- 若提交为 0：按模板仍输出，并给出下一阶段的改进计划与数据补全方案（如接入远程 PR/Review）。

## 扩展：拉取 PR / Review / Issue（需要 GitHub Token）
- 可通过 GitHub REST API（`/repos/{owner}/{repo}/pulls`、`/issues`、`/search`）按作者与时间窗口聚合更多协作数据。
- 将远程数据并入“Collaboration”与“Impact”，提升总结完整度。
- 建议将 Token 配置到本地环境变量或 VS Code Secret 并由 Copilot 读取。

---

## 与 Taropay 项目实践的关联（可选）
- 若涉及 `taro_front_shadcn_admin` 或 `taropay_merchant_admin`：在 Impact/Quality 中优先关注
  - TanStack Query 的 `queryKey` 约定与服务端分页
  - 路由权限与 `getFirstAuthorizedRoute()` 使用一致性
  - 表单 `type='button'` 防误提交与 `z.coerce.number()` 的校验一致性
  - shadcn/ui 组件正确使用（避免 `DropdownMenu modal={false}`）
- 将这些工程约定的巡检或改进，作为 Quality 与 Next Steps 的抓手。
