import datetime
from io import BytesIO
import textwrap
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from chartofAccount import ChartOfAccount
from clients import Clients
from goodsnlc import GoodsNlc
from ledger import Ledger
from oilpso import OilPso
from party import Party
from supplier import Supplier
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

api21 = Blueprint('api21', __name__)

class PDF_AllPartyReport():
    def __init__(self):
        super().__init__()
        self.width, self.height=A4
    def generation_pdf(self, path, userid):
        sales_data = []
        tot_cred_amt = 0
        tot_deb_amt = 0
        coa_list = ChartOfAccount.query.filter(ChartOfAccount.userid == userid).all()
        for coa in coa_list:
            debit_Amt = 0
            credit_Amt = 0
            if(int(coa.networth) < 0):
                debit_Amt = abs(int(coa.networth))     
            else:
                credit_Amt = int(coa.networth)
            tot_deb_amt += debit_Amt
            tot_cred_amt += credit_Amt
            if(str(coa.account_mode).strip() == "commission"):
                sales_data.append({"id":coa.id,"name":coa.accnt_name ,"email":"N/A","phone":"N/A","debitAmt":debit_Amt,"creditAmt":credit_Amt,"acc_type":coa.account_mode})
            elif(str(coa.account_mode).strip() == "general"):
                sales_data.append({"id":coa.id,"name":coa.accnt_name ,"email":"N/A","phone":"N/A","debitAmt":debit_Amt,"creditAmt":credit_Amt,"acc_type":coa.account_mode})
            elif(str(coa.account_mode).strip() == "party"):
                get_party = Party.query.filter(Party.chart_accnt == int(coa.id)).one() 
                sales_data.append({"id":get_party.id,"name":get_party.english_name ,"email":get_party.contact_person,"phone":get_party.phone_number,"debitAmt":debit_Amt,"creditAmt":credit_Amt,"acc_type":coa.account_mode})
            elif(str(coa.account_mode).strip() == "vehicle"):
                get_vehicle = Vehicles.query.filter(Vehicles.chart_accnt == int(coa.id)).one()
                sales_data.append({"id":get_vehicle.id,"name":get_vehicle.vehicle_num ,"email":get_vehicle.driver_name,"phone":get_vehicle.phone_number,"debitAmt":debit_Amt,"creditAmt":credit_Amt,"acc_type":coa.account_mode})
            elif(str(coa.account_mode).strip() == "client"):
                get_client = Clients.query.filter(Clients.chart_accnt == int(coa.id)).one()
                sales_data.append({"id":get_client.id,"name":get_client.client_name ,"email":get_client.client_email,"phone":get_client.client_phone,"debitAmt":debit_Amt,"creditAmt":credit_Amt,"acc_type":coa.account_mode})
            elif(str(coa.account_mode).strip() == "supplier"):
                get_supplier = Supplier.query.filter(Supplier.chart_accnt == int(coa.id)).one()
                sales_data.append({"id":get_supplier.id,"name":get_supplier.suppl_name ,"email":get_supplier.suppl_email,"phone":get_supplier.suppl_phone,"debitAmt":debit_Amt,"creditAmt":credit_Amt,"acc_type":coa.account_mode})
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle("ALL PARTY REPORT")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(310, 780,  'ALL PARTY REPORT')
        
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(22, 730, 555, 30,fill=1,stroke=0)
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 9)

        c.drawCentredString(50 , 740, 'SL.')
        c.drawString(100, 740, 'Name')
        c.drawString(220, 740, 'Email')
        c.drawString(320, 740, 'Phone')
        c.drawString(420, 740, 'Credit Balance')
        c.drawString(500, 740, 'Debit Balance')

        c.setStrokeColor(HexColor('#1E4C9C'))
        c.line(24, 750, 575, 750)
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 9)

        line_y = 725

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
                c.drawString(100, line_y, str(sales_data[i]["name"]).strip().capitalize())
                c.drawString(220, line_y, str(sales_data[i]["email"]).strip().capitalize())
                c.drawString(320, line_y,str(sales_data[i]["phone"]).strip().capitalize())
                c.drawRightString(480, line_y, str(sales_data[i]["creditAmt"]).strip())
                c.drawRightString(550 , line_y, str(sales_data[i]["debitAmt"]).strip())   
                line_y = line_y - 7
                c.line(24, line_y, 571, line_y)
        
        line_y = line_y - 15
        c.setFillColor(HexColor('#2E75B6'))
        c.rect(22, line_y-20, 555, 30,fill=1,stroke=0) 
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 8)
        c.drawString(80, line_y - 10, str("Total").strip())
        c.drawRightString(480, line_y - 10, "Rs. " + str(tot_cred_amt).strip())
        c.drawRightString(550, line_y - 10, "Rs. " + str(tot_deb_amt).strip())
        
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


class PDF_AllGoodsOilsReport():
    def __init__(self):
        super().__init__()
        self.width, self.height=A4
    def generation_pdf(self, path, report_type,userid):
        sales_data = []
        tot_cred_amt = 0
        tot_deb_amt = 0
        coa_list = ChartOfAccount.query.filter(ChartOfAccount.userid == userid).all()
        for coa in coa_list:
            debitAmt = 0
            creditAmt = 0
            if(int(coa.networth) < 0):
                debitAmt = abs(int(coa.networth))
            else:
                creditAmt = abs(int(coa.networth))
            if(str(coa.account_mode).strip() == "party"):
                get_party = Party.query.filter(Party.chart_accnt == int(coa.id)).one()
                if(str(get_party.type).strip() == str(report_type).strip()): 
                    sales_data.append({"id":get_party.id,"name":get_party.english_name ,"email":get_party.contact_person,"phone":get_party.phone_number,"debitAmt":debitAmt,"creditAmt":creditAmt,"acc_type":coa.account_mode})
            elif(str(coa.account_mode).strip() == "vehicle"):
                get_vehicle = Vehicles.query.filter(Vehicles.chart_accnt == int(coa.id)).one()
                if(str(get_vehicle.veh_type).strip() == str(report_type).strip()):    
                    sales_data.append({"id":get_vehicle.id,"name":get_vehicle.vehicle_num ,"email":get_vehicle.driver_name,"phone":get_vehicle.phone_number,"debitAmt":debitAmt,"creditAmt":creditAmt,"acc_type":coa.account_mode})
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle("ALL "+ str(report_type).strip().upper() +" REPORT")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(310, 780,  'ALL '+ str(report_type).strip().upper() +' REPORT')
        
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(22, 730, 555, 30,fill=1,stroke=0)
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 9)

        c.drawCentredString(50 , 740, 'SL.')
        c.drawString(100, 740, 'Name')
        c.drawString(220, 740, 'Email')
        c.drawString(320, 740, 'Phone')
        c.drawString(400, 740, 'Total Receivable')
        c.drawString(500, 740, 'Total Payable')

        c.setStrokeColor(HexColor('#1E4C9C'))
        c.line(24, 750, 575, 750)
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 9)

        line_y = 725

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
                c.drawString(100, line_y, str(sales_data[i]["name"]).strip().capitalize())
                c.drawString(220, line_y, str(sales_data[i]["email"]).strip().capitalize())
                c.drawString(320, line_y,str(sales_data[i]["phone"]).strip().capitalize())
                c.drawRightString(460, line_y, str(sales_data[i]["debitAmt"]).strip())
                c.drawRightString(550 , line_y, str(sales_data[i]["creditAmt"]).strip())   
                line_y = line_y - 7
                c.line(24, line_y, 571, line_y)
        
        line_y = line_y - 15
        c.setFillColor(HexColor('#2E75B6'))
        c.rect(22, line_y-20, 555, 30,fill=1,stroke=0) 
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 8)
        c.drawString(80, line_y - 10, str("Total").strip())
        c.drawRightString(480, line_y - 10, "Rs. " + str(tot_deb_amt).strip())
        c.drawRightString(550, line_y - 10, "Rs. " + str(tot_cred_amt).strip())
        
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


class PDF_ManifestGOReport():
    def __init__(self):
        super().__init__()
        self.width, self.height=A4
    def generation_pdf(self, path, report_type,userid):
        sales_data = []
        tot_weight = 0
        tot_per_ton = 0
        tot_gst = 0
        tot_frght = 0
        tot_comm = 0
        tot_v_f = 0
        tot_v_adv = 0
        if(str(report_type).strip() == "goods"):
            mani_goods = GoodsNlc.query.filter(GoodsNlc.userid == userid).all()
            for mani_good in mani_goods:
                sales_data.append(mani_good.map())
        elif(str(report_type).strip() == "oil"):
            mani_oils = OilPso.query.filter(OilPso.userid == userid).all()
            for mani_oil in mani_oils:
                sales_data.append(mani_oil.map())
        c = canvas.Canvas(path, pagesize=A4)
        c.setTitle("ALL "+ str(report_type).strip().upper() +" REPORT")
        mystyle = ParagraphStyle('my style',fontName='Times-Roman',fontSize=10,leading=15)
        c.setLineWidth(.2)
        c.setFillColor(HexColor('#1E4C9C'))
        c.setFont('Helvetica-Bold', 18)
        c.drawCentredString(310, 780,  'ALL '+ str(report_type).strip().upper() +' REPORT')
        
        c.setFillColor(HexColor('#1E4C9C'))
        c.rect(22, 730, 555, 30,fill=1,stroke=0)
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 8)

        c.drawCentredString(40 , 740, 'BillNo')
        c.drawString(70, 740, 'Date')
        c.drawString(120, 740, 'Vehicle')
        c.drawString(200, 740, 'Party')
        if(str(report_type).strip() == "goods"):
            c.drawString(265, 740, 'Wgt(kg)')
        elif(str(report_type).strip() == "oil"):
            c.drawString(265, 740, 'Qty')
        c.drawString(300, 740, 'Per/Ton')
        c.drawString(340, 740, 'Gst(%)')
        c.drawString(370, 740, 'Freight')
        c.drawString(410, 740, 'Comm')
        c.drawString(450, 740, 'Veh F')
        c.drawString(490, 740, 'Veh A')
        c.drawString(530, 740, 'Status')

        c.setStrokeColor(HexColor('#1E4C9C'))
        c.line(24, 750, 575, 750)
        c.setFillColor(HexColor('#000000'))
        c.setFont('Times-Roman', 9)

        line_y = 725

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
                invoice_date = datetime.datetime.strptime(str(sales_data[i]["b_date"]).strip(), dt_format)
                c.drawCentredString(40 , line_y, str(sales_data[i]["bilty_no"]).strip().capitalize())
                c.drawString(70, line_y, invoice_date.strftime("%d/%m/%Y"))
                if(str(report_type).strip() == "goods"):
                    c.drawString(120, line_y, str(sales_data[i]["goods_vehicle_name"]).strip().capitalize())
                    c.drawString(200, line_y, str(sales_data[i]["goods_party_name"]).strip().capitalize())
                    tot_weight += int(str(sales_data[i]["weight"]).strip())
                    c.drawString(265, line_y, str(sales_data[i]["weight"]).strip().capitalize())
                elif(str(report_type).strip() == "oil"):
                    c.drawString(120, line_y, str(sales_data[i]["oil_vehicle_name"]).strip().capitalize())
                    c.drawString(200, line_y, str(sales_data[i]["oil_party_name"]).strip().capitalize())
                    tot_weight += int(str(sales_data[i]["quantity"]).strip())
                    c.drawString(265, line_y, str(sales_data[i]["quantity"]).strip().capitalize())
                tot_per_ton += int(str(sales_data[i]["per_ton"]).strip())
                c.drawString(300, line_y, str(sales_data[i]["per_ton"]).strip().capitalize())
                if(str(report_type).strip() == "goods"):
                    tot_gst += int(str(sales_data[i]["goods_gst"]).strip())
                    c.drawString(340, line_y, str(sales_data[i]["goods_gst"]).strip().capitalize())
                elif(str(report_type).strip() == "oil"):
                    tot_gst += int(str(sales_data[i]["oils_gst"]).strip())
                    c.drawString(340, line_y, str(sales_data[i]["oils_gst"]).strip().capitalize())
                tot_frght += int(str(sales_data[i]["freight"]).strip())
                c.drawString(370, line_y,str(sales_data[i]["freight"]).strip().capitalize())
                tot_comm += int(str(sales_data[i]["commission"]).strip())
                c.drawString(410, line_y, str(sales_data[i]["commission"]).strip().capitalize())
                tot_v_f += int(str(sales_data[i]["vehicle_freight"]).strip())
                c.drawString(450, line_y, str(sales_data[i]["vehicle_freight"]).strip().capitalize())
                tot_v_adv += int(str(sales_data[i]["advance_to_vehicle"]).strip())
                c.drawString(490, line_y, str(sales_data[i]["advance_to_vehicle"]).strip().capitalize())
                c.drawString(530, line_y, str(sales_data[i]["bill_status"]).strip().capitalize())
                line_y = line_y - 7
                c.line(24, line_y, 571, line_y)
        
        line_y = line_y - 15
        c.setFillColor(HexColor('#2E75B6'))
        c.rect(22, line_y-20, 555, 30,fill=1,stroke=0) 
        c.setFillColor(HexColor('#ffffff'))
        c.setFont('Helvetica-Bold', 8)
        c.drawString(250, line_y - 10, "Total: ")
        c.drawString(350, line_y - 10,"Rs " + format(int(str(tot_frght).strip()), ",")),
        c.drawString(400, line_y - 10, "Rs " + format(int(str(tot_comm).strip()), ",")),
        c.drawString(450, line_y - 10, "Rs " + format(int(str(tot_v_f).strip()), ",")),
        c.drawString(500, line_y - 10,"Rs " + format(int(str(tot_v_adv).strip()), ",")),
        
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

@api21.route('/generateAllPartyReport_pdf', methods = ['POST'])
def generateAllPartyReport_pdf():
    data = request.get_json()
    userid = int(data['userid'])
    pdf = PDF_AllPartyReport()
    buffer = BytesIO()
    report = pdf.generation_pdf(buffer,userid)
    buffer.seek(0)
    return send_file(buffer, download_name='all_party_report.pdf',as_attachment=True)


@api21.route('/generateAllGoodsOilsReport_pdf', methods = ['POST'])
def generateAllGoodsOilsReport_pdf():
    data = request.get_json()
    userid = int(data['userid'])
    pdf = PDF_AllGoodsOilsReport()
    buffer = BytesIO()
    report = pdf.generation_pdf(buffer, data["repType"],userid)
    buffer.seek(0)
    return send_file(buffer, download_name='all_party_report.pdf',as_attachment=True)

@api21.route('/generateManifestReport_pdf', methods = ['POST'])
def generateManifestReport_pdf():
    data = request.get_json()
    userid = int(data['userid'])
    pdf = PDF_ManifestGOReport()
    buffer = BytesIO()
    report = pdf.generation_pdf(buffer, data["repType"],userid)
    buffer.seek(0)
    return send_file(buffer, download_name='all_party_report.pdf',as_attachment=True)

