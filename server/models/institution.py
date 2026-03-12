from db import db
from models.study_group import studygroup_institution

class Institution(db.Model):
    __tablename__ = "institutions"
    id = db.Column(db.Integer, primary_key=True)
    institution_name = db.Column(db.String(100), nullable=False)
    study_groups = db.relationship(
        "StudyGroup",
        secondary=studygroup_institution,
        back_populates="institutions"
    )
    def to_dict(self):
        return {
            "id": self.id,
            "institution_name": self.institution_name
        }