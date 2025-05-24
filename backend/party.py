from extensions import db
import datetime

class Party(db.Model):
    __tablename__ = "paty_adda"
    id = db.Column(db.Integer, primary_key = True)
    english_name = db.Column(db.String(500))
    type = db.Column(db.String(200))
    contact_person = db.Column(db.String(500))
    phone_number = db.Column(db.String(200))
    chart_accnt = db.Column(db.Integer,db.ForeignKey('chart_of_accounts.id'))
    net_amount = db.Column(db.String(200), default="0")
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, english_name, type,contact_person,phone_number,chart_accnt,net_amount,datetime, userid):
        self.id = id
        self.english_name = english_name
        self.type = type
        self.contact_person = contact_person
        self.phone_number = phone_number
        self.chart_accnt = chart_accnt
        self.net_amount = net_amount
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.english_name
    
    def map(self):
        return {'id': self.id, 'english_name': self.english_name, 'type': self.type, 'contact_person': self.contact_person, 'phone_number': self.phone_number,'chart_accnt':self.chart_accnt, 'net_amount': self.net_amount, 'datetime': self.datetime, "userid":self.userid}
