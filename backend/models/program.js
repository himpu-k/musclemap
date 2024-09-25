const mongoose = require('mongoose')

const programSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  programName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  exercises: [
    {
      apiId: String, // ID from external API
      sets: [
        {
          setNumber: Number,
          reps: Number,
          weight: Number,
        }
      ],
    }
  ],
})

programSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Program = mongoose.model('Program', programSchema)

module.exports = Program
