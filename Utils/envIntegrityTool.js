'use strict';

const fs = require('fs');
const path = require('path');

/**
 * This function:
 * Creates new .env based on example.env if first is not exists
 * Checks the order of variables in .env based on example and sort settings
 * Add missing parameters to .env from example
 * Keeps rewriten variables untouched
 */
let check = exports.check = (path) => {
  // Declaring variables
  let exampleFile, envFile;
  let exampleFilePath = `${path}/example.env`, envFilePath = `${path}/.env`;
  exampleFile = fs.readFileSync(exampleFilePath, 'utf8').split('\n');

  // Creating new file based on existing example if not exist
  try {
    envFile = fs.readFileSync(envFilePath, 'utf8').split('\n');
  } catch (err) {
    try {
      fs.copyFileSync(exampleFilePath, envFilePath);
    } catch (err) {
      return console.error(err);
    }
    return console.log('\x1b[33m\x1b[1mCreating .env file based on example... \x1b[0m');
  }

  // Checking integrity
  console.log('\x1b[33m\x1b[1mChecking .env file integrity... \x1b[0m');
  for (let str = 0; str < exampleFile.length; str++) {
    // EOF
    if (envFile.length <= str) {
      envFile.splice(str, 0, exampleFile[str]);
      console.log(str + ' \x1b[44m' + exampleFile[str] + '\x1b[0m');
    }
    // Wrong param
    else if (envFile[str].split(' = ')[0] != exampleFile[str].split(' = ')[0]) {
      envFile.splice(str, 0, exampleFile[str]);
      console.log(str + ' \x1b[41m' + exampleFile[str] + '\x1b[0m');
    }
    // All is ok
    else {
      console.log(str + ' \x1b[42m' + exampleFile[str] + '\x1b[0m');
    }
  }

  // Updating wrong ordered values
  for (let str in envFile) {
    if (str > exampleFile.length - 1) {
      console.log(str + ' \x1b[44m' + envFile[str] + '\x1b[0m');
      for (let subStr in envFile) {
        if (envFile[subStr] && envFile[str].split(' = ')[0] == envFile[subStr].split(' = ')[0]) {
          envFile[subStr] = envFile[str] + '';
          delete envFile[str];
          break;
        }
      }
    }
  }

  // Write file
  try {
    fs.writeFileSync(envFilePath, envFile.join('\n').trimEnd());
  } catch (er) {
    return console.error(err);
  }
  // Debug
  //console.log();
}

check(path.join(__dirname, '../'));