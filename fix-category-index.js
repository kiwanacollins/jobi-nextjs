#!/usr/bin/env node
// CommonJS version of the index cleanup script.
// Removes legacy unique index on subcategory.name and adds safer optional indexes.

/*
 Usage:
	 1. (Optional) Create or ensure .env.local / .env contains MONGODB_URI
	 2. Run: node fix-category-index.js
	 3. Review output. Safe to re-run; idempotent.
*/

// Attempt to load dotenv if present (no hard dependency) - load both .env and .env.local
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const dotenv = require('dotenv');
	dotenv.config();
	// Load .env.local manually if it exists (Next.js commonly uses it)
	const fs = require('fs');
	if (fs.existsSync('.env.local')) {
		const lines = fs.readFileSync('.env.local', 'utf-8').split(/\r?\n/);
		for (const line of lines) {
			if (!line || line.startsWith('#')) continue;
			const eq = line.indexOf('=');
			if (eq === -1) continue;
			const key = line.slice(0, eq).trim();
			const val = line.slice(eq + 1).trim();
			if (!(key in process.env)) {
				process.env[key] = val;
			}
		}
	}
} catch (_) {
	/* ignore */
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose = require('mongoose');

async function run() {
    const uri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URL || process.env.DATABASE_URL || "mongodb://localhost:27017/jobiNextjs";
	if (!uri) {
			console.error('[fix-category-index] Missing MongoDB connection string (expected MONGODB_URL or MONGODB_URI). Aborting.');
		process.exit(1);
	}

	console.log('[fix-category-index] Connecting...');
	await mongoose.connect(uri);
	const collection = mongoose.connection.collection('categories');
	const indexes = await collection.indexes();
	console.log('[fix-category-index] Current indexes:', indexes.map(i => i.name));

	// 1. Drop legacy unique subcategory index if present
	const legacyIdx = indexes.find(i => i.name === 'subcategory.name_1');
	if (legacyIdx) {
		console.log('[fix-category-index] Dropping legacy index subcategory.name_1 ...');
		try {
			await collection.dropIndex('subcategory.name_1');
			console.log('[fix-category-index] Dropped subcategory.name_1');
		} catch (e) {
			console.warn('[fix-category-index] Failed dropping subcategory.name_1 (maybe already dropped):', e.message);
		}
	} else {
		console.log('[fix-category-index] Legacy index subcategory.name_1 not found.');
	}

	// Refresh index list
	const afterDrop = await collection.indexes();

	// 2. Optional: create a text index on name for search convenience
	const hasNameText = afterDrop.some(i => i.name === 'name_text');
	if (!hasNameText) {
		try {
			console.log('[fix-category-index] Creating text index on name ...');
			await collection.createIndex({ name: 'text' }, { name: 'name_text' });
		} catch (e) {
			console.warn('[fix-category-index] Could not create name_text index:', e.message);
		}
	}

	// 3. Optional partial index on subcategory names (non-empty)
	const partialIdxName = 'subcategory_name_defined';
	const hasPartial = (await collection.indexes()).some(i => i.name === partialIdxName);
	if (!hasPartial) {
		try {
			console.log('[fix-category-index] Creating partial index on subcategory.name (non-empty)...');
			await collection.createIndex(
				{ 'subcategory.name': 1 },
				{
					name: partialIdxName,
					partialFilterExpression: { 'subcategory.name': { $type: 'string', $ne: '' } },
					unique: false
				}
			);
		} catch (e) {
			console.warn('[fix-category-index] Could not create partial index (safe to ignore):', e.message);
		}
	}

	const finalIndexes = await collection.indexes();
	console.log('[fix-category-index] Final indexes:', finalIndexes.map(i => i.name));
	await mongoose.disconnect();
	console.log('[fix-category-index] Index cleanup complete.');
}

run().catch(err => {
	console.error('[fix-category-index] Script failed:', err);
	process.exit(1);
});

