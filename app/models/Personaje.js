module.exports = (sequelize, Sequelize) => {
  const Personaje = sequelize.define("Personaje", {
  // Define attributes  
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
            msg: `The character's name is already registered`
    },
    isAlpha: {
        msg: 'The name only allow alpha characters'
    }
  },
  imagen: {
    type: Sequelize.STRING(700),
    allowNull: false
  },
  edad: {
    type: Sequelize.INTEGER,
    allowNull: false,
    isNumeric: {
      msg: 'Only numbers are allowed'
    },
    max: 90,                  // only allow values <= 23
    min: 10,
  },
  peso: {
    type: Sequelize.INTEGER,
    allowNull: false,
    isNumeric: {
      msg: 'Only numbers are allowed'
    },
    max: 200,                  // only allow values <= 23
    min: 10,
  },
  historia: {
    type: Sequelize.TEXT,
    allowNull: false
  }
},{
  timestamps: false
});
return Personaje;
};