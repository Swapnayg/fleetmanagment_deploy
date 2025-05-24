from extensions import db
import datetime

class Categories(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key = True)
    cat_name = db.Column(db.String(500))
    cat_code = db.Column(db.String(500))
    cat_status = db.Column(db.String(200))
    datetime = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now())
    userid = db.Column(db.Integer,db.ForeignKey('users.id' , ondelete='CASCADE'))

    def __init__(self,id, cat_name, cat_code,cat_status,datetime, userid):
        self.id = id
        self.cat_name = cat_name
        self.cat_code = cat_code
        self.cat_status = cat_status
        self.datetime = datetime
        self.userid = userid

    def __repr__(self):
        return '<Party %r' % self.cat_name
    
    def map(self):
        return {'id': self.id, 'cat_name': self.cat_name, 'cat_code': self.cat_code, 'cat_status': self.cat_status, 'datetime': self.datetime, "userid":self.userid}
