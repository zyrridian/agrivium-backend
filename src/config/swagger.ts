import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import { Express } from "express";

// Load Swagger YAML file
// const swaggerFile = fs.readFileSync("./src/config/swagger.yaml", "utf8");
// const swaggerDocument = yaml.parse(swaggerFile);
const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerDocument = fs.readFileSync(swaggerPath, "utf8");

export function setupSwagger(app: Express) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(yaml.parse(swaggerDocument))
  );
}
