FROM node:lts-slim AS build
ENV NODE_ENV=production

WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:lts-slim
COPY --from=build /app/package*.json .
COPY --from=build /app/build /build
CMD [ "npm", "run", "start" ]
