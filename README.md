# LetsStudy! 📚

**A platform for collaborative learning in Kenya.**

> **Live app:** [https://group-4-study-group-finder.onrender.com](https://group-4-study-group-finder.onrender.com)
> **Repository:** [sjmanyarkiy/group-4-study-group-finder](https://github.com/sjmanyarkiy/group-4-study-group-finder)

Built by **Group 4** — Ajok Yai · Benson Mwangi · Samuel Emanman · Sandra Manyarkiy

---

## What is LetsStudy?

LetsStudy! is a full-stack web application that connects students and lecturers through structured, course-linked study groups. The platform features role-based access, membership tiers, coursework uploads, peer reviews, and institution-linked groups — giving Kenyan learners a dedicated space to find committed, high-quality study communities.

---

## Features

### For Students
- Register and log in with a student account
- Browse study groups filtered by course
- Join groups via tiered memberships (Bronze / Silver / Gold)
- View joined groups and access coursework materials
- Download PDF documents uploaded by lecturers
- Leave star ratings and written reviews on groups

### For Lecturers
- Register and log in with a lecturer account
- Create and manage study groups linked to courses
- Upload coursework with PDF attachments
- View a full list of enrolled students per group, including membership tier, email, phone, and join date

---

## Tech Stack

### Backend
| Tool | Purpose |
|---|---|
| Python 3.11 / Flask | REST API server |
| Flask-RESTful | Resource-based routing |
| Flask-SQLAlchemy | ORM |
| Flask-Migrate | Database migrations |
| Flask-CORS | Cross-origin support |
| PostgreSQL | Production database (via Render) |
| Werkzeug | Password hashing |
| Gunicorn | Production WSGI server |

### Frontend
| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v5 | Client-side routing |
| Fetch API | API communication |

### Deployment
- **Backend + Frontend:** Render (single web service)
- **Database:** Render PostgreSQL (free tier)

---

## Data Models

```
User
  user_id, name, dob, email, national_id, phone_number,
  user_category (student | lecturer), password_hash

Institution
  institution_id, institution_name

Course
  course_id, course_name

StudyGroup
  study_group_id, name, description, subject,
  course_id (FK), owner_user_id (FK), start_date, end_date, created_at

Membership
  membership_id, name, fee, tier (bronze | silver | gold),
  date_joined, date_graduated, user_id (FK), study_group_id (FK)

Coursework
  coursework_id, title, description, pdf_data (base64),
  pdf_filename, created_at, study_group_id (FK)

Review
  review_id, stars (1–5), comment, created_at,
  user_id (FK), study_group_id (FK)
```

**Relationships:**
- One lecturer creates many StudyGroups (one-to-many)
- One Course has many StudyGroups (one-to-many)
- One StudyGroup has many Memberships (one-to-many)
- One StudyGroup has many Coursework items (one-to-many)
- One StudyGroup has many Reviews (one-to-many)
- StudyGroups ↔ Institutions (many-to-many via join table)

---

## API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Log in |
| DELETE | `/logout` | Log out |
| GET | `/check_session` | Check current session |

### Study Groups
| Method | Route | Description |
|---|---|---|
| GET | `/study_groups` | List all groups |
| POST | `/study_groups` | Create a group (lecturer only) |
| GET | `/study_groups/<id>/memberships` | List members of a group |
| GET | `/study_groups/<id>/coursework` | List coursework for a group |
| POST | `/study_groups/<id>/coursework` | Upload coursework (lecturer only) |

### Courses
| Method | Route | Description |
|---|---|---|
| GET | `/courses` | List all courses |
| GET | `/courses/<id>` | Get a single course |
| GET | `/courses/<id>/study-groups` | Get groups for a course |

### Memberships
| Method | Route | Description |
|---|---|---|
| POST | `/memberships` | Join a group |
| PATCH | `/memberships/<id>` | Update a membership |
| DELETE | `/memberships/<id>` | Leave a group |
| GET | `/users/<id>/memberships` | Get memberships for a user |
| GET | `/study_groups/<id>/memberships` | Get memberships for a group |

### Reviews
| Method | Route | Description |
|---|---|---|
| GET | `/reviews` | List all reviews |
| POST | `/reviews` | Post a review |

### Coursework
| Method | Route | Description |
|---|---|---|
| DELETE | `/coursework/<id>` | Delete a coursework item (lecturer only) |

---

## Local Setup

### Prerequisites
- Python 3.10+
- Node.js 16+ and npm
- pipenv

### Clone the repo

```bash
git clone https://github.com/sjmanyarkiy/group-4-study-group-finder.git
cd group-4-study-group-finder
```

### Backend

```bash
cd api
pipenv install
pipenv shell
flask db upgrade
python seed.py       # optional: seed with sample data
python app.py        # runs on http://localhost:5555
```

### Frontend

```bash
cd client
npm install
npm start            # runs on http://localhost:3000
```

The React app proxies API requests to `http://localhost:5555`.

---

## Demo Accounts

Once seeded, you can log in with these accounts:

| Role | Email | Password |
|---|---|---|
| Student | sandra@email.com | password123 |
| Student | james@email.com | password123 |
| Lecturer | aisha@email.com | password123 |

---

## Project Structure

```
.
├── api/
│   ├── app.py          # Routes and resources
│   ├── config.py       # Flask app, DB, and extensions setup
│   ├── models.py       # SQLAlchemy models
│   ├── seed.py         # Database seed data
│   ├── requirements.txt
│   └── migrations/
└── client/
    └── src/
        └── components/
            ├── App.js
            ├── Home.js
            ├── Navbar.js
            ├── Login.js
            ├── Register.js
            ├── StudyGroups.js
            ├── Courses.js
            ├── Memberships.js
            ├── MembershipForm.js
            ├── CreateGroupForm.js
            ├── CourseworkDetail.js
            └── GroupStudents.js
```

---

## Team

| Name | Role |
|---|---|
| Sandra Manyarkiy | Integration lead, auth, deployment |
| Ajok Yai | StudyGroup & Institution models, CRUD |
| Benson Mwangi | Membership model, joining flow |
| Samuel Emanman | Course & Review models, content |

---

## License

MIT License — see `LICENSE.md` for details.
