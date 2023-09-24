# build the app
FROM node:18.17.0-alpine3.17 AS builder

COPY . /app
WORKDIR /app

RUN \
  npm install \
  && npm run build

# run the app
FROM node:18.17.0-alpine3.17

COPY --from=builder /app/src/static /app/build/static
COPY --from=builder /app/src/views /app/build/views
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app
COPY --from=builder /app/package-lock.json /app

WORKDIR /app

RUN npm install --omit=dev

ENTRYPOINT [ "npm", "start" ]
