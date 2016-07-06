FROM ubuntu:latest
COPY ./node.sh /script/
RUN chmod -R 755 /script/
RUN apt-get update && apt-get -y install build-essential curl npm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | NVM_DIR=/script/nvm bash
# RUN . /script/nvm/nvm.sh && nvm install 4 && nvm install 5 && nvm alias 5 $(nvm current) && nvm install 6 && nvm alias 6 $(nvm current)
CMD ["/script/node.sh"]
