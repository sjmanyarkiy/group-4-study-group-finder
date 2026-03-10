from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db

# Models go here!

class User(db.model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    dob = db.Column(db.String)
    email = db.Column(db.String)
    national_id = db.Column(db.Integer)
    phone_number = db.Column(db.Integer)
    user_category = db.Column(db.String)
    _password_hash = db.Column(db.String)

    @validates('user_category')

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