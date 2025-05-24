from extensions import db
import datetime

class PartyBill(db.Model):
    __tablename__ = "party_bill"
    id = db.Column(db.Integer, primary_key = True)
    invoice_no = db.Column(db.String(200))
    invoice_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    invoice_due_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    party_id = db.Column(db.Integer,db.ForeignKey('paty_adda.id'))
    party_name = db.Column(db.String(500))
    invoice_sub_total = db.Column(db.String(200))
    invoice_discount = db.Column(db.String(200))
    invoice_tx = db.Column(db.String(200))
    invoice_balance = db.Column(db.String(200))
    invoice_status = db.Column(db.String(200))
    invoice_bilties = db.Column(db.String(200))
    invoice_type = db.Column(db.String(200))
    invoice_sales_person = db.Column(db.String(500))
    invoice_thank_message = db.Column(db.String(500))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,invoice_no, invoice_date,invoice_due_date,party_id,party_name,invoice_sub_total,invoice_discount,invoice_tx,invoice_balance,invoice_status,invoice_bilties,invoice_type,invoice_sales_person,invoice_thank_message,datetime, userid):
        self.id = id
        self.invoice_no = invoice_no
        self.invoice_date = invoice_date
        self.invoice_due_date = invoice_due_date
        self.party_id = party_id
        self.party_name = party_name
        self.invoice_sub_total = invoice_sub_total
        self.invoice_discount = invoice_discount
        self.invoice_tx = invoice_tx
        self.invoice_balance = invoice_balance
        self.invoice_status = invoice_status
        self.invoice_bilties = invoice_bilties
        self.invoice_type = invoice_type
        self.invoice_sales_person = invoice_sales_person
        self.invoice_thank_message = invoice_thank_message
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.invoice_no
    
    def map(self):
        return {'id': self.id, 'invoice_no': self.invoice_no, 'invoice_date': self.invoice_date,'invoice_due_date':self.invoice_due_date, 'party_id':self.party_id,'party_name':self.party_name,'invoice_sub_total':self.invoice_sub_total,'invoice_discount':self.invoice_discount,'invoice_tx':self.invoice_tx,'invoice_balance':self.invoice_balance,'invoice_status':self.invoice_status, 'invoice_bilties':self.invoice_bilties,'invoice_type':self.invoice_type,'invoice_sales_person':self.invoice_sales_person,'invoice_thank_message':self.invoice_thank_message,  'datetime':self.datetime, "userid":self.userid}
    
