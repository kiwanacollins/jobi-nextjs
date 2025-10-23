# WhatsApp Sharing Fix: Company Logo Migration Guide

## The Problem

WhatsApp and Facebook scrapers **cannot access base64 data URLs**. Your jobs currently have company logos stored as base64 strings in the database, which is why they don't appear in WhatsApp link previews.

Example of what's NOT working:
```
companyImage: "data:image/png;base64,iVBORw0KGgo..."
```

What WILL work:
```
companyImage: "https://res.cloudinary.com/your-account/image/upload/..."
```

## Solution Overview

We've created:
1. ✅ **Migration script** - Converts existing base64 images to Cloudinary URLs
2. ✅ **Cloudinary utilities** - Helper functions for image uploads
3. ✅ **Automatic upload** - New jobs will auto-upload to Cloudinary
4. ✅ **SEO optimization** - Images are properly sized for WhatsApp (1200x630)

---

## Step 1: Run the Migration Script

This will convert all existing base64 company images to Cloudinary URLs.

```bash
npm run migrate:images
```

**What it does:**
- Scans all jobs in your database
- Finds jobs with base64 `companyImage` data
- Uploads each image to Cloudinary
- Updates the database with the new Cloudinary URLs
- Provides a detailed summary report

**Expected output:**
```
🚀 Starting company image migration...

✓ Connected to database

Found 150 total jobs

✓ Uploaded image for Mogo Uganda (Mogo Loans Limited) (Job ID: 68f9207bc5073c3a3fb14ae7)
  → New URL: https://res.cloudinary.com/your-account/image/upload/v1234567890/ugandanjobs/company-logos/mogo-uganda-mogo-loa/logo-68f9207bc5073c3a3fb14ae7.png

✓ Uploaded image for Urban Greens Ltd (Job ID: 68f8ba8fc5073c3a3fb14a68)
  → New URL: https://res.cloudinary.com/your-account/image/upload/v1234567890/ugandanjobs/company-logos/urban-greens-ltd/logo-68f8ba8fc5073c3a3fb14a68.png

============================================================
📊 Migration Summary:
============================================================
Total jobs processed:     150
Base64 images found:      95
Successfully migrated:    95
Skipped (already URLs):   55
Errors:                   0
============================================================

✅ Migration completed successfully!

Next steps:
1. Test WhatsApp sharing on migrated jobs
2. Clear WhatsApp cache using Facebook Debugger:
   https://developers.facebook.com/tools/debug/
```

---

## Step 2: Test WhatsApp Sharing

After migration, test a job URL:

1. **Get a job URL**, e.g.:
   ```
   https://ugandanjobs.net/jobs/mogo-uganda-mogo-loa-legal-officer
   ```

2. **Clear WhatsApp's cache** using Facebook Sharing Debugger:
   - Go to: https://developers.facebook.com/tools/debug/
   - Paste your job URL
   - Click "Scrape Again" to force WhatsApp to re-fetch
   - Check that the company logo appears in the preview

3. **Share on WhatsApp**:
   - Send the URL to yourself or a test contact
   - Verify the company logo appears in the link preview

---

## Step 3: Verify Future Jobs Auto-Upload

From now on, all new jobs will automatically convert base64 images to Cloudinary URLs. Here's what happens:

**When creating a new job:**
```typescript
// Old behavior (base64 stored directly):
companyImage: "data:image/png;base64,..."  ❌

// New behavior (auto-uploaded to Cloudinary):
companyImage: "https://res.cloudinary.com/..."  ✅
```

**No code changes needed** - it happens automatically in `job.action.ts`.

---

## How It Works

### 1. Migration Script (`scripts/migrate-company-images.ts`)
- Finds all jobs with base64 images
- Uploads to Cloudinary folder: `ugandanjobs/company-logos/{company-name}/`
- Updates database with Cloudinary URLs
- Applies transformations: 800x800 max size, auto quality, auto format

### 2. Cloudinary Utilities (`src/lib/cloudinary-utils.ts`)
Helper functions:
- `uploadBase64ToCloudinary()` - Upload base64 string
- `uploadBufferToCloudinary()` - Upload file buffer
- `ensureCloudinaryUrl()` - Smart function that detects base64 and converts
- `isBase64DataUrl()` - Check if string is base64

### 3. Automatic Upload (`src/lib/actions/job.action.ts`)
When creating jobs:
```typescript
// Automatically converts base64 to Cloudinary URL
let finalCompanyImage = companyImage;
if (companyImage) {
  finalCompanyImage = await ensureCloudinaryUrl(
    companyImage,
    'ugandanjobs/company-logos',
    `${slug}-logo`
  );
}
```


### 4. WhatsApp-Optimized Metadata (`src/lib/seo.ts`)
The `ensureSocialImageSize()` function applies:
- 1200x630 dimensions (WhatsApp recommended)
- White background fill
- Auto quality and format
- URL: `https://res.cloudinary.com/.../w_1200,h_630,c_fill,b_white/.../image.png`

---

## Troubleshooting

### Problem: Migration fails with Cloudinary error
**Check:**
1. Cloudinary credentials in `.env.local`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
2. Verify credentials at: https://console.cloudinary.com/console

### Problem: WhatsApp still shows old logo/no logo
**Solution:**
1. Clear WhatsApp cache using Facebook Debugger:
   - https://developers.facebook.com/tools/debug/
   - Paste job URL
   - Click "Scrape Again" multiple times
2. WhatsApp caches previews for 7 days - may need to wait or use debugger

### Problem: Some jobs didn't migrate
**Check the logs:**
- Script shows which jobs failed and why
- Common issues:
  - Corrupt base64 data
  - Cloudinary quota exceeded
  - Network timeout

**Re-run migration:**
```bash
npm run migrate:images
```
(Safe to run multiple times - skips already-migrated images)

---

## Manual Migration (If Needed)

If automatic migration fails for specific jobs, migrate manually:

```typescript
import { uploadBase64ToCloudinary } from '@/lib/cloudinary-utils';

// Get base64 string
const base64Image = "data:image/png;base64,iVBORw0KGgo...";

// Upload to Cloudinary
const cloudinaryUrl = await uploadBase64ToCloudinary(
  base64Image,
  'ugandanjobs/company-logos',
  'manual-upload-logo'
);

console.log('New URL:', cloudinaryUrl);
// Update job manually in database with this URL
```

---

## Verification Checklist

After migration, verify:

- [ ] Run migration script successfully
- [ ] Check migration summary shows 0 errors
- [ ] Test 3-5 job URLs on WhatsApp
- [ ] Verify logos appear in link previews
- [ ] Clear WhatsApp cache using Facebook Debugger
- [ ] Create a new test job and verify auto-upload works
- [ ] Check Cloudinary dashboard for uploaded images

---

## Key Files Modified

1. **scripts/migrate-company-images.ts** - Migration script
2. **src/lib/cloudinary-utils.ts** - Upload helpers
3. **src/lib/actions/job.action.ts** - Auto-upload for new jobs
4. **package.json** - Added `migrate:images` script

---

## Facebook Sharing Debugger

Always use this tool after changes:
**URL:** https://developers.facebook.com/tools/debug/

**How to use:**
1. Paste your job URL
2. Click "Scrape Again"
3. Check "Preview" tab for logo
4. Verify Open Graph tags:
   - `og:image` should be Cloudinary URL
   - `og:image:width` should be 1200
   - `og:image:height` should be 630

---

## Expected Results

### Before Migration:
```html
<meta property="og:image" content="https://ugandanjobs.net/data:image/png;base64,iVBORw0KGgo..."/>
```
❌ WhatsApp cannot access this

### After Migration:
```html
<meta property="og:image" content="https://res.cloudinary.com/your-account/image/upload/w_1200,h_630,c_fill,b_white/ugandanjobs/company-logos/mogo-uganda/logo.png"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
```
✅ WhatsApp shows company logo in preview

---

## Need Help?

If you encounter issues:

1. **Check migration logs** - Shows specific errors
2. **Verify Cloudinary credentials** - Test in console
3. **Use Facebook Debugger** - See what WhatsApp sees
4. **Check job document** - Verify `companyImage` is Cloudinary URL

**Questions?** Review the code comments in:
- `scripts/migrate-company-images.ts`
- `src/lib/cloudinary-utils.ts`
