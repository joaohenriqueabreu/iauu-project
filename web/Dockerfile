FROM node:12.18.3-alpine

RUN mkdir /usr/app && chown node:node /usr/app

WORKDIR /usr/app

RUN mkdir node_modules && chown node:node node_modules

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

ENV HOST 0.0.0.0

CMD ["npm", "start"]