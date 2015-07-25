FROM node:0.12.7

# Set up ubuntu's apt
RUN \
  apt-get update && \
  apt-get install -y software-properties-common

# Install nginx
RUN \
  apt-get install -y nginx

# Copy package.json first, install all npm packages, then copy in the source. This means the docker container only needs to rebuild
COPY package.json /usr/src/app/package.json
WORKDIR /usr/src/app
RUN npm install
COPY . /usr/src/app


EXPOSE 8080

CMD ["npm", "start"]
