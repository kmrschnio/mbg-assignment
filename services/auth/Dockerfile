FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
COPY packages/shared ./packages/shared
COPY services/auth ./services/auth
RUN npm install --workspace=@trading/auth --workspace=@trading/shared
RUN npm run build -w @trading/shared && npm run build -w @trading/auth

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/services/auth/dist ./dist
COPY --from=builder /app/services/auth/package.json ./package.json
EXPOSE 3004
CMD ["node", "dist/index.js"]
