import datetime
from io import BytesIO
import textwrap
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from clients import Clients
from invoiceItems import InvoiceItems
from ledger2 import Ledger2
from purchItems import PurchItems
from supplier import Supplier
from tblInvoice import TblInvoice
from tblOrder import TblOrder
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

api19 = Blueprint('api19', __name__)

class PDF_SalesReport():
    def __init__(self):
        super().__init__()
    
        self.width, self.height=A4

    def generation_pdf(self, path, start_date,end_date,f_st_Date,f_en_Date,cu_Name,userid):
        sales_data = []
        networth = 0
        invoice_list = TblInvoice.query.filter(and_(TblInvoice.userid == userid,TblInvoice.datetime >= start_date, TblInvoice.datetime <= end_date)).order_by(TblInvoice.id.asc()).all()
        for invoice in invoice_list:
            total_amt = float(invoice.grand_total)
            get_client = Clients.query.get(int(invoice.client_id))
            all_ledger_data = Ledger2.query.filter(and_(Ledger2.userid == userid,Ledger2.ledger_bill == str(invoice.invoice_num).strip())).order_by(Ledger2.id.desc()).limit(1).all()
            paid_amt = 0.0
            rem_amt = 0.0
            bal_amt = 0.0
            inv_status = 'Pending'
            for ledg in all_ledger_data:
                if(int(ledg.ledger_balance) == 0):
                    inv_status = "Paid"
            networth += bal_amt
            sales_data.append({"id":invoice.id,"sale_date":invoice.invoice_date ,"invoiceNo":invoice.invoice_num,"clientName":invoice.client_name.client_name,"clientPhone":get_client.client_phone,"paidAmt":str(ledg.ledger_credit_amount),"rmnAmt":str(round(rem_amt, 2)),"balAmt":str(ledg.ledger_balance), "inv_status":inv_status})
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle(str(cu_Name).strip().capitalize() + " SALES REPORT")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(310, 780,  ' SALES REPORT')
        
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
        c.drawCentredString(150, 690, 'Invoice No')
        c.drawCentredString(220, 690, 'Customer Name')
        c.drawCentredString(300, 690, 'Phone No.')
        c.drawCentredString(370 , 690, 'Credit Amt.')
        c.drawCentredString(440, 690, 'Debit Amt.')
        c.drawCentredString(500, 690, 'Balance')
        c.drawCentredString(550, 690, 'Status')

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
                inv_items = InvoiceItems.query.filter(InvoiceItems.item_invoice == int(sales_data[i]["id"])).all()
                c.setFont('Helvetica-Bold', 8)
                c.setFillColor(HexColor('#000000'))
                c.setStrokeColor(HexColor('#1E4C9C'))
                line_y = line_y - 13
                dt_format = '%Y-%m-%d'
                inv_date = datetime.datetime.strptime(str(sales_data[i]["sale_date"]), dt_format)
                c.drawCentredString(50 , line_y, str(i+1))
                c.drawCentredString(100, line_y, str(inv_date.strftime("%d/%m/%Y")).strip())
                c.drawCentredString(150, line_y, str(sales_data[i]["invoiceNo"]).strip())
                c.drawCentredString(220, line_y,str(sales_data[i]["clientName"]).strip().capitalize())
                c.drawCentredString(300, line_y, str(sales_data[i]["clientPhone"]).strip())
                c.drawCentredString(370 , line_y, str(sales_data[i]["paidAmt"]).strip())
                c.drawCentredString(440, line_y, str(sales_data[i]["rmnAmt"]).strip())
                c.drawCentredString(500, line_y, str(sales_data[i]["balAmt"]).strip())
                c.drawCentredString(550, line_y,str(sales_data[i]["inv_status"]).strip())
                line_y = line_y - 7
                c.line(24, line_y, 571, line_y)
                line_y = line_y - 30
                if(len(inv_items) > 0):
                    c.setFillColor(HexColor('#2E75B6'))
                    c.rect(90, line_y, 480, 25,fill=1,stroke=0)
                    c.setFillColor(HexColor('#ffffff'))
                    c.setFont('Helvetica-Bold', 9)
                    c.drawCentredString(120 , line_y + 10, 'SL.')
                    c.drawCentredString(170, line_y + 10, 'Item Nm')
                    c.drawCentredString(320, line_y + 10, 'Qty')
                    c.drawCentredString(370, line_y + 10, 'Price/Qty')
                    c.drawCentredString(420, line_y + 10, 'Tax')
                    c.drawCentredString(470, line_y + 10, 'Discount')
                    c.drawCentredString(520 , line_y + 10, 'Total')
                    line_y = line_y - 5
                    c.setStrokeColor(HexColor('#1E4C9C'))
                    c.line(90, line_y, 570, line_y)
                    c.setFillColor(HexColor('#000000'))
                    c.setFont('Times-Roman', 9)

                    for j in range(len(inv_items)):
                        if line_y <= 30 and line_y >= 0:
                            c.showPage()
                            c.setFont('Helvetica-Bold', 8)
                            line_y = 780
                        else:
                            line_y = line_y - 15
                            c.drawCentredString(120 , line_y, str(j+1))
                            c.drawCentredString(170, line_y, str(inv_items[j].item_name).strip().capitalize())
                            c.drawCentredString(320, line_y, str(inv_items[j].item_qnty).strip())
                            c.drawCentredString(370, line_y, str(inv_items[j].item_rate).strip())
                            c.drawCentredString(420, line_y, str(inv_items[j].item_tax).strip())
                            c.drawCentredString(470, line_y, str(inv_items[j].item_disc_val).strip())
                            c.drawCentredString(520 , line_y, str(inv_items[j].item_amount).strip())
                            line_y = line_y - 7
                            c.line(90, line_y, 570, line_y)
                    line_y = line_y - 10
                
        c.setFont('Helvetica-Bold', 10)
        c.drawString(430, line_y - 20, "Total:")
        c.drawString(530, line_y - 20,"Rs " + format(int(networth), ",")),
        c.setStrokeColor(HexColor('#1E4C9C'))
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

@api19.route('/generateSalesReport_pdf', methods = ['POST'])
def generateSales_pdf():
    data = request.get_json()
    pdf = PDF_SalesReport()
    userid = int(data['userid'])
    buffer = BytesIO()
    report = pdf.generation_pdf(buffer,data['startDate'],data['endDate'],data['f_st_date'],data['f_en_date'],data['cust_Name'],userid)
    buffer.seek(0)
    return send_file(buffer, download_name='sales_report.pdf',as_attachment=True)

class PDF_PurchaseReport():
    def __init__(self):
        super().__init__()
        self.width, self.height=A4
    def generation_pdf(self, path, start_date,end_date,f_st_Date,f_en_Date,cu_Name,userid):
        sales_data = []
        networth = 0
        order_list = TblOrder.query.filter(and_(TblOrder.userid == userid,TblOrder.datetime >= start_date, TblOrder.datetime <= end_date)).order_by(TblOrder.id.asc()).all()
        for invoice in order_list:
            total_amt = float(invoice.grand_total)
            get_supplier = Supplier.query.get(int(invoice.supplier_id))
            all_ledger_data = Ledger2.query.filter(and_(Ledger2.ledger_bill == str(invoice.order_num).strip())).all()
            paid_amt = 0
            debit_amt = 0
            rem_amt = 0
            inv_status = 'Pending'
            for leg in all_ledger_data:
                paid_amt = paid_amt + float(leg.ledger_credit_amount)
                debit_amt = debit_amt + int(leg.ledger_debit_amount)
                bal_amt = debit_amt - (paid_amt)
                rem_amt = debit_amt - total_amt
                if(rem_amt < 1):
                    rem_amt = 0
                if(float(str(bal_amt).replace("-","")) < 0):
                    inv_status = "Paid"
            networth += bal_amt
            sales_data.append({"id":invoice.id,"sale_date":invoice.order_date ,"invoiceNo":invoice.order_num,"clientName":invoice.supplier_name.suppl_name,"clientPhone":get_supplier.suppl_name,"paidAmt":str(round(paid_amt, 2)),"rmnAmt":str(round(rem_amt, 2)),"balAmt":str(round(float(str(bal_amt).replace("-","")), 2)), "inv_status":inv_status})
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle(str(cu_Name).strip().capitalize() + " PURCHASE REPORT")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(310, 780,  ' PURCHASE REPORT')
        
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
        c.drawCentredString(150, 690, 'Invoice No')
        c.drawCentredString(220, 690, 'Customer Name')
        c.drawCentredString(300, 690, 'Phone No.')
        c.drawCentredString(370 , 690, 'Credit Amt.')
        c.drawCentredString(440, 690, 'Debit Amt.')
        c.drawCentredString(500, 690, 'Balance')
        c.drawCentredString(550, 690, 'Status')

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
                inv_items = PurchItems.query.filter(PurchItems.item_invoice == int(sales_data[i]["id"])).all()
                c.setFont('Helvetica-Bold', 8)
                c.setFillColor(HexColor('#000000'))
                c.setStrokeColor(HexColor('#1E4C9C'))
                line_y = line_y - 13
                dt_format = '%Y-%m-%d'
                inv_date = datetime.datetime.strptime(str(sales_data[i]["sale_date"]), dt_format)
                c.drawCentredString(50 , line_y, str(i+1))
                c.drawCentredString(100, line_y, str(inv_date.strftime("%d/%m/%Y")).strip())
                c.drawCentredString(150, line_y, str(sales_data[i]["invoiceNo"]).strip())
                c.drawCentredString(220, line_y,str(sales_data[i]["clientName"]).strip().capitalize())
                c.drawCentredString(300, line_y, str(sales_data[i]["clientPhone"]).strip())
                c.drawCentredString(370 , line_y, str(sales_data[i]["paidAmt"]).strip())
                c.drawCentredString(440, line_y, str(sales_data[i]["rmnAmt"]).strip())
                c.drawCentredString(500, line_y, str(sales_data[i]["balAmt"]).strip())
                c.drawCentredString(550, line_y,str(sales_data[i]["inv_status"]).strip())
                line_y = line_y - 7
                c.line(24, line_y, 571, line_y)
                line_y = line_y - 30
                if(len(inv_items) > 0):
                    c.setFillColor(HexColor('#2E75B6'))
                    c.rect(90, line_y, 480, 25,fill=1,stroke=0)
                    c.setFillColor(HexColor('#ffffff'))
                    c.setFont('Helvetica-Bold', 9)
                    c.drawCentredString(120 , line_y + 10, 'SL.')
                    c.drawCentredString(170, line_y + 10, 'Item Nm')
                    c.drawCentredString(320, line_y + 10, 'Qty')
                    c.drawCentredString(370, line_y + 10, 'Price/Qty')
                    c.drawCentredString(420, line_y + 10, 'Tax')
                    c.drawCentredString(470, line_y + 10, 'Discount')
                    c.drawCentredString(520 , line_y + 10, 'Total')
                    line_y = line_y - 5
                    c.setStrokeColor(HexColor('#1E4C9C'))
                    c.line(90, line_y, 570, line_y)
                    c.setFillColor(HexColor('#000000'))
                    c.setFont('Times-Roman', 9)

                    for j in range(len(inv_items)):
                        if line_y <= 30 and line_y >= 0:
                            c.showPage()
                            c.setFont('Helvetica-Bold', 8)
                            line_y = 780
                        else:
                            line_y = line_y - 15
                            c.drawCentredString(120 , line_y, str(j+1))
                            c.drawCentredString(170, line_y, str(inv_items[j].item_name).strip().capitalize())
                            c.drawCentredString(320, line_y, str(inv_items[j].item_qnty).strip())
                            c.drawCentredString(370, line_y, str(inv_items[j].item_rate).strip())
                            c.drawCentredString(420, line_y, str(inv_items[j].item_tax).strip())
                            c.drawCentredString(470, line_y, str(inv_items[j].item_disc_val).strip())
                            c.drawCentredString(520 , line_y, str(inv_items[j].item_amount).strip())
                            line_y = line_y - 7
                            c.line(90, line_y, 570, line_y)
                    line_y = line_y - 10
                
        c.setFont('Helvetica-Bold', 10)
        c.drawString(430, line_y - 20, "Total:")
        c.drawString(530, line_y - 20,"Rs " + format(int(networth), ",")),
        c.setStrokeColor(HexColor('#1E4C9C'))
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

@api19.route('/generatePurchaseReport_pdf', methods = ['POST'])
def generatePurchase_pdf():
    data = request.get_json()
    userid = int(data['userid'])
    pdf = PDF_PurchaseReport()
    buffer = BytesIO()
    report = pdf.generation_pdf(buffer,data['startDate'],data['endDate'],data['f_st_date'],data['f_en_date'],data['cust_Name'],userid)
    buffer.seek(0)
    return send_file(buffer, download_name='purchase_report.pdf',as_attachment=True)
