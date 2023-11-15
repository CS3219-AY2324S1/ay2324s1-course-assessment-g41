FROM node:lts

# Set the working directory
WORKDIR /home/microservices/document

# Copy the shared and microservices directories
COPY shared ../../shared
COPY microservices/document ./
COPY ../key.json ./

# Install dependencies for the shared directory
RUN cd ../../shared && npm ci && cd ../microservices/document
# Install dependencies for the microservice
RUN npm ci

# Start your application
CMD [ "npm", "run", "dev"]
