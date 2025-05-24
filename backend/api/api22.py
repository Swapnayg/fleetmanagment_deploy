import datetime
from io import BytesIO
import textwrap
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
import xlsxwriter
from accountSubTypes import AccountSubTypes
from accountTypes import AccountTypes
from chartofAccount import ChartOfAccount
from clients import Clients
from goodsnlc import GoodsNlc
from ledger import Ledger
from ledger2 import Ledger2
from oilpso import OilPso
from supplier import Supplier
from tblInvoice import TblInvoice
from tblOrder import TblOrder
from tblProduct import TblProduct
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

api22 = Blueprint('api22', __name__)

class PDF_TaxReport():
    def __init__(self):
        super().__init__()
        self.width, self.height=A4
    def generation_pdf(self, path, start_date,end_date,f_st_Date,f_en_Date,cu_Name,userid):
        sales_data = []
        tot_sale_tax = 0
        tot_rec_tax = 0
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
            tot_rec_tax += float(str(round(veh_tax, 2)))
            sales_data.append({"id":veh.id,"partyName":veh.vehicle_num,"sellTax":str(round(0.00, 2)),"recTax":str(round(veh_tax, 2))})
        supplier_list = Supplier.query.filter(Supplier.userid == userid).all()
        for supp in supplier_list:
            suppl_tax = 0
            qry_supp = TblOrder.query.filter(and_(TblOrder.supplier_id == supp.id, TblOrder.datetime >= start_date, TblOrder.datetime <= end_date)).order_by(TblOrder.id.asc()).all()
            for _p3_res in qry_supp:  
                suppl_tax += float(_p3_res.total_tax)
            tot_sale_tax += float(str(round(suppl_tax, 2)))
            sales_data.append({"id":supp.id,"partyName":supp.suppl_name,"sellTax":str(round(suppl_tax, 2)),"recTax":str(round(0.00, 2))})
        customer_list = Clients.query.filter(Clients.userid == userid).all()
        for cust in customer_list:
            cust_tax = 0
            qry_cust = TblInvoice.query.filter(and_(TblInvoice.client_id == cust.id, TblInvoice.datetime >= start_date, TblInvoice.datetime <= end_date)).order_by(TblInvoice.id.asc()).all()
            for _p4_res in qry_cust:  
                cust_tax += float(_p4_res.total_tax)
            tot_rec_tax += float(str(round(cust_tax, 2)))
            sales_data.append({"id":cust.id,"partyName":cust.client_name,"sellTax":str(round(0.00, 2)),"recTax":str(round(cust_tax, 2))})
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle(str(cu_Name).strip().capitalize() + "TAX REPORT")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(310, 780,  ' TAX DETAILS REPORT')
        
        c.setFillColor(HexColor('#2E75B6'))
        c.setFont('Helvetica-Bold', 10)
        c.drawString(240, 760, 'Company Name: ' + str(cu_Name).strip().capitalize())
        c.drawString(25, 725, "Time Period: "+f_st_Date +" to "+f_en_Date +"")
        
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(22, 680, 555, 30,fill=1,stroke=0)
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 9)

        c.drawCentredString(50 , 690, 'SL.')
        c.drawString(100, 690, 'Party Name')
        c.drawCentredString(330, 690, 'Sale Tax')
        c.drawCentredString(450, 690, 'Purchase/Expense Tax')
        c.setStrokeColor(HexColor('#1E4C9C'))
        c.line(24, 675, 575, 675)
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 9)

        line_y = 670

        row = len(sales_data)

        for i in range(row):
            if line_y <= 30 and line_y >= 0:
                c.showPage()
                c.setFont('Helvetica-Bold', 8)
                line_y = 780
            else:
                c.setFont('Times-Roman', 9)
                c.setFillColor(HexColor('#000000'))
                c.setStrokeColor(HexColor('#1E4C9C'))
                line_y = line_y - 13
                c.drawCentredString(50 , line_y, str(i+1))
                c.drawString(100, line_y, str(sales_data[i]["partyName"]).strip().capitalize())
                c.drawRightString(350, line_y, "Rs. " + str(sales_data[i]["sellTax"]).strip())
                c.drawRightString(480, line_y,"Rs. " +  str(sales_data[i]["recTax"]).strip().capitalize())
                line_y = line_y - 7
                c.line(24, line_y, 571, line_y)
        
        line_y = line_y - 15
        c.setFillColor(HexColor('#2E75B6'))
        c.rect(22, line_y-20, 555, 30,fill=1,stroke=0) 
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 8)
        c.drawString(80, line_y - 10, str("Total").strip())
        c.drawRightString(350, line_y - 10, "Rs. " + str(tot_sale_tax).strip())
        c.drawRightString(480, line_y - 10, "Rs. " + str(tot_rec_tax).strip())
        
        c.line(24, line_y-15, 571, line_y-15)
        # footer
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 10)
        c.drawCentredString(297.5, line_y - 80, 'Thank you for your purchase!') 
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 10)
        c.drawString(34, line_y - 130, "Signature of Customer")
        c.drawString(430, line_y - 130, "Signature of Authorized")
        c.line(34, line_y - 145, 130, line_y - 145)
        c.line(430, line_y - 145, 530, line_y - 145)
        c.showPage()
        c.save()

@api22.route('/generateTaxReport_pdf', methods = ['POST'])
def generateTaxRpt_pdf():
    data = request.get_json()
    userid = int(data['userid'])
    pdf = PDF_TaxReport()
    buffer = BytesIO()
    report = pdf.generation_pdf(buffer,data['startDate'],data['endDate'],data['f_st_date'],data['f_en_date'],data['cust_Name'],userid)
    buffer.seek(0)
    return send_file(buffer, download_name='tax_report.pdf',as_attachment=True)

@api22.route('/generateProfit_Loss_Excel', methods = ['POST'])
def generateProfit_excel():
    data = request.get_json()
    userid = int(data['userid'])
    tax_receive = 0
    tax_payable = 0
    netprofit = 0
    account_sub_d = []
    chart_of_acct = []
    ledger_data = []
    start_date = str(data['startDate']).strip()
    end_date = str(data['endDate']).strip()
    buffer = BytesIO()
    workbook = xlsxwriter.Workbook(buffer)
    worksheet = workbook.add_worksheet('Profit And Loss Report')
    right_align_format = workbook.add_format({'align': 'right'})
    
    worksheet.write('A1', '')
    worksheet.write('A2', 'PROFIT AND LOSS REPORT')
    worksheet.write('A3', '')
    worksheet.write('A4', 'Company Name: ' + str(data['cust_Name']).strip().capitalize())
    worksheet.write('A5', 'Time Period: ' +str(data['f_st_date']).strip() +" to "+str(data['f_en_date']).strip())
    
    worksheet.write('A6', '')
    worksheet.write('A7', 'Particulars')
    worksheet.write('B7', 'Amount')
    qry_rec = TblInvoice.query.filter(and_(TblInvoice.userid == userid,TblInvoice.datetime >= start_date, TblInvoice.datetime <= end_date)).order_by(TblInvoice.id.asc()).all()
    for _res in qry_rec:
        tax_receive +=  float(_res.total_tax)
        
    qry_pay1 = TblProduct.query.filter(and_(TblProduct.userid == userid,TblProduct.datetime >= start_date, TblProduct.datetime <= end_date)).order_by(TblProduct.id.asc()).all()
    for _p1_res in qry_pay1:
        stk_price = int(_p1_res.product_stock) * float(_p1_res.product_whole_price)
        tax_price = stk_price * float(_p1_res.product_tax) / 100
        tax_payable += tax_price
        
    qry_pay2 = GoodsNlc.query.filter(and_(GoodsNlc.userid == userid, GoodsNlc.datetime >= start_date, GoodsNlc.datetime <= end_date)).order_by(GoodsNlc.id.asc()).all()
    for _p2_res in qry_pay2:
        stk_price = int(_p2_res.weight) * float(_p2_res.per_ton)
        tax_price = stk_price * float(_p2_res.goods_gst) / 100
        tax_payable += tax_price
    
    qry_pay3 = OilPso.query.filter(and_(OilPso.userid == userid, OilPso.datetime >= start_date, OilPso.datetime <= end_date)).order_by(OilPso.id.asc()).all()
    for _p3_res in qry_pay3:
        stk_price = int(_p3_res.quantity) * float(_p3_res.per_ton)
        tax_price = stk_price * float(_p3_res.oils_gst) / 100
        tax_payable += tax_price
        
    accnt_types = AccountTypes.query.filter(AccountTypes.username == 'admin').all()
    accnt_data = []
    for a_type in accnt_types:
        accnt_data.append(a_type.map())
    accnt_types2 = AccountTypes.query.filter(AccountTypes.userid == userid).all()
    for a_type2 in accnt_types2:
        accnt_data.append(a_type2.map())
        
    row_no = 7
    for row, data in enumerate(accnt_data):
        if(str(accnt_data[row]["type_name"]).strip() == "Incomes" or str(accnt_data[row]["type_name"]).strip() == "Expenses"):
            worksheet.write(row_no, 0, str(accnt_data[row]["type_name"]).strip())
            row_no = row_no + 1
            acct_sub =  AccountSubTypes.query.filter(and_(AccountSubTypes.type_name_id == int(str(accnt_data[row]["id"]).strip()))).all()
            for sub_acc in acct_sub:
                sub_networth = 0
                coa_details =  ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_type == sub_acc.id,ChartOfAccount.userid == userid )).all()
                for coa_d in coa_details:
                    chart_of_acct.append(coa_d.map())
                    sub_networth += int(coa_d.networth)
                    ledg_balance = int(coa_d.networth)
                    ledger_data.append({"id":coa_d.id, "ledger_account_name":coa_d.accnt_name,"ledger_account_no":coa_d.accnt_type, "ledger_balance_amount":ledg_balance, "ledger_type":str(coa_d.account_mode).strip()}) 
                account_sub_d.append({"id":sub_acc.id, "type_name_id":sub_acc.type_name_id, "sub_type_name":sub_acc.sub_type_name, "sub_networth":sub_networth})
            for j in range(len(account_sub_d)):
                if(int(str(accnt_data[row]["id"]).strip())== int(account_sub_d[j]["type_name_id"])):
                    netprofit = netprofit + int(str(account_sub_d[j]["sub_networth"]).strip())
                    worksheet.write(row_no, 0, "      " + str(account_sub_d[j]["sub_type_name"]).strip())
                    worksheet.write(row_no, 1, str(account_sub_d[j]["sub_networth"]).strip(),right_align_format)
                    row_no = row_no + 1
                    for k in range(len(ledger_data)):
                        if(int(account_sub_d[j]["id"]) ==int(ledger_data[k]["ledger_account_no"]) ):
                            worksheet.write(row_no, 0, "            " +str(ledger_data[k]["ledger_account_name"]).strip().capitalize())
                            worksheet.write(row_no, 1, str(ledger_data[k]["ledger_balance_amount"]).strip(),right_align_format)
                            row_no = row_no + 1
    
    worksheet.write(row_no, 0, "Tax Payable(-)")    
    worksheet.write(row_no, 1, tax_payable, right_align_format)  
    worksheet.write(row_no + 1, 0, "Tax Receivable(+)")    
    worksheet.write(row_no + 1, 1, tax_receive, right_align_format)   
    worksheet.write(row_no + 2, 0, "Net Profit (Incomes - Expenses)") 
    if(int(netprofit) < 0):
        netprofit = int(netprofit) - int(tax_receive) + int(tax_payable)
    else:
        netprofit = int(netprofit) + int(tax_receive) - int(tax_payable)
    worksheet.write(row_no + 2, 1, netprofit, right_align_format)  
    workbook.close()

    buffer.seek(0)
    return send_file(buffer,mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',download_name='data.xlsx',as_attachment=True)

@api22.route('/generateBalanceSheet_Excel', methods = ['POST'])
def generateBalance_excel():
    data = request.get_json()
    account_sub_d = []
    chart_of_acct = []
    ledger_data = []
    userid = int(data['userid'])
    start_date = str(data['startDate']).strip()
    end_date = str(data['endDate']).strip()
    buffer = BytesIO()
    workbook = xlsxwriter.Workbook(buffer)
    worksheet = workbook.add_worksheet('Balance Sheet Report')
    right_align_format = workbook.add_format({'align': 'right'})
    
    worksheet.write('A1', '')
    worksheet.write('A2', 'BALANCE SHEET REPORT')
    worksheet.write('A3', '')
    worksheet.write('A4', 'Company Name: ' + str(data['cust_Name']).strip().capitalize())
    worksheet.write('A5', 'Time Period: ' +str(data['f_st_date']).strip() +" to "+str(data['f_en_date']).strip())
    
    worksheet.write('A6', '')
    accnt_types = AccountTypes.query.filter(AccountTypes.username == 'admin').all()
    accnt_data = []
    for a_type in accnt_types:
        accnt_data.append(a_type.map())
    row_no = 6
    for row, data in enumerate(accnt_data):
        if(str(accnt_data[row]["type_name"]).strip() == "Assets" or str(accnt_data[row]["type_name"]).strip() == "Equities & Liabilities"):
            netprofit = 0
            worksheet.write(row_no, 0, str(accnt_data[row]["type_name"]).strip())
            worksheet.write(row_no, 1, str("Amount").strip(),right_align_format)
            row_no = row_no + 1
            acct_sub =  AccountSubTypes.query.filter(and_(AccountSubTypes.type_name_id == int(str(accnt_data[row]["id"]).strip()))).all()
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
            for j in range(len(account_sub_d)):
                if(int(str(accnt_data[row]["id"]).strip())== int(account_sub_d[j]["type_name_id"])):
                    netprofit += float(str(account_sub_d[j]["sub_networth"]).strip())
                    worksheet.write(row_no, 0, "      " + str(account_sub_d[j]["sub_type_name"]).strip())
                    worksheet.write(row_no, 1, str(account_sub_d[j]["sub_networth"]).strip(),right_align_format)
                    row_no = row_no + 1
                    for k in range(len(ledger_data)):
                        if(int(account_sub_d[j]["id"]) ==int(ledger_data[k]["ledger_account_no"]) ):
                            worksheet.write(row_no, 0, "            " +str(ledger_data[k]["ledger_account_name"]).strip().capitalize())
                            worksheet.write(row_no, 1, str(ledger_data[k]["ledger_balance_amount"]).strip(),right_align_format)
                            row_no = row_no + 1
            worksheet.write(row_no, 0, "Total " + str(accnt_data[row]["type_name"]).strip())
            worksheet.write(row_no, 1, str(netprofit).strip(),right_align_format)
            row_no = row_no + 1

    workbook.close()

    buffer.seek(0)
    return send_file(buffer,mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',download_name='data.xlsx',as_attachment=True)

