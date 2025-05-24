
from extensions import db
import datetime

class Container(db.Model):
    __tablename__ = "container"
    id = db.Column(db.Integer, primary_key = True)
    cont_size = db.Column(db.String(500))
    cont_code = db.Column(db.String(500))
    cont_desc = db.Column(db.String(1000))
    c_status = db.Column(db.String(100))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, cont_size, cont_code,cont_desc,c_status,datetime,userid):
        self.id = id
        self.cont_size = cont_size
        self.cont_code = cont_code
        self.cont_desc = cont_desc
        self.c_status = c_status
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.cont_size
    
    def map(self):
        return {'id': self.id, 'cont_size': self.cont_size, 'cont_code': self.cont_code, 'cont_desc': self.cont_desc,'c_status': self.c_status, 'datetime': self.datetime, "userid":self.userid}

