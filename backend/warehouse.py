from extensions import db
import datetime

class Warehouse(db.Model):
    __tablename__ = "warehouse"
    id = db.Column(db.Integer, primary_key = True)
    ware_name = db.Column(db.String(500))
    ware_description = db.Column(db.String(1000))
    w_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    
    def __init__(self,id, ware_name, ware_description,w_status,datetime,userid):
        self.id = id
        self.ware_name = ware_name
        self.ware_description = ware_description
        self.w_status = w_status
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.ware_name
    
    def map(self):
        return {'id': self.id, 'ware_name': self.ware_name, 'ware_code': self.ware_description,'w_status':self.w_status, 'datetime': self.datetime, "userid":self.userid}
