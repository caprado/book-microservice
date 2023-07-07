FROM kong:latest
USER 0
RUN apt-get update; \
    apt-get -y upgrade; \
    apt-get install -y curl

SHELL ["/bin/bash", "-c"]
