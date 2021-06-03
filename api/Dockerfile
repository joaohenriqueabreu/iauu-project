# syntax=docker/dockerfile:1

FROM node:14.16.0-alpine

ARG service_path
ARG npm_config_user=root

RUN mkdir /usr/app && chown node:node /usr/app
RUN mkdir /usr/iauulib && chown node:node /usr/iauulib
RUN chmod 777 -R /usr/app
RUN chmod 777 -R /usr/iauulib 

WORKDIR /usr/iauulib
RUN mkdir node_modules && chown node:node node_modules
COPY ./lib .
RUN npm install --only=prod

WORKDIR /usr/app
RUN mkdir node_modules && chown node:node node_modules
COPY ${service_path} .
RUN npm install --only=prod

EXPOSE 4444 5555 5556 9999

CMD ["npm", "start"]
