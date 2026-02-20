import express from "express"; // setup express server

const app = express();

app.use(express.json());

export default app;
