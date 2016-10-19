FROM alpine:latest
COPY ./main.sh /script/
COPY ./certs.tar.gz.enc /certs/
RUN chmod -R 755 /script/
RUN apk update && apk upgrade && \
    apk add --no-cache bash openssl curl
RUN curl -L "https://cli.run.pivotal.io/stable?release=linux64-binary&source=github" | tar -zx
RUN mv cf /script
ENV CF_PLUGIN_HOME=/script
RUN /script/cf install-plugin -f https://static-ice.ng.bluemix.net/ibm-containers-linux_x86
CMD ["/script/main.sh"]
