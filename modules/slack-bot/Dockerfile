FROM node:latest
RUN mkdir -p /script
RUN cd /script && npm install slack-node
COPY main.js /script
CMD [ "node", "/script/main.js" ]
