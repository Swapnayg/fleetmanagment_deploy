"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import $ from 'jquery'; 
import { Icon } from "@iconify/react/dist/iconify.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ManageTrailBalanceList = () => {

  var date = new Date();
  const [totalDebit, settotalDebit] = useState(0);
  const [totalCredit, settotalCredit] = useState(0);
  const [firstRow, setfirstRow] = useState(true);
  const [secondRow, setsecondRow] = useState(false);
  const [startDate, setStartDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date(date.getFullYear(), date.getMonth() + 1, 0));
  const [isChecked, setIsChecked] = useState(false);


  const handlePrint = (e) => {
    var cust_Name = "Trial Balance Report";
    var f_st_date = moment(startDate).format("D MMMM YYYY");
    var f_en_date = moment(endDate).format("D MMMM YYYY");
    fetch('https://backend-55jj.onrender.com/generateTrial_Bal_pdf', { 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({ userid:localStorage.getItem('id'), startDate: startDate, endDate: endDate, f_st_date:f_st_date, f_en_date:f_en_date,cust_Name:cust_Name})
      })
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Trial_Balance_Report.pdf';
      document.body.appendChild(a);
      a.click();
    })
    .catch(() => 
    console.log("error"));
  };

  const handleExport = (e) => {
    e.preventDefault();  
    var cust_Name =  "Trial Balance Report";
    var f_st_date = moment(startDate).format("D MMMM YYYY");
    var f_en_date = moment(endDate).format("D MMMM YYYY");
    fetch('https://backend-55jj.onrender.com/generatTrial_Balance_Excel', { 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({ userid:localStorage.getItem('id'), startDate: startDate, endDate: endDate, f_st_date:f_st_date, f_en_date:f_en_date,cust_Name:cust_Name})
      })
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Trial_Balance_Report.xlsx';
      document.body.appendChild(a);
      a.click();
    })
    .catch(() => 
    console.log("error"));
  };

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
    if(event.target.checked) {
      setfirstRow(false);
      setsecondRow(true);
      $("#profit-loss-menu").find(".opening_bal").css("display","block");
      $("#profit-loss-menu").find(".closing_bal").css("display","block");
      $("#profit-loss-menu").find(".credit_bal").css("width","20%");
      $("#profit-loss-menu").find(".debit_bal").css("width","20%");
    } else {
      setfirstRow(true);
      setsecondRow(false);
      $("#profit-loss-menu").find(".opening_bal").css("display","none");
      $("#profit-loss-menu").find(".closing_bal").css("display","none");
      $("#profit-loss-menu").find(".credit_bal").css("width","25%");
      $("#profit-loss-menu").find(".debit_bal").css("width","50%");
    }
  };


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

  function addDays(date, days) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() + days);
    return dateCopy;
  }  
  function refreshtable(st_date,en_date)
  {
    setIsChecked(false);
    const st_Date = new Date(st_date);
    const en_Date = new Date(en_date);
    $("#profit-loss-menu").empty();
    fetch('https://backend-55jj.onrender.com/get_trial_bal_details', { 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({ userid:localStorage.getItem('id'), t_date_from: addDays(st_Date, 1), t_date_to: addDays(en_Date, 1)})
      }).then((res) =>
          res.json().then((jsprovdata) => {
            var html = "";
            var netdebitval = 0;
            var netcreditval = 0;
            for (let i = 0; i < jsprovdata.acct_data.length; i++) {
              html += `<li class="sidebar-menu-group-title" data-label="`+jsprovdata.acct_data[i].id+`">`+jsprovdata.acct_data[i].type_name+`</li>`;
                for (let j = 0; j < jsprovdata.sub_acct.length; j++) {
                  if(jsprovdata.acct_data[i].id == jsprovdata.sub_acct[j].type_name_id) {
                    netdebitval = netdebitval + parseFloat(jsprovdata.sub_acct[j].sub_debit_val.toString().trim());
                    netcreditval = netcreditval + parseFloat(jsprovdata.sub_acct[j].sub_credit_val.toString().trim());
                    html += `<li class="link_drop dropdown" >
                    <a><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--solar menu-icon" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19 9l-7 6l-7-6"></path></svg>
                    <span style="width:20% !important;" data-label="`+jsprovdata.sub_acct[i].id+`">`+jsprovdata.sub_acct[j].sub_type_name+`</span><span class="opening_bal" style="width:20%;text-align:right;display:none;">Rs. 0.00 </span><span class="debit_bal" style="width:50%;text-align:right;">Rs. `+parseFloat(jsprovdata.sub_acct[j].sub_debit_val.toString().trim().replace("-","")).toFixed(2) +`</span><span  class="credit_bal" style="width:25%;text-align:right;">Rs. `+parseFloat(jsprovdata.sub_acct[j].sub_credit_val.toString().trim().replace("-","")).toFixed(2) +`</span><span class="closing_bal" style="width:20%;text-align:right;display:none;">Rs. `+parseFloat(jsprovdata.sub_acct[j].sub_balance_val.toString().trim().replace("-","")).toFixed(2) +`</span></a>
                    <ul class="sidebar-submenu" style="max-height: 0px;">`;  
                    for (let k = 0; k < jsprovdata.ledger_data.length; k++) {
                      if(parseInt(jsprovdata.sub_acct[j].id) == parseInt(jsprovdata.ledger_data[k].subid)) {
                          html += `
                          <li class="mt-2 mb-2" style="display:flex;"><i class="ri-circle-fill circle-icon text-primary-600 w-auto"></i><span style="width:20% !important;text-transform:capitalize;"  `+jsprovdata.ledger_data[k].id+`>`+jsprovdata.ledger_data[k].ledger_account_no+`</span><span class="opening_bal" style="width:18%;text-align:right;display:none;">Rs. 0.00 </span><span  class="debit_bal" style="width:50%;text-align:right;">Rs. `+parseFloat(jsprovdata.ledger_data[k].ledger_debit_amount.toString().trim().replace("-","")).toFixed(2) +`</span><span class="credit_bal" style="width:25%;text-align:right;">Rs. `+parseFloat(jsprovdata.ledger_data[k].ledger_credit_amount.toString().trim().replace("-","")).toFixed(2) +`</span><span class="closing_bal" style="width:20%;text-align:right;display:none;">Rs. `+parseFloat(jsprovdata.ledger_data[k].ledger_balance_amount.toString().trim().replace("-","")).toFixed(2) +`</span></li>`;
                    }
                  }
                    html += ` </ul></li>`;
                  }
                }
           }
           settotalDebit("Rs. " + parseFloat(netdebitval).toFixed(2));
           settotalCredit("Rs. " + parseFloat(netcreditval).toFixed(2));
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
          <h5 className="card-title mb-0">Trial Balance Report</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive table-card">
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

                  <div className='d-flex align-items-center gap-10'>
                    <div className='form-check style-check d-flex align-items-center'>
                      <input
                        className='form-check-input radius-4 border input-form-dark' type='checkbox'
                        name='checkbox' id='selectAll' checked={isChecked} onChange={handleChange}
                      />
                    </div>
                    Show Working Trial Balance
                  </div>
                      
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
            <table className="table table-nowrap align-middle table-hover table-centered mb-0 mt-3" id="datatable" style={{width:"100%"}}>
              <thead className="table-light">
                <tr hidden={firstRow}>
                  <th>Account Name</th>
                  <th style={{textAlign:"right"}}>Opening Balance</th>
                  <th colSpan={2} className="firRow" >Transactions In The Period</th>
                  <th style={{textAlign:"right"}}>Closing Balance</th>
                </tr>
                <tr hidden={secondRow}>
                  <th>Account Name</th>
                  <th></th>
                  <th colSpan={2} className="secRow">Closing Balance</th>
                  <th></th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th style={{textAlign:"right"}}>Total Receivable</th>
                  <th style={{textAlign:"right"}}>Total Payable</th>
                  <th></th>
                </tr>
              </thead>
            </table>
            <div className="profit_loss_side sidebar-menu-area">
              <ul className="sidebar-menu" id="profit-loss-menu">
              </ul>
            </div>
            <table className="table table-nowrap align-middle table-hover table-centered mb-0" id="table_footer">
              <thead className="table-light">
                <tr>
                  <th>Total</th>
                  <th></th>
                  <th style={{textAlign:"right"}}>{totalDebit}</th>
                  <th style={{textAlign:"right"}}>{totalCredit}</th>
                  <th style={{textAlign:"right"}}></th>
                </tr>
              </thead>
            </table>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default ManageTrailBalanceList;