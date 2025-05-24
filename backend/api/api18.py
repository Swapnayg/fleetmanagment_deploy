import datetime
from io import BytesIO
import textwrap
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from accountSubTypes import AccountSubTypes
from accountTypes import AccountTypes
from chartofAccount import ChartOfAccount
from goodsnlc import GoodsNlc
from ledger import Ledger
from ledger2 import Ledger2
from oilpso import OilPso
from tblInvoice import TblInvoice
from tblProduct import TblProduct
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

api18 = Blueprint('api18', __name__)

class PDF_Profit_Loss():
    def __init__(self):
        super().__init__()
    
        self.width, self.height=A4

    def generation_pdf1(self, path, start_date,end_date,f_st_Date,f_en_Date,cu_Name,userid):
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle(str(cu_Name).strip().capitalize() + " Profit Loss Report")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(297.5, 780,  ' PROFIT AND LOSS REPORT')
        
        c.setFillColor(HexColor('#2E75B6'))
        c.setFont('Helvetica-Bold', 10)
        c.drawString(215, 760, 'Company Name: ' + str(cu_Name).strip().capitalize())
        c.drawString(25, 725, "Time Period: "+f_st_Date +" to "+f_en_Date +"")
        
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(22, 680, 555, 30,fill=1,stroke=0)
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 10)

        c.drawCentredString(200 , 690, 'Particulars')
        c.drawCentredString(480, 690, 'Amount')

        c.setStrokeColor(HexColor('#ffffff'))
        #c.line(24, 690, 575, 690)
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 9)
        tax_receive = 0
        tax_payable = 0
        netprofit = 0
        account_sub_d = []
        chart_of_acct = []
        ledger_data = []
        
        qry_rec = TblInvoice.query.filter(and_( TblInvoice.datetime >= start_date, TblInvoice.datetime <= end_date, TblInvoice.userid == userid)).order_by(TblInvoice.id.asc()).all()
        for _res in qry_rec:
            tax_receive +=  float(_res.total_tax)
        
        qry_pay1 = TblProduct.query.filter(and_( TblProduct.datetime >= start_date, TblProduct.datetime <= end_date, TblProduct.userid == userid)).order_by(TblProduct.id.asc()).all()
        for _p1_res in qry_pay1:
            stk_price = int(_p1_res.product_stock) * float(_p1_res.product_whole_price)
            tax_price = stk_price * float(_p1_res.product_tax) / 100
            tax_payable += tax_price
        
        qry_pay2 = GoodsNlc.query.filter(and_(GoodsNlc.userid == userid, GoodsNlc.datetime >= start_date, GoodsNlc.datetime <= end_date)).order_by(GoodsNlc.id.asc()).all()
        for _p2_res in qry_pay2:
            stk_price = int(_p2_res.weight) * float(_p2_res.per_ton)
            tax_price = stk_price * float(_p2_res.goods_gst) / 100
            tax_payable += tax_price
    
        qry_pay3 = OilPso.query.filter(and_( OilPso.userid == userid, OilPso.datetime >= start_date, OilPso.datetime <= end_date)).order_by(OilPso.id.asc()).all()
        for _p3_res in qry_pay3:
            stk_price = int(_p3_res.quantity) * float(_p3_res.per_ton)
            tax_price = stk_price * float(_p3_res.oils_gst) / 100
            tax_payable += tax_price
              
        accnt_types = AccountTypes.query.filter(AccountTypes.username == 'admin').all()
        accnt_data = []
        for a_type in accnt_types:
            accnt_data.append(a_type.map())
        
        line_y = 700

        row = len(accnt_data)
        c.setLineWidth(0.1)

        for i in range(row):
            if(str(accnt_data[i]["type_name"]).strip() == "Incomes" or str(accnt_data[i]["type_name"]).strip() == "Expenses"):
                if line_y <= 30 and line_y >= 0:
                    c.showPage()
                    c.setFont('Helvetica-Bold', 8)
                    line_y = 780

                else:
                    c.setFillColor(HexColor('#8FAADC'))
                    c.rect(24, line_y - 40, 550, 20, fill=1 ,stroke=1)
                    c.setFillColor(HexColor('#000000'))
                    c.setFont('Helvetica-Bold', 9)
                    c.drawString(30, line_y - 33, str(accnt_data[i]["type_name"]).strip())
                    acct_sub =  AccountSubTypes.query.filter(and_(AccountSubTypes.type_name_id == int(accnt_data[i]["id"]))).all()
                    for sub_acc in acct_sub:
                        sub_networth = 0
                        coa_details =  ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_type == sub_acc.id,ChartOfAccount.userid == userid )).all()
                        for coa_d in coa_details:
                            chart_of_acct.append(coa_d.map())
                            sub_networth += int(coa_d.networth)
                            ledg_balance = int(coa_d.networth)
                            ledger_data.append({"id":coa_d.id, "ledger_account_name":coa_d.accnt_name,"ledger_account_no":coa_d.accnt_type, "ledger_balance_amount":ledg_balance, "ledger_type":str(coa_d.account_mode).strip()}) 
                        account_sub_d.append({"id":sub_acc.id, "type_name_id":sub_acc.type_name_id, "sub_type_name":sub_acc.sub_type_name, "sub_networth":sub_networth})
                    line_y = line_y - 20
                    for j in range(len(account_sub_d)):
                        if(int(accnt_data[i]["id"]) == int(account_sub_d[j]["type_name_id"])):
                            if line_y <= 30 and line_y >= 0:
                                c.showPage()
                                c.setFont('Helvetica-Bold', 8)
                                line_y = 780

                            else:
                                netprofit = netprofit + int(str(account_sub_d[j]["sub_networth"]).strip())
                                c.setFillColor(HexColor('#DAE3F3'))
                                c.rect(24, line_y - 40, 550, 20, fill=1 ,stroke=1)
                                c.setFillColor(HexColor('#000000'))
                                c.setFont('Helvetica-Bold', 9)
                                c.drawString(50, line_y - 33, str(account_sub_d[j]["sub_type_name"]).strip())
                                c.drawRightString(550, line_y - 33, format(float(str(account_sub_d[j]["sub_networth"]).strip()), ","))
                                line_y = line_y - 20
                            for k in range(len(ledger_data)):
                                if(int(account_sub_d[j]["id"]) ==int(ledger_data[k]["ledger_account_no"]) ):
                                    if line_y <= 30 and line_y >= 0:
                                        c.showPage()
                                        c.setFont('Helvetica-Bold', 8)
                                        line_y = 780

                                    else:
                                        c.setFillColor(HexColor('#ffffff'))
                                        c.rect(24, line_y - 40, 550, 20, fill=1 ,stroke=1)
                                        c.setFillColor(HexColor('#000000'))
                                        c.setFont('Helvetica-Bold', 9)
                                        c.drawString(70, line_y - 33, str(ledger_data[k]["ledger_account_name"]).strip().capitalize())
                                        c.drawRightString(550, line_y - 33, format(float(str(ledger_data[k]["ledger_balance_amount"]).strip()), ","))
                                        line_y = line_y - 20

        c.setFillColor(HexColor('#8FAADC'))
        c.rect(24, line_y - 40, 550, 20, fill=1 ,stroke=1 )
        c.rect(24, line_y - 60, 550, 20, fill=1, stroke=1 )
        c.setFillColor(HexColor('#000000'))
        c.setFont('Helvetica-Bold', 9)
        c.drawString(30, line_y - 33, str("GST Payable(-)").strip())
        c.drawRightString(550, line_y - 33, format(float(str(tax_payable).strip()), ","))
        c.drawString(30, line_y - 55, str("GST Receivable(+)").strip())
        c.drawRightString(550, line_y - 55, format(float(str(tax_receive).strip()), ","))
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(24, line_y - 85, 550, 25, fill=1 ,stroke=1)
        c.setFillColor(HexColor('#ffffff'))
        if(int(netprofit) < 0):
            netprofit = int(netprofit) - int(tax_receive) + int(tax_payable)
        else:
            netprofit = int(netprofit) + int(tax_receive) - int(tax_payable)
        c.drawCentredString(200, line_y - 75, str("Net Profit (Incomes - Expenses)").strip())
        c.drawCentredString(480, line_y - 75, "Rs " + format(float(str(netprofit).strip()), ","))
        c.showPage()
        c.save()


@api18.route('/generateProfit_Loss_pdf', methods = ['POST'])
def generateProfit_pdf():
    data = request.get_json()
    pdf = PDF_Profit_Loss()
    userid = int(data['userid'])
    buffer = BytesIO()
    report = pdf.generation_pdf1(buffer,data['startDate'],data['endDate'],data['f_st_date'],data['f_en_date'],data['cust_Name'],userid)
    buffer.seek(0)
    return send_file(buffer, download_name='profit_loss_report.pdf',as_attachment=True)

class PDF_Balance_Sheet():
    def __init__(self):
        super().__init__()
    
        self.width, self.height=A4

    def generation_pdf1(self, path, start_date,end_date,f_st_Date,f_en_Date,cu_Name,userid):
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle(str(cu_Name).strip().capitalize() + " Balance Sheet Report")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(297.5, 780,  ' BALANCE SHEET REPORT')
        
        c.setFillColor(HexColor('#2E75B6'))
        c.setFont('Helvetica-Bold', 10)
        c.drawString(215, 760, 'Company Name: ' + str(cu_Name).strip().capitalize())
        c.drawString(25, 725, "Time Period: "+f_st_Date +" to "+f_en_Date +"")

        c.setStrokeColor(HexColor('#ffffff'))
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 9)
        account_sub_d = []
        chart_of_acct = []
        ledger_data = []
                    
        accnt_types = AccountTypes.query.filter(AccountTypes.username == 'admin').all()
        accnt_data = []
        for a_type in accnt_types:
            accnt_data.append(a_type.map())
            
        line_y = 720

        row = len(accnt_data)
        c.setLineWidth(0.1)

        for i in range(row):
            if(str(accnt_data[i]["type_name"]).strip() == "Assets" or str(accnt_data[i]["type_name"]).strip() == "Equities & Liabilities"):
                netprofit = 0
                if line_y <= 30 and line_y >= 0:
                    c.showPage()
                    c.setFont('Helvetica-Bold', 8)
                    line_y = 780

                else:
                    c.setFillColor(HexColor('#8FAADC'))
                    c.rect(24, line_y - 40, 550, 20, fill=1 ,stroke=1)
                    c.setFillColor(HexColor('#000000'))
                    c.setFont('Helvetica-Bold', 9)
                    c.drawString(30, line_y - 33, str(accnt_data[i]["type_name"]).strip())
                    c.drawString(500, line_y - 33, str("Amount").strip())
                    acct_sub =  AccountSubTypes.query.filter(and_(AccountSubTypes.type_name_id == int(accnt_data[i]["id"]))).all()
                    for sub_acc in acct_sub:
                        sub_networth = 0
                        coa_details =  ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_type == sub_acc.id,ChartOfAccount.userid == userid )).all()
                        for coa_d in coa_details:
                            chart_of_acct.append(coa_d.map())
                            if(str(coa_d.account_mode).strip() == "general" or str(coa_d.account_mode).strip() == "vehicle" or str(coa_d.account_mode).strip() == "party" or str(coa_d.account_mode).strip() == "commission"):
                                ledg_balance = 0
                                ledger_details =  Ledger.query.filter(and_(Ledger.ledger_account_no == coa_d.id, Ledger.datetime >= start_date, Ledger.datetime <= end_date)).all()
                                for ledg in ledger_details:
                                    sub_networth += int(ledg.ledger_debit_amount) - int(ledg.ledger_credit_amount)
                                    ledg_balance += int(ledg.ledger_debit_amount) - int(ledg.ledger_credit_amount)
                                ledger_data.append({"id":coa_d.id,"ledger_account_name":coa_d.accnt_name, "ledger_account_no":coa_d.accnt_type, "ledger_balance_amount":ledg_balance, "ledger_type":str(coa_d.account_mode).strip()})    
                            elif(str(coa_d.account_mode).strip() == "client" or str(coa_d.account_mode).strip() == "supplier"):
                                ledg_balance = 0
                                ledger_details2 =  Ledger2.query.filter(and_(Ledger2.ledger_account_no == coa_d.id, Ledger2.datetime >= start_date, Ledger2.datetime <= end_date)).all()
                                for ledg2 in ledger_details2:
                                    sub_networth += int(ledg2.ledger_debit_amount) - int(ledg2.ledger_credit_amount)
                                    ledg_balance += int(ledg2.ledger_debit_amount) - int(ledg2.ledger_credit_amount)  
                                ledger_data.append({"id":coa_d.id, "ledger_account_name":coa_d.accnt_name,"ledger_account_no":coa_d.accnt_type, "ledger_balance_amount":ledg_balance, "ledger_type":str(coa_d.account_mode).strip()}) 
                        
                        account_sub_d.append({"id":sub_acc.id, "type_name_id":sub_acc.type_name_id, "sub_type_name":sub_acc.sub_type_name, "sub_networth":sub_networth})
                    line_y = line_y - 20
                    for j in range(len(account_sub_d)):
                        if(int(accnt_data[i]["id"]) == int(account_sub_d[j]["type_name_id"])):
                            if line_y <= 30 and line_y >= 0:
                                c.showPage()
                                c.setFont('Helvetica-Bold', 8)
                                line_y = 780

                            else:
                                netprofit += float(str(account_sub_d[j]["sub_networth"]).strip())
                                c.setFillColor(HexColor('#DAE3F3'))
                                c.rect(24, line_y - 40, 550, 20, fill=1 ,stroke=1)
                                c.setFillColor(HexColor('#000000'))
                                c.setFont('Helvetica-Bold', 9)
                                c.drawString(50, line_y - 33, str(account_sub_d[j]["sub_type_name"]).strip())
                                c.drawRightString(550, line_y - 33, format(float(str(account_sub_d[j]["sub_networth"]).strip()), ","))
                                line_y = line_y - 20
                            for k in range(len(ledger_data)):
                                if(int(account_sub_d[j]["id"]) ==int(ledger_data[k]["ledger_account_no"]) ):
                                    if line_y <= 30 and line_y >= 0:
                                        c.showPage()
                                        c.setFont('Helvetica-Bold', 8)
                                        line_y = 780
                                    else:
                                        c.setFillColor(HexColor('#ffffff'))
                                        c.rect(24, line_y - 40, 550, 20, fill=1 ,stroke=1)
                                        c.setFillColor(HexColor('#000000'))
                                        c.setFont('Helvetica-Bold', 9)
                                        c.drawString(70, line_y - 33, str(ledger_data[k]["ledger_account_name"]).strip().capitalize())
                                        c.drawRightString(550, line_y - 33, format(float(str(ledger_data[k]["ledger_balance_amount"]).strip()), ","))
                                        line_y = line_y - 20
                                        
                    c.setFillColor(HexColor('#8FAADC'))
                    c.rect(24, line_y - 40, 550, 20, fill=1 ,stroke=1)
                    c.setFillColor(HexColor('#000000'))
                    c.setFont('Helvetica-Bold', 9)
                    c.drawString(30, line_y - 33, "Total " + str(accnt_data[i]["type_name"]).strip())
                    c.drawRightString(550, line_y - 33, "Rs " + format(int(netprofit), ",")),
                    line_y = line_y - 20
        c.showPage()
        c.save()


@api18.route('/generateBalanceSheet_pdf', methods = ['POST'])
def generateBalanceSheet_pdf():
    data = request.get_json()
    userid = int(data['userid'])
    pdf = PDF_Balance_Sheet()
    buffer = BytesIO()
    report = pdf.generation_pdf1(buffer,data['startDate'],data['endDate'],data['f_st_date'],data['f_en_date'],data['cust_Name'],userid)
    buffer.seek(0)
    return send_file(buffer, download_name='balance_sheet_report.pdf',as_attachment=True)
