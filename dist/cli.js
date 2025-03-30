import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import validator from '@jsume/schema/validator';
import cac from 'cac';

// src/cli.ts

// package.json
var package_default = {
  version: "0.0.1"};

// src/cli.ts
async function getJson(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}
function validatorCallbackFactory(pathToJsonFile) {
  return function cb(valid, errorsText) {
    if (!valid) {
      console.error(`${pathToJsonFile} is INVALID:
${errorsText}`);
    } else {
      console.log(`${pathToJsonFile} is valid!`);
    }
  };
}
var cli = cac();
cli.command("", "Validate jsume json file").option("-i, --input <path>", "Input file path").option("-u, --url <url>", "URL to the jsume json file").action(async (options) => {
  const { input, url } = options;
  if (!input && !url) {
    throw new Error("Please provide an input file path or a URL.");
  } else if (input && url) {
    throw new Error("Please provide only one of input file path or URL.");
  } else if (input) {
    const filePath = path.resolve(input);
    const fileName = path.basename(filePath);
    const fileContent = readFileSync(filePath, "utf-8");
    validator(
      JSON.parse(fileContent),
      validatorCallbackFactory(fileName),
      "en"
    );
  } else {
    let json = "";
    try {
      json = await getJson(url);
    } catch (_) {
      const e = new Error("Error fetching the JSON file from the URL.");
      e.name = "FetchError";
      throw e;
    }
    validator(
      json,
      validatorCallbackFactory("This online JSON file"),
      "en"
    );
  }
});
cli.version(package_default.version);
cli.help();
try {
  cli.parse(process.argv, { run: false });
  await cli.runMatchedCommand();
} catch (error) {
  const errorName = error.name || "";
  const errorMessage = error.message;
  const knownErrors = ["FetchError", "CACError"];
  if (knownErrors.includes(errorName)) {
    console.error(`ERROR: ${errorMessage}`);
  } else {
    console.error(error.stack);
  }
  process.exit(1);
}
