import random
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from accountSubTypes import AccountSubTypes
from accountTypes import AccountTypes
from catgeory import Categories
from chartofAccount import ChartOfAccount
from citysetup import CitySetup
from clientgroup import ClientGroup
from clients import Clients
from clnstkrtn import TblClnStockRtn
from goodsnlc import GoodsNlc
from ledger import Ledger
from ledger2 import Ledger2
from modeofpayment import ModeOfPayment
from oilpso import OilPso
from party import Party
from partybill import PartyBill
from productctegory import ProductCategory
from stkRtn import TblStockRtn
from stocktransfer import StockTrasfer
from supplier import Supplier
from tblInvoice import TblInvoice
from tblOrder import TblOrder
from units import Units
from vehicles import Vehicles
from warehouse import Warehouse
from extensions import db
from sqlalchemy import and_, insert

api7 = Blueprint('api7', __name__)

@api7.route('/supplier_select', methods=['POST'])
def supplier_select_index():
    data = request.get_json()
    supplier_data = []
    userid = int(data['userid'])
    if(len(str(data['param']).strip()) != 0):
        search = "%{}%".format(str(data['param']).strip())
        suppliers = Supplier.query.filter(and_(Supplier.suppl_name.like(search)),Supplier.userid == userid).all()
    else:
        suppliers = Supplier.query.filter(Supplier.userid == userid).all()
    for suppl in suppliers:
        supplier_data.append(suppl.map())
    return jsonify(supplier_data)

@api7.route('/search_select', methods=['POST'])
def search_select_index():
    data = request.get_json()
    search_data = []
    userid = int(data['userid'])
    suppliers = Supplier.query.filter(Supplier.userid == userid).all()
    for suppl in suppliers:
        search_data.append({"id":suppl.id, "name":suppl.suppl_name, "type": "supplier", "subtype": ""})
    clients = Clients.query.filter(Clients.userid == userid).all()
    for clnt in clients:
        search_data.append({"id":clnt.id, "name":clnt.client_name, "type": "client", "subtype": ""})
    parties = Party.query.filter(Party.userid == userid).all()
    for part in parties:
        search_data.append({"id":part.id, "name":part.english_name, "type": "party", "subtype": part.type})
    vehicles = Vehicles.query.filter(Vehicles.userid == userid).all()
    for veh in vehicles:
        search_data.append({"id":veh.id, "name":veh.vehicle_num, "type": "vehicle", "subtype":veh.veh_type })
    tblInvoices = TblInvoice.query.filter(TblInvoice.userid == userid).all()
    for tbl_inv in tblInvoices:
        search_data.append({"id":tbl_inv.id, "name":tbl_inv.invoice_num, "type": "invoice","subtype":"" })
    tblClnStkRtn = TblClnStockRtn.query.filter(TblClnStockRtn.userid == userid).all()
    for tbl_clnstk in tblClnStkRtn:
        search_data.append({"id":tbl_clnstk.id, "name":tbl_clnstk.stock_num, "type": "clnreturn","subtype":"" })
    tblStkRtn = TblStockRtn.query.filter(TblStockRtn.userid == userid).all()
    for tbl_stk in tblStkRtn:
        search_data.append({"id":tbl_stk.id, "name":tbl_stk.stock_num, "type": "return","subtype":"" })
    tblOrder = TblOrder.query.all()
    for tbl_ord in tblOrder:
        search_data.append({"id":tbl_ord.id, "name":tbl_ord.order_num, "type": "order","subtype":"" })
    tblGoods = GoodsNlc.query.filter(GoodsNlc.userid == userid).all()
    for tbl_gd in tblGoods:
        search_data.append({"id":tbl_gd.id, "name":tbl_gd.bilty_no, "type": "goods","subtype":"" })
    tblOils = OilPso.query.filter(OilPso.userid == userid).all()
    for tbl_oil in tblOils:
        search_data.append({"id":tbl_oil.id, "name":tbl_oil.bilty_no, "type": "oil","subtype":"" })
    return jsonify(search_data)


@api7.route('/customer_select', methods=['POST'])
def cusotmer_select_index():
    data = request.get_json()
    userid = int(data['userid'])
    customer_data = []
    if(len(str(data['param']).strip()) != 0):
        search = "%{}%".format(str(data['param']).strip())
        clients_d = Clients.query.filter(and_(Clients.client_name.like(search)),Clients.userid == userid).all()
    else:
        clients_d = Clients.query.filter(Clients.userid == userid).all()
    for clnt in clients_d:
        customer_data.append(clnt.map())
    return jsonify(customer_data)


@api7.route('/client_select', methods=['POST'])
def client_select_index():
    data = request.get_json()
    userid = int(data['userid'])
    if(len(str(data['param']).strip()) != 0):
        search = "%{}%".format(str(data['param']).strip())
        clients = Clients.query.filter(and_(Clients.client_name.like(search), Clients.userid == userid)).all()
    else:
        clients = Clients.query.filter(Clients.userid == userid).all()
    clients_data = []
    for client in clients:
        clients_data.append(client.map())
    return jsonify(clients_data)



@api7.route('/supplier_details', methods=['POST'])
def supplier_details_index():
    data = request.get_json()
    userid = int(data['userid'])
    data_details = []
    supplier =  Supplier.query.get(int(data['id']))
    data_details.append({"id":supplier.id , "suppl_name":supplier.suppl_name , "suppl_addrss":supplier.suppl_address , "suppl_city":supplier.suppl_city , "suppl_country":supplier.suppl_country , "suppl_phone":supplier.suppl_phone, "suppl_email":supplier.suppl_email})  
    return jsonify(data_details)


@api7.route('/clients_details', methods=['POST'])
def clients_details_index():
    data = request.get_json()
    userid = int(data['userid'])
    data_details = []
    client =  Clients.query.get(int(data['id']))
    data_details.append({"id":client.id , "suppl_name":client.client_name , "suppl_addrss":client.client_address , "suppl_city":client.client_city , "suppl_country":client.client_country , "suppl_phone":client.client_phone, "suppl_email":client.client_email})  
    return jsonify(data_details)

@api7.route('/client_details', methods=['POST'])
def client_details_index():
    data = request.get_json()
    userid = int(data['userid'])
    data_details = []
    client =  Clients.query.get(int(data['id']))
    data_details.append({"id":client.id , "client_name":client.client_name , "client_addrss":client.client_address , "client_city":client.client_city , "client_country":client.client_country , "client_phone":client.client_phone, "client_email":client.client_email})  
    return jsonify(data_details)


@api7.route('/COA_data_bill', methods = ['POST'])
def COA_data_bill():
    data = request.get_json()
    p_id = str(data['id']).strip()
    p_type = str(data['type']).strip()
    p_name = str(data['name']).strip()
    userid = int(data['userid'])
    select_bills = []
    bill_lists = []
    if(p_type == "party"):
        get_party = Party.query.filter(and_(Party.english_name == str(p_name).strip().lower(),Party.userid == userid)).one()
        coa_goods_bills_party = GoodsNlc.query.filter(GoodsNlc.parties == int(get_party.id)).all()
        coa_oils_bills_party = OilPso.query.filter(OilPso.parties == int(get_party.id)).all()
        for coa_goods_bills_p in coa_goods_bills_party:
            select_bills.append({"id":coa_goods_bills_p.id , "bill_num":str(coa_goods_bills_p.bilty_no).strip()})
        for coa_oils_bills_p in coa_oils_bills_party:
            select_bills.append({"id":coa_oils_bills_p.id , "bill_num":str(coa_oils_bills_p.bilty_no).strip()})          
    elif(p_type == "commission"):
        ledger_comm = Ledger.query.filter(and_(Ledger.ledger_type == "commission"),Ledger.userid == userid).all()
        for comm in ledger_comm:
            if str(comm.ledger_bill).strip() not in bill_lists:
                select_bills.append({"id":comm.id , "bill_num":str(comm.ledger_bill).strip()})
                bill_lists.append(str(comm.ledger_bill).strip())
    elif(p_type == "vehicle"):
        get_vehicle = Vehicles.query.filter(and_(Vehicles.vehicle_num == str(p_name).strip().lower(),Vehicles.userid == userid)).one()
        coa_goods_bills_vehicle = GoodsNlc.query.filter(GoodsNlc.vehicle == int(get_vehicle.id)).all()
        coa_oils_bills_vehicle = OilPso.query.filter(OilPso.vehicle == int(get_vehicle.id)).all()
        for coa_goods_bills_v in coa_goods_bills_vehicle:
            select_bills.append({"id":coa_goods_bills_v.id , "bill_num":str(coa_goods_bills_v.bilty_no).strip()})
        for coa_oils_bills_v in coa_oils_bills_vehicle:
            select_bills.append({"id":coa_oils_bills_v.id , "bill_num":str(coa_oils_bills_v.bilty_no).strip()})
    elif(p_type == "client"):
        get_client = Clients.query.filter(and_(Clients.client_name == str(p_name).strip().lower(),Clients.userid == userid)).one()
        invoice_bills = TblInvoice.query.filter(TblInvoice.client_id == int(get_client.id)).all()
        customer_bills = TblClnStockRtn.query.filter(TblClnStockRtn.client_id == int(get_client.id)).all()
        for inv_bills in invoice_bills:
            select_bills.append({"id":inv_bills.id , "bill_num":str(inv_bills.invoice_num).strip()})
        for inv_cus_bills in customer_bills:
            select_bills.append({"id":inv_cus_bills.id , "bill_num":str(inv_cus_bills.stock_num).strip()})
    elif(p_type == "supplier"):
        get_suppl = Supplier.query.filter(and_(Supplier.suppl_name == str(p_name).strip().lower(),Supplier.userid == userid)).one()
        order_bills = TblOrder.query.filter(TblOrder.supplier_id == int(get_suppl.id)).all()
        stk_rtn_bills = TblStockRtn.query.filter(TblStockRtn.supplier_id == int(get_suppl.id)).all()
        for ord_bills in order_bills:
            select_bills.append({"id":ord_bills.id , "bill_num":str(ord_bills.order_num).strip()})
        for stk_rtn_bll in stk_rtn_bills:
            select_bills.append({"id":stk_rtn_bll.id , "bill_num":str(stk_rtn_bll.stock_num).strip()})
    return jsonify(select_bills)

@api7.route('/cashbook_data/<userid>', methods=['GET'])
def cashbook_index(userid): 
    cashbook_d = db.session.query(Ledger).filter(Ledger.userid == userid).order_by(Ledger.id.desc()).all()
    cashbook_data = []
    for cashbk in cashbook_d:
        cashbook_data.append(cashbk.map())
        
    inv_cus_d = db.session.query(Ledger2).filter(Ledger2.userid == userid).order_by(Ledger2.id.desc()).all()
    ledger2 = []
    for ledg in inv_cus_d:
        ledger2.append(ledg.map())
    return jsonify({"cashbook_data":cashbook_data,"ledger2":ledger2})

@api7.route('/cashbook_data_report', methods=['POST']) 
def cashbook_report_index(): 
    data = request.get_json()
    start_date = (data['t_date_from'])
    end_date = (data['t_date_to'])
    userid = int(data['userid'])
    cashbook_d = db.session.query(Ledger).filter(and_(Ledger.userid == userid, Ledger.datetime >= start_date, Ledger.datetime <= end_date)).order_by(Ledger.id.asc()).all()
    cashbook_data = []
    for cashbk in cashbook_d:
        cashbook_data.append(cashbk.map())
        
    inv_cus_d = db.session.query(Ledger2).filter(and_(Ledger2.userid == userid, Ledger2.datetime >= start_date, Ledger2.datetime <= end_date)).order_by(Ledger2.id.asc()).all()
    ledger2 = []
    for ledg in inv_cus_d:
        ledger2.append(ledg.map())
    return jsonify({"cashbook_data":cashbook_data,"ledger2":ledger2})


@api7.route('/chart_accnt_type_data/<userid>', methods=['GET'])
def chart_accnt_type_index(userid): 
    accnt_types = AccountTypes.query.filter(AccountTypes.username == 'admin').all()
    chart_accnt_types = []
    for a_type in accnt_types:
        chart_accnt_types.append(a_type.map())
    accnt_types2 = AccountTypes.query.filter(AccountTypes.userid == userid).all()
    for a_type2 in accnt_types2:
        chart_accnt_types.append(a_type2.map())
    chart_accnt_data = []
    for chart_acct in chart_accnt_types:
        if(str(chart_acct["type_status"]).strip() == "active"):
            sub_chart_data = AccountSubTypes.query.filter(AccountSubTypes.type_name_id == int(chart_acct["id"]))
            sub_chart_accnt_data = []
            for sub_chart_acct in sub_chart_data:
                if(str(chart_acct["type_status"]).strip() == "active"):
                    sub_chart_accnt_data.append({"sub_id":sub_chart_acct.id,"sub_type":str(sub_chart_acct.sub_type_name).strip()})
            chart_accnt_data.append({"accnt_id":chart_acct["id"],"accnt_type":str(chart_acct["type_name"]).strip(),"sub_accnt":sub_chart_accnt_data})
    return jsonify(chart_accnt_data)

@api7.route('/add_party', methods=['POST']) 
def party_create(): 
    data = request.get_json()
    userid = int(data['userid'])
    get_party_details =  Party.query.filter(and_(Party.english_name == str(data['party']).strip().lower(),Party.userid == userid)).all()
    if(len(get_party_details) == 0):
        accnt_sub_type = AccountSubTypes.query.filter(AccountSubTypes.sub_type_name == "Freight Income").one()
        sadd_party_COA = insert(ChartOfAccount).values(accnt_name=str(data['party']).strip().lower(),accnt_code=str(random.randint(100, 999)), accnt_type=accnt_sub_type.id, accnt_status="active", accnt_description="Income Account", account_mode = 'party', userid = userid )
        sub_chart_of_accnt_result = db.session.execute(sadd_party_COA)
        sadd_party = insert(Party).values(english_name=str(data['party']).strip().lower(), type=data['p_type'], contact_person=data['p_contactPerson'],phone_number=data['p_phoneNo'], chart_accnt= sub_chart_of_accnt_result.inserted_primary_key[0], userid = userid)
        result = db.session.execute(sadd_party)
        accnt_sub_type = AccountSubTypes.query.filter(AccountSubTypes.sub_type_name == "Commission Income").one()
        get_comm_details =  ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_name == str("commission").strip().lower(), ChartOfAccount.accnt_type  ==accnt_sub_type.id, ChartOfAccount.account_mode == 'commission', ChartOfAccount.userid == userid )).all()
        if(len(get_comm_details) == 0):
            add_comm_coa = insert(ChartOfAccount).values(accnt_name=str("commission").strip().lower(),accnt_code=str(random.randint(100, 999)), accnt_type=accnt_sub_type.id, accnt_status="active", accnt_description="Commission Account", account_mode = 'commission', userid = userid)
            add_comm_coa_rlt = db.session.execute(add_comm_coa)
        db.session.commit()
        return jsonify({"data":result.inserted_primary_key[0]})
    else:
        return jsonify({"data":"exits"})


@api7.route('/add_city_setup', methods=['POST']) 
def city_setcreate(): 
    data = request.get_json()
    userid = int(data['userid'])
    sadd_city = insert(CitySetup).values(city_name_e=data['city_name'], city_prov=data['c_province'], city_status="active", userid = userid)
    city_result = db.session.execute(sadd_city)
    db.session.commit()
    return jsonify({"data":city_result.inserted_primary_key[0]})


@api7.route('/add_mode_pay', methods=['POST']) 
def mode_paycreate(): 
    data = request.get_json()
    userid = int(data['userid'])
    sadd_modePay = insert(ModeOfPayment).values(pay_name=data['mode_name'], pay_status=data['mode_status'], exlc_in_cash=data['mode_pay_exclude'], userid = userid)
    modepay_result = db.session.execute(sadd_modePay)
    db.session.commit()
    return jsonify({"data":modepay_result.inserted_primary_key[0]})


@api7.route('/add_unit_values', methods=['POST']) 
def unit_setupcreate(): 
    data = request.get_json()
    userid = int(data['userid'])
    sadd_unit = insert(Units).values(units_name=data['unit_name'], units_status=data['u_status'], userid = userid)
    unit_result = db.session.execute(sadd_unit)
    db.session.commit()
    return jsonify({"data":unit_result.inserted_primary_key[0]})

@api7.route('/add_category_values', methods=['POST']) 
def cat_setupcreate(): 
    data = request.get_json()
    userid = int(data['userid'])
    sadd_category = insert(Categories).values(cat_name=data['cat_name'], cat_code=data['catt_code'], cat_status = 'active', userid = userid)
    category_result = db.session.execute(sadd_category)
    db.session.commit()
    return jsonify({"data":category_result.inserted_primary_key[0]})


@api7.route('/add_warehouse_values', methods=['POST']) 
def ware_setupcreate(): 
    data = request.get_json()
    userid = int(data['userid'])
    sadd_warehouse = insert(Warehouse).values(ware_name=data['ware_stn_name'], ware_description=data['ware_stn_code'], w_status = 'active', userid = userid)
    warehouse_result = db.session.execute(sadd_warehouse)
    db.session.commit()
    return jsonify({"data":warehouse_result.inserted_primary_key[0]})


@api7.route('/add_pcategory_values', methods=['POST']) 
def p_category_setupcreate(): 
    data = request.get_json()
    userid = int(data['userid'])
    sadd_p_category = insert(ProductCategory).values(product_cat_name=data['p_category_name'], product_cat_desp=data['p_category_descp'], product_cat_status = 'active', userid = userid)
    p_category_result = db.session.execute(sadd_p_category)
    db.session.commit()
    return jsonify({"data":p_category_result.inserted_primary_key[0]})

@api7.route('/add_cust_group_values', methods=['POST']) 
def c_add_c_group_setupcreate(): 
    data = request.get_json()
    userid = int(data['userid'])
    sadd_c_group = insert(ClientGroup).values(group_name=data['c_group_name'], group_descp=data['c_group_descp'], group_status = 'active', userid = userid)
    c_client_result = db.session.execute(sadd_c_group)
    db.session.commit()
    return jsonify({"data":c_client_result.inserted_primary_key[0]})

@api7.route('/add_stk_transfer_values', methods=['POST']) 
def add_stk_transfer_setupcreate(): 
    data = request.get_json()
    userid = int(data['userid'])
    sadd_stk_transfer = insert(StockTrasfer).values(stock_tranf_from=data['p_stock_from'], stock_product=data['p_stock_product'], stock_tranf_to = data['p_stock_to'], userid = userid)
    stk_transfer_result = db.session.execute(sadd_stk_transfer)
    db.session.commit()
    return jsonify({"data":stk_transfer_result.inserted_primary_key[0]})

