# AGENTS.md

## Dev Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build (single-file output via vite-plugin-singlefile)
npm run preview # Preview production build
```

## Build Notes

- `vite-plugin-singlefile` embeds all assets into a single HTML file (no separate JS/CSS)
- Output: `dist/index.html` with embedded bundles

## Path Alias

- `@` maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`)

## Architecture

- **Entry**: `src/main.tsx` -> `src/App.tsx`
- **Views**: Organized in `src/views/` subdirectories
  - `login/` - Login screen
  - `dashboard/` - Main dashboard overview
  - `admin/` - User CRUD operations
  - `utils/` - Tests and Best Practices
- **State**: `AuthContext` (JWT auth), `UserContext` (user CRUD data)
- **Mock Data**: `src/data/mockUsers.ts`

## Testing

- No test framework installed
- Testing view (`TestsView`) exists in UI but requires manual verification

## TypeScript

- Strict mode enabled (`strict: true`)
- No unused locals/parameters allowed

## Dependencies

- React 19, Vite 7, Tailwind CSS 4, TypeScript 5.9
- `clsx`, `tailwind-merge` for className utility