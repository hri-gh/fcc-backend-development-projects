import express from 'express';

const app = express();



app.get('/api/whoami', function (req, res) {
    // Get the IP address
    const ipaddress = req.ip;

    // Get the Accept-Language header
    const language = req.headers['accept-language'];

    // Get the User-Agent header
    const software = req.headers['user-agent'];

    res.json({
        ipaddress: ipaddress,
        language: language,
        software: software,
    });
});

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
