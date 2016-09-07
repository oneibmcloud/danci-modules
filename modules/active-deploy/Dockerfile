FROM node:latest
RUN mkdir /script/
RUN curl -L "https://cli.run.pivotal.io/stable?release=linux64-binary&source=github" | tar -zx
RUN mv cf /script/
RUN /script/cf add-plugin-repo bluemix http://plugins.ng.bluemix.net && /script/cf install-plugin active-deploy -f -r bluemix
RUN cd /script && npm install yamljs && npm install fs
COPY ./main.js /script/
RUN chmod -R 755 /script/
CMD [ "node", "/script/main.js" ]
