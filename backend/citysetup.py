from extensions import db
import datetime

class CitySetup(db.Model):
    __tablename__ = "city_setup"
    id = db.Column(db.Integer, primary_key = True)
    city_name_e = db.Column(db.String(500))
    city_prov = db.Column(db.Integer,db.ForeignKey('province.id'))
    city_status = db.Column(db.String(200))
    city_prov_name = db.relationship('Province', backref='CitySetup.city_prov')
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, city_name_e,city_prov,city_status,city_prov_name,datetime,userid):
        self.id = id
        self.city_name_e = city_name_e
        self.city_prov = city_prov
        self.city_status = city_status
        self.city_prov_name = CitySetup.city_prov.prov_name
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.city_name_e
    
    def map(self):
        return {'id': self.id, 'city_name_e': self.city_name_e, 'city_prov': self.city_prov,'city_status': self.city_status, 'city_prov_name': self.city_prov_name.prov_name, 'datetime': self.datetime, "userid":self.userid}
