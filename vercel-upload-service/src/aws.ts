import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3(
    {
        accessKeyId: "52763b925e7071b79d7673ff2c6c767b",
        secretAccessKey: "8a898222d3532796b76be202b7ac47edb79cc3de10368fec997db8a9e29de790",
        endpoint: "https://44362250828096e358e9996f09ed85e9.r2.cloudflarestorage.com"
    }
);

//fileName =>output/id/src/app.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx

export const uploadFile = async(fileName: string, localFilePath: string) => {
 
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName
    }).promise();
    //console.log(response);
}