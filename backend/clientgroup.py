from extensions import db
import datetime


class ClientGroup(db.Model):
    __tablename__ = "client_group"
    id = db.Column(db.Integer, primary_key = True)
    group_name = db.Column(db.String(500))
    group_descp = db.Column(db.String(500))
    group_status = db.Column(db.String(500))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,group_name, group_descp,group_status,datetime,userid ):
        self.id = id
        self.group_name = group_name
        self.group_descp = group_descp
        self.group_status = group_status
        self.datetime = datetime
        self.userid = userid
        
    def __repr__(self):
        return '<Party %r' % self.group_name
    
    def map(self):
        return {'id': self.id, 'group_name': self.group_name, 'group_descp': self.group_descp,'group_status':self.group_status,'datetime':self.datetime, "userid":self.userid}

