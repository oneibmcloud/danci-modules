FROM node:latest
COPY ./lc.sh /script/
RUN chmod -R 755 /script/
RUN npm install -g license-checker
CMD ["/script/lc.sh"]
CMD ["/script/parser.sh"]
