from flask import Blueprint
from flask import Flask, render_template, request, Response, send_file , redirect, session, url_for, jsonify
from catgeory import Categories
from citysetup import CitySetup
from clnstkrtn import TblClnStockRtn
from modeofpayment import ModeOfPayment
from province import Province
from reccIncoice import TblReccInvoice
from tblInvoice import TblInvoice
from tblProduct import TblProduct
from tblQuote import TblQuote
from units import Units
from vehicles import Vehicles
from warehouse import Warehouse
from extensions import db
from sqlalchemy import and_
api2 = Blueprint('api2', __name__)


@api2.route('/get_cust_rtn_invNo/<userid>', methods=['GET'])   
def cust_inv_index(userid):
    o_descending = TblClnStockRtn.query.order_by(TblClnStockRtn.id.desc())
    o_last_item = o_descending.first()
    o_inv_no = ''
    if(o_last_item == None):
        o_inv_no = 1
    else:
        o_inv_no =  int(o_last_item.id) + 1
    db.session.flush()
    db.session.commit()
    return jsonify({"data":o_inv_no})

@api2.route('/get_quote_invNo/<userid>', methods=['GET'])   
def quote_inv_index(userid):
    o_descending = TblQuote.query.order_by(TblQuote.id.desc())
    o_last_item = o_descending.first()
    o_inv_no = ''
    if(o_last_item == None):
        o_inv_no = 1
    else:
        o_inv_no =  int(o_last_item.id) + 1
    db.session.flush()
    db.session.commit()
    return jsonify({"data":o_inv_no})


@api2.route('/get_invoice_invNo/<userid>', methods=['GET'])
def invoice_index(userid):
    o_descending = TblInvoice.query.order_by(TblInvoice.id.desc())
    o_last_item = o_descending.first()
    o_inv_no = ''
    if(o_last_item == None):
        o_inv_no = 1
    else:
        o_inv_no =  int(o_last_item.id) + 1
    db.session.flush()
    db.session.commit()
    return jsonify({"data":o_inv_no})

@api2.route('/get_recc_inv_invNo/<userid>', methods=['GET'])
def recc_inv_index(userid):
    o_descending = TblReccInvoice.query.order_by(TblReccInvoice.id.desc())
    o_last_item = o_descending.first()
    o_inv_no = ''
    if(o_last_item == None):
        o_inv_no = 1
    else:
        o_inv_no =  int(o_last_item.id) + 1
    db.session.flush()
    db.session.commit()
    return jsonify({"data":o_inv_no})

@api2.route('/province_data/<userid>', methods=['GET'])
def prov_index(userid): 
    provce = Province.query.filter(Province.userid == userid).all()
    data_prv = []
    for prov in provce:
        data_prv.append(prov.map())

    return jsonify(data_prv)


@api2.route('/mode_of_pay_data/<userid>', methods=['GET'])
def mode_pay_index(userid): 
    mode_pay = ModeOfPayment.query.filter(ModeOfPayment.userid == userid).all()
    data_mode = []
    for pay in mode_pay:
        data_mode.append(pay.map())

    return jsonify(data_mode)

@api2.route('/city_setup_data/<userid>', methods=['GET'])
def city_setup_index(userid): 
    city_setup = CitySetup.query.filter(CitySetup.userid == userid).all()
    data_city_set = []
    for city_set in city_setup:
        data_city_set.append(city_set.map())

    return jsonify(data_city_set)

@api2.route('/unit_data/<userid>', methods=['GET'])
def unit_index(userid): 
    unit_set = Units.query.filter(Units.userid == userid).all()
    data_unit = []
    for unit_s in unit_set:
        data_unit.append(unit_s.map())

    return jsonify(data_unit)

@api2.route('/category_data/<userid>', methods=['GET'])
def category_index(userid): 
    category_set = Categories.filter(Categories.userid == userid).query.all()
    data_category = []
    for cat_set in category_set:
        data_category.append(cat_set.map())

    return jsonify(data_category)

@api2.route('/warehouse_data/<userid>', methods=['GET'])
def warehouse_index(userid): 
    warehouse_set = Warehouse.query.filter(Warehouse.userid == userid).all()
    data_warehouse = []
    for ware_set in warehouse_set:
        data_warehouse.append(ware_set.map())

    return jsonify(data_warehouse)


@api2.route('/vehicle_data/<userid>', methods=['GET'])
def vehicle_index(userid): 
    vehicle_set = Vehicles.query.filter(Vehicles.userid == userid).all()
    data_vehicle = []
    for vecle_set in vehicle_set:
        data_vehicle.append(vecle_set.map())

    return jsonify(data_vehicle)

@api2.route('/product_data', methods=['POST']) 
def product_index(): 
    data = request.get_json()
    party_id = int(data['warehouse_id'])
    userid = int(data['userid'])
    product_set = TblProduct.query.filter(and_(TblProduct.product_ware == party_id, TblProduct.userid == userid)).order_by(TblProduct.id.asc()).all()
    data_product = []
    for prod_set in product_set:
        data_product.append(prod_set.map())
    return jsonify(data_product)


@api2.route('/product_data/<userid>', methods=['GET'])
def product_list_index(userid): 
    product_set = TblProduct.query.filter(TblProduct.userid == userid).all()
    data_product = []
    for prod_set in product_set:
        data_product.append(prod_set.map())
    return jsonify(data_product)
