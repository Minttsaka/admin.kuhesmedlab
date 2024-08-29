import AWS from 'aws-sdk'

export async function MultiFiles(files:any){
    try{
        AWS.config.update({
            accessKeyId:process.env.NEXT_S3_ACCESS_KEY_ID,
            secretAccessKey:process.env.NEXT_S3_SECRET_ACCESS_KEY,
        })

        const s3=new AWS.S3({
            params:{
                Bucket:process.env.NEXT_S3_BUCKET_NAME,
            },
            region:'af-south-1'
        })

        const uploadedKeys:any = [];

        for (const file of files) {

            const fileKey='uploads/'+Date.now().toString()+file.name.replace(' ','-')

            const params={
                Bucket:process.env.NEXT_S3_BUCKET_NAME!,
                Key:fileKey,
                Body:file
            }

            const upload=s3.putObject(params).on('httpUploadProgress', evt=>{
                console.log('uploading to s3',parseInt(((evt.loaded*100)/evt.total).toString()))+ '%' 
              }).promise()
      
              await upload.then(data=>{
                  console.log('successfully uploaded to S3!', fileKey)
                  uploadedKeys.push(fileKey);
              })
          }

          console.log("Uploaded key =>", uploadedKeys)

        return uploadedKeys

    }catch(error){

    }
}

export function getS3Url(file_key:string){
    const url=`https://dct4life-files.s3.af-south-1.amazonaws.com/${file_key}`
    return url
}