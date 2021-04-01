FROM node:12.18.3-alpine

RUN apk update
RUN mkdir /usr/app && chown node:node /usr/app

WORKDIR /usr/app

RUN mkdir node_modules && chown node:node node_modules

<<<<<<< HEAD
COPY ./.env.production .env
# COPY package.json .
=======
>>>>>>> b09b34670d90a362efd2f8e98ed73830bbdd7b0f
COPY . .

RUN apk add bash
RUN apk add python
RUN npm install
RUN npm run build --max-old-space-size=800

EXPOSE 3000

ENV HOST 0.0.0.0

CMD ["npm", "start"]
