import { S3 } from "aws-sdk";
import { GetObjectRequest } from "aws-sdk/clients/s3";
//import fs from "fs";
//import path from "path";

const s3 = new S3(
    {
        accessKeyId: "52763b925e7071b79d7673ff2c6c767b",
        secretAccessKey: "8a898222d3532796b76be202b7ac47edb79cc3de10368fec997db8a9e29de790",
        endpoint: "https://44362250828096e358e9996f09ed85e9.r2.cloudflarestorage.com"
    }
);

import { promisify } from 'util';
import stream from 'stream';
import fs from 'fs';
import path, { join } from "path";

const pipeline = promisify(stream.pipeline);


export async function downloadS3Folder(prefix:string) {
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel",
        Prefix: prefix
    }).promise();
    console.log(allFiles.Contents);
    for (let file of allFiles.Contents!) {
        if (file.Key?.endsWith('/')) {
            // This is a directory, skip it
            continue;
        }
        //console.log(file);
        //console.log(`Processing file: ${file.Key}`);
        const localFilePath = path.join(__dirname, file.Key || "");
        const localDirPath = path.dirname(localFilePath);

        fs.mkdirSync(localDirPath, { recursive: true });

        const params = {
            Bucket: "vercel",
            Key: file.Key || ""
        };
       
       // console.log(localFilePath);

        //const localDirPath =join(__dirname + localFilePath);
       // console.log(localDirPath);
        //fs.mkdirSync(localDirPath, { recursive: true });
        const downloadStream = s3.getObject(params).createReadStream();
        const writeStream = fs.createWriteStream(localFilePath);
        await pipeline(downloadStream, writeStream);
    }
}

export const uploadFile = async(fileName: string, localFilePath: string) => {
 
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName
    }).promise();
    console.log(response);
}