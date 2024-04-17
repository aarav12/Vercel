import { createClient, commandOptions } from "redis";
import { downloadS3Folder, uploadFile } from "./aws";
//import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils";
import path from "path";
import { getAllFiles } from "./getAllFiles";
const subscriber = createClient();
subscriber.connect();


async function main() {
    console.log(path.join(__dirname, `/output`))
    
    console.log(path.join(__dirname, `/output`).slice(__dirname.length + 1))
    while (1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0);
        console.log(res)
       
        //@ts-ignore
        const id = res.element;
        await downloadS3Folder(`output/${id}`);
        console.log("downloaded");
        try {
const folderPath = path.join(__dirname, `output/${id}/dist`);
            console.log(`Scanning directory: ${folderPath}`);
          await buildProject(path.join(__dirname, `/output/${id}`).replace(/\\/g, '/'));
          console.log("npm install completed");
        }
        catch (error: any) {
            console.error(`Error building project: ${error.message}`);
        }

        const files = getAllFiles(path.join(__dirname, `output/${id}/dist`));
        const folderPath = path.join(__dirname, `output/${id}/dist`);
        files.forEach(async file => {
        await uploadFile(`dist/${id}/` +file.slice(folderPath.length + 1).replace(/\\/g, '/'), file);
        })
        console.log("build files successsfully pushed to s3");
        
    //subscriber.lPush("build-queue", id);  dud this is an infinite loop which you created...
    subscriber.hSet("status", id, "deployed");

    }
}
main();
