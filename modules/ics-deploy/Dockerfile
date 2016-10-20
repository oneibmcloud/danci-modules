FROM alpine:latest
COPY ./main.sh /script/
RUN apk update && apk upgrade && \
    apk add --no-cache bash curl docker python python-dev
RUN curl -L "https://cli.run.pivotal.io/stable?release=linux64-binary&source=github" | tar -zx
RUN mv cf /script
ENV CF_PLUGIN_HOME=/script
RUN /script/cf install-plugin -f https://static-ice.ng.bluemix.net/ibm-containers-linux_x86
CMD ["/script/main.sh"]
