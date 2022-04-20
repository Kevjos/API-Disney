# API-Disney
This API is oriented to solve the Alkemy challenge in which you have to make an API to explore the world of Disney, which will allow you to know and modify the characters that compose it and understand in which movies they participated.

### List of technologies used within the project:

* [Node.js](https://nodejs.org/): Version 14.16.0
* [Express.js](https://expressjs.com/): Version 4.17.3
* [Express-fileupload](https://www.npmjs.com/package/express-fileupload): Version 1.3.1
* [Nodemailer](https://nodemailer.com): Version 6.7.3
* [Mysql2](https://www.npmjs.com/package/mysql2): Version 2.3.3
* [Sequelize](https://sequelize.org): Version 6.18.0
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Version 8.5.1
* [cors](https://www.npmjs.com/package/cors): Version 2.8.5
* [bcrypt](https://www.npmjs.com/package/bcrypt): Version 5.0.1

### Installation
To install and run this proyect just type and execute:

1. You need to set up the MySql server and create a database with the name apidisney.
2.  
```
$ git clone https://github.com/Kevjos/API-Disney
$ cd ../path/to/the/file
$ npm install
```
3. Email:
To send the email you must enter in the .env file your username and password of the service you choose to use (Mailtrap or Gmail), by default it is configured to use Mailtrap, for this you must create an account and enter your credentials.

If you decide to use Gmail, you must put your credentials in the .env file, enable the access of unsecured applications in your account, as long as you do not have two-step verification enabled. You should also modify the controllers/AuthController.js file on lines 93 and 94 and change the following:

HOST_EMAIL_MAILTRAP --> HOST_EMAIL_GMAIL


PORT_EMAIL_MAILTRAP --> PORT_EMAIL_GMAIL

4.
```
$ npm start
```

## Documentation: 
<https://documenter.getpostman.com/view/5261741/Uyr7JKGZ>
