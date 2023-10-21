FROM node:18.17.0-alpine

WORKDIR /app

COPY package.json tsconfig.json .env* ./
COPY src ./src

RUN npm install
RUN npm i -g typescript

ENV NODE_ENV=production

CMD ["npm", "run", "start"]