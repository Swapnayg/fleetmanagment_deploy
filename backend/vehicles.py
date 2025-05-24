from extensions import db
import datetime

class Vehicles(db.Model):
    __tablename__ = "vehicles"
    id = db.Column(db.Integer, primary_key = True)
    vehicle_num = db.Column(db.String(500))
    driver_name = db.Column(db.String(200))
    phone_number = db.Column(db.String(200))
    chart_accnt = db.Column(db.Integer,db.ForeignKey('chart_of_accounts.id'))
    net_worth = db.Column(db.String(200))
    veh_type = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))
    
    def __init__(self,id, vehicle_num, driver_name,phone_number,areas,chart_accnt,net_worth,veh_type,datetime,userid):
        self.id = id
        self.vehicle_num = vehicle_num
        self.driver_name = driver_name
        self.phone_number = phone_number
        self.areas = areas
        self.net_worth = net_worth
        self.chart_accnt = chart_accnt
        self.veh_type = veh_type
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.vehicle_num
    
    def map(self):
        return {'id': self.id, 'vehicle_num': self.vehicle_num, 'driver_name': self.driver_name,'phone_number':self.phone_number, 'chart_accnt':self.chart_accnt,'net_worth':self.net_worth,'veh_type':self.veh_type, 'datetime': self.datetime, "userid":self.userid}

