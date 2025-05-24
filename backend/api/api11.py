from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from catgeory import Categories
from chartofAccount import ChartOfAccount
from clientgroup import ClientGroup
from clients import Clients
from goodsnlc import GoodsNlc
from inwarehouse import InvWarehouses
from ledger import Ledger
from oilpso import OilPso
from party import Party
from partybill import PartyBill
from productctegory import ProductCategory
from supplier import Supplier
from tblProduct import TblProduct
from vehicles import Vehicles
from warehouse import Warehouse
from extensions import db
from sqlalchemy import and_, insert
from api.refreshcoacustomer import RefreshCOA_Customer
from api.refreshtables import RefreshTables

api11 = Blueprint('api11', __name__)

@api11.route('/update_catgeory_setup', methods=['POST']) 
def category_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    cat_value = Categories.query.filter(Categories.id == int(data['cat_id'])).first()
    cat_value.cat_name = str(data['cat_name'])
    cat_value.cat_code = str(data['catt_code'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})

@api11.route('/update_warehouse_setup', methods=['POST']) 
def warehouse_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    warehouse_value = Warehouse.query.filter(Warehouse.id == int(data['w_id'])).first()
    warehouse_value.ware_name = str(data['ware_stn_name'])
    warehouse_value.ware_description = str(data['ware_stn_code'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})

@api11.route('/update_p_category_setup', methods=['POST']) 
def p_category_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    p_category_value = ProductCategory.query.filter(ProductCategory.id == int(data['p_cat_id'])).first()
    p_category_value.product_cat_name = str(data['p_category_name'])
    p_category_value.product_cat_desp = str(data['p_category_descp'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})


@api11.route('/update_c_group_setup', methods=['POST']) 
def c_group_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    c_group_value = ClientGroup.query.filter(ClientGroup.id == int(data['c_grp_id'])).first()
    c_group_value.group_name = str(data['c_group_name'])
    c_group_value.group_descp = str(data['c_group_descp'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})

@api11.route('/update_stk_transfer_setup', methods=['POST']) 
def stk_transfer_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    stk_trnsf_value = ClientGroup.query.filter(ClientGroup.id == int(data['p_stock_id'])).first()
    stk_trnsf_value.stock_tranf_from = str(data['p_stock_from'])
    stk_trnsf_value.stock_product = str(data['p_stock_product'])
    stk_trnsf_value.stock_tranf_to = str(data['p_stock_to'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})


@api11.route('/update_vehicle_setup', methods=['POST']) 
def vehicle_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    vehicle_value = Vehicles.query.filter(Vehicles.id == int(data['veh_id'])).first()
    get_vehicle_chart = ChartOfAccount.query.filter(ChartOfAccount.id == int(str(vehicle_value.chart_accnt))).one()
    get_vehicle_chart.accnt_name = str(data['vehicle_no']).strip().lower()
    vehicle_value.vehicle_num = str(data['vehicle_no']).strip().lower()
    vehicle_value.veh_type = str(data['vehicle_type'])
    vehicle_value.driver_name = str(data['vehicle_driverName'])
    vehicle_value.phone_number = str(data['vehicle_phone'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})

@api11.route('/update_product_setup', methods=['POST']) 
def product_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    product_value = TblProduct.query.filter(TblProduct.id == int(data['p_prodId'])).first()
    product_value.product_name = str(data['p_prodName'])
    product_value.product_cat = str(data['p_prodcat'])
    product_value.product_ware = str(data['p_prodware'])
    product_value.product_code = str(data['p_prodcode'])
    product_value.product_rental = str(data['p_retltprice'])
    product_value.product_whole_price = str(data['p_wholeprice'])
    product_value.product_tax = str(data['p_pdttax'])
    product_value.product_discount = str(data['p_pdtdisc'])
    product_value.product_stock = str(data['p_pdtunits'])
    product_value.product_alert = str(data['p_pdtalert'])
    product_value.product_description = str(data['p_pdtdesrip'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})

@api11.route('/update_customer_setup', methods=['POST']) 
def customer_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    client_value = Clients.query.filter(Clients.id == int(data['c_clientId'])).first()
    get_client_coa = ChartOfAccount.query.filter(ChartOfAccount.id == int(client_value.chart_accnt)).one()
    get_client_coa.accnt_name = str(data['c_clientName']).strip().lower()
    client_value.client_name = str(data['c_clientName']).strip().lower()
    client_value.client_company = str(data['c_clientCmp'])
    client_value.client_phone = str(data['c_clientPhone'])
    client_value.client_email = str(data['c_clientEmail'])
    client_value.client_address = str(data['c_clientAddress'])
    client_value.client_city = str(data['c_clientCity'])
    client_value.client_region = str(data['c_clientRegion'])
    client_value.client_country = str(data['c_clientCountry'])
    client_value.client_postbox = str(data['c_clientPostBox'])
    client_value.client_tax_id = str(data['c_clientTaxid'])
    client_value.client_group = str(data['c_clientGrp'])
    client_value.shipp_name = str(data['c_shippName'])
    client_value.shipp_phone = str(data['c_shippPhone'])
    client_value.shipp_email = str(data['c_shippEmail'])
    client_value.shipp_address = str(data['c_shippAddress'])
    client_value.shipp_city = str(data['c_shippCity'])
    client_value.shipp_region = str(data['c_shippRegion'])
    client_value.shipp_country = str(data['c_shippCountry'])
    client_value.shipp_postbox = str(data['c_shippPostBox'])
    client_value.same_address = str(data['c_upsameAddress'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})

@api11.route('/update_supplier_setup', methods=['POST']) 
def supplier_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    suppl_value = Supplier.query.filter(Supplier.id == int(data['s_supplId'])).first()
    get_suppl_coa = ChartOfAccount.query.filter(ChartOfAccount.id == int(suppl_value.chart_accnt)).one()
    get_suppl_coa.accnt_name = str(data['s_supplName']).strip().lower()
    suppl_value.suppl_name =  str(data['s_supplName']).strip().lower()
    suppl_value.suppl_company = str(data['s_supplCmp'])
    suppl_value.suppl_phone = str(data['s_supplPhone'])
    suppl_value.suppl_email = str(data['s_supplEmail'])
    suppl_value.suppl_address = str(data['s_supplAddress'])
    suppl_value.suppl_city = str(data['s_supplCity'])
    suppl_value.suppl_region = str(data['s_supplRegion'])
    suppl_value.suppl_country = str(data['s_supplCountry'])
    suppl_value.suppl_postbox = str(data['s_supplPostBox'])
    suppl_value.suppl_tax_id = str(data['s_supplTaxid'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})

@api11.route('/update_inwarehouse_setup', methods=['POST']) 
def inwarehouse_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    inwarehouse_value = InvWarehouses.query.filter(InvWarehouses.id == int(data['inw_id'])).first()
    inwarehouse_value.ware_name = str(data['in_ware_name'])
    inwarehouse_value.ware_code = str(data['inware_code'])
    inwarehouse_value.ware_location = str(data['inware_location'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})

@api11.route('/update_manifest_goods_setup', methods=['POST']) 
def update_manifest_set_update(): 
    data = request.get_json()
    party_amt = int(data['G_BFreight']) 
    comm_amt = int(data['G_BComm'])
    userid = int(data['userid'])
    manifest_goods_value = GoodsNlc.query.filter(GoodsNlc.id == int(data['G_BiltyId'])).first()
    get_prev_party = Party.query.get(int(str(manifest_goods_value.parties)))
    get_prev_vehicle = Vehicles.query.get(int(str(manifest_goods_value.vehicle)))
    get_vehicle = Vehicles.query.get(int(str(data['G_BVehicle'])))
    manifest_goods_value.bilty_no = str(data['G_BiltyNo'])
    manifest_goods_value.b_date = str(data['G_BiltyDate'])
    manifest_goods_value.vehicle = str(data['G_BVehicle'])
    manifest_goods_value.loading_point = str(data['G_loading'])
    manifest_goods_value.unloading_point = str(data['G_unloading'])
    manifest_goods_value.tax_per = str(data['per_wft'])
    manifest_goods_value.comm_per = str(data['per_comm'])
    manifest_goods_value.weight = str(data['G_Bweight'])
    manifest_goods_value.per_ton = str(data['G_BPerTon'])
    manifest_goods_value.freight = party_amt
    manifest_goods_value.wrt_4_per_freight = str(data['G_BWRT4Freight'])
    manifest_goods_value.commission = comm_amt
    manifest_goods_value.other_cahrges = str(data['G_BOtherCharges'])
    manifest_goods_value.vehicle_freight = str(data['G_BvehicleFreight'])
    manifest_goods_value.vehicle_balance = str(data['G_BvehicleBal'])
    manifest_goods_value.advance_to_vehicle = str(data['G_BvehicleAdvance'])
    manifest_goods_value.paid_by = str(data['G_paid_Method'])
    manifest_goods_value.goods_gst = str(data['Goods_GST'])
    db.session.flush()
    db.session.commit()
    vehicle_advance = 0
    ledger_comm = Ledger.query.filter(and_( Ledger.ledger_gen_date == manifest_goods_value.b_date,Ledger.ledger_bill == manifest_goods_value.bilty_no ,Ledger.ledger_type == "commission",Ledger.pay_start == "started" )).one()
    ledger_comm.ledger_credit_amount = int(data['G_BComm'])
    ledger_comm.ledger_balance = int(data['G_BComm'])
    ledger_party = Ledger.query.filter(and_( Ledger.ledger_gen_date == manifest_goods_value.b_date,Ledger.ledger_bill == manifest_goods_value.bilty_no ,Ledger.ledger_type == "party",Ledger.pay_start == "started" )).one()
    ledger_party.ledger_debit_amount = int(party_amt)
    ledger_party.ledger_balance = int(party_amt)
    db.session.flush()
    db.session.commit()
    if(str(data['G_BvehicleAdvance']).strip() != ''):
        vehicle_advance = str(data['G_BvehicleAdvance']).strip()
    if (int(vehicle_advance) != 0) :    
        ledger_values = Ledger.query.filter(and_(Ledger.ledger_gen_date == manifest_goods_value.b_date,Ledger.ledger_bill == manifest_goods_value.bilty_no ,Ledger.ledger_type == "vehicle")).order_by(Ledger.id.asc()).all()
        ledger_values[0].ledger_credit_amount = str(data['G_BvehicleFreight'])
        db.session.flush()
        db.session.commit()
        if(len(ledger_values) > 1):
            del_vehicle_ledger_data = Ledger.__table__.delete().where(Ledger.id == int(ledger_values[1].id))
            db.session.execute(del_vehicle_ledger_data)
        ledger_balance = int(get_vehicle.net_worth) + (int(data['G_BvehicleFreight']))
        cash_balance = ledger_balance - int(data['G_BvehicleAdvance'])
        add_cash_veh_adv =  insert(Ledger).values(ledger_account_no =get_vehicle.chart_accnt, ledger_party_name= get_vehicle.vehicle_num, ledger_gen_date= data['G_BiltyDate'], ledger_debit_amount = str(data['G_BvehicleAdvance']).strip(), ledger_credit_amount= 0, ledger_bill=data['G_BiltyNo'],ledger_method= data['G_paid_Method'], ledger_balance= int(int(str(data['G_BvehicleFreight']).strip()) - int(str(data['G_BvehicleAdvance']).strip())), ledger_type='vehicle', ledger_descp="Payment Towards Bill No: " +data['G_BiltyNo'], userid = userid) 
        add_cash_veh_adv_result = db.session.execute(add_cash_veh_adv)
    else:
        ledger_values = Ledger.query.filter(and_(Ledger.ledger_gen_date == manifest_goods_value.b_date,Ledger.ledger_bill == manifest_goods_value.bilty_no ,Ledger.ledger_type == "vehicle",Ledger.pay_start == "started" )).order_by(Ledger.id.asc()).all()
        ledger_values[0].ledger_credit_amount = str(data['G_BvehicleFreight'])
        db.session.flush()
        db.session.commit()
        if(len(ledger_values) > 1):
            del_vehicle_ledger_data = Ledger.__table__.delete().where(Ledger.id == int(ledger_values[1].id))
            db.session.execute(del_vehicle_ledger_data)
    party_led_bal = 0
    veh_led_bal = 0
    comm_led_bal = 0
    manif_ledg = Ledger.query.filter(and_(Ledger.ledger_bill == str(manifest_goods_value.bilty_no).strip())).order_by(Ledger.id.asc()).all()
    for man in manif_ledg:
        if(str(man.ledger_type).strip() == "party"):
            party_led_bal +=  int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
            man.ledger_balance = party_led_bal
        elif(str(man.ledger_type).strip() == "vehicle"):
            veh_led_bal +=   int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
            man.ledger_balance = veh_led_bal
        elif(str(man.ledger_type).strip() == "commission"):
            comm_led_bal +=   int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
            man.ledger_balance = comm_led_bal
        db.session.flush()
        db.session.commit()
    RefreshCOA_Customer.refresh_COA_Party(get_prev_party.chart_accnt)
    if(int(str(get_prev_vehicle.chart_accnt)) == int(str(get_vehicle.chart_accnt))):
        RefreshCOA_Customer.refresh_COA_Vehicle(get_vehicle.chart_accnt)
    else:
        RefreshCOA_Customer.refresh_COA_Vehicle(get_prev_vehicle.chart_accnt)
        RefreshCOA_Customer.refresh_COA_Vehicle(get_vehicle.chart_accnt)
    RefreshCOA_Customer.refresh_COA_Comm(userid)
    return jsonify({"data":"updated"})


@api11.route('/update_manifest_oils_setup', methods=['POST']) 
def update_mani_oils_set_update(): 
    data = request.get_json()
    party_amt = int(data['G_O_BFreight']) 
    comm_amt = int(data['G_O_BComm']) 
    userid = int(data['userid'])
    manifest_oils_value = OilPso.query.filter(OilPso.id == int(data['G_OBiltyId'])).first()
    get_prev_party = Party.query.get(int(str(manifest_oils_value.parties)))
    get_prev_vehicle = Vehicles.query.get(int(str(manifest_oils_value.vehicle)))
    get_vehicle = Vehicles.query.get(int(str(data['G_OBVehicle'])))
    manifest_oils_value.bilty_no = str(data['G_OBiltyNo'])
    manifest_oils_value.b_date = str(data['G_OBiltyDate'])
    manifest_oils_value.vehicle = str(data['G_OBVehicle'])
    manifest_oils_value.loading_point = str(data['G_O_loading'])
    manifest_oils_value.unloading_point = str(data['G_unO_loading'])
    manifest_oils_value.material = str(data['G_O_material'])
    manifest_oils_value.parties = str(data['G_O_Bparty'])
    manifest_oils_value.quantity = str(data['G_O_Bweight'])
    manifest_oils_value.per_ton = str(data['G_O_BPerTon'])
    manifest_oils_value.freight = party_amt
    manifest_oils_value.wrt_4_per_freight = str(data['G_O_BWRT4Freight'])
    manifest_oils_value.commission = comm_amt
    manifest_oils_value.other_cahrges = str(data['G_O_BOtherCharges'])
    manifest_oils_value.vehicle_freight = str(data['G_O_BVehicleFreight'])
    manifest_oils_value.vehicle_balance = str(data['G_O_BVehicleBal'])
    manifest_oils_value.advance_to_vehicle = str(data['G_O_BVehicleAdvance'])
    manifest_oils_value.paid_by = str(data['G_O_paid_Method'])
    manifest_oils_value.oils_gst = str(data['G_O_Oils_GST'])
    manifest_oils_value.tax_per = str(data['per_wft'])
    manifest_oils_value.comm_per = str(data['per_comm'])
    db.session.flush()
    db.session.commit()
    vehicle_advance = 0
    ledger_comm = Ledger.query.filter(and_( Ledger.ledger_gen_date == manifest_oils_value.b_date,Ledger.ledger_bill == manifest_oils_value.bilty_no ,Ledger.ledger_type == "commission",Ledger.pay_start == "started")).one()
    ledger_comm.ledger_credit_amount = int(data['G_O_BComm'])
    ledger_party = Ledger.query.filter(and_( Ledger.ledger_gen_date == manifest_oils_value.b_date,Ledger.ledger_bill == manifest_oils_value.bilty_no ,Ledger.ledger_type == "party",Ledger.pay_start == "started" )).one()
    ledger_party.ledger_debit_amount = int(party_amt)
    db.session.flush()
    db.session.commit()
    if(str(data['G_O_BVehicleAdvance']).strip() != ''):
        vehicle_advance = str(data['G_O_BVehicleAdvance']).strip()
    if (int(vehicle_advance) != 0) :    
        ledger_values = Ledger.query.filter(and_(Ledger.ledger_gen_date == manifest_oils_value.b_date,Ledger.ledger_bill == manifest_oils_value.bilty_no ,Ledger.ledger_type == "vehicle")).order_by(Ledger.id.asc()).all()
        ledger_values[0].ledger_credit_amount = str(data['G_O_BVehicleFreight'])
        if(len(ledger_values) > 1):
            del_vehicle_ledger_data = Ledger.__table__.delete().where(Ledger.id == int(ledger_values[1].id))
            db.session.execute(del_vehicle_ledger_data)
        ledger_balance = int(get_vehicle.net_worth) + (int(data['G_O_BVehicleFreight']))
        cash_balance = ledger_balance - int(data['G_O_BVehicleAdvance'])
        add_cash_veh_adv =insert(Ledger).values(ledger_account_no =get_vehicle.chart_accnt, ledger_party_name= get_vehicle.vehicle_num, ledger_gen_date= data['G_OBiltyDate'], ledger_debit_amount = str(data['G_O_BVehicleAdvance']).strip(), ledger_credit_amount= 0 , ledger_bill=data['G_OBiltyNo'],ledger_method= data['G_O_paid_Method'], ledger_balance= int(int(str(data['G_O_BVehicleFreight']).strip()) - int(str(data['G_O_BVehicleAdvance']).strip())), ledger_type='vehicle', ledger_descp="Payment Towards Bill No: " +data['G_OBiltyNo'], userid = userid)     
        add_cash_veh_adv_result = db.session.execute(add_cash_veh_adv)
    else:
        ledger_values = Ledger.query.filter(and_(Ledger.ledger_gen_date == manifest_oils_value.b_date,Ledger.ledger_bill == manifest_oils_value.bilty_no ,Ledger.ledger_type == "vehicle",Ledger.pay_start == "started" )).order_by(Ledger.id.asc()).all()
        ledger_values[0].ledger_credit_amount = str(data['G_O_BVehicleFreight'])
        if(len(ledger_values) > 1):
            del_vehicle_ledger_data = Ledger.__table__.delete().where(Ledger.id == int(ledger_values[1].id))
            db.session.execute(del_vehicle_ledger_data)
        db.session.flush()
        db.session.commit()
    
    party_led_bal = 0
    veh_led_bal = 0
    comm_led_bal = 0
    manif_ledg = Ledger.query.filter(and_(Ledger.ledger_bill == str(manifest_oils_value.bilty_no).strip())).order_by(Ledger.id.asc()).all()
    for man in manif_ledg:
        if(str(man.ledger_type).strip() == "party"):
            party_led_bal +=  int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
            man.ledger_balance = party_led_bal
        elif(str(man.ledger_type).strip() == "vehicle"):
            veh_led_bal +=   int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
            man.ledger_balance = veh_led_bal
        elif(str(man.ledger_type).strip() == "commission"):
            comm_led_bal +=   int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
            man.ledger_balance = comm_led_bal
        db.session.flush()
        db.session.commit()
    RefreshCOA_Customer.refresh_COA_Party(get_prev_party.chart_accnt)
    if(int(str(get_prev_vehicle.chart_accnt)) == int(str(get_vehicle.chart_accnt))):
        RefreshCOA_Customer.refresh_COA_Vehicle(get_vehicle.chart_accnt)
    else:
        RefreshCOA_Customer.refresh_COA_Vehicle(get_prev_vehicle.chart_accnt)
        RefreshCOA_Customer.refresh_COA_Vehicle(get_vehicle.chart_accnt)
    RefreshCOA_Customer.refresh_COA_Comm(userid)
    return jsonify({"data":"updated"})

@api11.route('/update_party_bill', methods=['POST']) 
def update_party_bill_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    parrty_bill_value = PartyBill.query.filter(PartyBill.id == int(data['pb_partybillId'])).first()
    get_party = Party.query.get(int(str(parrty_bill_value.party_id)))
    prev_bilties = str(parrty_bill_value.invoice_bilties).strip()
    if(str(parrty_bill_value.invoice_type).strip() == "goods"):
        for p_bilty in prev_bilties.split(","):
            manifest_prv_goods_value = GoodsNlc.query.filter(GoodsNlc.id == int(p_bilty)).first()
            manifest_prv_goods_value.bill_status = 'pending'
            db.session.flush()
            db.session.commit()
        for bilty in str(data['pb_select_bilty']).split(","):
            manifest_goods_value = GoodsNlc.query.filter(GoodsNlc.id == int(bilty)).first()
            manifest_goods_value.bill_status = parrty_bill_value.invoice_status
            db.session.flush()
            db.session.commit()   
    elif(str(parrty_bill_value.invoice_type).strip() == "oil"):
        for p_bilty in prev_bilties.split(","):
            manifest_prev_oils_value = OilPso.query.filter(OilPso.id == int(p_bilty)).first()
            manifest_prev_oils_value.bill_status = 'pending'
            db.session.flush()
            db.session.commit()
        for bilty in str(data['pb_select_bilty']).split(","):
            manifest_oils_value = OilPso.query.filter(OilPso.id == int(bilty)).first()
            manifest_oils_value.bill_status = parrty_bill_value.invoice_status
            db.session.flush()
            db.session.commit()   
    ledger_values = Ledger.query.filter(and_(Ledger.ledger_account_no == int(str(get_party.chart_accnt)),Ledger.ledger_gen_date == parrty_bill_value.invoice_date,Ledger.ledger_bill == parrty_bill_value.invoice_no,Ledger.ledger_type == "party" , Ledger.pay_start == "started")).one()
    ledger_values.ledger_debit_amount = str(data['pb_subTotal'])
    ledger_values.ledger_balance = str(data['pb_subTotal'])
    parrty_bill_value.invoice_due_date = str(data['pb_dueDate'])
    parrty_bill_value.invoice_balance = str(data['pb_subTotal'])
    parrty_bill_value.invoice_sales_person = str(data['pb_salesName'])
    parrty_bill_value.invoice_thank_message = str(data['pb_thankMssg'])
    parrty_bill_value.invoice_bilties = str(data['pb_select_bilty'])
    db.session.flush()
    db.session.commit()
    RefreshCOA_Customer.refresh_COA_Party(str(get_party.chart_accnt))
    return jsonify({"data":"updated"})
