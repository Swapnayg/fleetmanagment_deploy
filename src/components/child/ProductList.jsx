"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import $ from 'jquery'; 
import { Icon } from "@iconify/react/dist/iconify.js";


const ProductList = () => {

    const [prodName, setprodName] = useState("");
    const [prodId, setId] = useState(0);
    const [prodcat, setprodcat] = useState("");
    const [prodware, setprodware] = useState("");
    const [prodcode, setprodcode] = useState("");
    const [retltprice, setretltprice] = useState("");
    const [wholeprice, setwholeprice] = useState("");
    const [pdttax, setpdttax] = useState("");
    const [pdtdisc, setpdtdisc] = useState("");
    const [pdtunits, setpdtunits] = useState("");
    const [pdtalert, setpdtalert] = useState("");
    const [pdtdesrip, setpdtdesrip] = useState("");
    const canSubmit = prodName.length > 0 && prodcat.length > 0 && prodware.length > 0 && prodcode.length > 0 && retltprice.length > 0 && wholeprice.length > 0 && pdttax.length > 0 && pdtdisc.length > 0 && pdtunits.length > 0 && pdtalert.length > 0 && pdtdesrip.length > 0;
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      if($("#btcnprodsubmit").text().trim() == "Save")
      {
        fetch('https://backend-55jj.onrender.com/add_product_values', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({userid:localStorage.getItem('id'), p_prodName: prodName, p_prodcat: prodcat, p_prodware :prodware , p_prodcode: prodcode , p_retltprice: retltprice, p_wholeprice: wholeprice, p_pdttax: pdttax, p_pdtdisc: pdtdisc, p_pdtunits: pdtunits, p_pdtalert: pdtalert, p_pdtdesrip: pdtdesrip})
          }).then(res => {
              return res.json();
          }).then(data => {
          if(parseInt(data) != 0)
          {
              handleReset();
          }
        });
      }
  }
}

  const handleReset = () => {
    setprodName("");
    setprodcat("");
    setprodware("");
    setprodcode("");
    setretltprice("");
    setwholeprice("");
    setpdttax("");
    setpdtdisc("");
    setpdtunits("");
    setpdtalert("");
    setpdtdesrip("");
    setId(0);
  };

  
  useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
      let table;
      $("#prod_category").empty();  
      $("#prod_category").append("<option value=''>Select Category</option>");
      fetch('https://backend-55jj.onrender.com/p_category_data'+'/'+localStorage.getItem('id')).then((res) =>
            res.json().then((jsprovdata) => {
              for (let i = 0; i < jsprovdata.length; i++) {
                $("#prod_category").append("<option value=\"" + jsprovdata[i].id  + "\">" + jsprovdata[i].cat_name + "</option>");
              }
      }));

      $("#prod_unit").empty();
      $("#prod_unit").append("<option value=''>Select Warehouse</option>");
      fetch('https://backend-55jj.onrender.com/warehouse_data'+'/'+localStorage.getItem('id')).then((res) =>
        res.json().then((jsprovdata) => {
          for (let i = 0; i < jsprovdata.length; i++) {
            $("#prod_unit").append("<option value=\"" + jsprovdata[i].id  + "\">" + jsprovdata[i].ware_name + "</option>");
        }
      }));
      return () => {

      };
    }
    else
    {
      window.location.href = '/login';
    }
  }, []);

  
  return (
    <div>
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Add Products</h5>
        </div>
        <div className="card-body">
          <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
            {/* Party Name */}
            <div className="col-md-4">
              <label className="form-label">Product Name *</label>
              

              <input
                type="text"
                className="form-control"
                value={prodName}
                onChange={(e) => setprodName(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            {/* province */}
            <div className="col-md-4">
              <label className="form-label"> Select Category *</label>
             
              <select 
              id="prod_category"
                className="form-select"
                value={prodcat}
                onChange={(e) => setprodcat(e.target.value)}
                required
              >
                 
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label"> Select Warehouse *</label>
             
              <select 
              id="prod_unit"
                className="form-select"
                value={prodware}
                onChange={(e) => setprodware(e.target.value)}
                required
              >
                 
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Product Code *</label>
              

              <input
                type="number"
                className="form-control"
                value={prodcode}
                onChange={(e) => setprodcode(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Product Retail Price *</label>
              <div className="input-group">
              <span className="input-group-text bg-base"> <Icon icon='solar:dollar-line-duotone' /> </span>
              <input
                type="text"
                className="form-control"
                value={retltprice}
                onChange={(e) => setretltprice(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Product Wholesale Price *</label>
              <div className="input-group">
              <span className="input-group-text bg-base"> <Icon icon='solar:dollar-line-duotone' /> </span>
              <input
                type="text"
                className="form-control"
                value={wholeprice}
                onChange={(e) => setwholeprice(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Default TAX Rate *</label>
              <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={pdttax}
                onChange={(e) => setpdttax(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
              <span className='input-group-text bg-base'>
              <Icon icon='material-symbols:percent' />
              </span>
            </div>
            <p className="text-sm mt-1 mb-0">You can change Tax rate during invoice creation also.</p>
            </div>

            <div className="col-md-4">
              <label className="form-label">Default Discount Rate *</label>
              <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={pdtdisc}
                onChange={(e) => setpdtdisc(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
              <span className='input-group-text bg-base'>
              <Icon icon='material-symbols:percent' />
              </span>
            </div>
            <p className="text-sm mt-1 mb-0">You can change Discount rate during invoice creation also.</p>
            </div>

            <div className="col-md-4">
              <label className="form-label">Stock Units *</label>
              

              <input
                type="text"
                className="form-control"
                value={pdtunits}
                onChange={(e) => setpdtunits(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Alert Quantity *</label>
              

              <input
                type="text"
                className="form-control"
                value={pdtalert}
                onChange={(e) => setpdtalert(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Description *</label>
              

              <textarea
                type="text"
                className="form-control"
                value={pdtdesrip}
                onChange={(e) => setpdtdesrip(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required></textarea>
            </div>

            {/* Action Buttons */}
            <div className="col-12 mt-3 d-flex gap-2">
              <button className="btn btn-primary" id="btcnprodsubmit" onClick={handleSubmit} disabled={!canSubmit} >
                <Icon icon="mdi:content-save" className="me-1" /> Save
              </button>
              <button
                className="btn btn-secondary"
                province="button"
                onClick={handleReset}
              >
                <Icon icon="mdi:refresh" className="me-1" /> Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};


export default ProductList;