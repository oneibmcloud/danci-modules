FROM ubuntu:latest
COPY ./main.sh /script/
RUN chmod -R 755 /script/
RUN apt-get -y update
RUN apt-get -y install curl
RUN curl -L "https://cli.run.pivotal.io/stable?release=linux64-binary&source=github" | tar -zx
RUN mv cf /script/
RUN /script/cf add-plugin-repo bluemix http://plugins.ng.bluemix.net
RUN /script/cf install-plugin active-deploy -f -r bluemix
CMD ["/script/main.sh"]
