FROM node:14.16.0-alpine

WORKDIR /usr/lib

COPY package.json .

RUN mkdir node_modules && chown node:node node_modules

RUN npm install --only=prod