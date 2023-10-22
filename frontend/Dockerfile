# Build stage
FROM node:alpine as builder
WORKDIR /app
COPY ./package.json ./yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Runtime stage
FROM node:alpine
WORKDIR /app
COPY --from=builder /app .
COPY --from=builder /app/package.json ./
RUN yarn install --production
ENV NODE_ENV production
EXPOSE 3000
CMD ["yarn", "start"]