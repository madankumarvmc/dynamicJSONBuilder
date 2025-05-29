FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build 

ENV NODE_ENV=production

EXPOSE 3000

ARG SHORT_SHA
ENV SHORT_SHA=$SHORT_SHA

CMD [ "node" , "dist/index.js"]