const WebSocket = require("ws");

const port = process.env.PORT || 10000;

const wss = new WebSocket.Server({ port });

let sender = null;

wss.on("connection", (ws) => {

    ws.on("message", (msg) => {

        let data;

        try {
            data = JSON.parse(msg);
        } catch {
            return;
        }

        if (data.type === "sender") {
            sender = ws;
            return;
        }

        if (data.type === "receiver") {
            ws.isReceiver = true;
            return;
        }

        if (data.type === "gyro") {

            wss.clients.forEach(client => {

                if (
                    client.readyState === WebSocket.OPEN &&
                    client.isReceiver
                ) {
                    client.send(JSON.stringify(data));
                }

            });

        }

    });

    ws.on("close", () => {
        if (ws === sender)
            sender = null;
    });

});

console.log("Server Running...");