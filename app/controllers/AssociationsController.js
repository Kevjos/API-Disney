const db = require("../models");
const appConfig = require("../../config/config.js");
const Op = db.Sequelize.Op;
const Pelicula = db.peliculas;
const Genero = db.generos;
const Personaje = db.personajes;

//Assign character to movie

exports.assignCharacterToMovie = (req, res) => {
  
  const idPelicula = req.body.idPelicula;
  const idPersonaje = req.body.idPersonaje;

  return Pelicula.findByPk(idPelicula)
  .then(pelicula => {
    if(pelicula){
      return Personaje.findByPk(idPersonaje)
      .then(personaje => {
        if(personaje){
          pelicula.addPersonajes(personaje)
          res.status(201).send({
            message: `Character ${personaje.nombre} assigned to the movie ${pelicula.titulo}!`
          })
        }else{
          res.send({
            message: `The movie with the id ${idPelicula} does not exist`
          })
        }        
      })
    }else{        
      res.send({
        message: `The movie with the id ${idPelicula} does not exist`
      })      
    }
    
    
  })
  .catch(err => {
      res.status(500).send({
        //"Could assign personaje to pelicula"
        message: err.message 
    });
  });
  
};

//Update assign character to movie
exports.updateCharacterToMovie = (req, res) => {
  const idPelicula = req.body.idPelicula;
  const idPersonaje = req.body.idPersonaje;

  return Pelicula.findByPk(idPelicula)
  .then(pelicula => {
    if(pelicula){
      return Personaje.findByPk(idPersonaje)
      .then(personaje => {
        if(personaje){
          pelicula.setPersonajes(personaje)
          res.status(201).send({
            message: `Character ${personaje.nombre} update to the movie ${pelicula.titulo}!`
          })
        }else{
          res.send({
            message: `The movie with the id ${idPelicula} does not exist`
          })
        }        
      })
    }else{        
      res.send({
        message: `The movie with the id ${idPelicula} does not exist`
      })      
    }
    
    
  })
  .catch(err => {
      res.status(500).send({
        //"Could assign personaje to pelicula"
        message: err.message 
    });
  });
}

//Delete assign character to movie
exports.removeCharacterToMovie = (req, res) => {
  const idPelicula = req.body.idPelicula;
  const idPersonaje = req.body.idPersonaje;

  return Pelicula.findByPk(idPelicula)
  .then(pelicula => {
    if(pelicula){
      return Personaje.findByPk(idPersonaje)
      .then(personaje => {
        if(personaje){
          pelicula.removePersonajes(personaje)
          res.status(201).send({
            message: `Character ${personaje.nombre} removed to the movie ${pelicula.titulo}!`
          })
        }else{
          res.send({
            message: `The movie with the id ${idPelicula} does not exist`
          })
        }        
      })
    }else{        
      res.send({
        message: `The movie with the id ${idPelicula} does not exist`
      })      
    }
  })
  .catch(err => {
      res.status(500).send({
        //"Could assign personaje to pelicula"
        message: err.message 
    });
  });
}