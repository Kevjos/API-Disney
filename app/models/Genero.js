module.exports = (sequelize, Sequelize) => {
  const Genero = sequelize.define("Genero", {
  // Define attributes
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
            msg: 'The title of the genre is already registered'
    },
    validate: {        
        len: {
          args: [2, 255],
          msg: "The name must be at least two characters"
        }
      },    
  },
  imagen: {
    type: Sequelize.STRING(700),
    allowNull: false,
  }
}, {
  timestamps: false
});

return Genero;
};