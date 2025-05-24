import datetime
from io import BytesIO
import textwrap
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
import xlsxwriter
from accountSubTypes import AccountSubTypes
from accountTypes import AccountTypes
from chartofAccount import ChartOfAccount
from ledger import Ledger
from ledger2 import Ledger2
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

api23 = Blueprint('api23', __name__)

class PDF_Trial_Bal():
    def __init__(self):
        super().__init__()
    
        self.width, self.height=A4

    def generation_pdf2(self, path, start_date,end_date,f_st_Date,f_en_Date,cu_Name,userid):
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle(str(cu_Name).strip().capitalize() + " Trial Balance Report")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(297.5, 780,  ' TRIAL BALANCE REPORT')
        
        c.setFillColor(HexColor('#2E75B6'))
        c.setFont('Helvetica-Bold', 10)
        c.drawString(215, 760, 'Company Name: ' + str(cu_Name).strip().capitalize())
        c.drawString(25, 725, "Time Period: "+f_st_Date +" to "+f_en_Date +"")
        
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(22, 680, 555, 30,fill=1,stroke=0)
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 10)

        c.drawCentredString(150 , 690, 'Accounts')
        #c.drawCentredString(480, 700, 'Closing Balance')
        c.drawCentredString(400, 690, 'Total Receivable')
        c.drawCentredString(515, 690, 'Total Payable')
        
        c.setStrokeColor(HexColor('#ffffff'))
        #c.line(420, 690, 200, 690)
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 9)
        netdebit = 0
        netcredit = 0
        account_sub_d = []
        chart_of_acct = []
        ledger_data = []       
        accnt_types = AccountTypes.query.filter(AccountTypes.username == 'admin').all()
        accnt_data = []
        for a_type in accnt_types:
            accnt_data.append(a_type.map())
        line_y = 700
        row = len(accnt_data)
        c.setLineWidth(0.1)
        for i in range(row):
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
                    sub_debit = 0
                    sub_credit = 0
                    sub_balance = 0
                    type_list = []
                    coa_details =  ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_type == sub_acc.id,ChartOfAccount.userid == userid )).all()
                    for coa_d in coa_details:
                        chart_of_acct.append(coa_d.map())
                        ledg_debit = 0
                        ledg_credit = 0
                        ledg_balance = int(coa_d.networth)
                        sub_balance += int(coa_d.networth)
                        if(int(coa_d.networth) < 0):
                            ledg_debit = abs(int(coa_d.networth))
                            sub_debit += abs(int(coa_d.networth))
                        else:
                            ledg_credit = abs(int(coa_d.networth))
                            sub_credit += abs(int(coa_d.networth))
                        ledger_data.append({"id":coa_d.id, "ledger_account_no":coa_d.accnt_type,"ledger_account_name":coa_d.accnt_name, "ledger_debit_amount":ledg_debit, "ledger_credit_amount":ledg_credit, "ledger_balance_amount":ledg_balance, "ledger_type":str(coa_d.account_mode).strip()})
                    account_sub_d.append({"id":sub_acc.id, "type_name_id":sub_acc.type_name_id, "sub_type_name":sub_acc.sub_type_name, "sub_debit_val":sub_debit, "sub_credit_val":sub_credit, "sub_balance_val":sub_balance, "sub_types":type_list})
                line_y = line_y - 20
                for j in range(len(account_sub_d)):
                    if(int(accnt_data[i]["id"]) == int(account_sub_d[j]["type_name_id"])):
                        if line_y <= 30 and line_y >= 0:
                            c.showPage()
                            c.setFont('Helvetica-Bold', 8)
                            line_y = 780

                        else:
                            netdebit = netdebit + int(str(account_sub_d[j]["sub_debit_val"]).strip())
                            netcredit = netcredit + int(str(account_sub_d[j]["sub_credit_val"]).strip())
                            c.setFillColor(HexColor('#DAE3F3'))
                            c.rect(24, line_y - 40, 550, 20, fill=1 ,stroke=1)
                            c.setFillColor(HexColor('#000000'))
                            c.setFont('Helvetica-Bold', 9)
                            c.drawString(50, line_y - 33, str(account_sub_d[j]["sub_type_name"]).strip())
                            c.drawRightString(420, line_y - 33, format(float(str(account_sub_d[j]["sub_debit_val"]).strip()), ","))
                            c.drawRightString(535, line_y - 33, format(float(str(account_sub_d[j]["sub_credit_val"]).strip()), ","))
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
                                    c.drawRightString(420, line_y - 33, format(float(str(ledger_data[k]["ledger_debit_amount"]).strip()), ","))
                                    c.drawRightString(535, line_y - 33, format(float(str(ledger_data[k]["ledger_credit_amount"]).strip()), ","))
                                    line_y = line_y - 20
                
        c.setFillColor(HexColor('#2E75B6'))
        c.rect(24, line_y-50, 550, 25, fill=1 ,stroke=1)
        c.setFillColor(HexColor('#ffffff'))
        c.drawCentredString(200, line_y - 40, str("Total").strip())
        c.drawCentredString(420, line_y - 40,   format(float(str(netdebit).strip()), ","))    
        c.drawCentredString(535, line_y - 40,   format(float(str(netcredit).strip()), ","))                          
        c.showPage()
        c.save()


@api23.route('/generateTrial_Bal_pdf', methods = ['POST'])
def generateTrial_Bal_pdf():
    data = request.get_json()
    userid = int(data['userid'])
    pdf = PDF_Trial_Bal()
    buffer = BytesIO()
    report = pdf.generation_pdf2(buffer,data['startDate'],data['endDate'],data['f_st_date'],data['f_en_date'],data['cust_Name'],userid)
    buffer.seek(0)
    return send_file(buffer, download_name='profit_loss_report.pdf',as_attachment=True)


@api23.route('/generatTrial_Balance_Excel', methods = ['POST'])
def generateTrial_excel():
    data = request.get_json()
    userid = int(data['userid'])
    netdebit = 0
    netcredit = 0
    account_sub_d = []
    chart_of_acct = []
    ledger_data = []
    start_date = str(data['startDate']).strip()
    end_date = str(data['endDate']).strip()
    buffer = BytesIO()
    workbook = xlsxwriter.Workbook(buffer)
    worksheet = workbook.add_worksheet('Trial Balance Report')
    right_align_format = workbook.add_format({'align': 'right'})
    
    worksheet.write('A1', '')
    worksheet.write('A2', 'TRIAL BALANCE REPORT')
    worksheet.write('A3', '')
    worksheet.write('A4', 'Company Name: ' + str(data['cust_Name']).strip().capitalize())
    worksheet.write('A5', 'Time Period: ' +str(data['f_st_date']).strip() +" to "+str(data['f_en_date']).strip())
    worksheet.write('A6', '')
    worksheet.write('A7', 'Accounts')
    worksheet.write('B7', 'Total Receivable')
    worksheet.write('C7', 'Total Payable')
    accnt_types = AccountTypes.query.filter(AccountTypes.username == 'admin').all()
    accnt_data = []
    for a_type in accnt_types:
        accnt_data.append(a_type.map())
    row_no = 7
    for row, data in enumerate(accnt_data):
        worksheet.write(row_no, 0, str(accnt_data[row]["type_name"]).strip())
        row_no = row_no + 1
        acct_sub =  AccountSubTypes.query.filter(and_(AccountSubTypes.type_name_id == int(str(accnt_data[row]["id"]).strip()))).all()
        for sub_acc in acct_sub:
            sub_debit = 0
            sub_credit = 0
            sub_balance = 0
            type_list = []
            coa_details =  ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_type == sub_acc.id,ChartOfAccount.userid == userid )).all()
            for coa_d in coa_details:
                chart_of_acct.append(coa_d.map())
                ledg_debit = 0
                ledg_credit = 0
                ledg_balance = int(coa_d.networth)
                sub_balance += int(coa_d.networth)
                if(int(coa_d.networth) < 0):
                    ledg_debit = abs(int(coa_d.networth))
                    sub_debit += abs(int(coa_d.networth))
                else:
                    ledg_credit = abs(int(coa_d.networth))
                    sub_credit += abs(int(coa_d.networth)) 
                ledger_data.append({"id":coa_d.id, "ledger_account_no":coa_d.accnt_type,"ledger_account_name":coa_d.accnt_name, "ledger_debit_amount":ledg_debit, "ledger_credit_amount":ledg_credit, "ledger_balance_amount":ledg_balance, "ledger_type":str(coa_d.account_mode).strip()})
            account_sub_d.append({"id":sub_acc.id, "type_name_id":sub_acc.type_name_id, "sub_type_name":sub_acc.sub_type_name, "sub_debit_val":sub_debit, "sub_credit_val":sub_credit, "sub_balance_val":sub_balance, "sub_types":type_list})
        for j in range(len(account_sub_d)):
            if(int(str(accnt_data[row]["id"]).strip())== int(account_sub_d[j]["type_name_id"])):
                netdebit = netdebit + int(str(account_sub_d[j]["sub_debit_val"]).strip())
                netcredit = netcredit + int(str(account_sub_d[j]["sub_credit_val"]).strip())
                worksheet.write(row_no, 0, "      " + str(account_sub_d[j]["sub_type_name"]).strip())
                worksheet.write(row_no, 1, str(account_sub_d[j]["sub_debit_val"]).strip(),right_align_format)
                worksheet.write(row_no, 2, str(account_sub_d[j]["sub_credit_val"]).strip(),right_align_format)
                row_no = row_no + 1
                for k in range(len(ledger_data)):
                    if(int(account_sub_d[j]["id"]) ==int(ledger_data[k]["ledger_account_no"]) ):
                        worksheet.write(row_no, 0, "            " +str(ledger_data[k]["ledger_account_name"]).strip().capitalize())
                        worksheet.write(row_no, 1, str(ledger_data[k]["ledger_debit_amount"]).strip(),right_align_format)
                        worksheet.write(row_no, 2, str(ledger_data[k]["ledger_credit_amount"]).strip(),right_align_format)
                        row_no = row_no + 1
       
    worksheet.write(row_no + 2, 0, "Total")    
    worksheet.write(row_no + 2, 1, netdebit, right_align_format)  
    worksheet.write(row_no + 2, 2, netcredit, right_align_format)  
    workbook.close()

    buffer.seek(0)
    return send_file(buffer,mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',download_name='data.xlsx',as_attachment=True)

