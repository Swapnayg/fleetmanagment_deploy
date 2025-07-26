"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import $ from 'jquery'; 
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const NewSupplierList = () => {

    const [supplName, setsupplName] = useState("");
    const [supplId, setId] = useState(0);
    const [supplCmp, setsupplCmp] = useState("");
    const [supplPhone, setsupplPhone] = useState("");
    const [supplEmail, setsupplEmail] = useState("");
    const [supplAddress, setsupplAddress] = useState("");
    const [supplCity, setsupplCity] = useState("");
    const [supplRegion, setsupplRegion] = useState("");
    const [supplCountry, setsupplCountry] = useState("");
    const [supplPostBox, setsupplPostBox] = useState("");
    const [supplTaxid, setsupplTaxid] = useState("");
    const [supplGrp, setsupplGrp] = useState("");


    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  
    const canSubmit = supplName.length > 0 && supplPhone.length > 0 ;
  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      if($("#btcsupplsubmit").text().trim() == "Save")
      {
        fetch('https://backend-55jj.onrender.com/add_supplier_values', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({userid:localStorage.getItem('id'), s_supplName: supplName, s_supplCmp: supplCmp, s_supplPhone :supplPhone , s_supplEmail: supplEmail , s_supplAddress: supplAddress, s_supplCity: supplCity, s_supplRegion: supplRegion, s_supplCountry: supplCountry, s_supplPostBox: supplPostBox, s_supplTaxid: supplTaxid})
          }).then(res => {
              return res.json();
          }).then(data => {
            if(data.data.toString().trim() == "exits")
              {
                withReactContent(Swal).fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Supplier Already Exists!",
                  draggable: true
                });
                handleReset();
              }
              else{
                if(parseInt(data) != 0)
                {
                  handleReset();
                }
              }
        });
      }
  }
}

  const handleReset = () => {
    setsupplName("");
    setsupplCmp("");
    setsupplPhone("");
    setsupplEmail("");
    setsupplAddress("");
    setsupplCity("");
    setsupplRegion("");
    setsupplCountry("");
    setsupplPostBox("");
    setsupplTaxid("");
    setId(0);
  };

   useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
      let table;  
      return () => {
        if (table) table.destroy(true);
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
          <h5 className="card-title mb-0">Add Supplier</h5>
        </div>
        <div className="card-body">
          <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
            <div className="col-md-4">
              <label className="form-label">Name *</label>
              <input
                type="text"
                className="form-control"
                value={supplName}
                onChange={(e) => setsupplName(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            {/* province */}
            <div className="col-md-4">
              <label className="form-label"> Company</label>
              <input
                type="text"
                className="form-control"
                value={supplCmp}
                onChange={(e) => setsupplCmp(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label"> Phone *</label>
             
              <input
                type="number"
                className="form-control"
                value={supplPhone}
                onChange={(e) => setsupplPhone(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Email</label>
              

              <input
                type="email"
                className="form-control"
                value={supplEmail}
                onChange={(e) => setsupplEmail(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={supplAddress}
                onChange={(e) => setsupplAddress(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={supplCity}
                onChange={(e) => setsupplCity(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Region</label>
              <input
                type="text"
                className="form-control"
                value={supplRegion}
                onChange={(e) => setsupplRegion(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                value={supplCountry}
                onChange={(e) => setsupplCountry(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Post Box</label>  
              <input
                type="number"
                className="form-control"
                value={supplPostBox}
                onChange={(e) => setsupplPostBox(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Tax ID</label>
              <input
                type="text"
                className="form-control"
                value={supplTaxid}
                onChange={(e) => setsupplTaxid(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>
           
            {/* Action Buttons */}
            <div className="col-12 mt-3 d-flex gap-2">
              <button className="btn btn-primary" id="btcsupplsubmit" onClick={handleSubmit} disabled={!canSubmit} >
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


export default NewSupplierList;