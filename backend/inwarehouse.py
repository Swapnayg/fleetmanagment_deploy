from extensions import db
import datetime

class InvWarehouses(db.Model):
    __tablename__ = "inv_warehouses"
    id = db.Column(db.Integer, primary_key = True)
    ware_name = db.Column(db.String(500))
    ware_code = db.Column(db.String(200))
    ware_location = db.Column(db.String(500))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    
    def __init__(self,id, ware_name, ware_code,ware_location,datetime, userid):
        self.id = id
        self.ware_name = ware_name
        self.ware_code = ware_code
        self.ware_location = ware_location
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.ware_name
    
    def map(self):
        return {'id': self.id, 'ware_name': self.ware_name, 'ware_code': self.ware_code,'ware_location':self.ware_location, 'datetime': self.datetime, "userid":self.userid}

