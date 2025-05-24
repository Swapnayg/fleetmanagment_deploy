import random
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from accountSubTypes import AccountSubTypes
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
from purchItems import PurchItems
from quoteitems import QuoteItems
from reccIncoice import TblReccInvoice
from reccItems import ReccItems
from returnItems import ReturnItems
from stkRtn import TblStockRtn
from supplier import Supplier
from tblInvoice import TblInvoice
from tblOrder import TblOrder
from tblProduct import TblProduct
from tblQuote import TblQuote
from vehicles import Vehicles
from extensions import db
from sqlalchemy import and_, insert
from api.refreshcoacustomer import RefreshCOA_Customer

api8 = Blueprint('api8', __name__)

@api8.route('/add_vehicle_values', methods=['POST']) 
def vehicle_create(): 
    data = request.get_json()
    userid = int(data['userid'])
    get_vehicle_details =  Vehicles.query.filter(and_(Vehicles.vehicle_num == str(data['vehicle_no']).strip().lower()),Vehicles.userid == userid).all()
    if(len(get_vehicle_details) == 0):
        accnt_sub_type = AccountSubTypes.query.filter(AccountSubTypes.sub_type_name == "Freight Expense").one()
        sadd_vehicle_COA = insert(ChartOfAccount).values(accnt_name=str(data['vehicle_no']).strip().lower(),accnt_code=str(random.randint(100, 999)), accnt_type=accnt_sub_type.id, accnt_status="active", accnt_description="Expense Account", account_mode = 'vehicle', userid = userid)
        sub_chart_of_accnt_result = db.session.execute(sadd_vehicle_COA)
        sadd_vehicle = insert(Vehicles).values(vehicle_num=str(data['vehicle_no']).strip().lower(),veh_type=str(data['vehicle_type']).strip().lower(), driver_name=data['vehicle_driverName'], phone_number = data['vehicle_phone'],chart_accnt=sub_chart_of_accnt_result.inserted_primary_key[0], userid = userid)
        vehicle_result = db.session.execute(sadd_vehicle)
        db.session.commit()
        accnt_sub_type = AccountSubTypes.query.filter(AccountSubTypes.sub_type_name == "Commission Income").one()
        get_comm_details =  ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_name == str("commission").strip().lower(), ChartOfAccount.accnt_type  ==accnt_sub_type.id, ChartOfAccount.account_mode == 'commission', ChartOfAccount.userid == userid )).all()
        if(len(get_comm_details) == 0):
            add_comm_coa = insert(ChartOfAccount).values(accnt_name=str("commission").strip().lower(),accnt_code=str(random.randint(100, 999)), accnt_type=accnt_sub_type.id, accnt_status="active", accnt_description="Commission Account", account_mode = 'commission', userid = userid)
            add_comm_coa_rlt = db.session.execute(add_comm_coa)
        return jsonify({"data":vehicle_result.inserted_primary_key[0]})
    else:
        return jsonify({"data":"exits"})


@api8.route('/add_product_values', methods=['POST']) 
def product_create(): 
    data = request.get_json()
    userid = int(data['userid'])
    sadd_product = insert(TblProduct).values(product_name=data['p_prodName'], product_cat=data['p_prodcat'], product_ware = data['p_prodware'], product_code = data['p_prodcode'], product_rental = data['p_retltprice'], product_whole_price = data['p_wholeprice'], product_tax = data['p_pdttax'], product_discount = data['p_pdtdisc'], product_stock = data['p_pdtunits'], product_alert = data['p_pdtalert'], product_description = data['p_pdtdesrip'], product_status='active', userid = userid)
    product_result = db.session.execute(sadd_product)
    db.session.commit()
    return jsonify({"data":product_result.inserted_primary_key[0]})  


@api8.route('/add_customer_values', methods=['POST']) 
def customer_create(): 
    data = request.get_json()
    userid = int(data['userid'])
    get_customer_details =  Clients.query.filter(and_(Clients.client_name == str(data['c_clientName']).strip().lower()),Clients.userid == userid).all()
    if(len(get_customer_details) == 0):
        accnt_sub_type = AccountSubTypes.query.filter(AccountSubTypes.sub_type_name == "Sales Income").one()
        sadd_customer_COA = insert(ChartOfAccount).values(accnt_name=str(data['c_clientName']).strip().lower(),accnt_code=str(random.randint(100, 999)), accnt_type=accnt_sub_type.id, accnt_status="active", accnt_description="Expense Account", account_mode = 'client', userid = userid)
        sub_chart_of_accnt_result = db.session.execute(sadd_customer_COA)
        sadd_customer = insert(Clients).values(client_name=str(data['c_clientName']).strip().lower(), client_company=data['c_clientCmp'], client_phone = data['c_clientPhone'], client_email = data['c_clientEmail'], client_address = data['c_clientAddress'], client_city = data['c_clientCity'], client_region = data['c_clientRegion'], client_country = data['c_clientCountry'], client_postbox = data['c_clientPostBox'], client_tax_id = data['c_clientTaxid'], client_group = data['c_clientGrp'], shipp_name=data['c_shippName'], shipp_phone=data['c_shippPhone'], shipp_email=data['c_shippEmail'], shipp_address=data['c_shippAddress'], shipp_city=data['c_shippCity'], shipp_region=data['c_shippRegion'], shipp_country=data['c_shippCountry'], shipp_postbox=data['c_shippPostBox'], client_status='active', same_address=data['c_sameAddress'], chart_accnt = sub_chart_of_accnt_result.inserted_primary_key[0], userid = userid)
        customer_result = db.session.execute(sadd_customer)
        db.session.commit()
        return jsonify({"data":customer_result.inserted_primary_key[0]})  
    else:
        return jsonify({"data":"exits"})

@api8.route('/add_supplier_values', methods=['POST']) 
def supplier_create(): 
    data = request.get_json()
    userid = int(data['userid'])
    get_suppl_details =  Supplier.query.filter(and_(Supplier.suppl_name == str(data['s_supplName']).strip().lower()),Supplier.userid == userid).all()
    if(len(get_suppl_details) == 0):
        accnt_sub_type = AccountSubTypes.query.filter(AccountSubTypes.sub_type_name == "Product Cost").one()
        sadd_supplier_COA = insert(ChartOfAccount).values(accnt_name=str(data['s_supplName']).strip().lower(),accnt_code=str(random.randint(100, 999)), accnt_type=accnt_sub_type.id, accnt_status="active", accnt_description="Expense Account", account_mode = 'supplier', userid = userid)
        sub_chart_of_accnt_result = db.session.execute(sadd_supplier_COA) 
        sadd_supplier = insert(Supplier).values(suppl_name= str(data['s_supplName']).strip().lower(), suppl_company=data['s_supplCmp'], suppl_phone = data['s_supplPhone'], suppl_email = data['s_supplEmail'], suppl_address = data['s_supplAddress'], suppl_city = data['s_supplCity'], suppl_region = data['s_supplRegion'], suppl_country = data['s_supplCountry'], suppl_postbox = data['s_supplPostBox'], suppl_tax_id = data['s_supplTaxid'], suppl_status = 'active', chart_accnt = sub_chart_of_accnt_result.inserted_primary_key[0], userid = userid)
        supplier_result = db.session.execute(sadd_supplier)
        db.session.commit()
        return jsonify({"data":supplier_result.inserted_primary_key[0]})  
    else:
        return jsonify({"data":"exits"})

@api8.route('/add_purchase_order_values', methods=['POST']) 
def purchase_order_create(): 
    data = request.get_json()
    userid = int(data['userid'])
    get_supplier = Supplier.query.get(int(str(data['o_supplid'])))
    get_suppl_coa = ChartOfAccount.query.filter(and_(ChartOfAccount.id == int(str(get_supplier.chart_accnt)),ChartOfAccount.userid == userid)).one()
    sadd_order = insert(TblOrder).values(supplier_id= str(data['o_supplid']).strip().lower(), warehouse_id=data['o_warehouse'], order_num = data['o_invoiceNm'], order_refer = data['o_invoiceRef'], order_date = data['a_OInvDate'], order_due_date = data['o_OInvDueDate'], order_tax = data['o_OInvTax'], order_discount = data['o_OInvDisc'], total_tax = data['o_OInvTotax'], total_discount = data['o_OInvDist'], shipping =  data['o_OInvShipp'], grand_total =  data['o_OInvGrnTotal'], order_items =  len(data['o_items']),order_note =  data['o_OInvNote'],payment_terms =  data['o_payment_due'],update_stock =  data['o_update_stk'],order_status =  'pending', userid = userid)
    order_result = db.session.execute(sadd_order)
    ledger_balance = int(get_supplier.networth) + (int(round(float(data['o_OInvGrnTotal']))))
    add_order_led = insert(Ledger2).values(ledger_account_no =get_supplier.chart_accnt, ledger_party_name= get_supplier.suppl_name, ledger_gen_date= data['a_OInvDate'], ledger_debit_amount = 0, ledger_credit_amount= (int(round(float(data['o_OInvGrnTotal'])))), ledger_bill=data['o_invoiceNm'],ledger_method= 'cash', ledger_balance= (int(round(float(data['o_OInvGrnTotal'])))), ledger_type='supplier', ledger_descp="Supplier Payment Towards Invoice No: " +data['o_invoiceNm'], pay_start="started", userid = userid)
    add_suppl_led_result = db.session.execute(add_order_led)
    get_suppl_coa.networth = ledger_balance
    get_supplier.networth = ledger_balance
    db.session.flush()
    db.session.commit()
    for item in data['o_items']:
        sadd_item = insert(PurchItems).values(item_name= str(item['name']).strip().lower(), item_product=item['product'], item_invoice = order_result.inserted_primary_key[0], item_qnty = item['qty'], item_rate = item['rate'], item_per_tax = item['item_tax'], item_tax = item['tax_amt'], item_disc = item['item_discount'], item_amount = item['total_amt'], item_description = item['description'], item_disc_val =  item['dis_amt'], userid = userid)
        item_result = db.session.execute(sadd_item)
        product_value = TblProduct.query.filter(TblProduct.id == int(item['product'])).first()
        total_stk = int(product_value.product_stock)
        product_value.product_stock = total_stk + int(item['qty'])
        db.session.flush()
        db.session.commit()  
    return jsonify({"data":order_result.inserted_primary_key[0]})   


@api8.route('/add_stock_return_values', methods=['POST']) 
def stock_return_create(): 
    data = request.get_json()
    frg_key_val = 0
    userid = int(data['userid'])
    if(str(data['o_type']).strip()== "Supplier"):
        get_supplier = Supplier.query.get(int(str(data['o_supplid'])))
        get_suppl_coa = ChartOfAccount.query.filter(and_(ChartOfAccount.id == int(str(get_supplier.chart_accnt)),ChartOfAccount.userid == userid)).one()
        stk_sadd_return = insert(TblStockRtn).values(supplier_id= str(data['o_supplid']).strip().lower(), warehouse_id=data['o_warehouse'], stock_num = data['o_invoiceNm'], stock_refer = data['o_invoiceRef'], stock_date = data['a_OInvDate'], stock_due_date = data['o_OInvDueDate'], stock_tax = data['o_OInvTax'], stock_discount = data['o_OInvDisc'], total_tax = data['o_OInvTotax'], total_discount = data['o_OInvDist'], shipping =  data['o_OInvShipp'], grand_total =  data['o_OInvGrnTotal'], stock_items =  len(data['o_items']),stock_note =  data['o_OInvNote'],payment_terms =  data['o_payment_due'],update_stock =  data['o_update_stk'],stock_status =  'pending', userid = userid)
        stk_return_result = db.session.execute(stk_sadd_return)
        frg_key_val = stk_return_result.inserted_primary_key[0]
        ledger_balance = int(get_supplier.networth) - (int(round(float(data['o_OInvGrnTotal']))))
        add_stk_led = insert(Ledger2).values(ledger_account_no =get_supplier.chart_accnt, ledger_party_name= get_supplier.suppl_name, ledger_gen_date= data['a_OInvDate'], ledger_debit_amount = (int(round(float(data['o_OInvGrnTotal'])))), ledger_credit_amount= 0, ledger_bill=data['o_invoiceNm'],ledger_method= 'cash', ledger_balance= -(int(round(float(data['o_OInvGrnTotal'])))), ledger_type='supplier', ledger_descp="Supplier Payment Towards Invoice No: " +data['o_invoiceNm'], pay_start="started", userid = userid)
        add_stk_led_result = db.session.execute(add_stk_led)
        get_suppl_coa.networth = ledger_balance
        get_supplier.networth = ledger_balance
        db.session.flush()
        db.session.commit()
        for item in data['o_items']:
            sadd_item = insert(ReturnItems).values(item_name= str(item['name']).strip().lower(), item_product=item['product'], item_invoice = stk_return_result.inserted_primary_key[0], item_qnty = item['qty'], item_rate = item['rate'], item_per_tax = item['item_tax'], item_tax = item['tax_amt'], item_disc = item['item_discount'], item_amount = item['total_amt'], item_description = item['description'], item_disc_val =  item['dis_amt'], userid = userid)
            item_result = db.session.execute(sadd_item)
            product_value = TblProduct.query.filter(TblProduct.id == int(item['product'])).first()
            total_stk = int(product_value.product_stock)
            product_value.product_stock = total_stk - int(item['qty'])
            db.session.flush()
            db.session.commit()
    elif(str(data['o_type']).strip()== "Customer"):
        get_client = Clients.query.get(int(str(data['o_supplid'])))
        get_client_coa = ChartOfAccount.query.filter(and_(ChartOfAccount.id == int(str(get_client.chart_accnt)),ChartOfAccount.userid == userid)).one()
        cln_sadd_return = insert(TblClnStockRtn).values(client_id= str(data['o_supplid']).strip().lower(), warehouse_id=data['o_warehouse'], stock_num = data['o_invoiceNm'], stock_refer = data['o_invoiceRef'], stock_date = data['a_OInvDate'], stock_due_date = data['o_OInvDueDate'], stock_tax = data['o_OInvTax'], stock_discount = data['o_OInvDisc'], total_tax = data['o_OInvTotax'], total_discount = data['o_OInvDist'], shipping =  data['o_OInvShipp'], grand_total =  data['o_OInvGrnTotal'], stock_items =  len(data['o_items']),stock_note =  data['o_OInvNote'],payment_terms =  data['o_payment_due'],update_stock =  data['o_update_stk'],stock_status =  'pending', userid = userid)
        cln_return_result = db.session.execute(cln_sadd_return)
        frg_key_val = cln_return_result.inserted_primary_key[0]
        ledger_balance = -(int(get_client.networth) + (int(round(float(data['o_OInvGrnTotal'])))))
        add_cust_led = insert(Ledger2).values(ledger_account_no =get_client.chart_accnt, ledger_party_name= get_client.client_name, ledger_gen_date= data['a_OInvDate'], ledger_debit_amount = 0, ledger_credit_amount= (int(round(float(data['o_OInvGrnTotal'])))), ledger_bill=data['o_invoiceNm'],ledger_method= 'Cash', ledger_balance= (int(round(float(data['o_OInvGrnTotal'])))), ledger_type='client', ledger_descp="Customer Payment Towards Bill No: " +data['o_invoiceNm'], pay_start="started", userid = userid)
        add_cus_led_result = db.session.execute(add_cust_led)
        get_client_coa.networth = ledger_balance
        get_client.networth = ledger_balance
        db.session.flush()
        db.session.commit()
        for item in data['o_items']:
            sadd_item = insert(ClientReturnItems).values(item_name= str(item['name']).strip().lower(), item_product=item['product'], item_invoice = cln_return_result.inserted_primary_key[0], item_qnty = item['qty'], item_rate = item['rate'], item_per_tax = item['item_tax'], item_tax = item['tax_amt'], item_disc = item['item_discount'], item_amount = item['total_amt'], item_description = item['description'], item_disc_val =  item['dis_amt'], userid = userid)
            item_result = db.session.execute(sadd_item)
            product_value = TblProduct.query.filter(TblProduct.id == int(item['product'])).first()
            total_stk = int(product_value.product_stock)
            product_value.product_stock = total_stk + int(item['qty'])
            db.session.flush()
            db.session.commit()
    return jsonify({"data":frg_key_val})   

@api8.route('/add_quote_values', methods=['POST']) 
def quote_inv_create(): 
    data = request.get_json()
    userid = int(data['userid'])
    sadd_quote = insert(TblQuote).values(client_id= str(data['o_clientid']).strip().lower(), warehouse_id=data['o_warehouse'], quote_num = data['o_invoiceNm'], quote_refer = data['o_invoiceRef'], quote_date = data['a_OInvDate'], quote_due_date = data['o_OInvDueDate'], quote_tax = data['o_OInvTax'], quote_discount = data['o_OInvDisc'], total_tax = data['o_OInvTotax'], total_discount = data['o_OInvDist'], shipping =  data['o_OInvShipp'], grand_total =  data['o_OInvGrnTotal'], quote_items =  len(data['o_items']),quote_note =  data['o_OInvNote'],payment_terms =  data['o_payment_due'],payment_currency =  data['o_payment_curr'],invoice_status =  'pending', userid = userid)
    quote_result = db.session.execute(sadd_quote)
    db.session.commit()
    for item in data['o_items']:
        sadd_item = insert(QuoteItems).values(item_name= str(item['name']).strip().lower(), item_product=item['product'], item_invoice = quote_result.inserted_primary_key[0], item_qnty = item['qty'], item_rate = item['rate'], item_per_tax = item['item_tax'], item_tax = item['tax_amt'], item_disc = item['item_discount'], item_amount = item['total_amt'], item_description = item['description'], item_disc_val =  item['dis_amt'], userid = userid)
        item_result = db.session.execute(sadd_item)
        db.session.commit()  
    return jsonify({"data":quote_result.inserted_primary_key[0]}) 


@api8.route('/add_invoice_values', methods=['POST']) 
def add_invoice_create(): 
    data = request.get_json()
    userid = int(data['userid'])
    get_client = Clients.query.get(int(str(data['o_clientid'])))
    get_client_coa = ChartOfAccount.query.filter(and_(ChartOfAccount.id == int(str(get_client.chart_accnt)),ChartOfAccount.userid == userid)).one()
    sadd_invoice = insert(TblInvoice).values(client_id= str(data['o_clientid']).strip().lower(), warehouse_id=data['o_warehouse'], invoice_num = data['o_invoiceNm'], invoice_refer = data['o_invoiceRef'], invoice_date = data['a_OInvDate'], invoice_due_date = data['o_OInvDueDate'], invoice_tax = data['o_OInvTax'], invoice_discount = data['o_OInvDisc'], total_tax = data['o_OInvTotax'], total_discount = data['o_OInvDist'], shipping =  data['o_OInvShipp'], grand_total =  data['o_OInvGrnTotal'], invoice_items =  len(data['o_items']),invoice_note =  data['o_OInvNote'],payment_terms =  data['o_payment_due'],payment_currency =  data['o_payment_curr'],invoice_status =  'pending', userid = userid)
    return_result = db.session.execute(sadd_invoice)
    ledger_balance = - (int(get_client.networth) + (int(round(float(data['o_OInvGrnTotal'])))))
    add_invoice_led = insert(Ledger2).values(ledger_account_no =get_client.chart_accnt, ledger_party_name= get_client.client_name, ledger_gen_date= data['a_OInvDate'], ledger_debit_amount = (int(round(float(data['o_OInvGrnTotal'])))), ledger_credit_amount= 0, ledger_bill=data['o_invoiceNm'],ledger_method= 'cash', ledger_balance= -(int(round(float(data['o_OInvGrnTotal'])))), ledger_type='client', ledger_descp="Customer Payment Towards Invoice No: " +data['o_invoiceNm'], pay_start="started", userid = userid)
    add_invoice_led_result = db.session.execute(add_invoice_led)
    get_client_coa.networth = ledger_balance
    get_client.networth = ledger_balance
    db.session.flush()
    db.session.commit()
    for item in data['o_items']:
        sadd_item = insert(InvoiceItems).values(item_name= str(item['name']).strip().lower(), item_product=item['product'], item_invoice = return_result.inserted_primary_key[0], item_qnty = item['qty'], item_rate = item['rate'], item_per_tax = item['item_tax'], item_tax = item['tax_amt'], item_disc = item['item_discount'], item_amount = item['total_amt'], item_description = item['description'], item_disc_val =  item['dis_amt'], userid = userid)
        item_result = db.session.execute(sadd_item)
        product_value = TblProduct.query.filter(TblProduct.id == int(item['product'])).first()
        total_stk = int(product_value.product_stock)
        product_value.product_stock = total_stk - int(item['qty'])
        db.session.flush()
        db.session.commit()  
    return jsonify({"data":return_result.inserted_primary_key[0]})  

@api8.route('/add_recc_invoice_values', methods=['POST']) 
def add_recc_invoice_create(): 
    data = request.get_json()
    userid = int(data['userid'])
    sadd_recc_invoice = insert(TblReccInvoice).values(client_id= str(data['o_clientid']).strip().lower(), warehouse_id=data['o_warehouse'], invoice_num = data['o_invoiceNm'], invoice_refer = data['o_invoiceRef'], invoice_date = data['a_OInvDate'], invoice_due_date = data['o_OInvDueDate'], invoice_tax = data['o_OInvTax'], invoice_discount = data['o_OInvDisc'], total_tax = data['o_OInvTotax'], total_discount = data['o_OInvDist'], shipping =  data['o_OInvShipp'], grand_total =  data['o_OInvGrnTotal'], invoice_items =  len(data['o_items']),invoice_note =  data['o_OInvNote'],payment_terms =  data['o_payment_due'],payment_currency =  data['o_payment_curr'],recc_period= data['o_recc_period'],invoice_status =  'pending', userid = userid)
    recc_inv_result = db.session.execute(sadd_recc_invoice)
    db.session.commit()
    for item in data['o_items']:
        sadd_item = insert(ReccItems).values(item_name= str(item['name']).strip().lower(), item_product=item['product'], item_invoice = recc_inv_result.inserted_primary_key[0], item_qnty = item['qty'], item_rate = item['rate'], item_per_tax = item['item_tax'], item_tax = item['tax_amt'], item_disc = item['item_discount'], item_amount = item['total_amt'], item_description = item['description'], item_disc_val =  item['dis_amt'], userid = userid)
        item_result = db.session.execute(sadd_item)
        product_value = TblProduct.query.filter(TblProduct.id == int(item['product'])).first()
        total_stk = int(product_value.product_stock)
        product_value.product_stock = total_stk - int(item['qty'])
        db.session.flush()
        db.session.commit()  
    return jsonify({"data":recc_inv_result.inserted_primary_key[0]})  

    
@api8.route('/add_manifest_goods', methods=['POST']) 
def manifesto_create(): 
    data = request.get_json()
    party_amt = int(data['G_BFreight'])
    comm_amt = int(data['G_BComm'])
    userid = int(data['userid'])
    sadd_goods_manifest = insert(GoodsNlc).values(bilty_no= data['G_BiltyNo'], b_date= data['G_BiltyDate'], vehicle = data['G_BVehicle'], loading_point = data['G_loading'],unloading_point = data['G_unloading'], parties= data['G_Bparty'],weight= data['G_Bweight'],per_ton= data['G_BPerTon'], freight= party_amt,wrt_4_per_freight=data['G_BWRT4Freight'], commission= comm_amt, other_cahrges= data['G_BOtherCharges'], vehicle_freight= data['G_BvehicleFreight'], vehicle_balance= data['G_BvehicleBal'], advance_to_vehicle= data['G_BvehicleAdvance'],bill_status = 'pending',paid_by=data['G_paid_Method'], goods_gst=data['Goods_GST'], userid = userid,  tax_per=data['per_wft'],  comm_per=data['per_comm'])
    goods_manif_result = db.session.execute(sadd_goods_manifest)
    get_party = Party.query.get(int(str(data['G_Bparty'])))
    get_vehicle = Vehicles.query.get(int(str(data['G_BVehicle'])))
    get_vehicle_chart = ChartOfAccount.query.filter(ChartOfAccount.id == int(str(get_vehicle.chart_accnt))).one()
    get_party_chart = ChartOfAccount.query.filter(ChartOfAccount.id == int(str(get_party.chart_accnt))).one()
    accnt_sub_type = AccountSubTypes.query.filter(AccountSubTypes.sub_type_name == "Commission Income").one()
    get_commission = ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_name == str("commission").strip().lower(), ChartOfAccount.accnt_type  ==accnt_sub_type.id, ChartOfAccount.account_mode == 'commission',ChartOfAccount.userid == userid)).one()
    vehicle_advance = 0
    if(str(data['G_BvehicleAdvance']).strip() != ''):
        vehicle_advance = str(data['G_BvehicleAdvance']).strip()
    if (int(vehicle_advance) != 0) :
        ledger_balance = int(get_vehicle_chart.networth) + (int(data['G_BvehicleFreight']))
        cash_balance = ledger_balance - int(data['G_BvehicleAdvance'])
        add_vehicle_led = insert(Ledger).values(ledger_account_no =get_vehicle.chart_accnt, ledger_party_name= get_vehicle.vehicle_num, ledger_gen_date= data['G_BiltyDate'], ledger_debit_amount = 0, ledger_credit_amount= data['G_BvehicleFreight'], ledger_bill=data['G_BiltyNo'],ledger_method= data['G_paid_Method'], ledger_balance= data['G_BvehicleFreight'], ledger_type='vehicle', ledger_descp="Payment Towards Bill No: " +data['G_BiltyNo'],pay_start="started", userid = userid)
        add_vehicle_led_result = db.session.execute(add_vehicle_led)
        add_cash_veh_adv = insert(Ledger).values(ledger_account_no =get_vehicle.chart_accnt, ledger_party_name= get_vehicle.vehicle_num, ledger_gen_date= data['G_BiltyDate'], ledger_debit_amount = str(data['G_BvehicleAdvance']).strip(), ledger_credit_amount= 0, ledger_bill=data['G_BiltyNo'],ledger_method= data['G_paid_Method'], ledger_balance= int(int(str(data['G_BvehicleFreight']).strip()) - int(str(data['G_BvehicleAdvance']).strip())), ledger_type='vehicle', ledger_descp="Payment Towards Bill No: " +data['G_BiltyNo'], userid = userid)    
        add_cash_veh_adv_result = db.session.execute(add_cash_veh_adv)
        get_vehicle_chart.networth = cash_balance
        get_vehicle.net_worth = cash_balance
    else:
        ledger_balance = int(get_vehicle_chart.networth) + (int(data['G_BvehicleFreight']))
        add_vehicle_led = insert(Ledger).values(ledger_account_no =get_vehicle.chart_accnt, ledger_party_name= get_vehicle.vehicle_num, ledger_gen_date= data['G_BiltyDate'], ledger_debit_amount = 0, ledger_credit_amount= data['G_BvehicleFreight'], ledger_bill=data['G_BiltyNo'],ledger_method= data['G_paid_Method'], ledger_balance= data['G_BvehicleFreight'], ledger_type='vehicle', ledger_descp="Vehicle Payment Towards Bill No: " +data['G_BiltyNo'], pay_start="started", userid = userid)
        add_vehicle_led_result = db.session.execute(add_vehicle_led)
        get_vehicle_chart.networth = ledger_balance
        get_vehicle.net_worth = ledger_balance
    add_party_led = insert(Ledger).values(ledger_account_no =get_party.chart_accnt, ledger_party_name= get_party.english_name, ledger_gen_date= data['G_BiltyDate'], ledger_debit_amount = party_amt, ledger_credit_amount= 0, ledger_bill=data['G_BiltyNo'],ledger_method= data['G_paid_Method'], ledger_balance=  (-party_amt), ledger_type='party', ledger_descp="Party Payment Towards Bill No: " +data['G_BiltyNo'], pay_start="started", userid = userid)
    add_party_led_result = db.session.execute(add_party_led)
    get_party_chart.networth = int(get_party_chart.networth) + (-int(party_amt))
    get_party.net_amount = int(get_party.net_amount) + (-int(party_amt))
    add_commi_led = insert(Ledger).values(ledger_account_no =get_commission.id, ledger_party_name= get_party.english_name, ledger_gen_date= data['G_BiltyDate'], ledger_debit_amount = 0, ledger_credit_amount= comm_amt, ledger_bill=data['G_BiltyNo'],ledger_method= data['G_paid_Method'], ledger_balance= int(get_commission.networth) + (comm_amt), ledger_type='commission', ledger_descp="Commission Towards Bill No: " +data['G_BiltyNo'], pay_start="started", userid = userid)
    add_commi_led_result = db.session.execute(add_commi_led)
    get_commission.networth = int(get_commission.networth) + (int(comm_amt))
    db.session.flush()
    db.session.commit()
    return jsonify({"data":goods_manif_result.inserted_primary_key[0]})


@api8.route('/add_manifest_oils', methods=['POST']) 
def manifesto_oil_create(): 
    data = request.get_json()
    party_amt = int(data['G_O_BFreight']) 
    comm_amt = int(data['G_O_BComm'])
    userid = int(data['userid'])
    sadd_oil_manifest = insert(OilPso).values(bilty_no= data['G_OBiltyNo'], b_date= data['G_OBiltyDate'], vehicle = data['G_OBVehicle'], loading_point = data['G_O_loading'],unloading_point = data['G_unO_loading'], parties= data['G_O_Bparty'],material= data['G_O_material'],quantity= data['G_O_Bweight'],per_ton= data['G_O_BPerTon'], freight= party_amt,wrt_4_per_freight=data['G_O_BWRT4Freight'], commission= comm_amt, other_cahrges= data['G_O_BOtherCharges'], vehicle_freight= data['G_O_BVehicleFreight'], vehicle_balance= data['G_O_BVehicleBal'], advance_to_vehicle= data['G_O_BVehicleAdvance'],bill_status = 'pending',paid_by=data['G_O_paid_Method'], oils_gst=data['G_O_Oils_GST'], userid = userid, tax_per=data['per_wft'], comm_per = data['per_comm'] )
    oil_manif_result = db.session.execute(sadd_oil_manifest)
    get_party = Party.query.get(int(str(data['G_O_Bparty'])))
    get_vehicle = Vehicles.query.get(int(str(data['G_OBVehicle'])))
    get_vehicle_chart = ChartOfAccount.query.filter(ChartOfAccount.id == int(str(get_vehicle.chart_accnt))).one()
    get_party_chart = ChartOfAccount.query.filter(ChartOfAccount.id == int(str(get_party.chart_accnt))).one()
    accnt_sub_type = AccountSubTypes.query.filter(AccountSubTypes.sub_type_name == "Commission Income").one()
    get_commission = ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_name == str("commission").strip().lower(), ChartOfAccount.accnt_type  ==accnt_sub_type.id, ChartOfAccount.account_mode == 'commission', ChartOfAccount.userid == userid)).one()
    vehicle_advance = 0
    if(str(data['G_O_BVehicleAdvance']).strip() != ''):
        vehicle_advance = str(data['G_O_BVehicleAdvance']).strip()
    if (int(vehicle_advance) != 0) :
        ledger_balance = int(get_vehicle_chart.networth) + (int(data['G_O_BVehicleFreight']))
        cash_balance = ledger_balance - int(data['G_O_BVehicleAdvance'])
        add_vehicle_led = insert(Ledger).values(ledger_account_no =get_vehicle.chart_accnt, ledger_party_name= get_vehicle.vehicle_num, ledger_gen_date= data['G_OBiltyDate'], ledger_debit_amount =0 , ledger_credit_amount= data['G_O_BVehicleFreight'], ledger_bill=data['G_OBiltyNo'],ledger_method= data['G_O_paid_Method'], ledger_balance= data['G_O_BVehicleFreight'], ledger_type='vehicle', ledger_descp="Payment Towards Bill No: " +data['G_OBiltyNo'], pay_start="started", userid = userid)
        add_vehicle_led_result = db.session.execute(add_vehicle_led)
        add_cash_veh_adv =insert(Ledger).values(ledger_account_no =get_vehicle.chart_accnt, ledger_party_name= get_vehicle.vehicle_num, ledger_gen_date= data['G_OBiltyDate'], ledger_debit_amount = str(data['G_O_BVehicleAdvance']).strip(), ledger_credit_amount= 0 , ledger_bill=data['G_OBiltyNo'],ledger_method= data['G_O_paid_Method'], ledger_balance= int(int(str(data['G_O_BVehicleFreight']).strip()) - int(str(data['G_O_BVehicleAdvance']).strip())), ledger_type='vehicle', ledger_descp="Payment Towards Bill No: " +data['G_OBiltyNo'], userid = userid)     
        add_cash_veh_adv_result = db.session.execute(add_cash_veh_adv)
        get_vehicle_chart.networth = cash_balance
        get_vehicle.net_worth = cash_balance
    else:
        ledger_balance = int(get_vehicle_chart.networth) + (int(data['G_O_BVehicleFreight']))
        add_vehicle_led = insert(Ledger).values(ledger_account_no =get_vehicle.chart_accnt, ledger_party_name= get_vehicle.vehicle_num, ledger_gen_date= data['G_OBiltyDate'], ledger_debit_amount = 0, ledger_credit_amount= data['G_O_BVehicleFreight'], ledger_bill=data['G_OBiltyNo'],ledger_method= data['G_O_paid_Method'], ledger_balance= data['G_O_BVehicleFreight'], ledger_type='vehicle', ledger_descp="Vehicle Payment Towards Bill No: " +data['G_OBiltyNo'], pay_start="started", userid = userid)
        add_vehicle_led_result = db.session.execute(add_vehicle_led)
        get_vehicle_chart.networth = ledger_balance
        get_vehicle.net_worth = ledger_balance
    add_party_led = insert(Ledger).values(ledger_account_no =get_party.chart_accnt, ledger_party_name= get_party.english_name, ledger_gen_date= data['G_OBiltyDate'], ledger_debit_amount = party_amt, ledger_credit_amount= 0, ledger_bill=data['G_OBiltyNo'],ledger_method= data['G_O_paid_Method'], ledger_balance= (-party_amt), ledger_type='party', ledger_descp="Party Payment Towards Bill No: " +data['G_OBiltyNo'], pay_start="started", userid = userid)
    add_party_led_result = db.session.execute(add_party_led)
    get_party_chart.networth = int(get_party_chart.networth) + (-int(party_amt))
    get_party.net_amount = int(get_party.net_amount) + (-int(party_amt))
    add_commi_led = insert(Ledger).values(ledger_account_no =get_commission.id, ledger_party_name= get_party.english_name, ledger_gen_date= data['G_OBiltyDate'], ledger_debit_amount = 0, ledger_credit_amount= comm_amt, ledger_bill=data['G_OBiltyNo'],ledger_method= data['G_O_paid_Method'], ledger_balance= int(get_commission.networth) + (comm_amt), ledger_type='commission', ledger_descp="Commission Towards Bill No: " +data['G_OBiltyNo'], pay_start="started", userid = userid)
    add_commi_led_result = db.session.execute(add_commi_led)
    get_commission.networth = int(get_commission.networth) + (int(comm_amt))
    db.session.flush()
    db.session.commit()
    RefreshCOA_Customer.refresh_COA_Vehicle(str(get_vehicle.chart_accnt))
    RefreshCOA_Customer.refresh_COA_Comm(userid)
    RefreshCOA_Customer.refresh_COA_Party(str(get_party.chart_accnt))
    return jsonify({"data":oil_manif_result.inserted_primary_key[0]})

@api8.route('/add_party_bill', methods=['POST']) 
def party_bill_create(): 
    data = request.get_json()
    bilties = (data['pb_select_bilty'])
    userid = int(data['userid'])
    if(str(data['pb_type']).strip() == "goods"):
        for bilty in str(data['pb_select_bilty']).split(","):
            manifest_goods_value = GoodsNlc.query.filter(GoodsNlc.id == int(bilty)).first()
            manifest_goods_value.bill_status = data['pb_status']
    elif(str(data['pb_type']).strip() == "oil"):
        for bilty in str(data['pb_select_bilty']).split(","):
            manifest_oil_value = OilPso.query.filter(OilPso.id == int(bilty)).first()
            manifest_oil_value.bill_status = data['pb_status']   
    get_party = Party.query.get(int(str(data['pb_partyid'])))
    sadd_party_bill = insert(PartyBill).values(invoice_no= data['pb_invoiceNo'], invoice_date= data['pb_issueDate'], invoice_due_date = data['pb_dueDate'],party_id = data['pb_partyid'], party_name= str(data['pb_invoiceParty']).strip().lower(),invoice_sub_total= 0,invoice_discount=0, invoice_tx= 0,invoice_balance=data['pb_subTotal'], invoice_status= data['pb_status'], invoice_bilties= str(data['pb_select_bilty']), invoice_type =data['pb_type'],invoice_sales_person = data['pb_salesName'],invoice_thank_message = data['pb_thankMssg'], userid = userid)
    party_bill_result = db.session.execute(sadd_party_bill)
    sadd_ledger_cash = insert(Ledger).values(ledger_account_no=get_party.chart_accnt,ledger_party_name=str(data['pb_invoiceParty']).strip().lower(), ledger_gen_date=data['pb_issueDate'],ledger_debit_amount=data['pb_subTotal'], ledger_credit_amount=0, ledger_bill=data['pb_invoiceNo'],ledger_method='Cash', ledger_balance=data['pb_subTotal'],ledger_bill_no=data['pb_invoiceNo'],ledger_type='party',ledger_descp="Bill generated towards the invoice number " + data['pb_invoiceNo'], pay_start="started", userid = userid)
    sub_ledger_cash_result = db.session.execute(sadd_ledger_cash)
    db.session.flush()
    db.session.commit()
    RefreshCOA_Customer.refresh_COA_Party(str(get_party.chart_accnt))
    return jsonify({"data":party_bill_result.inserted_primary_key[0]})
