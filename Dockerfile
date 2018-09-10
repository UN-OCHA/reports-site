FROM unocha/nodejs:8.11.3

ENV CTF_SPACE_ID=0123456789ab \
    CTF_CDA_ACCESS_TOKEN=0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqr

WORKDIR /srv/www

COPY . .

RUN apk add -U ncurses && \
    npm install && \
    npm run-script build && \
    mv run_node /etc/services.d/node/run

