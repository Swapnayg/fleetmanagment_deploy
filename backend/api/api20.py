import datetime
from io import BytesIO
import textwrap
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from accountSubTypes import AccountSubTypes
from chartofAccount import ChartOfAccount
from clnStkRtnItems import ClientReturnItems
from invoiceItems import InvoiceItems
from ledger import Ledger
from ledger2 import Ledger2
from purchItems import PurchItems
from returnItems import ReturnItems
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

api20 = Blueprint('api20', __name__)

class PDF_StkDetailsReport():
    def __init__(self):
        super().__init__()
        self.width, self.height=A4
    def generation_pdf(self, path, start_date,end_date,f_st_Date,f_en_Date,cu_Name,userid):
        sales_data = []
        tot_big_qty = 0
        tot_qty_in = 0
        tot_pur_amt = 0
        tot_qty_out = 0
        tot_sale_amt = 0
        prod_list = TblProduct.query.filter(and_(TblProduct.userid == userid,TblProduct.datetime >= start_date, TblProduct.datetime <= end_date)).order_by(TblProduct.id.asc()).all()
        for prd in prod_list:
            big_qty = 0
            stk_out = 0
            inv_qty = 0
            ord_qty = 0
            stk_rtn = 0
            cl_stk_rtn = 0
            inv_items = InvoiceItems.query.filter(InvoiceItems.item_product == prd.id).all()
            for itm in inv_items:
                inv_qty = inv_qty + int(itm.item_qnty)
            ord_items = PurchItems.query.filter(PurchItems.item_product == prd.id).all()
            for o_itm in ord_items:
                ord_qty = ord_qty + int(o_itm.item_qnty)
            stk_rtn_items = ReturnItems.query.filter(ReturnItems.item_product == prd.id).all()
            for stk_itm in stk_rtn_items:
                stk_rtn = stk_rtn + int(stk_itm.item_qnty)
            cl_stk_rtn_items = ClientReturnItems.query.filter(ClientReturnItems.item_product == prd.id).all()
            for cl_stk_itm in cl_stk_rtn_items:
                cl_stk_rtn = cl_stk_rtn + int(cl_stk_itm.item_qnty)
            total_out = inv_qty + stk_rtn
            total_in = ord_qty + cl_stk_rtn
            stk_out = total_out
            big_qty = int(prd.product_stock) +  total_out
            tot_big_qty += big_qty
            tot_qty_in += int(prd.product_stock)
            tot_pur_amt += int(prd.product_whole_price)
            tot_qty_out += stk_out
            tot_sale_amt += int(prd.product_rental)
            sales_data.append({"id":prd.id,"prd_Name":prd.product_name ,"beg_Qty":big_qty,"in_qty":prd.product_stock,"pur_Amt":prd.product_whole_price,"out_qty":stk_out,"sale_Amt":prd.product_rental,"cls_qty":prd.product_stock})
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle(str(cu_Name).strip().capitalize() + "STOCK DETAILS REPORT")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(310, 780,  ' STOCK DETAILS REPORT')
        
        c.setFillColor(HexColor('#2E75B6'))
        c.setFont('Helvetica-Bold', 10)
        c.drawString(240, 760, 'Company Name: ' + str(cu_Name).strip().capitalize())
        c.drawString(25, 725, "Time Period: "+f_st_Date +" to "+f_en_Date +"")
        
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(22, 680, 555, 30,fill=1,stroke=0)
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 9)

        c.drawCentredString(50 , 690, 'SL.')
        c.drawCentredString(100, 690, 'Item Name')
        c.drawCentredString(170, 690, 'Qty In')
        c.drawCentredString(250, 690, 'Purchase Amt.')
        c.drawCentredString(330, 690, 'Qty Out')
        c.drawCentredString(430 , 690, 'Sale Amt.')
        c.drawCentredString(530, 690, 'Closing Qty')

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
                c.drawCentredString(100, line_y, str(sales_data[i]["prd_Name"]).strip().capitalize())
                c.drawCentredString(170, line_y, str(sales_data[i]["in_qty"]).strip())
                c.drawCentredString(250, line_y,str(sales_data[i]["pur_Amt"]).strip().capitalize())
                c.drawCentredString(330, line_y, str(sales_data[i]["out_qty"]).strip())
                c.drawCentredString(430 , line_y, str(sales_data[i]["sale_Amt"]).strip())
                c.drawCentredString(530, line_y, str(sales_data[i]["cls_qty"]).strip())
                line_y = line_y - 7
                c.line(24, line_y, 571, line_y)
        
        line_y = line_y - 15
        c.setFillColor(HexColor('#2E75B6'))
        c.rect(22, line_y-20, 555, 30,fill=1,stroke=0) 
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 8)
        c.drawString(80, line_y - 10, str("Total").strip())
        c.drawCentredString(170, line_y - 10, str(tot_qty_in).strip())
        c.drawCentredString(250, line_y - 10,"Rs. " + str(tot_pur_amt).strip().capitalize())
        c.drawCentredString(350, line_y - 10, str(tot_qty_out).strip())
        c.drawCentredString(450, line_y - 10, "Rs. " + str(tot_sale_amt).strip())
        c.drawCentredString(550, line_y - 10, str(tot_qty_in).strip())

        
        #c.line(24, line_y-15, 571, line_y-15)
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


@api20.route('/generateStkDetailsReport_pdf', methods = ['POST'])
def generateStkDetails_pdf():
    data = request.get_json()
    userid = int(data['userid'])
    pdf = PDF_StkDetailsReport()
    buffer = BytesIO()
    report = pdf.generation_pdf(buffer,data['startDate'],data['endDate'],data['f_st_date'],data['f_en_date'],data['cust_Name'],userid)
    buffer.seek(0)
    return send_file(buffer, download_name='stk_details_report.pdf',as_attachment=True)


class PDF_BankStatementReport():
    def __init__(self):
        super().__init__()
        self.width, self.height=A4
    def generation_pdf(self, path, start_date,end_date,f_st_Date,f_en_Date,cu_Name,userid):
        sales_data = []
        tot_deb_amt = 0
        tot_crd_amt = 0
        tot_bal_amt = 0
        accnt_sub_type = AccountSubTypes.query.filter(AccountSubTypes.sub_type_name == "Bank Accounts").one()
        coa_list = ChartOfAccount.query.filter(and_(ChartOfAccount.accnt_type == accnt_sub_type.id,ChartOfAccount.userid == userid)).all()
        for coa_d in coa_list:
            balance_amt = 0
            sum_bank_leg = Ledger.query.filter(and_(Ledger.ledger_account_no == coa_d.id ,Ledger.ledger_type == "general")).order_by(Ledger.id.asc()).all()
            for bank_leg in sum_bank_leg:
                balance_amt += int(bank_leg.ledger_credit_amount) - int(bank_leg.ledger_debit_amount)
                tot_deb_amt += int(bank_leg.ledger_debit_amount)
                tot_crd_amt += int(bank_leg.ledger_credit_amount)
                tot_bal_amt += balance_amt
                sales_data.append({"id":coa_d.id,"sale_date": bank_leg.ledger_gen_date,"accntName":coa_d.accnt_name,"description":bank_leg.ledger_descp,"creditAmt":bank_leg.ledger_credit_amount,"debitAmt":bank_leg.ledger_debit_amount,"balAmt":balance_amt})
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle(str(cu_Name).strip().capitalize() + "BANK STATEMENT REPORT")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(310, 780,  ' BANK STATEMENT REPORT')
        
        c.setFillColor(HexColor('#2E75B6'))
        c.setFont('Helvetica-Bold', 10)
        c.drawString(240, 760, 'Company Name: ' + str(cu_Name).strip().capitalize())
        c.drawString(25, 725, "Time Period: "+f_st_Date +" to "+f_en_Date +"")
        
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(22, 680, 555, 30,fill=1,stroke=0)
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 9)

        c.drawCentredString(50 , 690, 'SL.')
        c.drawCentredString(100, 690, 'Date')
        c.drawCentredString(170, 690, 'Name')
        c.drawCentredString(250, 690, 'Description')
        c.drawCentredString(370, 690, 'Withdrawal Amt.')
        c.drawCentredString(450 , 690, 'Deposit Amt.')
        c.drawCentredString(530, 690, 'Balance Amt.')

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
                dt_format = '%Y-%m-%d'
                inv_date = datetime.datetime.strptime(str(sales_data[i]["sale_date"]), dt_format)
                c.drawCentredString(50 , line_y, str(i+1))
                c.drawCentredString(100, line_y, str(inv_date.strftime("%d/%m/%Y")).strip())
                c.drawString(150, line_y, str(sales_data[i]["accntName"]).strip().capitalize())
                c.drawString(230, line_y,str(sales_data[i]["description"]).strip().capitalize())
                c.drawRightString(390, line_y, "Rs. " + str(sales_data[i]["debitAmt"]).strip())
                c.drawRightString(470 , line_y, "Rs. " + str(sales_data[i]["creditAmt"]).strip())
                c.drawRightString(560, line_y, "Rs. " + str(sales_data[i]["balAmt"]).strip())
                line_y = line_y - 7
                c.line(24, line_y, 571, line_y)
        
        line_y = line_y - 15
        c.setFillColor(HexColor('#2E75B6'))
        c.rect(22, line_y-20, 555, 30,fill=1,stroke=0) 
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 8)
        c.drawString(80, line_y - 10, str("Total").strip())
        c.drawRightString(390, line_y - 10, "Rs. " + str(tot_deb_amt).strip())
        c.drawRightString(470 , line_y - 10, "Rs. " + str(tot_crd_amt).strip())
        c.drawRightString(560, line_y - 10, "Rs. " + str(tot_bal_amt).strip())
        
        c.line(24, line_y-20, 571, line_y-20)
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

@api20.route('/generateBankStaReport_pdf', methods = ['POST'])
def generateBankStatement_pdf():
    data = request.get_json()
    userid = int(data['userid'])
    pdf = PDF_BankStatementReport()
    buffer = BytesIO()
    report = pdf.generation_pdf(buffer,data['startDate'],data['endDate'],data['f_st_date'],data['f_en_date'],data['cust_Name'],userid)
    buffer.seek(0)
    return send_file(buffer, download_name='bank_statement_report.pdf',as_attachment=True)

class PDF_AllTransactionsReport():
    def __init__(self):
        super().__init__()
        self.width, self.height=A4
    def generation_pdf(self, path, start_date,end_date,f_st_Date,f_en_Date,cu_Name,partyType,userid):
        sales_data = []
        tot_deb_amt = 0
        tot_crd_amt = 0
        tot_bal_amt = 0
        cashbook_d = db.session.query(Ledger).filter(and_(Ledger.userid == userid, Ledger.datetime >= start_date, Ledger.datetime <= end_date)).order_by(Ledger.id.asc()).all()
        for cashbk in cashbook_d:
            sales_data.append(cashbk.map())
        inv_cus_d = db.session.query(Ledger2).filter(and_(Ledger2.userid == userid, Ledger2.datetime >= start_date, Ledger2.datetime <= end_date)).order_by(Ledger2.id.asc()).all()
        for ledg in inv_cus_d:
            sales_data.append(ledg.map())
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle(str(cu_Name).strip().capitalize() + "ALL TRANSACTIONS REPORT")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(310, 780,  ' ALL TRANSACTIONS REPORT')
        
        c.setFillColor(HexColor('#2E75B6'))
        c.setFont('Helvetica-Bold', 10)
        c.drawString(240, 760, 'Company Name: ' + str(cu_Name).strip().capitalize())
        c.drawString(25, 725, "Time Period: "+f_st_Date +" to "+f_en_Date +"")
        
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(22, 680, 555, 30,fill=1,stroke=0)
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 9)

        c.drawCentredString(50 , 690, 'SL.')
        c.drawCentredString(100, 690, 'Account')
        c.drawCentredString(170, 690, 'Date')
        c.drawCentredString(230, 690, 'Description')
        c.drawCentredString(370, 690, 'Credit')
        c.drawCentredString(450 , 690, 'Debit')
        c.drawCentredString(530, 690, 'Balance')

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
                if(str(partyType).strip() != "all"):
                    if(str(partyType).strip() == str(sales_data[i]["ledger_type"]).strip()):
                        tot_deb_amt += int(str(sales_data[i]["ledger_debit_amount"]).strip())
                        tot_crd_amt += int(str(sales_data[i]["ledger_credit_amount"]).strip())
                        tot_bal_amt += int(str(sales_data[i]["ledger_balance"]).strip())				
                        c.setFont('Times-Roman', 9)
                        c.setFillColor(HexColor('#000000'))
                        c.setStrokeColor(HexColor('#1E4C9C'))
                        line_y = line_y - 13
                        dt_format = '%Y-%m-%d'
                        inv_date = datetime.datetime.strptime(str(sales_data[i]["ledger_gen_date"]), dt_format)
                        c.drawCentredString(50 , line_y, str(i+1))
                        c.drawString(80, line_y, str(sales_data[i]["ledger_account_name"]).strip().capitalize())
                        c.drawString(150, line_y, str(inv_date.strftime("%d/%m/%Y")).strip()) 
                        if len(str(sales_data[i]["ledger_descp"]).strip()) > 40:
                            wrap_text = textwrap.wrap(str(sales_data[i]["ledger_descp"]).strip(), width=40)
                            c.drawString(200, line_y, wrap_text[0])
                            line_y = line_y - 3
                            c.drawString(200, line_y - 13, wrap_text[1])
                            line_y = line_y - 3
                            try:
                                c.drawString(200, line_y - 13, wrap_text[2])
                                line_y = line_y - 3
                            except:
                                print("")
                            try:
                                c.drawString(200, line_y - 13, wrap_text[3])
                                line_y = line_y - 3
                            except:
                                print("")
                            line_y = line_y - 10
                        else:    
                            c.drawString(200, line_y,str(sales_data[i]["ledger_descp"]).strip().capitalize())
                        c.drawRightString(390, line_y, "Rs. " + str(sales_data[i]["ledger_credit_amount"]).strip())
                        c.drawRightString(470 , line_y, "Rs. " + str(sales_data[i]["ledger_debit_amount"]).strip())
                        c.drawRightString(560, line_y, "Rs. " + str(sales_data[i]["ledger_balance"]).strip())
                        line_y = line_y - 7
                        c.line(24, line_y, 571, line_y)
                else:
                    tot_deb_amt += int(str(sales_data[i]["ledger_debit_amount"]).strip())
                    tot_crd_amt += int(str(sales_data[i]["ledger_credit_amount"]).strip())
                    tot_bal_amt += int(str(sales_data[i]["ledger_balance"]).strip())				
                    c.setFont('Times-Roman', 9)
                    c.setFillColor(HexColor('#000000'))
                    c.setStrokeColor(HexColor('#1E4C9C'))
                    line_y = line_y - 13
                    dt_format = '%Y-%m-%d'
                    inv_date = datetime.datetime.strptime(str(sales_data[i]["ledger_gen_date"]), dt_format)
                    c.drawCentredString(50 , line_y, str(i+1))
                    c.drawString(80, line_y, str(sales_data[i]["ledger_account_name"]).strip().capitalize())
                    c.drawString(150, line_y, str(inv_date.strftime("%d/%m/%Y")).strip()) 
                    if len(str(sales_data[i]["ledger_descp"]).strip()) > 40:
                        wrap_text = textwrap.wrap(str(sales_data[i]["ledger_descp"]).strip(), width=40)
                        c.drawString(200, line_y, wrap_text[0])
                        line_y = line_y - 3
                        c.drawString(200, line_y - 13, wrap_text[1])
                        line_y = line_y - 3
                        try:
                            c.drawString(200, line_y - 13, wrap_text[2])
                            line_y = line_y - 3
                        except:
                            print("")
                        try:
                            c.drawString(200, line_y - 13, wrap_text[3])
                            line_y = line_y - 3
                        except:
                            print("")
                        line_y = line_y - 10
                    else:    
                        c.drawString(200, line_y,str(sales_data[i]["ledger_descp"]).strip().capitalize())
                    c.drawRightString(390, line_y, "Rs. " + str(sales_data[i]["ledger_credit_amount"]).strip())
                    c.drawRightString(470 , line_y, "Rs. " + str(sales_data[i]["ledger_debit_amount"]).strip())
                    c.drawRightString(560, line_y, "Rs. " + str(sales_data[i]["ledger_balance"]).strip())
                    line_y = line_y - 7
                    c.line(24, line_y, 571, line_y)
        line_y = line_y - 15
        c.setFillColor(HexColor('#2E75B6'))
        c.rect(22, line_y-20, 555, 30,fill=1,stroke=0) 
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 8)
        c.drawString(80, line_y - 10, str("Total").strip())
        c.drawRightString(390, line_y - 10, "Rs. " + str(tot_deb_amt).strip())
        c.drawRightString(470 , line_y - 10, "Rs. " + str(tot_crd_amt).strip())
        c.drawRightString(560, line_y - 10, "Rs. " + str(tot_bal_amt).strip())
        
        c.line(24, line_y-20, 571, line_y-20)
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


@api20.route('/generateAllTransReport_pdf', methods = ['POST'])
def generateAllTransaction_pdf():
    data = request.get_json()
    pdf = PDF_AllTransactionsReport()
    userid = int(data['userid'])
    buffer = BytesIO()
    report = pdf.generation_pdf(buffer,data['startDate'],data['endDate'],data['f_st_date'],data['f_en_date'],data['cust_Name'],data['party_type'],userid)
    buffer.seek(0)
    return send_file(buffer, download_name='bank_statement_report.pdf',as_attachment=True)


