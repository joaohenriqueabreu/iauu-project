FROM node:14.16.0-alpine

RUN mkdir /usr/app && chown node:node /usr/app

WORKDIR /usr/app

RUN mkdir node_modules && chown node:node node_modules

COPY . .

RUN npm install --only=prod

EXPOSE 5555

CMD ["npm", "start"]
