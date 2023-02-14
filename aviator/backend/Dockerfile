FROM 112140968541.dkr.ecr.eu-west-2.amazonaws.com/node16:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY aviator/backend/package-lock.json aviator/backend/package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY aviator/backend/ .

EXPOSE 5000
CMD [ "node", "server.js" ]