from extensions import db
import datetime

class Designation(db.Model):
    __tablename__ = "designation"
    id = db.Column(db.Integer, primary_key = True)
    desig_name = db.Column(db.String(500))
    design_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    
    def __init__(self,id, desig_name, design_status,datetime, userid):
        self.id = id
        self.desig_name = desig_name
        self.design_status = design_status
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.desig_name
    
    def map(self):
        return {'id': self.id, 'desig_name': self.desig_name, 'design_status': self.design_status, 'datetime': self.datetime, "userid":self.userid}

