const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()

const app = express()

//Connect database
mongoose.connect("mongodb://127.0.0.1:27017/exercise-tracker" || process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const Schema = mongoose.Schema;

// Schemas
const UserSchema = new Schema({
  username: String,
  exercises: [
    {
      description: {
        type: String
      },
      duration: {
        type: Number
      },
      date: {
        type: Date,
        default: new Date()
      },
    }
  ]
})

// const ExerciseSchema = new Schema({
//     description: {
//         type: String
//     },
//     duration: {
//         type: Number
//     },
//     Date: {
//         type: Date,
//         default: Date.now()
//     },
// })

// Models
const UserModel = mongoose.model('User', UserSchema)
// const ExerciseModel = mongoose.model('Exercise', ExerciseSchema)

// Api endpoints and their functions
app.post("/api/users", async (req, res) => {
  const { username } = req.body
  try {
    const newUser = new UserModel({
      username,
    })
    const user = await newUser.save()
    const formattedUser = { username: user.username, _id: user._id }
    // console.log("USER::", formattedUser)
    res.json(formattedUser)
  } catch (error) {
    console.error(error.message)
  }

})

app.get("/api/users", async (req, res) => {
  try {
    const users = await UserModel.find()
    res.json(users)
  } catch (error) {
    console.error(error.message)
  }
})

app.post("/api/users/:_id/exercises", async (req, res) => {
  const _id = req.params._id
  const { description, duration, date } = req.body
  try {
    const user = await UserModel.findById(_id)

    const data = {
      description,
      duration,
      date
    }
    user.exercises.push(data)
    const userData = await user.save()
    const arrLength = userData.exercises.length - 1
    const doc = {
      username: userData.username,
      description: userData.exercises[arrLength].description,
      duration: userData.exercises[arrLength].duration,
      date: userData.exercises[arrLength].date.toDateString(),
      _id: userData._id,
    }
    // console.log(doc)
    return res.json({ User: doc })
  } catch (error) {
    console.error(error.message)
  }
})

app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    const _id = req.params._id
    const { from, to, limit } = req.query
    console.log(req.query)

    const user = await UserModel.findById(_id)

    let logs = user.exercises

    // Filter logs by date range
    if (from) {
      const fromDate = new Date(from);
      logs = logs.filter(log => new Date(log.date) >= fromDate)
    }

    if (to) {
      const toDate = new Date(to);
      logs = logs.filter(log => new Date(log.date) <= toDate);
    }

    // Limit the number of logs
    if (limit) {
      logs = logs.slice(0, parseInt(limit));
    }


    const formattedDoc = {
      username: user.username,
      count: user.exercises.length,
      _id: user._id,
      log: logs.map((exercise) => {
        return {
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date.toDateString(),
        }
      })
    }

    // console.log("User::", formattedDoc)
    return res.json(formattedDoc)
  } catch (error) {
    console.error(error.message)
  }
})

// api/user/:_id/logs?from=2024-01-01&to=2024-07-21&limit=3

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
