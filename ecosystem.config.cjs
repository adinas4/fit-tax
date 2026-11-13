// PM2 process manager config for FIT-TAX Cakrawala Sinergi (Hostinger VPS).
//
// Usage:
//   pm2 start ecosystem.config.cjs --env production
//   pm2 save                # persist process list across reboots
//   pm2 startup             # generate the system boot script (run once)
//
// After a redeploy:
//   pm2 restart fittax
//
// Logs:
//   pm2 logs fittax --lines 100
//
// This file is plain CommonJS so it runs under Node without a build step.

/** @type {import('pm2').EcosystemConfig} */
module.exports = {
  apps: [
    {
      name: "fittax",
      // The standalone server produced by `next build`.
      script: ".next/standalone/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // .env is loaded automatically by Next.js at runtime; PM2 does not need
      // to inline every variable here. Keep PORT + NODE_ENV for clarity.
      env_file: ".env",
      out_file: "./logs/pm2-out.log",
      error_file: "./logs/pm2-error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
