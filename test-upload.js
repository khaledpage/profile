// Simple Node.js test for upload functionality
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function createTestZip() {
  const zip = new JSZip();
  
  // Create test article metadata
  const metadata = {
    title: 'Test Upload Article',
    summary: 'This is a test article uploaded via ZIP',
    category: 'Testing',
    tags: ['test', 'upload'],
    author: 'Test Author',
    publishDate: new Date().toISOString(),
    readingTime: 3,
    featured: false,
    published: true  // Add this required field
  };
  
  const content = `# Test Upload Article

This is a test article that was uploaded via ZIP file.

## Content

This article contains some test content to verify the upload functionality works correctly.

### Features Tested

- Article metadata processing
- Markdown content extraction
- File structure creation
- Asset handling (if any)
`;

  // Add files to zip
  zip.file('metadata.json', JSON.stringify(metadata, null, 2));
  zip.file('article.md', content);
  
  // Generate the ZIP
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  
  // Save to temp file
  const tempPath = path.join(__dirname, 'test-article.zip');
  fs.writeFileSync(tempPath, zipBuffer);
  
  console.log('Test ZIP created at:', tempPath);
  return tempPath;
}

async function testUpload() {
  try {
    const zipPath = await createTestZip();
    
    // Read the ZIP file
    const zipBuffer = fs.readFileSync(zipPath);
    
    // Create FormData-like structure for fetch
    const FormData = require('form-data');
    const form = new FormData();
    form.append('files', zipBuffer, {
      filename: 'test-article.zip',
      contentType: 'application/zip'
    });
    
    // Test the upload endpoint
    const fetch = require('node-fetch');
    const response = await fetch('http://localhost:3001/api/articles', {
      method: 'POST',
      headers: {
        'x-admin-key': 'admin', // Correct admin password
        ...form.getHeaders()
      },
      body: form
    });
    
    const result = await response.json();
    console.log('Upload response:', result);
    
    if (response.ok) {
      console.log('✅ Upload successful!');
      console.log('Results:', result.results);
    } else {
      console.log('❌ Upload failed:', result.error);
    }
    
    // Clean up
    fs.unlinkSync(zipPath);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testUpload();
