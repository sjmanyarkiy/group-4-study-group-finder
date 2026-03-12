from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.ext.hybrid import hybrid_property

from config import db

# Models go here!

class User(db.Model):
    __tablename__ = 'users'

    serialize_rules = ('-user.memberships', '-study_group.memberships')

    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    dob = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    national_id = db.Column(db.Integer, unique=True)
    phone_number = db.Column(db.Integer)
    user_category = db.Column(db.String)
    _password_hash = db.Column(db.String)

    memberships = db.relationship("Membership", back_populates="user")

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = generate_password_hash(password)

    def authenticate(self, password):
        return check_password_hash(self._password_hash, password)
        
    @validates('user_category')
    def validate_user_category(self, key, value):
        if value not in ['student' , 'lecturer']:
            raise ValueError('user category must be student or lecturer')
        return value

    @validates('email')
    def validate_email(self, key, value):
        if '@' not in value:
            raise ValueError('Invalid email address')
        return value

    def to_dict(self):
        return {
            'user_id' : self.user_id,
            'name' : self.name,
            'dob' : self.dob,
            'email' : self.email,
            'national_id' : self.national_id,
            'phone_number' : self.phone_number,
            'user_category' : self.user_category
        }
# Membership Model

class Membership(db.Model, SerializerMixin):
    __tablename__ = "memberships"

    serialize_rules = ('-user.memberships', '-study_group.memberships')

    membership_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    fee = db.Column(db.Integer, nullable=False)
    date_joined = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_graduated = db.Column(db.DateTime, nullable=True)
    tier = db.Column(db.String(20), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    study_group_id = db.Column(db.Integer, db.ForeignKey("study_groups.study_group_id"), nullable=False)

    user = db.relationship("User", back_populates="memberships")
    study_group = db.relationship("StudyGroup", back_populates="memberships")

    @validates('tier')
    def validate_tier(self, key, value):
        if value not in ['bronze', 'silver', 'gold']:
            raise ValueError('Tier must be bronze, silver, or gold')
        return value
    
# Study Group Model

class StudyGroup(db.Model, SerializerMixin):
    __tablename__ = 'study_groups'

    serialize_rules = ('-memberships.study_group', '-memberships.user._password_hash')

    study_group_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    subject = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    memberships = db.relationship("Membership", back_populates="study_group")

    def to_dict(self):
        return {
            'study_group_id': self.study_group_id,
            'name': self.name,
            'description': self.description,
            'subject': self.subject,
            'created_at': str(self.created_at)
        }