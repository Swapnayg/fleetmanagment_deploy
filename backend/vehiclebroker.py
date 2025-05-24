from extensions import db
import datetime

class VehicleBroker(db.Model):
    
    __tablename__ = "vehicle_broker"
    id = db.Column(db.Integer, primary_key = True)
    vbroker_name = db.Column(db.String(500))
    vbroker_address = db.Column(db.String(1000))
    vbroker_num = db.Column(db.String(500))
    vbroker_fax = db.Column(db.String(500))
    vbroker_email = db.Column(db.String(500))
    vbroker_web = db.Column(db.String(500))
    vbroker_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, vbroker_name, vbroker_address,vbroker_num,vbroker_fax,vbroker_email,vbroker_web,vbroker_status,datetime,userid):
        self.id = id
        self.vbroker_name = vbroker_name
        self.vbroker_address = vbroker_address
        self.vbroker_num = vbroker_num
        self.vbroker_fax = vbroker_fax
        self.vbroker_email = vbroker_email
        self.vbroker_web = vbroker_web
        self.vbroker_status = vbroker_status
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.vbroker_name
    
    def map(self):
        return {'id': self.id, 'vbroker_name': self.vbroker_name, 'vbroker_address': self.vbroker_address, 'vbroker_num': self.vbroker_num, 'vbroker_fax': self.vbroker_fax, 'vbroker_email': self.vbroker_email, 'vbroker_web': self.vbroker_web, 'vbroker_status': self.vbroker_status, 'datetime': self.datetime, "userid":self.userid}

