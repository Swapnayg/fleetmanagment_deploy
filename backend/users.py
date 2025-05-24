from extensions import db
import datetime


class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    fullname = db.Column(db.String(500))
    email = db.Column(db.String(200))
    phone = db.Column(db.String(200))
    department = db.Column(db.String(200))
    designation = db.Column(db.String(200))
    description = db.Column(db.String(500))
    profile_url = db.Column(db.String(500))
    username = db.Column(db.String(200))
    password = db.Column(db.String(200))
    language = db.Column(db.String(200))
    user_role =  db.Column(db.String(200)) 
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())

    def __init__(self,id, fullname,email,phone,department,designation,description,profile_url,username,language,password,datetime, user_role):
        self.id = id
        self.fullname = fullname
        self.email = email
        self.phone = phone
        self.department = department
        self.designation = designation
        self.description = description
        self.profile_url = profile_url
        self.username = username
        self.language = language
        self.password = password
        self.user_role = user_role
        self.datetime = datetime

    def __repr__(self):
        return '<Party %r' % self.username
    
    def map(self):
        return {'id': self.id, 'fullname': self.fullname, 'email': self.email,'phone': self.phone, 'department': self.department, 'designation': self.designation, "description":self.description, "profile_url":self.profile_url, "username":self.username, "language":self.language, "password":self.password,"user_role":self.user_role  ,"datetime":self.datetime }

