from extensions import db
import datetime

class Units(db.Model):
    __tablename__ = "units"
    id = db.Column(db.Integer, primary_key = True)
    units_name = db.Column(db.String(500))
    units_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    
    def __init__(self,id, units_name, units_status,datetime,userid):
        self.id = id
        self.units_name = units_name
        self.units_status = units_status
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.units_name
    
    def map(self):
        return {'id': self.id, 'units_name': self.units_name, 'units_status': self.units_status, 'datetime': self.datetime, "userid":self.userid}

