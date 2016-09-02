FROM ubuntu:latest
COPY ./main.sh /script/
RUN chmod -R 755 /script/
RUN apt-get -y update
RUN apt-get -y install curl
RUN curl -L "https://cli.run.pivotal.io/stable?release=linux64-binary&source=github" | tar -zx
RUN mv cf /script/
CMD ["/script/main.sh"]
