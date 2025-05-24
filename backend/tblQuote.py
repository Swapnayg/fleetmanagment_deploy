from extensions import db
import datetime

class TblQuote(db.Model):
    __tablename__ = "tbl_quote"
    id = db.Column(db.Integer, primary_key = True)
    client_id = db.Column(db.Integer,db.ForeignKey('clients.id'))
    warehouse_id =db.Column(db.Integer,db.ForeignKey('warehouse.id'))
    client_name = db.relationship('Clients', backref='TblQuote.client_id')
    warehouse_name = db.relationship('Warehouse', backref='TblQuote.warehouse_id')
    quote_num = db.Column(db.String(200))
    quote_refer = db.Column(db.String(200))
    quote_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    quote_due_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    quote_tax = db.Column(db.String(200))
    quote_discount = db.Column(db.String(200))
    total_tax = db.Column(db.String(200))
    total_discount = db.Column(db.String(200))
    shipping = db.Column(db.String(200))
    grand_total = db.Column(db.String(200))
    quote_items = db.Column(db.String(200))
    quote_note = db.Column(db.String(1000))
    payment_currency = db.Column(db.String(500))
    payment_terms = db.Column(db.String(500))
    invoice_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,client_id, warehouse_id,client_name,warehouse_name,quote_num,quote_refer,quote_date,quote_due_date,quote_tax,quote_discount,total_tax,total_discount,shipping,grand_total,quote_items,quote_note,payment_currency,payment_terms,invoice_status,datetime,userid):
        self.id = id
        self.client_id = client_id
        self.warehouse_id = warehouse_id
        self.client_name = TblQuote.client_id.client_name
        self.warehouse_name = TblQuote.warehouse_id.ware_name
        self.quote_num = quote_num
        self.quote_refer = quote_refer
        self.quote_date = quote_date
        self.quote_due_date = quote_due_date
        self.quote_tax = quote_tax
        self.quote_discount = quote_discount
        self.total_tax = total_tax
        self.total_discount = total_discount
        self.shipping = shipping
        self.grand_total = grand_total
        self.quote_items = quote_items
        self.quote_note = quote_note
        self.payment_currency = payment_currency
        self.payment_terms = payment_terms
        self.invoice_status = invoice_status
        self.datetime = datetime
        self.userid = userid
        
    def __repr__(self):
        return '<Party %r' % self.client_id
    
    def map(self):
        return {'id': self.id, 'client_id': self.client_id, 'warehouse_id': self.warehouse_id,'client_name': self.client_name.client_name, 'warehouse_name': self.warehouse_name.ware_name,'quote_num':self.quote_num, 'quote_refer': self.quote_refer,'quote_date':self.quote_date,'quote_due_date':self.quote_due_date,  'quote_tax': self.quote_tax, 'quote_discount': self.quote_discount,'total_tax':self.total_tax,'total_discount':self.total_discount,  'shipping': self.shipping, 'grand_total': self.grand_total,'quote_items':self.quote_items,'quote_note':self.quote_note,'payment_currency':self.payment_currency,'payment_terms':self.payment_terms,'invoice_status':self.invoice_status,'datetime':self.datetime, "userid":self.userid}

