FROM node:latest
COPY ./lint.sh /script/
RUN chmod -R 755 /script/
RUN npm install -g jshint
CMD ["/script/lint.sh"]
