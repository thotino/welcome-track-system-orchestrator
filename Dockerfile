# FROM ubuntu:latest

# ENV DEBIAN_FRONTEND=noninteractive
# # ENV TZ=Europe/Paris

# # RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# RUN apt-get update
# RUN apt-get install -y git openssh-client
# RUN apt-get install -y nodejs npm
# ARG SSH_PRIVATE_KEY

# RUN mkdir ~/.ssh/
# RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa

# RUN touch /root/.ssh/known_hosts

# RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

# WORKDIR /usr/src/app

# # RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
# # RUN ssh-agent sh -c 'echo $SSH_KEY | base64 -d | ssh-add -'

# RUN npm install pm2@latest

# COPY package*.json ./

# RUN npm install




FROM node:14-alpine
ARG SSH_KEY
RUN apk add git openssh-client

RUN mkdir -p -m 0600 ~/.ssh && echo -e "-----BEGIN RSA PRIVATE KEY-----\n(...)-----END RSA PRIVATE KEY-----" >> ~/.ssh/id_rsa && chmod 400 ~/.ssh/id_rsa && ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN ssh-agent sh -c 'echo $SSH_KEY | base64 -d | ssh-add -'
RUN npm install npm@latest -g
COPY package.json ./

RUN npm install
COPY . .

EXPOSE 1200
CMD ["pm2", "start", "index.js", "--name", "welcome-track-server" ]

