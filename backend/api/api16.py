import datetime
from io import BytesIO
import textwrap
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from goodsnlc import GoodsNlc
from oilpso import OilPso
from party import Party
from partybill import PartyBill
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

api16 = Blueprint('api16', __name__)

class PDF_Bill():
    def __init__(self):
        super().__init__()
    
        self.width, self.height=A4

    def generation_pdf(self, path, party_Bill_id,userid):
        dt_format = '%Y-%m-%d'
        party_bill = PartyBill.query.get(int(party_Bill_id))
        get_party = Party.query.get(int(party_bill.party_id))
        party_bilties = str(party_bill.invoice_bilties).strip()
        bitydata = []
        if(str(party_bill.invoice_type).strip() == "goods"):
            for p_bilty in party_bilties.split(","):
                bity_goods = GoodsNlc.query.filter(GoodsNlc.id == int(p_bilty)).first()
                bitydata.append(bity_goods)
        elif(str(party_bill.invoice_type).strip() == "oil"):
            for p_bilty in party_bilties.split(","):
                bity_oils = OilPso.query.filter(OilPso.id == int(p_bilty)).first()
                bitydata.append(bity_oils)
            
        invoice_date = datetime.datetime.strptime(str(party_bill.invoice_date), dt_format)
        invoice_due_date = datetime.datetime.strptime(str(party_bill.invoice_due_date), dt_format)
        invoice_dt = invoice_date.strftime("%d/%m/%Y")
        invoice_due_dt = invoice_due_date.strftime("%d/%m/%Y")
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle(str(get_party.english_name).strip().capitalize() + " Bill")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setStrokeColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 15)
        c.drawString(24, 750, "Invoice #"+ str(party_bill.invoice_no).strip().upper())
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 10)
        c.drawString(24, 735, "Date Issued: " + invoice_dt)
        c.drawString(24, 720, "Due Date: " + invoice_due_dt)
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
        c.drawCentredString(297.5, 670, 'Bill Invoice')
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 10)
        c.line(24, 675, 230, 675)
        c.line(360, 675, 571, 675)
         
        c.setFont('Helvetica-Bold', 12)
        c.drawString(24, 650, "Issus For:")
        c.setFont('Times-Roman', 10)
        c.drawString(24, 635, 'Name: ' + str(get_party.english_name).strip().upper())
        c.drawString(24, 620, 'Contact Person: ' + str(get_party.contact_person).strip().capitalize())
        c.drawString(24, 605, "Phone number: " + get_party.phone_number)
        c.drawString(430, 635, 'Issus Date: 25 Jan 2024')
        c.drawString(430, 620, 'Order ID: #653214')
        c.drawString(430, 605, 'Shipment ID: #965215')
        c.setFillColor(HexColor('#1E4C9C'))
        c.line(24, 580, 571, 580)
        
        #r = shapes.Rect(50, 565, 500, 20, fillColor=None, strokeColor=HexColor('#1E4C9C'))
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(24, 552, 550, 30,fill=1,stroke=0)
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 8)

        c.drawCentredString(50 , 565, 'SL.')
        c.drawCentredString(100, 565, 'Date')
        c.drawCentredString(150, 565, 'Bilty No.')
        c.drawCentredString(200, 565, 'Loading P')
        c.drawCentredString(250, 565, 'Destination')
        if(str(party_bill.invoice_type).strip() == "goods"):
            c.drawCentredString(300 , 565, 'Weight')
        elif(str(party_bill.invoice_type).strip() == "oil"):
            c.drawCentredString(300 , 565, 'Quantity')
        c.drawCentredString(350, 565, 'Per/Ton')
        c.drawCentredString(400, 565, 'Freight')
        c.drawCentredString(450, 565, 'WHT 4%')
        c.drawCentredString(500, 565, 'Commission')

        c.setStrokeColor(HexColor('#1E4C9C'))
        c.line(24, 550, 575, 550)
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 9)

        line_y = 550

        row = len(bitydata)

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

                c.setFillColor(HexColor('#ffffff'))
                c.drawCentredString(50 , line_y, 'SL.')
                c.drawCentredString(100, line_y, 'Date')
                c.drawCentredString(150, line_y, 'Bilty No.')
                c.drawCentredString(200, line_y, 'Loading P')
                c.drawCentredString(250, line_y, 'Destination')
                if(str(party_bill.invoice_type).strip() == "goods"):
                    c.drawCentredString(300 , line_y, 'Weight')
                elif(str(party_bill.invoice_type).strip() == "oil"):
                    c.drawCentredString(300 , line_y, 'Quantity')
                c.drawCentredString(350, line_y, 'Per/Ton')
                c.drawCentredString(400, line_y, 'Freight')
                c.drawCentredString(450, line_y, 'WHT 4%')
                c.drawCentredString(500, line_y, 'Commission')

                line_y = line_y - 7
                c.setStrokeColor(HexColor('#1E4C9C'))
                c.line(24, line_y, 571, line_y)

            else:
                c.setFont('Times-Roman', 8)
                c.setFillColor(HexColor('#000000'))
                c.setStrokeColor(HexColor('#1E4C9C'))
                line_y = line_y - 13
                d_weight = ''
                if(str(party_bill.invoice_type).strip() == "goods"):
                    d_weight = bitydata[i].weight
                elif(str(party_bill.invoice_type).strip() == "oil"):
                    d_weight = bitydata[i].quantity
                bilty_date = datetime.datetime.strptime(str(bitydata[i].b_date), dt_format)
                c.drawCentredString(50 , line_y, str(i+1))
                c.drawCentredString(100, line_y, str(bilty_date.strftime("%d/%m/%Y")).strip())
                c.drawCentredString(150, line_y, str(bitydata[i].bilty_no).strip())
                c.drawCentredString(200, line_y,str(bitydata[i].loading_point).strip())
                c.drawCentredString(250, line_y, str(bitydata[i].unloading_point).strip())
                c.drawCentredString(300 , line_y, str(d_weight).strip())
                c.drawCentredString(350, line_y, str(bitydata[i].per_ton).strip())
                c.drawCentredString(400, line_y, str(bitydata[i].freight).strip())
                c.drawCentredString(450, line_y,str(bitydata[i].wrt_4_per_freight).strip())
                c.drawCentredString(500, line_y, str(bitydata[i].commission).strip())

                line_y = line_y - 7

                c.line(24, line_y, 571, line_y)
                
        c.setFont('Helvetica-Bold', 10)
        c.drawString(24, line_y - 20, "Sales By:")
        c.setFont('Times-Roman', 10)
        c.drawString(80, line_y - 20, str(party_bill.invoice_sales_person).strip().capitalize())
        c.drawString(24, line_y - 35,  str(party_bill.invoice_thank_message).strip().capitalize())
        c.setFont('Helvetica-Bold', 10)
        c.drawString(430, line_y - 20, "Subtotal:")
        c.drawString(430, line_y - 35, "Total:")
        c.drawString(530, line_y - 20,"Rs " + format(int(str(party_bill.invoice_balance).strip()), ",")),
        c.drawString(530, line_y - 35, "Rs " + format(int(str(party_bill.invoice_balance).strip()), ",")),
        
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


@api16.route('/generatebill_pdf/<partybill_id>/<userid>', methods = ['GET'])
def generatebill_pdf(partybill_id,userid):
    pdf = PDF_Bill()
    buffer = BytesIO()
    report = pdf.generation_pdf(buffer,partybill_id,userid)
    buffer.seek(0)
    return send_file(buffer, download_name='bill_sample.pdf',as_attachment=True)
