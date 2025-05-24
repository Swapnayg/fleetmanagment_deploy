from extensions import db
import datetime

class DailyExpenses(db.Model):
    
    __tablename__ = "daily_expenses"
    id = db.Column(db.Integer, primary_key = True)
    account_head = db.Column(db.String(500))
    amount = db.Column(db.String(200))
    type = db.Column(db.String(200))
    remarks = db.Column(db.String(1000))
    paid_by = db.Column(db.String(500))
    mode_of_pay = db.Column(db.String(200))
    entry_type = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, account_head, amount,type,remarks,paid_by,mode_of_pay,entry_type,datetime,userid):
        self.id = id
        self.account_head = account_head
        self.amount = amount
        self.type = type
        self.remarks = remarks
        self.paid_by = paid_by
        self.mode_of_pay = mode_of_pay
        self.entry_type = entry_type
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.account_head
    
    def map(self):
        return {'id': self.id, 'account_head': self.account_head, 'amount': self.amount, 'type': self.type, 'remarks': self.remarks, 'paid_by': self.paid_by, 'mode_of_pay': self.mode_of_pay, 'entry_type': self.entry_type, 'datetime': self.datetime, "userid":self.userid}

