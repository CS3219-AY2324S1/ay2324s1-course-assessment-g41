#!/bin/bash

# Check if a service name was provided
if [ $# -eq 0 ]; then
    echo "No arguments provided. Please specify a service name."
    exit 1
fi

SERVICE_NAME=$1
COMPOSE_FILE=docker-compose-dev.yml

# Stop and remove the specified service container
echo "Stopping and removing $SERVICE_NAME..."
docker-compose -f $COMPOSE_FILE rm -f -s -v $SERVICE_NAME

# Rebuild the specified service
echo "Rebuilding $SERVICE_NAME..."
docker-compose -f $COMPOSE_FILE build $SERVICE_NAME

# Start the service
echo "Starting $SERVICE_NAME..."
docker-compose -f $COMPOSE_FILE up -d $SERVICE_NAME

echo "$SERVICE_NAME has been rebuilt and restarted."
