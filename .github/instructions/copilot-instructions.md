---
applyTo: 'taro_front_shadcn_admin/**'
---
# Taropay Admin Copilot Instructions

## Project Overview

This is a **React 19 + TypeScript** admin dashboard for a payment system (Taropay), built with **Vite**, **shadcn/ui**, **TanStack Router**, **TanStack Query**, and **Zustand**. The architecture follows a feature-based structure with file-system routing.

## Design Philosophy

You are a **professional UI/UX designer** with expertise in creating intuitive and visually appealing interfaces. When implementing features:

- **Prioritize User Experience**: Focus on clarity, consistency, and ease of use over strict adherence to existing patterns
- **Flexible Layout & Structure**: You have creative freedom to design optimal layouts, spacing, and component arrangements that best serve the user's needs
- **Visual Hierarchy**: Ensure proper information hierarchy through typography, spacing, and visual weight
- **Responsive Design**: Consider mobile-first approaches and ensure layouts adapt gracefully across screen sizes
- **Accessibility**: Maintain WCAG standards for color contrast, keyboard navigation, and screen reader support
- **Modern Aesthetics**: Leverage shadcn/ui components creatively while maintaining a cohesive design language

Don't feel constrained by existing implementations if you can propose a better user experience. Balance consistency with innovation.

## Architecture Patterns

### 1. Feature-Based Structure

Business logic is organized by domain in `src/features/`:
- Each feature contains: `index.tsx` (main page), `schema.ts` (types), `components/` (UI), and related logic
- Example: `src/features/config/payment-channel/` contains all payment channel functionality
- Route files in `src/routes/_authenticated/` import and render feature components

### 2. API & HTTP Layer

**Location**: `src/api/` (domain-specific files) + `src/lib/http.ts` (base config)

**Key Pattern**: Custom `http` wrapper with automatic parameter injection:
```typescript
// http.ts automatically adds country/merchantId from Zustand stores
// Disable with: { autoAddCountry: false, autoAddMerchantId: false }
http.get('/admin/paymentChannel/list', params, { autoAddCountry: false })
```

**API File Structure**:
- One file per domain (e.g., `config.ts`, `merchant.ts`, `order.ts`)
- Export named functions, not default exports
- Use descriptive names: `getPaymentChannelList`, `updatePaymentChannel`
- **All API endpoints MUST start with `/admin` prefix** (e.g., `/admin/paymentChannel/list`, `/admin/merchant/update`)

### 3. Data Fetching with TanStack Query

**Standard Pattern**:
```tsx
const { data, isLoading } = useQuery({
  queryKey: ['payment-channels', search],
  queryFn: () => getPaymentChannelList(search),
  placeholderData: (prev) => prev ?? undefined // Maintain UI state during refetch
})
```

**Mutations** use `useMutation` with query invalidation:
```typescript
const mutation = useMutation({
  mutationFn: updatePaymentChannel,
  onSuccess: (res) => {
    if (res.code == 200) {
      queryClient.invalidateQueries({ queryKey: ['payment-channels'] })
      toast.success(t('common.updateSuccess'))
    }
  }
})
```

### 4. Routing (TanStack Router)

**File-System Based**: Routes in `src/routes/` auto-generate routing
- `_authenticated/` - Protected routes requiring login
- `(auth)/` - Public auth routes (sign-in, etc.)
- Route guards in `src/routes/_authenticated/route.tsx` check permissions via `src/utils/permission.ts`

**URL State Management**: Use `useTableUrlState` hook for pagination/filters:
```typescript
const { pagination, onPaginationChange } = useTableUrlState({
  search: router.latestLocation.search,
  navigate,
  pagination: { defaultPage: 1, defaultPageSize: 10, pageKey: 'pageNum' }
})
```

### 5. Internationalization (i18n)

**Source**: `src/lib/i18n.ts` contains nested translation objects for `zh` and `en`

**Usage**:
```tsx
const { t, lang } = useLanguage() // From context
{t('config.paymentChannel.title')}
```

**Pattern**: Group translations by feature/domain (e.g., `config.paymentChannel.*`, `common.*`)

**⚠️ CRITICAL RULE**: All user-facing text MUST be internationalized
- ✅ Always use `t()` function for any text displayed to users
- ✅ Add both `zh` and `en` translations to `src/lib/i18n.ts` when adding new features
- ❌ Never hardcode Chinese or English text directly in components
- ❌ Never use static strings in labels, buttons, messages, placeholders, validation errors, etc.

**Example**:
```tsx
// ❌ BAD - Hardcoded text
<Button>提交</Button>
<FormLabel>商户名称</FormLabel>

// ✅ GOOD - Internationalized
<Button>{t('common.submit')}</Button>
<FormLabel>{t('merchant.info.merchantName')}</FormLabel>
```

### 6. State Management

**Zustand Stores** in `src/stores/`:
- `auth-store.ts` - Authentication, permissions (persisted to localStorage)
- `country-store.ts` - Selected country context
- `merchant-store.ts` - Selected merchant context

**Pattern**: Stores auto-load from localStorage and sync on changes:
```typescript
const initialToken = localStorage.getItem('_token')
export const useAuthStore = create<AuthState>((set, get) => ({...}))
```

### 7. Permission System

**Files**: `src/utils/permission.ts` + `src/routes/_authenticated/route.tsx`

**Key Functions**:
- `hasRoutePermission(route, permissions)` - Checks exact and parent path matches
- `getFirstAuthorizedRoute(permissions)` - Returns first accessible child route (skips parent-only paths like `/order`)

**Whitelist**: Routes under `/settings/*` bypass permission checks

### 8. Form Handling

**Stack**: React Hook Form + Zod validation

**Pattern**:
```tsx
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {...}
})

// For number inputs from string fields:
z.coerce.number().min(0).optional()

// Buttons in forms MUST have type='button' unless submitting:
<Button type='button' onClick={handleAction}>Action</Button>
```

**Critical Rules**:
1. Prevent form submission on non-submit buttons using `type='button'` and `e.preventDefault()`
2. **Internationalization in Zod schemas**: Define schema INSIDE component using `useMemo` to access `t()` function:
   ```tsx
   export function MyDialog() {
     const { t } = useLanguage()
     
     const schema = useMemo(() => z.object({
       name: z.string().min(1, t('validation.nameRequired')),
       // ❌ NOT: z.string().min(1, 'validation.nameRequired') - won't translate
     }), [t])
     
     const form = useForm({ resolver: zodResolver(schema) })
   }
   ```
3. **Required number fields**: Use `z.preprocess()` to handle empty strings and ensure validation:
   ```tsx
   // For required number fields that can't be empty
   z.preprocess((val) => {
     if (val === '' || val === null || val === undefined) return 0
     return Number(val)
   }, z.number().min(0, t('validation.minZero')))
   
   // Set defaultValue to 0 instead of null
   defaultValues: { amount: 0 } // NOT: { amount: null }
   ```

### 9. Google Auth Dialog (谷歌验证码弹窗)

**组件**: `src/components/google-auth-dialog.tsx`
**Hook**: `src/hooks/use-google-auth-dialog.tsx`

凡是需要用户输入 Google 验证码（`gauthKey`）的场景，**必须优先使用** `useGoogleAuthDialog` hook，而非自行编写验证码弹窗或表单。

**⚠️ 关键规则**:
- ❌ **禁止**自行创建 Google 验证码输入弹窗（Dialog + InputOTP / Input）
- ❌ **禁止**在表单 schema 中添加 `gauthKey` 字段来收集验证码
- ✅ 使用 `useGoogleAuthDialog()` 返回的 `withGoogleAuth` 包裹需要验证码的操作
- ✅ 将 `dialog` 渲染到组件 JSX 中

**标准用法**:
```tsx
import { useGoogleAuthDialog } from '@/hooks/use-google-auth-dialog'

export function MyComponent() {
  const { dialog, withGoogleAuth } = useGoogleAuthDialog()

  const handleAction = () => {
    withGoogleAuth(async (gauthKey) => {
      const res = await someApi({ gauthKey, ...otherParams })
      if (res.code == 200) {
        toast.success(t('common.operationSuccess'))
      }
    })
  }

  return (
    <>
      <Button onClick={handleAction}>需要验证的操作</Button>
      {dialog}
    </>
  )
}
```

**工作原理**:
- `withGoogleAuth(callback)` — 打开验证码弹窗，用户输入 6 位 OTP 码后执行回调
- `dialog` — 弹窗 JSX，必须渲染到组件中
- 弹窗内置 loading 状态管理，回调执行完毕后自动关闭弹窗

### 10. Data Tables

**Components**: `src/components/data-table/*` (reusable primitives)

**Feature Pattern** (per feature directory):
- `*-columns.tsx` - Column definitions with `ColumnDef<T>[]`
- `*-table.tsx` - Table container using `FeatureDataTable`
- `*-search.tsx` - Search/filter bar
- `*-dialogs.tsx` - Add/edit modals

#### ⚠️ FeatureDataTable (优先使用)

**Location**: `src/components/data-table/feature-data-table.tsx`

新建表格页面时**必须优先使用** `FeatureDataTable`，它封装了 `useReactTable`、URL 分页同步、骨架屏加载、表格渲染和分页控件，将 ~130 行样板代码缩减到 ~25 行。

**标准用法** (Search 接收 table prop):
```tsx
import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useXxxData } from '../hooks/use-xxx-data'
import { getColumns } from './xxx-columns'
import { XxxSearch } from './xxx-search'

const route = getRouteApi('/_authenticated/domain/feature-name')

export function XxxTable() {
  const { data, isLoading, totalRecord } = useXxxData()
  const { lang } = useLanguage()
  const columns = useMemo(() => getColumns(lang), [lang])

  return (
    <FeatureDataTable
      columns={columns}
      data={data}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate()}
      renderToolbar={(table) => <XxxSearch table={table} />}
    />
  )
}
```

**Search 不需要 table prop 时**:
```tsx
renderToolbar={() => <XxxSearch />}
```

**带弹窗的表格** (dialogs 通过 `children` 传入):
```tsx
<FeatureDataTable
  columns={columns}
  data={data}
  totalRecord={totalRecord}
  isLoading={isLoading}
  search={route.useSearch()}
  navigate={route.useNavigate()}
  renderToolbar={(table) => <XxxSearch table={table} />}
>
  <EditDialog open={editOpen} onOpenChange={setEditOpen} record={current} />
  <DeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
</FeatureDataTable>
```

**Props 说明**:
| Prop | 类型 | 说明 |
|------|------|------|
| `columns` | `ColumnDef<TData>[]` | 列定义 |
| `data` | `TData[]` | 表格数据 |
| `totalRecord` | `number` | 总记录数（用于分页） |
| `isLoading` | `boolean` | 加载状态 |
| `search` | `Record<string, unknown>` | `route.useSearch()` 返回值 |
| `navigate` | `NavigateFn` | `route.useNavigate()` 返回值 |
| `renderToolbar` | `(table) => ReactNode` | 搜索/工具栏渲染函数（可选） |
| `children` | `ReactNode` | 额外内容如弹窗（可选） |
| `skeletonRows` | `number` | 骨架屏行数，默认 10（可选） |
| `defaultColumnVisibility` | `VisibilityState` | 默认列可见性（可选） |

**不适合 FeatureDataTable 的场景** (需手动写 `useReactTable`):
- 自定义合计行 (summary footer row) — 需要在 `<TableBody>` 内追加额外行
- 自定义单元格渲染 (如 Tooltip 包裹) — 需要修改 cell 渲染逻辑
- Props-based 表格 — 数据从父组件传入且使用 `useRouter()` 而非 `getRouteApi()`
- 超复杂弹窗编排 (7+ 个弹窗) — 逻辑密度太高，拆分意义不大

#### createFeatureProvider (优先使用)

**Location**: `src/lib/create-feature-provider.tsx`

当 feature 页面需要跨组件共享「当前行」和「弹窗状态」时，**必须优先使用** `createFeatureProvider` 工厂函数，而非手动编写 Provider + Context + Hook。

```tsx
// xxx-provider.tsx
import { createFeatureProvider } from '@/lib/create-feature-provider'
import { type XxxType } from '../schema'

type DialogType = 'create' | 'edit' | 'delete'

export const {
  Provider: XxxProvider,
  useContext: useXxx,
} = createFeatureProvider<XxxType, DialogType>('Xxx')
```

**Provider 提供的状态**:
- `open: TDialog | null` — 当前打开的弹窗类型
- `setOpen(dialog: TDialog | null)` — 打开/关闭弹窗
- `currentRow: TRow | null` — 当前操作的行数据
- `setCurrentRow(row)` — 设置当前行

#### useSearchForm (搜索组件必须使用)

**Location**: `src/hooks/use-search-form.ts`

搜索组件**必须使用** `useSearchForm` hook，消除重复的 `useState` / `handleSearch` / `handleReset` 样板代码。新增搜索字段只需在 `fieldKeys` 数组中添加一个字符串。

**标准用法**:
```tsx
import { getRouteApi } from '@tanstack/react-router'
import { useSearchForm } from '@/hooks/use-search-form'

const route = getRouteApi('/_authenticated/domain/feature-name')

export function XxxSearch() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: ['keyword', 'status', 'startTime', 'endTime'] as const,
    })

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <Input value={fields.keyword} onChange={(e) => setField('keyword', e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
      <DateRangePicker mode='date'
        startTime={fields.startTime} endTime={fields.endTime}
        onStartTimeChange={(v) => setField('startTime', v)}
        onEndTimeChange={(v) => setField('endTime', v)} />
      <Button onClick={handleSearch}>{t('common.search')}</Button>
      {hasFilters && <Button onClick={handleReset}>{t('common.reset')}</Button>}
    </div>
  )
}
```

**Hook 返回值**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `fields` | `Record<K, string>` | 所有字段当前值 |
| `setField` | `(key, value) => void` | 更新单个字段 |
| `setFields` | `(patch) => void` | 批量更新字段 |
| `handleSearch` | `() => void` | 执行搜索（空值自动转 undefined） |
| `handleReset` | `() => void` | 重置所有字段并清除 URL 参数 |
| `hasFilters` | `boolean` | 是否有任何非空筛选条件 |

**⚠️ 关键规则**:
- 新建搜索组件时**禁止**手写 `useState` + `handleSearch` + `handleReset` 样板
- 日期范围用 `DateRangePicker` 组件（`src/components/date-range-picker.tsx`），字段名加入 `fieldKeys`
- 额外按钮（导出/创建/刷新）、`useQuery`、`DataTableViewOptions` 等保持独立不受影响
- 添加新搜索字段只需：① `fieldKeys` 加字符串 ② JSX 加输入控件绑定 `fields.xxx` / `setField`

### 11. shadcn/ui Components

**Location**: `src/components/ui/*` (generated via CLI)

**Key Patterns**:
- `Dialog` / `Sheet` for modals (Sheet for larger forms)
- `DropdownMenu` - Do NOT use `modal={false}` (causes async errors)
- `Form` components wrap React Hook Form fields
- Always import from `@/components/ui/...`

## Development Workflows

### Commands
```bash
pnpm dev              # Start dev server (localhost:5173)
pnpm build            # Production build
pnpm build:test       # Test environment build
pnpm lint             # ESLint check
pnpm format           # Prettier format
```

### Code Quality & Auto-fixing

**ESLint Auto-fix**:
```bash
pnpm lint --fix       # Auto-fix ESLint issues
```

**TypeScript Type Errors**:
- Use VS Code's built-in TypeScript error checking
- View all errors: Press `Ctrl+Shift+M` (Windows/Linux) or `Cmd+Shift+M` (Mac) to open Problems panel
- Check errors in specific file: Use `get_errors` tool when working with Copilot
- Common fixes:
  - Remove explicit generic types from `useForm()` - let TypeScript infer them
  - Use `z.coerce.number()` for form fields that need number coercion
  - Avoid hardcoded error messages in Zod schemas - keep them internationalization-friendly

**Common Auto-fixes**:
1. **Import sorting**: Run `pnpm format` to auto-organize imports
2. **Type inference issues**: Remove unnecessary type annotations and let TypeScript infer
3. **Form type mismatches**: Use `form.handleSubmit()` wrapper instead of custom handlers
4. **Effect cascading**: Wrap state updates in `setTimeout` when called from `useEffect`

**Best Practices**:
- Fix TypeScript errors before committing - run `pnpm build` to catch all type errors
- Use ESLint auto-fix regularly to maintain code style consistency
- Don't suppress errors with `@ts-ignore` or `eslint-disable` unless absolutely necessary
- When encountering persistent type errors, simplify the type structure or remove generic constraints

### Adding a New Feature

1. Create feature directory: `src/features/<domain>/<feature-name>/`
2. Add route file: `src/routes/_authenticated/<domain>/<feature-name>.tsx`
3. Create API functions in `src/api/<domain>.ts`
4. **⚠️ Add i18n keys to `src/lib/i18n.ts` (BOTH `zh` AND `en`)** - This is MANDATORY for all user-facing text
5. Define schema types in `schema.ts` (use Zod for validation)
6. **⚠️ 表格页面必须优先使用 `FeatureDataTable`** — 参考 Section 10，不要手动编写 `useReactTable` + 骨架屏 + 表格渲染 + 分页的样板代码
7. **⚠️ 需要跨组件共享弹窗/行状态时，使用 `createFeatureProvider`** — 参考 Section 10，不要手动编写 Provider + Context + Hook
8. **⚠️ 搜索组件必须使用 `useSearchForm`** — 参考 Section 10，不要手写 `useState` + `handleSearch` + `handleReset` 样板代码
9. Verify all text uses `t()` function - no hardcoded Chinese/English strings

### API Integration

**Response Structure**:
```typescript
{ code: 200, message: 'Success', result: { listRecord: [], totalRecord: 0 } }
// OR: { code: 200, data: {...} }
```

**Error Handling**: `http.ts` interceptor auto-shows toast on non-200 codes

### Environment Variables

**File**: `.env` (gitignored)
```env
VITE_TRAOPAY_API_URL=http://api.example.com
VITE_PROXY_TARGET=http://localhost:8080
```

**Usage**: `import.meta.env.VITE_*`

## Common Pitfalls

1. **Form Buttons**: Always add `type='button'` to non-submit buttons in forms to prevent accidental submission
2. **Number Inputs**: Use `z.preprocess()` or `z.coerce.number()` for inputs that return strings but need number validation. For required fields, use `z.preprocess()` to convert empty values to 0 and avoid null default values
3. **Zod Schema Internationalization**: NEVER define Zod schemas outside components with hardcoded i18n keys like `'validation.required'`. Always define schemas inside component body using `useMemo(() => z.object({...}), [t])` so error messages call `t()` function and get translated properly
4. **Missing Internationalization**: All user-facing text must use `t()` function. Check labels, buttons, placeholders, error messages, toasts, and dialog titles. Always add both `zh` and `en` translations when creating/modifying features
5. **DropdownMenu**: Avoid `modal={false}` prop - causes "async response" errors
6. **Permissions**: Backend returns parent paths (e.g., `/order`) that may not have UI routes - use `getFirstAuthorizedRoute()` to find actual child routes
7. **Query Keys**: Always include search params in query keys: `queryKey: ['list', search]`
8. **Table Pagination**: Use `pageKey: 'pageNum'` for API compatibility (not `page`)

## Code Conventions

- **Imports**: Use `@/` alias for absolute imports from `src/`
- **Types**: Define in `schema.ts` per feature, use Zod schemas for validation
- **Naming**: 
  - Components: PascalCase (`PaymentChannelTable`)
  - Files: kebab-case (`payment-channel-table.tsx`)
  - API functions: camelCase with verb prefix (`getPaymentChannelList`)
- **Exports**: Named exports for components, default export for route components
- **Styling**: Tailwind CSS utility classes, use `cn()` helper for conditional classes
- **Page Structure**:
  - **Do NOT add `DialogDescription` in page dialogs/sheets** - keep UI clean without redundant descriptions
  - Focus on clear labels and intuitive form layouts instead of explanatory text
  - Use placeholder text in form fields to guide users when necessary

## Testing

Currently no automated tests configured. Manual testing via dev server.

## Questions to Clarify

1. **Permission Data Structure**: Confirm if backend always returns flat menu list (current assumption) vs. hierarchical structure
2. **Error Codes**: Are non-200 codes always errors, or are there success codes besides 200?
3. **Localization**: Should new features support additional languages beyond zh/en?
