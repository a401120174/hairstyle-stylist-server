const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin (you may need to set up service account)
// admin.initializeApp();

const hairstyles = [
  { key: "classic-pompadour", file: "classic-pompadour.png", storageName: "classic-pompadour.png" },
  { key: "fade-buzz-cut", file: "fade-buzz-cut.png", storageName: "fade-buzz-cut.png" },
  { key: "messy-short-curls", file: "messy-short curls.png", storageName: "messy-short-curls.png" },
  { key: "short-bob", file: "short-bob.jpg", storageName: "short-bob.jpg" }
];

async function uploadHairstylesToStorage() {
  console.log('Starting upload of hairstyle templates to Firebase Storage...\n');

  const bucket = admin.storage().bucket();

  for (const hairstyle of hairstyles) {
    try {
      const localFilePath = path.join(__dirname, 'hair', hairstyle.file);
      
      if (!fs.existsSync(localFilePath)) {
        console.log(`❌ File not found: ${localFilePath}`);
        continue;
      }

      // Use clean storage name
      const storagePath = `hairstyles/${hairstyle.storageName}`;
      
      const file = bucket.file(storagePath);
      
      // Upload file
      await file.save(fs.readFileSync(localFilePath), {
        metadata: {
          contentType: hairstyle.file.endsWith('.png') ? 'image/png' : 'image/jpeg',
        },
        public: true,
      });

      // Make publicly accessible
      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
      
      console.log(`✅ Uploaded: ${hairstyle.key}`);
      console.log(`   Local: ${localFilePath}`);
      console.log(`   Storage: ${storagePath}`);
      console.log(`   URL: ${publicUrl}\n`);

    } catch (error) {
      console.log(`❌ Error uploading ${hairstyle.key}:`, error.message);
    }
  }

  console.log('Upload process completed!');
}

// Run the upload
if (require.main === module) {
  uploadHairstylesToStorage().catch(console.error);
}

module.exports = { uploadHairstylesToStorage };