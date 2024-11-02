const express = require('express');
const path = require('path');
const speedTest = require('speedtest-net');
const cors = require('cors'); // Import the CORS package
const router = express.Router();
const app = express();
const PORT = 4000;

const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://sime.no',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

// Serve the index.html file for the root route
router.get('/', (req, res) => {
  res.sendStatus(200);
});

app.use('/', router);

app.get('/speed-test', async (req, res) => {
  try {
    // Run the speed test with user consent for GDPR and license acceptance
    const result = await speedTest({ acceptLicense: true, acceptGdpr: true });

    // Convert results to Mbps and return as JSON
    res.status(200).json({
      downloadSpeed: (result.download.bandwidth / (1024 * 1024)).toFixed(2), // Mbps
      uploadSpeed: (result.upload.bandwidth / (1024 * 1024)).toFixed(2), // Mbps
      ping: result.ping.latency.toFixed(2), // ms
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Speed test failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = router;
