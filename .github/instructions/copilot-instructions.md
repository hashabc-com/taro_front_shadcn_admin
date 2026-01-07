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

**Critical**: Prevent form submission on non-submit buttons using `type='button'` and `e.preventDefault()`

### 9. Data Tables

**Components**: `src/components/data-table/*` (reusable primitives)

**Feature Pattern**:
- `*-columns.tsx` - Column definitions with `ColumnDef<T>[]`
- `*-table.tsx` - Table container with toolbar/pagination
- `*-search.tsx` - Search/filter bar
- `*-dialogs.tsx` - Add/edit modals

**TanStack Table Config**:
```typescript
const table = useReactTable({
  data,
  columns,
  state: { pagination, columnVisibility },
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true, // Server-side pagination
  pageCount: Math.ceil(totalRecord / pageSize)
})
```

### 10. shadcn/ui Components

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
4. Add i18n keys to `src/lib/i18n.ts` (both `zh` and `en`)
5. Define schema types in `schema.ts` (use Zod for validation)

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
2. **Number Inputs**: Use `z.coerce.number()` for inputs that return strings but need number validation
3. **DropdownMenu**: Avoid `modal={false}` prop - causes "async response" errors
4. **Permissions**: Backend returns parent paths (e.g., `/order`) that may not have UI routes - use `getFirstAuthorizedRoute()` to find actual child routes
5. **Query Keys**: Always include search params in query keys: `queryKey: ['list', search]`
6. **Table Pagination**: Use `pageKey: 'pageNum'` for API compatibility (not `page`)

## Code Conventions

- **Imports**: Use `@/` alias for absolute imports from `src/`
- **Types**: Define in `schema.ts` per feature, use Zod schemas for validation
- **Naming**: 
  - Components: PascalCase (`PaymentChannelTable`)
  - Files: kebab-case (`payment-channel-table.tsx`)
  - API functions: camelCase with verb prefix (`getPaymentChannelList`)
- **Exports**: Named exports for components, default export for route components
- **Styling**: Tailwind CSS utility classes, use `cn()` helper for conditional classes

## Testing

Currently no automated tests configured. Manual testing via dev server.

## Questions to Clarify

1. **Permission Data Structure**: Confirm if backend always returns flat menu list (current assumption) vs. hierarchical structure
2. **Error Codes**: Are non-200 codes always errors, or are there success codes besides 200?
3. **Localization**: Should new features support additional languages beyond zh/en?
