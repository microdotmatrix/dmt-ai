# Next.js 15 Base Template

This is a base template for Next.js 15.4 (Canary) with Shadcn UI and Tailwind CSS.
Built with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app), scaffolded with [shadcn-cli](https://ui.shadcn.com/docs/installation); light/dark theme handling by [next-themes](https://github.com/vercel/next-themes), with a custom color scheme generated using [tweakcn](https://tweakcn.com/).

## Database

Project is scaffolded with [Drizzle ORM](https://orm.drizzle.team/), [NeonDB Serverless](https://neon.tech/), and [PostgreSQL](https://www.postgresql.org/).

## Components

Custom components used in most of my Next.js projects to reduce boilerplate.

- Context Provider
- Theme Toggle
- Loading Swap
- Action Button with Confirmation Dialog
- Image loader with fallback and placeholder
- Scroll to top button
- Toast notifications
- Viewport breakpoint indicator (dev mode only)
- Icon component made with [@iconify/react](https://iconify.design/)
- Custom hooks
- Metadata config object

## Usage

### Installation

```bash
git clone https://github.com/microdotmatrix/nextjs-15-base-template.git <project-name>
cd <project-name>
bun install
```

### Environment variables

```bash
# Copy .env.example to .env
# Fill in the values
```

### Development

```bash
bun run dev
```

### Production

```bash
bun run build
bun run start
```

### Database

```bash
# Generate schema
bun run db:generate
# Migrate
bun run db:migrate
# Push schema to database
bun run db:push
# Drizzle Studio
bun run db:studio
```

## TODO

- [ ] Add authentication with BetterAuth
- [ ] Advanced data access layer & client side data/state management with ReactQuery or SWR
