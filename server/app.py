#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User

## Auth
class Register(Resource):
    def post(self):
        data = request.get_json()
        try:
            user = User(
                name=data['name'],
                dob=data['dob'],
                email=data['email'],
                national_id=data['national_id'],
                phone_number=data['phone_number'],
                user_category=data['user_category']
            )
            user.password_hash = data['password']
            db.session.add(user)
            db.session.commit()

            session['user_id'] = user.id
            return user.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 422
        

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()

        if user and user.authenticate(data['password']):
            session['user_id'] = user.id
            return user.to_dict(), 200
        return {'error' : 'Invalid email or password'}, 401


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

