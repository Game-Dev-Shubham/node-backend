const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

// 🔗 Connection URL
const uri = "mongodb+srv://gamedev:shubham@first-cluster.n8jtsrp.mongodb.net/gameDB";

const client = new MongoClient(uri);

async function startServer() {
  await client.connect();
  console.log("MongoDB Connected 🔥");

  const db = client.db("gameDB");
  const usersCollection = db.collection("users");

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

      req.on('end', async () => {
        let body = Buffer.concat(usersData).toString();
        let parsedData = querystring.parse(body);

        // 🔥 MongoDB me save
        await usersCollection.insertOne(parsedData);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Data saved", data: parsedData }));
      });

    }

  });

  server.listen(process.env.PORT || 3000, () => {
    console.log("Server running 🚀");
  });
}

startServer();