FROM node:lts AS node

RUN mkdir -p /opt/src/app

COPY . /opt/src/app

WORKDIR /opt/src/app

RUN npm install -g @angular/cli@16

RUN npm run build

FROM nginx:alpine

COPY --from=node /opt/src/app/dist/wordcloud-front-end /usr/share/nginx/html

EXPOSE 80