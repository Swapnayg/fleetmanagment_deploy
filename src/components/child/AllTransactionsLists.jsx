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

const AllTransactionsLists = () => {

  var date = new Date();
  const [taxPayable, settaxPayable] = useState(0);
  const [taxReceivable, settaxReceivable] = useState(0);
  const [totalNetProfit, settotalNetProfit] = useState(0);
  const [selType, setselType] = useState("all");
  const [startDate, setStartDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date(date.getFullYear(), date.getMonth() + 1, 0));

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

  const handleSelTypechange = (e) => {
    const st_Date = new Date(startDate);
    const en_Date = new Date(endDate);
    if ( $.fn.DataTable.isDataTable('#table_cashbook') ) {
      $('#table_cashbook').DataTable().destroy();
    }
    $('#table_cashbook tbody').empty();
    setselType(e.target.value.toString().trim());
    fetch("https://backend-55jj.onrender.com/cashbook_data_report",{ 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({ t_date_from: addDays(st_Date, 1), t_date_to: addDays(en_Date, 1),userid:localStorage.getItem('id')})
      }).then((res)  =>
      res.json().then((jsdata) => {
      if(e.target.value.toString().trim()  =="general" || e.target.value.toString().trim()  =="commission" || e.target.value.toString().trim()  =="party"|| e.target.value.toString().trim()  =="vehicle")
      {
        for (let i = 0; i < jsdata.cashbook_data.length; i++) {
          if(jsdata.cashbook_data[i].ledger_type.toString().trim() == e.target.value.toString().trim())
          {
            var data_obj = JSON.stringify(jsdata.cashbook_data[i], null, 2) ;
            let row = '<tr>';
            row += '<td>' + (i +1) + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_account_name+'>' + jsdata.cashbook_data[i].ledger_account_name + '</td>';
            row += '<td style="text-transform:capitalize">' + moment(jsdata.cashbook_data[i].ledger_gen_date).format("DD/MM/YYYY") + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_descp+'>' + jsdata.cashbook_data[i].ledger_descp + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_credit_amount+'>' + jsdata.cashbook_data[i].ledger_credit_amount + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_debit_amount+'>' + jsdata.cashbook_data[i].ledger_debit_amount + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_balance+'>' + jsdata.cashbook_data[i].ledger_balance + '</td>';
            row += '</tr>';
            $("#table_cashbook tbody").append(row);
          }
        }
      }
      else if(e.target.value.toString().trim() =="client" || e.target.value.toString().trim() =="supplier" ){
        for (let i = 0; i < jsdata.ledger2.length; i++) {
          if(jsdata.ledger2[i].ledger_type.toString().trim() == e.target.value.toString().trim() )
          {
            var data_obj = JSON.stringify(jsdata.ledger2[i], null, 2) ;
            let row = '<tr>';
            row += '<td>' + (i +1) + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_account_name+'>' + jsdata.ledger2[i].ledger_account_name + '</td>';
            row += '<td style="text-transform:capitalize">' + moment(jsdata.ledger2[i].ledger_gen_date).format("DD/MM/YYYY") + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_descp+'>' + jsdata.ledger2[i].ledger_descp + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_credit_amount+'>' + jsdata.ledger2[i].ledger_credit_amount + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_debit_amount+'>' + jsdata.ledger2[i].ledger_debit_amount + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_balance+'>' + jsdata.ledger2[i].ledger_balance + '</td>';
            row += '</tr>';
            $("#table_cashbook tbody").append(row);
          }
        }
      }
      else if(e.target.value.toString().trim() =="all")
      {
        for (let i = 0; i < jsdata.cashbook_data.length; i++) {
          var data_obj = JSON.stringify(jsdata.cashbook_data[i], null, 2) ;
          let row = '<tr>';
          row += '<td>' + (i +1) + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_account_name+'>' + jsdata.cashbook_data[i].ledger_account_name + '</td>';
          row += '<td style="text-transform:capitalize">' + moment(jsdata.cashbook_data[i].ledger_gen_date).format("DD/MM/YYYY") + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_descp+'>' + jsdata.cashbook_data[i].ledger_descp + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_credit_amount+'>' + jsdata.cashbook_data[i].ledger_credit_amount + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_debit_amount+'>' + jsdata.cashbook_data[i].ledger_debit_amount + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_balance+'>' + jsdata.cashbook_data[i].ledger_balance + '</td>';
          row += '</tr>';
          $("#table_cashbook tbody").append(row);
        }
        for (let i = 0; i < jsdata.ledger2.length; i++) {
          var data_obj = JSON.stringify(jsdata.ledger2[i], null, 2) ;
          let row = '<tr>';
          row += '<td>' + (i +1) + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_account_name+'>' + jsdata.ledger2[i].ledger_account_name + '</td>';
          row += '<td style="text-transform:capitalize">' + moment(jsdata.ledger2[i].ledger_gen_date).format("DD/MM/YYYY") + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_descp+'>' + jsdata.ledger2[i].ledger_descp + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_credit_amount+'>' + jsdata.ledger2[i].ledger_credit_amount + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_debit_amount+'>' + jsdata.ledger2[i].ledger_debit_amount + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_balance+'>' + jsdata.ledger2[i].ledger_balance + '</td>';
          row += '</tr>';
          $("#table_cashbook tbody").append(row);
        }
      }
      $("#table_cashbook").DataTable();
    }))
  };

  const handlePrint = (e) => {
    const st_Date = new Date(startDate);
    const en_Date = new Date(endDate);
    var cust_Name = "ALL TRANSACTIONS Report";
    var f_st_date = moment(startDate).format("D MMMM YYYY");
    var f_en_date = moment(endDate).format("D MMMM YYYY");
    fetch('https://backend-55jj.onrender.com/generateAllTransReport_pdf', { 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({startDate: addDays(st_Date, 1), endDate: addDays(en_Date, 1), f_st_date:f_st_date, f_en_date:f_en_date,cust_Name:cust_Name, party_type:selType,userid:localStorage.getItem('id')})
      })
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'All_Transactions_Report.pdf';
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
    const rows = document.querySelectorAll("#table_cashbook tr");
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
    a.setAttribute("download", "All_Transactions_Report.csv");
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

    if ( $.fn.DataTable.isDataTable('#table_cashbook') ) {
      $('#table_cashbook').DataTable().destroy();
    }
    $('#table_cashbook tbody').empty();
    fetch("https://backend-55jj.onrender.com/cashbook_data_report",{ 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({ t_date_from: addDays(st_Date, 1), t_date_to: addDays(en_Date, 1),userid:localStorage.getItem('id')})
      }).then((res)  =>
      res.json().then((jsdata) => {
      for (let i = 0; i < jsdata.cashbook_data.length; i++) {
          var data_obj = JSON.stringify(jsdata.cashbook_data[i], null, 2) ;
          let row = '<tr>';
          row += '<td>' + (i +1) + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_account_name+'>' + jsdata.cashbook_data[i].ledger_account_name + '</td>';
          row += '<td style="text-transform:capitalize">' + moment(jsdata.cashbook_data[i].ledger_gen_date).format("DD/MM/YYYY") + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_descp+'>' + jsdata.cashbook_data[i].ledger_descp + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_credit_amount+'>' + jsdata.cashbook_data[i].ledger_credit_amount + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_debit_amount+'>' + jsdata.cashbook_data[i].ledger_debit_amount + '</td>';
          row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_balance+'>' + jsdata.cashbook_data[i].ledger_balance + '</td>';
          row += '</tr>';
          $("#table_cashbook tbody").append(row);
        }
        for (let i = 0; i < jsdata.ledger2.length; i++) {
            var data_obj = JSON.stringify(jsdata.ledger2[i], null, 2) ;
            let row = '<tr>';
            row += '<td>' + (i +1) + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_account_name+'>' + jsdata.ledger2[i].ledger_account_name + '</td>';
            row += '<td style="text-transform:capitalize">' + moment(jsdata.ledger2[i].ledger_gen_date).format("DD/MM/YYYY") + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_descp+'>' + jsdata.ledger2[i].ledger_descp + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_credit_amount+'>' + jsdata.ledger2[i].ledger_credit_amount + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_debit_amount+'>' + jsdata.ledger2[i].ledger_debit_amount + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_balance+'>' + jsdata.ledger2[i].ledger_balance + '</td>';
            row += '</tr>';
            $("#table_cashbook tbody").append(row);
          }
        $("#table_cashbook").DataTable();
      }))
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
        fetch("https://backend-55jj.onrender.com/cashbook_data_report",{ 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({ t_date_from: addDays(st_Date, 1), t_date_to: addDays(en_Date, 1),userid:localStorage.getItem('id')})
          }).then((res)  =>
          res.json().then((jsdata) => {
          for (let i = 0; i < jsdata.cashbook_data.length; i++) {
              var data_obj = JSON.stringify(jsdata.cashbook_data[i], null, 2) ;
              let row = '<tr>';
              row += '<td>' + (i +1) + '</td>';
              row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_account_name+'>' + jsdata.cashbook_data[i].ledger_account_name + '</td>';
              row += '<td style="text-transform:capitalize">' + moment(jsdata.cashbook_data[i].ledger_gen_date).format("DD/MM/YYYY") + '</td>';
              row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_descp+'>' + jsdata.cashbook_data[i].ledger_descp + '</td>';
              row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_credit_amount+'>' + jsdata.cashbook_data[i].ledger_credit_amount + '</td>';
              row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_debit_amount+'>' + jsdata.cashbook_data[i].ledger_debit_amount + '</td>';
              row += '<td style="text-transform:capitalize" data-label='+jsdata.cashbook_data[i].ledger_balance+'>' + jsdata.cashbook_data[i].ledger_balance + '</td>';
              row += '</tr>';
              $("#table_cashbook tbody").append(row);
            }
            for (let i = 0; i < jsdata.ledger2.length; i++) {
                var data_obj = JSON.stringify(jsdata.ledger2[i], null, 2) ;
                let row = '<tr>';
                row += '<td>' + (i +1) + '</td>';
                row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_account_name+'>' + jsdata.ledger2[i].ledger_account_name + '</td>';
                row += '<td style="text-transform:capitalize">' + moment(jsdata.ledger2[i].ledger_gen_date).format("DD/MM/YYYY") + '</td>';
                row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_descp+'>' + jsdata.ledger2[i].ledger_descp + '</td>';
                row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_credit_amount+'>' + jsdata.ledger2[i].ledger_credit_amount + '</td>';
                row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_debit_amount+'>' + jsdata.ledger2[i].ledger_debit_amount + '</td>';
                row += '<td style="text-transform:capitalize" data-label='+jsdata.ledger2[i].ledger_balance+'>' + jsdata.ledger2[i].ledger_balance + '</td>';
                row += '</tr>';
                $("#table_cashbook tbody").append(row);
              }
            $("#table_cashbook").DataTable();
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
          <h5 className="card-title mb-0">Transactions Report</h5>
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
        <div className="profit_loss_side sidebar-menu-area mt-3">
        <table className="table border-primary-table mb-0" id="table_cashbook">
              <thead>
                <tr className="small">
                  <th className="py-2">SNO</th>
                  <th className="py-2">Account</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Description</th>
                  <th className="py-2">IN</th>
                  <th className="py-2">OUT</th>
                  <th className="py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                 
              </tbody>
              <tfoot>
        </tfoot>
            </table>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTransactionsLists;