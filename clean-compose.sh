#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <path-to-docker-compose-file>"
  exit 1
fi

COMPOSE_FILE=$1

docker-compose -f "$COMPOSE_FILE" down -v --rmi all

docker-compose -f "$COMPOSE_FILE" build --no-cache
docker-compose -f "$COMPOSE_FILE" up -d