FROM node:latest
RUN mkdir -p /script
RUN cd /script && npm install amqplib && npm install express
COPY . /script
CMD [ "node", "/script/main.js" ]
