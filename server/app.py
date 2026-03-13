#!/usr/bin/env python3

from flask import request, session
from flask_restful import Resource

from .config import app, db, api
from models import User, Membership, StudyGroup, Course, Review, Institution


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
        return {'error': 'Invalid email or password'}, 401

class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return {}, 204

class CheckSession(Resource):
    def get(self):
        user = User.query.get(session.get('user_id'))
        if user:
            return user.to_dict(), 200
        return {'error': 'Not logged in'}, 401


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


## Courses
class CourseListResource(Resource):
    def get(self):
        courses = Course.query.all()
        return [c.to_dict() for c in courses], 200

class CourseResource(Resource):
    def get(self, course_id):
        course = Course.query.get(course_id)
        if not course:
            return {'error': 'Course not found'}, 404
        return course.to_dict(), 200

class CourseStudyGroupResource(Resource):
    def get(self, course_id):
        course = Course.query.get(course_id)
        if not course:
            return {'error': 'Course not found'}, 404
        groups = StudyGroup.query.filter_by(course_id=course_id).all()
        return [sg.to_dict() for sg in groups], 200


## Study Groups
class StudyGroupList(Resource):
    def get(self):
        groups = StudyGroup.query.all()
        return [sg.to_dict() for sg in groups], 200
    
## Institutions
class InstitutionList(Resource):
    def get(self):
        institutions = Institution.query.all()
        return [i.to_dict() for i in institutions], 200

    def post(self):
        data = request.get_json()
        try:
            inst = Institution(institution_name=data['institution_name'])
            db.session.add(inst)
            db.session.commit()
            return inst.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 422

class InstitutionByID(Resource):
    def patch(self, id):
        inst = Institution.query.get(id)
        if not inst:
            return {'error': 'Institution not found'}, 404
        data = request.get_json()
        if 'institution_name' in data:
            inst.institution_name = data['institution_name']
        db.session.commit()
        return inst.to_dict(), 200

    def delete(self, id):
        inst = Institution.query.get(id)
        if not inst:
            return {'error': 'Institution not found'}, 404
        db.session.delete(inst)
        db.session.commit()
        return {}, 204

class ReviewList(Resource):
    def get(self):
        reviews = [n.to_dict() for n in Review.query.all()]
        return reviews, 200



    def post(self):
        data = request.get_json()
        try:
            review = Review(
                user_id=data['user_id'],
                study_group_id=data['study_group_id'],
                stars=data['stars'],
                comment=data.get('comment', '')
            )
            db.session.add(review)
            db.session.commit()
            return review.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 422

api.add_resource(ReviewList, '/reviews')


api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')

api.add_resource(MembershipList, '/memberships')
api.add_resource(MembershipByID, '/memberships/<int:id>')
api.add_resource(MembershipsByStudyGroup, '/study_groups/<int:study_group_id>/memberships')
api.add_resource(MembershipsByUser, '/users/<int:user_id>/memberships')

api.add_resource(CourseListResource, '/courses')
api.add_resource(CourseResource, '/courses/<int:course_id>')
api.add_resource(CourseStudyGroupResource, '/courses/<int:course_id>/study-groups')
api.add_resource(StudyGroupList, '/study_groups')

api.add_resource(InstitutionList, '/institutions')
api.add_resource(InstitutionByID, '/institutions/<int:id>')


@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)