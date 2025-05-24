from extensions import db
import datetime

class TblStockRtn(db.Model):
    __tablename__ = "tbl_stock_rtn"
    id = db.Column(db.Integer, primary_key = True)
    supplier_id = db.Column(db.Integer,db.ForeignKey('supplier.id'))
    warehouse_id =db.Column(db.Integer,db.ForeignKey('warehouse.id'))
    supplier_name = db.relationship('Supplier', backref='TblStockRtn.supplier_id')
    warehouse_name = db.relationship('Warehouse', backref='TblStockRtn.warehouse_id')
    stock_num = db.Column(db.String(200))
    stock_refer = db.Column(db.String(200))
    stock_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    stock_due_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    stock_tax = db.Column(db.String(200))
    stock_discount = db.Column(db.String(200))
    total_tax = db.Column(db.String(200))
    total_discount = db.Column(db.String(200))
    shipping = db.Column(db.String(200))
    grand_total = db.Column(db.String(200))
    stock_items = db.Column(db.String(200))
    stock_note = db.Column(db.String(1000))
    payment_terms = db.Column(db.String(500))
    update_stock = db.Column(db.String(500))
    stock_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,supplier_id, warehouse_id,supplier_name,warehouse_name,stock_num,stock_refer,stock_date,stock_due_date,stock_tax,stock_discount,total_tax,total_discount,shipping,grand_total,stock_items,stock_note,payment_terms,update_stock,stock_status,datetime, userid):
        self.id = id
        self.supplier_id = supplier_id
        self.warehouse_id = warehouse_id
        self.supplier_name = TblStockRtn.supplier_id.suppl_name
        self.warehouse_name = TblStockRtn.warehouse_id.ware_name
        self.stock_num = stock_num
        self.stock_refer = stock_refer
        self.stock_date = stock_date
        self.stock_due_date = stock_due_date
        self.stock_tax = stock_tax
        self.stock_discount = stock_discount
        self.total_tax = total_tax
        self.total_discount = total_discount
        self.shipping = shipping
        self.grand_total = grand_total
        self.stock_items = stock_items
        self.stock_note = stock_note
        self.payment_terms = payment_terms
        self.update_stock = update_stock
        self.stock_status = stock_status
        self.datetime = datetime
        self.userid = userid
        
    def __repr__(self):
        return '<Party %r' % self.supplier_id
    
    def map(self):
        return {'id': self.id, 'supplier_id': self.supplier_id, 'warehouse_id': self.warehouse_id,'supplier_name': self.supplier_name.suppl_name, 'warehouse_name': self.warehouse_name.ware_name,'stock_num':self.stock_num, 'stock_refer': self.stock_refer,'stock_date':self.stock_date,'stock_due_date':self.stock_due_date,  'stock_tax': self.stock_tax, 'stock_discount': self.stock_discount,'total_tax':self.total_tax,'total_discount':self.total_discount,  'shipping': self.shipping, 'grand_total': self.grand_total,'stock_items':self.stock_items,'stock_note':self.stock_note,'payment_terms':self.payment_terms,'update_stock':self.update_stock,'stock_status':self.stock_status,'datetime':self.datetime, "userid":self.userid}

