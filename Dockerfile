# Install dependencies only when needed
FROM node:16.13-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json *.lock ./
RUN yarn install --frozen-lockfile --network-timeout 500000000


# Rebuild the source code only when needed
FROM deps AS builder
WORKDIR /app
COPY . .
ARG REACT_APP_PUBLIC_URL
ARG REACT_APP_API_BASE_URL
RUN yarn build


# Production image, copy all the files and run next
FROM nginx AS release
COPY --from=builder /app/build /react
