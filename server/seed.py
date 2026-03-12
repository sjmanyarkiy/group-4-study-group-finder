#!/usr/bin/env python3

from app import app
from config import db
from models import User, StudyGroup, Membership, Course, Review
from datetime import datetime

with app.app_context():
    # Clear existing data
    Review.query.delete()
    Membership.query.delete()
    StudyGroup.query.delete()
    Course.query.delete()
    User.query.delete()

    # Users
    u1 = User(name="Sandra Mwangi", dob="1998-04-12", email="sandra@email.com", national_id=12345678, phone_number=712345678, user_category="student")
    u1.password_hash = "password123"

    u2 = User(name="James Otieno", dob="1997-08-22", email="james@email.com", national_id=87654321, phone_number=722345678, user_category="student")
    u2.password_hash = "password123"

    u3 = User(name="Dr. Aisha Kamau", dob="1985-01-15", email="aisha@email.com", national_id=11223344, phone_number=733345678, user_category="lecturer")
    u3.password_hash = "password123"

    db.session.add_all([u1, u2, u3])
    db.session.commit()

    # Courses
    c1 = Course(course_name="Computer Science")
    c2 = Course(course_name="Data Science")
    c3 = Course(course_name="Web Development")

    db.session.add_all([c1, c2, c3])
    db.session.commit()

    # Study Groups
    sg1 = StudyGroup(name="Python Pros", description="A group for Python enthusiasts", subject="Computer Science", course_id=c1.course_id, owner_user_id=u3.user_id)
    sg2 = StudyGroup(name="Data Nerds", description="Data analysis and ML study group", subject="Data Science", course_id=c2.course_id, owner_user_id=u3.user_id)
    sg3 = StudyGroup(name="Web Warriors", description="Full stack web development", subject="Web Development", course_id=c3.course_id, owner_user_id=u3.user_id)

    db.session.add_all([sg1, sg2, sg3])
    db.session.commit()

    # Memberships
    m1 = Membership(name="Bronze", fee=500, tier="bronze", user_id=u1.user_id, study_group_id=sg1.study_group_id)
    m2 = Membership(name="Gold", fee=1000, tier="gold", user_id=u1.user_id, study_group_id=sg2.study_group_id)
    m3 = Membership(name="Bronze", fee=500, tier="bronze", user_id=u2.user_id, study_group_id=sg1.study_group_id)
    m4 = Membership(name="Silver", fee=750, tier="silver", user_id=u3.user_id, study_group_id=sg3.study_group_id)

    db.session.add_all([m1, m2, m3, m4])
    db.session.commit()

    print("Seeded successfully!")