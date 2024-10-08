# Deployed version

The app is deployed on Render in address: https://musclemap.onrender.com/

In short: Backend is deployed as it is and frontend's production build (the dist directory) is copied to the root of the backend repository and configured the backend to show the frontend's main page (the file dist/index.html) as its main page.

IMPORTANT: To have the latest production build in the frontend, use this command (this is beneficial to do whenever something is merged to the main-branch so that the deployed version will have the most recent frontend):
```
cd backend
npm run deploy:full
```

## Default user
For now, the newly created programs are saved to the default user (changed in the future when login functionality starts to work).

Default user info:
```
email: test@email.com
password: test
```

# Git

### Pull

```
git pull
```

### Commit

```
git add .
git commit -m "Your commit message"
```

### Push

```
git push
```

### Switch branch

```
git checkout branch-name
```

### Create new branch

```
git checkout -b your-branch-name
```

### Merge branch

Merge changes from a branch into the main branch:

```
git checkout main
git merge your-branch-name
```

# Backend

### First setup

Go to backend-folder and install needed dependencies:

```
cd backend
npm install
```

### Run backend in localhost:3001

```
npm run dev
```

### .env file

To use enviromental variables, create .env-file to the root of the backend-folder. You can use this as the base for the .env-file:

```
MONGODB_URI=
PORT=3001
SECRET=
```

Ask the variables from the team member who is handling the variables.

### Structure

```
backend/
├── controllers/    # Handles the incoming requests and responses
├── models/         # Models MongoDB schemas
├── utils/          # Utility functions
├── index.js        # Entry point of the application
├── package.json
└── .env            # Environment variables (API keys, base URLs, etc.)
```

# Frontend

### First setup

Go to frontend-folder and install needed dependencies:

```
cd frontend
npm install
```

### Run frontend in localhost:5173

```
npm run dev
```

