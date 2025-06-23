const fs = require('fs');
const path = require('path');

// Create the uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created successfully.');
} else {
    console.log('Uploads directory already exists.');
    
    // List files in the uploads directory
    const files = fs.readdirSync(uploadsDir);
    console.log(`Found ${files.length} files in uploads directory:`);
    files.forEach(file => {
        const stats = fs.statSync(path.join(uploadsDir, file));
        const fileSizeInKB = (stats.size / 1024).toFixed(2);
        console.log(`- ${file} (${fileSizeInKB} KB)`);
    });
}

console.log('\nUploads directory path:', uploadsDir);
console.log('Make sure this directory is accessible via the /uploads endpoint in your server.js');
