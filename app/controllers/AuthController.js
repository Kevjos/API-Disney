const db = require('../models');
const User = db.user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const nodemailer = require('nodemailer');

module.exports = {

    // Login
    login(req, res) {

        let { email, password } = req.body;

        // Buscar usuario
        User.findOne({
            where: {
                email: email
            }
        }).then(user => {

            if (!user) {
                res.status(404).json({ msg: "Usuario con este correo no encontrado" });
            } else {

                if (bcrypt.compareSync(password, user.password)) {

                    // Creamos el token
                    let token = jwt.sign({ user: user }, authConfig.secret, {
                        expiresIn: authConfig.expires
                    });

                    res.json({
                        user: user,
                        token: token
                    })

                } else {

                    // Unauthorized Access
                    res.status(401).json({ msg: "Contraseña incorrecta" })
                }

            }

        }).catch(err => {
            res.status(500).json(err);
        })

    },

    // Registro
    register(req, res) {

        let email = req.body.email;

        // Encriptamos la contraseña        
        /*
        if (req.body.password.lentgh < 6){
            res.json({
                msg: "La contraseña debe tener más de 5 caracteres"
            })
        }
        */
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));

        User.findOne({
            where: {
                email: email
            }
        }).then(user => {
            if(user){
                res.send({
                    message: `Email ${email} registered`
                })
            }else{
                // Crear un usuario
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: password
                }).then(user => {
                    
                    // Creamos el token
                    let token = jwt.sign({ user: user }, authConfig.secret, {
                        expiresIn: authConfig.expires
                    });

                    //iNICIO
                    const toEmail = req.body.email;
                    const name = req.body.name;
                    let transport = nodemailer.createTransport({
                        host: process.env.HOST_EMAIL_MAILTRAP,
                        port: process.env.PORT_EMAIL_MAILTRAP,
                        auth: {
                            user: process.env.EMAIL_USERNAME,
                            pass: process.env.EMAIL_PASSWORD
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });

                    const mailOptions = {
                        from: 'Your email', // Sender address
                        to: toEmail, // List of recipients
                        subject: 'Bienvenid@', // Subject line
                        text: `Hello ${ name }, Welcome to API Disney!`, // Plain text body
                    };

                    transport.sendMail(mailOptions, function(err, info) {
                        if (err){
                            console.log(err);
                            //res.send(500, err.message);
                        } else {
                            console.log("Email sent");
                            //res.status(200).jsonp(req.body);
                        }
                    });


                    //fIN
                    
                    res.json({
                        user: user,
                        token: token
                    });
                    
                }).catch(err => {
                    res.status(500).json(err);
                });
            }
        }).catch(err => {
            res.status(500).json(err);
        });        
    }

}