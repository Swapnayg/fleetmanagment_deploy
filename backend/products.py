from extensions import db
import datetime

class Products(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key = True)
    p_name = db.Column(db.String(500))
    category = db.Column(db.Integer,db.ForeignKey('categories.id'))
    p_units = db.Column(db.Integer,db.ForeignKey('units.id'))
    prod_cat_name = db.relationship('Categories', backref='Products.category')
    prod_unit_name = db.relationship('Units', backref='Products.p_units')
    p_status = db.Column(db.String(100))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    
    def __init__(self,id, p_name, category,p_units,prod_cat_name,prod_unit_name,p_status,datetime,userid):
        self.id = id
        self.p_name = p_name
        self.category = category
        self.p_units = p_units
        self.prod_cat_name = Products.category.cat_name
        self.prod_unit_name = Products.p_units.units_name
        self.p_status = p_status
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.p_name
    
    def map(self):
        return {'id': self.id, 'p_name': self.p_name, 'category': self.category,'p_units':self.p_units, 'prod_cat_name':self.prod_cat_name.cat_name, 'prod_unit_name':self.prod_unit_name.units_name, 'p_status':self.p_status, 'datetime': self.datetime, "userid":self.userid}


