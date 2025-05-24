"use client";
import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from 'moment';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const GoodPartyLists = () => {

    const [partyName, setPartyName] = useState("");
    const [partyId, setId] = useState(0);
    const [type, setType] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [hidden, setHidden] = useState(true);
    const [l_partyName, setl_partyName] = useState("");
    const [l_partyBal, setl_partyBal] = useState("");
    const [l_partyId, setl_partyId] = useState("");
    const [mainhidden, setHiddenmain] = useState(false);
    const [ledPartId, setledPartId] = useState(0);
    const [ledParChatId, setledParChatId] = useState(0);
    const canSubmit = partyName.length > 0 && phoneNo.toString().length > 0;
    const tbodyRef = useRef(null);

const handlePrint = (e) => {
  var party_type = 'party';
  fetch('https://secondsweb.com/generate_pdf/'+party_type+'/'+l_partyId+'/'+localStorage.getItem('id'))
  .then(resp => resp.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    var partyname = l_partyName;
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = partyname.toString().replace(" ","_") + '_Ledger.pdf';
    document.body.appendChild(a);
    a.click();
  })
  .catch(() => 
  console.log("error"));
};
    
const handleExport = (e) => {
  e.preventDefault();  
  let data = "";
  const tableData = [];
  const rows = document.querySelectorAll("#party_ledger tr");
  for (const row of rows) {
    const rowData = [];
    for (const [index, column] of row.querySelectorAll("th, td").entries()) {
      // To retain the commas in the "Description" column, we can enclose those fields in quotation marks.
      if ((index + 1) % 3 === 0) {
        rowData.push('"' + column.innerText + '"');
      } else {
        rowData.push(column.innerText);
      }
    }
    tableData.push(rowData.join(","));
  }
  var partyname = l_partyName;
  data += tableData.join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
  a.setAttribute("download", partyname.toString().replace(" ","_")+"_Ledger.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
const handleBack = (e) => {
      e.preventDefault();
      setHiddenmain(false);
      setHidden(true);
      setledPartId(0);
      setledParChatId(0);
      setl_partyName("");
      setl_partyBal("");
      setl_partyId(0);
      if (tbodyRef.current) {
        tbodyRef.current.innerHTML = '';
      }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      const btn_elm = document.getElementById('btnpartysubmit');
      if(btn_elm.textContent.toString().trim() == "Save")
      {
        fetch('https://secondsweb.com/add_party', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', }, 
          body: JSON.stringify({userid:localStorage.getItem('id'),party: partyName, p_type: 'goods', p_contactPerson: contactPerson, p_phoneNo: phoneNo})
        }).then(res => {
          return res.json();
        }).then(data => {
          if(data.data.toString().trim() == "exits")
            {
              withReactContent(Swal).fire({
                icon: "error",
                title: "Oops...",
                text: "Party Already Exists!",
                draggable: true
              });
              handleReset();
            }
            else{
              if(parseInt(data) != 0)
              {
                //refreshtable();
              }
            }
      });
      }
      else if(btn_elm.textContent.toString().trim() == "Update")
      {
          fetch('https://secondsweb.com/update_party', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', }, 
            body: JSON.stringify({userid:localStorage.getItem('id'),party_id:partyId, party: partyName,p_type: 'goods', p_contactPerson: contactPerson, p_phoneNo: phoneNo})
          }).then(res => {
            return res.json();
          }).then(data => {
            if(data.data == "updated")
            {
              btn_elm.textContent = "Save";
              refreshtable();
            }
        });
      }
    }
  }

  const handleReset = () => {
    setPartyName("");
    setType("");
    setContactPerson("");
    setPhoneNo("");
    setId(0);
  };

  function refreshtable()
  {
    handleReset(); 
  }
  useEffect(() => {
    let table;
  }, []);

  return (
    <div>
    <div className="col-lg-12" id="ledger_details" hidden={hidden}>
    <div className="card">
    <div className="col-md-3">
    <button type="button" className="custom_back btn rounded-pill btn-outline-primary-600 radius-8 px-20 py-11 d-flex align-items-center gap-2"  onClick={handleBack}  >
        <Icon icon="mingcute:square-arrow-left-line" className="text-xl" />{" "} Back To List </button>
        </div>
        <div className="card-header border-bottom-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title mb-0">Party Ledger Statement</h5>
            <div className="text-muted card-title small mt-1">{l_partyName}</div>
          </div>
          <div className="d-flex align-items-center">
            <div className="d-flex flex-column text-success fw-bold">
              <span className="small">Current Balance</span>
              <span className="fs-4">Rs. {l_partyBal}</span>
            </div>
            {/* <Icon icon="fa6-solid:rupee-sign" width="48" height="48" />{" "} */}
          </div>
        </div>

        <div className="card-body p-45">
          <div className="table-responsive ledger-table">
            <table className="table mb-0" id="party_ledger">
              <thead className="bg-light">
                <tr>
                  <th>Date</th>
                  <th>Invoice No</th>
                  <th>Description</th>
                  <th className="text-end">Credit (Rs) </th>
                  <th className="text-end">Debit (Rs)  </th>
                  <th className="text-end">Balance (Rs)</th>
                </tr>
              </thead>
              <tbody ref={tbodyRef}>
                
              </tbody>
              <tfoot>
                  <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="text-end"> </td>
                  <td className="text-end card-title">Total (Rs)  </td>
                  <td className="text-end bold card-title">{l_partyBal}</td>
                  </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="card-footer bg-light text-end">
          <button className="btn btn-outline-secondary btn-sm me-2" onClick={handlePrint}>
            <Icon icon="mdi:printer" className="me-1" /> Print
          </button>
          <button className="btn btn-outline-primary btn-sm" onClick={handleExport}>
            <Icon icon="mdi:download" className="me-1" /> Export
          </button>
        </div>
      </div>

    </div>
    <div className="col-lg-12" hidden={mainhidden}>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Add Party</h5>
        </div>
        <div className="card-body">
          <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
            {/* Party Name */}
            <div className="col-md-4">
              <label className="form-label">Party Name *</label>

              <input
                type="text"
                className="form-control"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            {/* Contact Person */}
            <div className="col-md-4">
              <label className="form-label">Contact Person</label>
              <input
                type="text"
                className="form-control"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
              />
            </div>

            {/* Phone Number */}
            <div className="col-md-4">
              <label className="form-label">Phone No *</label>
              <input
                type="number"
                className="form-control"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
              />
            </div>

            {/* Action Buttons */}
            <div className="col-12 mt-3 d-flex gap-2">
              <button className="btn btn-primary" id="btnpartysubmit" onClick={handleSubmit} disabled={!canSubmit} >
                <Icon icon="mdi:content-save" className="me-1" /> Save
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={handleReset}
              >
                <Icon icon="mdi:refresh" className="me-1" /> Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div className="card basic-data-table" hidden={mainhidden}>
      <div className="card-header">
        <h5 className="card-title mb-0">Parties List</h5>
      </div>
      <div className="card-body">
        <table
          className="table bordered-table mb-0"
          id="party_table"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Parties Name</th>
              <th scope="col">Contact Person</th>
              <th scope="col">Phone No</th>
              <th scope="col">Type</th>
              <th scope="col">Net Balance</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Data Rows */}

            {/* Add more sample rows as needed */}
          </tbody>
        </table>
      </div>
     
    </div>
    </div>
  );
};

export default GoodPartyLists;