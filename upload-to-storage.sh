#!/bin/bash

# Upload hairstyle templates to Firebase Storage
echo "🚀 Uploading hairstyle templates to Firebase Storage..."

# Set project
firebase use hairstyle-stylish

# Upload each hairstyle image
echo "📁 Creating hairstyles directory in Storage..."

# Upload classic-pompadour.png
echo "⬆️  Uploading classic-pompadour.png..."
gsutil cp hair/classic-pompadour.png gs://hairstyle-stylish.appspot.com/hairstyles/classic-pompadour.png

# Upload fade-buzz-cut.png
echo "⬆️  Uploading fade-buzz-cut.png..."
gsutil cp hair/fade-buzz-cut.png gs://hairstyle-stylish.appspot.com/hairstyles/fade-buzz-cut.png

# Upload messy-short-curls.png (note the space in filename)
echo "⬆️  Uploading messy-short-curls.png..."
gsutil cp "hair/messy-short curls.png" gs://hairstyle-stylish.appspot.com/hairstyles/messy-short-curls.png

# Upload short-bob.jpg
echo "⬆️  Uploading short-bob.jpg..."
gsutil cp hair/short-bob.jpg gs://hairstyle-stylish.appspot.com/hairstyles/short-bob.jpg

# Set public access for all hairstyle images
echo "🔓 Setting public access for hairstyle images..."
gsutil -m acl ch -r -u AllUsers:R gs://hairstyle-stylish.appspot.com/hairstyles/

# List uploaded files
echo "📋 Uploaded files:"
gsutil ls gs://hairstyle-stylish.appspot.com/hairstyles/

echo "✅ Upload completed!"