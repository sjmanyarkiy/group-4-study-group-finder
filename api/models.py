from datetime import datetime

from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime

from config import db

# Join table for StudyGroup <-> Institution many-to-many
studygroup_institution = db.Table(
    'studygroup_institution',
    db.Column('study_group_id', db.Integer, db.ForeignKey('study_groups.study_group_id')),
    db.Column('institution_id', db.Integer, db.ForeignKey('institutions.institution_id'))
)


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-memberships.user', '-reviews.user')

    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    dob = db.Column(db.String)
    email = db.Column(db.String(120), unique=True, nullable=False)
    national_id = db.Column(db.Integer, unique=True)
    phone_number = db.Column(db.Integer)
    user_category = db.Column(db.String(32), nullable=False)
    _password_hash = db.Column(db.String)

    memberships = db.relationship("Membership", back_populates="user")
    study_groups = db.relationship("StudyGroup", back_populates="owner")
    reviews = db.relationship("Review", back_populates="user")

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
            'user_id': self.user_id,
            'name': self.name,
            'dob': self.dob,
            'email': self.email,
            'national_id': self.national_id,
            'phone_number': self.phone_number,
            'user_category': self.user_category
        }


class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'

    serialize_rules = ('-study_groups.course',)

    course_id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(200), nullable=False, unique=True)

    study_groups = db.relationship('StudyGroup', back_populates='course')

    def to_dict(self):
        return {
            'course_id': self.course_id,
            'course_name': self.course_name
        }


class StudyGroup(db.Model, SerializerMixin):
    __tablename__ = 'study_groups'

    serialize_rules = ('-memberships.study_group', '-reviews.study_group', '-owner.study_groups', '-course.study_groups', '-institutions.study_groups')

    study_group_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(255))
    subject = db.Column(db.String(100))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'), nullable=True)
    owner_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)
    start_date = db.Column(db.String, nullable=True)
    end_date = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    course = db.relationship('Course', back_populates='study_groups')
    owner = db.relationship('User', back_populates='study_groups')
    memberships = db.relationship('Membership', back_populates='study_group')
    reviews = db.relationship('Review', back_populates='study_group', cascade='all, delete-orphan')

    institutions = db.relationship("Institution", secondary=studygroup_institution, back_populates="study_groups")

    def to_dict(self):
        return {
            'study_group_id': self.study_group_id,
            'name': self.name,
            'description': self.description,
            'subject': self.subject,
            'created_at': str(self.created_at)
        }

class Institution(db.Model, SerializerMixin):
    __tablename__ = "institutions"

    serialize_rules = ('-study_groups.institutions',)

    institution_id = db.Column(db.Integer, primary_key=True)
    institution_name = db.Column(db.String(100), nullable=False)

    study_groups = db.relationship(
        "StudyGroup",
        secondary=studygroup_institution,
        back_populates="institutions"
    )

    def to_dict(self):
        return {
            "institution_id": self.institution_id,
            "institution_name": self.institution_name
        }


class Membership(db.Model, SerializerMixin):
    __tablename__ = 'memberships'

    serialize_rules = ('-user.memberships', '-study_group.memberships')

    membership_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    fee = db.Column(db.Integer, nullable=False)
    date_joined = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_graduated = db.Column(db.DateTime, nullable=True)
    tier = db.Column(db.String(20), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    study_group_id = db.Column(db.Integer, db.ForeignKey('study_groups.study_group_id'), nullable=False)

    user = db.relationship("User", back_populates="memberships")
    study_group = db.relationship("StudyGroup", back_populates="memberships")

    @validates('tier')
    def validate_tier(self, key, value):
        if value not in ['bronze', 'silver', 'gold']:
            raise ValueError('Tier must be bronze, silver, or gold')
        return value
    
    def to_dict(self):
        return {
            'membership_id': self.membership_id,
            'name': self.name,
            'fee': self.fee,
            'tier': self.tier,
            'date_joined': str(self.date_joined),
            'date_graduated': str(self.date_graduated) if self.date_graduated else None,
            'user_id': self.user_id,
            'study_group_id': self.study_group_id
        }


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    serialize_rules = ('-user.reviews', '-study_group.reviews')

    review_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    study_group_id = db.Column(db.Integer, db.ForeignKey('study_groups.study_group_id'), nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', back_populates='reviews')
    study_group = db.relationship('StudyGroup', back_populates='reviews')

    def to_dict(self):
        return {
            'review_id': self.review_id,
            'user_id': self.user_id,
            'study_group_id': self.study_group_id,
            'stars': self.stars,
            'comment': self.comment,
            'created_at': str(self.created_at)
        }
