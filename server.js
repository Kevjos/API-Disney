const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./app/models");
const fileUpload = require('express-fileupload');
require('dotenv').config();

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
});
var corsOptions = {
  origin: "http://localhost:3000"
};
app.use('/public', express.static(`${__dirname}/storage/imgs/`));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to api application." });
});

require("./app/routes/routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});