FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY services/market-data ./services/market-data
RUN npm install --workspace=@trading/market-data --workspace=@trading/shared
RUN npm run build -w @trading/shared && npm run build -w @trading/market-data

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/services/market-data/dist ./dist
COPY --from=builder /app/services/market-data/package.json ./package.json
EXPOSE 3001
CMD ["node", "dist/index.js"]
