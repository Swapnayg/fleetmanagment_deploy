from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from accountSubTypes import AccountSubTypes
from accountTypes import AccountTypes
from party import Party
from chartofAccount import ChartOfAccount
from clients import Clients
from clnStkRtnItems import ClientReturnItems
from clnstkrtn import TblClnStockRtn
from goodsnlc import GoodsNlc
from invoiceItems import InvoiceItems
from ledger import Ledger
from ledger2 import Ledger2
from oilpso import OilPso
from partybill import PartyBill
from purchItems import PurchItems
from quoteitems import QuoteItems
from returnItems import ReturnItems
from stkRtn import TblStockRtn
from supplier import Supplier
from tblInvoice import TblInvoice
from tblOrder import TblOrder
from tblProduct import TblProduct
from tblQuote import TblQuote
from vehicles import Vehicles
from extensions import db
from sqlalchemy import and_, insert, text
from api.refreshcoacustomer import RefreshCOA_Customer
from api.refreshtables import RefreshTables

api14 = Blueprint('api14', __name__)

@api14.route('/manifest_goods_delete/<id>/<userid>', methods = ['DELETE'])
def manifest_goods_delete(id, userid):
    del_manif_goods_set = GoodsNlc.query.get(int(id))
    get_prev_party = Party.query.get(int(str(del_manif_goods_set.parties)))
    get_prev_vehicle = Vehicles.query.get(int(str(del_manif_goods_set.vehicle)))
    del_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_bill == str(del_manif_goods_set.bilty_no).strip())
    db.session.execute(del_ledger_data)
    db.session.delete(del_manif_goods_set)
    db.session.flush()
    db.session.commit()
    RefreshCOA_Customer.refresh_COA_Party(str(get_prev_party.chart_accnt))
    RefreshCOA_Customer.refresh_COA_Vehicle(str(get_prev_vehicle.chart_accnt))
    RefreshCOA_Customer.refresh_COA_Comm(userid)
    return jsonify({"data":"deleted"})

@api14.route('/manifest_oils_delete/<id>/<userid>', methods = ['DELETE'])
def manifest_oils_delete(id,userid):
    del_manif_oils_set = OilPso.query.get(int(id))
    get_prev_party = Party.query.get(int(str(del_manif_oils_set.parties)))
    get_prev_vehicle = Vehicles.query.get(int(str(del_manif_oils_set.vehicle)))
    del_oil_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_bill == str(del_manif_oils_set.bilty_no).strip())
    db.session.execute(del_oil_ledger_data)
    db.session.delete(del_manif_oils_set)
    db.session.flush()
    db.session.commit()
    RefreshCOA_Customer.refresh_COA_Party(str(get_prev_party.chart_accnt))
    RefreshCOA_Customer.refresh_COA_Vehicle(str(get_prev_vehicle.chart_accnt))
    RefreshCOA_Customer.refresh_COA_Comm(userid)
    return jsonify({"data":"deleted"})

@api14.route('/party_bills_delete/<id>/<userid>', methods = ['DELETE'])
def party_bills_delete(id, userid):
    del_party_bill_set = PartyBill.query.get(int(id))
    db.session.delete(del_party_bill_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api14.route('/account_type_delete/<id>/<userid>', methods = ['DELETE'])
def account_type_delete(id, userid):
    delete_q = AccountSubTypes.__table__.delete().where(AccountSubTypes.type_name_id == int(id))
    db.session.execute(delete_q)
    del_accnt_type_set = AccountTypes.query.get(int(id))
    db.session.delete(del_accnt_type_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api14.route('/accountsub_type_delete/<id>/<userid>', methods = ['DELETE'])
def account_sub_type_delete(id, userid):
    del_accnt_sub_type_set = AccountSubTypes.query.get(int(id))
    db.session.delete(del_accnt_sub_type_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api14.route('/quote_inv_delete/<id>/<userid>', methods = ['DELETE'])
def quote_inv_delete(id, userid):
    del_quote_items_data = QuoteItems.__table__.delete().where(QuoteItems.item_invoice == int(id))
    db.session.execute(del_quote_items_data)
    del_quote_inv_set = TblQuote.query.get(int(id))
    db.session.delete(del_quote_inv_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api14.route('/invoice_inv_delete/<id>/<userid>', methods = ['DELETE'])
def inv_inv_delete(id, userid):
    inv_items = InvoiceItems.query.filter(InvoiceItems.item_invoice == int(id)).all()
    for item in inv_items:
        product_value = TblProduct.query.filter(TblProduct.id == int(item.item_product)).first()
        item_stk = int(item.item_qnty)
        prd_stk = int(product_value.product_stock)
        product_value.product_stock = item_stk + prd_stk
        db.session.flush()
        db.session.commit()
    del_inv_items_data = InvoiceItems.__table__.delete().where(InvoiceItems.item_invoice == int(id))
    db.session.execute(del_inv_items_data)
    del_inv_inv_set = TblInvoice.query.get(int(id))
    del_ledger_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(del_inv_inv_set.invoice_num).strip())
    db.session.execute(del_ledger_data)
    get_client = Clients.query.get(int(del_inv_inv_set.client_id))
    RefreshCOA_Customer.refresh_COA_Customer(get_client.chart_accnt)
    db.session.delete(del_inv_inv_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api14.route('/invoice_order_delete/<id>/<userid>', methods = ['DELETE'])
def inv_order_delete(id, userid):
    ord_items = PurchItems.query.filter(PurchItems.item_invoice == int(id)).all()
    for item in ord_items:
        product_value = TblProduct.query.filter(TblProduct.id == int(item.item_product)).first()
        item_stk = int(item.item_qnty)
        prd_stk = int(product_value.product_stock)
        product_value.product_stock = prd_stk - item_stk
        db.session.flush()
        db.session.commit()
    del_order_items_data = PurchItems.__table__.delete().where(PurchItems.item_invoice == int(id))
    db.session.execute(del_order_items_data)
    del_order_inv_set = TblOrder.query.get(int(id))
    del_ledger_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(del_order_inv_set.order_num).strip())
    db.session.execute(del_ledger_data)
    get_suppl = Supplier.query.get(int(del_order_inv_set.supplier_id))
    RefreshCOA_Customer.refresh_COA_Supplier(get_suppl.chart_accnt)
    db.session.delete(del_order_inv_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api14.route('/invoice_stock_delete/<id>/<type>/<userid>', methods = ['DELETE'])
def inv_stock_delete(id,type,userid):
    if(type == "supplier"):
        stk_items = ReturnItems.query.filter(ReturnItems.item_invoice == int(id)).all()
        for item in stk_items:
            product_value = TblProduct.query.filter(TblProduct.id == int(item.item_product)).first()
            item_stk = int(item.item_qnty)
            prd_stk = int(product_value.product_stock)
            product_value.product_stock = prd_stk + item_stk
            db.session.flush()
            db.session.commit()
        del_stock_items_data = ReturnItems.__table__.delete().where(ReturnItems.item_invoice == int(id))
        db.session.execute(del_stock_items_data)
        del_stock_inv_set = TblStockRtn.query.get(int(id))
        del_ledger_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(del_stock_inv_set.stock_num).strip())
        db.session.execute(del_ledger_data)
        get_suppl = Supplier.query.get(int(del_stock_inv_set.supplier_id))
        RefreshCOA_Customer.refresh_COA_Supplier(get_suppl.chart_accnt)
        db.session.delete(del_stock_inv_set)
        db.session.commit()
    elif(type == "client"):
        stk_items = ClientReturnItems.query.filter(ClientReturnItems.item_invoice == int(id)).all()
        for item in stk_items:
            product_value = TblProduct.query.filter(TblProduct.id == int(item.item_product)).first()
            item_stk = int(item.item_qnty)
            prd_stk = int(product_value.product_stock)
            product_value.product_stock = prd_stk - item_stk
            db.session.flush()
            db.session.commit()
        del_stock_items_data = ClientReturnItems.__table__.delete().where(ClientReturnItems.item_invoice == int(id))
        db.session.execute(del_stock_items_data)
        del_stock_inv_set = TblClnStockRtn.query.get(int(id))
        del_ledger_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(del_stock_inv_set.stock_num).strip())
        db.session.execute(del_ledger_data)
        get_client = Clients.query.get(int(del_stock_inv_set.client_id))
        RefreshCOA_Customer.refresh_COA_Customer(get_client.chart_accnt)
        db.session.delete(del_stock_inv_set)
        db.session.delete(del_stock_inv_set)
        db.session.commit()
    return jsonify({"data":"deleted"})


@api14.route('/chart_of_accnt_delete/<id>/<userid>', methods = ['DELETE'])
def chart_of_accnt_delete(id, userid):
    del_chart_of_accnt_set = ChartOfAccount.query.get(int(id))
    del_coa_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_account_no == str(del_chart_of_accnt_set.id).strip())
    db.session.execute(del_coa_ledger_data)
    db.session.delete(del_chart_of_accnt_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api14.route('/cashbook_delete', methods = ['POST'])
def cashbook_entry_delete():
    data = request.get_json()
    userid = int(data['userid'])
    if(data['led_Type'] == "ledger"):
        del_ledger_set = Ledger.query.get(int(str(data['ac_cashId'])))
        db.session.delete(del_ledger_set)
        db.session.commit()
        if(data['ac_cash_type'] == "party"):
            RefreshCOA_Customer.refresh_COA_Party(str(data['ac_cash_accnt_no']))
        elif(data['ac_cash_type'] == "vehicle"):
            RefreshCOA_Customer.refresh_COA_Vehicle(str(data['ac_cash_accnt_no']))
        elif(data['ac_cash_type'] == "general"):
            RefreshCOA_Customer.refresh_COA_General(str(data['ac_cash_accnt_no']))
        elif(data['ac_cash_type'] == "commission"):
            RefreshCOA_Customer.refresh_COA_Comm(userid)
    elif(data['led_Type'] == "ledger2"):
        del_ledger_set = Ledger2.query.get(int(str(data['ac_cashId'])))
        db.session.delete(del_ledger_set)
        db.session.commit()
        if(data['ac_cash_type'] == "client"):
            RefreshCOA_Customer.refresh_COA_Customer(str(data['ac_cash_accnt_no']))
        elif(data['ac_cash_type'] == "supplier"):
            RefreshCOA_Customer.refresh_COA_Supplier(str(data['ac_cash_accnt_no']))
    return jsonify({"data":"deleted"})

