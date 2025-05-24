import datetime
from io import BytesIO
import textwrap
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from clients import Clients
from clnStkRtnItems import ClientReturnItems
from clnstkrtn import TblClnStockRtn
from invoiceItems import InvoiceItems
from purchItems import PurchItems
from quoteitems import QuoteItems
from returnItems import ReturnItems
from stkRtn import TblStockRtn
from supplier import Supplier
from tblInvoice import TblInvoice
from tblOrder import TblOrder
from tblQuote import TblQuote
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

api17 = Blueprint('api17', __name__)

class PDF_Product():
    def __init__(self):
        super().__init__()
    
        self.width, self.height=A4

    def generation_pdf(self, path, product_id, product_type, userid):
        dt_format = '%Y-%m-%d'  
        invoice_date = ""
        invoice_due_date = ""
        invoice_num = ""
        invoice_type = ""
        client_Name = ""
        client_Address = ""
        client_Country = ""
        client_Phone = ""
        client_Email = ""
        client_Ref = ""
        client_Terms = ""
        client_Shipping = ""
        InvSubTotal = ""
        InvDiscount = ""
        InvTax = ""
        InvShipping = ""
        InvGrandTotal = ""
        data_items = []
        if(str(product_type).strip() == "quote"):
            invoice_type = "Quote"
            quote_inv =  TblQuote.query.filter(and_(TblQuote.id == product_id)).one()
            get_client = Clients.query.get(int(quote_inv.client_id))
            quote_items =  QuoteItems.query.filter(and_(QuoteItems.item_invoice == product_id)).all()
            for item in quote_items:
                data_items.append(item.map())
            invoice_date = datetime.datetime.strptime(str(quote_inv.quote_date), dt_format)
            invoice_due_date = datetime.datetime.strptime(str(quote_inv.quote_due_date), dt_format)
            invoice_date = invoice_date.strftime("%d/%m/%Y")
            invoice_due_date = invoice_due_date.strftime("%d/%m/%Y")
            invoice_num = str(quote_inv.quote_num).strip()
            client_Name = str(get_client.client_name).strip().capitalize()
            client_Address = str(get_client.client_address).strip().capitalize()
            client_Country = str(get_client.client_city).strip().capitalize() + ", " +  str(get_client.client_country).strip().capitalize()
            client_Phone = str(get_client.client_phone).strip().capitalize()
            client_Email = str(get_client.client_email).strip().capitalize()
            client_Ref = str(quote_inv.quote_refer).strip().capitalize()
            if(str(quote_inv.payment_terms).strip() == "receipt"):
                client_Terms = str("Payment Due on Receipt").strip()
            client_Shipping = str(quote_inv.shipping).strip()
            InvSubTotal = str(float(str(quote_inv.grand_total).strip()) - float(str(quote_inv.shipping).strip()))
            InvDiscount = str(quote_inv.total_discount).strip()
            InvTax = str(quote_inv.total_tax).strip()
            InvShipping = str(quote_inv.shipping).strip()
            InvGrandTotal = str(quote_inv.grand_total).strip()
            
        elif(str(product_type).strip() == "invoice"):
            invoice_type = "Invoice"
            invoice_inv =  TblInvoice.query.filter(and_(TblInvoice.id == product_id)).one()
            get_client = Clients.query.get(int(invoice_inv.client_id))
            invoice_items =  InvoiceItems.query.filter(and_(InvoiceItems.item_invoice == product_id)).all()
            for item in invoice_items:
                data_items.append(item.map())
            invoice_date = datetime.datetime.strptime(str(invoice_inv.invoice_date), dt_format)
            invoice_due_date = datetime.datetime.strptime(str(invoice_inv.invoice_due_date), dt_format)
            invoice_date = invoice_date.strftime("%d/%m/%Y")
            invoice_due_date = invoice_due_date.strftime("%d/%m/%Y")
            invoice_num = str(invoice_inv.invoice_num).strip().capitalize()
            client_Name = str(get_client.client_name).strip().capitalize()
            client_Address = str(get_client.client_address).strip().capitalize()
            client_Country = str(get_client.client_city).strip().capitalize() + ", " +  str(get_client.client_country).strip().capitalize()
            client_Phone = str(get_client.client_phone).strip().capitalize()
            client_Email = str(get_client.client_email).strip().capitalize()
            client_Ref = str(invoice_inv.invoice_refer).strip().capitalize()
            if(str(invoice_inv.payment_terms).strip() == "receipt"):
                client_Terms = str("Payment Due on Receipt").strip()
            client_Shipping = str(invoice_inv.shipping).strip()
            InvSubTotal = str(float(str(invoice_inv.grand_total).strip()) - float(str(invoice_inv.shipping).strip()))
            InvDiscount = str(invoice_inv.total_discount).strip()
            InvTax = str(invoice_inv.total_tax).strip()
            InvShipping = str(invoice_inv.shipping).strip()
            InvGrandTotal = str(invoice_inv.grand_total).strip()
        elif(str(product_type).strip() == "order"):
            invoice_type = "Purchase"
            order_inv =  TblOrder.query.filter(and_(TblOrder.id == product_id)).one()
            get_suppl = Supplier.query.get(int(order_inv.supplier_id))
            order_items =  PurchItems.query.filter(and_(PurchItems.item_invoice == product_id)).all()
            for item in order_items:
                data_items.append(item.map())
            invoice_date = datetime.datetime.strptime(str(order_inv.order_date), dt_format)
            invoice_due_date = datetime.datetime.strptime(str(order_inv.order_due_date), dt_format)
            invoice_date = invoice_date.strftime("%d/%m/%Y")
            invoice_due_date = invoice_due_date.strftime("%d/%m/%Y")
            invoice_num = str(order_inv.order_num).strip().capitalize()
            client_Name = str(get_suppl.suppl_name).strip().capitalize()
            client_Address = str(get_suppl.suppl_address).strip().capitalize()
            client_Country = str(get_suppl.suppl_city).strip().capitalize() + ", " +  str(get_suppl.suppl_country).strip().capitalize()
            client_Phone = str(get_suppl.suppl_phone).strip().capitalize()
            client_Email = str(get_suppl.suppl_email).strip().capitalize()
            client_Ref = str(order_inv.order_refer).strip().capitalize()
            if(str(order_inv.payment_terms).strip() == "receipt"):
                client_Terms = str("Payment Due on Receipt").strip()
            client_Shipping = str(order_inv.shipping).strip()
            InvSubTotal = str(float(str(order_inv.grand_total).strip()) - float(str(order_inv.shipping).strip()))
            InvDiscount = str(order_inv.total_discount).strip()
            InvTax = str(order_inv.total_tax).strip()
            InvShipping = str(order_inv.shipping).strip()
            InvGrandTotal = str(order_inv.grand_total).strip()
        elif(str(product_type).strip() == "supplier"):
            invoice_type = "Stock"
            stk_inv =  TblStockRtn.query.filter(and_(TblStockRtn.id == product_id)).one()
            get_suppl = Supplier.query.get(int(stk_inv.supplier_id))
            stk_items =  ReturnItems.query.filter(and_(ReturnItems.item_invoice == product_id)).all()
            for item in stk_items:
                data_items.append(item.map())
            invoice_date = datetime.datetime.strptime(str(stk_inv.stock_date), dt_format)
            invoice_due_date = datetime.datetime.strptime(str(stk_inv.stock_due_date), dt_format)
            invoice_date = invoice_date.strftime("%d/%m/%Y")
            invoice_due_date = invoice_due_date.strftime("%d/%m/%Y")
            invoice_num = str(stk_inv.stock_num).strip().capitalize()
            client_Name = str(get_suppl.suppl_name).strip().capitalize()
            client_Address = str(get_suppl.suppl_address).strip().capitalize()
            client_Country = str(get_suppl.suppl_city).strip().capitalize() + ", " +  str(get_suppl.suppl_country).strip().capitalize()
            client_Phone = str(get_suppl.suppl_phone).strip().capitalize()
            client_Email = str(get_suppl.suppl_email).strip().capitalize()
            client_Ref = str(stk_inv.stock_refer).strip().capitalize()
            if(str(stk_inv.payment_terms).strip() == "receipt"):
                client_Terms = str("Payment Due on Receipt").strip()
            client_Shipping = str(stk_inv.shipping).strip()
            InvSubTotal = str(float(str(stk_inv.grand_total).strip()) - float(str(stk_inv.shipping).strip()))
            InvDiscount = str(stk_inv.total_discount).strip()
            InvTax = str(stk_inv.total_tax).strip()
            InvShipping = str(stk_inv.shipping).strip()
            InvGrandTotal = str(stk_inv.grand_total).strip()
        elif(str(product_type).strip() == "client"):
            invoice_type = "Customer"
            stk_inv =  TblClnStockRtn.query.filter(and_(TblClnStockRtn.id == product_id)).one()
            get_suppl = Clients.query.get(int(stk_inv.client_id))
            stk_items =  ClientReturnItems.query.filter(and_(ClientReturnItems.item_invoice == product_id)).all()
            for item in stk_items:
                data_items.append(item.map())
            invoice_date = datetime.datetime.strptime(str(stk_inv.stock_date), dt_format)
            invoice_due_date = datetime.datetime.strptime(str(stk_inv.stock_due_date), dt_format)
            invoice_date = invoice_date.strftime("%d/%m/%Y")
            invoice_due_date = invoice_due_date.strftime("%d/%m/%Y")
            invoice_num = str(stk_inv.stock_num).strip().capitalize()
            client_Name = str(get_suppl.client_name).strip().capitalize()
            client_Address = str(get_suppl.client_address).strip().capitalize()
            client_Country = str(get_suppl.client_city).strip().capitalize() + ", " +  str(get_suppl.client_country).strip().capitalize()
            client_Phone = str(get_suppl.client_phone).strip().capitalize()
            client_Email = str(get_suppl.client_email).strip().capitalize()
            client_Ref = str(stk_inv.stock_refer).strip().capitalize()
            if(str(stk_inv.payment_terms).strip() == "receipt"):
                client_Terms = str("Payment Due on Receipt").strip()
            client_Shipping = str(stk_inv.shipping).strip()
            InvSubTotal = str(float(str(stk_inv.grand_total).strip()) - float(str(stk_inv.shipping).strip()))
            InvDiscount = str(stk_inv.total_discount).strip()
            InvTax = str(stk_inv.total_tax).strip()
            InvShipping = str(stk_inv.shipping).strip()
            InvGrandTotal = str(stk_inv.grand_total).strip()
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle("#" + str(invoice_num).strip().capitalize()  + str(client_Name).strip().capitalize()  + str(invoice_type).strip().capitalize() + " Invoice")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setStrokeColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 15)
        c.drawString(24, 750, "Invoice #"+ str(invoice_num).strip().upper())
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 10)
        c.drawString(24, 735, "Date Issued: " + invoice_date)
        c.drawString(24, 720, "Due Date: " + invoice_due_date)
        c.setFont("Helvetica", 10)
        c.drawImage('static/logo.png', 420, 760, width=150, height=50)
        originalstring = "4517 Washington Ave. Manchester, Kentucky 39495"
        if len(originalstring) > 30:
            wrap_text = textwrap.wrap(originalstring, width=30)
            c.drawString(430, 735, wrap_text[0])
            c.drawString(430, 720, wrap_text[1])
            c.drawString(430, 705, "random@gmail.com, +1 543 2198")
        else:
            c.drawString(430, 735, originalstring)
            c.drawString(430, 720, "random@gmail.com, +1 543 2198")
            
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 15)
        c.drawCentredString(297.5, 670,  str(invoice_type).strip().capitalize() + ' Invoice')
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 10)
        c.line(24, 675, 230, 675)
        c.line(360, 675, 571, 675)
         
        c.setFont('Helvetica-Bold', 12)
        c.drawString(24, 650, "Issus For:")
        c.setFont('Times-Roman', 10)
        c.drawString(24, 635, 'Name: ' + str(client_Name).strip().upper())
        c.drawString(24, 620, 'Address: ' + str(client_Address).strip().capitalize())
        c.drawString(24, 605, "Country: " +str(client_Country).strip())
        c.drawString(24, 590, "Phone number: " +str(client_Phone).strip().capitalize())
        c.drawString(24, 575, "Email: " +str(client_Email).strip().capitalize())
        c.drawString(430, 635, 'Reference:' + str(client_Ref).strip().capitalize())
        c.drawString(430, 620, 'Terms:' + str(client_Terms).strip())
        c.drawString(430, 605, 'Shipping: Rs.' +str(client_Shipping).strip().capitalize())
        c.setFillColor(HexColor('#1E4C9C'))
        c.line(24, 560, 571, 560)
        
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(24, 532, 550, 30,fill=1,stroke=0)
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 8)

        c.drawCentredString(50 , 545, 'SL.')
        c.drawCentredString(150, 545, 'Name')
        c.drawCentredString(250, 545, 'Rate')
        c.drawCentredString(320, 545, 'Quantity')
        c.drawCentredString(390, 545, 'Tax')
        c.drawCentredString(450, 545, 'Discount')
        c.drawCentredString(530, 545, 'Amount')

        c.setStrokeColor(HexColor('#1E4C9C'))
        c.line(24, 530, 575, 530)
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 9)

        line_y = 530

        row = len(data_items)

        for i in range(row):
            if line_y <= 30 and line_y >= 0:
                c.showPage()
                c.setFont('Helvetica-Bold', 8)
                line_y = 780
                c.setFillColor(HexColor('#1E4C9C'))
                c.rect(24, line_y-17, 548, 26,fill=1,stroke=0)
                c.setStrokeColor(HexColor('#1E4C9C'))
                c.line(24, line_y, 571, line_y)

                line_y = line_y - 5

                c.drawCentredString(50 , line_y, 'SL.')
                c.drawCentredString(150, line_y, 'Name')
                c.drawCentredString(250, line_y, 'Rate')
                c.drawCentredString(320, line_y, 'Quantity')
                c.drawCentredString(390, line_y, 'Tax')
                c.drawCentredString(450, line_y, 'Discount')
                c.drawCentredString(530, line_y, 'Amount')
        
                line_y = line_y - 7
                c.setStrokeColor(HexColor('#1E4C9C'))
                c.line(24, line_y, 571, line_y)

            else:
                c.setFont('Times-Roman', 8)
                c.setFillColor(HexColor('#000000'))
                c.setStrokeColor(HexColor('#1E4C9C'))
                line_y = line_y - 13
                d_weight = ''  

                c.drawCentredString(50 , line_y, str(i+1))
                c.drawCentredString(150, line_y, str(data_items[i]["item_name"]).strip().capitalize())
                c.drawCentredString(250, line_y,  str(data_items[i]["item_rate"]).strip())
                c.drawCentredString(320, line_y, str(data_items[i]["item_qnty"]).strip())
                c.drawCentredString(390, line_y, str(data_items[i]["item_tax"]).strip())
                c.drawCentredString(450 , line_y,  str(data_items[i]["item_disc_val"]).strip())
                c.drawCentredString(530, line_y, str(data_items[i]["item_amount"]).strip())

                line_y = line_y - 7

                c.line(24, line_y, 571, line_y)        
        
        c.setFont('Helvetica-Bold', 9)
        c.drawString(430, line_y - 20, "Subtotal:")
        c.drawString(430, line_y - 35, "Discount:")
        c.drawString(430, line_y - 50, "Tax:")
        c.drawString(430, line_y - 65, "Shipping:")
        c.drawString(430, line_y - 80, "Total:")
        c.setFont('Times-Roman', 8)
        c.drawString(500, line_y - 20,"Rs " + format(float(str(InvSubTotal).strip()), ","))
        c.drawString(500, line_y - 35,"Rs " + format(float(str(InvDiscount).strip()), ","))
        c.drawString(500, line_y - 50,"Rs " + format(float(str(InvTax).strip()), ","))
        c.drawString(500, line_y - 65, "Rs " + format(float(str(InvShipping).strip()), ","))
        c.drawString(500, line_y - 80, "Rs " + format(float(str(InvGrandTotal).strip()), ","))
        
        c.setStrokeColor(HexColor('#1E4C9C'))
        # footer
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 10)
        c.drawCentredString(297.5, 140, 'Thank you for your purchase!') 
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 10)
        c.drawString(34, 65, "Signature of Customer")
        c.drawString(430, 65, "Signature of Authorized")
        c.line(34, 80, 130, 80)
        c.line(430, 80, 530, 80)
        c.showPage()
        c.save()

@api17.route('/generatePrd_pdf/<prod_id>/<prod_type>/<userid>', methods = ['GET'])
def generatePrd_pdf(prod_id,prod_type,userid):
    pdf = PDF_Product()
    buffer = BytesIO()
    report = pdf.generation_pdf(buffer,prod_id,prod_type, userid)
    buffer.seek(0)
    return send_file(buffer, download_name='product_invoice.pdf',as_attachment=True)

