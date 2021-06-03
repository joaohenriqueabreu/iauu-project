# syntax=docker/dockerfile:1

FROM node:14.16.0-alpine

ARG service_path
ARG npm_config_user=root

# General permission configs
RUN mkdir /usr/app && chown node:node /usr/app
RUN mkdir /var/lib/iauu && chown node:node /var/lib/iauu
# RUN mkdir /usr/iauulib && chown node:node /usr/iauulib


# WORKDIR /usr/iauulib
# RUN mkdir node_modules && chown node:node node_modules
# COPY ./lib .
# RUN npm install

WORKDIR /var/lib/iauu
RUN mkdir node_modules && chown node:node node_modules
COPY ./lib .
RUN npm install

WORKDIR /usr/app
RUN mkdir node_modules && chown node:node node_modules
COPY ${service_path} .
RUN npm install

EXPOSE 4444 5555 5556 9999 587

CMD ["npm", "start"]
