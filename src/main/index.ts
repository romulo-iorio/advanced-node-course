import "./config/module-alias";
import "reflect-metadata";
import "dotenv/config";

import { port } from "@/main/config/env";
import { app } from "@/main/config/app";

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
