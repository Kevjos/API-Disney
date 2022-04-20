# API-Disney
Esta API está orientada a resolver el challenge de Alkemy en el que hay que hacer una API para explorar el mundo de Disney, la cual permitirá conocer y modificar los personajes que lo componen y entender en qué películas estos participaron.

## Documentación: 
<https://documenter.getpostman.com/view/5261741/Uyr7JKGZ>


### Email
Para el envío del email se deben ingresar en el archivo .env su usuario y contraseña del servicio que decida usar(Mailtrap o Gmail), por defecto está configurado para usar Mailtrap, para ello debe crear una cuenta e ingresar sus credenciales.

Si decide usar Gmail, debe poner sus credenciales en el archivo .env, habilitar el acceso de aplicaciones poco seguras en su cuenta, siempre que no tenga habilitada la verificación en dos pasos. También debe modificar el archivo controllers/AuthController.js en las líneas 93 y 94 y cambiar lo siguiente:

HOST_EMAIL_MAILTRAP por HOST_EMAIL_GMAIL


PORT_EMAIL_MAILTRAP por PORT_EMAIL_GMAIL
