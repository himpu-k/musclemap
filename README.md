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

### Run backend in localhost:5000

```
npm run dev
```

### .env file

To use enviromental variables, create .env-file to the root of the backend-folder. You can use this as the base for the .env-file:

```
MONGODB_URI=
TEST_MONGODB_URI=
PORT=3001
SECRET=
```

Ask the variables from the team member who is handling the variables.

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
