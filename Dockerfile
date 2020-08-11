FROM node:14-alpine

ARG SSH_PRV_KEY
ARG SSH_PUB_KEY

RUN apk add git openssh-client

RUN mkdir -p -m 0600 ~/.ssh && echo -e "-----BEGIN RSA PRIVATE KEY-----\n(...)-----END RSA PRIVATE KEY-----" >> ~/.ssh/id_rsa && chmod 400 ~/.ssh/id_rsa && ssh-keyscan github.com >> ~/.ssh/known_hosts
# Add the keys and set permissions
RUN echo "$SSH_PRV_KEY" > /root/.ssh/id_rsa && \
    echo "$SSH_PUB_KEY" > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub
    
RUN  echo "    IdentityFile ~/.ssh/id_rsa" >> /etc/ssh/ssh_config
# RUN ssh-agent sh -c 'echo $SSH_PRV_KEY | base64 -d | ssh-add -'
RUN npm install pm2@latest -g
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 1200
CMD ["pm2", "start", "index.js", "--name", "welcome-track-server" ]

