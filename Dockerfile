FROM node:15.1.0-alpine as builder

WORKDIR /build

COPY package.json package-lock.json
RUN npm install
RUN npm build

FROM node:15.1.0-alpine

WORKDIR /app
COPY --from=builder /build/dist/ ./
