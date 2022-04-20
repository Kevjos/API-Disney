const dbConfig = require("../../config/config.js");
const Sequelize = require("sequelize");
//require('../database/asociations');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.personajes = require("./Personaje.js")(sequelize, Sequelize);
db.peliculas = require("./Pelicula.js")(sequelize, Sequelize);
db.generos = require("./Genero.js")(sequelize, Sequelize);
db.user = require("./User.js")(sequelize, Sequelize);

db.generos.hasMany(db.peliculas, {  
    foreignKey: 'generoId',
    allowNull: false
});

db.peliculas.belongsTo(db.generos, {
    foreignKey: 'generoId',
    allowNull: false
});

db.personajes.belongsToMany(db.peliculas, { 
  through: 'PersonajesPeliculas',
  foreignKey: 'personajeId',
  otherKey: 'peliculaId',
  allowNull: false
});

db.peliculas.belongsToMany(db.personajes, { 
  through: 'PersonajesPeliculas',
  foreignKey: 'peliculaId',
  otherKey: 'personajeId',
  allowNull: false
});

module.exports = db;
/*'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../../config/database');
const db = {};

// Creamos nuestra conexión
let sequelize = new Sequelize(config.database, config.username, config.password, config);

// Asociaciones y vinculaciones
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
*/