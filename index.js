const http = require("http");

let gyro = {
    x: 0,
    y: 0,
    z: 0
};

const server = http.createServer((req, res) => {

    if (req.method === "POST" && req.url === "/update") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {

                const data = JSON.parse(body);

                gyro.x = data.x;
                gyro.y = data.y;
                gyro.z = data.z;

                console.clear();

                console.log("Gyroscope");

                console.log(gyro);

                res.writeHead(200);

                res.end("OK");

            } catch (e) {

                res.writeHead(400);

                res.end("Bad JSON");

            }

        });

    }

    else if (req.method === "GET" && req.url === "/gyro") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(gyro));

    }

    else {

        res.writeHead(404);

        res.end();

    }

});

server.listen(3000, () => {

    console.log("Server Running");

});