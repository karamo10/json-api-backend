import express from 'express';
import cors from 'cors';

const PORT = 8000;
const app = express();    

app.use(cors());                // allow requests from frontend during dev
app.use(express.json());
// This is important when sending JSON data from your React frontend using JSON.stringify().
// It tells Express “Whenever a request comes with Content-Type: application/json, automatically parse it and store the result in req.body.”
// Without this line, req.body would be undefined.

app.get('/', (req, res) => {
    res.send("Hello from the backend!");
});

app.post("/api/product", (req, res) => {
    console.log("Recieved Body", req.body);
    res.status(201).json({ message: "Product recieved", data: req.body });
})
// Right now, the backend just logs the product and sends it back, but it doesn’t store anything permanently. Once you restart the server, everything is gone.

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});

