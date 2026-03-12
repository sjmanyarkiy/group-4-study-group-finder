from datetime import datetime

from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.ext.hybrid import hybrid_property

from config import db


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-memberships',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    dob = db.Column(db.String, nullable=True)
    email = db.Column(db.String, unique=True, nullable=False)
    national_id = db.Column(db.String, unique=True, nullable=True)
    phone_number = db.Column(db.String, nullable=True)
    user_category = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String, nullable=True)

    memberships = db.relationship('Membership', back_populates='user')
    study_groups = db.relationship('StudyGroup', back_populates='owner')
    reviews = db.relationship('Review', back_populates='user')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = generate_password_hash(password)

    def authenticate(self, password):
        if not self._password_hash:
            return False
        return check_password_hash(self._password_hash, password)

    @validates('user_category')
    def validate_user_category(self, key, value):
        if value not in ['student', 'lecturer']:
            raise ValueError('user category must be student or lecturer')
        return value

    @validates('email')
    def validate_email(self, key, value):
        if '@' not in value:
            raise ValueError('Invalid email address')
        return value

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'dob': self.dob,
            'email': self.email,
            'national_id': self.national_id,
            'phone_number': self.phone_number,
            'user_category': self.user_category,
        }


class Membership(db.Model, SerializerMixin):
    __tablename__ = 'memberships'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    fee = db.Column(db.Integer, nullable=False)
    date_joined = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_graduated = db.Column(db.DateTime, nullable=True)
    tier = db.Column(db.String(20), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    study_group_id = db.Column(db.Integer, db.ForeignKey('study_groups.id'), nullable=False)

    user = db.relationship('User', back_populates='memberships')
    study_group = db.relationship('StudyGroup', back_populates='memberships')


class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(200), nullable=False, unique=True)

    study_groups = db.relationship('StudyGroup', back_populates='course')

    def __repr__(self):
        return f"<Course {self.id} {self.course_name}>"


class StudyGroup(db.Model, SerializerMixin):
    __tablename__ = 'study_groups'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=True)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    owner_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    course = db.relationship('Course', back_populates='study_groups')
    owner = db.relationship('User', back_populates='study_groups')
    reviews = db.relationship('Review', back_populates='study_group', cascade='all, delete-orphan')
    memberships = db.relationship('Membership', back_populates='study_group')

    def __repr__(self):
        return f"<StudyGroup {self.id} {self.name}>"


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    study_group_id = db.Column(db.Integer, db.ForeignKey('study_groups.id'), nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='reviews')
    study_group = db.relationship('StudyGroup', back_populates='reviews')

    def __repr__(self):
        return f"<Review {self.id} {self.stars}★>"

