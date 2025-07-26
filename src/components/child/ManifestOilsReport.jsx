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

const ManifestOilsReport = () => {

    const [frightAmt, setfrightAmt] = useState(0);
    const [commAmt, setcommAmt] = useState(0);
    const [veh_Fr_Amt, setveh_Fr_Amt] = useState(0);
    const [veh_Ad_Amt, setveh_Ad_Amt] = useState(0);

   const handlePrint = (e) => {
     var cust_Name = "Manifest Oils Report";
     fetch('https://backend-55jj.onrender.com/generateManifestReport_pdf', { 
       method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({"repType":"oil", userid:localStorage.getItem('id')})
          })
     .then(resp => resp.blob())
     .then(blob => {
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.style.display = 'none';
       a.href = url;
       a.download = 'Manifest_Oils_Report.pdf';
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
    const rows = document.querySelectorAll("#manifest_oils table tr");
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
    a.setAttribute("download", "Manifest_Oils_Report.csv");
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
          fetch('https://backend-55jj.onrender.com/mainifest_oils_data'+'/'+localStorage.getItem('id')).then((res) =>
            res.json().then((jsdata) => {
              let freight_amt = 0;
              let comm_amt = 0;
              let veh_fright_amt = 0;
              let veh_adv_amt = 0;
            for (let i = 0; i < jsdata.length; i++) {
              let row = '<tr>';
              var data_obj = JSON.stringify(jsdata[i], null, 2);
              row += '<td style="text-transform:capitalize">' + jsdata[i].bilty_no + '</td>';
              row += '<td style="text-transform:capitalize">' + moment(jsdata[i].b_date).format("DD/MM/YYYY") + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].oil_vehicle_name + '</td>';
              row += '<td style="text-transform:capitalize" data-type='+jsdata[i].oil_party_name+'>' +  jsdata[i].oil_party_name+ '</td>';
              row += '<td>' + jsdata[i].quantity + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].per_ton + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].oils_gst + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].freight + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].wrt_4_per_freight + '</td>';
              row += '<td>' + jsdata[i].commission + '</td>';
              row += '<td data-type='+jsdata[i].vehicle_freight+'>' + jsdata[i].vehicle_freight + '</td>';
              row += '<td data-type='+jsdata[i].advance_to_vehicle+'>' + jsdata[i].advance_to_vehicle + '</td>';
              if(jsdata[i].bill_status.toString().trim() == "posted")
              {
                row += '<td style="text-transform:capitalize;font-size: 8px !important;"><span class="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm status_font">Posted</span></td>';
              }
              else if(jsdata[i].bill_status.toString().trim() == "paid")
              {
                row += '<td style="text-transform:capitalize;font-size: 8px !important;"><span class="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm status_font">Paid</span></td>';
              }
              else if(jsdata[i].bill_status.toString().trim() == "pending" || jsdata[i].bill_status.toString().trim() == "partial")
              {
                row += '<td style="text-transform:capitalize;font-size: 8px !important;"><span class="bg-danger-focus text-danger-main px-24 py-4 rounded-pill fw-medium text-sm status_font">'+jsdata[i].bill_status.toString().trim()+'</span></td>';
              }
              row += '</tr>';
              $("#mani_oils_table tbody").append(row);
              freight_amt += parseFloat(jsdata[i].freight);
              comm_amt += parseFloat(jsdata[i].commission);
              veh_fright_amt += parseFloat(jsdata[i].vehicle_freight);
              veh_adv_amt += parseFloat(jsdata[i].advance_to_vehicle);
              }
              $("#mani_oils_table").DataTable(
              {
                bAutoWidth: false, 
                aoColumns : [
                { sWidth: '80px' },
                { sWidth: '100px' },
                { sWidth: '80px' },
                { sWidth: '80px' },
                { sWidth: '80px' },
                { sWidth: '80px' },
                { sWidth: '80px' },
                { sWidth: '80px' },
                { sWidth: '80px' },
                { sWidth: '80px' },
                { sWidth: '80px' },
                { sWidth: '80px' },
                { sWidth: '80px' },
              ],            
            }
          );
          setfrightAmt("Rs. " + freight_amt);
          setcommAmt("Rs. " + comm_amt);
          setveh_Fr_Amt("Rs. " + veh_fright_amt);
          setveh_Ad_Amt("Rs. " + veh_adv_amt);
        }))  
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
          <h5 className="card-title mb-0">Manifest Oil Report</h5>
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
                <td></td>
                <td>      
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
        <div className="profit_loss_side sidebar-menu-area mt-3" id="manifest_oils">
        <table
          className="table bordered-table mb-0"
          id="mani_oils_table"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope="col" >BillNo</th>
              <th scope="col">Date</th>
              <th scope="col" >Vehicle</th>
              <th scope="col">Party</th>
              <th scope="col">Weight(kg)</th>
              <th scope="col">Per/Ton</th>
              <th scope="col">Gst(%)</th>
              <th scope="col">Freight(Rs)</th>
              <th scope="col">4% Freight (Rs)</th>
              <th scope="col">Commisson (Rs)</th>
              <th scope="col">Vehicle F(Rs)</th>
              <th scope="col">Vehicle A(Rs)</th>
              <th scope="col">Status</th>
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
                <td></td>
                <td></td>
                <td></td>
                <td>Total: </td>
                <td>{frightAmt}</td>
                <td></td>
                <td>{commAmt}</td>
                <td>{veh_Fr_Amt}</td>
                <td>{veh_Ad_Amt}</td>
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

export default ManifestOilsReport;