FROM node:latest
MAINTAINER malaohu <tua@live.cn>
RUN apt-get clean all
RUN apt-get update
RUN apt-get -y install git
RUN git clone https://github.com/malaohu/Arukas-API.git /Arukas-API
RUN npm install
EXPOSE 13999
CMD npm start
