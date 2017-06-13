FROM node:latest
MAINTAINER malaohu <tua@live.cn>
RUN apt-get clean all
RUN apt-get update
RUN apt-get -y install git
RUN git clone https://github.com/malaohu/Merge-Public-Hosts.git /app
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD npm start
