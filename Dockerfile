FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y ntp

RUN ntpd -gq
RUN service ntp start
WORKDIR /usr/src/app



# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app


EXPOSE 12000
CMD [ "npm", "start" ]
