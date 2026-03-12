<<<<<<< HEAD
# Phase 4 Full-Stack Application Project Template

## Learning Goals

- Discuss the basic directory structure of a full-stack Flask/React application.
- Carry out the first steps in creating your Phase 4 project.

---

## Introduction

Fork and clone this lesson for a template for your full-stack application. Take
a look at the directory structure before we begin (NOTE: node_modules will be
generated in a subsequent step):

```console
$ tree -L 2
$ # the -L argument limits the depth at which we look into the directory structure
.
├── CONTRIBUTING.md
├── LICENSE.md
├── Pipfile
├── README.md
├── client
│   ├── README.md
│   ├── package.json
│   ├── public
│   └── src
└── server
    ├── app.py
    ├── config.py
    ├── models.py
    └── seed.py
```

A `migrations` folder will be added to the `server` directory in a later step.

The `client` folder contains a basic React application, while the `server`
folder contains a basic Flask application. You will adapt both folders to
implement the code for your project .

NOTE: If you did not previously install `tree` in your environment setup, MacOS
users can install this with the command `brew install tree`. WSL and Linux users
can run `sudo apt-get install tree` to download it as well.

## Where Do I Start?

Just as with your Phase 3 Project, this will likely be one of the biggest
projects you've undertaken so far. Your first task should be creating a Git
repository to keep track of your work and roll back any undesired changes.

### Removing Existing Git Configuration

If you're using this template, start off by removing the existing metadata for
Github and Canvas. Run the following command to carry this out:

```console
$ rm -rf .git .canvas
```

The `rm` command removes files from your computer's memory. The `-r` flag tells
the console to remove _recursively_, which allows the command to remove
directories and the files within them. `-f` removes them permanently.

`.git` contains this directory's configuration to track changes and push to
Github (you want to track and push _your own_ changes instead), and `.canvas`
contains the metadata to create a Canvas page from your Git repo. You don't have
the permissions to edit our Canvas course, so it's not worth keeping around.

### Creating Your Own Git Repo

First things first- rename this directory! Once you have an idea for a name,
move one level up with `cd ..` and run
`mv python-p4-project-template <new-directory-name>` to change its name (replace
<new-directory-name> with an appropriate project directory name).

> **Note: If you typed the `mv` command in a terminal within VS Code, you should
> close VS Code then reopen it.**

> **Note: `mv` actually stands for "move", but your computer interprets this
> rename as a move from a directory with the old name to a directory with a new
> name.**

`cd` back into your new directory and run `git init` to create a local git
repository. Add all of your local files to version control with `git add --all`,
then commit them with `git commit -m'initial commit'`. (You can change the
message here- this one is just a common choice.)

Navigate to [GitHub](https://github.com). In the upper-right corner of the page,
click on the "+" dropdown menu, then select "New repository". Enter the name of
your local repo, choose whether you would like it to be public or private, make
sure "Initialize this repository with a README" is unchecked (you already have
one), then click "Create repository".

Head back to the command line and enter
`git remote add origin git@github.com:github-username/new-repository-name.git`.
NOTE: Replace `github-username` with your github username, and
`new-repository-name` with the name of your new repository. This command will
map the remote repository to your local repository. Finally, push your first
commit with `git push -u origin main`.

Your project is now version-controlled locally and online. This will allow you
to create different versions of your project and pick up your work on a
different machine if the need arises.

---

## Setup

### `server/`

The `server/` directory contains all of your backend code.

`app.py` is your Flask application. You'll want to use Flask to build a simple
API backend like we have in previous modules. You should use Flask-RESTful for
your routes. You should be familiar with `models.py` and `seed.py` by now, but
remember that you will need to use Flask-SQLAlchemy, Flask-Migrate, and
SQLAlchemy-Serializer instead of SQLAlchemy and Alembic in your models.

The project contains a default `Pipfile` with some basic dependencies. You may
adapt the `Pipfile` if there are additional dependencies you want to add for
your project.

To download the dependencies for the backend server, run:

```console
=======
# LetsStudy! — A Platform for Collaborative Learning

Team: Group 4 — Ajok Yai · Benson Mwangi · Samuel Emanman · Sandra Manyarkiy

## Short description

LetsStudy! is a full‑stack web application that helps students and lecturers in
Kenya create, join, and manage structured study groups. The platform pairs
role‑based access (student / lecturer) with membership tiers, course‑linked
groups, gated content, and reviews — helping learners find committed,
high‑quality study communities.

## Key project links

- Repository: [sjmanyarkiy/group-4-study-group-finder](https://github.com/sjmanyarkiy/group-4-study-group-finder)

## Table of contents

- Problem statement
- Solution overview
- MVP features
- Technical stack
- Data models & relationships
- Installation & local setup
- API basics (endpoints & examples)
- Contributing
- License

## 1. Problem statement

Many students struggle to find structured, community‑driven study environments
outside the classroom. Lecturers lack a simple way to create and manage study
groups, share materials, and track membership. This fragmentation reduces
knowledge sharing and negatively impacts academic outcomes.

## 2. Our solution

LetsStudy! centralizes discovery and management of study groups. The
application supports:

- Role‑based access (student, lecturer)
- Study groups tied to courses and institutions
- Membership with tiered fees (Standard, Premium) and gated content
- Review system (star rating) to surface high‑quality groups
- A React frontend with validated forms and a RESTful Flask backend

## 3. Minimum Viable Product (MVP)

The MVP implements the core flows needed for an initial launch:

- Authentication & role assignment (student / lecturer)
- Lecturers create and manage study groups
- Students join groups via membership payments (Standard: 500 KSh, Premium: 1000 KSh)
- Institutions and courses management
- Star reviews and basic search/filtering by course or institution
- Access control so only group members can see gated content

## 4. Technical stack

### Backend

- Python 3.x, Flask — REST API
- Flask-RESTful — resource-based routing
- Flask-Migrate — migrations
- Flask-CORS — cross‑origin access for the React client
- SQLAlchemy + Flask-SQLAlchemy — ORM
- SQLite — development DB (for local/dev)
- Werkzeug — secure password hashing

### Frontend

- React (v18)
- React Router v5
- Formik + Yup — forms & validation
- Fetch API — client/server comms

## 5. Models & relationships

Primary models (conceptual):

- User — user_ID (PK), name, dob, email, national_ID, phone, user_category (student/lecturer)
- Institution — institution_ID (PK), institution_name
- Course — course_ID (PK), course_name
- StudyGroup — study_group_ID (PK), name, course_ID (FK), start_date, end_date, owner_user_id (FK)
- Membership — membership_ID (PK), user_id (FK), study_group_id (FK), tier (Standard/Premium), fee, date_joined, date_graduated
- Review — review_ID (PK), user_id (FK), study_group_id (FK), stars (1–5), comment, created_at

Relationships:

- One lecturer (User) can create many StudyGroups (one-to-many).
- StudyGroup has many Memberships (one-to-many).
- StudyGroups ↔ Institution can be modeled as many-to-many (a group may be associated with multiple institutions).
- Course → StudyGroup is one-to-many (a course can have multiple study groups).

## 6. Installation & local setup

### Prerequisites

- macOS (tested), Python 3.10+, Node.js 16+ and npm
- pipenv (recommended) for the backend, or use a virtualenv

### Clone the repository

```bash
git clone https://github.com/sjmanyarkiy/group-4-study-group-finder.git
cd group-4-study-group-finder
git checkout -b <your-branch-name>
```

### Backend (server)

1. Install dependencies and activate pipenv shell:

```bash
>>>>>>> sam-safari
pipenv install
pipenv shell
```

<<<<<<< HEAD
You can run your Flask API on [`localhost:5555`](http://localhost:5555) by
running:

```console
python server/app.py
```

Check that your server serves the default route `http://localhost:5555`. You
should see a web page with the heading "Project Server".

### `client/`

The `client/` directory contains all of your frontend code. The file
`package.json` has been configured with common React application dependencies,
include `react-router-dom`. The file also sets the `proxy` field to forward
requests to `"http://localhost:5555". Feel free to change this to another port-
just remember to configure your Flask app to use another port as well!

To download the dependencies for the frontend client, run:

```console
npm install --prefix client
```

You can run your React app on [`localhost:3000`](http://localhost:3000) by
running:

```sh
npm start --prefix client
```

Check that your the React client displays a default page
`http://localhost:3000`. You should see a web page with the heading "Project
Client".

## Generating Your Database

NOTE: The initial project directory structure does not contain the `instance` or
`migrations` folders. Change into the `server` directory:

```console
cd server
```

Then enter the commands to create the `instance` and `migrations` folders and
the database `app.db` file:

```
flask db init
flask db upgrade head
```

Type `tree -L 2` within the `server` folder to confirm the new directory
structure:

```console
.
├── app.py
├── config.py
├── instance
│   └── app.db
├── migrations
│   ├── README
│   ├── __pycache__
│   ├── alembic.ini
│   ├── env.py
│   ├── script.py.mako
│   └── versions
├── models.py
└── seed.py
```

Edit `models.py` and start creating your models. Import your models as needed in
other modules, i.e. `from models import ...`.

Remember to regularly run
`flask db revision --autogenerate -m'<descriptive message>'`, replacing
`<descriptive message>` with an appropriate message, and `flask db upgrade head`
to track your modifications to the database and create checkpoints in case you
ever need to roll those modifications back.

> **Tip: It's always a good idea to start with an empty revision! This allows
> you to roll all the way back while still holding onto your database. You can
> create this empty revision with `flask db revision -m'Create DB'`.**

If you want to seed your database, now would be a great time to write out your
`seed.py` script and run it to generate some test data. Faker has been included
in the Pipfile if you'd like to use that library.

---

#### `config.py`

When developing a large Python application, you might run into a common issue:
_circular imports_. A circular import occurs when two modules import from one
another, such as `app.py` and `models.py`. When you create a circular import and
attempt to run your app, you'll see the following error:

```console
ImportError: cannot import name
```

If you're going to need an object in multiple modules like `app` or `db`,
creating a _third_ module to instantiate these objects can save you a great deal
of circular grief. Here's a good start to a Flask config file (you may need more
if you intend to include features like authentication and passwords):

```py
# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

```

Now let's review that last line...

#### CORS

CORS (Cross-Origin Resource Sharing) is a system that uses HTTP headers to
determine whether resources from different servers-of-origin can be accessed. If
you're using the fetch API to connect your frontend to your Flask backend, you
need to configure CORS on your Flask application instance. Lucky for us, that
only takes one line:

```py
CORS(app)

```

By default, Flask-CORS enables CORS on all routes in your application with all
fetching servers. You can also specify the resources that allow CORS. The
following specifies that routes beginning with `api/` allow CORS from any
originating server:

```py
CORS(app, resources={r"/api/*": {"origins": "*"}})

```

You can also set this up resource-by-resource by importing and using the
`@cross_origin` decorator:

```py
@app.route("/")
@cross_origin()
def howdy():
  return "Howdy partner!"

```

---

## Updating Your README.md

`README.md` is a Markdown file that describes your project. These files can be
used in many different ways- you may have noticed that we use them to generate
entire Canvas lessons- but they're most commonly used as homepages for online
Git repositories. **When you develop something that you want other people to
use, you need to have a README.**

Markdown is not a language that we cover in Flatiron's Software Engineering
curriculum, but it's not a particularly difficult language to learn (if you've
ever left a comment on Reddit, you might already know the basics). Refer to the
cheat sheet in this lesson's resources for a basic guide to Markdown.

### What Goes into a README?

This README should serve as a template for your own- go through the important
files in your project and describe what they do. Each file that you edit (you
can ignore your migration files) should get at least a paragraph. Each function
should get a small blurb.

You should descibe your application first, and with a good level of detail. The
rest should be ordered by importance to the user. (Probably routes next, then
models.)

Screenshots and links to resources that you used throughout are also useful to
users and collaborators, but a little more syntactically complicated. Only add
these in if you're feeling comfortable with Markdown.

---

## Conclusion

A lot of work goes into a full-stack application, but it all relies on concepts
that you've practiced thoroughly throughout this phase. Hopefully this template
and guide will get you off to a good start with your Phase 4 Project.

Happy coding!

---

## Resources

- [Setting up a respository - Atlassian](https://www.atlassian.com/git/tutorials/setting-up-a-repository)
- [Create a repo- GitHub Docs](https://docs.github.com/en/get-started/quickstart/create-a-repo)
- [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)
- [Python Circular Imports - StackAbuse](https://stackabuse.com/python-circular-imports/)
- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/)
=======
1. Create environment variables

Create a `.env` file in the `server/` directory with at least the following
values (placeholders shown):

```env
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=sqlite:///instance/app.db
SECRET_KEY=replace-with-a-secure-random-string
```

1. Initialize the database & migrations (first-time setup)

```bash
cd server
flask db init       # only once
flask db migrate -m "Initial migration"
flask db upgrade
```

1. Seed the database (optional):

```bash
python seed.py
```

1. Run the Flask server:

```bash
python app.py
# or, if using the flask CLI from within the server directory
flask run --port=5555
```

### Frontend (client)

1. Install dependencies and start the development server:

```bash
npm install --prefix client
npm start --prefix client
```

1. The React app proxies API requests to the Flask server (default proxy:
  [http://localhost:5555](http://localhost:5555)). Visit [http://localhost:3000](http://localhost:3000) to open the UI.

## 7. API basics (examples)

This project follows a RESTful structure. Below are common endpoints. Replace
{id} and payloads with actual values.

### Authentication

- POST /auth/register — register new user (payload includes role)
- POST /auth/login — login; returns a session cookie or token

### Study groups

- GET /study-groups — list groups (query by course/institution)
- POST /study-groups — create (lecturer only)
- GET `/study-groups/{id}` — group details
- PATCH `/study-groups/{id}` — update (owner/lecturer)
- DELETE `/study-groups/{id}` — remove (owner/lecturer)

### Memberships

- POST `/study-groups/{id}/join` — create membership (student)
- GET `/study-groups/{id}/members` — list members (lecturers & members)

### Reviews

- POST `/study-groups/{id}/reviews` — create a review (member only)
- GET `/study-groups/{id}/reviews` — list reviews

## 8. Development notes

- Use Formik + Yup on the frontend to validate inputs (registration, group
  creation, payments) before sending to the API.
- Protect backend routes with decorators or middleware that check the user's
  role and membership status before serving gated content.
- Keep secrets out of the repository. Use `.env` for local development.

## 9. Seeding & test data

`server/seed.py` creates example users, institutions, courses, groups, and
memberships so you can test the flows quickly. Seeded data is useful for
manual QA and UI testing.

## 10. Contributing

We welcome contributions. A good workflow for this repo is:

1. Fork the repo and clone your fork.
1. Create a feature branch named after your task, e.g. `ajok/institutions-crud`.
1. Commit frequently with clear messages and open a pull request to `main` when
   your feature is ready for review.

## Team & Branch Ownership (recommended)

- Sandra — User model, authentication routes, integration lead
- Ajok — StudyGroup model, Institution model, CRUD routes
- Benson — Membership model, joining flow, access control
- Samuel — Course model, Review model, admin/lecturer content

Please follow the existing repository style and run the application locally
before opening a PR.

## 11. License

This project is released under the MIT License. See `LICENSE.md` for details.

## 12. Contact & support

If you have questions or want to work with the team, open an issue in the
repository or contact the project owners via the GitHub repo.

## Acknowledgements

This README was written specifically for the LetsStudy! (Group 4) project and
summarizes the project goals, architecture, and developer onboarding steps.

Happy building! 🚀
>>>>>>> sam-safari
