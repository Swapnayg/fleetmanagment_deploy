from extensions import db
import datetime

class StockTrasfer(db.Model):
    __tablename__ = "stock_trasfer"
    id = db.Column(db.Integer, primary_key = True)
    stock_tranf_from = db.Column(db.Integer,db.ForeignKey('warehouse.id'))
    stock_product = db.Column(db.Integer,db.ForeignKey('tbl_product.id'))
    stock_tranf_to = db.Column(db.Integer,db.ForeignKey('warehouse.id'))
    stock_tranf_from_name = db.relationship('Warehouse', backref = 'StockTrasfer.stock_tranf_from', primaryjoin = "StockTrasfer.stock_tranf_from == Warehouse.id")
    stock_product_name = db.relationship('TblProduct', backref='StockTrasfer.stock_product')
    stock_tranf_to_name = db.relationship('Warehouse', backref = 'StockTrasfer.stock_tranf_to', primaryjoin = "StockTrasfer.stock_tranf_to == Warehouse.id")
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,stock_tranf_from, stock_product,stock_tranf_to,stock_tranf_from_name,stock_product_name,stock_tranf_to_name,datetime,userid ):
        self.id = id
        self.stock_tranf_from = stock_tranf_from
        self.stock_product = stock_product
        self.stock_tranf_to = stock_tranf_to
        self.stock_tranf_from_name = StockTrasfer.stock_tranf_from.ware_name
        self.stock_product_name = StockTrasfer.stock_product.product_name
        self.stock_tranf_to_name = StockTrasfer.stock_tranf_to.ware_name
        self.datetime = datetime
        self.userid = userid
        
    def __repr__(self):
        return '<Party %r' % self.stock_tranf_from
    
    def map(self):
        return {'id': self.id, 'stock_tranf_from': self.stock_tranf_from, 'stock_product': self.stock_product,'stock_tranf_to':self.stock_tranf_to,'stock_tranf_from_name':self.stock_tranf_from_name.ware_name,'stock_product_name':self.stock_product_name.product_name,'stock_tranf_to_name':self.stock_tranf_to_name.ware_name,'datetime':self.datetime, "userid":self.userid}

