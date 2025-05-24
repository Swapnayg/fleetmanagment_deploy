from extensions import db
import datetime

class TripExpense(db.Model):
    
    __tablename__ = "trip_expense"
    id = db.Column(db.Integer, primary_key = True)
    vehicle = db.Column(db.String(500))
    driver_name = db.Column(db.String(200))
    driver_number = db.Column(db.String(200))
    start_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    end_date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    reference = db.Column(db.String(500))
    exp_from = db.Column(db.String(500))
    exp_to = db.Column(db.String(500))
    return_from = db.Column(db.String(500))
    return_to = db.Column(db.String(500))
    advance = db.Column(db.String(500))
    total_amt = db.Column(db.String(500))
    freight = db.Column(db.String(500))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, vehicle, driver_name,driver_number,start_date,end_date,reference,exp_from,exp_to,return_from,return_to,advance,total_amt,freight,datetime,userid):
        self.id = id
        self.vehicle = vehicle
        self.driver_name = driver_name
        self.driver_number = driver_number
        self.start_date = start_date
        self.end_date = end_date
        self.reference = reference
        self.exp_from = exp_from
        self.exp_to = exp_to
        self.return_from = return_from
        self.return_to = return_to
        self.advance = advance
        self.total_amt = total_amt
        self.freight = freight
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.vehicle
    
    def map(self):
        return {'id': self.id, 'vehicle': self.vehicle, 'driver_name': self.driver_name, 'driver_number': self.driver_number, 'start_date': self.start_date, 'end_date': self.end_date, 'reference': self.reference, 'exp_from': self.exp_from, 'exp_to': self.exp_to,'return_from': self.return_from, 'return_to': self.return_to,'advance':self.advance,'total_amt':self.total_amt,'freight':self.freight,'datetime': self.datetime, "userid":self.userid}
