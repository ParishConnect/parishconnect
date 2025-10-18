# Contributing to ParishConnect Widget

## Monorepo Structure

This project uses a Bun workspace monorepo with the following packages:

```
packages/
├── schema/              # Zod schemas and types
├── rrule-converter/     # JSON-LD <-> RRule conversions
└── widget/              # React widget application
```

## Prerequisites

- [Bun](https://bun.sh/) v1.3.0 or later

## Getting Started

1. Install dependencies:
```bash
bun install
```

2. Start the development server:
```bash
bun run dev
```

3. Build all packages:
```bash
bun run build
```

4. Lint all packages:
```bash
bun run lint
```

## Package-Specific Commands

### Schema Package
```bash
cd packages/schema
bun run build  # Type-check with TypeScript
bun run lint   # Lint with oxlint
```

### RRule Converter Package
```bash
cd packages/rrule-converter
bun run build  # Type-check with TypeScript
bun run lint   # Lint with oxlint
```

### Widget Package
```bash
cd packages/widget
bun run dev      # Start Vite dev server
bun run build    # Build for production
bun run preview  # Preview production build
bun run lint     # Lint with oxlint
```

## Making Changes

### Adding Dependencies

#### To a specific package:
```bash
cd packages/[package-name]
bun add [package-name]
```

#### Cross-package dependencies:
When one package needs to depend on another, use the `workspace:*` protocol in package.json:

```json
{
  "dependencies": {
    "@parishconnect/schema": "workspace:*"
  }
}
```

### Package Dependency Graph

```
@parishconnect/widget
    ├── @parishconnect/rrule-converter
    │   └── @parishconnect/schema
    └── @parishconnect/schema
```

## Testing

Currently, there are no automated tests. When adding tests:
- Place unit tests next to the source files with `.test.ts` extension
- Use `bun test` for running tests

## Code Style

- TypeScript with strict mode enabled
- Linting with oxlint
- Use existing code formatting conventions

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `bun run lint` to ensure code quality
5. Run `bun run build` to ensure everything builds
6. Submit a pull request

## Questions?

Open an issue or discussion on GitHub.
