FROM node:16.15.1-alpine

WORKDIR /app/server

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install -g dotenv-cli
RUN npm i -g prisma
RUN npm install

COPY ./ ./

ENV DATABASE_URL=
ENV PORT=
ENV HOST=

RUN rm -rf ./dist || true
RUN prisma generate
RUN npm run build

CMD ["npm", "run", "start:prod"]
