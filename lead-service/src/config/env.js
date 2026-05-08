import "dotenv/config"

const config = Object.freeze({
  port: process.env.PORT || 8082,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV || 'development'
});


if (!config.mongoURI || !config.jwtSecret) {
  console.error("FATAL: MONGO_URI or JWT_SECRET is not defined in environment variables!");
  process.exit(1);
}

export default config;