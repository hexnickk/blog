# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_HOST_URL
ENV VITE_HOST_URL=$VITE_HOST_URL
COPY ./package.json package-lock.json /app/
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM caddy:2-alpine
COPY --from=builder /app/build/client /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
