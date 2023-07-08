FROM node:20.3.1-alpine3.17 AS builder
WORKDIR /app
COPY . /app
RUN npm install \
    && npm run build

FROM node:20.3.1-alpine3.17
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/images /app/images
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json
RUN npm install --omit dev
CMD ["npm", "start"]
