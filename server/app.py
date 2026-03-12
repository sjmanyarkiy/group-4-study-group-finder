#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Membership, StudyGroup

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

            session['user_id'] = user.user_id
            return user.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 422
        

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()

        if user and user.authenticate(data['password']):
            session['user_id'] = user.user_id
            return user.to_dict(), 200
        return {'error' : 'Invalid email or password'}, 401
    
class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return {}, 204
    
class CheckSession(Resource):
    def get(self):
        user = User.query.get(session.get('user_id'))
        if user:
            return user.to_dict(), 200
        return {'error' : 'Not logged in'}, 401
    
## Memberships
class MembershipList(Resource):
    def post(self):
        data = request.get_json()
        try:
            membership = Membership(
                name=data['name'],
                fee=data['fee'],
                tier=data['tier'],
                user_id=data['user_id'],
                study_group_id=data['study_group_id']
            )
            db.session.add(membership)
            db.session.commit()
            return membership.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 422
        
class MembershipByID(Resource):
    def patch(self, id):
        membership = Membership.query.get(id)
        if not membership:
            return {'error': 'Membership not found'}, 404
        
        data = request.get_json()
        try:
            for field in ['name', 'fee', 'tier', 'date_graduated']:
                if field in data:
                    setattr(membership, field, data[field])
            db.session.commit()
            return membership.to_dict(), 200
        except Exception as e:
            return {'error': str(e)}, 422
        
    def delete(self, id):
        membership = Membership.query.get(id)
        if not membership:
            return {'error': 'Membership not found'}, 404
        
        db.session.delete(membership)
        db.session.commit()
        return {}, 204

class MembershipsByStudyGroup(Resource):
    def get(self, study_group_id):
        study_group = StudyGroup.query.get(study_group_id)
        if not study_group:
            return {'error': 'Study group not found'}, 404
        
        memberships = Membership.query.filter_by(study_group_id=study_group_id).all()
        return [m.to_dict() for m in memberships], 200


class MembershipsByUser(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        
        memberships = Membership.query.filter_by(user_id=user_id).all()
        return [m.to_dict() for m in memberships], 200
    
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')

api.add_resource(MembershipList, '/memberships')
api.add_resource(MembershipByID, '/memberships/<int:id>')
api.add_resource(MembershipsByStudyGroup, '/study_groups/<int:study_group_id>/memberships')
api.add_resource(MembershipsByUser, '/users/<int:user_id>/memberships')

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

