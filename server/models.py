from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

# Models go here!

# Membership Model

class Membership(db.Model, SerializerMixin):
    __tablename__ = "memberships"

    membership_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    fee = db.Column(db.Integer, nullable=False)
    date_joined = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_graduated = db.Column(db.DateTime, nullable=True)
    tier = db.Column(db.String(20), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    study_group_id = db.Column(db.Integer, db.ForeignKey("study_groups.study_group_id"), nullable=False)

    user = db.relationship("User", back_populates="memberships")
    study_group = db.relationship("StudyGroup", back_populates="memberships")
    