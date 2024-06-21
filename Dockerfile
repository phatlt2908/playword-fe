FROM node:20-alpine as base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
RUN npm ci

EXPOSE 3000

CMD npm start