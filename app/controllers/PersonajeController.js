const db = require("../models");
const appConfig = require("../../config/config.js");
const upload = require("../middlewares/upload")
const Personaje = db.personajes;
const Pelicula = db.peliculas;
const Genero = db.generos;
const Op = db.Sequelize.Op;
var fs = require('fs');
const pathImage = 'storage/imgs/';
// Create and Save a new Personaje
exports.create = (req, res) => {

  var imageBool = false;
  var nombreBool = false;
  var edadBool = false;
  var pesoBool = false;
  var historiaBool = false;
// Validate request
  if (!req.body.nombre || !req.body.edad || !req.body.peso || !req.body.historia ) {
    res.status(400).send({
      message: "Content can not be empty!"      
    });
    return;
  }

  if(!req.files) {    
    return res.send({
      message: `You must select a image.`
    });    
  } else {
    imageBool = true;
    image = req.files.imagen
  }
  
  if(!Number.isInteger(Number(req.body.edad)))
  {
    return res.send({
      message: "You must enter a number"
    })
  }else{
    if(req.body.edad <= 4 || req.body.edad >= 99){
      return res.send({
        message: "You must enter a value between 5 and 99"
      })
    }else{
      edadBool = true;
    }
  }
  
  if(!Number.isInteger(Number(req.body.peso)))
  {
    return res.send({
      message: "You must enter a number"
    })
  }else{
    if(req.body.peso <= 18 || req.body.peso >= 100){
      return res.send({
        message: "You must enter a value between 18 and 100"
      })
    }else{
      pesoBool = true;
    }
  }  
  
  if(typeof req.body.nombre === 'string'){
    nombreBool = true;
  }else{
    return res.send({
      message: "You must enter a valid name"
    })
  }

  if(req.body.historia.length < 50){
    return res.send({
      message: "The story is too short"
    })
  }else if(req.body.historia.length > 65535){
    return res.send({
      message: "The story is too long"
    })
  }else{
    historiaBool = true
  }

  if(nombreBool && edadBool && pesoBool && historiaBool)
  {
    Personaje.findOne({
      where: {
        nombre: req.body.nombre
      }
    })
    .then(personaje => {  
      if(personaje != null){
        res.send({
          message: "The name of the character is already registered"
        })
      }else{
        upload.uploadImage(image)
        .then(imageName =>  {              
          if(imageName == "Invalid Image"){
            res.send({
              message: imageName
            });
          }else{
            // Save Personaje in the database
            Personaje.create({
              imagen: appConfig.APP_HOST + ":" + appConfig.PORT + "/public/" + imageName,
              nombre: req.body.nombre,
              edad:   req.body.edad,
              peso:   req.body.peso,
              historia:  req.body.historia
            })
            .then(data => {
              res.send({
                message: "Character registered"
              });
            })
            .catch(err => {              
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the character."
              });
            });      
          }
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while search the name of character."
      });
    });
  }
    
};

//Retrieve all Personajes/ find by edad | nombre | idMovie from the database
exports.findAll = (req, res) => {
  const age = req.query.age;
  const name = req.query.name;
  const idMovie = req.query.movies;
  const weight = req.query.weight;
  
  var condition = age ? { edad: age } : 
                  name ? { nombre: name }:                  
                  weight ? { peso: weight } :null;
  
  var atributes = null;  

  if (condition == null){
    atributes = ['imagen', 'nombre'];
  }

  if(idMovie != null){
    Personaje.findAll({
      include: [{
        model: Pelicula,              
        where: {id: idMovie},
        attributes: ['titulo', 'imagen','fechaCreacion','calificacion']      
      }]
    })
    .then(personajes => {
      if(personajes.length > 0){
        res.send(personajes);
      }else{
        res.status(404).send({
          message: `There are no movies registered with the id ${ idMovie }`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message 
      });
    });
  } else {
    Personaje.findAll({ 
      where: condition,
      attributes: atributes    
    })
    .then(data => {
      if(data.length > 0){
        res.send(data);
      }else{
        res.send({
          message: "There is no data"
        });
      }      
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Personajes."
      });
    });
  }
};


// Find a single Personaje with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Personaje.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Personaje with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Personaje with id=" + id
      });
    });
};

//Detail of a single character
exports.detailCharacter = (req, res) => {
  const idPersonaje = req.params.id
  
  Personaje.findByPk(idPersonaje,{
    include: [{
      model: Pelicula,
      through: { attributes: [] },
      include: [{
        model: Genero
        
      }]
    }]
  })
  .then(personaje => {
    if(personaje){
      res.send(personaje)
    }else{
      res.status(404).send({        
        message: `The character with the id ${ idPersonaje } is not registered`
      });
    }
    
  })
  .catch(err => {
      res.status(500).send({        
        message: err.message
        //`Could not find Personaje with id=${ idPersonaje }`
      });
  });
};

// Update a Personaje by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  var imageBool = false;
  var nombreBool = false;
  var edadBool = false;
  var pesoBool = false;
  var historiaBool = false;
// Validate request
  if (!req.body.nombre || !req.body.edad || !req.body.peso || !req.body.historia ) {
    res.status(400).send({
      message: "Content can not be empty!"      
    });
    return;
  }

  if(req.files) {    
    imageBool = true;
    image = req.files.imagen
  }
  
  if(!Number.isInteger(Number(req.body.edad)))
  {
    return res.send({
      message: "You must enter a number"
    })
  }else{
    if(req.body.edad <= 4 || req.body.edad >= 99){
      return res.send({
        message: "You must enter a value between 5 and 99"
      })
    }else{
      edadBool = true;
    }
  }
  
  if(!Number.isInteger(Number(req.body.peso)))
  {
    return res.send({
      message: "You must enter a number"
    })
  }else{
    if(req.body.peso <= 18 || req.body.peso >= 100){
      return res.send({
        message: "You must enter a value between 18 and 100"
      })
    }else{
      pesoBool = true;
    }
  }  
  
  if(typeof req.body.nombre === 'string'){
    nombreBool = true;
  }else{
    return res.send({
      message: "You must enter a valid name"
    })
  }

  if(req.body.historia.length < 50){
    return res.send({
      message: "The story is too short"
    })
  }else if(req.body.historia.length > 65535){
    return res.send({
      message: "The story is too long"
    })
  }else{
    historiaBool = true
  }

  if(historiaBool && nombreBool && pesoBool && edadBool){
    Personaje.findByPk(id)
    .then(data => {
      if (data) {
        var imagenAlmacenada = data.imagen.slice(29);        
        
        Personaje.findOne({
          where: {
            [Op.and]:[
              {
                nombre: req.body.nombre    
              },
              {
                id:{
                  [Op.ne]: id
                }                 
              }
            ]                
          }
        })
        .then(nombrePersonaje =>{
          if(nombrePersonaje != null){
            res.send({
              message: "The name of the character is already registered"
            })
          }else {
            if(imageBool){
              upload.uploadImage(image)
              .then(imageName =>  {              
                if(imageName == "Invalid Image"){
                  res.send({
                    message: imageName
                  });
                }else{
                  Personaje.update({
                    imagen: appConfig.APP_HOST + ":" + appConfig.PORT + "/public/" + imageName,
                    nombre: req.body.nombre,
                    edad:   req.body.edad,
                    peso:   req.body.peso,
                    historia:  req.body.historia
                  },{
                    where: { id: id }
                  })
                  .then(num => {
                    if (num == 1) {        
                      fs.unlink(pathImage + imagenAlmacenada, (err) => {
                        if (err) {
                          res.send({
                            message: err.message
                          });
                        }
                      });         
                      res.send({
                        message: "Character was updated successfully."
                      });        
                    }
                  })
                  .catch(err => {
                    res.status(500).send({
                      message: "Error updating character with id=" + id
                    });
                  }); 
                }
              })
              .catch(err => {
                res.status(500).send({
                  message:
                    err.message || "Some error occurred while uploading the image."
                });
              });
            }else{
              console.log(req.body)
              Personaje.update({
                nombre: req.body.nombre,
                edad:   req.body.edad,
                peso:   req.body.peso,
                historia:  req.body.historia
              },{
                where: { id: id }
              })
              .then(num => {
                if (num == 1) {        
                  res.send({
                    message: "Character was updated successfully."
                  });        
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Error updating character with id=" + id                      
                });
              });
            }             
          }
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while finding the character name."
          });
        })                      
      }else{
        res.send({
          message: `Cannot update Personaje with id=${id}. Maybe Personaje was not found or req.body is empty!`
        });
      };
    })     
    .catch(err => {
      res.status(500).send({
        message: "Could not update character with id=" + id
      });
    });
  }
    
};
// Delete a Personaje with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  
  Personaje.findByPk(id)
    .then(data => {
      if (data) {
                
        var imagenAlmacenada = data.imagen.slice(29);
        
        fs.unlink(pathImage + imagenAlmacenada, (err) => {
          if (err) {
            throw err;
          }else{
            Personaje.destroy({
              where: { id: id }
            })
            res.send({
              message: "Personaje was deleted successfully!"
            });   
          }
        })
        }
      })     
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Personaje with id=" + id
      });
    });
};
// Delete all Personajes from the database.
exports.deleteAll = (req, res) => {
  Personaje.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Personajes were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Personajes."
      });
    });
};