const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res)=>{
  fs.readFile('web.html','utf8',(error,data)=>{
    if(req.url == '/'){
      if(error){
        res.writeHead(404,{'Content-Type':'text/plain'});
        res.end("Error");
      }else if(data){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data);
      }
      
    }else if(req.url == '/submit'){
      res.end("submit");
    }
    
    
  });
});
server.listen(process.env.PORT);