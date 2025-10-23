import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Job from '@/database/job.model';
import cloudinary from 'cloudinary';
import type { Types } from 'mongoose';

interface JobWithImage {
  _id: Types.ObjectId;
  company: string;
  companyImage?: string;
}

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function isBase64DataUrl(str: string): boolean {
  if (!str) return false;
  return str.startsWith('data:image/');
}

async function uploadBase64ToCloudinary(
  base64String: string,
  jobId: string,
  companyName: string
): Promise<string> {
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

  return result.secure_url;
}

export async function POST(request: Request) {
  try {
    // Simple authentication - check for admin email or secret key
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // Use a simple secret from environment or hardcoded (change this!)
    if (secret !== process.env.MIGRATION_SECRET && secret !== 'migrate-now-2025') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const jobs = await Job.find({}).lean<JobWithImage[]>();
    
    let base64Count = 0;
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const job of jobs) {
      const companyImage = job.companyImage;

      if (!companyImage) {
        skippedCount++;
        continue;
      }

      if (!isBase64DataUrl(companyImage)) {
        skippedCount++;
        continue;
      }

      base64Count++;

      try {
        const cloudinaryUrl = await uploadBase64ToCloudinary(
          companyImage,
          job._id.toString(),
          job.company
        );

        await Job.findByIdAndUpdate(job._id, {
          companyImage: cloudinaryUrl
        });

        migratedCount++;
      } catch (error: any) {
        errorCount++;
        errors.push(`${job.company}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalJobs: jobs.length,
        base64Count,
        migratedCount,
        skippedCount,
        errorCount,
        errors
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
