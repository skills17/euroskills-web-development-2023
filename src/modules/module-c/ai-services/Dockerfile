FROM node:18-alpine

# Install supervisord
RUN apk add supervisor

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies for each node program
COPY chatterblast/package.json ./chatterblast/
COPY dreamweaver/package.json ./dreamweaver/
COPY mindreader/package.json ./mindreader/

RUN cd chatterblast && npm install
RUN cd dreamweaver && npm install
RUN cd mindreader && npm install

# Copy source code for each node program
COPY chatterblast ./chatterblast
COPY dreamweaver ./dreamweaver
COPY mindreader ./mindreader

# Copy supervisord config file
COPY supervisord.conf ./supervisord.conf

# Start supervisord
CMD ["/usr/bin/supervisord", "-c", "supervisord.conf"]
