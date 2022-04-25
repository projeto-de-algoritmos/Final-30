FROM node:17-alpine3.14

WORKDIR /app/final-front

COPY package.json ./

RUN yarn install

EXPOSE 3000

COPY . .

CMD ["yarn", "start"]