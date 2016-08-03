FROM node:latest
RUN mkdir -p /script
RUN cd /script && npm install sendgrid-nodejs
COPY main.js /script
CMD [ "node", "/script/main.js" ]
