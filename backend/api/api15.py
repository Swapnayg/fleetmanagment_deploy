import datetime
from io import BytesIO
from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from chartofAccount import ChartOfAccount
from clients import Clients
from ledger import Ledger
from ledger2 import Ledger2
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

api15 = Blueprint('api15', __name__)

class PDFPSReporte:

    def __init__(self, path, p_id, p_type,userid):
        self.path = path
        self.styleSheet = getSampleStyleSheet()
        self.elements = []

        # colors - Azul turkeza 367AB3
        self.colorOhkaGreen0 = Color((45.0/255), (166.0/255), (153.0/255), 1)
        self.colorOhkaGreen1 = Color((182.0/255), (227.0/255), (166.0/255), 1)
        self.colorOhkaGreen2 = Color((140.0/255), (222.0/255), (192.0/255), 1)
        #self.colorOhkaGreen2 = Color((140.0/255), (222.0/255), (192.0/255), 1)
        self.colorOhkaBlue0 = Color((30.0/255), (76.0/255), (156.0/255), 1)
        self.colorOhkaBlue1 = Color((52.0/255), (93.0/255), (154.0/255), 1)
        self.colorOhkaGreenLineas = Color((50.0/255), (140.0/255), (140.0/255), 1)

        self.inSiteSessionTableMaker(p_id,p_type )
        # Build
        self.doc = SimpleDocTemplate(path, pagesize=LETTER, title=str(p_type).strip().capitalize() + " Ledger")
        self.doc.multiBuild(self.elements, canvasmaker=FooterCanvas)

    def inSiteSessionTableMaker(self, part_id , part_type):
        party_Name = ""
        party_Type = str(part_type).strip().capitalize()
        party_cont = ""
        party_numb = ""
        party_from = datetime.datetime.now()
        date_today = datetime.datetime.now()
        party_to =  date_today.strftime("%d %b %Y")
        party_net = ""
        party_net_val = ""
        dt_format = '%Y-%m-%d'
        ledg_chart_id = 0
        if(str(part_type).strip() == "party"):
            get_party = Party.query.get(int(part_id))
            ledg_chart_id = get_party.chart_accnt
            party_Name = str(get_party.english_name).strip().capitalize()
            party_numb = "+92-" + str(get_party.phone_number).strip()
            party_cont = "Phone"
            party_net = "Rs " + format(int(str(get_party.net_amount).strip()), ",")
            party_net_val = int(str(get_party.net_amount).strip())
            party_date = datetime.datetime.strptime(str(get_party.datetime), dt_format)
            party_from = party_date.strftime("%d %b %Y")
        elif(str(part_type).strip() == "vehicle"):
            get_vehicle = Vehicles.query.get(int(part_id))
            ledg_chart_id = get_vehicle.chart_accnt
            party_Name = str(get_vehicle.vehicle_num).strip().capitalize()
            party_numb = "+92-" + str(get_vehicle.phone_number).strip()
            party_cont = "Phone"
            party_net = "Rs " + format(int(str(get_vehicle.net_worth).strip()), ",")
            party_net_val = int(str(get_vehicle.net_worth).strip())
            party_date = datetime.datetime.strptime(str(get_vehicle.datetime), dt_format)
            party_from = party_date.strftime("%d %b %Y")
        elif(str(part_type).strip() == "client"):
            get_client = Clients.query.get(int(part_id))
            ledg_chart_id = get_client.chart_accnt
            party_Name = str(get_client.client_name).strip().capitalize()
            party_numb = "+92-" + str(get_client.client_phone).strip()
            party_cont = "Phone"
            party_net = "Rs " + format(int(str(get_client.networth).strip()), ",")
            party_net_val = int(str(get_client.networth).strip())
            party_date = datetime.datetime.strptime(str(get_client.datetime), dt_format)
            party_from = party_date.strftime("%d %b %Y")
        elif(str(part_type).strip() == "supplier"):
            get_suppl = Supplier.query.get(int(part_id))
            ledg_chart_id = get_suppl.chart_accnt
            party_Name = str(get_suppl.suppl_name).strip().capitalize()
            party_numb = "+92-" + str(get_suppl.suppl_phone).strip()
            party_cont = "Phone"
            party_net = "Rs " + format(int(str(get_suppl.networth).strip()), ",")
            party_net_val = int(str(get_suppl.networth).strip())
            party_date = datetime.datetime.strptime(str(get_suppl.datetime), dt_format)
            party_from = party_date.strftime("%d %b %Y")
        elif(str(part_type).strip() == "commission" or str(part_type).strip() == "general" ):
            get_chart = ChartOfAccount.query.get(int(part_id))
            ledg_chart_id = get_chart.id
            party_Name = str(get_chart.accnt_name).strip().capitalize()
            party_numb = "+92-" + str(get_chart.accnt_code).strip()
            party_cont = "Account"
            party_net = "Rs " + format(int(str(get_chart.networth).strip()), ",")
            party_net_val = int(str(get_chart.networth).strip())
            party_date = datetime.datetime.strptime(str(get_chart.datetime), dt_format)
            party_from = party_date.strftime("%d %b %Y")
        total_debit = 0
        total_credit = 0
        if(str(part_type).strip() == "party" or str(part_type).strip() == "vehicle" or str(part_type).strip() == "general" or str(part_type).strip() == "commission"):
            ledger_data = Ledger.query.filter(and_(Ledger.ledger_account_no == int(ledg_chart_id), Ledger.ledger_type  == str(part_type).strip() )).order_by(Ledger.id.asc()).all()
            for ledg_i in ledger_data:
                total_debit = (total_debit) + int(ledg_i.ledger_debit_amount)
                total_credit = (total_credit) + int(ledg_i.ledger_credit_amount)
        elif(str(part_type).strip()== "supplier" or str(part_type).strip() == "client" ):
            ledger_data = Ledger2.query.filter(and_(Ledger2.ledger_account_no == int(ledg_chart_id), Ledger2.ledger_type  == str(part_type).strip() )).order_by(Ledger2.id.asc()).all()
            for ledg_i in ledger_data:
                total_debit = (total_debit) + int(ledg_i.ledger_debit_amount)
                total_credit = (total_credit) + int(ledg_i.ledger_credit_amount)
        spacer = Spacer(10, 20)
        self.elements.append(spacer)
        psHeaderText = ParagraphStyle('Hed0', fontSize=12, alignment=TA_CENTER, borderWidth=3, textColor=self.colorOhkaBlue0,textTransform ='uppercase')
        text = party_Name + ' ('+ (party_Type) +') Statement'
        paragraphReportHeader = Paragraph(str(text).capitalize(), psHeaderText)
        self.elements.append(paragraphReportHeader)
        
        spacer = Spacer(10, 15)
        self.elements.append(spacer)
        
        text1 = party_cont + ' Number: ' + party_numb
        paragraphReportHeader1 = Paragraph(text1, psHeaderText)
        self.elements.append(paragraphReportHeader1)

        spacer = Spacer(10, 15)
        self.elements.append(spacer)
        
        text2 = str(party_from) + ' - ' + str(party_to)
        paragraphReportHeader2 = Paragraph(text2, psHeaderText)
        self.elements.append(paragraphReportHeader2)

        spacer = Spacer(10, 15)
        self.elements.append(spacer)
        d1 = []
        textData1 = ["Opening Balance", "Total Debit(-)", "Total Credit(+)", "Net Balance", "Running Balance"]
                
        fontSize1 = 8
        centered1 = ParagraphStyle(name="centered", alignment=TA_LEFT)
        for text1 in textData1:
            ptext1 = "<font size='%s'><b>%s</b></font>" % (fontSize1, text1)
            titlesTable1 = Paragraph(ptext1, centered1)
            d1.append(titlesTable1)        

        data1 = [d1]
        formattedLineData1 = []
        balance_colr = colors.HexColor('#00FFFFFF')
        if(int(party_net_val) > 0):
            balance_colr = colors.HexColor('#008000')
        else:
            balance_colr = colors.HexColor('#FF0000')
        alignStyle1 = [ParagraphStyle(name="01", alignment=TA_LEFT),
                      ParagraphStyle(name="02", alignment=TA_LEFT , textColor=colors.HexColor('#FF0000')),
                      ParagraphStyle(name="03", alignment=TA_LEFT , textColor=colors.HexColor('#008000')),
                      ParagraphStyle(name="04", alignment=TA_LEFT),
                      ParagraphStyle(name="05", alignment=TA_LEFT, textColor=balance_colr)]

        for row1 in range(1):
            lineData1 = ["Rs 0",  "Rs " + format(int(str(total_debit).strip()), ","),"Rs " + format(int(str(total_credit).strip()), ","), party_net, party_net]
            #data.append(lineData)
            columnNumber1 = 0
            for item1 in lineData1:
                ptext2 = "<font size='%s'>%s</font>" % (fontSize1-1, item1)
                p1 = Paragraph(ptext2, alignStyle1[columnNumber1])
                formattedLineData1.append(p1)
                columnNumber1 = columnNumber1 + 1
            data1.append(formattedLineData1)
                 
        table1 = Table(data1, colWidths=[100, 100, 100, 100, 100])
        tStyle1 = TableStyle([
                ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.HexColor('#00FFFFFF')),
                ('BOX', (0,0), (-1,-1), 0.50,  self.colorOhkaBlue1),
                ('LINEAFTER', (0,0), (-1,-1), 0.25, self.colorOhkaBlue1),
                ])
        table1.setStyle(tStyle1)
        self.elements.append(table1)
        
        spacer = Spacer(10, 15)
        self.elements.append(spacer)
        
        text_row = "No. of Entries: "+ str((len(ledger_data))) +" (All)"
        d5 = []
        textData5 = [text_row, ""]
                
        fontSize5 = 12
        centered5 = ParagraphStyle(name="centered", alignment=TA_LEFT)
        for text5 in textData5:
            ptext5 = "<font size='%s'><b>%s</b></font>" % (fontSize5, text5)
            titlesTable5 = Paragraph(ptext5, centered5)
            d5.append(titlesTable5)        

        data5 = [d5]
        
        table5 = Table(data5, colWidths=[250,250])
        tStyle5 = TableStyle([('LEFTPADDING', (0,0), (-1,-1), 0)])
        table5.setStyle(tStyle5)
        self.elements.append(table5)

        spacer = Spacer(10, 15)
        self.elements.append(spacer)
        
        """
        Create the line items
        """
        d = []
        textData = ["Date", "Invoice No", "Description", "Credit (Rs)", "Debit (Rs)", "Balance (Rs)"]
                
        fontSize = 8
        centered = ParagraphStyle(name="centered", alignment=TA_CENTER, textColor=colors.white)
        for text in textData:
            ptext = "<font size='%s'><b>%s</b></font>" % (fontSize, text)
            titlesTable = Paragraph(ptext, centered)
            d.append(titlesTable)        

        data = [d]
        lineNum = 1
        formattedLineData = []

        alignStyle = [ParagraphStyle(name="01", alignment=TA_CENTER),
                      ParagraphStyle(name="02", alignment=TA_CENTER),
                      ParagraphStyle(name="03", alignment=TA_LEFT),
                      ParagraphStyle(name="04", alignment=TA_CENTER),
                      ParagraphStyle(name="05", alignment=TA_CENTER),
                      ParagraphStyle(name="06", alignment=TA_CENTER)]
        for row in ledger_data:
            ledg_date = datetime.datetime.strptime(str(row.ledger_gen_date), dt_format)
            leg_gen_dt = ledg_date.strftime("%d/%m/%Y")
            u_bill_no = str(row.ledger_bill).strip()
            leg_bill_no = ''
            if(len(u_bill_no) == 0):
                leg_bill_no = "Order_" +  str(row.id).strip()
            else:
                leg_bill_no = u_bill_no
            lineData = [str(leg_gen_dt), leg_bill_no, str(row.ledger_descp).strip().capitalize(), str(row.ledger_credit_amount), str(row.ledger_debit_amount), str(row.ledger_balance)]
            #data.append(lineData)
            columnNumber = 0
            for item in lineData:
                ptext = "<font size='%s'>%s</font>" % (fontSize-1, item)
                p = Paragraph(ptext, alignStyle[columnNumber])
                formattedLineData.append(p)
                columnNumber = columnNumber + 1
            data.append(formattedLineData)
            formattedLineData = []
            
        # Row for total
        totalRow = ["Grand Total", "", "","Rs " + format(int(str(total_credit).strip()), ",") ,"Rs " + format(int(str(total_debit).strip()), ","),party_net]
        for item in totalRow:
            ptext = "<font size='%s'><b>%s</b></font>" % (fontSize-1, item)
            p = Paragraph(ptext, ParagraphStyle(name="01", alignment=TA_CENTER, textColor=colors.white))
            formattedLineData.append(p)
        data.append(formattedLineData)
        
        table = Table(data, colWidths=[70,70, 160, 70, 70, 70])
        tStyle = TableStyle([
                ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                ("ALIGN", (1, 0), (1, -1), 'RIGHT'),
                ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
                ('LINEABOVE', (0, 0), (-1, -1), 1, self.colorOhkaBlue1),
                ('BACKGROUND',(0, 0), (-1, 0), self.colorOhkaBlue0),
                ('BACKGROUND',(0, -1),(-1, -1), self.colorOhkaBlue1),
                ('TEXTCOLOR',(0, 0), (-1, 0),colors.white),
                ('TEXTCOLOR',(0, -1),(-1, -1),colors.white),
                ])
        table.setStyle(tStyle)
        self.elements.append(table)
        
        spacer = Spacer(10, 7)
        self.elements.append(spacer)
        
        text_rp = "Report Generated : "+ datetime.datetime.today().strftime("%I:%M %p") +" | " + date_today.strftime("%d %b %Y")
        
        d9 = []
        textData9 = [text_rp, ""]
                
        fontSize9 = 12
        centered9  = ParagraphStyle('Report', fontSize=10, alignment=TA_LEFT, borderWidth=3, textColor=self.colorOhkaBlue0)
        for text9 in textData9:
            #ptext9 = "<font size='%s'><b>%s</b></font>" % (fontSize9-1, text9)
            titlesTable9 = Paragraph(text9, centered9)
            d9.append(titlesTable9)        

        data9 = [d9]
        
        table9 = Table(data9, colWidths=[250,250])
        tStyle9 = TableStyle([('LEFTPADDING', (0,0), (-1,-1), 0)])
        table9.setStyle(tStyle9)
        self.elements.append(table9)
        
        spacer = Spacer(10, 15)
        self.elements.append(spacer)

class FooterCanvas(canvas.Canvas):

    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self.pages = []
        self.width, self.height = LETTER

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        page_count = len(self.pages)
        for page in self.pages:
            self.__dict__.update(page)
            if (self._pageNumber > 0):
                self.draw_canvas(page_count)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_canvas(self, page_count):
        page = "Page %s of %s" % (self._pageNumber, page_count)
        x = 128
        self.saveState()
        self.setStrokeColorRGB(0, 0, 0)
        self.setLineWidth(0.5)
        self.drawString(40, 750, "Macro Collection")
        self.setFont('Times-Roman', 10)
        self.drawString(40, 730, "03189473947")
        #self.drawImage("static/logo.png", self.width-inch*8-5, self.height-50, width=100, height=20, preserveAspectRatio=True)
        self.drawImage("static/logo.png", self.width - inch * 2, self.height-50, width=100, height=30, preserveAspectRatio=True, mask='auto')
        self.line(30, 720, LETTER[0] - 50, 720)
        self.line(66, 78, LETTER[0] - 66, 78)
        self.setFont('Times-Roman', 10)
        self.drawString(LETTER[0]-x, 65, page)
        self.restoreState()



@api15.route('/generate_pdf/<type>/<id>/<userid>', methods = ['GET'])
def generate_pdf(type,id,userid):
    buffer = BytesIO()
    report = PDFPSReporte(buffer, id, type, userid)
    buffer.seek(0)
    return send_file(buffer, download_name='book_catalog.pdf',as_attachment=True)
