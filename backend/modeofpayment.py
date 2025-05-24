from extensions import db
import datetime

class ModeOfPayment(db.Model):
    __tablename__ = "mode_of_payment"
    id = db.Column(db.Integer, primary_key = True)
    pay_name = db.Column(db.String(500))
    pay_status = db.Column(db.String(200))
    exlc_in_cash = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    
    def __init__(self,id, pay_name, pay_status,exlc_in_cash,datetime, userid):
        self.id = id
        self.pay_name = pay_name
        self.pay_status = pay_status
        self.exlc_in_cash = exlc_in_cash
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.pay_name
    
    def map(self):
        return {'id': self.id, 'pay_name': self.pay_name, 'pay_status': self.pay_status,'exlc_in_cash':self.exlc_in_cash, 'datetime': self.datetime, "userid":self.userid}


