require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const url = require('url');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));


let urlDatabase = [];
let urlCounter = 1;

// Helper function to validate URLs
const isValidUrl = (inputUrl) => {
  const parsedUrl = url.parse(inputUrl);
  return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
};

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});


// POST endpoint to shorten URL
app.post('/api/shorturl', (req, res) => {
  const { url: originalUrl } = req.body;
  console.log("URL::", originalUrl)

  if (!isValidUrl(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Add URL to array and return response
  const shortUrl = urlCounter++;
  urlDatabase.push({ originalUrl, shortUrl });
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// GET endpoint to redirect to original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = parseInt(req.params.shortUrl);

  const urlEntry = urlDatabase.find(entry => entry.shortUrl === shortUrl);
  if (urlEntry) {
    res.redirect(urlEntry.originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
