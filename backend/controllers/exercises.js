const exerciseRouter = require('express').Router()
const axios = require('axios')
// https://wger.de/api/v2/schema/ui#/

// Fetch all exercise categories from wger API (http://localhost:3001/api/exercises/exercisecategory)
/*
Data format:
{
  "count": 8,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 10,
      "name": "Abs"
    },
    ...
  ]
}
*/
exerciseRouter.get('/exercisecategory', async (request, response) => {
  try {
    const result = await axios.get(`${process.env.WGER_API_BASE_URL}/exercisecategory`)

    // Respond with the exercise data
    response.json(result.data)
  } catch (error) {
    console.error('Error fetching exercises:', error)
    response.status(500).json({ error: 'Failed to fetch exercise data' })
  }
})

// Fetch exercise information from wger API
/*
Data format of the exercise ALONE:
{
         "id":345,
         "name":"2 Handed Kettlebell Swing",
         "aliases":[

         ],
         "uuid":"c788d643-150a-4ac7-97ef-84643c6419bf",
         "exercise_base_id":9,
         "description":"<p>Two Handed Russian Style Kettlebell swing</p>",
         "created":"2023-08-06T10:17:17.349574+02:00",
         "category":{
            "id":10,
            "name":"Abs"
         },
         "muscles":[

         ],
         "muscles_secondary":[

         ],
         "equipment":[
            {
               "id":10,
               "name":"Kettlebell"
            }
         ],
         "language":{
            "id":2,
            "short_name":"en",
            "full_name":"English",
            "full_name_en":"English"
         },
         "license":{
            "id":2,
            "full_name":"Creative Commons Attribution Share Alike 4",
            "short_name":"CC-BY-SA 4",
            "url":"https://creativecommons.org/licenses/by-sa/4.0/deed.en"
         },
         "license_author":"deusinvictus",
         "images":[

         ],
         "videos":[

         ],
         "comments":[

         ],
         "variations":[
            249,
            345
         ],
         "author_history":[
            "deusinvictus"
         ]
      }
*/
exerciseRouter.get('/exerciseinfo', async (request, response) => {
  try {
    const result = await axios.get(`${process.env.WGER_API_BASE_URL}/exerciseinfo`)

    // Respond with the exercise data
    response.json(result.data)
  } catch (error) {
    console.error('Error fetching exercises:', error)
    response.status(500).json({ error: 'Failed to fetch exercise data' })
  }
})


// exercisebaseinfo
// exercisebaseinfo/{id}
// exercise-base (without extra info)
// video
// exerciseimage
module.exports = exerciseRouter