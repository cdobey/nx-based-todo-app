# TodoApp

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ A full-stack todo application built with Nx monorepo ✨

## Architecture

This workspace contains a full-stack todo application with the following components:

- **Frontend** (`packages/frontend`) - React + TypeScript + Tailwind CSS + Apollo Client
- **GraphQL BFF** (`packages/graphql-bff`) - Apollo Server (Backend for Frontend)
- **Backend API** (`packages/backend`) - .NET REST API with DynamoDB
- **E2E Tests** (`packages/frontend-e2e`, `packages/graphql-bff-e2e`) - Playwright & Jest

```
Frontend (React + Apollo Client)
    ↓
GraphQL BFF (Apollo Server)
    ↓
Backend API (.NET + DynamoDB)
```

## Quick Start

### Local Development

1. **Start the Backend API**:
   ```sh
   cd packages/backend
   dotnet run
   # Runs on http://localhost:5040
   ```

2. **Start the GraphQL BFF**:
   ```sh
   npx nx serve graphql-bff
   # Runs on http://localhost:4000
   ```

3. **Start the Frontend**:
   ```sh
   npx nx serve frontend
   # Runs on http://localhost:4200
   ```

### Docker Development

Run all services together with Docker Compose:

```sh
docker-compose up
```

- Frontend: http://localhost:3000
- GraphQL BFF: http://localhost:4000
- Backend: http://localhost:5040

## Building Docker Images

Each component has its own Dockerfile:

```sh
# Frontend
docker build -f packages/frontend/Dockerfile -t todo-frontend:latest .

# GraphQL BFF
docker build -f packages/graphql-bff/Dockerfile -t todo-graphql-bff:latest .

# Backend
docker build -f packages/backend/Dockerfile -t todo-backend:latest .
```

## CI/CD

The `.github/workflows/docker-publish.yml` workflow automatically:
- Detects which projects are affected by changes
- Builds and pushes Docker images to GitHub Container Registry
- Only builds images for changed projects (Nx-powered)

Images are published to `ghcr.io/<owner>/todo-app/<service>:latest`

## Finish your CI setup

[Click here to finish setting up your workspace!](https://cloud.nx.app/connect/EJFczf4ba1)


## Generate a library

```sh
npx nx g @nx/js:lib packages/pkg1 --publishable --importPath=@my-org/pkg1
```

## Run tasks

To build the library use:

```sh
npx nx build pkg1
```

To run any task with Nx use:

```sh
npx nx <target> <project-name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Versioning and releasing

To version and release the library use

```
npx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)


[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
