const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer((req, res) => {

  if (req.url == '/') {
    fs.readFile('web.html', 'utf8', (error, data) => {
      if (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("Error");
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }

  else if (req.url == '/submit' && req.method == 'POST') {

    let usersData = [];


    req.on('data', (chunk) => {
      usersData.push(chunk);
    });

    req.on('end', () => {
      let body = Buffer.concat(usersData).toString();
      let parsedData = querystring.parse(body);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(parsedData));
    });

  }

});

server.listen(process.env.PORT || 3000);