#!/usr/bin/env python3

"""Seed script for development.

This script creates minimal sample records so the app can be exercised
locally. Run it from the `server/` directory.
"""

from faker import Faker

# Local imports
from app import app
<<<<<<< HEAD
from models import db, User
=======
from models import db, User, Course, StudyGroup
>>>>>>> sam-safari


def run_seed():
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
<<<<<<< HEAD
        # Seed code goes here!
        # Clear existing data
        User.query.delete()

        # Seed users
        users = [
            User(
                name="Sandra Achieng",
                dob="1998-05-12",
                email="sandra@test.com",
                national_id="12345678",
                phone_number="0712345678",
                user_category="student"
            ),
            User(
                name="Ajok Akello",
                dob="1999-03-22",
                email="ajok@test.com",
                national_id="23456789",
                phone_number="0723456789",
                user_category="student"
            ),
            User(
                name="Benson Mutua",
                dob="1997-11-05",
                email="benson@test.com",
                national_id="34567890",
                phone_number="0734567890",
                user_category="student"
            ),
            User(
                name="Samuel Otieno",
                dob="1996-07-18",
                email="samuel@test.com",
                national_id="45678901",
                phone_number="0745678901",
                user_category="student"
            ),
            User(
                name="Dr. Jane Wanjiru",
                dob="1980-01-30",
                email="jane.lecturer@test.com",
                national_id="56789012",
                phone_number="0756789012",
                user_category="lecturer"
            ),
            User(
                name="Prof. David Kamau",
                dob="1975-09-14",
                email="david.lecturer@test.com",
                national_id="67890123",
                phone_number="0767890123",
                user_category="lecturer"
            ),
        ]

        for user in users:
            user.password_hash = "password123"
            db.session.add(user)

        db.session.commit()
        print(f"Done! {len(users)} users seeded.")
=======
        # Create tables if they don't exist
        db.create_all()

        # Only create sample data if none exists
        if not Course.query.first():
            course = Course(course_name="Sample Course")
            db.session.add(course)
            db.session.commit()

        if not User.query.first():
            lecturer = User(name=fake.name(), email=fake.email(), user_category='lecturer')
            student = User(name=fake.name(), email=fake.email(), user_category='student')
            db.session.add_all([lecturer, student])
            db.session.commit()

            # Create a study group owned by lecturer for the sample course
            course = Course.query.first()
                sg = StudyGroup(name="Sample Group", course_id=course.id, owner_user_id=lecturer.id)
            db.session.add(sg)
            db.session.commit()

        print("Seed complete.")


if __name__ == '__main__':
    run_seed()
>>>>>>> sam-safari
