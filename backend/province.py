from extensions import db
import datetime


class Province(db.Model):
    __tablename__ = "province"
    id = db.Column(db.Integer, primary_key = True)
    prov_name = db.Column(db.String(500))
    prov_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    
    def __init__(self,id, prov_name, prov_status,datetime,userid):
        self.id = id
        self.prov_name = prov_name
        self.prov_status = prov_status
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.prov_name
    
    def map(self):
        return {'id': self.id, 'prov_name': self.prov_name, 'prov_status': self.prov_status, 'datetime': self.datetime, "userid":self.userid}

