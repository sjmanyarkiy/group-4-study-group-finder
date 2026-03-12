from flask import request
from flask_restful import Resource
from db import db
from models.study_group import StudyGroup
from models.institution import Institution


class StudyGroups(Resource):

    # GET all study groups
    def get(self):
        groups = db.session.query(StudyGroup).all()
        return [group.to_dict() for group in groups], 200

    # CREATE study group
    def post(self):
        data = request.get_json()

        group = StudyGroup(
            name=data["name"],
            description=data.get("description")
        )

        # attach institutions
        if "institution_ids" in data:
            institutions = db.session.query(Institution).filter(
                Institution.id.in_(data["institution_ids"])
            ).all()

            group.institutions = institutions

        db.session.add(group)
        db.session.commit()

        return group.to_dict(), 201


class StudyGroupByID(Resource):

    # GET single study group
    def get(self, id):
        group = db.session.get(StudyGroup, id)

        if not group:
            return {"error": "Study group not found"}, 404

        return group.to_dict(), 200

    # UPDATE study group
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

    # DELETE study group
    def delete(self, id):
        group = db.session.get(StudyGroup, id)

        if not group:
            return {"error": "Study group not found"}, 404

        db.session.delete(group)
        db.session.commit()

        return {"message": "Study group deleted"}, 200


class Institutions(Resource):

    # GET institutions (dropdown list)
    def get(self):
        institutions = db.session.query(Institution).all()
        return [inst.to_dict() for inst in institutions], 200

    # CREATE institution
    def post(self):
        data = request.get_json()

        inst = Institution(
            institution_name=data["institution_name"]
        )

        db.session.add(inst)
        db.session.commit()

        return inst.to_dict(), 201