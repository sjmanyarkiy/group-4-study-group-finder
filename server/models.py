from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.ext.hybrid import hybrid_property

from config import db

# Models go here!

class User(db.model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    dob = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    national_id = db.Column(db.Integer, unique=True)
    phone_number = db.Column(db.Integer)
    user_category = db.Column(db.String)
    _password_hash = db.Column(db.String)

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
            'id' : self.id,
            'name' : self.name,
            'dob' : self.dob,
            'email' : self.email,
            'national_id' : self.national_id,
            'phone_number' : self.phone_number,
            'user_category' : self.user_category
        }