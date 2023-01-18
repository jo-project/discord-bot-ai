import fs from 'fs'
import chalk from 'chalk'
import { execSync } from 'child_process'

const log = console.log
const info = chalk.hex("#61A266")
const pathInfo = chalk.bold.hex("#FFD42C")

function deleteFolderRecursive(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    
    log(`${info('[INFO]')} Deleting directory ${pathInfo(`${path}`)}`)
    fs.rmdirSync(path);
  }
}

console.log("Cleaning working tree...");

deleteFolderRecursive("./dist");
execSync('tsc')
console.log("Successfully cleaned working tree!");
