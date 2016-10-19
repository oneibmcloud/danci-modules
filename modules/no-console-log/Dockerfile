FROM alpine:latest
COPY ./main.sh /script/
RUN chmod -R 755 /script/
RUN apk update && apk upgrade && \
    apk add --no-cache bash git
CMD ["/script/main.sh"]
