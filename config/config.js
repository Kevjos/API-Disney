module.exports = {  
  APP_HOST: "http://localhost",
  APP_STORAGE: "/storage/imgs/",
  PORT: 3000,
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "apidisney",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};