FROM node:alpine

EXPOSE 3000

RUN mkdir /app
WORKDIR /app

COPY yarn.lock .
RUN yarn --pure-lockfile

COPY . .
CMD ["node", "server.js"]
