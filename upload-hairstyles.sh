#!/bin/bash

# 上傳髮型圖片到 Firebase Storage
echo "🚀 開始上傳髮型圖片到 Firebase Storage..."

# 確保在正確的目錄
cd /Users/al02462139/hairstyle-stylist-server

# 上傳 hair 目錄中的圖片到 Storage 的 hairstyles 目錄
echo "📂 上傳 classic-pompadour.png..."
firebase storage:upload hair/classic-pompadour.png hairstyles/classic-pompadour.png

echo "📂 上傳 fade-buzz-cut.png..."
firebase storage:upload hair/fade-buzz-cut.png hairstyles/fade-buzz-cut.png

echo "📂 上傳 messy-short-curls.png..."
firebase storage:upload "hair/messy-short curls.png" hairstyles/messy-short-curls.png

echo "✅ 上傳完成！"

# 設置 Storage 規則為公開讀取（可選）
echo "🔒 更新 Storage 規則..."
firebase deploy --only storage

echo "🎉 所有髮型圖片已成功上傳到 Firebase Storage!"