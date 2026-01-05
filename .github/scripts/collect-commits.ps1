# === Params (optional) ===
param(
  [string]$Author = ""
)

# === Repo list (workspace) ===
$Repos  = @(
  "D:\work\fe-taro-apidoc",
  "D:\work\fe-taro-custom",
  "D:\work\fe-taro-main",
  "D:\work\taro_front_admin",
  "D:\work\website",
  "D:\work\h5_payment",
  "D:\work\taropay_merchant_admin",
  "D:\work\taro_front_shadcn_admin"
)

# === Beijing time window (last 7 days) ===
$tzId = "China Standard Time"
$nowBeijing   = [System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([datetime]::UtcNow, $tzId)
$sinceBeijing = $nowBeijing.AddDays(-7)
$sinceStr     = $sinceBeijing.ToString("yyyy-MM-dd HH:mm:ss")

function Normalize-GitRemoteUrl($url) {
  if ($url -match '^git@github.com:(.+)\.git$') { return "https://github.com/" + $matches[1] }
  elseif ($url -match '^https?://github.com/.+\.git$') { return ($url -replace '\.git$','') }
  else { return $url }
}

# Auto-detect most active author in last 7 days if not provided
if ([string]::IsNullOrWhiteSpace($Author)) {
  $authors = @{}
  foreach ($repo in $Repos) {
    if (Test-Path $repo) {
      Push-Location $repo
      $logs = git log --since="$sinceStr" --pretty=format:"%an|%ae"
      foreach ($l in $logs) {
        if ($authors.ContainsKey($l)) { $authors[$l]++ } else { $authors[$l] = 1 }
      }
      Pop-Location
    }
  }
  $sorted = $authors.GetEnumerator() | Sort-Object -Property Value -Descending
  if ($sorted.Count -gt 0) {
    $Author = $sorted[0].Name
    Write-Host ("[info] Detected author: " + $Author)
  } else {
    Write-Host "[warn] No author detected, using all commits"
  }
}

$allResults = @()
foreach ($repo in $Repos) {
  if (-not (Test-Path $repo)) { Write-Host "[warn] Path not found: $repo"; continue }
  Push-Location $repo
  $remote = git config --get remote.origin.url
  $remoteHttp = Normalize-GitRemoteUrl $remote

  $baseArgs = @("log","--since=$sinceStr")
  $prettyArgs = @("--pretty=format:%H|%ad|%s","--date=iso-local")
  $numstatArgs = @("--numstat","--pretty=")

  $useAuthor = -not [string]::IsNullOrWhiteSpace($Author)
  if ($useAuthor) { $baseArgs += "--author=$Author" }

  $commits = & git $baseArgs $prettyArgs
  $statsLines = & git $baseArgs $numstatArgs

  $added=0; $deleted=0; $files=0
  foreach($line in $statsLines){ if($line -match '^\d+\s+\d+\s+'){
    $parts = $line -split '\s+'
    $added += [int]$parts[0]
    $deleted += [int]$parts[1]
    $files += 1
  }}
  $commitCount = (& git $baseArgs --pretty=oneline | Measure-Object).Count

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
    $parts = $c -split '\|'
    if ($parts.Length -ge 3){
      $hash=$parts[0]; $date=$parts[1]; $subject=($parts[2..($parts.Length-1)] -join '|')
      $commitUrl = if($remoteHttp -match '^https://github.com/.+/.+$'){ "$remoteHttp/commit/$hash" } else { $hash }
      $result.Commits += [pscustomobject]@{ Hash=$hash; Date=$date; Subject=$subject; Url=$commitUrl }
    }
  }

  $allResults += $result
  Pop-Location
}

# 输出 JSON
$allResults | ConvertTo-Json -Depth 5 | Out-String | Write-Output
