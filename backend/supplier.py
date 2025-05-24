from extensions import db
import datetime

class Supplier(db.Model):
    __tablename__ = "supplier"
    id = db.Column(db.Integer, primary_key = True)
    suppl_name = db.Column(db.String(500))
    suppl_company = db.Column(db.String(500))
    suppl_phone = db.Column(db.String(1000))
    suppl_email = db.Column(db.String(500))
    suppl_address = db.Column(db.String(500))
    suppl_city = db.Column(db.String(500))
    suppl_region = db.Column(db.String(500))
    suppl_country = db.Column(db.String(500))
    suppl_postbox = db.Column(db.String(500))
    suppl_tax_id = db.Column(db.String(500))
    suppl_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    networth = db.Column(db.String(200))
    chart_accnt = db.Column(db.Integer,db.ForeignKey('chart_of_accounts.id'))
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,suppl_name, suppl_company,suppl_phone,suppl_email,suppl_address,suppl_city,suppl_region,suppl_country,suppl_postbox,suppl_tax_id,suppl_status,datetime,networth,chart_accnt,userid):
        self.id = id
        self.suppl_name = suppl_name
        self.suppl_company = suppl_company
        self.suppl_phone = suppl_phone
        self.suppl_email = suppl_email
        self.suppl_address = suppl_address
        self.suppl_city = suppl_city
        self.suppl_region = suppl_region
        self.suppl_country = suppl_country
        self.suppl_postbox = suppl_postbox
        self.suppl_tax_id = suppl_tax_id
        self.suppl_status = suppl_status
        self.datetime = datetime
        self.networth = networth
        self.chart_accnt = chart_accnt
        self.userid = userid
        
    def __repr__(self):
        return '<Party %r' % self.suppl_name
    
    def map(self):
        return {'id': self.id, 'suppl_name':  str(self.suppl_name).capitalize(), 'suppl_company': self.suppl_company,'suppl_phone':self.suppl_phone,'suppl_email':self.suppl_email,  'suppl_address': self.suppl_address, 'suppl_city': self.suppl_city,'suppl_region':self.suppl_region,'suppl_country':self.suppl_country,  'suppl_postbox': self.suppl_postbox, 'suppl_tax_id': self.suppl_tax_id,'suppl_status':self.suppl_status,'datetime':self.datetime,'networth':self.networth, 'chart_accnt':self.chart_accnt, "userid":self.userid}

