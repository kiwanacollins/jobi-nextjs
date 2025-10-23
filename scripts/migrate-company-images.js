/**
 * Migration Script: Convert Base64 Company Images to Cloudinary URLs
 * 
 * This script:
 * 1. Finds all jobs with base64 companyImage data
 * 2. Uploads those images to Cloudinary
 * 3. Updates the database with the Cloudinary URLs
 * 
 * Usage: node scripts/migrate-company-images.js
 */

const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/jobiNextjs';

// Job Schema (simplified for migration)
const jobSchema = new mongoose.Schema({
  company: String,
  companyImage: String,
  // ... other fields
}, { strict: false });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

/**
 * Check if a string is a base64 data URL
 */
function isBase64DataUrl(str) {
  if (!str) return false;
  return str.startsWith('data:image/');
}

/**
 * Upload base64 image to Cloudinary
 */
async function uploadBase64ToCloudinary(base64String, jobId, companyName) {
  try {
    // Create a safe folder name from company name
    const safeFolderName = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const result = await cloudinary.uploader.upload(base64String, {
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
    console.error(`✗ Failed to upload image for ${companyName}:`, error.message);
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
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to database\n');

    // Find all jobs with base64 company images
    const jobs = await Job.find({}).lean();
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
        console.error(`  → Error: ${error.message}\n`);
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total jobs found:          ${jobs.length}`);
    console.log(`Jobs with base64 images:   ${base64Count}`);
    console.log(`Successfully migrated:     ${migratedCount}`);
    console.log(`Skipped (already URLs):    ${skippedCount}`);
    console.log(`Errors:                    ${errorCount}`);
    console.log('='.repeat(60) + '\n');

    if (migratedCount > 0) {
      console.log('✅ Migration completed successfully!');
      console.log('💡 Company logos will now display when jobs are shared on WhatsApp.\n');
    } else if (base64Count === 0) {
      console.log('ℹ️  No base64 images found. All images are already URLs.\n');
    } else {
      console.log('⚠️  Migration completed with errors. Check the output above.\n');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run migration
migrateCompanyImages()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
