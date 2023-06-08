FROM node:18-alpine3.17 AS build
WORKDIR /botBuild
ENV NODE_ENV=production
COPY . .
RUN npm install -g typescript
RUN npm ci --omit=dev
RUN npm run build:production


FROM node:18-alpine3.17
ENV NODE_ENV=production
WORKDIR /bot
COPY --from=build ./botBuild/build ./build
COPY --from=build ./botBuild/media ./media
COPY --from=build ./botBuild/parentGroup.txt .
CMD [ "node", "build/server.js" ]

