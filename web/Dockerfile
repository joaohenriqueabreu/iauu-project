FROM node:12.18.0

RUN mkdir /usr/app && chown node:node /usr/app

WORKDIR /usr/app

# RUN npm install -g nodemon
RUN mkdir node_modules && chown node:node node_modules

COPY ./.env.production .env
COPY package.json .

RUN npm install

EXPOSE 3333

ENV HOST 0.0.0.0

CMD ["npm", "run", "dev"]
