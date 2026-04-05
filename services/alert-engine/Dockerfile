FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
COPY packages/shared ./packages/shared
COPY services/alert-engine ./services/alert-engine
RUN npm install --workspace=@trading/alert-engine --workspace=@trading/shared
RUN npm run build -w @trading/shared && npm run build -w @trading/alert-engine

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/services/alert-engine/dist ./dist
COPY --from=builder /app/services/alert-engine/package.json ./package.json
EXPOSE 3003
CMD ["node", "dist/index.js"]
