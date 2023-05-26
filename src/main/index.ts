import "./config/module-alias";

import "reflect-metadata";
import "dotenv/config";

import express, { Router, json } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(json());
app.use((_, res, next) => {
  res.type("json");
  next();
});

const router = Router();

router.post("/api/login/facebook", (_, res) => {
  res.send({ data: "any_data" });
});

app.use(router);

app.listen(8080, () => console.log("Server running on http://localhost:8080"));
