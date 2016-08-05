FROM node:latest
RUN mkdir -p /script
RUN cd /script && npm install amqplib
COPY . /script
CMD [ "node", "/script/main.js" ]
