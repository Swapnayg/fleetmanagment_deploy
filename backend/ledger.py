from extensions import db
import datetime

class Ledger(db.Model):  
    __tablename__ = "ledger"
    id = db.Column(db.Integer, primary_key = True)
    ledger_account_no = db.Column(db.Integer,db.ForeignKey('chart_of_accounts.id'))
    ledger_account_name = db.relationship('ChartOfAccount', backref='Ledger.ledger_account_no')
    ledger_party_name = db.Column(db.String(200))
    ledger_gen_date =  db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    ledger_debit_amount = db.Column(db.String(200))
    ledger_credit_amount = db.Column(db.String(200))
    ledger_bill = db.Column(db.String(200))
    ledger_method = db.Column(db.String(200))
    ledger_balance = db.Column(db.String(200))
    ledger_bill_no = db.Column(db.String(200))
    ledger_type = db.Column(db.String(200))
    ledger_descp = db.Column(db.String(500))
    pay_start = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, ledger_account_no,ledger_account_name,ledger_party_name,ledger_gen_date,ledger_debit_amount,ledger_credit_amount,ledger_bill,ledger_method,ledger_balance,ledger_bill_no,ledger_type,ledger_descp,datetime,pay_start, userid):
        self.id = id
        self.ledger_account_no = ledger_account_no
        self.ledger_account_name = Ledger.ledger_account_no.accnt_name
        self.ledger_party_name = ledger_party_name
        self.ledger_gen_date = ledger_gen_date
        self.ledger_debit_amount = ledger_debit_amount
        self.ledger_credit_amount = ledger_credit_amount
        self.ledger_bill = ledger_bill
        self.ledger_method = ledger_method
        self.ledger_balance = ledger_balance
        self.ledger_bill_no = ledger_bill_no
        self.ledger_type = ledger_type
        self.ledger_descp = ledger_descp
        self.datetime = datetime
        self.pay_start = pay_start
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.ledger_party_name
    
    def map(self):
        return {'id': self.id, 'ledger_account_no': self.ledger_account_no, 'ledger_account_name': str(self.ledger_account_name.accnt_name).strip().capitalize(), 'ledger_party_name': self.ledger_party_name, 'ledger_gen_date':self.ledger_gen_date, 'ledger_debit_amount': self.ledger_debit_amount, 'ledger_credit_amount': self.ledger_credit_amount,'ledger_bill':self.ledger_bill,'ledger_method':self.ledger_method,'ledger_balance':self.ledger_balance, 'ledger_bill_no':self.ledger_bill_no,'ledger_type':self.ledger_type,'ledger_descp':self.ledger_descp,'datetime': self.datetime,'pay_start': self.pay_start, "userid":self.userid}
