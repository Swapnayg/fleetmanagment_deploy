from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from accountSubTypes import AccountSubTypes
from accountTypes import AccountTypes
from catgeory import Categories
from chartofAccount import ChartOfAccount
from citysetup import CitySetup
from clients import Clients
from clnStkRtnItems import ClientReturnItems
from clnstkrtn import TblClnStockRtn
from goodsnlc import GoodsNlc
from invoiceItems import InvoiceItems
from ledger import Ledger
from ledger2 import Ledger2
from modeofpayment import ModeOfPayment
from oilpso import OilPso
from party import Party
from partybill import PartyBill
from productctegory import ProductCategory
from products import Products
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
from units import Units
from warehouse import Warehouse
from extensions import db
from sqlalchemy import and_, insert, text
from api.refreshcoacustomer import RefreshCOA_Customer

api12 = Blueprint('api12', __name__)

@api12.route('/update_quote_invoice', methods=['POST']) 
def update_quote_inv_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    quote_value = TblQuote.query.filter(TblQuote.id == int(data['o_quoteId'])).first()
    del_quote_items_data = QuoteItems.__table__.delete().where(QuoteItems.item_invoice == int(data['o_quoteId']))
    db.session.execute(del_quote_items_data)
    db.session.commit()
    quote_value.quote_refer = str(data['o_invoiceRef'])
    quote_value.quote_due_date = str(data['o_OInvDueDate'])
    quote_value.quote_tax = str(data['o_OInvTax'])
    quote_value.quote_discount = str(data['o_OInvDisc'])
    quote_value.total_tax = str(data['o_OInvTotax'])
    quote_value.total_discount = str(data['o_OInvDist'])
    quote_value.shipping = str(data['o_OInvShipp'])
    quote_value.grand_total = str(data['o_OInvGrnTotal'])
    quote_value.quote_items = len(data['o_items'])
    quote_value.quote_note = str(data['o_OInvNote'])
    quote_value.payment_currency = str(data['o_payment_curr'])
    quote_value.payment_terms = str(data['o_payment_due'])
    db.session.flush()
    db.session.commit()
    for item in data['o_items']:
        sadd_item = insert(QuoteItems).values(item_name= str(item['name']).strip().lower(), item_product=item['product'], item_invoice = int(data['o_quoteId']), item_qnty = item['qty'], item_rate = item['rate'], item_per_tax = item['item_tax'], item_tax = item['tax_amt'], item_disc = item['item_discount'], item_amount = item['total_amt'], item_description = item['description'], item_disc_val =  item['dis_amt'], userid = userid)
        item_result = db.session.execute(sadd_item)
        db.session.commit()  
    return jsonify({"data":"updated"})

@api12.route('/update_invoice_values', methods=['POST']) 
def update_invoice_values_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    inv_value = TblInvoice.query.filter(TblInvoice.id == int(data['o_invoiceId'])).first()
    inv_items = InvoiceItems.query.filter(InvoiceItems.item_invoice == int(data['o_invoiceId'])).all()
    for item in inv_items:
        product_value = TblProduct.query.filter(TblProduct.id == int(item.item_product)).first()
        item_stk = int(item.item_qnty)
        prd_stk = int(product_value.product_stock)
        product_value.product_stock = item_stk + prd_stk
        db.session.flush()
        db.session.commit()
    del_inv_items_data = InvoiceItems.__table__.delete().where(InvoiceItems.item_invoice == int(data['o_invoiceId']))
    db.session.execute(del_inv_items_data)
    db.session.commit()
    inv_value.invoice_refer = str(data['o_invoiceRef'])
    inv_value.invoice_due_date = str(data['o_OInvDueDate'])
    inv_value.invoice_tax = str(data['o_OInvTax'])
    inv_value.invoice_discount = str(data['o_OInvDisc'])
    inv_value.total_tax = str(data['o_OInvTotax'])
    inv_value.total_discount = str(data['o_OInvDist'])
    inv_value.shipping = str(data['o_OInvShipp'])
    inv_value.grand_total = str(data['o_OInvGrnTotal'])
    inv_value.invoice_items = len(data['o_items'])
    inv_value.invoice_note = str(data['o_OInvNote'])
    inv_value.payment_currency = str(data['o_payment_curr'])
    inv_value.payment_terms = str(data['o_payment_due'])
    db.session.flush()
    db.session.commit()
    ledger_invoice = Ledger2.query.filter(and_(Ledger2.ledger_gen_date == inv_value.invoice_date,Ledger2.ledger_bill == inv_value.invoice_num ,Ledger2.ledger_type == "client",Ledger2.pay_start == "started" )).one()
    ledger_invoice.ledger_debit_amount = (int(round(float(data['o_OInvGrnTotal']))))
    ledger_invoice.ledger_balance =  -(int(round(float(data['o_OInvGrnTotal']))))
    db.session.flush()
    db.session.commit()
    client_led_bal = 0
    manif_ledg = Ledger2.query.filter(and_(Ledger2.ledger_bill == str(inv_value.invoice_num).strip(),Ledger2.ledger_type == str("client").strip())).order_by(Ledger2.id.asc()).all()
    for man in manif_ledg:
        client_led_bal +=  int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
        man.ledger_balance = client_led_bal
        db.session.flush()
        db.session.commit()
    for item in data['o_items']:
        sadd_item = insert(InvoiceItems).values(item_name= str(item['name']).strip().lower(), item_product=item['product'], item_invoice = int(data['o_invoiceId']), item_qnty = item['qty'], item_rate = item['rate'], item_per_tax = item['item_tax'], item_tax = item['tax_amt'], item_disc = item['item_discount'], item_amount = item['total_amt'], item_description = item['description'], item_disc_val =  item['dis_amt'], userid = userid)
        item_result = db.session.execute(sadd_item)
        product_value = TblProduct.query.filter(TblProduct.id == int(item['product'])).first()
        total_stk = int(product_value.product_stock)
        product_value.product_stock = total_stk - int(item['qty'])
        db.session.flush()
        db.session.commit()
    get_client = Clients.query.get(int(inv_value.client_id))
    RefreshCOA_Customer.refresh_COA_Customer(get_client.chart_accnt)
    return jsonify({"data":"updated"})


@api12.route('/update_order_values', methods=['POST']) 
def update_order_values_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    ord_value = TblOrder.query.filter(TblOrder.id == int(data['o_orderId'])).first()
    ord_items = PurchItems.query.filter(PurchItems.item_invoice == int(data['o_orderId'])).all()
    for item in ord_items:
        product_value = TblProduct.query.filter(TblProduct.id == int(item.item_product)).first()
        item_stk = int(item.item_qnty)
        prd_stk = int(product_value.product_stock)
        product_value.product_stock = prd_stk - item_stk
        db.session.flush()
        db.session.commit()
    del_order_items_data = PurchItems.__table__.delete().where(PurchItems.item_invoice == int(data['o_orderId']))
    db.session.execute(del_order_items_data)
    db.session.commit()
    ord_value.order_refer = str(data['o_invoiceRef'])
    ord_value.order_due_date = str(data['o_OInvDueDate'])
    ord_value.order_tax = str(data['o_OInvTax'])
    ord_value.order_discount = str(data['o_OInvDisc'])
    ord_value.total_tax = str(data['o_OInvTotax'])
    ord_value.total_discount = str(data['o_OInvDist'])
    ord_value.shipping = str(data['o_OInvShipp'])
    ord_value.grand_total = str(data['o_OInvGrnTotal'])
    ord_value.order_items = len(data['o_items'])
    ord_value.order_note = str(data['o_OInvNote'])
    ord_value.payment_terms = str(data['o_payment_due'])
    db.session.flush()
    db.session.commit()
    ledger_invoice = Ledger2.query.filter(and_( Ledger2.ledger_gen_date == ord_value.order_date,Ledger2.ledger_bill == ord_value.order_num ,Ledger2.ledger_type == "supplier",Ledger2.pay_start == "started")).one()
    ledger_invoice.ledger_credit_amount = (int(round(float(data['o_OInvGrnTotal']))))
    ledger_invoice.ledger_balance =  (int(round(float(data['o_OInvGrnTotal']))))
    db.session.flush()
    db.session.commit()
    client_led_bal = 0
    manif_ledg = Ledger2.query.filter(and_(Ledger2.ledger_bill == str(ord_value.order_num).strip(),Ledger2.ledger_type == str("supplier").strip())).order_by(Ledger2.id.asc()).all()
    for man in manif_ledg:
        client_led_bal +=  int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
        man.ledger_balance = client_led_bal
        db.session.flush()
        db.session.commit()
    for item in data['o_items']:
        sadd_item = insert(PurchItems).values(item_name= str(item['name']).strip().lower(), item_product=item['product'], item_invoice = int(data['o_orderId']), item_qnty = item['qty'], item_rate = item['rate'], item_per_tax = item['item_tax'], item_tax = item['tax_amt'], item_disc = item['item_discount'], item_amount = item['total_amt'], item_description = item['description'], item_disc_val =  item['dis_amt'], userid = userid)
        item_result = db.session.execute(sadd_item)
        product_value = TblProduct.query.filter(TblProduct.id == int(item['product'])).first()
        total_stk = int(product_value.product_stock)
        product_value.product_stock = total_stk + int(item['qty'])
        db.session.flush()
        db.session.commit() 
    get_suppl = Supplier.query.get(int(ord_value.supplier_id))
    RefreshCOA_Customer.refresh_COA_Supplier(get_suppl.chart_accnt)
    return jsonify({"data":"updated"})


@api12.route('/update_stk_return_values', methods=['POST']) 
def update_stk_ret_values_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    if(str(data['o_type']).strip()== "Supplier"):
        stk_value = TblStockRtn.query.filter(TblStockRtn.id == int(data['o_stockId'])).first()
        stk_items = ReturnItems.query.filter(ReturnItems.item_invoice == int(data['o_stockId'])).all()
        for item in stk_items:
            product_value = TblProduct.query.filter(TblProduct.id == int(item.item_product)).first()
            item_stk = int(item.item_qnty)
            prd_stk = int(product_value.product_stock)
            product_value.product_stock = prd_stk + item_stk
            db.session.flush()
            db.session.commit()
        del_stock_items_data = ReturnItems.__table__.delete().where(ReturnItems.item_invoice == int(data['o_stockId']))
        db.session.execute(del_stock_items_data)
        db.session.commit()
        stk_value.warehouse_id = str(data['o_warehouse'])
        stk_value.stock_refer = str(data['o_invoiceRef'])
        stk_value.stock_due_date = str(data['o_OInvDueDate'])
        stk_value.stock_tax = str(data['o_OInvTax'])
        stk_value.stock_discount = str(data['o_OInvDisc'])
        stk_value.total_tax = str(data['o_OInvTotax'])
        stk_value.total_discount = str(data['o_OInvDist'])
        stk_value.shipping = str(data['o_OInvShipp'])
        stk_value.grand_total = str(data['o_OInvGrnTotal'])
        stk_value.stock_items = len(data['o_items'])
        stk_value.stock_note = str(data['o_OInvNote'])
        stk_value.payment_terms = str(data['o_payment_due'])
        db.session.flush()
        db.session.commit()
        ledger_invoice = Ledger2.query.filter(and_( Ledger2.ledger_gen_date == str(stk_value.stock_date).strip(),Ledger2.ledger_bill == str(stk_value.stock_num).strip() ,Ledger2.ledger_type == "supplier",Ledger2.pay_start == "started")).one()
        ledger_invoice.ledger_debit_amount = (int(round(float(data['o_OInvGrnTotal']))))
        ledger_invoice.ledger_balance =  -(int(round(float(data['o_OInvGrnTotal']))))
        db.session.flush()
        db.session.commit()
        client_led_bal = 0
        manif_ledg = Ledger2.query.filter(and_(Ledger2.ledger_bill == str(stk_value.stock_num).strip(),Ledger2.ledger_type == str("supplier").strip())).order_by(Ledger2.id.asc()).all()
        for man in manif_ledg:
            client_led_bal +=  int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
            man.ledger_balance = client_led_bal
            db.session.flush()
            db.session.commit()
        for item in data['o_items']:
            sadd_item = insert(ReturnItems).values(item_name= str(item['name']).strip().lower(), item_product=item['product'], item_invoice = int(data['o_stockId']), item_qnty = item['qty'], item_rate = item['rate'], item_per_tax = item['item_tax'], item_tax = item['tax_amt'], item_disc = item['item_discount'], item_amount = item['total_amt'], item_description = item['description'], item_disc_val =  item['dis_amt'], userid = userid)
            item_result = db.session.execute(sadd_item)
            product_value = TblProduct.query.filter(TblProduct.id == int(item['product'])).first()
            total_stk = int(product_value.product_stock)
            product_value.product_stock = total_stk - int(item['qty'])
            db.session.flush()
            db.session.commit()
        get_suppl = Supplier.query.get(int(stk_value.supplier_id))
        RefreshCOA_Customer.refresh_COA_Supplier(get_suppl.chart_accnt)
    elif(str(data['o_type']).strip()== "Customer"):
        stk_value = TblClnStockRtn.query.filter(TblClnStockRtn.id == int(data['o_stockId'])).first()
        stk_items = ClientReturnItems.query.filter(ClientReturnItems.item_invoice == int(data['o_stockId'])).all()
        for item in stk_items:
            product_value = TblProduct.query.filter(TblProduct.id == int(item.item_product)).first()
            item_stk = int(item.item_qnty)
            prd_stk = int(product_value.product_stock)
            product_value.product_stock = prd_stk - item_stk
            db.session.flush()
            db.session.commit()
        del_stock_items_data = ClientReturnItems.__table__.delete().where(ClientReturnItems.item_invoice == int(data['o_stockId']))
        db.session.execute(del_stock_items_data)
        db.session.commit()
        stk_value.warehouse_id = str(data['o_warehouse'])
        stk_value.stock_refer = str(data['o_invoiceRef'])
        stk_value.stock_due_date = str(data['o_OInvDueDate'])
        stk_value.stock_tax = str(data['o_OInvTax'])
        stk_value.stock_discount = str(data['o_OInvDisc'])
        stk_value.total_tax = str(data['o_OInvTotax'])
        stk_value.total_discount = str(data['o_OInvDist'])
        stk_value.shipping = str(data['o_OInvShipp'])
        stk_value.grand_total = str(data['o_OInvGrnTotal'])
        stk_value.stock_items = len(data['o_items'])
        stk_value.stock_note = str(data['o_OInvNote'])
        stk_value.payment_terms = str(data['o_payment_due'])
        db.session.flush()
        db.session.commit()
        ledger_invoice = Ledger2.query.filter(and_( Ledger2.ledger_gen_date == stk_value.stock_date,Ledger2.ledger_bill == stk_value.stock_num ,Ledger2.ledger_type == "client",Ledger2.pay_start == "started")).one()
        ledger_invoice.ledger_credit_amount = (int(round(float(data['o_OInvGrnTotal']))))
        ledger_invoice.ledger_balance =  (int(round(float(data['o_OInvGrnTotal']))))
        db.session.flush()
        db.session.commit()
        client_led_bal = 0
        manif_ledg = Ledger2.query.filter(and_(Ledger2.ledger_bill == str(stk_value.stock_num).strip(),Ledger2.ledger_type == str("supplier").strip())).order_by(Ledger2.id.asc()).all()
        for man in manif_ledg:
            client_led_bal +=  int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
            man.ledger_balance = client_led_bal
            db.session.flush()
            db.session.commit()
        for item in data['o_items']:
            sadd_item = insert(ClientReturnItems).values(item_name= str(item['name']).strip().lower(), item_product=item['product'], item_invoice = int(data['o_stockId']), item_qnty = item['qty'], item_rate = item['rate'], item_per_tax = item['item_tax'], item_tax = item['tax_amt'], item_disc = item['item_discount'], item_amount = item['total_amt'], item_description = item['description'], item_disc_val =  item['dis_amt'], userid = userid)
            item_result = db.session.execute(sadd_item)
            product_value = TblProduct.query.filter(TblProduct.id == int(item['product'])).first()
            total_stk = int(product_value.product_stock)
            product_value.product_stock = total_stk + int(item['qty'])
            db.session.flush()
            db.session.commit()
            db.session.commit()
        get_client = Clients.query.get(int(stk_value.client_id))
        RefreshCOA_Customer.refresh_COA_Customer(get_client.chart_accnt)
    return jsonify({"data":"updated"})

@api12.route('/update_account_types_setup', methods=['POST']) 
def accnt_types_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    accnt_type_value = AccountTypes.query.filter(AccountTypes.id == int(data['a_accnt_id'])).first()
    accnt_type_value.type_name = str(data['a_accnt_name'])
    accnt_type_value.type_status = str(data['a_accnt_status'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})


@api12.route('/update_account_sub_types_setup', methods=['POST']) 
def accnt_sub_types_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    accnt_sub_type_value = AccountSubTypes.query.filter(AccountSubTypes.id == int(data['a_accnt_id'])).first()
    accnt_sub_type_value.type_name_id = str(data['a_accnt_name'])
    accnt_sub_type_value.sub_type_name = str(data['a_sub_accnt_name'])
    accnt_sub_type_value.type_status = str(data['a_accnt_status'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})

@api12.route('/update_chart_of_account_setup', methods=['POST']) 
def chart_of_accnt_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    chart_of_accnt_value = ChartOfAccount.query.filter(ChartOfAccount.id == int(data['a_acctId'])).first()
    chart_of_accnt_value.accnt_name = str(data['a_acctName'])
    chart_of_accnt_value.accnt_code = str(data['a_acctcode'])
    chart_of_accnt_value.accnt_type = str(data['a_accttype'])
    chart_of_accnt_value.accnt_status = str(data['a_acctstatus'])
    chart_of_accnt_value.accnt_description = str(data['a_acctdescp'])
    db.session.flush()
    db.session.commit()
    return jsonify({"data":"updated"})

@api12.route('/update_cashbook_values', methods=['POST']) 
def update_cashbook_set_update(): 
    data = request.get_json()
    userid = int(data['userid'])
    ledger_balance = 0
    get_chart_accnt = ChartOfAccount.query.filter(ChartOfAccount.id == int(str(data['ac_sel_id']))).one()
    last_balance = 0
    if(data['led_Type'] == "ledger"):
        ledger_value = Ledger.query.filter(Ledger.id == int(data['ac_cashId'])).first()
        if(int(ledger_value.ledger_debit_amount) == 0):
            last_balance = int(ledger_value.ledger_balance) - int(ledger_value.ledger_credit_amount)
        elif(int(ledger_value.ledger_credit_amount) == 0):
            if(int(ledger_value.ledger_balance) < 0):
                last_balance = int(ledger_value.ledger_balance) + -int(ledger_value.ledger_debit_amount)
            else:
                last_balance = int(ledger_value.ledger_balance) + int(ledger_value.ledger_debit_amount)
        if(data['ac_acc_Type'] == "in"):
            ledger_balance = int(last_balance) + int(str(data['ac_amount']))
        elif(data['ac_acc_Type'] == "out"):
            ledger_balance = int(last_balance) - int(str(data['ac_amount']))
        ledger_value.ledger_account_no = str(data['ac_sel_id'])
        ledger_value.ledger_party_name = str(data['ac_sel_party'])
        ledger_value.ledger_gen_date = str(data['ac_cashbookDate'])
        ledger_value.ledger_debit_amount = str(data['ac_debit_amt'])
        ledger_value.ledger_credit_amount = str(data['ac_credit_amt'])
        ledger_value.ledger_bill = str(data['leg_inv_num'])
        ledger_value.ledger_method = str(data['ac_acc_Method'])
        ledger_value.ledger_balance = ledger_balance
        ledger_value.ledger_bill_no = str(data['ac_bill_no'])
        ledger_value.ledger_type = str(data['ac_party_type'])
        ledger_value.ledger_descp = str(data['ac_description'])
        db.session.flush()
        db.session.commit()
        party_led_bal = 0
        if(data['ac_party_type'] == "party" or data['ac_party_type'] == "vehicle" or data['ac_party_type'] == "commission"):
            manif_ledg = Ledger.query.filter(and_(Ledger.ledger_bill == str(data['leg_inv_num']).strip(),Ledger.ledger_type == str(data['ac_party_type']).strip())).order_by(Ledger.id.asc()).all()
            for man in manif_ledg:
                party_led_bal +=  int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
                man.ledger_balance = party_led_bal
                db.session.flush()
                db.session.commit()
        if(data['ac_party_type'] == "party"):
            RefreshCOA_Customer.refresh_COA_Party(str(data['ac_sel_id']))
        elif(data['ac_party_type'] == "vehicle"):
            RefreshCOA_Customer.refresh_COA_Vehicle(str(data['ac_sel_id']))
        elif(data['ac_party_type'] == "general"):
            RefreshCOA_Customer.refresh_COA_General(str(data['ac_sel_id']))
        elif(data['ac_party_type'] == "commission"):
            RefreshCOA_Customer.refresh_COA_Comm(userid)
    elif(data['led_Type'] == "ledger2"):
        ledger_value = Ledger2.query.filter(Ledger2.id == int(data['ac_cashId'])).first()
        if(int(ledger_value.ledger_debit_amount) == 0):
            last_balance = int(ledger_value.ledger_balance) - int(ledger_value.ledger_credit_amount)
        elif(int(ledger_value.ledger_credit_amount) == 0):
            if(int(ledger_value.ledger_balance) < 0):
                last_balance = int(ledger_value.ledger_balance) + -int(ledger_value.ledger_debit_amount)
            else:
                last_balance = int(ledger_value.ledger_balance) + int(ledger_value.ledger_debit_amount)
        if(data['ac_acc_Type'] == "in"):
            ledger_balance = int(last_balance) + int(str(data['ac_amount']))
        elif(data['ac_acc_Type'] == "out"):
            ledger_balance = int(last_balance) - int(str(data['ac_amount']))
        ledger_value.ledger_account_no = str(data['ac_sel_id'])
        ledger_value.ledger_party_name = str(data['ac_sel_party'])
        ledger_value.ledger_gen_date = str(data['ac_cashbookDate'])
        ledger_value.ledger_debit_amount = str(data['ac_debit_amt'])
        ledger_value.ledger_credit_amount = str(data['ac_credit_amt'])
        ledger_value.ledger_bill = str(data['leg_inv_num'])
        ledger_value.ledger_method = str(data['ac_acc_Method'])
        ledger_value.ledger_balance = ledger_balance
        ledger_value.ledger_bill_no = str(data['ac_bill_no'])
        ledger_value.ledger_type = str(data['ac_party_type'])
        ledger_value.ledger_descp = str(data['ac_description'])
        db.session.flush()
        db.session.commit()
        client_led_bal = 0
        if(data['ac_party_type'] == "client" or data['ac_party_type'] == "supplier"):
            clint_suppl_ledg = Ledger2.query.filter(and_(Ledger2.ledger_bill == str(data['leg_inv_num']).strip(),Ledger2.ledger_type == str(data['ac_party_type']).strip())).order_by(Ledger2.id.asc()).all()
            for man in clint_suppl_ledg:
                client_led_bal +=  int(man.ledger_credit_amount) - int(man.ledger_debit_amount)
                man.ledger_balance = client_led_bal
                db.session.flush()
                db.session.commit()
        if(data['ac_party_type'] == "client"):
            RefreshCOA_Customer.refresh_COA_Customer(str(get_chart_accnt.id))
        elif(data['ac_party_type'] == "supplier"):
            RefreshCOA_Customer.refresh_COA_Supplier(str(get_chart_accnt.id))
    return jsonify({"data":"updated"})

@api12.route('/party_delete/<id>/<userid>', methods = ['DELETE'])
def party_delete(id,userid):
    del_party = Party.query.get(int(id))
    delete_party_COA = ChartOfAccount.__table__.delete().where(ChartOfAccount.id == int(del_party.chart_accnt))
    if(str(del_party.type).strip() == "goods"):
        party_goods =  GoodsNlc.query.filter(GoodsNlc.parties == int(id)).all()
        for p_good in party_goods:
            party_good_get = GoodsNlc.query.get(int(p_good.id))
            del_goods_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_bill == str(party_good_get.bilty_no).strip())
            db.session.execute(del_goods_ledger_data)
            db.session.delete(party_good_get)
            db.session.flush()
            db.session.commit() 
    elif(str(del_party.type).strip() == "oil"):
        party_oils =  OilPso.query.filter(OilPso.parties == int(id)).all()
        for p_oil in party_oils:
            party_oil_get = OilPso.query.get(int(p_oil.id))
            del_oils_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_bill == str(party_oil_get.bilty_no).strip())
            db.session.execute(del_oils_ledger_data)
            db.session.delete(party_oil_get)
            db.session.flush()
            db.session.commit() 
    del_party_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_account_no == str(del_party.chart_accnt).strip())
    db.session.execute(del_party_ledger_data)
    db.session.delete(del_party)
    db.session.execute(delete_party_COA)
    db.session.commit()
    RefreshCOA_Customer.refresh_COA_Comm(userid)
    return jsonify({"data":"deleted"})

@api12.route('/party_bill_delete/<id>/<userid>', methods = ['DELETE'])
def party_bill_delete(id, userid):
    parrty_bill_value = PartyBill.query.filter(PartyBill.id == int(id)).first()
    get_party = Party.query.get(int(str(parrty_bill_value.party_id)))
    prev_bilties =str(parrty_bill_value.invoice_bilties).strip()
    if(str(parrty_bill_value.invoice_type).strip() == "goods"):
        for p_bilty in prev_bilties.split(","):
            manifest_goods_value = GoodsNlc.query.filter(GoodsNlc.id == int(p_bilty)).first()
            manifest_goods_value.bill_status = 'pending'
            db.session.flush()
            db.session.commit()
    elif(str(parrty_bill_value.invoice_type).strip() == "oil"):
        for p_bilty in prev_bilties.split(","):
            manifest_oils_value = OilPso.query.filter(OilPso.id == int(p_bilty)).first()
            manifest_oils_value.bill_status = 'pending'
            db.session.flush()
            db.session.commit()
    del_party_ledger_data = Ledger.__table__.delete().where(Ledger.ledger_bill == str(parrty_bill_value.invoice_no).strip())
    db.session.execute(del_party_ledger_data)
    db.session.delete(parrty_bill_value)
    db.session.commit()
    RefreshCOA_Customer.refresh_COA_Party(str(get_party.chart_accnt))
    return jsonify({"data":"deleted"})

@api12.route('/city_setup_delete/<id>/<userid>', methods = ['DELETE'])
def city_set_delete(id, userid):
    del_city_set = CitySetup.query.get(int(id))
    db.session.delete(del_city_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api12.route('/unit_setup_delete/<id>/<userid>', methods = ['DELETE'])
def unit_set_delete(id, userid):
    delete_unit_stock_in_q = Stockin.__table__.delete().where(Stockin.stock_unit == int(id))
    db.session.execute(delete_unit_stock_in_q)
    delete_unit_prod_q = Products.__table__.delete().where(Products.p_units == int(id))
    db.session.execute(delete_unit_prod_q)
    del_unit_set = Units.query.get(int(id))
    db.session.delete(del_unit_set)
    db.session.commit()
    return jsonify({"data":"deleted"})


@api12.route('/mode_of_pay_delete/<id>/<userid>', methods = ['DELETE'])
def mode_of_pay_delete(id, userid):
    del_mode_pay_set = ModeOfPayment.query.get(int(id))
    db.session.delete(del_mode_pay_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api12.route('/category_delete/<id>/<userid>', methods = ['DELETE'])
def category_delete(id, userid):
    delete_cat_prod_q = Products.__table__.delete().where(Products.category == int(id))
    db.session.execute(delete_cat_prod_q)
    del_category_set = Categories.query.get(int(id))
    db.session.delete(del_category_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api12.route('/warehouse_delete/<id>/<userid>', methods = ['DELETE'])
def warehouse_delete(id, userid):
    del_warehouse_set = Warehouse.query.get(int(id))
    del_prd_data = TblProduct.__table__.delete().where(TblProduct.product_ware == str(del_warehouse_set.id).strip())
    del_stk_trf_from_data = StockTrasfer.__table__.delete().where(StockTrasfer.stock_tranf_from == str(del_warehouse_set.id).strip())
    del_stk_trf_to_data = StockTrasfer.__table__.delete().where(StockTrasfer.stock_tranf_to == str(del_warehouse_set.id).strip())
    quote_inv = TblQuote.query.filter(TblQuote.warehouse_id == int(id)).all()
    for q_inv in quote_inv:
        get_quote = TblQuote.query.get(int(str(q_inv.id).strip()))
        del_qoute_items = QuoteItems.__table__.delete().where(QuoteItems.item_invoice == str(q_inv.id).strip())
        db.session.execute(del_qoute_items)
        db.session.delete(get_quote)
        db.session.commit()
    invoice_inv = TblInvoice.query.filter(TblInvoice.warehouse_id == int(id)).all()
    for inv in invoice_inv:
        get_invoice = TblInvoice.query.get(int(str(inv.id).strip()))
        del_invoice_items = InvoiceItems.__table__.delete().where(InvoiceItems.item_invoice == str(inv.id).strip())
        del_inv_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(inv.invoice_num).strip())
        db.session.execute(del_inv_data)
        db.session.execute(del_invoice_items)
        db.session.delete(get_invoice)
        db.session.commit()
        get_client = Clients.query.get(int(inv.client_id))
        RefreshCOA_Customer.refresh_COA_Customer(get_client.chart_accnt)
    recc_inv = TblReccInvoice.query.filter(TblReccInvoice.warehouse_id == int(id)).all()
    for r_cc in recc_inv:
        get_recc_inv = TblReccInvoice.query.get(int(str(r_cc.id).strip()))
        del_recc_inv_items = ReccItems.__table__.delete().where(ReccItems.item_invoice == str(r_cc.id).strip())
        del_r_cc_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(inv.invoice_num).strip())
        db.session.execute(del_r_cc_data)
        db.session.execute(del_recc_inv_items)
        db.session.delete(get_recc_inv)
        db.session.commit()
        get_client = Clients.query.get(int(r_cc.client_id))
        RefreshCOA_Customer.refresh_COA_Customer(get_client.chart_accnt)
    cl_stk_rtn_inv = TblClnStockRtn.query.filter(TblClnStockRtn.warehouse_id == int(id)).all()
    for cl_stk_inv in cl_stk_rtn_inv:
        get_cl_stk_inv = TblClnStockRtn.query.get(int(str(cl_stk_inv.id).strip()))
        del_cl_stk_items = ClientReturnItems.__table__.delete().where(ClientReturnItems.item_invoice == str(cl_stk_inv.id).strip())
        del_cl_stk_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(inv.stock_num).strip())
        db.session.execute(del_cl_stk_data)
        db.session.execute(del_cl_stk_items)
        db.session.delete(get_cl_stk_inv)
        db.session.commit()
        get_client = Clients.query.get(int(cl_stk_inv.client_id))
        RefreshCOA_Customer.refresh_COA_Customer(get_client.chart_accnt)
    order_inv = TblOrder.query.filter(TblOrder.warehouse_id == int(id)).all()
    for o_inv in order_inv:
        get_order_inv = TblOrder.query.get(int(str(o_inv.id).strip()))
        del_ord_inv_items = PurchItems.__table__.delete().where(PurchItems.item_invoice == str(o_inv.id).strip())
        del_ord_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(inv.order_num).strip())
        db.session.execute(del_ord_data)
        db.session.execute(del_ord_inv_items)
        db.session.delete(get_order_inv)
        db.session.commit()
        get_supplier = Supplier.query.get(int(o_inv.supplier_id))
        RefreshCOA_Customer.refresh_COA_Supplier(get_supplier.chart_accnt)
    stk_rtn_inv = TblStockRtn.query.filter(TblStockRtn.warehouse_id == int(id)).all()
    for stk_inv in stk_rtn_inv:
        get_stk_inv = TblOrder.query.get(int(str(stk_inv.id).strip()))
        del_cl_stk_items = ReturnItems.__table__.delete().where(ReturnItems.item_invoice == str(stk_inv.id).strip())
        del_stk_data = Ledger2.__table__.delete().where(Ledger2.ledger_bill == str(inv.stock_num).strip())
        db.session.execute(del_stk_data)
        db.session.execute(del_cl_stk_items)
        db.session.delete(get_stk_inv)
        db.session.commit()
        get_supplier = Supplier.query.get(int(stk_inv.supplier_id))
        RefreshCOA_Customer.refresh_COA_Supplier(get_supplier.chart_accnt)

    db.session.execute(del_prd_data)
    db.session.execute(del_stk_trf_from_data)
    db.session.execute(del_stk_trf_to_data)
    db.session.delete(del_warehouse_set)
    db.session.commit()
    return jsonify({"data":"deleted"})

@api12.route('/p_category_delete/<id>/<userid>', methods = ['DELETE'])
def p_category_delete(id, userid):
    del_p_category_set = ProductCategory.query.get(int(id))
    all_product = TblProduct.query.filter(TblProduct.product_cat == int(del_p_category_set.id)).all()
    for prd in all_product:
        del_product_set = TblProduct.query.get(int(prd.id))
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
        db.session.delete(del_p_category_set)
        db.session.commit()
    return jsonify({"data":"deleted"})
