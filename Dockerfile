FROM ubuntu as intermediate

RUN apt-get update
RUN apt-get install -y git nodejs

ARG SSH_PRIVATE_KEY

RUN mkdir ~/.ssh/
RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa

RUN touch /root/.ssh/known_hosts

RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install pm2@latest
RUN npm install

COPY . .

EXPOSE 1200

CMD ["pm2", "start", "index.js", "--name", "welcome-track-server" ]
