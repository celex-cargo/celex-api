module.exports = {
  apps: [{
    name: 'celex-api',
    cwd: '/var/www/celex-api',
    script: 'dist/main.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: { NODE_ENV: 'development', PORT: 5000 },
    env_production: { NODE_ENV: 'production', PORT: 5000 },
    error_file: '/var/log/celex-api/err.log',
    out_file: '/var/log/celex-api/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
}

