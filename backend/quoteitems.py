from extensions import db
import datetime

class QuoteItems(db.Model):
    __tablename__ = "quote_items"
    id = db.Column(db.Integer, primary_key = True)
    item_name = db.Column(db.String(500))
    item_product = db.Column(db.Integer,db.ForeignKey('tbl_product.id'))
    item_invoice =db.Column(db.Integer,db.ForeignKey('tbl_quote.id'))
    item_name_name = db.relationship('TblProduct', backref='QuoteItems.item_product')
    item_invoice_name = db.relationship('TblQuote', backref='QuoteItems.item_invoice')    
    item_qnty = db.Column(db.String(200))
    item_rate = db.Column(db.String(200))
    item_per_tax = db.Column(db.String(200))
    item_tax = db.Column(db.String(200))
    item_disc = db.Column(db.String(200))
    item_amount = db.Column(db.String(200))
    item_description = db.Column(db.String(1000))
    item_disc_val = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,item_name, item_product,item_invoice,item_name_name,item_invoice_name,item_qnty,item_rate,item_per_tax,item_tax,item_disc,item_amount,item_description,datetime,item_disc_val, userid):
        self.id = id
        self.item_name = item_name
        self.item_product = item_product
        self.item_invoice = item_invoice
        self.item_name_name = QuoteItems.item_product.product_name
        self.item_invoice_name = QuoteItems.item_invoice.quote_num
        self.item_qnty = item_qnty
        self.item_rate = item_rate
        self.item_per_tax = item_per_tax
        self.item_tax = item_tax
        self.item_disc = item_disc
        self.item_amount = item_amount
        self.item_description = item_description
        self.datetime = datetime
        self.item_disc_val = item_disc_val
        self.userid = userid
        
    def __repr__(self):
        return '<Party %r' % self.item_name
    
    def map(self):
        return {'id': self.id, 'item_name': self.item_name, 'item_product': self.item_product,'item_invoice': self.item_invoice, 'item_name_name': self.item_name_name.product_name, 'item_invoice_name': self.item_invoice_name.quote_num,'item_qnty':self.item_qnty,'item_rate':self.item_rate,  'item_per_tax': self.item_per_tax, 'item_tax': self.item_tax,'item_disc':self.item_disc,'item_amount':self.item_amount,  'item_description': self.item_description, 'datetime': self.datetime, 'item_disc_val':self.item_disc_val, "userid":self.userid}
