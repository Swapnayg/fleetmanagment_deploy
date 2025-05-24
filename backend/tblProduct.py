from extensions import db
import datetime

class TblProduct(db.Model):
    __tablename__ = "tbl_product"
    id = db.Column(db.Integer, primary_key = True)
    product_name = db.Column(db.String(500))
    product_cat = db.Column(db.Integer,db.ForeignKey('product_category.id'))
    product_ware =db.Column(db.Integer,db.ForeignKey('warehouse.id'))
    product_cat_name = db.relationship('ProductCategory', backref='TblProduct.product_cat')
    product_ware_name = db.relationship('Warehouse', backref='TblProduct.product_ware')
    product_code = db.Column(db.String(500))
    product_rental = db.Column(db.String(500))
    product_whole_price = db.Column(db.String(500))
    product_tax = db.Column(db.String(500))
    product_discount = db.Column(db.String(500))
    product_stock = db.Column(db.String(500))
    product_alert = db.Column(db.String(500))
    product_description = db.Column(db.String(500))
    product_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,product_name, product_cat,product_ware,product_cat_name,product_ware_name,product_code,product_rental,product_whole_price,product_tax,product_discount,product_stock,product_alert,product_description,product_status,datetime,userid):
        self.id = id
        self.product_name = product_name
        self.product_cat = product_cat
        self.product_ware = product_ware
        self.product_cat_name = TblProduct.product_cat.product_cat_name
        self.product_ware_name = TblProduct.product_ware.ware_name
        self.product_code = product_code
        self.product_rental = product_rental
        self.product_whole_price = product_whole_price
        self.product_tax = product_tax
        self.product_discount = product_discount
        self.product_stock = product_stock
        self.product_alert = product_alert
        self.product_description = product_description
        self.product_status = product_status
        self.datetime = datetime
        self.userid = userid
        
    def __repr__(self):
        return '<Party %r' % self.product_name
    
    def map(self):
        return {'id': self.id, 'product_name': self.product_name, 'product_cat': self.product_cat,'product_ware':self.product_ware, 'product_cat_name': self.product_cat_name.product_cat_name,'product_ware_name':self.product_ware_name.ware_name,'product_code':self.product_code,  'product_rental': self.product_rental, 'product_whole_price': self.product_whole_price,'product_tax':self.product_tax,'product_discount':self.product_discount,  'product_stock': self.product_stock, 'product_alert': self.product_alert,'product_description':self.product_description,'product_status':self.product_status,'datetime':self.datetime, "userid":self.userid}
    
