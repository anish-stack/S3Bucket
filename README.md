# AWS S3 File Upload Setup with Node.js & React

This project demonstrates how to upload files (images/videos) from a React frontend to an AWS S3 bucket using signed URLs from a Node.js backend.

---

## 🛠 Prerequisites

1. **AWS Account** with root access
2. **Node.js and npm** installed
3. Basic knowledge of **React**, **Express**, and **AWS IAM**

---

## 🔐 AWS S3 Setup

### 1. IAM Configuration

1. Log in as AWS root user.
2. Go to the **IAM** service:
   - Create a **Group** with S3 permissions.
   - Create a **User** and add it to that group.
   - Attach the following policy to allow S3 access:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["s3:GetObject", "s3:PutObject"],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }


2. S3 Bucket Setup
Create a new bucket.

Disable "Block all public access" (optional – only for static content like images/videos).

Add Bucket Policy (if making public access available):

json
Copy
Edit
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
3. CORS Policy
Set CORS configuration like below:

json
Copy
Edit
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
⚙️ Backend Setup (Node.js)
1. Install Dependencies
bash
Copy
Edit
npm i express dotenv cors multer @aws-sdk/client-s3@3.400.0 @aws-sdk/s3-request-presigner@3.400.0

AND FOLLOW MY CODE
