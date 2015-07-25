FROM node:0.12.7

RUN \
  apt-get update && \
  apt-get install -y software-properties-common

RUN \
  apt-get install -y nginx && \
  rm -rf /var/lib/apt/lists/* && \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
  chown -R www-data:www-data /var/lib/nginx

COPY package.json /usr/src/app/package.json
WORKDIR /usr/src/app
RUN npm install
COPY . /usr/src/app


EXPOSE 3000

CMD ["npm","start"]
