from extensions import db
import datetime

class TblReccInvoice(db.Model):
    __tablename__ = "tbl_recc_invoice"
    id = db.Column(db.Integer, primary_key = True)
    client_id = db.Column(db.Integer,db.ForeignKey('clients.id'))
    warehouse_id =db.Column(db.Integer,db.ForeignKey('warehouse.id'))
    client_name = db.relationship('Clients', backref='TblReccInvoice.client_id')
    warehouse_name = db.relationship('Warehouse', backref='TblReccInvoice.warehouse_id')
    invoice_num = db.Column(db.String(200))
    invoice_refer = db.Column(db.String(200))
    invoice_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    invoice_due_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    invoice_tax = db.Column(db.String(200))
    invoice_discount = db.Column(db.String(200))
    total_tax = db.Column(db.String(200))
    total_discount = db.Column(db.String(200))
    shipping = db.Column(db.String(200))
    grand_total = db.Column(db.String(200))
    invoice_items = db.Column(db.String(200))
    invoice_note = db.Column(db.String(1000))
    payment_currency = db.Column(db.String(500))
    payment_terms = db.Column(db.String(500))
    recc_period = db.Column(db.String(200))
    invoice_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,client_id, warehouse_id,client_name,warehouse_name,invoice_num,invoice_refer,invoice_date,invoice_due_date,invoice_tax,invoice_discount,total_tax,total_discount,shipping,grand_total,invoice_items,invoice_note,payment_currency,payment_terms,recc_period,invoice_status,datetime,userid):
        self.id = id
        self.client_id = client_id
        self.warehouse_id = warehouse_id
        self.client_name = TblReccInvoice.client_id.client_name
        self.warehouse_name = TblReccInvoice.warehouse_id.ware_name
        self.invoice_num = invoice_num
        self.invoice_refer = invoice_refer
        self.invoice_date = invoice_date
        self.invoice_due_date = invoice_due_date
        self.invoice_tax = invoice_tax
        self.invoice_discount = invoice_discount
        self.total_tax = total_tax
        self.total_discount = total_discount
        self.shipping = shipping
        self.grand_total = grand_total
        self.invoice_items = invoice_items
        self.invoice_note = invoice_note
        self.payment_currency = payment_currency
        self.payment_terms = payment_terms
        self.invoice_status = invoice_status
        self.recc_period = recc_period
        self.datetime = datetime
        self.userid = userid
        
    def __repr__(self):
        return '<Party %r' % self.client_id
    
    def map(self):
        return {'id': self.id, 'client_id': self.client_id, 'warehouse_id': self.warehouse_id, 'client_name': self.client_name.client_name, 'warehouse_name': self.warehouse_name.ware_name,'invoice_num':self.invoice_num, 'invoice_refer': self.invoice_refer,'invoice_date':self.invoice_date,'invoice_due_date':self.invoice_due_date,  'invoice_tax': self.invoice_tax, 'invoice_discount': self.invoice_discount,'total_tax':self.total_tax,'total_discount':self.total_discount,  'shipping': self.shipping, 'grand_total': self.grand_total,'invoice_items':self.invoice_items,'invoice_note':self.invoice_note,'payment_currency':self.payment_currency,'payment_terms':self.payment_terms,'recc_period':self.recc_period,'invoice_status':self.invoice_status,'datetime':self.datetime, "userid":self.userid}
