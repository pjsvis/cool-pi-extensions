import { defineCommand, runMain } from "citty";
import listCmd from "./commands/list.js";
import addCmd from "./commands/add.js";
import removeCmd from "./commands/remove.js";
import validateCmd from "./commands/validate.js";

const main = defineCommand({
  meta: {
    name: "pi-models",
    description: "Manage ~/.pi/agent/models.json — add, remove, list, and validate pi custom models",
  },
  subCommands: {
    list: listCmd,
    add: addCmd,
    remove: removeCmd,
    rm: removeCmd,
    validate: validateCmd,
  },
});

runMain(main);