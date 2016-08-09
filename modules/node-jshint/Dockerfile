FROM node:latest
RUN mkdir -p /script
RUN cd /script && npm install node-jshint
COPY main.sh /script
CMD ["/script/lint.sh"]
