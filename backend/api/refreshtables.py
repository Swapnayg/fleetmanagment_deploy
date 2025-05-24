import random
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from goodsnlc import GoodsNlc
from ledger import Ledger
from oilpso import OilPso
from party import Party
from extensions import db
from sqlalchemy import and_, insert
from api.refreshcoacustomer import RefreshCOA_Customer

class RefreshTables():

        
    def deleteGoods_ledger(id):
        del_manif_goods_set = GoodsNlc.query.get(int(id))
        del_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_bill == str(del_manif_goods_set.bilty_no).strip())
        db.session.execute(del_ledger_data)
        db.session.commit()

    def deleteOils_ledger(id):
        del_manif_oils_set = OilPso.query.get(int(id))
        del_oil_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_bill == str(del_manif_oils_set.bilty_no).strip())
        db.session.execute(del_oil_ledger_data)
        db.session.commit()