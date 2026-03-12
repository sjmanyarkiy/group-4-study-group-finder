#!/usr/bin/env python3

"""Seed script for development.

This script creates minimal sample records so the app can be exercised
locally. Run it from the `server/` directory.
"""


# Local imports
from app import app
from models import db, User, Course, StudyGroup


def run_seed():
    with app.app_context():
        print("Starting seed...")

        # Ensure tables exist
        db.create_all()

        # Seed canonical users if none exist
        if not User.query.first():
            users = [
                User(
                    name="Sandra Achieng",
                    dob="1998-05-12",
                    email="sandra@test.com",
                    national_id="12345678",
                    phone_number="0712345678",
                    user_category="student",
                ),
                User(
                    name="Dr. Jane Wanjiru",
                    dob="1980-01-30",
                    email="jane.lecturer@test.com",
                    national_id="56789012",
                    phone_number="0756789012",
                    user_category="lecturer",
                ),
            ]

            for user in users:
                user.password_hash = "password123"
                db.session.add(user)

            db.session.commit()
            print(f"Done! {len(users)} users seeded.")

        # Create a sample course and study group if none exist
        if not Course.query.first():
            course = Course(course_name="Sample Course")
            db.session.add(course)
            db.session.commit()

        if not StudyGroup.query.first():
            lecturer = User.query.filter_by(user_category='lecturer').first()
            course = Course.query.first()
            if lecturer and course:
                sg = StudyGroup(name="Sample Group", course_id=course.id, owner_user_id=lecturer.id)
                db.session.add(sg)
                db.session.commit()

        print("Seed complete.")


if __name__ == '__main__':
    run_seed()
