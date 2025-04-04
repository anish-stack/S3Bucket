import { PutObjectCommand, S3Client ,GetObjectCommand} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import config from '../config/config.js'

const s3Client = new S3Client({
    region: config.AWS.Region,
    credentials: {
        accessKeyId: config.AWS.AccessKeyId,
        secretAccessKey: config.AWS.AWSSecretKey
    }
})

const BUCEKT_NAME = config.AWS.BucketName


export const pre_signed_url = async ({ key, contentType }) => {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCEKT_NAME,
            Key: key,
            ContentType: contentType
        })
        const fileLink = `https://${BUCEKT_NAME}.s3.${config.AWS.Region}.amazonaws.com/${key}`;
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 5 * 60,
        });
        return { fileLink, signedUrl };
    } catch (error) {
        throw new Error(`Error generating pre-signed URL: ${error.message}`);
    }
}

export const getObjectUrl = async (key) => {
    try {

        const command = new GetObjectCommand({
            Bucket: BUCEKT_NAME,
            Key: key,
        })


        const url = await getSignedUrl(s3Client, command)
        if (!url) {
            throw new Error('Failed to generate signed URL')
        }

        return { url };
    } catch (error) {
        throw new Error(`Error generating pre-signed URL: ${error.message}`);
    }
}