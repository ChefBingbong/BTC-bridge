FROM oven/bun:1.2.2 as build

WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile --prefer-offline --ignore-scripts

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN
RUN bun turbo build:bin --filter @oogabooga/router-api

FROM gcr.io/distroless/base-debian11
WORKDIR /app
COPY --from=build /app/apis/router/bin /app/bin

CMD [ "/app/bin" ]
