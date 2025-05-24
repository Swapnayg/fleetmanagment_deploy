from extensions import db
import datetime

class ReceivingPoints(db.Model):
    __tablename__ = "receiving_points"
    id = db.Column(db.Integer, primary_key = True)
    receiver_name = db.Column(db.String(500))
    receiving_status = db.Column(db.String(200))
    areas = db.Column(db.String(1000))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    
    def __init__(self,id, receiver_name, receiving_status,areas,datetime,userid):
        self.id = id
        self.receiver_name = receiver_name
        self.receiving_status = receiving_status
        self.areas = areas
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.receiver_name
    
    def map(self):
        return {'id': self.id, 'receiver_name': self.receiver_name, 'receiving_status': self.receiving_status,'areas':self.areas, 'datetime': self.datetime, "userid":self.userid}


