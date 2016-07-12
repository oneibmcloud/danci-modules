FROM ubuntu:latest
COPY ./lc.sh /script/
RUN chmod -R 755 /script/
RUN apt-get update
RUN apt-get install nodejs npm -y
RUN npm install -g license-checker
CMD ["/script/lc.sh"]
