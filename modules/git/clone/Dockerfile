FROM ubuntu:latest
COPY ./clone.sh /script/
RUN chmod -R 755 /script/
RUN apt-get update
RUN apt-get -y install git
CMD ["/script/clone.sh"]
