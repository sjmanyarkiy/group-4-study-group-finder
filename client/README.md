# LetsStudy 📚

A full-stack web application that connects students and lecturers through study groups. Users can join groups, access course content, and review their learning experience.

Built with a **Flask** backend and a **React** frontend.

---

## Team Members

| Name | Branch | Responsibility |
|------|--------|----------------|
| Sandra | `sandra` | User model, authentication, integration lead |
| Ajok | `ajok` | StudyGroup model, institutions |
| Benson | `benson` | Membership model, joining flow |
| Samuel | `samuel` | Course model, reviews, admin content |

---

## Models & Relationships

### Models
- **User** — students and lecturers
- **StudyGroup** — groups users can join
- **Membership** — association between users and study groups
- **Institution** — schools and organisations
- **Course** — courses linked to study groups
- **Review** — star ratings left by users

### Relationships
- `StudyGroup` → `User` (many-to-one)
- `StudyGroup` → `Membership` (one-to-many)
- `StudyGroup` ↔ `Institution` (many-to-many)

---

## API Routes

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Log in an existing user |
| DELETE | `/logout` | Log out the current user |
| GET | `/check_session` | Check if a user is logged in |

### Study Groups
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/study_groups` | Get all study groups |
| POST | `/study_groups` | Create a new study group (lecturer only) |
| GET | `/study_groups/<id>` | Get a single study group |
| PATCH | `/study_groups/<id>` | Update a study group |
| DELETE | `/study_groups/<id>` | Delete a study group |

### Memberships
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/memberships` | Get all memberships |
| POST | `/memberships` | Join a study group |
| DELETE | `/memberships/<id>` | Leave a study group |

### Institutions
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/institutions` | Get all institutions |
| POST | `/institutions` | Add a new institution |
| PATCH | `/institutions/<id>` | Update an institution |

### Courses & Reviews
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/courses` | Get all courses |
| POST | `/courses` | Create a course |
| GET | `/reviews` | Get all reviews |
| POST | `/reviews` | Post a review |

---

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- Pipenv

---

### Backend Setup

```bash
# Install dependencies
pipenv install
pipenv shell

# Move into the server directory
cd server

# Set up the database
flask db init
flask db migrate -m "initial migration"
flask db upgrade

# Seed the database
python seed.py

# Run the Flask server
python app.py
```

The Flask API will run on **http://localhost:5555**

---

### Frontend Setup

```bash
# Install dependencies
npm install --prefix client

# Start the React app
npm start --prefix client
```

The React app will run on **http://localhost:3000**

---

## Client-Side Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/login` | Login page |
| `/register` | Registration page |
| `/groups` | Browse study groups |

---

## Features

- Student and lecturer login with session-based authentication
- Registration form with full validation via Formik and Yup
- Study group browsing and joining with membership tiers (Standard 500sh, Premium 1000sh)
- Institution dropdown — lecturers can add and edit institutions
- Star reviews for study groups
- Admin/Lecturer controls for creating groups and content
