import multer from 'multer';

import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import config from '../config';

cloudinary.config({ 
    cloud_name: config.cloudinary.cloudinary_cloud_name, 
    api_key: config.cloudinary.cloudinary_api_key, 
    api_secret: config.cloudinary.cloudinary_api_secret 
  });

  export const sendImageToCloudinary=(imageName:string,path:string)=>{

    return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload(path,
            { public_id:imageName }, 
            function(error, result) 
            {
                if(error) 
                {
                    reject(error)
                }
                resolve(result);
                    fs.unlink(path, (err) => {
                       if (err) {
                         reject(err);
                      } else {
                         resolve('Successfully deleted by the file Async')
                    }
                  });
            });
          
    });
 

}





// multer ---image uploding process
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, process.cwd()+'/src/uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  export const upload = multer({ storage: storage })