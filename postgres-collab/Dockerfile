FROM postgres:alpine

ADD migrations /docker-entrypoint-initdb.d/

RUN chmod a+r /docker-entrypoint-initdb.d/*