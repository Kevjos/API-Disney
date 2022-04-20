const db = require("../models");
const appConfig = require("../../config/config.js");
const upload = require('../middlewares/upload');
const Op = db.Sequelize.Op;
const Pelicula = db.peliculas;
const Genero = db.generos;
var fs = require('fs');
const Personaje = db.personajes;
// Create and Save a new Pelicula
exports.create = (req, res) => {
// Validate request

  var imageBool = false;
  var titleBool = false;
  var dateBool = false;
  var calificationBool = false;

  if (!req.body.titulo || !req.body.fechaCreacion || !req.body.calificacion || !req.body.tipo) {
    
    res.status(400).send({
      message: "Content can not be empty!"            
    });
    return;
  } 
  
  var image;
  var fecha = new Date();
  fecha.setHours(0,0,0,0);

  var dateForm = new Date(req.body.fechaCreacion)
  dateForm.setHours(0,0,0,0);
  
  if(!req.files) {    
    return res.send({
      message: `You must select a image.`
    });    
  } else {
    imageBool = true;
    image = req.files.imagen
  }
  
  if(req.body.calificacion > 5 || req.body.calificacion <= 0){
    return res.send({
      message: `Must have values ​​between 1 and 5.`
    });    
  }else{
    calificationBool = true;
  }
  
  if(dateForm > fecha){
    return res.send({
      message: `The date must be less than the current date.`
    });
  }else{
    dateBool = true;
  }

  if(req.body.tipo == "Película" || req.body.tipo == "Serie"){
    
    typeBool = true;
  }else{
    return res.send({
      message: "Only Película or Serie."
    });
  }

  // Save Personaje in the database
  var idGenero = req.body.genero;
  if(calificationBool && dateBool && imageBool){
    Genero.findByPk(idGenero)        
    .then(data => {      
      if (data) {
        Pelicula.findOne({
          where: {
            titulo: req.body.titulo
          }
        })
        .then(title =>{
          if(title != null){
            res.send({
              message: "The title of the film is already registered"
            })
          }else {
            upload.uploadImage(image)
            .then(imageName =>  {              
              if(imageName == "Invalid Image"){
                res.send({
                  message: imageName
                });
              }else{
                Pelicula.create({
                  //imagen: appConfig.APP_HOST + ":" + appConfig.PORT + "/public/" + req.file.filename,
                  imagen: appConfig.APP_HOST + ":" + appConfig.PORT + "/public/" + imageName,
                  titulo: req.body.titulo,
                  fechaCreacion:   req.body.fechaCreacion,
                  calificacion:   req.body.calificacion,
                  tipo: req.body.tipo,
                  generoId: idGenero    
                })
                .then(data => {                  
                  res.send({
                    message: "Movie registered"
                  });
                })
                .catch(err => {                  
                  res.status(500).send({
                    message:
                      err.message || "Some error occurred while creating the Pelicula."
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
          };
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Pelicula."
          });
        })
        
      } else {
        res.status(404).send({
          message: `Cannot find Genero with id=${idGenero}.`
        });
      }        
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding the Pelicula."
      });
    });
  }
     
};

//Retrieve all Peliculas/ find by titulo, genero from the database

exports.findAll = (req, res) => {
  const nombre = req.query.name;
  const genero = req.query.genre;  
  const orden = req.query.order;
 
  
  var condition = nombre ? { titulo : nombre } : 
                  genero ? { generoId: genero }: null;
  
  var atributes = null;
  var attributesOrder = null;
  var modelGenre = [ { model: Genero }];
  

  if (condition == null){
    atributes = ['imagen', 'titulo', 'fechaCreacion'];
    modelGenre = null;
  }

  if(orden && (orden == "ASC" || orden =="DESC")){
    attributesOrder = [['fechaCreacion' , orden]];
    atributes = null;    
  }else if(orden && (orden != "ASC" || orden !="DESC")){
    res.send({
      message: "Enter an allowed value."
    });
  }

    Pelicula.findAll({ 
        where: condition,
        attributes: atributes,
        order: attributesOrder,
        include: modelGenre
      })
        .then(data => {
          if(data.length > 0){
            res.send(data);
          }else{
            if(condition.titulo){
              res.send({
                message: `There are no movies with the ${condition.titulo}`
              })
            }else{
              res.send({
                message: `There are no movies with the ${condition.generoId}`
              })
            }
            
          }
          
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Peliculas."
        });
    });
};

// Find a single Pelicula with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Pelicula.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Pelicula with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Pelicula with id=" + id
      });
    });
};
// Update a Pelicula by the id in the request
exports.update = (req, res) => {
// Validate request

  var imageBool = false;
  var titleBool = false;
  var dateBool = false;
  var calificationBool = false;
  var contentEmptyBool = false;  
  var typeBool = false;

  const id = req.params.id;

  if (!req.body.titulo || !req.body.fechaCreacion || !req.body.calificacion || !req.body.tipo  || !req.body.genero) {
    
    res.status(400).send({
      message: "Content can not be empty!"            
    });
    return;
  } 
  
  var image;
  var fecha = new Date();
  fecha.setHours(0,0,0,0);

  var dateForm = new Date(req.body.fechaCreacion)
  dateForm.setHours(0,0,0,0);
  
  if(req.files) {    
    imageBool = true;
    image = req.files.imagen
  }
  
  if(req.body.calificacion > 5 || req.body.calificacion <= 0){
    return res.send({
      message: `Must have values ​​between 1 and 5.`
    });    
  }else{
    calificationBool = true;
  }
  
  if(dateForm > fecha){
    return res.send({
      message: `The date must be less than the current date.`
    });
  }else{
    dateBool = true;
  }

  if(req.body.tipo == "Película" || req.body.tipo == "Serie"){
    
    typeBool = true;
  }else{
    return res.send({
      message: "Only Película or Serie."
    });
  }

  // Save Personaje in the database
  var idGenero = req.body.genero;
  if(calificationBool && dateBool && typeBool){
    Pelicula.findByPk(id)
    .then(data => {
      
      if (data) {
                
        var imagenAlmacenada = data.imagen.slice(29);
        const pathImage = 'storage/imgs/';


        Genero.findByPk(idGenero)        
        .then(data => {      
          if (data) {
            Pelicula.findOne({
              where: {
                [Op.and]:[
                  {
                    titulo: req.body.titulo    
                  },
                  {
                    id:{
                      [Op.ne]: id
                    }                 
                  }
                ]                
              }
            })
            .then(title =>{
              if(title != null){
                res.send({
                  message: "The title of the film is already registered"
                })
              }else {
                //If there is an image it is updated
                if(imageBool){
                  upload.uploadImage(image)
                  .then(imageName =>  {              
                    if(imageName == "Invalid Image"){
                      res.send({
                        message: imageName
                      });
                    }else{
                      Pelicula.update({
                        imagen: appConfig.APP_HOST + ":" + appConfig.PORT + "/public/" + imageName,
                        titulo: req.body.titulo,
                        fechaCreacion:   req.body.fechaCreacion,
                        calificacion:   req.body.calificacion,
                        tipo: req.body.tipo,
                        generoId: req.body.genero
                      },{
                        where: { id: id }
                      })
                      .then(num => {
                        if (num == 1) { 
                          fs.access(pathImage + imagenAlmacenada, fs.F_OK, (err) => {
                            if(err) {
                              res.send({
                                message: `The image ${imagenAlmacenada} does not exist`
                              });

                              return
                            }

                            fs.unlink(pathImage + imagenAlmacenada, (err) => {
                            if (err) {
                                //throw err;
                                
                                res.send({
                                  message: err.message
                                });
                                
                              }
                            });

                            res.send({
                              message: "Movie was updated successfully."
                            });
                          })                                         
                        }
                      })
                    }
                    
                  })
                  .catch(err => {
                    res.status(500).send({
                      message:
                        err.message || "Some error occurred while uploading the image."
                    });
                  });
                }else{
                  Pelicula.update(req.body,{
                    where: { id: id }
                  })
                  .then(num => {
                    if (num == 1) {        
                      res.send({
                        message: "Movie was updated successfully."
                      });        
                    }
                  })
                  .catch(err => {
                    res.status(500).send({
                      message: "Error updating movie with id=" + id                      
                    });
                  });
                }                
              };
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while finding the title movie."
              });
            })
            
          } else {
            res.status(404).send({
              message: `Cannot find Genero with id=${idGenero}.`
            });
          }        
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while finding the Pelicula."
          });
        });
      }else {
        res.send({
          message: `Cannot update Película with id=${id}. Maybe Película was not found or ${req.body} is empty!`
        });
      }
    
    })    
    .catch(err => {      
      res.status(500).send({
        message: err.message
      });
    });  
  }
};

// Delete a Pelicula with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Pelicula.findByPk(id)
    .then(data => {
      if (data) {
        //res.send(data);        
        var imagenAlmacenada = data.imagen.slice(29);
        
        fs.unlink('storage/imgs/' + imagenAlmacenada, (err) => {
          if (err) {
            throw err;
          }else{
            Pelicula.destroy({
              where: { id: id }
            })
            res.send({
              message: "Película was deleted successfully!"
            });   
          }
        })
      }else{
        res.status(404).send({
          message: `Cannot find Pelicula with id=${id}.`
        });
      }
      })     
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Película with id=" + id
      });
    });
};

//Retrieve all characters by movie
exports.detailMovie = (req, res) => {
  const idPelicula = req.params.id
  
  Pelicula.findByPk(idPelicula,{
    include: [{
      model: Personaje,      
      through: { attributes: [] }      
    }]
  })
  .then(pelicula => {
    if(pelicula){
      res.send(pelicula)
    }else{
      res.status(404).send({        
        message: `The movie with the id ${ idPelicula } is not registered`
      });
    }
    
  })
  .catch(err => {
      res.status(500).send({        
        message: err.message
        //`Could not find Película with id=${ idPelicula }`
      });
  });
};

// Delete all Pelicula from the database.
/*
exports.deleteAll = (req, res) => {
  Pelicula.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Peliculas were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Peliculas."
      });
    });
};
*/