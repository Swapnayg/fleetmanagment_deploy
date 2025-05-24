import random
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from accountSubTypes import AccountSubTypes
from chartofAccount import ChartOfAccount
from clients import Clients
from ledger import Ledger
from ledger2 import Ledger2
from party import Party
from supplier import Supplier
from vehicles import Vehicles
from extensions import db
from sqlalchemy import and_, insert

class RefreshCOA_Customer():

    def refresh_COA_Customer(c_id):
        get_client_coa = ChartOfAccount.query.filter(ChartOfAccount.id == int(c_id)).one()
        sum_client_leg = Ledger2.query.filter(and_(Ledger2.ledger_account_no == int(c_id),Ledger2.ledger_type == "client" )).order_by(Ledger2.id.asc()).all()
        get_client = Clients.query.filter(and_(Clients.client_name == str(get_client_coa.accnt_name).strip().lower(),Clients.userid == get_client_coa.userid)).one()
        legder_balnce = 0
        for client_leg_result in sum_client_leg:
            legder_balnce += int(client_leg_result.ledger_credit_amount) - int(client_leg_result.ledger_debit_amount) 
        get_client_coa.networth = legder_balnce
        get_client.networth = legder_balnce
        db.session.flush()
        db.session.commit()
        
        
    def refresh_COA_Supplier(s_id):
        get_suppl_coa = ChartOfAccount.query.filter(ChartOfAccount.id == int(s_id)).one()
        sum_suppl_leg = Ledger2.query.filter(and_(Ledger2.ledger_account_no == int(s_id),Ledger2.ledger_type == "supplier" )).order_by(Ledger2.id.asc()).all()
        get_suppl = Supplier.query.filter(and_(Supplier.suppl_name == str(get_suppl_coa.accnt_name).strip().lower(),Supplier.userid == get_suppl_coa.userid)).one()
        legder_balnce = 0
        for suppl_leg_result in sum_suppl_leg:
            legder_balnce += int(suppl_leg_result.ledger_debit_amount) - int(suppl_leg_result.ledger_credit_amount)  
        get_suppl_coa.networth = legder_balnce
        get_suppl.networth = legder_balnce
        db.session.flush()
        db.session.commit()
    
    def refresh_COA_Party(p_id):
        get_party_chart = ChartOfAccount.query.filter(ChartOfAccount.id == int(str(p_id))).one()
        sum_party_leg = Ledger.query.filter(and_(Ledger.ledger_account_no == int(str(p_id)),Ledger.ledger_type == "party" )).order_by(Ledger.id.asc()).all()
        get_party = Party.query.filter(and_(Party.english_name == str(get_party_chart.accnt_name).strip().lower(),Party.userid == get_party_chart.userid)).one()
        legder_balnce = 0
        for party_leg_result in sum_party_leg:
            legder_balnce += int(party_leg_result.ledger_debit_amount) - int(party_leg_result.ledger_credit_amount)
        get_party_chart.networth = -legder_balnce
        get_party.net_amount = -legder_balnce
        db.session.flush()
        db.session.commit()
    
    def refresh_COA_Vehicle(v_id):
        get_vehicle_chart = ChartOfAccount.query.filter(ChartOfAccount.id == int(str(v_id))).one()
        sum_veh_leg = Ledger.query.filter(and_(Ledger.ledger_account_no == int(str(v_id)),Ledger.ledger_type == "vehicle",Ledger.userid == get_vehicle_chart.userid)).order_by(Ledger.id.asc()).all()
        get_vehicle = Vehicles.query.filter(and_(Vehicles.vehicle_num == str(get_vehicle_chart.accnt_name).strip().lower(),Vehicles.userid == get_vehicle_chart.userid)).one()
        legder_balnce = 0
        for veh_leg_result in sum_veh_leg:
            legder_balnce +=  int(veh_leg_result.ledger_credit_amount) - int(veh_leg_result.ledger_debit_amount) 
        get_vehicle_chart.networth = legder_balnce
        get_vehicle.net_worth = legder_balnce
        db.session.flush()
        db.session.commit()
        
    def refresh_COA_Comm(userid):
        accnt_sub_type = AccountSubTypes.query.filter(AccountSubTypes.sub_type_name == "Commission Income").one()
        get_commission = ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_name == str("commission").strip().lower(), ChartOfAccount.accnt_type  ==accnt_sub_type.id, ChartOfAccount.account_mode == 'commission',ChartOfAccount.userid == int(userid))).one()
        sum_comm_leg = Ledger.query.filter(and_(Ledger.ledger_account_no == get_commission.id ,Ledger.ledger_type == "commission")).order_by(Ledger.id.asc()).all()
        legder_balnce = 0
        for comm_leg_result in sum_comm_leg:
            legder_balnce +=  int(comm_leg_result.ledger_credit_amount) - int(comm_leg_result.ledger_debit_amount) 
        get_commission.networth = legder_balnce
        db.session.flush()
        db.session.commit()
        
    def refresh_COA_General(g_id):
        get_general_chart = ChartOfAccount.query.filter(ChartOfAccount.id == int(str(g_id))).one()
        sum_gen_leg = Ledger.query.filter(and_(Ledger.ledger_account_no == get_general_chart.id,Ledger.ledger_type == "general")).order_by(Ledger.id.asc()).all()
        legder_balnce = 0
        for gen_leg_result in sum_gen_leg:
            legder_balnce += int(gen_leg_result.ledger_credit_amount) - int(gen_leg_result.ledger_debit_amount) 
        get_general_chart.networth = legder_balnce
        db.session.flush()
        db.session.commit()