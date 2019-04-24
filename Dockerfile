FROM unocha/nodejs:8.11.3

ENV BASIC_AUTH_USER=hi \
    BASIC_AUTH_PASS=bye

WORKDIR /srv/www

COPY . .

RUN yarn install && \
    yarn run build && \
    mv run_node /etc/services.d/node/run
