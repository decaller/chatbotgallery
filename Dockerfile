# ==============================================================================
# STAGE 1: Build Frontend and SSR Server
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install build prerequisites
RUN apk add --no-cache libc6-compat

# Install dependencies
COPY chatbotgallery/package*.json ./chatbotgallery/
RUN cd chatbotgallery && npm ci

# Copy source code and build app
COPY chatbotgallery ./chatbotgallery
RUN cd chatbotgallery && npm run build

# ==============================================================================
# STAGE 2: Production Runner
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Install runtime utilities (wget for healthcheck)
RUN apk add --no-cache libc6-compat wget

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=file:/app/data/local.db
ENV AUTO_SEED=true

# Copy built application, source context, and node modules
COPY --from=builder /app/chatbotgallery/package*.json ./chatbotgallery/
COPY --from=builder /app/chatbotgallery/node_modules ./chatbotgallery/node_modules
COPY --from=builder /app/chatbotgallery/dist ./chatbotgallery/dist
COPY --from=builder /app/chatbotgallery/src ./chatbotgallery/src
COPY --from=builder /app/chatbotgallery/vite.config.ts ./chatbotgallery/
COPY --from=builder /app/chatbotgallery/tsconfig.json ./chatbotgallery/
COPY --from=builder /app/chatbotgallery/components.json ./chatbotgallery/

# Copy database seeder and sample bots metadata
COPY sample_bots.json ./sample_bots.json
COPY sample-bots ./sample-bots
COPY seed_bots.mjs ./seed_bots.mjs
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh && mkdir -p /app/data

VOLUME ["/app/data"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

ENTRYPOINT ["/app/docker-entrypoint.sh"]
