# GemHaven — Live Gem Auction System

> A digital ecosystem for **Thennakoon Gems** featuring real-time live auctions, gemstone reservations, and mining land sales.

**Team:** Kisal Kavinda · Avishka Hashara · Wandana Gunasekara · Chamindu Shenal · Isuri Pathirana · HKP Pamuditha

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Java Spring Boot (Maven) |
| Database | PostgreSQL |
| Real-time | WebSocket (STOMP) |

---

## Project Structure

```
GemHaven/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Spring Boot + PostgreSQL
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`

### Backend
Configure your database in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/gemhaven
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```
Then run:
```bash
cd backend
./mvnw spring-boot:run
```
Runs at `http://localhost:8080`

---

## Branching Strategy

```
main       ← Production-ready code only (protected, PRs required)
develop    ← Team integration branch (protected, PRs required)
feature/*  ← Individual task branches (temporary)
```

### Workflow for Every Task
```bash
# 1. Sync with latest
git checkout develop
git pull origin develop

# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Work, then commit
git add .
git commit -m "Description of what you did"

# 4. Push and open a PR → develop
git push origin feature/your-feature-name
```
> Open a Pull Request on GitHub from your `feature/*` branch into `develop`. At least **one team member must review** before merging.

---

## Team Members & Roles

| Member | Role |
|--------|------|
| Kisal Kavinda | Project Lead / Full Stack |
| Avishka Hashara | Full Stack Developer |
| Wandana Gunasekara | Backend Developer |
| Chamindu Shenal | Frontend Developer |
| Isuri Pathirana | Frontend Developer |
| HKP Pamuditha | Database / QA |
