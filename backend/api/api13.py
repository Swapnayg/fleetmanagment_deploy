from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from chartofAccount import ChartOfAccount
from clientgroup import ClientGroup
from clients import Clients
from clnStkRtnItems import ClientReturnItems
from clnstkrtn import TblClnStockRtn
from goodsnlc import GoodsNlc
from invoiceItems import InvoiceItems
from inwarehouse import InvWarehouses
from ledger import Ledger
from ledger2 import Ledger2
from oilpso import OilPso
from party import Party
from purchItems import PurchItems
from quoteitems import QuoteItems
from reccIncoice import TblReccInvoice
from reccItems import ReccItems
from returnItems import ReturnItems
from stkRtn import TblStockRtn
from stockin import Stockin
from stocktransfer import StockTrasfer
from supplier import Supplier
from tblInvoice import TblInvoice
from tblOrder import TblOrder
from tblProduct import TblProduct
from tblQuote import TblQuote
from vehicles import Vehicles
from extensions import db
from sqlalchemy import and_, insert, text
from api.refreshcoacustomer import RefreshCOA_Customer

api13 = Blueprint('api13', __name__)

@api13.route('/C_group_delete/<id>/<userid>', methods = ['DELETE'])
def C_group_delete(id, userid):
    del_c_group_set = ClientGroup.query.get(int(id))
    all_customers = Clients.query.filter(Clients.client_group == int(del_c_group_set.id)).all()
    for client in all_customers:
        del_client_set = Clients.query.get(int(client.id))
        quote_inv = TblQuote.query.filter(TblQuote.client_id == int(del_client_set.id)).all()
        for q_inv in quote_inv:
            del_qoute_items = QuoteItems.__table__.delete().where(QuoteItems.item_invoice == str(q_inv.id).strip())
            db.session.execute(del_qoute_items)
            db.session.commit()
        invoice_inv = TblInvoice.query.filter(TblInvoice.client_id == int(del_client_set.id)).all()
        for inv in invoice_inv:
            del_invoice_items = InvoiceItems.__table__.delete().where(InvoiceItems.item_invoice == str(inv.id).strip())
            db.session.execute(del_invoice_items)
            db.session.commit()
        recc_inv = TblReccInvoice.query.filter(TblReccInvoice.client_id == int(del_client_set.id)).all()
        for r_cc in recc_inv:
            del_recc_inv_items = ReccItems.__table__.delete().where(ReccItems.item_invoice == str(r_cc.id).strip())
            db.session.execute(del_recc_inv_items)
            db.session.commit()
        cl_stk_rtn_inv = TblClnStockRtn.query.filter(TblClnStockRtn.client_id == int(del_client_set.id)).all()
        for cl_stk_inv in cl_stk_rtn_inv:
            del_cl_stk_items = ClientReturnItems.__table__.delete().where(ClientReturnItems.item_invoice == str(cl_stk_inv.id).strip())
            db.session.execute(del_cl_stk_items)
            db.session.commit()
        del_quote_data = TblQuote.__table__.delete().where(TblQuote.client_id == str(del_client_set.id).strip())
        del_inv_data = TblInvoice.__table__.delete().where(TblInvoice.client_id == str(del_client_set.id).strip())
        del_recinv_data = TblReccInvoice.__table__.delete().where(TblReccInvoice.client_id == str(del_client_set.id).strip())
        del_clstkrtn_data = TblClnStockRtn.__table__.delete().where(TblClnStockRtn.client_id == str(del_client_set.id).strip())
        del_cus_ledger_data = Ledger2.__table__.delete().where(Ledger2.ledger_account_no == str(del_client_set.chart_accnt).strip())
        delete_vehicle_COA = ChartOfAccount.__table__.delete().where(ChartOfAccount.id == int(del_client_set.chart_accnt))
        db.session.execute(del_quote_data)
        db.session.execute(del_inv_data)
        db.session.execute(del_recinv_data)
        db.session.execute(del_clstkrtn_data)
        db.session.execute(del_cus_ledger_data)
        db.session.delete(del_client_set)
        db.session.execute(delete_vehicle_COA)
        db.session.commit()
    db.session.delete(del_c_group_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api13.route('/stk_transfer_delete/<id>/<userid>', methods = ['DELETE'])
def stk_transfer_delete(id, userid):
    del_stk_transfer_set = StockTrasfer.query.get(int(id))
    db.session.delete(del_stk_transfer_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api13.route('/vehicle_delete/<id>/<userid>', methods = ['DELETE'])
def vehicle_delete(id,userid):
    del_vehicle_set = Vehicles.query.get(int(id))
    if(str(del_vehicle_set.veh_type).strip() == "goods"):
        vehicle_goods = GoodsNlc.query.filter(GoodsNlc.vehicle == int(id)).all()
        for v_goods in vehicle_goods:
            get_party = Party.query.get(int(str(vehicle_oilss.parties)))
            RefreshCOA_Customer.refresh_COA_Comm(userid)
            RefreshCOA_Customer.refresh_COA_Party(str(get_party.chart_accnt))
            del_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_bill == str(v_goods.bilty_no).strip())
            db.session.execute(del_ledger_data)
        del_veh_goods_data = GoodsNlc.__table__.delete().where(GoodsNlc.vehicle == int(id))
        db.session.execute(del_veh_goods_data)
    elif(str(del_vehicle_set.veh_type).strip() == "oil"):
        vehicle_oilss = OilPso.query.filter(OilPso.vehicle == int(id)).all()
        for v_oils in vehicle_oilss:
            get_party = Party.query.get(int(str(vehicle_oilss.parties)))
            RefreshCOA_Customer.refresh_COA_Comm(userid)
            RefreshCOA_Customer.refresh_COA_Party(str(get_party.chart_accnt))
            del_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_bill == str(v_oils.bilty_no).strip())
            db.session.execute(del_ledger_data)
        del_veh_oils_data = OilPso.__table__.delete().where(OilPso.vehicle == int(id))
        db.session.execute(del_veh_oils_data)
    del_veh_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_account_no == str(del_vehicle_set.chart_accnt).strip())
    db.session.execute(del_veh_ledger_data)
    db.session.delete(del_vehicle_set)
    delete_vehicle_COA = ChartOfAccount.__table__.delete().where(ChartOfAccount.id == int(del_vehicle_set.chart_accnt))
    db.session.execute(delete_vehicle_COA)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api13.route('/product_delete/<id>/<userid>', methods = ['DELETE'])
def product_delete(id, userid):
    del_product_set = TblProduct.query.get(int(id))
    del_stk_trf_prod_data = StockTrasfer.__table__.delete().where(StockTrasfer.stock_product == str(del_product_set.id).strip())
    
    quote_items_txt = text('SELECT DISTINCT ON (item_invoice) item_invoice, item_product FROM public.quote_items where item_product= '+str(del_product_set.id)+';') 
    quote_items = db.session.execute(quote_items_txt)
    for q_inv in quote_items:
        del_quote_data = QuoteItems.__table__.delete().where(QuoteItems.item_invoice == str(q_inv.item_invoice).strip())
        del_qoute = TblQuote.__table__.delete().where(TblQuote.id == str(q_inv.item_invoice).strip())
        db.session.execute(del_quote_data)
        db.session.execute(del_qoute)
        db.session.commit()
        
    inv_items_txt = text('SELECT DISTINCT ON (item_invoice) item_invoice, item_product FROM public.invoice_items where item_product= '+str(del_product_set.id)+';') 
    invoice_items = db.session.execute(inv_items_txt)
    for inv in invoice_items:
        get_invoice = TblInvoice.query.get(int(str(inv.item_invoice).strip()))
        del_all_inv_data = InvoiceItems.__table__.delete().where(InvoiceItems.item_invoice == str(get_invoice.id).strip())
        del_invoice_items = TblInvoice.__table__.delete().where(TblInvoice.id == int(str(inv.item_invoice).strip()))
        del_inv_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(get_invoice.invoice_num).strip())
        get_client = Clients.query.get(int(get_invoice.client_id))
        db.session.execute(del_all_inv_data)
        db.session.execute(del_inv_data)
        db.session.execute(del_invoice_items)
        db.session.commit()
        RefreshCOA_Customer.refresh_COA_Customer(get_client.chart_accnt)
        
    rcc_items_txt = text('SELECT DISTINCT ON (item_invoice) item_invoice, item_product FROM public.recc_items where item_product= '+str(del_product_set.id)+';') 
    recc_inv_items = db.session.execute(rcc_items_txt)
    for r_cc in recc_inv_items:
        get_recc_invoice = TblReccInvoice.query.get(int(str(r_cc.item_invoice).strip()))
        del_recinv_data = ReccItems.__table__.delete().where(ReccItems.item_invoice == str(r_cc.item_invoice).strip())
        del_recc_inv = TblReccInvoice.__table__.delete().where(TblReccInvoice.id == int(str(r_cc.item_invoice).strip()))
        del_inv_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(get_recc_invoice.invoice_num).strip())
        get_client = Clients.query.get(int(get_recc_invoice.client_id))
        db.session.execute(del_recinv_data)
        db.session.execute(del_inv_data)
        db.session.execute(del_recc_inv)
        db.session.commit()
        RefreshCOA_Customer.refresh_COA_Customer(get_client.chart_accnt)
        
    cl_stk_items_txt = text('SELECT DISTINCT ON (item_invoice) item_invoice, item_product FROM public.client_return_items where item_product= '+str(del_product_set.id)+';') 
    cl_stk_rtn_inv_items = db.session.execute(cl_stk_items_txt)
    for cl_stk_inv in cl_stk_rtn_inv_items:
        get_cl_stk_invoice = TblClnStockRtn.query.get(int(str(cl_stk_inv.item_invoice).strip()))
        del_clstkrtn_data = ClientReturnItems.__table__.delete().where(ClientReturnItems.item_invoice == str(cl_stk_inv.item_invoice).strip())
        del_cl_stk_inv = TblClnStockRtn.__table__.delete().where(TblClnStockRtn.id == int(str(cl_stk_inv.item_invoice).strip()))
        del_inv_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(get_cl_stk_invoice.invoice_num).strip())
        get_client = Clients.query.get(int(get_cl_stk_invoice.client_id))
        db.session.execute(del_clstkrtn_data)
        db.session.execute(del_inv_data)
        db.session.execute(del_cl_stk_inv)
        db.session.commit()
        RefreshCOA_Customer.refresh_COA_Customer(get_client.chart_accnt)
    
    ord_inv_items_txt = text('SELECT DISTINCT ON (item_invoice) item_invoice, item_product FROM public.purch_items where item_product= '+str(del_product_set.id)+';') 
    order_inv_items = db.session.execute(ord_inv_items_txt)
    for o_inv in order_inv_items:
        get_ord_invoice = TblOrder.query.get(int(str(o_inv.item_invoice).strip()))
        del_order_data = PurchItems.__table__.delete().where(PurchItems.item_invoice == str(o_inv.item_invoice).strip())
        del_ord_inv = TblOrder.__table__.delete().where(TblOrder.id == int(str(o_inv.item_invoice).strip()))
        del_inv_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(get_ord_invoice.invoice_num).strip())
        get_supplier = Supplier.query.get(int(get_ord_invoice.supplier_id))
        db.session.execute(del_order_data)
        db.session.execute(del_inv_data)
        db.session.execute(del_ord_inv)
        db.session.commit()
        RefreshCOA_Customer.refresh_COA_Supplier(get_supplier.chart_accnt)
        
    stk_rtn_txt = text('SELECT DISTINCT ON (item_invoice) item_invoice, item_product FROM public.return_items where item_product= '+str(del_product_set.id)+';') 
    stk_rtn_inv_items = db.session.execute(stk_rtn_txt)
    for stk_inv in stk_rtn_inv_items:
        get_stk_invoice = TblStockRtn.query.get(int(str(stk_inv.item_invoice).strip()))
        del_stkrtn_data = ReturnItems.__table__.delete().where(ReturnItems.item_invoice == str(stk_inv.item_invoice).strip())
        del_stk_inv = TblStockRtn.__table__.delete().where(TblStockRtn.id == int(str(stk_inv.item_invoice).strip()))
        del_inv_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(get_stk_invoice.invoice_num).strip())
        get_supplier = Supplier.query.get(int(get_stk_invoice.supplier_id))
        db.session.execute(del_stkrtn_data)
        db.session.execute(del_inv_data)
        db.session.execute(del_stk_inv)
        db.session.commit()
        RefreshCOA_Customer.refresh_COA_Supplier(get_supplier.chart_accnt)
        
    db.session.execute(del_stk_trf_prod_data)
    db.session.delete(del_product_set)
    db.session.commit()
    return jsonify({"data":"deleted"})


@api13.route('/customer_delete/<id>/<userid>', methods = ['DELETE'])
def customer_delete(id, userid):
    del_client_set = Clients.query.get(int(id))
    quote_inv = TblQuote.query.filter(TblQuote.client_id == int(del_client_set.id)).all()
    for q_inv in quote_inv:
        del_qoute_items = QuoteItems.__table__.delete().where(QuoteItems.item_invoice == str(q_inv.id).strip())
        db.session.execute(del_qoute_items)
        db.session.commit()
    invoice_inv = TblInvoice.query.filter(TblInvoice.client_id == int(del_client_set.id)).all()
    for inv in invoice_inv:
        del_invoice_items = InvoiceItems.__table__.delete().where(InvoiceItems.item_invoice == str(inv.id).strip())
        db.session.execute(del_invoice_items)
        db.session.commit()
    recc_inv = TblReccInvoice.query.filter(TblReccInvoice.client_id == int(del_client_set.id)).all()
    for r_cc in recc_inv:
        del_recc_inv_items = ReccItems.__table__.delete().where(ReccItems.item_invoice == str(r_cc.id).strip())
        db.session.execute(del_recc_inv_items)
        db.session.commit()
    cl_stk_rtn_inv = TblClnStockRtn.query.filter(TblClnStockRtn.client_id == int(del_client_set.id)).all()
    for cl_stk_inv in cl_stk_rtn_inv:
        del_cl_stk_items = ClientReturnItems.__table__.delete().where(ClientReturnItems.item_invoice == str(cl_stk_inv.id).strip())
        db.session.execute(del_cl_stk_items)
        db.session.commit()
    del_quote_data = TblQuote.__table__.delete().where(TblQuote.client_id == str(del_client_set.id).strip())
    del_inv_data = TblInvoice.__table__.delete().where(TblInvoice.client_id == str(del_client_set.id).strip())
    del_recinv_data = TblReccInvoice.__table__.delete().where(TblReccInvoice.client_id == str(del_client_set.id).strip())
    del_clstkrtn_data = TblClnStockRtn.__table__.delete().where(TblClnStockRtn.client_id == str(del_client_set.id).strip())
    del_cus_ledger_data = Ledger2.__table__.delete().where(Ledger2.ledger_account_no == str(del_client_set.chart_accnt).strip())
    delete_vehicle_COA = ChartOfAccount.__table__.delete().where(ChartOfAccount.id == int(del_client_set.chart_accnt))
    db.session.execute(del_quote_data)
    db.session.execute(del_inv_data)
    db.session.execute(del_recinv_data)
    db.session.execute(del_clstkrtn_data)
    db.session.execute(del_cus_ledger_data)
    db.session.delete(del_client_set)
    db.session.execute(delete_vehicle_COA)
    db.session.commit()
    return jsonify({"data":"deleted"})


@api13.route('/supplier_delete/<id>/<userid>', methods = ['DELETE'])
def supplier_delete(id, userid):
    del_supplier_set = Supplier.query.get(int(id))
    order_inv = TblOrder.query.filter(TblOrder.supplier_id == int(del_supplier_set.id)).all()
    for o_inv in order_inv:
        del_ord_inv_items = PurchItems.__table__.delete().where(PurchItems.item_invoice == str(o_inv.id).strip())
        db.session.execute(del_ord_inv_items)
        db.session.commit()
    stk_rtn_inv = TblStockRtn.query.filter(TblStockRtn.supplier_id == int(del_supplier_set.id)).all()
    for stk_inv in stk_rtn_inv:
        del_cl_stk_items = ReturnItems.__table__.delete().where(ReturnItems.item_invoice == str(stk_inv.id).strip())
        db.session.execute(del_cl_stk_items)
        db.session.commit()
    del_order_data = TblOrder.__table__.delete().where(TblOrder.supplier_id == str(del_supplier_set.id).strip())
    del_stkrtn_data = TblStockRtn.__table__.delete().where(TblStockRtn.supplier_id == str(del_supplier_set.id).strip())
    del_cus_ledger_data = Ledger2.__table__.delete().where(Ledger2.ledger_account_no == str(del_supplier_set.chart_accnt).strip())
    delete_vehicle_COA = ChartOfAccount.__table__.delete().where(ChartOfAccount.id == int(del_supplier_set.chart_accnt))
    db.session.execute(del_order_data)
    db.session.execute(del_stkrtn_data)
    db.session.execute(del_cus_ledger_data)
    db.session.delete(del_supplier_set)
    db.session.execute(delete_vehicle_COA)
    db.session.commit()
    return jsonify({"data":"deleted"})


@api13.route('/inwarehouse_delete/<id>/<userid>', methods = ['DELETE'])
def inwarehouse_delete(id, userid):
    delete_ware_stock_in_q = Stockin.__table__.delete().where(Stockin.stock_ware == int(id))
    db.session.execute(delete_ware_stock_in_q)
    del_inwarehouse_set = InvWarehouses.query.get(int(id))
    db.session.delete(del_inwarehouse_set)
    db.session.commit()
    return jsonify({"data":"deleted"})
