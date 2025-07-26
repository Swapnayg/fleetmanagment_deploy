"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import $ from 'jquery'; 
import { Icon } from "@iconify/react/dist/iconify.js";
import { validate } from "uuid";
import moment from 'moment';
const loadJQueryAndDataTables = async () => {
  const $ = (await import("jquery")).default;
  await import("datatables.net-dt/js/dataTables.dataTables.js");
  return $;
};
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AllPartyReportList = () => {

  var date = new Date();
  const [taxPayable, settaxPayable] = useState(0);
  const [taxReceivable, settaxReceivable] = useState(0);
  const [totalNetProfit, settotalNetProfit] = useState(0);
  const [totalReceivable, settotalReceivable] = useState(0);
  const [totalPayable, settotalPayable] = useState(0);

  const handleSelTypechange = (e) => {
    if ( $.fn.DataTable.isDataTable('#table_all_party') ) {
      $('#table_all_party').DataTable().destroy();
    }
    $('#table_all_party tbody').empty();
    fetch("https://backend-55jj.onrender.com/get_all_party_report_data", { 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({userid:localStorage.getItem('id')})
      }).then((res)  =>
      res.json().then((jsdata) => {
        if(e.target.value.toString().trim() =="all")
        {
          let total_receivable = 0;
          let total_payable = 0;
          for (let i = 0; i < jsdata.length; i++) {
            let row = '<tr>';
            row += '<td>' + (i +1) + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].name + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].email + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].phone + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].creditAmt+ '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].debitAmt.toString().trim().replace("-","") + '</td>';
            row += '</tr>';
            total_receivable +=  parseFloat(jsdata[i].creditAmt);
            total_payable +=  parseFloat(jsdata[i].debitAmt.toString().trim().replace("-",""));
            $("#table_all_party tbody").append(row);
          }
          $("#table_all_party").DataTable();
          settotalReceivable("Rs. " + total_receivable);
          settotalPayable("Rs. " + total_payable);
        }
        else
        {
          let total_receivable = 0;
          let total_payable = 0;
          for (let i = 0; i < jsdata.length; i++) {
            if(jsdata[i].acc_type.toString().trim() == e.target.value.toString().trim() )
            {
              let row = '<tr>';
              row += '<td>' + (i +1) + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].name + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].email + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].phone + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].creditAmt+ '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].debitAmt + '</td>';
              row += '</tr>';
              total_receivable +=  parseFloat(jsdata[i].creditAmt);
              total_payable +=  parseFloat(jsdata[i].debitAmt.toString().trim().replace("-",""));
              $("#table_all_party tbody").append(row);
            }
          }
          $("#table_all_party").DataTable();
          settotalReceivable("Rs. " + total_receivable);
          settotalPayable("Rs. " + total_payable);
        }
    }))
  }
   const handlePrint = (e) => {
     var cust_Name = "All Party Report";
     fetch('https://backend-55jj.onrender.com/generateAllPartyReport_pdf', { 
       method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({userid:localStorage.getItem('id')})
          })
     .then(resp => resp.blob())
     .then(blob => {
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.style.display = 'none';
       a.href = url;
       a.download = 'All_Party_Report.pdf';
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
    const rows = document.querySelectorAll("#party_div table tr");
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
    data += tableData.join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
    a.setAttribute("download", "All_Party_Report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(()=>{
    var username = localStorage.getItem('username');
    if (username) {
        let table;
        loadJQueryAndDataTables()
        .then(($) => {
           window.$ = window.jQuery = $;
          fetch("https://backend-55jj.onrender.com/get_all_party_report_data", { 
            method: 'POST', 
            headers: {   'Accept': 'application/json',
              'Content-Type': 'application/json'  }, 
              body: JSON.stringify({userid:localStorage.getItem('id')})
            }).then((res)  =>
            res.json().then((jsdata) => {
              let total_receivable = 0;
              let total_payable = 0;
            for (let i = 0; i < jsdata.length; i++) {
              let row = '<tr>';
              row += '<td>' + (i +1) + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].name + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].email + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].phone + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].creditAmt+ '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].debitAmt.toString().trim().replace("-","") + '</td>';
              row += '</tr>';
              total_receivable +=  parseFloat(jsdata[i].creditAmt);
              total_payable +=  parseFloat(jsdata[i].debitAmt.toString().trim().replace("-",""));
              $("#table_all_party tbody").append(row);
            }
            $("#table_all_party").DataTable();
            settotalReceivable("Rs. " + total_receivable);
            settotalPayable("Rs. " + total_payable);
            }));
        })
        .catch((error) => {
          console.error("Error loading jQuery or DataTables:", error);
        });

      return () => {
        if (table) table.destroy(true);
      };
    }
    else
    {
      window.location.href = '/login';
    }   
},[]);

  
  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">All Party Report</h5>
        </div>
        <div className="card-body">
           <table className="table table-nowrap align-middle table-hover table-centered mb-0">
            <thead className="table-light">
              <tr>
                <td></td>
                <td>
                </td>
                <td></td>
                <td>      
                </td>
                <td>Select For:</td>
                <td>      
                <select id="customSelect" onChange={handleSelTypechange} className="form-control">
                  <option value="all">All</option>
                  <option value="general">General</option>
                  <option value="commission">Commission</option>
                  <option value="party">Party</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="client">Client</option>
                  <option value="supplier">Supplier</option>
                </select>
                </td>
                <td style={{textAlign:"right"}}>
                <button className="btn btn-outline-secondary btn-sm me-2" onClick={handlePrint}>
                <Icon icon="mdi:printer" className="me-1" /> Print
              </button>
                <button className="btn btn-outline-primary btn-sm" onClick={handleExport}>
                <Icon icon="mdi:download" className="me-1" /> Export
              </button>
                </td>
              </tr>
            </thead>
          </table>
        <div className="profit_loss_side sidebar-menu-area" id="party_div">
        <table
          className="table bordered-table mb-0"
          id="table_all_party"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone No.</th>
              <th scope="col">Receivable Balance</th>
              <th scope="col">Payable Balance</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Data Rows */}

            {/* Add more sample rows as needed */}
          </tbody>
        </table>
        <table className="table table-nowrap align-middle table-hover table-centered mb-0 mt-5" style={{tableLayout:"fixed", textAlign:"right"}}>
            <thead className="table-light">
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>Total :</td>
                <td>{totalReceivable}</td>
                <td>{totalPayable}</td>
                <td></td>
              </tr>
            </thead>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPartyReportList;