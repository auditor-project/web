# Build stage
FROM node:14-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Production stage
FROM node:14-alpine

WORKDIR /app

COPY --from=build /app/package.json /app/yarn.lock .RUN yarn install --frozen-lockfile --production

COPY --from=build /app/.next ./.next

EXPOSE 3000

CMD ["yarn", "start"]