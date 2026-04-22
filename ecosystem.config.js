module.exports = {
  apps: [
    {
      name: "jardin-tropical",
      script: "server.js",
      cwd: "/var/www/jardin-tropical",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
