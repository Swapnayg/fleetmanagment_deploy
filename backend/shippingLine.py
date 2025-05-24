from extensions import db
import datetime

class ShippingLine(db.Model):
    
    __tablename__ = "shipping_line"
    id = db.Column(db.Integer, primary_key = True)
    ship_name = db.Column(db.String(500))
    ship_con_pern = db.Column(db.String(500))
    ship_con_phone = db.Column(db.String(500))
    ship_con_email = db.Column(db.String(500))
    ship_con_fax = db.Column(db.String(500))
    ship_con_web = db.Column(db.String(500))
    ship_address = db.Column(db.String(500))
    ship_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, ship_name, ship_con_pern,ship_con_phone,ship_con_email,ship_con_fax,ship_con_web,ship_address,ship_status,datetime,userid):
        self.id = id
        self.ship_name = ship_name
        self.ship_con_pern = ship_con_pern
        self.ship_con_phone = ship_con_phone
        self.ship_con_email = ship_con_email
        self.ship_con_fax = ship_con_fax
        self.ship_con_web = ship_con_web
        self.ship_address = ship_address
        self.ship_status = ship_status
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.ship_name
    
    def map(self):
        return {'id': self.id, 'ship_name': self.ship_name, 'ship_con_pern': self.ship_con_pern, 'ship_con_phone': self.ship_con_phone, 'ship_con_email': self.ship_con_email, 'ship_con_fax': self.ship_con_fax, 'ship_con_web': self.ship_con_web, 'ship_address': self.ship_address, 'ship_status': self.ship_status, 'datetime': self.datetime, "userid":self.userid}
