FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /rekosu
WORKDIR /rekosu

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm dotenvx run -f .env.prod -- pnpm run build

FROM base
COPY --from=prod-deps /rekosu/node_modules /rekosu/node_modules
COPY --from=build /rekosu/.output /rekosu/.output

EXPOSE 3000

CMD ["pnpm", "dotenvx", "run", "-f", ".env.prod", "--", "pnpm", "start"]