FROM node:latest
RUN mkdir -p /script
RUN cd /script && npm install randomcolor && npm install license-checker
COPY main.js /script
CMD [ "node", "/script/main.js" ]
