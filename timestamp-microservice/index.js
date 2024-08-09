// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
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

app.get('/api', (req, res) => {
  const date = new Date();

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
