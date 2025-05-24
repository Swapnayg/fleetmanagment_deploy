import datetime
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from chartofAccount import ChartOfAccount
from goodsnlc import GoodsNlc
from ledger import Ledger
from oilpso import OilPso
from party import Party
from partybill import PartyBill
from vehicles import Vehicles
from extensions import db
from sqlalchemy import and_, extract, text

api9 = Blueprint('api9', __name__)

def sum_array(arr):
    total = sum(arr)
    return total

@api9.route('/oils_dashboard_data/<userid>', methods=['GET'])
def oils_dashboard_index(userid): 
    today = datetime.datetime.now()
    start_of_week = today - datetime.timedelta(days=today.weekday())
    lw_today = start_of_week - datetime.timedelta(days=1)
    start_of_week = start_of_week.strftime("%Y-%m-%d")
    today = today.strftime("%Y-%m-%d")
    lw_start_of_week = lw_today - datetime.timedelta(days=lw_today.weekday())
    lw_today = lw_today.strftime("%Y-%m-%d")
    lw_start_of_week = lw_start_of_week.strftime("%Y-%m-%d")
    mani_count_diff = 0
    mani_count_status = 0
    veh_count_diff = 0
    veh_count_status = 0
    freight_count_diff = 0
    freight_count_status = 0
    veh_freight_count_diff = 0
    veh_freight_count_status = 0
    comm_count_diff = 0
    comm_count_status = 0
    cw_goods_txt = text("SELECT * FROM public.oil_pso Where userid = "+str(userid)+" AND datetime >= '"+ start_of_week +"' AND datetime <= '"+today+"'") 
    cw_goods = db.session.execute(cw_goods_txt)
    lw_goods_txt = text("SELECT * FROM public.oil_pso Where userid = "+str(userid)+" AND datetime >= '"+ lw_start_of_week +"' AND datetime <= '"+lw_today+"'") 
    lw_goods = db.session.execute(lw_goods_txt)  
    
    cw_vehicle_txt = text("SELECT DISTINCT (vehicle) FROM oil_pso Where userid = "+str(userid)+" AND datetime >= '"+ start_of_week +"' AND datetime <= '"+today+"'") 
    cw_vehicle = db.session.execute(cw_vehicle_txt)
    lw_vehicle_txt = text("SELECT DISTINCT (vehicle) FROM oil_pso Where userid = "+str(userid)+" AND datetime >= '"+ lw_start_of_week +"' AND datetime <= '"+lw_today+"'") 
    lw_vehicle = db.session.execute(lw_vehicle_txt) 
    
    cw_goods_count = 0 
    lw_goods_count = 0
    cw_vehicles_count = 0 
    lw_vehicles_count = 0
    cw_freight_count = 0 
    lw_freight_count = 0
    cw_veh_freight_count = 0 
    lw_veh_freight_count = 0
    cw_comm_count = 0 
    lw_comm_count = 0
    for i, good in enumerate(cw_goods):
        cw_goods_count += 1
        cw_freight_count += int(good.freight)
        cw_veh_freight_count += int(good.vehicle_freight)
        cw_comm_count += int(good.commission)
    for j, lgood in enumerate(lw_goods):
        lw_goods_count += 1
        lw_freight_count += int(lgood.freight)
        lw_veh_freight_count += int(lgood.vehicle_freight)
        lw_comm_count += int(lgood.commission)
    for i, veh in enumerate(cw_vehicle):
        cw_vehicles_count += 1
    for j, veh in enumerate(lw_vehicle):
        lw_vehicles_count += 1
    freight_count_diff = lw_freight_count - cw_freight_count
    if(cw_freight_count > lw_freight_count):
        freight_count_status = "high"
    else:
        freight_count_status = "low"
    comm_count_diff = lw_comm_count - cw_comm_count
    if(cw_comm_count > lw_comm_count):
        comm_count_status = "high"
    else:
        comm_count_status = "low"
    veh_freight_count_diff = lw_veh_freight_count - cw_veh_freight_count
    if(cw_veh_freight_count > lw_veh_freight_count):
        veh_freight_count_status = "high"
    else:
        veh_freight_count_status = "low"
    mani_count_diff = lw_goods_count - cw_goods_count
    if(cw_goods_count > lw_goods_count):
        mani_count_status = "high"
    else:
        mani_count_status = "low"
    veh_count_diff = lw_vehicles_count - cw_vehicles_count
    if(cw_vehicles_count > lw_vehicles_count):
        veh_count_status = "high"
    else:
        veh_count_status = "low"
    chart_of_party_txt = text("SELECT id,accnt_name,networth, MAX(networth) FROM public.chart_of_accounts Where userid = "+str(userid)+" AND account_mode = 'party' GROUP BY id limit 10;") 
    chart_of_party = db.session.execute(chart_of_party_txt)
    chart_party_data = []
    for chart_party in chart_of_party:
        get_Party = Party.query.filter(Party.chart_accnt == int(chart_party.id)).one()
        if(str(get_Party.type).strip() == "oil"):
            chart_party_data.append({"partyId":chart_party.id,"partyName":chart_party.accnt_name,"partyNetworth":chart_party.networth  })
    chart_of_veh_txt = text("SELECT id,accnt_name,networth, MAX(networth) FROM public.chart_of_accounts Where userid = "+str(userid)+" AND account_mode = 'vehicle' GROUP BY id limit 10;") 
    chart_of_veh = db.session.execute(chart_of_veh_txt)
    chart_veh_data = []
    for chart_veh in chart_of_veh:
        get_Vehicle = Vehicles.query.filter(Vehicles.chart_accnt == int(chart_veh.id)).one()
        if(str(get_Vehicle.veh_type).strip() == "oil"):
            chart_veh_data.append({"vehId":chart_veh.id,"vehName":chart_veh.accnt_name,"vehNetworth":chart_veh.networth  })
    manifest_data = []        
    trans_data = [] 
    mani_details = db.session.query(OilPso).filter(OilPso.userid == userid).order_by(OilPso.datetime.asc()).limit(10).all()
    for mani in mani_details:
        manifest_data.append(mani.map())    
    ledger_data_txt = text("SELECT * FROM ledger WHERE userid = "+str(userid)+" AND ledger_credit_amount != '0' AND (ledger_bill LIKE 'PBO%' OR ledger_bill LIKE 'OIL_%') order by id desc limit 10;") 
    ledger_data = db.session.execute(ledger_data_txt)
    for ledg_i in ledger_data:
        total_bal = 0
        ledg_bal = 0
        if ("OIL_" in str(ledg_i.ledger_bill).strip()):
            try:
                inv_data = OilPso.query.filter(and_(OilPso.bilty_no == str(ledg_i.ledger_bill).strip(), OilPso.userid == userid)).one()
                if(str(ledg_i.ledger_type).strip() == "vehicle"):
                    total_bal = int(inv_data.vehicle_freight)
                    ledg_bal = total_bal - int(ledg_i.ledger_credit_amount)
                elif(str(ledg_i.ledger_type).strip() == "party"):
                    total_bal = int(inv_data.freight)
                    ledg_bal = total_bal - int(ledg_i.ledger_credit_amount)
                elif(str(ledg_i.ledger_type).strip() == "commission"):
                    total_bal = int(inv_data.commission)
                    ledg_bal = total_bal - int(ledg_i.ledger_credit_amount)
            except:  
                print("not found")
        elif "PBO" in str(ledg_i.ledger_bill).strip():
            try:
                ord_data = PartyBill.query.filter(and_(PartyBill.invoice_no == str(ledg_i.ledger_bill).strip()),PartyBill.userid == userid).one()
                total_bal = ord_data.invoice_balance
                ledg_bal = total_bal - int(ledg_i.ledger_credit_amount)
            except:  
                print("not found")
        trans_data.append({"id":ledg_i.id,"ledg_date":ledg_i.datetime,"ledg_invoice":ledg_i.ledger_bill,"ledg_type":ledg_i.ledger_type,"ledg_method":ledg_i.ledger_method,"ledg_paid":ledg_i.ledger_credit_amount,"ledg_balance":ledg_i.ledger_balance, "total_bal":total_bal})
    wk_freight_data = [0] * 7
    wk_vehicle_data = [0] * 7
    wk_comm_data = [0] * 7
    week_goods_data_txt = text("SELECT datetime,EXTRACT('dow' FROM datetime) as days, sum(CAST(freight AS DECIMAL(10,2))) as sum_freight,sum(CAST(vehicle_freight AS DECIMAL(10,2))) as sum_veh_freight,sum(CAST(commission AS DECIMAL(10,2))) as sum_comm FROM oil_pso WHERE userid = "+str(userid)+" AND datetime >= current_date - interval '7 days' group by datetime order by days;") 
    week_goods = db.session.execute(week_goods_data_txt)
    for gds in week_goods:
        wk_freight_data[int(gds.days)] = round(float(gds.sum_freight))
        wk_vehicle_data[int(gds.days)] = round(float(gds.sum_veh_freight))
        wk_comm_data[int(gds.days)] = round(float(gds.sum_comm))
    return jsonify({"cw_mani_count":cw_goods_count,"mani_count_diff":mani_count_diff,"mani_count_status": mani_count_status, "cw_vehicles_count": cw_vehicles_count,"veh_count_diff":veh_count_diff,"veh_count_status":veh_count_status,"cw_freight_count":cw_freight_count,"freight_count_diff":freight_count_diff,"freight_count_status":freight_count_status, "cw_veh_freight_count":cw_veh_freight_count,"veh_freight_count_diff":veh_freight_count_diff,"veh_freight_count_status":veh_freight_count_status,"cw_comm_count":cw_comm_count, "comm_count_diff":comm_count_diff, "comm_count_status":comm_count_status, "chart_veh_data":chart_veh_data, "chart_party_data":chart_party_data, "trans_data":trans_data, "manifest_data":manifest_data, "wk_freight_data":wk_freight_data, "wk_vehicle_data":wk_vehicle_data,"wk_comm_data":wk_comm_data, "total_wk_freight":sum_array(wk_freight_data), "total_wk_veh_freight":sum_array(wk_vehicle_data), "total_wk_commission":sum_array(wk_comm_data)})

