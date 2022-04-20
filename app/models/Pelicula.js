module.exports = (sequelize, Sequelize) => {
  const Pelicula = sequelize.define("Pelicula", {
  // Define attributes  
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: {
        msg: 'The title of the film is already registered'
    },
    isAlphanumeric: {
        msg: 'The title only allow alphanumeric characters'
    }
  },
  imagen: {
    type: Sequelize.STRING(700),
    allowNull: false
  },
  fechaCreacion: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    isDate: true,
    isBefore: "2022-04-16",
  },
  calificacion: {
    type: Sequelize.ENUM("1", "2","3","4","5"),
    allowNull: false,
    isIn: {
      args: [['1', '2', '3', '4', '5']],
      msg: "Must have values ​​between 1 and 5"
    }
  },
  tipo: {
    type: Sequelize.ENUM("Película", "Serie"),
    allowNull: false,
  }
}, {
  timestamps: false
});

return Pelicula;
};