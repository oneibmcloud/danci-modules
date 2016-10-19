FROM alpine:latest
COPY ./main.sh /script/
COPY ./certs.tar.gz.enc /certs/
RUN chmod -R 755 /script/
RUN apk update && apk upgrade && \
    apk add --no-cache bash docker openssl
CMD ["/script/main.sh"]
