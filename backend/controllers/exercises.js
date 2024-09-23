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
Data format of the exercise:
{
    "count": 80,
    "next": "https://wger.de/api/v2/exercisebaseinfo/?category=10&limit=1&offset=1",
    "previous": null,
    "results": [
        {
            "id": 56,
            "uuid": "03db11cc-8079-463c-9399-6f346b100ce6",
            "created": "2023-08-06T10:17:17.422900+02:00",
            "last_update": "2024-01-17T11:21:02.089512+01:00",
            "last_update_global": "2024-01-17T11:21:02.595866+01:00",
            "category": {
                "id": 10,
                "name": "Abs"
            },
            "muscles": [
                {
                    "id": 6,
                    "name": "Rectus abdominis",
                    "name_en": "Abs",
                    "is_front": true,
                    "image_url_main": "/static/images/muscles/main/muscle-6.svg",
                    "image_url_secondary": "/static/images/muscles/secondary/muscle-6.svg"
                }
            ],
            "muscles_secondary": [
                {
                    "id": 14,
                    "name": "Obliquus externus abdominis",
                    "name_en": "",
                    "is_front": true,
                    "image_url_main": "/static/images/muscles/main/muscle-14.svg",
                    "image_url_secondary": "/static/images/muscles/secondary/muscle-14.svg"
                }
            ],
            "equipment": [
                {
                    "id": 4,
                    "name": "Gym mat"
                }
            ],
            "license": {
                "id": 1,
                "full_name": " Creative Commons Attribution Share Alike 3",
                "short_name": "CC-BY-SA 3",
                "url": "https://creativecommons.org/licenses/by-sa/3.0/deed.en"
            },
            "license_author": "andikeller",
            "images": [],
            "exercises": [
                {
                    "id": 1061,
                    "uuid": "60d8018d-296f-4c62-a80b-f609a25d34ea",
                    "name": "Abdominal Stabilization",
                    "exercise_base": 56,
                    "description": "",
                    "created": "2023-08-06T10:17:17.349574+02:00",
                    "language": 2,
                    "aliases": [],
                    "notes": [],
                    "license": 1,
                    "license_title": "",
                    "license_object_url": "",
                    "license_author": "andikeller",
                    "license_author_url": "",
                    "license_derivative_source_url": "",
                    "author_history": [
                        "andikeller",
                        "wger.de"
                    ]
                },
                {
                    "id": 259,
                    "uuid": "c659577f-d9de-4e39-bcd1-1b0bf1f62d11",
                    "name": "Bauch Stabilisation",
                    "exercise_base": 56,
                    "description": "<p>Auf Rolle liegend</p>",
                    "created": "2023-08-06T10:17:17.349574+02:00",
                    "language": 1,
                    "aliases": [],
                    "notes": [],
                    "license": 1,
                    "license_title": "",
                    "license_object_url": "",
                    "license_author": "andikeller",
                    "license_author_url": "",
                    "license_derivative_source_url": "",
                    "author_history": [
                        "andikeller"
                    ]
                }
            ],
            "variations": null,
            "videos": [],
            "author_history": [
                "andikeller"
            ],
            "total_authors_history": [
                "andikeller",
                "wger.de"
            ]
        }
    ]
}
*/
exerciseRouter.get('/exercisebaseinfo', async (request, response) => {
  try {
    const result = await axios.get(`${process.env.WGER_API_BASE_URL}/exercisebaseinfo`)

    // Respond with the exercise data
    response.json(result.data)
  } catch (error) {
    console.error('Error fetching exercises:', error)
    response.status(500).json({ error: 'Failed to fetch exercise data' })
  }
})

exerciseRouter.get('/exercisebaseinfo/category/:id', async (request, response) => {
  try {
    const result = await axios.get(`${process.env.WGER_API_BASE_URL}/exercisebaseinfo/?category=${request.params.id}&limit=50`)

    // Filter out non-English exercises (keep only those with language === 2)
    const filteredExercises = result.data.results.map(exercise => ({
      ...exercise,
      exercises: exercise.exercises.filter(ex => ex.language === 2)
    }))

    // Respond with the modified exercise data
    response.json({ ...result.data, results: filteredExercises })
  } catch (error) {
    console.error('Error fetching exercises:', error)
    response.status(500).json({ error: 'Failed to fetch exercise data' })
  }
})

/// ENDPOINTS which might be useful
// exercisebaseinfo
// exercisebaseinfo/{id}
// exercise-base (without extra info)
// video
// exerciseimage
module.exports = exerciseRouter