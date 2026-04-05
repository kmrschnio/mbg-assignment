FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
COPY packages/shared ./packages/shared
COPY services/history-api ./services/history-api
RUN npm install --workspace=@trading/history-api --workspace=@trading/shared
RUN npm run build -w @trading/shared && npm run build -w @trading/history-api

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/services/history-api/dist ./dist
COPY --from=builder /app/services/history-api/package.json ./package.json
EXPOSE 3002
CMD ["node", "dist/index.js"]
