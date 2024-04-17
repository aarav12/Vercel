import path from "path";

const util = require('util');
const exec = util.promisify(require('child_process').exec);


export async function buildProject(projectPath: string) {
    await exec('npm install', { cwd: projectPath }).then((e: any) => console.log("npm install completed", e)); // Install dependencies
     
        //await exec('npx update-browserslist-db@latest', {cwd:projectPath}).then((e:any)=>console.log("npx update-browserslist-db@latest",e)) // Build project


    await exec('npm run build', {cwd:projectPath}).then((e:any)=>console.log("npm run build completed",e)) // Build project
}


