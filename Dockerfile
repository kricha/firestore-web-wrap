FROM node:alpine as prod

WORKDIR /app

COPY . /app

RUN npm ci