const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(express.json()); // Parse JSON bodies

app.post('/verify', (req, res) => {
  const { conjecture, proof } = req.body;
  
  if (!conjecture || !proof) {
    return res.status(400).json({ error: 'Both conjecture and proof must be provided.' });
  }
  
  // Create a temporary file to store the Lean code.
  // In production, consider using a unique filename (e.g., with a UUID) or a temporary file library.
  const tempFile = path.join(__dirname, 'temp.lean');
  
  // Combine the conjecture and the proof into one Lean file.
  const leanCode = `${conjecture}\n\n${proof}`;
  
  fs.writeFile(tempFile, leanCode, (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Error writing temporary Lean file.' });
    }
    
    // Execute Lean on the temporary file.
    exec(`lean ${tempFile}`, (execErr, stdout, stderr) => {
      // Delete the temporary file after execution.
      fs.unlink(tempFile, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error removing temporary file:', unlinkErr);
        }
      });
      
      // If Lean returns an error, the proof did not verify the conjecture.
      if (execErr) {
        return res.json({ verified: false, details: stderr });
      }
      
      // If Lean ran without error, the proof verifies the conjecture.
      return res.json({ verified: true });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
