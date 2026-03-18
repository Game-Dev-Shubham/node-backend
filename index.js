const http = require('http');

const userData = [
  {
    name:"Shubham",
    city:"Kushinagar",
    age:20
  },
  
  {
    name:"Ajay",
    city:"Kushinagar",
    age:18
  },
  
  {
    name:"Aniket",
    city:"Kushinagar",
    age:13
  },
]
const server = http.createServer((req,res)=>{
   res.setHeader("Content-Type","application/json");
   res.write(JSON.stringify(userData));
   res.end();
  
});
server.listen(6000)