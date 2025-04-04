import express from 'express';
import cors from 'cors'
import config from './config/config.js';
import upload from './middleware/multer.js';
import { getObjectUrl, pre_signed_url } from './utils/s3.js';

const app = express();
const PORT = config.PORT


app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello from the server')
})

console.log("Url ",await getObjectUrl('image.webp'))

app.post('/upload-file', upload.single('file'), async (req, res) => {
    try {
        const file = req.file || {};
        console.log(file)
        if (!file) {
            return res.status(400).json({ message: 'File not found' });
        }
        const filePath = file.path;
        const fileName = file.filename;
        const fileType = file.mimetype;
    
        const { signedUrl, fileLink } = await pre_signed_url({
            key: fileName,
            contentType: fileType
        })

        res.status(200).json({
            message: 'File uploaded successfully',
            signedUrl,
            fileLink
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})