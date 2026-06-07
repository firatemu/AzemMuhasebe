module.exports = {
  apps: [{
    name: 'muhasebe-landing',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3006',
    cwd: '/var/www/muhasebe-landing',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3006,
    },
    error_file: '/var/log/muhasebe/landing/error.log',
    out_file: '/var/log/muhasebe/landing/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};

