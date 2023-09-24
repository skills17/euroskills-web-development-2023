FROM node:20.3.1-alpine3.17 AS builder
WORKDIR /app
COPY . /app
RUN npm install
ENTRYPOINT ["npm", "run"]
