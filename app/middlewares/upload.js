const path = require("path");
module.exports = {

    async uploadImage(image) {
        var msg="";
        
        try {    
            
            if(!image){                               
                 msg = "No file upload"                                
            }else {
                var extension = image.name.slice(image.name.lastIndexOf('.'));
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

                const extensionName = path.extname(image.name); // fetch the file extension
                const allowedExtension = ['.png','.PNG','.jpg','.JPG','.jpeg','.JPEG'];

                image.name = uniqueSuffix + extension;
                //console.log("Extensión:" + Object.keys(image));

                if(!allowedExtension.includes(extensionName)){
                    //return JSON.parse('"Invalid Image"');
                    msg = "Invalid Image";
                }else{
                    image.mv(`./storage/imgs/${image.name}`,err => {
                        if(err) {
                            return msg = err;
                        }else{
                            msg = image.name;                            
                        }
                    });
                    msg = image.name;
                    
                    return msg;                        
                }
                return msg;        
            }
             
        }catch (err) {
            msg = err;
        }
    }
}