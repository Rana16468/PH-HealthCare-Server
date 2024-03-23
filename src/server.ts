
import { Server } from 'http';
import app from './app';
import config from './app/config';

let server:Server;

async function main()
{
   server= app.listen(config.port, () => {
        console.log(`Example app listening on port ${config.port}`)
      })
}
main();

process.on('unhandledRejection',()=>{
  
  if(server)
  {
    server.close(()=>{
      process.exit(1);
    })
  }
  process.exit(1);
});


process.on('uncaughtException',()=>{

  
  process.exit(1);
})


