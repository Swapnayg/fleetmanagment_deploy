from extensions import db
import datetime


class ChartOfAccount(db.Model):
    __tablename__ = "chart_of_accounts"
    id = db.Column(db.Integer, primary_key = True)
    accnt_name = db.Column(db.String(500))
    accnt_code = db.Column(db.String(200))
    accnt_type = db.Column(db.Integer,db.ForeignKey('account_sub_types.id'))
    accnt_status = db.Column(db.String(200))
    accnt_type_name = db.relationship('AccountSubTypes', backref='ChartOfAccount.accnt_type')
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    accnt_description = db.Column(db.String(1000))
    networth = db.Column(db.String(200), default="0")
    account_mode = db.Column(db.String(200))
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, accnt_name,accnt_code,accnt_type,accnt_status,accnt_type_name,datetime,accnt_description,networth,account_mode,userid):
        self.id = id
        self.accnt_name = accnt_name
        self.accnt_code = accnt_code
        self.accnt_type = accnt_type
        self.accnt_status = accnt_status
        self.accnt_type_name = ChartOfAccount.accnt_type.sub_type_name
        self.datetime = datetime
        self.accnt_description = accnt_description
        self.networth = networth
        self.account_mode = account_mode
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.accnt_name
    
    def map(self):
        return {'id': self.id, 'accnt_name':str(self.accnt_name).strip().capitalize(), 'accnt_code': self.accnt_code, 'accnt_type': self.accnt_type, 'accnt_status': self.accnt_status,'accnt_type_name': self.accnt_type_name.sub_type_name, 'datetime': self.datetime, 'accnt_description':self.accnt_description, 'networth':self.networth, 'account_mode':self.account_mode, "userid":self.userid}
