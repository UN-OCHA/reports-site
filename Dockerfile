FROM unocha/nodejs:8.11.3

ENV CTF_HOST=cdn.contentful.com \
    CTF_SPACE_ID=123456 \
    CTF_ENVIRONMENT=master \
    CTF_CDA_ACCESS_TOKEN=1234567890 \
    BASE_URL=http://dev.dsr.local \
    BASIC_AUTH_USER=hi \
    BASIC_AUTH_PASS=bye

WORKDIR /srv/www

COPY . .

RUN yarn install && \
    yarn run build && \
    mv run_node /etc/services.d/node/run
