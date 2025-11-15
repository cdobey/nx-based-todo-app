# Copilot Instructions for Todo App Nx Workspace

## Architecture Overview
This is an Nx monorepo workspace for building a todo application. It uses the `@nx/js` plugin for TypeScript projects, with packages managed in the `packages/` directory. The workspace is configured for inferred tasks, automatic TypeScript project references syncing, and Nx Cloud for CI optimization.

Key files:
- `nx.json`: Defines plugins, inputs, and Nx Cloud ID
- `package.json`: Root config with workspaces pointing to `packages/*`
- `tsconfig.base.json`: Base TypeScript config for the monorepo

## Developer Workflows
- **Generate libraries**: `npx nx g @nx/js:lib packages/<name> --publishable --importPath=@<org>/<name>`
- **Run tasks**: Always use `npx nx <target> <project>` instead of direct tooling (e.g., `npx nx build mylib`)
- **Build**: `npx nx build <project>` (inferred from TypeScript config)
- **Typecheck**: `npx nx typecheck <project>` (configured in nx.json)
- **Release**: `npx nx release` for versioning and publishing (use `--dry-run` first)
- **Sync TS references**: `npx nx sync` to update project references; `npx nx sync:check` in CI
- **Visualize graph**: `npx nx graph` to explore project dependencies

## Conventions and Patterns
- Use Nx inferred tasks for build, typecheck, and dependencies
- Libraries are publishable with scoped import paths (e.g., `@my-org/pkg1`)
- Follow Nx best practices: prefer `nx run-many` or `nx affected` for multi-project operations
- CI setup via Nx Cloud; reference `.github/workflows/ci.yml` in namedInputs
- Prettier for code formatting (devDependency in root)

## Integration Points
- Nx Cloud for distributed caching and CI (ID: 69188fe05d8c956830502dfb)
- TypeScript project references auto-managed by Nx sync
- Workspaces for package management, allowing cross-package dependencies

Reference `AGENTS.md` for additional Nx guidelines and `README.md` for setup details.