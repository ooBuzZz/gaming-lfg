# AGENTS.md

## Commands
- **Dev**: `npm run dev` - Start development server
- **Build**: `npm run build` - TypeScript compilation + Vite build  
- **Lint**: `npm run lint` - ESLint with TypeScript support
- **Preview**: `npm run preview` - Preview production build
- **Type check**: `tsc -b` - Run TypeScript compiler check

## Architecture
- **Frontend**: React 19 + TypeScript + Vite SPA
- **Database**: Supabase (PostgreSQL) - client in `src/supabaseClient.ts`
- **State**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router DOM v7
- **Structure**: Feature-based organization (`src/features/`)

## Code Style
- **Imports**: Named exports preferred, relative imports for local files
- **Components**: PascalCase files/names, functional components with TypeScript
- **Types**: Export from `types/index.ts`, strict TypeScript config enabled
- **CSS**: Component-specific classes, kebab-case naming
- **Naming**: Features use plural folders (`notes/`), components in PascalCase
- **Environment**: Vite env vars with `VITE_` prefix, stored in `.env.local`
