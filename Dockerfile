FROM REPOSITORY/node16:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

RUN npm install
RUN npm init -y
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY package*.json ./

EXPOSE 5000
CMD [ "node", "server.js" ]