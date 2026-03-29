# ──────────────────────────────────────────────────────────────────────────────
#  ShopEase — Backend Production Image
#  Build from project root:
#    docker build -f docker/backend/Dockerfile -t shopease-backend .
# ──────────────────────────────────────────────────────────────────────────────
FROM node:22-alpine

# dumb-init ensures SIGTERM is forwarded correctly to Node (clean shutdown)
RUN apk add --no-cache dumb-init

WORKDIR /app

# Install production dependencies only
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY backend/src ./src

# SQLite data directory — mount a PersistentVolumeClaim here in Kubernetes
VOLUME ["/data"]

EXPOSE 3001

ENV NODE_ENV=production \
    PORT=3001

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
