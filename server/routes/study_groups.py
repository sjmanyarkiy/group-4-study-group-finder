from flask import request
from flask_restful import Resource
from db import db
from models.study_group import StudyGroup
from models.institution import Institution

class StudyGroups(Resource):
    def get(self):
        groups = db.session.execute(db.select(StudyGroup)).scalars().all()
        return [group.to_dict() for group in groups], 200

    def post(self):
        data = request.get_json()
        group = StudyGroup(
            name=data["name"],
            description=data.get("description")
        )
        if "institution_ids" in data:
            institutions = db.session.execute(
                db.select(Institution).filter(Institution.id.in_(data["institution_ids"]))
            ).scalars().all()
            group.institutions = institutions
        db.session.add(group)
        db.session.commit()
        return group.to_dict(), 201

class StudyGroupByID(Resource):
    def get(self, id):
        group = db.session.get(StudyGroup, id)
        if not group:
            return {"error": "Study group not found"}, 404
        return group.to_dict(), 200

    def patch(self, id):
        group = db.session.get(StudyGroup, id)
        if not group:
            return {"error": "Study group not found"}, 404
        data = request.get_json()
        if "name" in data:
            group.name = data["name"]
        if "description" in data:
            group.description = data["description"]
        db.session.commit()
        return group.to_dict(), 200

    def delete(self, id):
        group = db.session.get(StudyGroup, id)
        if not group:
            return {"error": "Study group not found"}, 404
        db.session.delete(group)
        db.session.commit()
        return {"message": "Study group deleted"}, 200

class Institutions(Resource):
    def get(self):
        institutions = db.session.execute(db.select(Institution)).scalars().all()
        return [inst.to_dict() for inst in institutions], 200

    def post(self):
        data = request.get_json()
        inst = Institution(institution_name=data["institution_name"])
        db.session.add(inst)
        db.session.commit()
        return inst.to_dict(), 201