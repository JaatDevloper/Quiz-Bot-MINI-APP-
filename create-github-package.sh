#!/bin/bash

# Script to create a GitHub-ready package of the Premium Quiz Bot Mini App

echo "📦 Creating GitHub package for Premium Quiz Bot Mini App..."

# Define the output file
OUTPUT_FILE="premium-quiz-bot-miniapp.zip"

# Remove existing zip if it exists
if [ -f "$OUTPUT_FILE" ]; then
    echo "🗑️  Removing existing package..."
    rm "$OUTPUT_FILE"
fi

# Create the zip file with all necessary files, excluding unnecessary directories
echo "📁 Packaging files..."

zip -r "$OUTPUT_FILE" \
    client/ \
    server/ \
    shared/ \
    package.json \
    package-lock.json \
    tsconfig.json \
    vite.config.ts \
    tailwind.config.ts \
    Dockerfile \
    docker-compose.yml \
    .dockerignore \
    .env.example \
    .gitignore \
    README.md \
    DEPLOYMENT.md \
    -x "*/node_modules/*" \
    -x "*/dist/*" \
    -x "*/.DS_Store" \
    -x "*/server/public/*" \
    -x "*.log" \
    -x "*/coverage/*" \
    -x "*/.nyc_output/*" \
    -x "*/tmp/*" \
    -x "*/temp/*"

echo "✅ Package created successfully: $OUTPUT_FILE"
echo ""
echo "📋 Next steps:"
echo "1. Extract this zip file"
echo "2. Create a new GitHub repository"
echo "3. Push the code to GitHub:"
echo "   git init"
echo "   git add ."
echo "   git commit -m \"Initial commit\""
echo "   git branch -M main"
echo "   git remote add origin https://github.com/yourusername/premium-quiz-bot-miniapp.git"
echo "   git push -u origin main"
echo ""
echo "4. Deploy to Koyeb following instructions in DEPLOYMENT.md"
echo ""
echo "🎉 Happy coding!"
