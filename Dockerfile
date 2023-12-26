FROM node:18.17.1-alpine3.17

# set our node environment, either development or production
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# default to port 3000 for node
ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

CMD ["/bin/sh", "docker-entrypoint.sh"]
