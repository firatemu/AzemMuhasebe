# Stage 1 — builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — runner
FROM node:20-alpine AS runner
WORKDIR /app

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/dist-local ./dist-local
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

USER appuser

EXPOSE 3020
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -q --spider http://localhost:3020/health || exit 1

LABEL org.opencontainers.image.source="https://github.com/firatemu/otomuhasebe"
LABEL org.opencontainers.image.description="Oto Muhasebe API"
LABEL org.opencontainers.image.licenses="UNLICENSED"

CMD ["node", "dist-local/main.js"]
