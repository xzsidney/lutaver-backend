#!/bin/bash
# Force clean Prisma Client regeneration

echo "🧹 Cleaning Prisma Client..."
rm -rf node_modules/@prisma/client
rm -rf node_modules/.prisma

echo "🔨 Regenerating Prisma Client..."
npx prisma generate

echo "✅ Done! Now restart your server with: npm run dev"
