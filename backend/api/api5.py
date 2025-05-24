import datetime
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from chartofAccount import ChartOfAccount
from ledger import Ledger
from party import Party
from tblInvoice import TblInvoice
from tblOrder import TblOrder
from vehicles import Vehicles
from extensions import db
from sqlalchemy import and_, extract, text

api5 = Blueprint('api5', __name__)

def sum_array(arr):
    total = sum(arr)
    return total

@api5.route('/goods_area_data', methods=['POST'])
def goods_area_index(): 
    data = request.get_json()
    freight_data = []
    veh_freight_data = []
    comm_data = []
    userid = int(data['userid'])
    goods_data_txt = text("SELECT to_char(datetime, 'MM') as month, sum(CAST(freight AS DECIMAL(10,2))) as sum_freight,sum(CAST(vehicle_freight AS DECIMAL(10,2))) as sum_veh_freight,sum(CAST(commission AS DECIMAL(10,2))) as sum_comm FROM goods_nlc a WHERE userid = "+str(userid)+" AND datetime > date_trunc('month', CURRENT_DATE) - INTERVAL '1 year' GROUP BY 1") 
    goods = db.session.execute(goods_data_txt)
    if((str(data['overallType']).strip()) == "year"):
        freight_data = [0] * 12
        veh_freight_data = [0] * 12
        comm_data = [0] * 12
        for gds in goods:
            freight_data[int(gds.month) -1] = round(float(gds.sum_freight))
            veh_freight_data[int(gds.month) -1] = round(float(gds.sum_veh_freight))
            comm_data[int(gds.month) -1] = round(float(gds.sum_comm))
    elif((str(data['overallType']).strip()) == "6month"):
        freight_data = [0] * 6
        veh_freight_data = [0] * 6
        comm_data = [0] * 6
        for gds in goods:
            freight_data[int(gds.month) -1] = round(float(gds.sum_freight))
            veh_freight_data[int(gds.month) -1] = round(float(gds.sum_veh_freight))
            comm_data[int(gds.month) -1] = round(float(gds.sum_comm))       
    return jsonify({"freight_data":freight_data, "veh_freight_data":veh_freight_data, "comm_data":comm_data, "TotalFreight":sum_array(freight_data),"TotalVehFreight":sum_array(veh_freight_data), "TotalComm":sum_array(comm_data) })




@api5.route('/oils_area_data', methods=['POST'])
def oils_area_index(): 
    data = request.get_json()
    freight_data = []
    veh_freight_data = []
    comm_data = []
    userid = int(data['userid'])
    goods_data_txt = text("SELECT to_char(datetime, 'MM') as month, sum(CAST(freight AS DECIMAL(10,2))) as sum_freight,sum(CAST(vehicle_freight AS DECIMAL(10,2))) as sum_veh_freight,sum(CAST(commission AS DECIMAL(10,2))) as sum_comm FROM oil_pso a WHERE userid = "+str(userid)+" AND datetime > date_trunc('month', CURRENT_DATE) - INTERVAL '1 year' GROUP BY 1") 
    goods = db.session.execute(goods_data_txt)
    if((str(data['overallType']).strip()) == "year"):
        freight_data = [0] * 12
        veh_freight_data = [0] * 12
        comm_data = [0] * 12
        for gds in goods:
            freight_data[int(gds.month) -1] = round(float(gds.sum_freight))
            veh_freight_data[int(gds.month) -1] = round(float(gds.sum_veh_freight))
            comm_data[int(gds.month) -1] = round(float(gds.sum_comm))
    elif((str(data['overallType']).strip()) == "6month"):
        freight_data = [0] * 6
        veh_freight_data = [0] * 6
        comm_data = [0] * 6
        for gds in goods:
            freight_data[int(gds.month) -1] = round(float(gds.sum_freight))
            veh_freight_data[int(gds.month) -1] = round(float(gds.sum_veh_freight))
            comm_data[int(gds.month) -1] = round(float(gds.sum_comm))
    return jsonify({"freight_data":freight_data, "veh_freight_data":veh_freight_data, "comm_data":comm_data, "TotalFreight":sum_array(freight_data),"TotalVehFreight":sum_array(veh_freight_data), "TotalComm":sum_array(comm_data) })

@api5.route('/sales_overall_data', methods=['POST'])
def sales_overall_index(): 
    data = request.get_json()
    cm_gross_total = 0
    cm_gross_purch_val = 0
    current_year = datetime.datetime.now().year
    current_month = datetime.datetime.now().month
    today = datetime.datetime.now()
    start_of_week = today - datetime.timedelta(days=today.weekday())
    start_of_week = start_of_week.strftime("%Y-%m-%d")
    today = today.strftime("%Y-%m-%d")
    userid = int(data['userid'])
    if((str(data['overallType']).strip()) == "year"):
        cm_gross_sell = db.session.query(TblInvoice).filter(and_(extract('year', TblInvoice.datetime)==current_year),TblInvoice.userid == userid).all()
        cm_gross_purch = db.session.query(TblOrder).filter(and_(extract('year', TblOrder.datetime)==current_year),TblOrder.userid == userid).all()
        for sell in cm_gross_sell:
            cm_gross_total += float(sell.grand_total)
        for purch in cm_gross_purch:
            cm_gross_purch_val += float(purch.grand_total)
    elif((str(data['overallType']).strip()) == "month"):
        cm_gross_sell = db.session.query(TblInvoice).filter(and_(extract('month', TblInvoice.datetime)==current_month,TblInvoice.userid == userid)).all()
        cm_gross_purch = db.session.query(TblOrder).filter(and_(extract('month', TblOrder.datetime)==current_month,TblInvoice.userid == userid)).all()
        for sell in cm_gross_sell:
            cm_gross_total += float(sell.grand_total)
        for purch in cm_gross_purch:
            cm_gross_purch_val += float(purch.grand_total)
    elif((str(data['overallType']).strip()) == "week"):
        cm_gross_sell_txt = text("SELECT * FROM public.tbl_invoice Where userid = "+str(userid)+" AND datetime >= '"+ start_of_week +"' AND datetime < '"+today+"'") 
        cm_gross_sell = db.session.execute(cm_gross_sell_txt)
        cm_gross_purch_txt = text("SELECT * FROM public.tbl_order Where userid = "+str(userid)+" AND datetime >= '"+ start_of_week +"' AND datetime < '"+today+"'") 
        cm_gross_purch = db.session.execute(cm_gross_purch_txt)
        for sell in cm_gross_sell:
            cm_gross_total += float(sell.grand_total)
        for purch in cm_gross_purch:
            cm_gross_purch_val += float(purch.grand_total)       
    elif((str(data['overallType']).strip()) == "today"):
        cm_gross_sell_txt = text("SELECT * FROM public.tbl_invoice Where userid = "+str(userid)+" AND datetime = '"+ today +"'") 
        cm_gross_sell = db.session.execute(cm_gross_sell_txt)
        cm_gross_purch_txt = text("SELECT * FROM public.tbl_order Where userid = "+str(userid)+" AND datetime = '"+ today +"'") 
        cm_gross_purch = db.session.execute(cm_gross_purch_txt)
        for sell in cm_gross_sell:
            cm_gross_total += float(sell.grand_total)
        for purch in cm_gross_purch:
            cm_gross_purch_val += float(purch.grand_total)
    cm_income_gen = cm_gross_total - cm_gross_purch_val
    return jsonify({"cm_gross_total":cm_gross_total,"cm_gross_purch_val":cm_gross_purch_val,"cm_income_gen":cm_income_gen,"cm_expense_gen":'50'})

@api5.route('/goods_overall_data', methods=['POST'])
def goods_overall_index(): 
    data = request.get_json()
    userid = int(data['userid'])
    coa_list = ChartOfAccount.query.filter(ChartOfAccount.userid == userid).all()
    total_payable = 0
    total_receivable = 0
    total_sum = 0
    for coa in coa_list:
        debt_Amt = 0
        credit_Amt = 0
        if(str(coa.account_mode).strip() == "party"):
            get_Party = Party.query.filter(Party.chart_accnt == int(coa.id)).one()
            if(str(get_Party.type).strip() == "goods"):
                if(int(coa.networth) < 0):
                    debt_Amt = abs(int(coa.networth))
                else:
                    credit_Amt = int(coa.networth) 
        elif(str(coa.account_mode).strip() == "vehicle"):
            get_Vehicle = Vehicles.query.filter(Vehicles.chart_accnt == int(coa.id)).one()
            if(str(get_Vehicle.veh_type).strip() == "goods"):
                if(int(coa.networth) < 0):
                    debt_Amt = abs(int(coa.networth))
                else:
                    credit_Amt = int(coa.networth) 
        total_payable += (int(debt_Amt)) 
        total_receivable += int(credit_Amt)
    total_sum =  total_payable + total_receivable 
    try: 
        per_total_pay = (total_payable / total_sum) * 100
    except:
        per_total_pay = 0
    try: 
        per_total_rec = (total_receivable / total_sum) * 100
    except: 
        per_total_rec = 0
    return jsonify({"totalpay":int(total_receivable), "totalRec":int(total_payable), "perTotalPay":round(per_total_pay),  "perTotalPRec":round(per_total_rec)})

