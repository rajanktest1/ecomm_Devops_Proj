# ──────────────────────────────────────────────────────────────────────────────
#  ShopEase — Frontend Production Image  (multi-stage)
#  Build from project root:
#    docker build -f docker/frontend/Dockerfile -t shopease-frontend .
# ──────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build React app with Vite ────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ── Stage 2: Serve built assets with Nginx ────────────────────────────────────
FROM nginx:1.25-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Bake in the nginx config (docker-compose uses this; k8s overrides via ConfigMap)
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
