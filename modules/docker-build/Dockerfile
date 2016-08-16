FROM centos:latest
RUN yum -yqq update
RUN curl -fsSL https://get.docker.com/ | sh
#connect to docker host...
COPY ./main.sh /script/
RUN chmod -R 755 /script/
CMD [ "/script/main.sh" ]
