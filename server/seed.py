#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
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
