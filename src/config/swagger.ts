import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yaml";
import { Express } from "express";

// Load Swagger YAML file
const swaggerFile = fs.readFileSync("./src/config/swagger.yaml", "utf8");
const swaggerDocument = yaml.parse(swaggerFile);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
