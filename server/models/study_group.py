from db import db

studygroup_institution = db.Table(
    'studygroup_institution',
    db.Column('studygroup_id', db.Integer, db.ForeignKey('study_groups.id')),
    db.Column('institution_id', db.Integer, db.ForeignKey('institutions.id'))
)

class StudyGroup(db.Model):
    __tablename__ = "study_groups"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String)
    institutions = db.relationship(
        "Institution",
        secondary=studygroup_institution,
        back_populates="study_groups"
    )
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "institutions": [inst.institution_name for inst in self.institutions]
        }