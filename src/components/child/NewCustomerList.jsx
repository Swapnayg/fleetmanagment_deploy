"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import $ from 'jquery'; 
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const NewCustomerList = () => {

    const [clientName, setclientName] = useState("");
    const [clientId, setId] = useState(0);
    const [clientCmp, setclientCmp] = useState("");
    const [clientPhone, setclientPhone] = useState("");
    const [clientEmail, setclientEmail] = useState("");
    const [clientAddress, setclientAddress] = useState("");
    const [clientCity, setclientCity] = useState("");
    const [clientRegion, setclientRegion] = useState("");
    const [clientCountry, setclientCountry] = useState("");
    const [clientPostBox, setclientPostBox] = useState("");
    const [clientTaxid, setclientTaxid] = useState("");
    const [clientGrp, setclientGrp] = useState("");
    const [sameAddress, setsameAddress] = useState(false);

    const [shippName, setshippName] = useState("");
    const [shippPhone, setshippPhone] = useState("");
    const [shippEmail, setshippEmail] = useState("");
    const [shippAddress, setshippAddress] = useState("");
    const [shippCity, setshippCity] = useState("");
    const [shippRegion, setshippRegion] = useState("");
    const [shippCountry, setshippCountry] = useState("");
    const [shippPostBox, setshippPostBox] = useState("");

    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  
    const canSubmit = clientName.length > 0 && clientPhone.length > 0 && clientEmail.length > 0 && clientEmail.match(isValidEmail) ;
  

    function handleChange(e)
    {
        setsameAddress(!sameAddress);
        if(e.target.checked)
        {
          setshippName(clientName);
          setshippPhone(clientPhone);
          setshippEmail(clientEmail);
          setshippAddress(clientAddress);
          setshippCity(clientCity);
          setshippRegion(clientRegion);
          setshippCountry(clientCountry);
          setshippPostBox(clientPostBox);
        }
        else
        {
          setshippName("");
          setshippPhone("");
          setshippEmail("");
          setshippAddress("");
          setshippCity("");
          setshippRegion("");
          setshippCountry("");
          setshippPostBox("");
        }
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      if($("#btcclientsubmit").text().trim() == "Save")
      {
        fetch('https://backend-55jj.onrender.com/add_customer_values', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({userid:localStorage.getItem('id'),  c_clientName: clientName, c_clientCmp: clientCmp, c_clientPhone :clientPhone , c_clientEmail: clientEmail , c_clientAddress: clientAddress, c_clientCity: clientCity, c_clientRegion: clientRegion, c_clientCountry: clientCountry, c_clientPostBox: clientPostBox, c_clientTaxid: clientTaxid, c_clientGrp: clientGrp, c_sameAddress:sameAddress, c_shippName:shippName, c_shippPhone:shippPhone, c_shippEmail:shippEmail, c_shippAddress:shippAddress, c_shippCity:shippCity, c_shippRegion:shippRegion, c_shippCountry:shippCountry, c_shippPostBox:shippPostBox})
          }).then(res => {
              return res.json();
          }).then(data => {
          if(data.data.toString().trim() == "exits")
            {
              withReactContent(Swal).fire({
                icon: "error",
                title: "Oops...",
                text: "Customer Already Exists!",
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
    setclientName("");
    setclientCmp("");
    setclientPhone("");
    setclientEmail("");
    setclientAddress("");
    setclientCity("");
    setclientRegion("");
    setclientCountry("");
    setclientPostBox("");
    setclientTaxid("");
    setsameAddress(false);
    setshippName("");
    setshippPhone("");
    setshippEmail("");
    setshippAddress("");
    setshippCity("");
    setshippRegion("");
    setshippCountry("");
    setshippPostBox("");
    setId(0);
  };

  
  useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
      let table;
      $("#client_group").empty();
      //$("#client_group").append("<option value=''>Select Group</option>");
      fetch('https://backend-55jj.onrender.com/c_group_data'+'/'+localStorage.getItem('id')).then((res) =>
        res.json().then((jsprovdata) => {
        for (let i = 0; i < jsprovdata.length; i++) {
          $("#client_group").append("<option value=\"" + jsprovdata[i].id  + "\">" + jsprovdata[i].group_name + "</option>");
        }
        setclientGrp(jsprovdata[0].id);
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
          <h5 className="card-title mb-0">Add Customer</h5>
        </div>
        <div className="card-body">
          <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
            {/* Party Name */}
            <div className="col-md-10">
            <h6 className="text-md fw-semibold mb-0">Billing Address</h6>
            </div>
            <div className="col-md-4">
              <label className="form-label">Name *</label>
              <input
                type="text"
                className="form-control"
                value={clientName}
                onChange={(e) => setclientName(e.target.value)}
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
                value={clientCmp}
                onChange={(e) => setclientCmp(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label"> Phone *</label>
             
              <input
                type="number"
                className="form-control"
                value={clientPhone}
                onChange={(e) => setclientPhone(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Email *</label>
              

              <input
                type="email"
                className="form-control"
                value={clientEmail}
                onChange={(e) => setclientEmail(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={clientAddress}
                onChange={(e) => setclientAddress(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={clientCity}
                onChange={(e) => setclientCity(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Region</label>
              <input
                type="text"
                className="form-control"
                value={clientRegion}
                onChange={(e) => setclientRegion(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                value={clientCountry}
                onChange={(e) => setclientCountry(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Post Box</label>  
              <input
                type="number"
                className="form-control"
                value={clientPostBox}
                onChange={(e) => setclientPostBox(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Tax ID</label>
              <input
                type="text"
                className="form-control"
                value={clientTaxid}
                onChange={(e) => setclientTaxid(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Customer Group</label>
              <select 
              id="client_group"
                className="form-select"
                value={clientGrp}
                onChange={(e) => setclientGrp(e.target.value)}
                required
              >     
              </select>
            </div>
            <div className="card-header border-bottom bg-base py-16 px-24">
                <h6 className="text-md fw-semibold mb-0">Shipping Address</h6>
                <p className="text-sm mt-1 mb-0">Please leave Shipping Address blank if you do not want to print it on the invoice.</p>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-28">
                        <div className="form-switch switch-primary d-flex align-items-center gap-3">
                        <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="yes"
                                checked={sameAddress}
                                onChange={handleChange}
                            />
                            <label className="form-check-label line-height-1 fw-medium text-secondary-light">
                                Same As Billing
                            </label>
                        </div>
              </div>
              <div className="col-md-4">
              <label className="form-label">Name *</label>
              <input
                type="text"
                className="form-control"
                value={shippName}
                onChange={(e) => setshippName(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label"> Phone *</label>

              <input
                type="number"
                className="form-control"
                value={shippPhone}
                onChange={(e) => setshippPhone(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-control"
                value={shippEmail}
                onChange={(e) => setshippEmail(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={shippAddress}
                onChange={(e) => setshippAddress(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={shippCity}
                onChange={(e) => setshippCity(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Region</label>
              <input
                type="text"
                className="form-control"
                value={shippRegion}
                onChange={(e) => setshippRegion(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                value={shippCountry}
                onChange={(e) => setshippCountry(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Post Box</label>  
              <input
                type="number"
                className="form-control"
                value={shippPostBox}
                onChange={(e) => setshippPostBox(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="col-12 mt-3 d-flex gap-2">
              <button className="btn btn-primary" id="btcclientsubmit" onClick={handleSubmit} disabled={!canSubmit} >
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


export default NewCustomerList;