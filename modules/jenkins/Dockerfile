FROM node:latest
RUN mkdir -p /script
RUN npm install -g jenkins
COPY main.js /script
CMD [ "node", "/script/main.js" ]
