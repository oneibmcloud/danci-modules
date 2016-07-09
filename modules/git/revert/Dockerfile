FROM ubuntu:latest
COPY ./revert.sh /script/
RUN chmod -R 755 /script/
RUN apt-get update
RUN apt-get -y install git
CMD ["/script/revert.sh"]
