import datetime
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from invoiceItems import InvoiceItems
from tblProduct import TblProduct
from party import Party
from vehicles import Vehicles
from clients import Clients
from supplier import Supplier
from chartofAccount import ChartOfAccount
from ledger import Ledger
from ledger2 import Ledger2
from tblOrder import TblOrder
from goodsnlc import GoodsNlc
from oilpso import OilPso
from tblInvoice import TblInvoice
from extensions import db
from sqlalchemy import and_, extract, text, func

api26 = Blueprint('api26', __name__)

def sum_array(arr):
    total = sum(arr)
    return total

@api26.route('/main_dashboard_data/<userid>', methods=['GET']) 
def main_dashboard_index(userid): 
    current_month = datetime.datetime.now().month
    now = datetime.datetime.now()
    last_month = now.month-1 if now.month > 1 else 12
    cm_gross_total = 0
    lm_gross_total = 0
    cm_goods_total = 0
    lm_goods_total = 0
    cm_vehicle_total = 0
    lm_vehicle_total = 0
    cm_comm_total = 0
    lm_comm_total = 0
    cm_oils_total = 0
    lm_oils_total = 0
    cm_oils_veh_total = 0
    lm_oils_veh_total = 0
    cm_oils_comm_total = 0
    lm_oils_comm_total = 0
    cm_total_revenue = 0
    lm_total_revenue = 0
    total_rev_diff = 0
    total_rev_status = 0
    cm_total_expense = 0
    lm_total_expense = 0
    total_exp_diff = 0
    total_exp_status = 0
    
    cm_total_income = 0
    lm_total_incom = 0
    total_income_diff = 0
    total_income_status = 0
    
    cm_gross_sell = db.session.query(TblInvoice).filter(and_(extract('month', TblInvoice.datetime)==current_month), TblInvoice.userid == userid).all()
    lm_gross_sell = db.session.query(TblInvoice).filter(and_(extract('month', TblInvoice.datetime)==last_month),TblInvoice.userid == userid).all()
    for sell in cm_gross_sell:
        cm_gross_total += float(sell.grand_total)
    for lsell in lm_gross_sell:
        lm_gross_total += float(lsell.grand_total)
    cm_goods_sell = db.session.query(GoodsNlc).filter(and_(extract('month', GoodsNlc.datetime)==current_month), GoodsNlc.userid == userid).all()
    lm_goods_sell = db.session.query(GoodsNlc).filter(and_(extract('month', GoodsNlc.datetime)==last_month),GoodsNlc.userid == userid).all()
    for c_good in cm_goods_sell:
        cm_goods_total += float(c_good.freight)
        cm_vehicle_total += float(c_good.vehicle_freight)
        cm_comm_total += float(c_good.commission)
    for lsell in lm_goods_sell:
        lm_goods_total += float(lsell.freight)
        lm_vehicle_total += float(lsell.vehicle_freight)
        lm_comm_total += float(lsell.commission)
    cm_oils_sell = db.session.query(OilPso).filter(and_(extract('month', OilPso.datetime)==current_month), OilPso.userid == userid).all()
    lm_oils_sell = db.session.query(OilPso).filter(and_(extract('month', OilPso.datetime)==last_month),OilPso.userid == userid).all()
    for c_oil in cm_oils_sell:
        cm_oils_total += float(c_oil.freight)
        cm_oils_veh_total += float(c_good.vehicle_freight)
        cm_oils_comm_total += float(c_good.commission)
    for loil in lm_oils_sell:
        lm_oils_total += float(lsell.freight)
        lm_oils_veh_total += float(lsell.vehicle_freight)
        lm_oils_comm_total += float(lsell.commission)
    cm_total_revenue = cm_gross_total + cm_goods_total + cm_oils_total
    lm_total_revenue = lm_gross_total + lm_goods_total + lm_oils_total
    total_rev_diff = lm_total_revenue - cm_total_revenue
    if(int(cm_total_revenue) > int(lm_total_revenue)):
        total_rev_status = "high"
    else:
        total_rev_status = "low"
    cm_gross_purch_val = 0
    lm_gross_purch_val = 0
    cm_gross_purch = db.session.query(TblOrder).filter(and_(extract('month', TblOrder.datetime)==current_month), TblOrder.userid == userid).all()
    lm_gross_purch = db.session.query(TblOrder).filter(and_(extract('month', TblOrder.datetime)==last_month), TblOrder.userid == userid).all()
    for purch in cm_gross_purch:
        cm_gross_purch_val += float(purch.grand_total)
    for lpurch in lm_gross_purch:
        lm_gross_purch_val += float(lpurch.grand_total)
    cm_total_expense = cm_gross_purch_val + cm_vehicle_total + cm_oils_veh_total
    lm_total_expense = lm_gross_purch_val + lm_vehicle_total + lm_oils_veh_total
    total_exp_diff = lm_total_expense - cm_total_expense
    if(int(cm_total_expense) > int(lm_total_expense)):
        total_exp_status = "high"
    else:
        total_exp_status = "low"
    cm_income_gen = cm_gross_total - cm_gross_purch_val
    lm_income_gen = lm_gross_total - lm_gross_purch_val
    cm_total_income = cm_income_gen + cm_comm_total + cm_oils_comm_total
    lm_total_incom = lm_income_gen + lm_comm_total + lm_oils_comm_total
    total_income_diff = lm_total_incom - cm_total_income
    if(int(cm_total_income) > int(lm_total_incom)):
        total_income_status = "high"
    else:
        total_income_status = "low"
    coa_details =  ChartOfAccount.query.filter(and_(ChartOfAccount.userid == userid)).all()
    cm_total_payable = 0
    cm_total_receivable = 0
    lm_total_payable = 0
    lm_total_receivable = 0
    total_payable_diff = 0
    total_payable_status = 0
    total_receivable_diff = 0
    total_receivable_status = 0
    payable_data  = []
    receivable_data  = []
    for coa_d in coa_details:
        if(str(coa_d.account_mode).strip() != "commission"):
            debitAmt = 0
            creditAmt = 0
            if(int(coa_d.networth) < 0):
                debitAmt = abs(int(coa_d.networth))
                cm_total_receivable += abs(int(coa_d.networth))
            else:
                creditAmt = abs(int(coa_d.networth))
                cm_total_payable += abs(int(coa_d.networth))
            payable_data.append({"id":coa_d.id,"accountName":str(coa_d.accnt_name).strip().capitalize(),"ledgerBal":round(creditAmt)})
            receivable_data.append({"id":coa_d.id,"accountName":str(coa_d.accnt_name).strip().capitalize(),"ledgerBal":round(debitAmt)})
    customer_lists = Clients.query.filter(and_(extract('month', Clients.datetime)==current_month),Clients.userid == userid).all()
    supplier_lists = Supplier.query.filter(and_(extract('month', Supplier.datetime)==current_month),Supplier.userid == userid).all()
    good_party_count = 0
    oil_party_count = 0
    good_veh_count = 0
    oil_veh_count = 0
    party_lists = Party.query.filter(and_(extract('month', Party.datetime)==current_month),Party.userid == userid).all()
    veh_lists = Vehicles.query.filter(and_(extract('month', Vehicles.datetime)==current_month),Vehicles.userid == userid).all()
    for party in party_lists:
        if(str(party.type).strip() == "goods"):
            good_party_count += 1
        elif(str(party.type).strip() == "oil"):
            oil_party_count += 1
    for veh in veh_lists:
        if(str(veh.veh_type).strip() == "goods"):
            good_veh_count += 1
        elif(str(veh.veh_type).strip() == "oil"):
            oil_veh_count += 1
    stk_data = []
    stk_details  = db.session.query(TblProduct).filter(TblProduct.userid == userid).group_by(TblProduct.id).all()
    for stk in stk_details:
        sold_items = 0
        perStk = 0
        qry_invoice = InvoiceItems.query.filter(and_(InvoiceItems.userid == userid, InvoiceItems.item_product == stk.id)).order_by(InvoiceItems.id.asc()).all()
        totalstk = len(qry_invoice) + int(stk.product_stock)
        perStk = float(len(qry_invoice) / totalstk) * 100
        rm_per = 100 - perStk
        stk_data.append({"id":stk.id,"product_name":stk.product_name,"product_rental":stk.product_rental,"product_whole_price":stk.product_whole_price,"product_tax":stk.product_tax,"product_discount":stk.product_discount,"product_stock":stk.product_stock,"product_alert":stk.product_alert,"sold_items":len(qry_invoice), "perStk":rm_per})
    
    return jsonify({"cm_total_revenue":round(cm_total_revenue),"total_rev_diff":round(total_rev_diff),"total_rev_status": total_rev_status,"cm_total_expense":round(cm_total_expense),"total_exp_diff":round(total_exp_diff),"total_exp_status":total_exp_status, "cm_total_income":round(cm_total_income),"total_income_diff":round(total_income_diff),"total_income_status":total_income_status, "cm_total_payable":round(cm_total_payable),"cm_total_receivable":round(cm_total_receivable),"total_payable_diff":round(total_payable_diff),"total_payable_status":total_payable_status,"total_receivable_diff":round(total_receivable_diff),"total_receivable_status":total_receivable_status,"customerNO":len(customer_lists),"SupplNo":len(supplier_lists),"GoodsPartyNo":good_party_count,"OilsPartyNo":oil_party_count,"GoodsVehNo":good_veh_count,"OilsVehNo":oil_veh_count,"payable_data":payable_data,"receivable_data":receivable_data,"stk_data":stk_data})

@api26.route('/main_overall_data', methods=['POST'])
def main_overall_index(): 
    data = request.get_json()
    current_year = datetime.datetime.now().year
    current_month = datetime.datetime.now().month
    today = datetime.datetime.now()
    start_of_week = today - datetime.timedelta(days=today.weekday())
    start_of_week = start_of_week.strftime("%Y-%m-%d")
    today = today.strftime("%Y-%m-%d")
    userid = int(data['userid'])
    cm_gross_total = 0
    cm_goods_total = 0
    cm_vehicle_total = 0
    cm_comm_total = 0
    cm_oils_total = 0
    cm_oils_veh_total = 0
    cm_oils_comm_total = 0
    cm_total_revenue = 0
    cm_total_expense = 0
    cm_total_income = 0
    cm_gross_purch_val = 0
    if((str(data['overallType']).strip()) == "year"):
        cm_gross_sell = db.session.query(TblInvoice).filter(and_(extract('year', TblInvoice.datetime)==current_year), TblInvoice.userid == userid).all()
        for sell in cm_gross_sell:
            cm_gross_total += float(sell.grand_total)
        cm_goods_sell = db.session.query(GoodsNlc).filter(and_(extract('year', GoodsNlc.datetime)==current_year), GoodsNlc.userid == userid).all()
        for c_good in cm_goods_sell:
            cm_goods_total += float(c_good.freight)
            cm_vehicle_total += float(c_good.vehicle_freight)
            cm_comm_total += float(c_good.commission)
        cm_oils_sell = db.session.query(OilPso).filter(and_(extract('year', OilPso.datetime)==current_year), OilPso.userid == userid).all()
        for c_oil in cm_oils_sell:
            cm_oils_total += float(c_oil.freight)
            cm_oils_veh_total += float(c_good.vehicle_freight)
            cm_oils_comm_total += float(c_good.commission)
        cm_gross_purch_val = 0
        cm_gross_purch = db.session.query(TblOrder).filter(and_(extract('year', TblOrder.datetime)==current_year), TblOrder.userid == userid).all()
        for purch in cm_gross_purch:
            cm_gross_purch_val += float(purch.grand_total)
    elif((str(data['overallType']).strip()) == "month"):
        cm_gross_sell = db.session.query(TblInvoice).filter(and_(extract('month', TblInvoice.datetime)==current_month), TblInvoice.userid == userid).all()
        for sell in cm_gross_sell:
            cm_gross_total += float(sell.grand_total)
        cm_goods_sell = db.session.query(GoodsNlc).filter(and_(extract('month', GoodsNlc.datetime)==current_month), GoodsNlc.userid == userid).all()
        for c_good in cm_goods_sell:
            cm_goods_total += float(c_good.freight)
            cm_vehicle_total += float(c_good.vehicle_freight)
            cm_comm_total += float(c_good.commission)
        cm_oils_sell = db.session.query(OilPso).filter(and_(extract('month', OilPso.datetime)==current_month), OilPso.userid == userid).all()
        for c_oil in cm_oils_sell:
            cm_oils_total += float(c_oil.freight)
            cm_oils_veh_total += float(c_good.vehicle_freight)
            cm_oils_comm_total += float(c_good.commission)
        cm_gross_purch = db.session.query(TblOrder).filter(and_(extract('month', TblOrder.datetime)==current_month), TblOrder.userid == userid).all()
        for purch in cm_gross_purch:
            cm_gross_purch_val += float(purch.grand_total)
    elif((str(data['overallType']).strip()) == "week"):
        cm_gross_sell_txt = text("SELECT * FROM public.tbl_invoice Where userid = "+str(userid)+" AND datetime >= '"+ start_of_week +"' AND datetime < '"+today+"'") 
        cm_gross_sell = db.session.execute(cm_gross_sell_txt)
        for sell in cm_gross_sell:
            cm_gross_total += float(sell.grand_total)
        cm_goods_sell_txt = text("SELECT * FROM public.goods_nlc Where userid = "+str(userid)+" AND datetime >= '"+ start_of_week +"' AND datetime < '"+today+"'") 
        cm_goods_sell = db.session.execute(cm_goods_sell_txt)
        for c_good in cm_goods_sell:
            cm_goods_total += float(c_good.freight)
            cm_vehicle_total += float(c_good.vehicle_freight)
            cm_comm_total += float(c_good.commission)
        cm_oils_sell_txt = text("SELECT * FROM public.oil_pso Where userid = "+str(userid)+" AND datetime >= '"+ start_of_week +"' AND datetime < '"+today+"'") 
        cm_oils_sell = db.session.execute(cm_oils_sell_txt)
        for c_oil in cm_oils_sell:
            cm_oils_total += float(c_oil.freight)
            cm_oils_veh_total += float(c_good.vehicle_freight)
            cm_oils_comm_total += float(c_good.commission)
        cm_gross_purch_txt = text("SELECT * FROM public.tbl_order Where userid = "+str(userid)+" AND datetime >= '"+ start_of_week +"' AND datetime < '"+today+"'") 
        cm_gross_purch = db.session.execute(cm_gross_purch_txt)
        for purch in cm_gross_purch:
            cm_gross_purch_val += float(purch.grand_total)
    elif((str(data['overallType']).strip()) == "today"):
        cm_gross_sell_txt = text("SELECT * FROM public.tbl_invoice Where userid = "+str(userid)+" AND datetime = '"+ today +"'") 
        cm_gross_sell = db.session.execute(cm_gross_sell_txt)
        for sell in cm_gross_sell:
            cm_gross_total += float(sell.grand_total)
        cm_goods_sell_txt = text("SELECT * FROM public.goods_nlc Where userid = "+str(userid)+" AND datetime = '"+ today +"'") 
        cm_goods_sell = db.session.execute(cm_goods_sell_txt)
        for c_good in cm_goods_sell:
            cm_goods_total += float(c_good.freight)
            cm_vehicle_total += float(c_good.vehicle_freight)
            cm_comm_total += float(c_good.commission)
        cm_oils_sell_txt = text("SELECT * FROM public.oil_pso Where userid = "+str(userid)+" AND datetime = '"+ today +"'") 
        cm_oils_sell = db.session.execute(cm_oils_sell_txt)
        for c_oil in cm_oils_sell:
            cm_oils_total += float(c_oil.freight)
            cm_oils_veh_total += float(c_good.vehicle_freight)
            cm_oils_comm_total += float(c_good.commission)
        cm_gross_purch_txt = text("SELECT * FROM public.tbl_order Where userid = "+str(userid)+" AND datetime = '"+ today +"'") 
        cm_gross_purch = db.session.execute(cm_gross_purch_txt)
        for purch in cm_gross_purch:
            cm_gross_purch_val += float(purch.grand_total)
    cm_total_revenue = cm_gross_total + cm_goods_total + cm_oils_total
    cm_total_expense = cm_gross_purch_val + cm_vehicle_total + cm_oils_veh_total
    cm_income_gen = cm_gross_total - cm_gross_purch_val
    cm_total_income = cm_income_gen + cm_comm_total + cm_oils_comm_total
    return jsonify({"cm_total_revenue":cm_total_revenue,"cm_total_expense":cm_total_expense,"cm_total_income":cm_total_income})


@api26.route('/main_area_data', methods=['POST'])
def main_area_index(): 
    data = request.get_json()
    purchase_data = []
    sale_data = []
    income_data = []
    userid = int(data['userid'])
    invoice_data_txt = text("SELECT to_char(datetime, 'MM') as month, sum(CAST(grand_total AS DECIMAL(10,2))) as sum_val FROM tbl_invoice a WHERE userid = "+str(userid)+" AND datetime > date_trunc('month', CURRENT_DATE) - INTERVAL '1 year' GROUP BY 1") 
    invoice_data = db.session.execute(invoice_data_txt)
    order_data_txt = text("SELECT to_char(datetime, 'MM') as month, sum(CAST(grand_total AS DECIMAL(10,2))) as sum_val FROM tbl_order a WHERE userid = "+str(userid)+" AND datetime > date_trunc('month', CURRENT_DATE) - INTERVAL '1 year' GROUP BY 1") 
    order_data = db.session.execute(order_data_txt)
    oils_data_txt = text("SELECT to_char(datetime, 'MM') as month, sum(CAST(freight AS DECIMAL(10,2))) as sum_freight,sum(CAST(vehicle_freight AS DECIMAL(10,2))) as sum_veh_freight,sum(CAST(commission AS DECIMAL(10,2))) as sum_comm FROM oil_pso a WHERE userid = "+str(userid)+" AND datetime > date_trunc('month', CURRENT_DATE) - INTERVAL '1 year' GROUP BY 1") 
    oils = db.session.execute(oils_data_txt)
    goods_data_txt = text("SELECT to_char(datetime, 'MM') as month, sum(CAST(freight AS DECIMAL(10,2))) as sum_freight,sum(CAST(vehicle_freight AS DECIMAL(10,2))) as sum_veh_freight,sum(CAST(commission AS DECIMAL(10,2))) as sum_comm FROM goods_nlc a WHERE userid = "+str(userid)+" AND datetime > date_trunc('month', CURRENT_DATE) - INTERVAL '1 year' GROUP BY 1") 
    goods = db.session.execute(goods_data_txt)
    if((str(data['overallType']).strip()) == "year"):
        purchase_data = [0] * 12
        sale_data = [0] * 12
        for ord in order_data:
            purchase_data[int(ord.month) - 1] = round(float(ord.sum_val))
        for inv in invoice_data:
            sale_data[int(inv.month) - 1] = round(float(inv.sum_val))
        for good in goods:
            purchase_data[int(good.month) - 1] =  purchase_data[int(good.month) - 1] + round(float(good.sum_veh_freight))
            sale_data[int(good.month) - 1] =  sale_data[int(good.month) - 1] + round(float(good.sum_freight))
        for oil in oils:
            purchase_data[int(oil.month) - 1] =  purchase_data[int(oil.month) - 1] + round(float(oil.sum_veh_freight))
            sale_data[int(oil.month) - 1] =  sale_data[int(oil.month) - 1] + round(float(oil.sum_freight))
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
        for good in goods:
            purchase_data[int(good.month) - 1] =  purchase_data[int(good.month) - 1] + round(float(good.sum_veh_freight))
            sale_data[int(good.month) - 1] =  sale_data[int(good.month) - 1] + round(float(good.sum_freight))
        for oil in oils:
            purchase_data[int(oil.month) - 1] =  purchase_data[int(oil.month) - 1] + round(float(oil.sum_veh_freight))
            sale_data[int(oil.month) - 1] =  sale_data[int(oil.month) - 1] + round(float(oil.sum_freight))
        for index, sale in enumerate(sale_data):
            income_val = sale - purchase_data[index]
            income_data.append(income_val)
    return jsonify({"purchase_data":purchase_data, "income_data":income_data, "TotalPurch": sum_array(purchase_data), "TotalExp":sum_array(income_data) })
