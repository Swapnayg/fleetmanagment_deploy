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

const StockDetailsList = () => {

  var date = new Date();
  const [taxPayable, settaxPayable] = useState(0);
  const [taxReceivable, settaxReceivable] = useState(0);
  const [totalNetProfit, settotalNetProfit] = useState(0);
  const [startDate, setStartDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date(date.getFullYear(), date.getMonth() + 1, 0));

  const [BigQty, setBigQty] = useState(0);
  const [QtyIn, setQtyIn] = useState(0);
  const [PurAmt, setPurAmt] = useState(0);
  const [QtyOut, setQtyOut] = useState(0);
  const [SaleAmt, setSaleAmt] = useState(0);
  const [ClsQty, setClsQty] = useState(0);

  function handleStDateChange(date)
  {
    setStartDate(date);
    refreshtable(date,endDate);
  }

  function handleEndDateChange(date)
  {
    setEndDate(date);
    refreshtable(startDate,date);
  }

  const handlePrint = (e) => {
    const st_Date = new Date(startDate);
    const en_Date = new Date(endDate);
    var cust_Name = "Stock Details Report";
    var f_st_date = moment(startDate).format("D MMMM YYYY");
    var f_en_date = moment(endDate).format("D MMMM YYYY");
    fetch('https://backend-55jj.onrender.com/generateStkDetailsReport_pdf', { 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({userid:localStorage.getItem('id'), startDate: addDays(st_Date, 1), endDate: addDays(en_Date, 1), f_st_date:f_st_date, f_en_date:f_en_date,cust_Name:cust_Name})
      })
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Stock_Details_Report.pdf';
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
    const rows = document.querySelectorAll("#stk_dtls_div table tr");
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
    a.setAttribute("download", "Stock_Details_Report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  function addDays(date, days) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() + days);
    return dateCopy;
  }  

  function refreshtable(st_date,en_date)
  {
    const st_Date = new Date(st_date);
    const en_Date = new Date(en_date);

    if ( $.fn.DataTable.isDataTable('#tbl_sale_rpt') ) {
      $('#tbl_sale_rpt').DataTable().destroy();
    }
    $('#tbl_sale_rpt tbody').empty();
    fetch("https://backend-55jj.onrender.com/get_stk_details_data", { 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({userid:localStorage.getItem('id'), t_date_from: addDays(st_Date, 1), t_date_to: addDays(en_Date, 1)})
      }).then((res)  =>
      res.json().then((jsdata) => {
        var big_qty= 0;
        var qty_in= 0;
        var pur_amt= 0;
        var qty_out= 0;
        var sale_amt= 0;
        var cls_qty= 0;
           for (let i = 0; i < jsdata.length; i++) {
            let row = '<tr>';
            row += '<td>' + (i +1) + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].prd_Name + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].in_qty + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].pur_Amt + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].out_qty + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].sale_Amt + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].cls_qty + '</td>';
            row += '</tr>';
            $("#tbl_sale_rpt tbody").append(row);
            qty_in += parseInt(jsdata[i].in_qty);
            pur_amt += parseFloat(jsdata[i].pur_Amt);
            qty_out += parseInt(jsdata[i].out_qty);
            sale_amt += parseFloat(jsdata[i].sale_Amt);
            cls_qty += parseInt(jsdata[i].cls_qty);
           }
           $("#tbl_sale_rpt").DataTable();
           setBigQty(big_qty);
           setQtyIn(qty_in);
           setPurAmt("Rs. " + pur_amt);
           setQtyOut(qty_out);
           setSaleAmt("Rs. " + sale_amt);
           setClsQty(cls_qty);
    }));
  }

  useEffect(()=>{
    var username = localStorage.getItem('username');
    if (username) {
        let table;
        loadJQueryAndDataTables()
        .then(($) => {
           window.$ = window.jQuery = $;
          const st_Date = new Date(startDate);
          const en_Date = new Date(endDate);
          fetch("https://backend-55jj.onrender.com/get_stk_details_data", { 
            method: 'POST', 
            headers: {   'Accept': 'application/json',
              'Content-Type': 'application/json'  }, 
              body: JSON.stringify({ userid:localStorage.getItem('id'), t_date_from: addDays(st_Date, 1), t_date_to: addDays(en_Date, 1)})
            }).then((res)  =>
            res.json().then((jsdata) => {
              var big_qty= 0;
              var qty_in= 0;
              var pur_amt= 0;
              var qty_out= 0;
              var sale_amt= 0;
              var cls_qty= 0;
            for (let i = 0; i < jsdata.length; i++) {
              let row = '<tr>';
              row += '<td>' + (i +1) + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].prd_Name + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].in_qty + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].pur_Amt + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].out_qty + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].sale_Amt + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].cls_qty + '</td>';
              row += '</tr>';
              $("#tbl_sale_rpt tbody").append(row);
              qty_in += parseInt(jsdata[i].in_qty);
              pur_amt += parseFloat(jsdata[i].pur_Amt);
              qty_out += parseInt(jsdata[i].out_qty);
              sale_amt += parseFloat(jsdata[i].sale_Amt);
              cls_qty += parseInt(jsdata[i].cls_qty);
            }
            $("#tbl_sale_rpt").DataTable();
            setQtyIn(qty_in);
            setPurAmt("Rs. " + pur_amt);
            setQtyOut(qty_out);
            setSaleAmt("Rs. " + sale_amt);
            setClsQty(cls_qty);
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
          <h5 className="card-title mb-0">Stock Details Report</h5>
        </div>
        <div className="card-body">
           <table className="table table-nowrap align-middle table-hover table-centered mb-0">
            <thead className="table-light">
              <tr>
                <td>From :</td>
                <td>
                  <DatePicker selected={startDate} onChange={handleStDateChange} placeholderText="Start Date"/>
                </td>
                  <td>To :</td>
                    <td>      
                    <DatePicker selected={endDate} onChange={handleEndDateChange} placeholderText="End Date"/>
                </td>
                <td> 
                
                </td>
                <th style={{textAlign:"right"}}>
                <button className="btn btn-outline-secondary btn-sm me-2" onClick={handlePrint}>
                <Icon icon="mdi:printer" className="me-1" /> Print
              </button>
                <button className="btn btn-outline-primary btn-sm" onClick={handleExport}>
                <Icon icon="mdi:download" className="me-1" /> Export
              </button>
                </th>
              </tr>
            </thead>
          </table>
        <div className="profit_loss_side sidebar-menu-area" id="stk_dtls_div">
        <table
          className="table bordered-table mb-0"
          id="tbl_sale_rpt"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Item Name</th>
              <th scope="col">Qty In</th>
              <th scope="col">Purchase Amount</th>
              <th scope="col">Qty Out</th>
              <th scope="col">Sale Amount</th>
              <th scope="col">Closing Qty</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Data Rows */}

            {/* Add more sample rows as needed */}
          </tbody>
        </table>
        <table className="table table-nowrap align-middle table-hover table-centered mb-0 mt-5" style={{tableLayout:"fixed"}}>
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
              </tr>
              <tr>
                <td></td>
                <td>Total: </td>
                <td>{QtyIn}</td>
                <td>{PurAmt}</td>
                <td>{QtyOut}</td>
                <td>{SaleAmt}</td>
                <td>{ClsQty}</td>
              </tr>
            </thead>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailsList;