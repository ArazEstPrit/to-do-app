#!/usr/bin/env node
import cliController from "./controllers/cliController";

const parameters = process.argv.slice(2);

cliController.run(parameters);
