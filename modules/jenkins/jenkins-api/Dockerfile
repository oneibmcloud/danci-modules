FROM node:latest
RUN mkdir -p /script
COPY package.json /script
RUN cd /script && npm install
COPY . /script
EXPOSE 8080
CMD [ "node", "/script/main.js" ]
