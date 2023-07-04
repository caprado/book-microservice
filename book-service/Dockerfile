# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all other source code to work directory
COPY . /app

# Start the server
CMD ["node", "server.js"]
