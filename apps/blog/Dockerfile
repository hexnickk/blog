# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY ./package.json package-lock.json /app/
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM caddy:2-alpine
COPY --from=builder /app/build/client /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 3000
