FROM node:latest
COPY ./parser.sh /script/
COPY ./parser.js /script/
RUN chmod -R 755 /script/
RUN npm install -g license-checker
CMD ["/script/parser.sh"]
