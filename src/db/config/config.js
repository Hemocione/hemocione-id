require("dotenv").config();

module.exports = {
  local: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    timezone: "America/Sao_Paulo",
  },
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      useUTC: false,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    timezone: "America/Sao_Paulo",
    pool: {
      min: 0,
      max: 1,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      useUTC: false,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    timezone: "America/Sao_Paulo",
    pool: {
      min: 1,
      max: 10,
      acquire: 30000,
      idle: 10000,
    },
  },
};
