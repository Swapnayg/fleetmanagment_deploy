from extensions import db
import datetime

class Clients(db.Model):
    __tablename__ = "clients"
    id = db.Column(db.Integer, primary_key = True)
    client_name = db.Column(db.String(500))
    client_company = db.Column(db.String(500))
    client_phone = db.Column(db.String(1000))
    client_email = db.Column(db.String(500))
    client_address = db.Column(db.String(500))
    client_city = db.Column(db.String(500))
    client_region = db.Column(db.String(500))
    client_country = db.Column(db.String(500))
    client_postbox = db.Column(db.String(500))
    client_tax_id = db.Column(db.String(500))
    client_group = db.Column(db.Integer,db.ForeignKey('client_group.id'))
    client_group_name = db.relationship('ClientGroup', backref='Clients.client_group')
    shipp_name = db.Column(db.String(500))
    shipp_phone = db.Column(db.String(1000))
    shipp_email = db.Column(db.String(500))
    shipp_address = db.Column(db.String(500))
    shipp_city = db.Column(db.String(500))
    shipp_region = db.Column(db.String(500))
    shipp_country = db.Column(db.String(500))
    shipp_postbox = db.Column(db.String(500))
    client_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    same_address = db.Column(db.String(50))
    networth = db.Column(db.String(200))
    chart_accnt = db.Column(db.Integer,db.ForeignKey('chart_of_accounts.id'))
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id,client_name, client_company,client_phone,client_email,client_address, client_city,client_region , client_country, client_postbox, client_tax_id, client_group, client_group_name, shipp_name, shipp_phone, shipp_email, shipp_address, shipp_city, shipp_region, shipp_country, shipp_postbox, client_status, datetime,same_address,networth,chart_accnt,userid):
        self.id = id
        self.client_name = client_name
        self.client_company = client_company
        self.client_phone = client_phone
        self.client_email = client_email
        self.client_address = client_address
        self.client_city = client_city
        self.client_region = client_region
        self.client_country = client_country
        self.client_postbox = client_postbox
        self.client_tax_id = client_tax_id
        self.client_group = client_group
        self.client_group_name = Clients.client_group.group_name
        self.shipp_name = shipp_name
        self.shipp_phone = shipp_phone
        self.shipp_email = shipp_email
        self.shipp_address = shipp_address
        self.shipp_city = shipp_city
        self.shipp_region = shipp_region
        self.shipp_country = shipp_country
        self.shipp_postbox = shipp_postbox
        self.client_status = client_status
        self.datetime = datetime
        self.same_address = same_address
        self.networth = networth
        self.chart_accnt = chart_accnt
        self.userid = userid
        
    def __repr__(self):
        return '<Party %r' % self.client_name
    
    def map(self):
        return {'id': self.id, 'client_name': str(self.client_name).capitalize(), 'client_company': self.client_company,'client_phone':self.client_phone,'client_email':self.client_email, 'client_address':self.client_address,'client_city':self.client_city,'client_region':self.client_region,'client_country':self.client_country,'client_postbox':self.client_postbox,'client_tax_id':self.client_tax_id,'client_group':self.client_group,'client_group_name':self.client_group_name.group_name,'shipp_name':self.shipp_name,'shipp_phone':self.shipp_phone,'shipp_email':self.shipp_email,'shipp_address':self.shipp_address,'shipp_city':self.shipp_city,'shipp_region':self.shipp_region,'shipp_country':self.shipp_country,'shipp_postbox':self.shipp_postbox,'client_status':self.client_status,'datetime':self.datetime,'same_address':self.same_address,'networth':self.networth, 'chart_accnt':self.chart_accnt, "userid":self.userid}
