FROM node:17-alpine3.14

WORKDIR /app/final-api

COPY package.json ./

RUN yarn install

EXPOSE 5000

COPY . .

CMD ["yarn", "start"]