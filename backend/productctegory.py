from extensions import db
import datetime

class ProductCategory(db.Model):
    __tablename__ = "product_category"
    id = db.Column(db.Integer, primary_key = True)
    product_cat_name = db.Column(db.String(500))
    product_cat_desp = db.Column(db.String(500))
    product_cat_status = db.Column(db.String(500))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,product_cat_name, product_cat_desp,product_cat_status,datetime,userid ):
        self.id = id
        self.product_cat_name = product_cat_name
        self.product_cat_desp = product_cat_desp
        self.product_cat_status = product_cat_status
        self.datetime = datetime
        self.userid = userid
        
    def __repr__(self):
        return '<Party %r' % self.product_cat_name
    
    def map(self):
        return {'id': self.id, 'product_cat_name': self.product_cat_name, 'product_cat_desp': self.product_cat_desp,'product_cat_status':self.product_cat_status,'datetime':self.datetime, "userid":self.userid}

