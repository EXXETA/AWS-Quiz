FROM alpine:latest

RUN apk update && apk add bash

RUN apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --upgrade pip \
    && pip3 install --no-cache-dir \
        awscli \
    && rm -rf /var/cache/apk/*

RUN apk add nodejs npm
RUN apk add jq

RUN adduser -S worker
RUN mkdir -p /home/worker

WORKDIR /home/worker
COPY start.sh /home/worker/start.sh
COPY functions.sh /home/worker/functions.sh
COPY bootstrap.sh /home/worker/bootstrap.sh
ADD app /home/worker/app
ADD lambda /home/worker/lambda
RUN chown -R worker /home/worker/*
USER worker

RUN /bin/bash bootstrap.sh

ENTRYPOINT /bin/bash start.sh
