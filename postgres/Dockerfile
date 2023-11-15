FROM postgres:alpine

ADD migrations /docker-entrypoint-initdb.d/

RUN chmod a+r /docker-entrypoint-initdb.d/*

# FROM postgres:alpine

# VOLUME /docker-entrypoint-initdb.d

# COPY migrations /docker-entrypoint-initdb.d/

# RUN chmod a+r /docker-entrypoint-initdb.d/*
