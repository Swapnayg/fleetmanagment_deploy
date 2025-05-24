from extensions import db
import datetime

class GoodsNlc(db.Model):
    __tablename__ = "goods_nlc"
    id = db.Column(db.Integer, primary_key = True)
    bilty_no = db.Column(db.String(500))
    b_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    vehicle = db.Column(db.Integer,db.ForeignKey('vehicles.id'))
    goods_vehicle_name = db.relationship('Vehicles', backref='GoodsNlc.vehicle')
    loading_point = db.Column(db.String(500))
    unloading_point = db.Column(db.String(500))
    parties =db.Column(db.Integer,db.ForeignKey('paty_adda.id'))
    goods_party_name = db.relationship('Party', backref='GoodsNlc.parties')
    weight = db.Column(db.String(200))
    per_ton = db.Column(db.String(200))
    freight = db.Column(db.String(200))
    wrt_4_per_freight = db.Column(db.String(200))
    commission = db.Column(db.String(200))
    other_cahrges = db.Column(db.String(200))
    vehicle_freight = db.Column(db.String(200))
    vehicle_balance = db.Column(db.String(200))
    advance_to_vehicle = db.Column(db.String(200))
    bill_status =  db.Column(db.String(200))
    paid_by = db.Column(db.String(200))
    goods_gst =  db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    tax_per =  db.Column(db.String(50))
    comm_per =  db.Column(db.String(50))

    def __init__(self,id, bilty_no, b_date,vehicle,goods_vehicle_name,loading_point,unloading_point,parties,weight,per_ton,freight,wrt_4_per_freight,commission,other_cahrges,vehicle_freight,vehicle_balance,advance_to_vehicle,bill_status,paid_by,goods_gst,datetime, userid, tax_per, comm_per):
        self.id = id
        self.bilty_no = bilty_no
        self.b_date = b_date
        self.vehicle = vehicle
        self.goods_vehicle_name = GoodsNlc.vehicle.vehicle_num
        self.loading_point = loading_point
        self.unloading_point = unloading_point
        self.parties = parties
        self.goods_party_name = GoodsNlc.parties.english_name
        self.weight = weight
        self.per_ton = per_ton
        self.freight = freight
        self.wrt_4_per_freight = wrt_4_per_freight
        self.commission = commission
        self.other_cahrges = other_cahrges
        self.vehicle_freight = vehicle_freight
        self.vehicle_balance = vehicle_balance
        self.advance_to_vehicle = advance_to_vehicle
        self.bill_status = bill_status
        self.paid_by = paid_by
        self.goods_gst = goods_gst
        self.datetime = datetime
        self.userid = userid
        self.tax_per = tax_per
        self.comm_per = comm_per

    def __repr__(self):
        return '<Party %r' % self.bilty_no
    
    def map(self):
        return {'id': self.id, 'bilty_no': self.bilty_no, 'b_date': self.b_date, 'vehicle': self.vehicle,'goods_vehicle_name':self.goods_vehicle_name.vehicle_num, 'loading_point': self.loading_point, 'unloading_point': self.unloading_point, 'parties': self.parties,'goods_party_name':self.goods_party_name.english_name ,'weight': self.weight,'per_ton':self.per_ton,'freight': self.freight,'wrt_4_per_freight':self.wrt_4_per_freight,'commission': self.commission,'other_cahrges':self.other_cahrges,'vehicle_freight':self.vehicle_freight,'vehicle_balance':self.vehicle_balance,'advance_to_vehicle':self.advance_to_vehicle,'bill_status':self.bill_status,'paid_by':self.paid_by,'goods_gst':self.goods_gst,'datetime': self.datetime, "userid":self.userid, "tax_per":self.tax_per, "comm_per":self.comm_per}
