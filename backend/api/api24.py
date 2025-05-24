import datetime
from io import BytesIO
import textwrap
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from accountSubTypes import AccountSubTypes
from chartofAccount import ChartOfAccount
from clients import Clients
from goodsnlc import GoodsNlc
from ledger import Ledger
from ledger2 import Ledger2
from oilpso import OilPso
from supplier import Supplier
from tblInvoice import TblInvoice
from tblOrder import TblOrder
from vehicles import Vehicles
from extensions import db
from sqlalchemy import and_, insert, text
from reportlab.pdfgen import canvas
from reportlab.platypus import (SimpleDocTemplate, Paragraph, PageBreak, Image, Spacer, Table, TableStyle)
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.pagesizes import LETTER, inch, A4
from reportlab.lib import colors
from reportlab.graphics.shapes import Line, LineShape, Drawing
from reportlab.lib.colors import Color
from reportlab.lib import colors
from reportlab.lib.colors import HexColor

api24 = Blueprint('api24', __name__)

@api24.route('/get_sales_report_data', methods=['POST']) 
def get_sales_report_index(): 
    data = request.get_json()
    start_date = (data['t_date_from'])
    end_date = (data['t_date_to'])
    userid = int(data['userid'])
    sales_data = []
    invoice_list = TblInvoice.query.filter(and_(TblInvoice.userid == userid,TblInvoice.datetime >= start_date, TblInvoice.datetime <= end_date)).order_by(TblInvoice.id.asc()).all()
    for invoice in invoice_list:
        total_amt = float(invoice.grand_total)
        paid_amt = 0.0
        rem_amt = 0.0
        bal_amt = 0.0
        all_ledger_data = Ledger2.query.filter(and_(Ledger2.userid == userid,Ledger2.ledger_bill == str(invoice.invoice_num).strip())).order_by(Ledger2.id.desc()).limit(1).all()
        for ledg in all_ledger_data:
            sales_data.append({"id":invoice.id,"date":invoice.invoice_date ,"invoiceNo":invoice.invoice_num,"clientName":invoice.client_name.client_name,"paidAmt":str(ledg.ledger_credit_amount),"rmnAmt":str(round(rem_amt, 2)),"balAmt":str(ledg.ledger_balance)})
    return jsonify(sales_data)

@api24.route('/get_purchase_report_data', methods=['POST']) 
def get_purch_report_index(): 
    data = request.get_json()
    start_date = (data['t_date_from'])
    end_date = (data['t_date_to'])
    userid = int(data['userid'])
    sales_data = []
    order_list = TblOrder.query.filter(and_(TblOrder.userid == userid,TblOrder.datetime >= start_date, TblOrder.datetime <= end_date)).order_by(TblOrder.id.asc()).all()
    for invoice in order_list:
        total_amt = float(invoice.grand_total)
        all_ledger_data = Ledger2.query.filter(and_(Ledger2.userid == userid,Ledger2.ledger_bill == str(invoice.order_num).strip())).all()
        paid_amt = 0
        debit_amt = 0
        rem_amt = 0
        for leg in all_ledger_data:
            paid_amt = paid_amt + float(leg.ledger_credit_amount)
            debit_amt = debit_amt + int(leg.ledger_debit_amount)
            bal_amt = debit_amt - (paid_amt)
            rem_amt = debit_amt - total_amt
            if(rem_amt < 1):
                rem_amt = 0
        sales_data.append({"id":invoice.id,"date":invoice.order_date ,"invoiceNo":invoice.order_num,"clientName":invoice.supplier_name.suppl_name,"paidAmt":str(round(paid_amt, 2)),"rmnAmt":str(round(rem_amt, 2)),"balAmt":str(round(bal_amt, 2))})
    return jsonify(sales_data)

@api24.route('/get_bank_stat_report_data', methods=['POST']) 
def get_bank_state_report_index(): 
    data = request.get_json()
    start_date = (data['t_date_from'])
    end_date = (data['t_date_to'])
    userid = int(data['userid'])
    bank_data = []
    accnt_sub_type = AccountSubTypes.query.filter(AccountSubTypes.sub_type_name == "Bank Accounts").one()
    coa_list = ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_type == accnt_sub_type.id,ChartOfAccount.userid == userid)).all()
    for coa_d in coa_list:
        balance_amt = 0
        sum_bank_leg = Ledger.query.filter(and_(Ledger.ledger_account_no == coa_d.id ,Ledger.ledger_type == "general")).order_by(Ledger.id.asc()).all()
        for bank_leg in sum_bank_leg:
            balance_amt += int(bank_leg.ledger_credit_amount) - int(bank_leg.ledger_debit_amount)
            bank_data.append({"id":coa_d.id,"date": bank_leg.ledger_gen_date,"accntName":coa_d.accnt_name,"description":bank_leg.ledger_descp,"creditAmt":bank_leg.ledger_credit_amount,"debitAmt":bank_leg.ledger_debit_amount,"balAmt":balance_amt})
    return jsonify(bank_data)


@api24.route('/get_tax_report_data', methods=['POST']) 
def get_tax_report_index(): 
    data = request.get_json()
    start_date = (data['t_date_from'])
    end_date = (data['t_date_to'])
    userid = int(data['userid'])
    tax_data = []
    vehicle_list = Vehicles.query.filter(Vehicles.userid == userid).all()
    for veh in vehicle_list:
        veh_tax = 0
        if(str(veh.veh_type).strip() == 'oil'):  
            qry_pay1 = OilPso.query.filter(and_(OilPso.vehicle == veh.id, OilPso.datetime >= start_date, OilPso.datetime <= end_date)).order_by(OilPso.id.asc()).all()
            for _p1_res in qry_pay1:  
                stk_price = int(_p1_res.quantity) * float(_p1_res.per_ton)
                tax_price = stk_price * float(_p1_res.oils_gst) / 100
                veh_tax += tax_price
        if(str(veh.veh_type).strip()  == 'goods'):
            qry_pay2 = GoodsNlc.query.filter(and_(GoodsNlc.vehicle == veh.id,GoodsNlc.datetime >= start_date, GoodsNlc.datetime <= end_date)).order_by(GoodsNlc.id.asc()).all()
            for _p2_res in qry_pay2:
                stk_price = int(_p2_res.weight) * float(_p2_res.per_ton)
                tax_price = stk_price * float(_p2_res.goods_gst) / 100
                veh_tax += tax_price
        tax_data.append({"id":veh.id,"partyName":veh.vehicle_num,"sellTax":str(round(0.00, 2)),"recTax":str(round(veh_tax, 2))})
    supplier_list = Supplier.query.filter(Supplier.userid == userid).all()
    for supp in supplier_list:
        suppl_tax = 0
        qry_supp = TblOrder.query.filter(and_(TblOrder.supplier_id == supp.id, TblOrder.datetime >= start_date, TblOrder.datetime <= end_date)).order_by(TblOrder.id.asc()).all()
        for _p3_res in qry_supp:  
            suppl_tax += float(_p3_res.total_tax)
        tax_data.append({"id":supp.id,"partyName":supp.suppl_name,"sellTax":str(round(suppl_tax, 2)),"recTax":str(round(0.00, 2))})
    customer_list = Clients.query.filter(Clients.userid == userid).all()
    for cust in customer_list:
        cust_tax = 0
        qry_cust = TblInvoice.query.filter(and_(TblInvoice.client_id == cust.id, TblInvoice.datetime >= start_date, TblInvoice.datetime <= end_date)).order_by(TblInvoice.id.asc()).all()
        for _p4_res in qry_cust:  
            cust_tax += float(_p4_res.total_tax)
        tax_data.append({"id":cust.id,"partyName":cust.client_name,"sellTax":str(round(0.00, 2)),"recTax":str(round(cust_tax, 2))})
    return jsonify(tax_data)
