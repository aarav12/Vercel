import express from "express";
import cors from "cors";
import { generate } from "./Id";
import { simpleGit } from "simple-git";
import path from "path";
import { getAllFiles } from "./getAllFiles";
import { uploadFile } from "./aws";
const app = express();
import { createClient } from "redis";

const publisher = createClient();
publisher.connect();

app.use(cors());
app.use(express.json());

app.post('/deploy', async (req, res) => {
    const repoUrl = req.body.repoUrl;
    console.log("here comes the value from the frontEnd", repoUrl);
    const id = generate();
    console.log(path.normalize(__dirname).replace(/\\/g, '/'));
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));
  
    // files.forEach(async file => {
    //     await uploadFile(file.slice(__dirname.length + 1).replace(/\\/g, '/'), file);
    //     console.log(file);
    // })

    for (const file of files) {
    const relativePath = path.relative(__dirname, file).replace(/\\/g, '/');
    await uploadFile(`output/${id}/${relativePath}`, file);
}

    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");
    res.json({
        id:id
    })
})

const subscriber = createClient();
subscriber.connect();

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

app.listen(3000, () => {
    console.log("server up on localhost:3000");
})