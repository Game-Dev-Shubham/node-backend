const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://gamedev:shubham@first-cluster.n8jtsrp.mongodb.net/gameDB?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let usersCollection;

// 🔥 Connect DB safely
async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB Connected 🔥");

    const db = client.db("gameDB");
    usersCollection = db.collection("users");

  } catch (err) {
    console.log("DB Error ❌", err);
  }
}

// server always start hoga (important for Render)
const server = http.createServer((req, res) => {

  if (req.url == '/') {
    fs.readFile('web.html', 'utf8', (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end("Error");
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }

  else if (req.url == '/submit' && req.method == 'POST') {

    let bodyData = [];

    req.on('data', chunk => bodyData.push(chunk));

    req.on('end', async () => {
      let body = Buffer.concat(bodyData).toString();
      let parsedData = querystring.parse(body);

      try {
        if (usersCollection) {
          await usersCollection.insertOne(parsedData);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Saved", data: parsedData }));

      } catch (err) {
        res.writeHead(500);
        res.end("DB Error");
      }
    });
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

// connect DB AFTER server start
connectDB();