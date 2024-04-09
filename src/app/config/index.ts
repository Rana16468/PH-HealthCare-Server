import donenv from 'dotenv';
import path from 'path';
donenv.config({ path: path.join(process.cwd(), '.env') });
export default {
  NODE_ENV:process.env.NODE_ENV,
  port: process.env.PORT,
  jwt_access_srcret:process.env.JWT_ACCESS_SECRET,
  jwt_refeesh_srcret:process.env.JWT_REFRESH_TOKEN,
  token_expire_in:process.env.EXPIRES_IN,
  refresh_token_expire_in:process.env.REFRESH_TOKEN_EXPIRES_IN,
  bcrypt_salt_rounds:process.env.BCRYPT_SALT_ROUNDS,
  jwt_reset_srcret:process.env.RESET_PASSWORD_TOKEN,
  reset_token_expire_in:process.env.RESET_PASSWORD_EXPURES_IN,
  reset_password_link:process.env.RESET_PASSWORD_LINK,
  email_sender:{
    email:process.env.NODEMAILER_EMAIL,
    app_password:process.env.NODEMAILER_PASSWORD

  },
  cloudinary:{
    cloudinary_cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret:process.env.CLOUDINARY_API_SECRET

 },
 ssl_commerce:{
  store_id:process.env.STORE_ID,
  store_passwd:process.env.STORE_PASSWD,
  success_url:process.env.SUCCESS_URL,
  fail_url:process.env.FAIL_URL,
  cancel_url:process.env.CANCLE_URL,
  ssl_payment_api:process.env.SSL_PAYMENT_API,
  ssl_validation_api:process.env.SSL_VALIDATION_API



 }
  
};