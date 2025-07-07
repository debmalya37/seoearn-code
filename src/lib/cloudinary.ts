import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Configure via your env, e.g. CLOUDINARY_URL or individually:
cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
})

/**
 * Uploads a local file path to Cloudinary.
 * @param localFilePath  path to the temporary upload (formidable)
 * @param folder         folder inside your Cloudinary account, e.g. "kyc/{userId}"
 * @returns secure HTTPS URL
 */
export async function uploadToCloudinary(
  localFilePath: string,
  folder: string
): Promise<string> {
  // Note: you could also stream if you prefer
  const result = await cloudinary.uploader.upload(localFilePath, {
    folder,
    resource_type: 'image',
    use_filename:  true,
    unique_filename: false,
    overwrite:    true,
  })
  // delete the temp file
  fs.unlink(localFilePath, () => {})
  return result.secure_url
}
