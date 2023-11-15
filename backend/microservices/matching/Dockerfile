FROM node:lts

# Set the working directory
WORKDIR /home/microservices/matching

# Copy the shared and microservices directories
COPY shared ../../shared
COPY microservices/matching ./
COPY ../key.json ./

# Install dependencies for the shared directory
RUN cd ../../shared && npm ci && cd ../microservices/matching
# Install dependencies for the microservice
RUN npm ci

# Start your application
CMD [ "npm", "run", "start"]
