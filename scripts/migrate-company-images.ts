/**
 * Migration Script: Convert Base64 Company Images to Cloudinary URLs
 * 
 * This script:
 * 1. Finds all jobs with base64 companyImage data
 * 2. Uploads those images to Cloudinary
 * 3. Updates the database with the Cloudinary URLs
 * 
 * Usage: npx tsx scripts/migrate-company-images.ts
 */

import cloudinary from 'cloudinary';
import { connectToDatabase } from '@/lib/mongoose';
import Job from '@/database/job.model';
import type { Types } from 'mongoose';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Define type for job with base fields
interface JobWithImage {
  _id: Types.ObjectId;
  company: string;
  companyImage?: string;
}

/**
 * Check if a string is a base64 data URL
 */
function isBase64DataUrl(str: string): boolean {
  if (!str) return false;
  return str.startsWith('data:image/');
}

/**
 * Upload base64 image to Cloudinary
 */
async function uploadBase64ToCloudinary(
  base64String: string,
  jobId: string,
  companyName: string
): Promise<string> {
  try {
    // Create a safe folder name from company name
    const safeFolderName = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const result = await cloudinary.v2.uploader.upload(base64String, {
      folder: `ugandanjobs/company-logos/${safeFolderName}`,
      public_id: `logo-${jobId}`,
      resource_type: 'image',
      overwrite: true,
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    console.log(`✓ Uploaded image for ${companyName} (Job ID: ${jobId})`);
    return result.secure_url;
  } catch (error) {
    console.error(`✗ Failed to upload image for ${companyName}:`, error);
    throw error;
  }
}

/**
 * Main migration function
 */
async function migrateCompanyImages() {
  console.log('🚀 Starting company image migration...\n');

  try {
    // Connect to database
    await connectToDatabase();
    console.log('✓ Connected to database\n');

    // Find all jobs with base64 company images
    const jobs = await Job.find({}).lean<JobWithImage[]>();
    console.log(`Found ${jobs.length} total jobs\n`);

    let base64Count = 0;
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const job of jobs) {
      const companyImage = job.companyImage;

      // Skip if no company image
      if (!companyImage) {
        console.log(`⊘ Skipped: ${job.company} (no image)`);
        skippedCount++;
        continue;
      }

      // Skip if already a URL (not base64)
      if (!isBase64DataUrl(companyImage)) {
        console.log(`⊘ Skipped: ${job.company} (already a URL)`);
        skippedCount++;
        continue;
      }

      base64Count++;

      try {
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadBase64ToCloudinary(
          companyImage,
          job._id.toString(),
          job.company
        );

        // Update database
        await Job.findByIdAndUpdate(job._id, {
          companyImage: cloudinaryUrl
        });

        migratedCount++;
        console.log(`  → New URL: ${cloudinaryUrl}\n`);
      } catch (error) {
        errorCount++;
        console.error(`  → Error details:`, error, '\n');
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`Total jobs processed:     ${jobs.length}`);
    console.log(`Base64 images found:      ${base64Count}`);
    console.log(`Successfully migrated:    ${migratedCount}`);
    console.log(`Skipped (already URLs):   ${skippedCount}`);
    console.log(`Errors:                   ${errorCount}`);
    console.log('='.repeat(60));

    if (migratedCount > 0) {
      console.log('\n✅ Migration completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Test WhatsApp sharing on migrated jobs');
      console.log('2. Clear WhatsApp cache using Facebook Debugger:');
      console.log('   https://developers.facebook.com/tools/debug/');
    } else if (base64Count === 0) {
      console.log('\n✅ No base64 images found. All jobs already use URLs!');
    } else {
      console.log('\n⚠️  Migration completed with errors. Review the logs above.');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run migration
migrateCompanyImages();
