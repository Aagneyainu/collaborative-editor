// utils/documentConverter.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const convertDocument = (filePath, mimeType) => {
  return new Promise((resolve, reject) => {
    // Example: Convert .docx to plain text using pandoc
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const outputPath = filePath + '.txt';
      exec(`pandoc ${filePath} -t plain -o ${outputPath}`, (error, stdout, stderr) => {
        if (error) {
          return reject(error);
        }
        fs.readFile(outputPath, 'utf8', (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });
    }
    // Handle other MIME types similarly
    else if (mimeType === 'text/plain') {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    }
    // Add more conversions as needed
    else {
      reject(new Error('Unsupported file type'));
    }
  });
};

module.exports = { convertDocument };
