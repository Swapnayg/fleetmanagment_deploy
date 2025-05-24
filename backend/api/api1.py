from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from clientgroup import ClientGroup
from clients import Clients
from goodsnlc import GoodsNlc
from inwarehouse import InvWarehouses
from oilpso import OilPso
from party import Party
from partybill import PartyBill
from productctegory import ProductCategory
from stkRtn import TblStockRtn
from stocktransfer import StockTrasfer
from tblOrder import TblOrder
from tblProduct import TblProduct
from extensions import db
from sqlalchemy import and_

api1 = Blueprint('api1', __name__)

@api1.route('/party_data/<userid>', methods=['GET']) 
def party_index(userid): 
    parties = Party.query.filter(Party.userid == int(userid)).all()
    data = []
    for party in parties:
        data.append(party.map())
    return jsonify(data)

@api1.route('/inwarehouse_data/<userid>', methods=['GET']) 
def inwarehouse_index(userid): 
    inwarehouse = InvWarehouses.query.filter(InvWarehouses.userid == int(userid)).all()
    inwaredata = []
    for inware in inwarehouse:
        inwaredata.append(inware.map())
    return jsonify(inwaredata)

@api1.route('/stock_transfer_data/<userid>', methods=['GET']) 
def stock_transfer_index(userid): 
    stock_transfer = StockTrasfer.query.filter(StockTrasfer.userid == int(userid)).all()
    stktrnfdata = []
    for stk_tran in stock_transfer:
        stktrnfdata.append(stk_tran.map())
    return jsonify(stktrnfdata)


@api1.route('/p_category_data/<userid>', methods=['GET'])  
def p_category_index(userid): 
    p_categories = ProductCategory.query.filter(ProductCategory.userid == int(userid)).all()
    categorydata = []
    for category in p_categories:
        product_data =  TblProduct.query.filter(and_(TblProduct.product_cat == category.id, TblProduct.userid == int(userid))).all()
        no_products = len(product_data)
        no_stock = 0
        retail_price = 0
        whole_price = 0
        for product in product_data:
            no_stock = no_stock + int(product.product_stock)
            retail_price += (int(product.product_rental) * int(product.product_stock))
            whole_price += (int(product.product_whole_price) * int(product.product_stock))
        categorydata.append({"id":category.id,"cat_name":category.product_cat_name,"cat_descp":category.product_cat_desp, "no_products":no_products, "total_stock":no_stock,"total_retail":retail_price,"total_wholesale":whole_price})
    return jsonify(categorydata)

@api1.route('/c_group_data/<userid>', methods=['GET'])  
def c_group_index(userid): 
    c_groups = ClientGroup.query.filter(ClientGroup.userid == int(userid)).all()
    groupdata = []
    for group in c_groups:
        clients_data =  Clients.query.filter(and_(Clients.client_group == group.id , Clients.userid == int(userid))).all()
        no_clients = len(clients_data)
        groupdata.append({"id":group.id,"group_name":group.group_name,"group_descp":group.group_descp, "no_clients":no_clients})
    return jsonify(groupdata)


@api1.route('/get_goods_billNo/<userid>', methods=['GET'])   
def Goods_bill_index(userid):
    descending = GoodsNlc.query.order_by(GoodsNlc.id.desc())
    last_item = descending.first()
    bill_no = ''
    if(last_item == None):
        bill_no = 1 
    else:
        bill_no =  int(last_item.id) + 1
    db.session.flush()
    db.session.commit()
    return jsonify({"data":bill_no})

@api1.route('/get_party_bill_billNo/<userid>', methods=['GET'])    
def Party_bill_index(userid):
    descending = PartyBill.query.order_by(PartyBill.id.desc())
    last_item = descending.first()
    bill_no = ''
    if(last_item == None):
        bill_no = 1 
    else:
        bill_no =  int(last_item.id) + 1
    db.session.flush()
    db.session.commit()
    return jsonify({"data":bill_no})


@api1.route('/get_oil_billNo/<userid>', methods=['GET'])    
def Oil_bill_index(userid):
    o_descending = OilPso.query.order_by(OilPso.id.desc())
    o_last_item = o_descending.first()
    o_bill_no = ''
    if(o_last_item == None):
        o_bill_no = 1
    else:
        o_bill_no =  int(o_last_item.id) + 1
    db.session.flush()
    db.session.commit()
    return jsonify({"data":o_bill_no})

@api1.route('/get_order_invNo/<userid>', methods=['GET'])    
def Ord_inv_index(userid):
    o_descending = TblOrder.query.order_by(TblOrder.id.desc())
    o_last_item = o_descending.first()
    o_inv_no = ''
    if(o_last_item == None):
        o_inv_no = 1
    else:
        o_inv_no =  int(o_last_item.id) + 1
    db.session.flush()
    db.session.commit()
    return jsonify({"data":o_inv_no})

@api1.route('/get_stk_return_invNo/<userid>', methods=['GET'])    
def stk_inv_index(userid):
    o_descending = TblStockRtn.query.order_by(TblStockRtn.id.desc())
    o_last_item = o_descending.first()
    o_inv_no = ''
    if(o_last_item == None):
        o_inv_no = 1
    else:
        o_inv_no =  int(o_last_item.id) + 1
    db.session.flush()
    db.session.commit()
    return jsonify({"data":o_inv_no})

