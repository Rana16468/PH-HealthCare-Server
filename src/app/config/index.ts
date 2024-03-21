import donenv from 'dotenv';
import path from 'path';
donenv.config({ path: path.join(process.cwd(), '.env') });
export default {
  NODE_ENV:process.env.NODE_ENV,
  port: process.env.PORT,
  jwt_access_srcret:process.env.JWT_ACCESS_SECRET,
  jwt_refeesh_srcret:process.env.JWT_REFRESH_TOKEN,
  
};