require('dotenv').config();
console.log('coco')
console.log(process.env.ENV)
module.exports = { 
  local: {
    use_env_variable: 'DATABASE_URL',
    dialect: "postgres",
    timezone: 'America/Sao_Paulo'
  },
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: "postgres",
    "dialectOptions": {
      useUTC: false,
      "ssl": {
        require: true,
        rejectUnauthorized: false
      }
    },
    timezone: 'America/Sao_Paulo'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: "postgres",
    "dialectOptions": {
      useUTC: false,
      "ssl": {
        require: true,
        rejectUnauthorized: false
      },
    },
    timezone: 'America/Sao_Paulo'
  }
}
