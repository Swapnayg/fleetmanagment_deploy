from extensions import db
import datetime


class AccountSubTypes(db.Model):
    __tablename__ = "account_sub_types"
    id = db.Column(db.Integer, primary_key = True)
    type_name_id = db.Column(db.Integer,db.ForeignKey('account_types.id' , ondelete='CASCADE'))
    sub_type_name = db.Column(db.String(500))
    type_status = db.Column(db.String(200))
    type_name_name = db.relationship('AccountTypes', backref='AccountSubTypes.type_name')
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    username = db.Column(db.String(200))

    def __init__(self,id, type_name_id,sub_type_name,type_status,type_name_name,datetime,userid,username):
        self.id = id
        self.type_name_id = type_name_id
        self.sub_type_name = sub_type_name
        self.type_status = type_status
        self.type_name_name = AccountSubTypes.type_name_id.type_name
        self.datetime = datetime
        self.userid = userid
        self.username = username

    def __repr__(self):
        return '<Party %r' % self.sub_type_name
    
    def map(self):
        return {'id': self.id, 'type_name_id': self.type_name_id, 'sub_type_name': self.sub_type_name,'type_status': self.type_status, 'type_name_name': self.type_name_name.type_name, 'datetime': self.datetime, "userid":self.userid, "username":self.username}

