# Repository Guidelines

## Project Structure & Module Organization
- `server/` — NestJS API (controllers, services, modules). Entry: `server/src/main.ts`. Unit tests alongside code as `*.spec.ts`; e2e tests in `server/test/`.
- `website/` — React + Vite app. App code in `website/src/` (views under `src/views/`, API clients in `src/request/`, assets in `src/assets/`).
- Root docs in `README.md`. Avoid storing secrets in the repo; review `server/src/lib/token.ts` and `server/src/lib/Cors.ts` when changing auth or CORS.

## Build, Test, and Development Commands
Run commands from each package directory after `npm install`.

Server (NestJS):
- `npm run dev` — start server in watch mode.
- `npm run build` — compile to `dist/`.
- `npm run start:prod` — run compiled server.
- `npm run test` / `test:watch` / `test:cov` / `test:e2e` — unit, watch, coverage, e2e tests.

Website (React + Vite):
- `npm run dev` — start Vite dev server.
- `npm run build` — type-check and build.
- `npm run preview` — preview production build.

## Coding Style & Naming Conventions
- TypeScript with 2-space indentation.
- Linting: ESLint in both apps (`npm run lint`). Formatting: Prettier in `server` (`npm run format`).
- Naming: PascalCase for React components and Nest classes; camelCase for functions/variables; kebab-case for non-component filenames; React component files may use PascalCase.
- Keep modules/components focused; colocate related styles/assets with components.

## Testing Guidelines
- Server uses Jest. Place unit tests next to source as `*.spec.ts`; e2e tests live in `server/test/` as `*.e2e-spec.ts`.
- Target meaningful coverage for services/controllers; check via `npm run test:cov`.
- The website currently has no test runner configured; PRs adding tests are welcome.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (seen in history): `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`.
- PRs should include: clear description, linked issues, verification steps; add screenshots/GIFs for UI changes.
- Keep changes scoped; update docs when behavior changes.

## Security & Configuration Tips
- Do not commit API keys or tokens. Use local `.env` files and environment variables.
- When editing auth or CORS, review `server/src/lib/token.ts` and `server/src/lib/Cors.ts` and test locally before merging.

