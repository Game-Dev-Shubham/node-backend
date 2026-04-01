const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

// 🔗 MongoDB Atlas (0)
const uri = "mongodb+srv://gamedev:shubham@first-cluster.n8jtsrp.mongodb.net/gameDB?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let usersCollection = null;

// ✅ Connect DB FIRST
async function startServer() {
  try {
    await client.connect();
    console.log("MongoDB Connected 🔥");

    const db = client.db("gameDB");
    usersCollection = db.collection("users");

    // 🚀 Server start AFTER DB connect
    const server = http.createServer((req, res) => {

      if (req.url === '/') {
        fs.readFile('web.html', 'utf8', (error, data) => {
          if (error) {
            res.writeHead(404);
            res.end("Error loading page");
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
          }
        });
      }

      else if (req.url === '/submit' && req.method === 'POST') {

        let bodyData = [];

        req.on('data', chunk => bodyData.push(chunk));

        req.on('end', async () => {
          let body = Buffer.concat(bodyData).toString();
          let parsedData = querystring.parse(body);

          try {
            // ❌ agar DB ready nahi hai → error
            if (!usersCollection) {
              throw new Error("DB not connected");
            }

            // 🔥 Insert into MongoDB
            const result = await usersCollection.insertOne(parsedData);
            console.log("Inserted ID:", result.insertedId);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              message: "Saved ✅",
              data: parsedData
            }));

          } catch (err) {
            console.log("ERROR:", err);
            res.writeHead(500);
            res.end("Database Error ❌");
          }
        });
      }

      else {
        res.writeHead(404);
        res.end("Not Found");
      }

    });

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });

  } catch (err) {
    console.log("MongoDB Connection Failed ❌", err);
  }
}

// start everything
startServer();