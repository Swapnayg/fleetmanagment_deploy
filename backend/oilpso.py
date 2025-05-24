from extensions import db
import datetime

class OilPso(db.Model):
    __tablename__ = "oil_pso"
    id = db.Column(db.Integer, primary_key = True)
    bilty_no = db.Column(db.String(500))
    b_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    vehicle = db.Column(db.Integer,db.ForeignKey('vehicles.id'))
    oil_vehicle_name = db.relationship('Vehicles', backref='OilPso.vehicle')
    loading_point = db.Column(db.String(500))
    unloading_point = db.Column(db.String(500))
    parties = db.Column(db.Integer,db.ForeignKey('paty_adda.id'))
    oil_party_name = db.relationship('Party', backref='OilPso.parties')
    material = db.Column(db.String(500))
    quantity = db.Column(db.String(200))
    freight = db.Column(db.String(200))
    commission = db.Column(db.String(200))
    other_cahrges = db.Column(db.String(200))
    vehicle_freight = db.Column(db.String(200))
    vehicle_balance = db.Column(db.String(200))
    advance_to_vehicle = db.Column(db.String(200))
    per_ton = db.Column(db.String(200))
    wrt_4_per_freight = db.Column(db.String(200))
    bill_status = db.Column(db.String(200))
    paid_by = db.Column(db.String(200))
    oils_gst =  db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    tax_per =  db.Column(db.String(50))
    comm_per =  db.Column(db.String(50))

    def __init__(self,id, bilty_no, b_date,vehicle,oil_vehicle_name,loading_point,unloading_point,parties,oil_party_name,material,quantity,freight,commission,other_cahrges,vehicle_freight,vehicle_balance,advance_to_vehicle,per_ton,wrt_4_per_freight,bill_status,paid_by,oils_gst,datetime, userid, tax_per, comm_per):
        self.id = id
        self.bilty_no = bilty_no
        self.b_date = b_date
        self.vehicle = vehicle
        self.oil_vehicle_name = OilPso.vehicle.vehicle_num
        self.oil_vehicle_name = oil_vehicle_name
        self.loading_point = loading_point
        self.unloading_point = unloading_point
        self.parties = parties
        self.oil_party_name = OilPso.parties.english_name
        self.material = material
        self.quantity = quantity
        self.freight = freight
        self.commission = commission
        self.other_cahrges = other_cahrges
        self.vehicle_freight = vehicle_freight
        self.vehicle_balance = vehicle_balance
        self.advance_to_vehicle = advance_to_vehicle
        self.per_ton = per_ton
        self.wrt_4_per_freight = wrt_4_per_freight
        self.bill_status = bill_status
        self.paid_by = paid_by
        self.oils_gst = oils_gst
        self.datetime = datetime
        self.userid = userid
        self.tax_per = tax_per
        self.comm_per = comm_per

    def __repr__(self):
        return '<Party %r' % self.bilty_no
    
    def map(self):
        return {'id': self.id, 'bilty_no': self.bilty_no, 'b_date': self.b_date, 'vehicle': self.vehicle,'oil_vehicle_name':self.oil_vehicle_name.vehicle_num, 'loading_point': self.loading_point, 'unloading_point': self.unloading_point, 'parties': self.parties,'oil_party_name':self.oil_party_name.english_name, 'material': self.material, 'quantity': self.quantity,'freight': self.freight, 'commission': self.commission,'other_cahrges':self.other_cahrges,'vehicle_freight':self.vehicle_freight,'vehicle_balance':self.vehicle_balance,'advance_to_vehicle':self.advance_to_vehicle,'per_ton':self.per_ton,'wrt_4_per_freight':self.wrt_4_per_freight,'bill_status':self.bill_status,'paid_by':self.paid_by,'oils_gst':self.oils_gst,'datetime': self.datetime, "userid":self.userid,"tax_per":self.tax_per, "comm_per":self.comm_per}


