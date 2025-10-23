/**
 * Cloudinary Upload Utilities
 * 
 * Helper functions for uploading images to Cloudinary
 */

import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a base64 image to Cloudinary and return the URL
 * 
 * @param base64String - The base64 data URL
 * @param folder - Cloudinary folder path
 * @param publicId - Optional public ID for the image
 * @returns Cloudinary secure URL
 */
export async function uploadBase64ToCloudinary(
  base64String: string,
  folder: string = 'ugandanjobs/company-logos',
  publicId?: string
): Promise<string> {
  try {
    const uploadOptions: any = {
      folder,
      resource_type: 'image',
      overwrite: true,
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const result = await cloudinary.v2.uploader.upload(base64String, uploadOptions);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Upload a file buffer to Cloudinary and return the URL
 * 
 * @param fileBuffer - The file buffer
 * @param folder - Cloudinary folder path
 * @param publicId - Optional public ID for the image
 * @returns Cloudinary secure URL
 */
export async function uploadBufferToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'ugandanjobs/company-logos',
  publicId?: string
): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder,
        resource_type: 'image',
        overwrite: true,
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      };

      if (publicId) {
        uploadOptions.public_id = publicId;
      }

      cloudinary.v2.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('No result from Cloudinary'));
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error('Error uploading buffer to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Check if a string is a base64 data URL
 */
export function isBase64DataUrl(str: string): boolean {
  if (!str) return false;
  return str.startsWith('data:image/');
}

/**
 * Ensure an image is stored in Cloudinary (convert base64 if needed)
 * 
 * @param imageUrl - The image URL or base64 string
 * @param folder - Cloudinary folder path
 * @param publicId - Optional public ID for the image
 * @returns Cloudinary secure URL
 */
export async function ensureCloudinaryUrl(
  imageUrl: string,
  folder: string = 'ugandanjobs/company-logos',
  publicId?: string
): Promise<string> {
  // If it's already a Cloudinary URL, return it
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  // If it's a base64 data URL, upload it
  if (isBase64DataUrl(imageUrl)) {
    return uploadBase64ToCloudinary(imageUrl, folder, publicId);
  }

  // If it's a regular URL, return it as-is
  // (You could also fetch and re-upload if needed)
  return imageUrl;
}
