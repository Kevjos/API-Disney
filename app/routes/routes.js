module.exports = app => { 
  const personaje = require("../controllers/PersonajeController");
  const pelicula = require("../controllers/PeliculaController");
  const genero = require("../controllers/GeneroController"); 
  const associate = require("../controllers/AssociationsController")     
  const auth = require('../middlewares/auth');

  const AuthController = require('../controllers/AuthController');

  var router = require("express").Router();
  
  // Dos rutas: login y registro
  // /auth/login & /auth/register
  router.post('/auth/login', AuthController.login);
  router.post('/auth/register', AuthController.register);
  
  //Rutas personajes
  // Create a new Personaje
  router.post("/createCharacters", auth, personaje.create);
  // Retrieve all Personaje 
  router.get("/characters", auth, personaje.findAll);
  
  
  // Retrieve a single Personaje with id
  router.get("/character/:id", auth, personaje.findOne);
  // Update a Personaje with id
  router.put("/character/:id", auth,personaje.update);
  // Delete a Personaje with id
  router.delete("/character/:id", auth, personaje.delete);
  // Delete all Personaje 
  //router.delete("/characters/delete", personaje.deleteAll);

  //Rutas peliculas
  // Create a new Película
  router.post("/createMovie", auth, pelicula.create);
  // Retrieve all Película
  router.get("/movies", auth, pelicula.findAll);
  
  // Retrieve a single Película with id
  router.get("/movie/:id", auth, pelicula.findOne);
  // Update a Película with id
  router.put("/movie/:id", auth, pelicula.update);
  // Delete a Película with id
  router.delete("/movie/:id", auth, pelicula.delete);
  // Delete all Peliculas 
  //router.delete("/movie/delete", pelicula.deleteAll);

  //Rutas genero
  // Create a new Genero
  router.post("/createGenre", auth, genero.create);
  // Retrieve all Genero
  router.get("/genres", auth, genero.findAll);
  
  // Retrieve a single Genero with id
  router.get("/genre/:id", auth, genero.findOne);
  // Update a Genero with id
  router.put("/genre/:id", auth, genero.update);
  // Delete a Genero with id
  router.delete("/genre/:id", auth, genero.delete);

  router.post("/asignarPersonaje", auth, associate.assignCharacterToMovie);

  router.post("/updateCharacterMovie", auth, associate.updateCharacterToMovie);

  router.post("/removeCharacterMovie", auth, associate.removeCharacterToMovie);
//Retrieve a detail of a movie
  router.get("/detailMovie/:id", auth, pelicula.detailMovie);
//Retrieve a detail of a character
  router.get("/detailCharacter/:id", auth, personaje.detailCharacter);
  
  app.use(router);
};