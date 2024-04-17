const express = require("express");
import {S3} from "aws-sdk";
const app = express();
import cors from "cors";
app.use(cors());
const s3 = new S3(
     {
        accessKeyId: "52763b925e7071b79d7673ff2c6c767b",
        secretAccessKey: "8a898222d3532796b76be202b7ac47edb79cc3de10368fec997db8a9e29de790",
        endpoint: "https://44362250828096e358e9996f09ed85e9.r2.cloudflarestorage.com"
    }
);

app.get("/*", async (req: any, res: any) => {

    //id.100xdevs.com

    const host = req.hostname;
    const id = host.split(".")[0];
    console.log(id);
    const filePath = req.path
    console.log(filePath);
  

 
     const content = await s3.getObject({
         Bucket: "vercel",
         Key: `dist/${id}${filePath}`

     }).promise();
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
     res.set("Content-Type", type);
     res.send(content.Body);
})

app.listen(3001, () => {
    console.log("Server is running on port 3000");
});