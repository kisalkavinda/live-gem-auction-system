# 🚀 GemHaven Team Onboarding Guide

Welcome to the **GemHaven** development team! This guide will help you set up the project and teach you how to contribute code correctly using our GitHub workflow.

---

## 1. Initial Setup (Do this once)

### Prerequisites
Make sure you have these installed:
1. **Git**: [Download Here](https://git-scm.com/downloads)
2. **Node.js (v18+)**: [Download Here](https://nodejs.org/)
3. **Java (JDK 17)**: [Download Here](https://www.oracle.com/java/technologies/downloads/#java17)
4. **PostgreSQL**: [Download Here](https://www.postgresql.org/download/)
5. **VS Code** (Recommended) or IntelliJ IDEA.

### Clone the Project
Open your terminal (or Command Prompt) and run:
```bash
git clone https://github.com/kisalkavinda/live-gem-auction-system.git
cd live-gem-auction-system
```

---

## 2. Running the Project Locally

### Frontend (React)
```bash
cd frontend
npm install    # Install dependencies
npm run dev    # Start the app
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend (Spring Boot)
1. Open PostgreSQL and create a database named `gemhaven`.
2. Open `backend/src/main/resources/application.properties`.
3. Update `spring.datasource.username` and `password` with your PostgreSQL credentials.
4. Run the backend:
```bash
cd backend
./mvnw spring-boot:run
```
The API will be available at `http://localhost:8080`.

---

## 3. How to Work on a Task (The Workflow)

**NEVER** work directly on the `main` or `develop` branches. Always follow these 5 steps:

### Step 1: Sync with the Team
Before starting, make sure you have the latest code from everyone else.
```bash
git checkout develop
git pull origin develop
```

### Step 2: Create a Feature Branch
Create a new branch for the specific task you are working on.
Naming convention: `feature/your-name-task-name` (e.g., `feature/chamindu-login-ui`)
```bash
git checkout -b feature/your-name-task-name
```

### Step 3: Write Code & Commit
As you work, save your progress with "commits".
```bash
git add .
git commit -m "Added the login form UI components"
```

### Step 4: Push to GitHub
When your task is finished and tested, push your branch to GitHub.
```bash
git push origin feature/your-name-task-name
```

### Step 5: Open a Pull Request (PR)
1. Go to the [GitHub Repository](https://github.com/kisalkavinda/live-gem-auction-system).
2. You will see a yellow bar saying "Compare & pull request". Click it.
3. **Important:** Ensure the "base" branch is `develop` and "compare" is your feature branch.
4. Add a description of what you did and click **"Create pull request"**.
5. Ask a teammate (e.g., Kisal) to review and approve your code.

---

## 💡 Important Rules
- **One task = One branch.** Don't mix multiple features in one branch.
- **Pull before you push.** Always pull the latest `develop` to avoid conflicts.
- **Write clear commit messages.** It helps others understand your changes.
- **Ask for help!** If you get a "Merge Conflict" error, don't panic. Ask the team lead for help resolving it.

Happy coding! 💎
