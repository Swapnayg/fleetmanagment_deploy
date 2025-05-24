from extensions import db
import datetime

class AccountTypes(db.Model):
    __tablename__ = "account_types"
    id = db.Column(db.Integer, primary_key = True)
    type_name = db.Column(db.String(500))
    type_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    username = db.Column(db.String(200))
    
    def __init__(self,id, type_name, type_status,datetime,userid,username):
        self.id = id
        self.type_name = type_name
        self.type_status = type_status
        self.datetime = datetime
        self.userid = userid
        self.username = username

    def __repr__(self):
        return '<Party %r' % self.type_name
    
    def map(self):
        return {'id': self.id, 'type_name': self.type_name, 'type_status': self.type_status, 'datetime': self.datetime, "userid":self.userid, "username":self.username}

