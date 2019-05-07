module.exports = {
  apps : [{
    name: 'dsr-nuxt',
    script: './node_modules/.bin/nuxt-start',
    instances: 1,
    cwd: '/srv/www',
    autorestart: true,
    exec_mode : 'cluster'
  }],
};
