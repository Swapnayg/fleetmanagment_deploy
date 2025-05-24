from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from accountSubTypes import AccountSubTypes
from accountTypes import AccountTypes
from chartofAccount import ChartOfAccount
from clients import Clients
from clnStkRtnItems import ClientReturnItems
from clnstkrtn import TblClnStockRtn
from goodsnlc import GoodsNlc
from invoiceItems import InvoiceItems
from ledger import Ledger
from ledger2 import Ledger2
from oilpso import OilPso
from party import Party
from partybill import PartyBill
from quoteitems import QuoteItems
from returnItems import ReturnItems
from stkRtn import TblStockRtn
from supplier import Supplier
from tblInvoice import TblInvoice
from tblProduct import TblProduct
from tblQuote import TblQuote
from extensions import db
from sqlalchemy import and_

api3 = Blueprint('api3', __name__)

@api3.route('/customer_data/<userid>', methods=['GET'])
def customer_index(userid): 
    client_set = Clients.query.filter(Clients.userid == userid).all()
    data_clients = []
    for client in client_set:
        data_clients.append(client.map())
    return jsonify(data_clients)

@api3.route('/supplier_data/<userid>', methods=['GET'])
def supplier_index(userid): 
    supplier_set = Supplier.query.filter(Supplier.userid == userid).all()
    data_suppl = []
    for suppl in supplier_set:
        data_suppl.append(suppl.map())
    return jsonify(data_suppl)

@api3.route('/mainifest_goods_data/<userid>', methods=['GET'])
def mainifest_goods_index(userid): 
    mani_goods = GoodsNlc.query.filter(GoodsNlc.userid == userid).all()
    mani_data = []
    for mani_good in mani_goods:
        mani_data.append(mani_good.map())
    return jsonify(mani_data)

@api3.route('/mainifest_good_data', methods=['POST']) 
def mainifest_good_index(): 
    data = request.get_json()
    party_id = int(data['party_id'])
    userid = int(data['userid'])
    mani_goods =  GoodsNlc.query.filter(and_(GoodsNlc.parties == party_id,GoodsNlc.userid == userid,GoodsNlc.bill_status == 'pending' )).order_by(GoodsNlc.b_date.asc()).all()
    mani_data = []
    for mani_good in mani_goods:
        mani_data.append(mani_good.map())
    return jsonify(mani_data)


@api3.route('/get_profit_loss_details', methods=['POST']) 
def get_profit_loss_index(): 
    data = request.get_json()
    start_date = (data['t_date_from'])
    end_date = (data['t_date_to'])
    userid = int(data['userid'])
    accnt_types = AccountTypes.query.filter(AccountTypes.username == 'admin').all()
    accnt_data = []
    for a_type in accnt_types:
        accnt_data.append(a_type.map())
    accnt_types2 = AccountTypes.query.filter(AccountTypes.userid == userid).all()
    for a_type2 in accnt_types2:
        accnt_data.append(a_type2.map())
    account_d = []
    account_sub_d = []
    chart_of_acct = []
    ledger_data = []
    tax_receive = 0
    tax_payable = 0

    qry_rec = TblInvoice.query.filter(and_(TblInvoice.userid == userid, TblInvoice.datetime >= start_date, TblInvoice.datetime <= end_date)).order_by(TblInvoice.id.asc()).all()
    for _res in qry_rec:
        tax_receive +=  float(_res.total_tax)

    qry_pay1 = TblProduct.query.filter(and_(TblProduct.userid == userid, TblProduct.datetime >= start_date, TblProduct.datetime <= end_date)).order_by(TblProduct.id.asc()).all()
    for _p1_res in qry_pay1:
        stk_price = int(_p1_res.product_stock) * float(_p1_res.product_whole_price)
        tax_price = stk_price * float(_p1_res.product_tax) / 100
        tax_payable += tax_price
        
    qry_pay2 = GoodsNlc.query.filter(and_(GoodsNlc.userid == userid,GoodsNlc.datetime >= start_date, GoodsNlc.datetime <= end_date)).order_by(GoodsNlc.id.asc()).all()
    for _p2_res in qry_pay2:
        stk_price = int(_p2_res.weight) * float(_p2_res.per_ton)
        tax_price = stk_price * float(_p2_res.goods_gst) / 100
        tax_payable += tax_price
    
    qry_pay3 = OilPso.query.filter(and_(OilPso.userid == userid,OilPso.datetime >= start_date, OilPso.datetime <= end_date)).order_by(OilPso.id.asc()).all()
    for _p3_res in qry_pay3:
        stk_price = int(_p3_res.quantity) * float(_p3_res.per_ton)
        tax_price = stk_price * float(_p3_res.oils_gst) / 100
        tax_payable += tax_price
    
    for account in accnt_data:
        acct_sub =  AccountSubTypes.query.filter(and_(AccountSubTypes.type_name_id == account["id"])).all()
        for sub_acc in acct_sub:
            sub_networth = 0
            coa_details =  ChartOfAccount.query.filter(and_(ChartOfAccount.userid == userid,ChartOfAccount.accnt_type == sub_acc.id)).all()
            for coa_d in coa_details:
                chart_of_acct.append(coa_d.map())
                sub_networth += int(coa_d.networth)
                ledg_balance = int(coa_d.networth)
                ledger_data.append({"id":coa_d.id,"ledger_account_name":coa_d.accnt_name, "ledger_account_no":coa_d.accnt_type, "ledger_balance_amount":ledg_balance, "ledger_type":str(coa_d.account_mode).strip()})    
            account_sub_d.append({"id":sub_acc.id, "type_name_id":sub_acc.type_name_id, "sub_type_name":sub_acc.sub_type_name, "sub_networth":sub_networth})
    return jsonify({"acct_data": accnt_data ,"sub_acct": account_sub_d,"coa_data": ledger_data, "tax_receive":tax_receive, "tax_payable":tax_payable})

@api3.route('/get_trial_bal_details', methods=['POST']) 
def get_trial_bal_index(): 
    data = request.get_json()
    start_date = (data['t_date_from'])
    end_date = (data['t_date_to'])
    userid = int(data['userid'])
    accnt_types = AccountTypes.query.filter(AccountTypes.username == 'admin').all()
    accnt_data = []
    for a_type in accnt_types:
        accnt_data.append(a_type.map())
    account_d = []
    account_sub_d = []
    coa_data = []
    ledger_data = []
    
    for account in accnt_data:
        acct_sub =  AccountSubTypes.query.filter(AccountSubTypes.type_name_id == int(account["id"]))
        for sub_acc in acct_sub:
            sub_debit = 0
            sub_credit = 0
            sub_balance = 0
            type_list = []
            coa_details =  ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_type == sub_acc.id, ChartOfAccount.userid == userid)).all()
            for coa_d in coa_details:
                coa_data.append(coa_d.map())
                ledg_debit = 0
                ledg_credit = 0
                ledg_balance = int(coa_d.networth)
                sub_balance += int(coa_d.networth)
                if(int(coa_d.networth) < 0):
                    ledg_debit = abs(int(coa_d.networth))
                    sub_debit += abs(int(coa_d.networth))
                else:
                    ledg_credit = abs(int(coa_d.networth))
                    sub_credit += abs(int(coa_d.networth))
                ledger_data.append({"id":coa_d.id,"subid":sub_acc.id, "ledger_account_no":coa_d.accnt_name, "ledger_debit_amount":ledg_debit, "ledger_credit_amount":ledg_credit, "ledger_balance_amount":ledg_balance, "ledger_type":str(coa_d.account_mode).strip()})
            account_sub_d.append({"id":sub_acc.id, "type_name_id":sub_acc.type_name_id, "sub_type_name":sub_acc.sub_type_name, "sub_debit_val":sub_debit, "sub_credit_val":sub_credit, "sub_balance_val":sub_balance, "sub_types":type_list})
    return jsonify({"acct_data": accnt_data ,"sub_acct": account_sub_d,"coa_data":coa_data, "ledger_data":ledger_data})



@api3.route('/mainifest_oil_data', methods=['POST']) 
def mainifest_oil_index(): 
    data = request.get_json()
    party_id = int(data['party_id'])
    userid = int(data['userid'])
    mani_oils =  OilPso.query.filter(and_(OilPso.parties == party_id,OilPso.userid == userid,OilPso.bill_status == 'pending' )).order_by(OilPso.b_date.asc()).all()
    mani_data = []
    for mani_oil in mani_oils:
        mani_data.append(mani_oil.map())
    return jsonify(mani_data)

@api3.route('/get_party_bill_data', methods=['POST']) 
def get_party_bill_index(): 
    data = request.get_json()
    party_id = int(data['party_bill_id'])
    bill_type = str(data['party_bill_type']).strip()
    userid = int(data['userid'])
    party_bil_data = []
    party_bil =  PartyBill.query.filter(and_(PartyBill.id == party_id,PartyBill.userid == userid)).one()
    get_party = Party.query.get(int(party_bil.party_id))
    party_bil_data.append({"id":party_bil.id, "invoice_no":party_bil.invoice_no, "invoice_date":party_bil.invoice_date, "invoice_due_date":party_bil.invoice_due_date, "party_id":party_bil.party_id, "party_name":str(party_bil.party_name).strip().capitalize(), "invoice_balance":party_bil.invoice_balance, "invoice_status":party_bil.invoice_status, "invoice_bilties":party_bil.invoice_bilties, "invoice_sales_person":str(party_bil.invoice_sales_person).strip().capitalize(), "invoice_thank_message":str(party_bil.invoice_thank_message).strip().capitalize(), 'party_contact':str(get_party.contact_person).strip().capitalize(), 'party_phone':get_party.phone_number})
    bilty_list = str(party_bil.invoice_bilties).strip().split(',')
    mani_data = []
    if(bill_type == "goods"):
        for bilty in bilty_list:
            good_data = GoodsNlc.query.filter(GoodsNlc.id == int(bilty)).one()
            mani_data.append({"id":good_data.id,"b_date":good_data.b_date, "bilty_no":good_data.bilty_no, "loading_point":good_data.loading_point,"unloading_point":good_data.unloading_point,"weight":good_data.weight,"per_ton":good_data.per_ton,"freight":good_data.freight,"wrt_4_per_freight":good_data.wrt_4_per_freight,"commission":good_data.commission,"bill_status":good_data.bill_status,"goods_gst":good_data.goods_gst})
    elif(bill_type == "oil"):
        for bilty in bilty_list:
            oil_data = OilPso.query.filter(OilPso.id == int(bilty)).one()
            mani_data.append({"id":oil_data.id,"b_date":oil_data.b_date, "bilty_no":oil_data.bilty_no, "loading_point":oil_data.loading_point,"unloading_point":oil_data.unloading_point,"weight":oil_data.quantity,"per_ton":oil_data.per_ton,"freight":oil_data.freight,"wrt_4_per_freight":oil_data.wrt_4_per_freight,"commission":oil_data.commission,"bill_status":oil_data.bill_status,"goods_gst":oil_data.oils_gst})  
    data = {
        "party":party_bil_data,
        "items": mani_data
    }
    return  jsonify(data)

@api3.route('/get_quote_invoice_data', methods=['POST']) 
def get_quote_inv_index(): 
    data = request.get_json()
    quote_id = int(data['quote_id'])
    userid = int(data['userid'])
    quote_inv =  TblQuote.query.filter(and_(TblQuote.id == quote_id,TblQuote.userid == userid)).one()
    get_client = Clients.query.get(int(quote_inv.client_id))
    quote_items =  QuoteItems.query.filter(and_(QuoteItems.item_invoice == quote_id)).all()
    quote_items_d = []
    for item in quote_items:
        quote_items_d.append(item.map())
    return jsonify({"quote_data": quote_inv.map(), "client_data": get_client.map(), "quote_items": quote_items_d })

@api3.route('/get_inv_invoice_data', methods=['POST']) 
def get_inv_inv_index(): 
    data = request.get_json()
    inv_id = int(data['inv_id'])
    userid = int(data['userid'])
    invoice_inv =  TblInvoice.query.filter(and_(TblInvoice.id == inv_id,TblInvoice.userid == userid)).one()
    get_client = Clients.query.get(int(invoice_inv.client_id))
    invoice_items =  InvoiceItems.query.filter(and_(InvoiceItems.item_invoice == inv_id)).all()
    invoice_items_d = []
    for item in invoice_items:
        invoice_items_d.append(item.map())
    return jsonify({"inv_data": invoice_inv.map(), "client_data": get_client.map(), "inv_items": invoice_items_d })

@api3.route('/get_stk_return_data', methods=['POST']) 
def get_stk_return_index(): 
    data = request.get_json()
    stk_id = int(data['stk_id'])
    stk_type = str(data['stk_type'])
    userid = int(data['userid'])
    stk_ret_items_d = []
    if(str(stk_type).strip() == "supplier"):
        stk_ret_inv =  TblStockRtn.query.filter(and_(TblStockRtn.id == stk_id,TblStockRtn.userid == userid)).one()
        get_suppl = Supplier.query.get(int(stk_ret_inv.supplier_id))
        stk_ret_items =  ReturnItems.query.filter(and_(ReturnItems.item_invoice == stk_id)).all()
        for item in stk_ret_items:
            stk_ret_items_d.append(item.map())
    elif(str(stk_type).strip() == "client"):
        stk_ret_inv =  TblClnStockRtn.query.filter(and_(TblClnStockRtn.id == stk_id,TblClnStockRtn.userid == userid)).one()
        get_suppl = Clients.query.get(int(stk_ret_inv.client_id))
        stk_ret_items =  ClientReturnItems.query.filter(and_(ClientReturnItems.item_invoice == stk_id)).all()
        for item in stk_ret_items:
            stk_ret_items_d.append(item.map())
    return jsonify({"stk_rtn_data": stk_ret_inv.map(), "suppl_data": get_suppl.map(), "stk_rtn_items": stk_ret_items_d })
