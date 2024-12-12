#!/bin/bash

# Build the application
npm run build

# Create deployment directory
mkdir -p deployment

# Copy necessary files
cp -r .next deployment/
cp -r public deployment/
cp -r node_modules deployment/
cp package.json deployment/
cp server.js deployment/
cp .env.local deployment/

# Create a zip file
cd deployment
zip -r ../deploy.zip ./*
cd ..

# Clean up
rm -rf deployment