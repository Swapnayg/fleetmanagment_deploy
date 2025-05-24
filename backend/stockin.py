from extensions import db
import datetime

class Stockin(db.Model):
    
    __tablename__ = "stockin"
    id = db.Column(db.Integer, primary_key = True)
    stock_item = db.Column(db.Integer,db.ForeignKey('products.id'))
    stock_unit = db.Column(db.Integer,db.ForeignKey('units.id'))
    stock_qty = db.Column(db.String(200))
    stock_party = db.Column(db.Integer,db.ForeignKey('paty_adda.id'))
    stock_ware = db.Column(db.Integer,db.ForeignKey('inv_warehouses.id'))
    gd_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    stock_lp = db.Column(db.String(500))
    stock_cop = db.Column(db.String(500))
    stock_tot_amt = db.Column(db.String(500))
    stock_remarks = db.Column(db.String(1000))
    stock_item_name = db.relationship('Products', backref='Stockin.stock_item')
    stock_unit_name = db.relationship('Units', backref='Stockin.stock_unit')
    stock_party_name = db.relationship('Party', backref='Stockin.stock_party')
    stock_ware_name = db.relationship('InvWarehouses', backref='Stockin.stock_ware')
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, stock_item, stock_unit,stock_qty,stock_party,stock_ware,gd_date,stock_lp,stock_cop,stock_tot_amt,stock_remarks,stock_item_name,stock_unit_name,stock_party_name,stock_ware_name,datetime,userid):
        self.id = id
        self.stock_item = stock_item
        self.stock_unit = stock_unit
        self.stock_qty = stock_qty
        self.stock_party = stock_party
        self.stock_ware = stock_ware
        self.gd_date = gd_date
        self.stock_lp = stock_lp
        self.stock_cop = stock_cop
        self.stock_tot_amt = stock_tot_amt
        self.stock_remarks = stock_remarks
        self.stock_item_name = stock_item_name
        self.stock_unit_name = stock_unit_name
        self.stock_party_name = stock_party_name
        self.stock_ware_name = stock_ware_name
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.stock_item
    
    def map(self):
        return {'id': self.id, 'stock_item': self.stock_item, 'stock_unit': self.stock_unit, 'stock_qty': self.stock_qty, 'stock_party': self.stock_party, 'stock_ware': self.stock_ware, 'gd_date': self.gd_date, 'stock_lp': self.stock_lp, 'stock_cop': self.stock_cop,'stock_tot_amt': self.stock_tot_amt, 'stock_remarks': self.stock_remarks, 'stock_item_name': self.stock_item_name, 'stock_unit_name': self.stock_unit_name, 'stock_party_name': self.stock_party_name, 'stock_ware_name': self.stock_ware_name, 'datetime': self.datetime, "userid":self.userid}

