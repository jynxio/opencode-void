import { cwd } from "node:process";
import path from "node:path";
import fs from "fs-extra";

const LOG_DIR_PATH = path.join(cwd(), ".debug");

function log(i: string | object) {
  const timestamp = performance.now().toFixed();
  const file = path.join(LOG_DIR_PATH, timestamp + ".json");

  fs.outputJSONSync(file, i);
}

function clearLog() {
  fs.emptyDirSync(LOG_DIR_PATH);
}

export { log, clearLog };
