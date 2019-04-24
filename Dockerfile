FROM unocha/nodejs:8.11.3

ENV BASIC_AUTH_USER=hi \
    BASIC_AUTH_PASS=bye

WORKDIR /srv/www

COPY . .

RUN apk add -U \
        ncurses \
        gettext \
        rsync && \
    envsubst < ${CFG_FILE}.tmpl > ${CFG_FILE} && \
    yarn install && \
    yarn run build && \
    rm -f ${CFG_FILE} && \
    mv run_node /etc/services.d/node/run
