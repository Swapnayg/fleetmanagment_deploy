from extensions import db
import datetime

class BookingPerson(db.Model):
    
    __tablename__ = "booking_person"
    id = db.Column(db.Integer, primary_key = True)
    book_code = db.Column(db.String(500))
    book_name = db.Column(db.String(500))
    book_address = db.Column(db.String(1000))
    book_cont_per = db.Column(db.String(500))
    book_cont_num = db.Column(db.String(500))
    book_cont_fax = db.Column(db.String(500))
    book_cont_email = db.Column(db.String(500))
    book_cont_web = db.Column(db.String(500))
    book_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, book_code, book_name,book_address,book_cont_per,book_cont_num,book_cont_fax,book_cont_email,book_cont_web,book_status,datetime,userid):
        self.id = id
        self.book_code = book_code
        self.book_name = book_name
        self.book_address = book_address
        self.book_cont_per = book_cont_per
        self.book_cont_num = book_cont_num
        self.book_cont_fax = book_cont_fax
        self.book_cont_web = book_cont_web
        self.book_cont_email = book_cont_email
        self.book_status = book_status
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.book_code
    
    def map(self):
        return {'id': self.id, 'book_code': self.book_code, 'book_name': self.book_name, 'book_address': self.book_address, 'book_cont_per': self.book_cont_per, 'book_cont_num': self.book_cont_num, 'book_cont_fax': self.book_cont_fax, 'book_cont_email': self.book_cont_email, 'book_cont_web': self.book_cont_web, 'book_status': self.book_status, 'datetime': self.datetime, "userid":self.userid}
