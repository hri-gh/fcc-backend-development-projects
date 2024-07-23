import express from 'express';
import bodyParser from 'body-parser';
import url from 'url'
import dns from 'dns'

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// In-memory storage for URL shortening
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

    // Add URL to database and return response
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


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
