#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
from models.study_group import StudyGroup
from models.institution import Institution
from routes.study_groups import StudyGroups, StudyGroupByID, Institutions

# Register API resources
api.add_resource(StudyGroups, "/study-groups")
api.add_resource(StudyGroupByID, "/study-groups/<int:id>")
api.add_resource(Institutions, "/institutions")

# Home route
@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)