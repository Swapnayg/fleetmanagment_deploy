
from extensions import db
import datetime

class TblOrder(db.Model):
    __tablename__ = "tbl_order"
    id = db.Column(db.Integer, primary_key = True)
    supplier_id = db.Column(db.Integer,db.ForeignKey('supplier.id'))
    warehouse_id =db.Column(db.Integer,db.ForeignKey('warehouse.id'))
    supplier_name = db.relationship('Supplier', backref='TblOrder.supplier_id')
    warehouse_name = db.relationship('Warehouse', backref='TblOrder.warehouse_id')
    order_num = db.Column(db.String(200))
    order_refer = db.Column(db.String(200))
    order_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    order_due_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    order_tax = db.Column(db.String(200))
    order_discount = db.Column(db.String(200))
    total_tax = db.Column(db.String(200))
    total_discount = db.Column(db.String(200))
    shipping = db.Column(db.String(200))
    grand_total = db.Column(db.String(200))
    order_items = db.Column(db.String(200))
    order_note = db.Column(db.String(1000))
    payment_terms = db.Column(db.String(500))
    update_stock = db.Column(db.String(500))
    order_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,supplier_id, warehouse_id,supplier_name,warehouse_name,order_num,order_refer,order_date,order_due_date,order_tax,order_discount,total_tax,total_discount,shipping,grand_total,order_items,order_note,payment_terms,update_stock,order_status,datetime,userid):
        self.id = id
        self.supplier_id = supplier_id
        self.warehouse_id = warehouse_id
        self.supplier_name = TblOrder.supplier_id.suppl_name
        self.warehouse_name = TblOrder.warehouse_id.ware_name
        self.order_num = order_num
        self.order_refer = order_refer
        self.order_date = order_date
        self.order_due_date = order_due_date
        self.order_tax = order_tax
        self.order_discount = order_discount
        self.total_tax = total_tax
        self.total_discount = total_discount
        self.shipping = shipping
        self.grand_total = grand_total
        self.order_items = order_items
        self.order_note = order_note
        self.payment_terms = payment_terms
        self.update_stock = update_stock
        self.order_status = order_status
        self.datetime = datetime
        self.userid = userid
        
    def __repr__(self):
        return '<Party %r' % self.supplier_id
    
    def map(self):
        return {'id': self.id, 'supplier_id': self.supplier_id, 'warehouse_id': self.warehouse_id,'supplier_name': self.supplier_name.suppl_name, 'warehouse_name': self.warehouse_name.ware_name,'order_num':self.order_num, 'order_refer': self.order_refer,'order_date':self.order_date,'order_due_date':self.order_due_date,  'order_tax': self.order_tax, 'order_discount': self.order_discount,'total_tax':self.total_tax,'total_discount':self.total_discount,  'shipping': self.shipping, 'grand_total': self.grand_total,'order_items':self.order_items,'order_note':self.order_note,'payment_terms':self.payment_terms,'update_stock':self.update_stock,'order_status':self.order_status,'datetime':self.datetime, "userid":self.userid}

