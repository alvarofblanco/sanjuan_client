FROM node:14.3.0-alpine3.10

WORKDIR /client

COPY package*.json /client/

RUN npm install

COPY . /client/

ENV PORT 3002
ENV GOOGLE_MAPS_API_KEY API_KEY
ENV NODE_ENV test

EXPOSE 3002

CMD [ "npm", "start" ]
