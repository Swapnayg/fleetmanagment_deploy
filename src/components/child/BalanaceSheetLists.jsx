"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import $ from 'jquery'; 
import { Icon } from "@iconify/react/dist/iconify.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BalanaceSheetLists = () => {

  var date = new Date();
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

  const handlePrint = (e) => {
    var cust_Name = "Balance Sheet Report";
    var f_st_date = moment(startDate).format("D MMMM YYYY");
    var f_en_date = moment(endDate).format("D MMMM YYYY");
    fetch('https://backend-55jj.onrender.com/generateBalanceSheet_pdf', { 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({ userid:localStorage.getItem('id'),startDate: startDate, endDate: endDate, f_st_date:f_st_date, f_en_date:f_en_date,cust_Name:cust_Name})
      })
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Balance_Sheet_Report.pdf';
      document.body.appendChild(a);
      a.click();
    })
    .catch(() => 
    console.log("error"));
  };

  const handleExport = (e) => {
    e.preventDefault();  
    var cust_Name = "Balance Sheet Report";
    var f_st_date = moment(startDate).format("D MMMM YYYY");
    var f_en_date = moment(endDate).format("D MMMM YYYY");
    fetch('https://backend-55jj.onrender.com/generateBalanceSheet_Excel', { 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({ userid:localStorage.getItem('id'),startDate: startDate, endDate: endDate, f_st_date:f_st_date, f_en_date:f_en_date,cust_Name:cust_Name})
      })
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Balance_Sheet_Report.xlsx';
      document.body.appendChild(a);
      a.click();
    })
    .catch(() => 
    console.log("error"));
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
    fetch("https://backend-55jj.onrender.com/get_profit_loss_details", { 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({ userid:localStorage.getItem('id'),t_date_from: addDays(st_Date, 1), t_date_to: addDays(en_Date, 1)})
      }).then((res)  =>
      res.json().then((jsprovdata) => {
        var html = "";
        for (let i = 0; i < jsprovdata.acct_data.length; i++) {
          var netprofit = 0;
          if(jsprovdata.acct_data[i].type_name.toString().trim() == "Assets" || jsprovdata.acct_data[i].type_name.toString().trim() == "Equities & Liabilities") {
            html += `<li class="sidebar-menu-group-title mt-3" data-label="`+jsprovdata.acct_data[i].id+`">`+jsprovdata.acct_data[i].type_name+`</li>`;
            for (let j = 0; j < jsprovdata.sub_acct.length; j++) {
              if(jsprovdata.acct_data[i].id == jsprovdata.sub_acct[j].type_name_id) {
                netprofit += parseInt(jsprovdata.sub_acct[j].sub_networth.toString().trim());
                
                html += `<li class="link_drop dropdown" >
                <a><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--solar menu-icon" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19 9l-7 6l-7-6"></path></svg>
                <span style="width:80% !important;" data-label="`+jsprovdata.sub_acct[i].id+`">`+jsprovdata.sub_acct[j].sub_type_name+`</span><span style="width:16%;text-align:right;">Rs. `+parseFloat(jsprovdata.sub_acct[j].sub_networth.toString().trim().replace("-","")).toFixed(2) +`</span></a>
                <ul class="sidebar-submenu" style="max-height: 0px;">`;   
                    for (let k = 0; k < jsprovdata.coa_data.length; k++) {
                      if(jsprovdata.sub_acct[j].id == jsprovdata.coa_data[k].ledger_account_no) { 
                        html += `
                          <li class="mt-2 mb-2"><i class="ri-circle-fill circle-icon text-primary-600 w-auto"></i><span style="width:80% !important;text-transform:capitalize;"  `+jsprovdata.coa_data[k].id+`>`+jsprovdata.coa_data[k].ledger_account_name+`</span><span style="float:right;margin-right:3%;font-size: 14px;">Rs. `+parseFloat(jsprovdata.coa_data[k].ledger_balance_amount.toString().trim().replace("-","")).toFixed(2)+`</span></li>
                       `;
                      }
                    
                    }
                html += ` </ul></li>`;
              }
            }
            html += `<li className="sidebar-menu-group-title mt-3">
            <i className="text-primary-600 w-auto" />
                <span className="pl_span_txt" style="font-size:18px; font-weight:bold;width:80% !important;">Total `+jsprovdata.acct_data[i].type_name.toString().trim()+`</span>
                <span style="float:right;margin-right:3%;font-size: 16px;">Rs. `+parseFloat(netprofit).toFixed(2)+`</span>
            </li>`;
          }
       } 
      $("#profit-loss-menu").append(html);    
    }));
  }

  useEffect(()=>{
    var username = localStorage.getItem('username');
    if (username) {
      $(document).off('click', '.link_drop').on("click", '.link_drop', function(e){
        $(this).toggleClass("open");
        if ($(this).hasClass("open")) {
          var height = $(this).find('.sidebar-submenu li').length * 40;
          $(this).find('.sidebar-submenu').css("max-height",height + "px");
        }
        else
        {
          $(this).find('.sidebar-submenu').css("max-height","0px"); 
        }
      });
      refreshtable(startDate,endDate);
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
          <h5 className="card-title mb-0">Profit And Loss Report</h5>
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
        <div className="profit_loss_side sidebar-menu-area">
          <ul className="sidebar-menu" id="profit-loss-menu">
          </ul>  
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanaceSheetLists;