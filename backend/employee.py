from extensions import db
import datetime

class Exmployee(db.Model):
    
    __tablename__ = "exmployee"
    id = db.Column(db.Integer, primary_key = True)
    emp_name = db.Column(db.String(500))
    designation = db.Column(db.String(500))
    contact_number = db.Column(db.String(200))
    contact_number2 = db.Column(db.String(200))
    emp_email = db.Column(db.String(500))
    emp_address = db.Column(db.String(1000))
    emp_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, emp_name, designation,contact_number,contact_number2,emp_email,emp_address,emp_status,datetime,userid):
        self.id = id
        self.emp_name = emp_name
        self.designation = designation
        self.contact_number = contact_number
        self.contact_number2 = contact_number2
        self.emp_email = emp_email
        self.emp_address = emp_address
        self.emp_status = emp_status
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.emp_name
    
    def map(self):
        return {'id': self.id, 'emp_name': self.emp_name, 'designation': self.designation, 'contact_number': self.contact_number, 'contact_number2': self.contact_number2, 'emp_email': self.emp_email, 'emp_address': self.emp_address, 'emp_status': self.emp_status, 'datetime': self.datetime, "userid":self.userid}


