const db = require("../models");
const appConfig = require("../../config/config.js");
const Op = db.Sequelize.Op;
const upload = require('../middlewares/upload')
const Genero = db.generos;
var fs = require('fs');
// Create and Save a new Genero
exports.create = (req, res) => {

  var imageBool = false;  
  var image;
// Validate request
  if (!req.body.nombre ) {
    res.status(400).send({
      message: "Content can not be empty!"      
    });
    return;
  }  
  // Create a Genero
  const genero = {
    //imagen: req.body.imagen,
    nombre: req.body.nombre    
  };

  if(!req.files) {    
    return res.send({
      message: `You must select a image.`
    });    
  } else {
    imageBool = true;
    image = req.files.imagen
  }  

  // Save Genero in the database
  if(imageBool && genero.nombre)
  {
    Genero.findOne({
      where: {nombre: genero.nombre}
    })        
    .then(data => {      
      if (data != null) {        
        res.send({
          message: `The genre ${genero.nombre} already exists`
        })
      }else{
        upload.uploadImage(image)
        .then(imageName =>  {              
          if(imageName == "Invalid Image"){
            res.send({
              message: imageName
            });
          }else{
            Genero.create({
              imagen: appConfig.APP_HOST + ":" + appConfig.PORT + "/public/" + imageName,
              nombre: req.body.nombre
            })
            .then(data => {
              res.send(data);
            })
            .catch(err => {        
              res.status(500).send({        
                message:
                  err.message || "Some error occurred while creating the Genero."
              });
            }); 
          }      
        })  
      }
    })
    .catch(err => {        
      res.status(500).send({        
        message:
          err.message || "Some error occurred while creating the Genero."
      });
    });
  }   
}
// Retrieve all Generos from the database.
exports.findAll = (req, res) => {

  Genero.findAll({
      attributes: ['imagen', 'nombre']
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Generos."
      });
    });
};

// Find a single Genero with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Genero.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Genero with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Genero with id=" + id
      });
    });
};
// Update a Genero by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  var imageBool = false;

  // Create a Genero
  const genero = {
    imagen: req.body.image,
    nombre: req.body.nombre     
  };

  if (!req.body.nombre ) {
    res.status(400).send({
      message: "Content can not be empty!"      
    });
    return;
  } 

  if(req.files) {        
    imageBool = true;
    image = req.files.imagen
  } 

  Genero.findByPk(id)
    .then(data => {
      
      if (data) {  
        //res.send(data);

        var imagenAlmacenada = data.imagen.slice(29);      

        Genero.findOne({
          where: {
            [Op.and]:[
              {
                nombre: genero.nombre    
              },
              {
                id:{
                  [Op.ne]: id
                }                 
              }
            ]                
          }
        })
        .then(genero => {
          if(genero != null){
            res.send({
              message: `The genre ${genero.nombre} is already registered`
            })
          }else{
            if(imageBool){
              upload.uploadImage(image)
              .then(imageName =>  {              
                if(imageName == "Invalid Image"){
                  res.send({
                    message: imageName
                  });
                }else{
                  Genero.update({
                    imagen: appConfig.APP_HOST + ":" + appConfig.PORT + "/public/" + imageName,
                    nombre: req.body.nombre
                  }, {
                    where: { id: id }
                  })
                  .then(num => {
                    if (num == 1) {        
                      fs.unlink('storage/imgs/' + imagenAlmacenada, (err) => {
                        if (err) {
                          //throw err;
                          res.send({
                            message: err.message
                          });
                        }
                      });

                      res.send({
                        message: "Película was updated successfully."
                      });        
                    }
                  })
                  .catch(err => {
                    res.status(500).send({
                      message:
                        err.message || "Some error occurred while updating the genre."
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
              Genero.update(req.body ,{
              where: { id: id }
              })
              .then(num => {
                if (num == 1) {                          
                  res.send({
                    message: "Genre was updated successfully."
                  });                  
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Error updating Genre with id=" + id
                });
              });  
            }
          }
        })
        .catch(err => {
          res.status(500).send({
            message: err.message
          })
        })        
      }else{
        res.status(404).send({
          message: `Cannot update Genero with id=${id}. Maybe Genero was not found or the field is empty!`
        });
      }
    })     
    .catch(err => {
      res.status(500).send({
        message: err.message || "Could not update Genero with id=" + id
      });
    });  
};

// Delete a Genero with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Genero.findByPk(id)
    .then(data => {
      if (data) {
        //res.send(data);        
        var imagenAlmacenada = data.imagen.slice(29);
        
        fs.unlink('storage/imgs/' + imagenAlmacenada, (err) => {
          if (err) {
            throw err;
          }else{
            Genero.destroy({
              where: { id: id }
            })
            res.send({
              message: "Genero was deleted successfully!"
            });   
          }
        })
      }else{
        res.status(404).send({
          message: `Cannot find Genero with id=${id}.`
        });
      }
      })     
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Genero with id=" + id
      });
    });
  
};