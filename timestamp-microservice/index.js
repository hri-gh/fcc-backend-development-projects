import express from 'express';

const app = express();



app.get('/api', (req, res) => {
    const date = new Date();

    res.json({
        unix: date.getTime(),
        utc: date.toUTCString()
    });
});

app.get('/api/:date', (req, res) => {
    // const dateToNuber = Number(req.params.date) // String("1451001600000") to Number(451001600000)
    // const date = new Date(dateToNuber) // Output : 2015-12-25T00:00:00.000Z
    // const milliseconds = date.getTime() // Get the milliseconds from date
    // const utcString = date.toUTCString() // Conver to UTC String
    // return res.json({unix:milliseconds, utc:utcString})

    let date;

    // If no date parameter is provided, use the current date
    if (!req.params.date) {
        date = new Date();
    } else {
        // Check if the date parameter is a number (timestamp) or a string (date string)
        if (!isNaN(req.params.date)) {
            date = new Date(parseInt(req.params.date));
        } else {
            date = new Date(req.params.date);
        }
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return res.json({ error: "Invalid Date" });
    }

    // Return the date in the required formats
    res.json({
        unix: date.getTime(),
        utc: date.toUTCString()
    });

})


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
