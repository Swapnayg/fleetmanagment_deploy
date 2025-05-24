from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from accountSubTypes import AccountSubTypes
from accountTypes import AccountTypes
from chartofAccount import ChartOfAccount
from clients import Clients
from clnstkrtn import TblClnStockRtn
from ledger import Ledger
from ledger2 import Ledger2
from oilpso import OilPso
from party import Party
from partybill import PartyBill
from purchItems import PurchItems
from stkRtn import TblStockRtn
from supplier import Supplier
from tblInvoice import TblInvoice
from tblOrder import TblOrder
from tblProduct import TblProduct
from tblQuote import TblQuote
from vehicles import Vehicles
from extensions import db
from sqlalchemy import and_, text
 


api4 = Blueprint('api4', __name__)

def sum_array(arr):
    total = sum(arr)
    return total

@api4.route('/get_order_invoice_data', methods=['POST']) 
def get_order_invoice_index(): 
    data = request.get_json()
    order_id = int(data['order_id'])
    userid = int(data['userid'])
    order_inv =  TblOrder.query.filter(and_(TblOrder.id == order_id,TblOrder.userid == userid)).one()
    get_suppl = Supplier.query.get(int(order_inv.supplier_id))
    order_items =  PurchItems.query.filter(and_(PurchItems.item_invoice == order_id)).all()
    order_items_d = []
    for item in order_items:
        order_items_d.append(item.map())
    return jsonify({"order_data": order_inv.map(), "suppl_data": get_suppl.map(), "order_items": order_items_d })


@api4.route('/party_bill_data/<userid>', methods=['GET']) 
def party_bill_index(userid): 
    party_bill = PartyBill.query.filter(PartyBill.userid == userid).all()
    party_data = []
    for party_gd in party_bill:
        party_data.append(party_gd.map())
    return jsonify(party_data)

@api4.route('/mainifest_oils_data/<userid>', methods=['GET']) 
def mainifest_oils_index(userid): 
    mani_oils = OilPso.query.filter(OilPso.userid == userid).all()
    o_mani_data = []
    for mani_oil in mani_oils:
        o_mani_data.append(mani_oil.map())
    return jsonify(o_mani_data)


@api4.route('/account_type_data/<userid>', methods=['GET']) 
def accnt_type_index(userid): 
    accnt_types = AccountTypes.query.filter(AccountTypes.username == 'admin').all()
    accnt_data = []
    for a_type in accnt_types:
        accnt_data.append(a_type.map())
    accnt_types2 = AccountTypes.query.filter(AccountTypes.userid == userid).all()
    for a_type2 in accnt_types2:
        accnt_data.append(a_type2.map())
    return jsonify(accnt_data)


@api4.route('/stk_product_data/<userid>', methods=['GET']) 
def stock_product_index(userid): 
    stock_products = TblProduct.query.filter(TblProduct.userid == userid).all()
    stk_prd_data = []
    for stk_prd in stock_products:
        stk_prd_data.append(stk_prd.map())
    return jsonify(stk_prd_data)

@api4.route('/account_sub_type_data/<userid>', methods=['GET']) 
def accnt_sub_type_index(userid): 
    sub_accnt_types = AccountSubTypes.query.filter(AccountSubTypes.username == 'admin').all()
    sub_accnt_data = []
    for sub_a_type in sub_accnt_types:
        sub_accnt_data.append(sub_a_type.map())
    sub_accnt_types2 = AccountSubTypes.query.filter(AccountSubTypes.userid == userid).all()
    for sub_a_type2 in sub_accnt_types2:
        sub_accnt_data.append(sub_a_type2.map())
    return jsonify(sub_accnt_data)

@api4.route('/quote_invoice_data/<userid>', methods=['GET']) 
def quote_invoice_index(userid): 
    quote_inv_data = TblQuote.query.filter(TblQuote.userid == userid).all()
    quote_data = []
    for quote_d in quote_inv_data:
        quote_data.append(quote_d.map())
    return jsonify(quote_data)


@api4.route('/inv_invoice_data/<userid>', methods=['GET'])
def inv_invoice_index(userid): 
    inv_inv_data = TblInvoice.query.filter(TblInvoice.userid == userid).all()
    inv_data = []
    for inv_d in inv_inv_data:
        inv_data.append(inv_d.map())
    return jsonify(inv_data)

@api4.route('/inv_order_data/<userid>', methods=['GET']) 
def inv_order_index(userid): 
    inv_order_d = TblOrder.query.filter(TblOrder.userid == userid).all()
    order_data = []
    for order_d in inv_order_d:
        order_data.append(order_d.map())
    return jsonify(order_data)

@api4.route('/inv_stock_data/<userid>', methods=['GET']) 
def inv_stock_index(userid): 
    inv_stock_d = TblStockRtn.query.filter(TblStockRtn.userid == userid).all()
    stock_data = []
    for stock_d in inv_stock_d:
        stock_data.append(stock_d.map())
        
    inv_cust_d = TblClnStockRtn.query.filter(TblClnStockRtn.userid == userid).all()
    cust_data = []
    for client_d in inv_cust_d:
        cust_data.append(client_d.map())
    return jsonify({"stock_data":stock_data,"cust_data":cust_data})

@api4.route('/chart_of_account_data/<userid>', methods=['GET']) 
def chart_of_accnt_index(userid): 
    chart_of_accnt = ChartOfAccount.query.filter(ChartOfAccount.userid == userid).all()
    chart_accnt_data = []
    for chart_accnt in chart_of_accnt:
        chart_accnt_data.append(chart_accnt.map())
    return jsonify(chart_accnt_data)


@api4.route('/ledger_account_data' , methods=['POST']) 
def ledger_account__index(): 
    data = request.get_json()
    ledger_info = []
    party_details = []
    userid = int(data['userid'])
    if(str(data['ledger_type']).strip() == "party"):
        get_party = Party.query.get(int(str(data['ledg_id'])))
        party_details.append({"party_id": get_party.id,"party_Name": get_party.english_name,"party_Balance":  get_party.net_amount})
    elif(str(data['ledger_type']).strip() == "vehicle"):
        get_vehicle = Vehicles.query.get(int(str(data['ledg_id'])))
        party_details.append({"party_id": get_vehicle.id,"party_Name": get_vehicle.vehicle_num,"party_Balance":  get_vehicle.net_worth})
    elif(str(data['ledger_type']).strip() == "commission" or str(data['ledger_type']).strip() == "general" ):
        get_chart = ChartOfAccount.query.get(int(str(data['ledg_id'])))
        party_details.append({"party_id": get_chart.id,"party_Name": get_chart.accnt_name,"party_Balance":  get_chart.networth})
    elif(str(data['ledger_type']).strip() == "client"):
        get_client = Clients.query.get(int(str(data['ledg_id'])))
        party_details.append({"party_id": get_client.id,"party_Name": get_client.client_name,"party_Balance":  get_client.networth})
    elif(str(data['ledger_type']).strip() == "supplier"):
        get_supplier = Supplier.query.get(int(str(data['ledg_id'])))
        party_details.append({"party_id": get_supplier.id,"party_Name": get_supplier.suppl_name,"party_Balance":  get_supplier.networth})
    if(str(data['ledger_type']).strip() == "party" or str(data['ledger_type']).strip() == "vehicle" or str(data['ledger_type']).strip() == "commission" or str(data['ledger_type']).strip() == "general"):
        ledger_data = Ledger.query.filter(and_(Ledger.ledger_account_no == int(str(data['ledg_chart_id']).strip()), Ledger.ledger_type  == str(data['ledger_type']).strip() )).order_by(Ledger.id.asc()).all()
    elif(str(data['ledger_type']).strip() == "supplier" or str(data['ledger_type']).strip() == "client"):
        ledger_data = Ledger2.query.filter(and_(Ledger2.ledger_account_no == int(str(data['ledg_chart_id']).strip()), Ledger2.ledger_type  == str(data['ledger_type']).strip() )).order_by(Ledger2.id.asc()).all()
    for ledg_i in ledger_data:
        ledger_info.append(ledg_i.map())
    return jsonify({"ledger_data": ledger_info , "party_data" :party_details })


@api4.route('/COA_data_select', methods=['POST'])
def COA_data_select_index():
    data = request.get_json()
    userid = int(data['userid'])
    if(len(str(data['param']).strip()) != 0):
        search = "%{}%".format(str(data['param']).strip())
        chart_of_accnt = ChartOfAccount.query.filter(ChartOfAccount.accnt_name.like(search), ChartOfAccount.userid == userid).all()
    else:
        chart_of_accnt = ChartOfAccount.query.filter(ChartOfAccount.userid == userid).all()
    chart_accnt_data = []
    for chart_accnt in chart_of_accnt:
        chart_accnt_data.append(chart_accnt.map())
    return jsonify(chart_accnt_data)


def percent_change(old, new):
    ad = abs(new - old )
    avg = (old + new) / 2
    try:
        pro_diff = ad / avg
        per_diff = pro_diff * 100
    except:
        pro_diff = 0
        per_diff = 0
    return round(per_diff,2)

@api4.route('/sales_area_data', methods=['POST'])
def sales_area_index(): 
    data = request.get_json()
    purchase_data = []
    sale_data = []
    income_data = []
    userid = int(data['userid'])
    invoice_data_txt = text("SELECT to_char(datetime, 'MM') as month, sum(CAST(grand_total AS DECIMAL(10,2))) as sum_val FROM tbl_invoice a WHERE userid = "+str(userid)+" AND datetime > date_trunc('month', CURRENT_DATE) - INTERVAL '1 year' GROUP BY 1") 
    invoice_data = db.session.execute(invoice_data_txt)
    order_data_txt = text("SELECT to_char(datetime, 'MM') as month, sum(CAST(grand_total AS DECIMAL(10,2))) as sum_val FROM tbl_order a WHERE userid = "+str(userid)+" AND datetime > date_trunc('month', CURRENT_DATE) - INTERVAL '1 year' GROUP BY 1") 
    order_data = db.session.execute(order_data_txt)
    if((str(data['overallType']).strip()) == "year"):
        purchase_data = [0] * 12
        sale_data = [0] * 12
        for ord in order_data:
            purchase_data[int(ord.month) - 1] = round(float(ord.sum_val))
        for inv in invoice_data:
            sale_data[int(inv.month) - 1] = round(float(inv.sum_val))
        for index, sale in enumerate(sale_data):
            income_val = sale - purchase_data[index]
            income_data.append(income_val)
    elif((str(data['overallType']).strip()) == "6month"):
        purchase_data = [0] * 6
        sale_data = [0] * 6
        for ord in order_data:
            purchase_data[int(ord.month) - 1] = round(float(ord.sum_val))
        for inv in invoice_data:
            sale_data[int(inv.month) - 1] = round(float(inv.sum_val))
        for index, sale in enumerate(sale_data):
            income_val = sale - purchase_data[index]
            income_data.append(income_val)
    return jsonify({"purchase_data":purchase_data, "income_data":income_data, "TotalPurch": sum_array(purchase_data), "TotalExp":sum_array(income_data) })
