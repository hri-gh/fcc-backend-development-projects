import express from 'express';

const app = express();
const port = process.env.PORT || 8000


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


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
