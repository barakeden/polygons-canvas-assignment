import express from "express";
import cors from "cors";
import polygonsRouter from "./routes/polygons";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/polygons", polygonsRouter);

export default app;
