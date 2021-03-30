module.exports = {
  apps: [
    {
      name: 'iauu-api',
      exec_mode: 'cluster',
      instances: 'max',
      script: 'npm',
      args: 'start'
    }
  ]
}