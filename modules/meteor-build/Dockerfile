FROM node:4.5
RUN mkdir -p /script
RUN curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh
COPY main.sh /script
CMD [ "/script/main.sh" ]
