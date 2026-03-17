const express = require("express");
const app = express();

app.use(express.json());

// Home route
app.get("/", (req,res)=>{
  res.send("Backend Running 🚀");
});

// Test API
app.get("/api/data", (req,res)=>{
  res.json({
    name:"Anup",
    message:"Hello from backend",
    score:100
  });
});

// POST example
app.post("/api/score",(req,res)=>{
  const data = req.body;
  
  res.json({
    status:"Score received",
    player:data.player,
    score:data.score
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log("Server started");
});