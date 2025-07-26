"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
const loadJQueryAndDataTables = async () => {
  const $ = (await import("jquery")).default;
  await import("datatables.net-dt/js/dataTables.dataTables.js");
  return $;
};
import $ from 'jquery'; 
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const CashBookDataTable = () => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [cashbookDate, setcashbookDate] = useState(new Date());
    const [acc_Type, setacc_Type] = useState("");
    const [acc_Method, setacc_Method] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [bill_no, setbill_no] = useState("");
    const [bill_text, setbill_text] = useState("");
    const [inputValue, setInputValue] = useState('');
    const [hidden, setHidden] = useState(true);
    const [cashId, setId] = useState(0);
    const [trrow, setrowIndex] = useState(0);
    const [rowType, setrowType] = useState("");

    const handleInputChange = (newValue) => {
      const inputValue = newValue.replace(/\W/g, '');
      setInputValue(inputValue);
      return inputValue;
    };
    const handleDatechange = (e) => {
      refreshtable((e.target.value));
    };


    const handleBillChange = (e) => {
      setbill_no(e.target.value);
      var index = e.nativeEvent.target.selectedIndex;
      setbill_text(e.nativeEvent.target[index].text.toString().trim());
    };
    const handleSelTypechange = (e) => {
      handleReset();
      if ( $.fn.DataTable.isDataTable('#table_cashbook') ) {
        $('#table_cashbook').DataTable().destroy();
      }
      $('#table_cashbook tbody').empty();
      fetch('https://backend-55jj.onrender.com/cashbook_data'+'/'+localStorage.getItem('id')).then((res) =>
        res.json().then((jsdata) => {
          if(e.target.value.toString().trim()  =="general" || e.target.value.toString().trim()  =="commission" || e.target.value.toString().trim()  =="party"|| e.target.value.toString().trim()  =="vehicle")
          {
            for (let i = 0; i < jsdata.cashbook_data.length; i++) {
              if(jsdata.cashbook_data[i].pay_start.toString().trim() != "started")
              {
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
                    row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="cash_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.cashbook_data[i].id+'  data-type="ledger"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="cash_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.cashbook_data[i].id+'  data-type="ledger"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
                    row += '</tr>';
                    $("#table_cashbook tbody").append(row);
                }
              }
           }
          }
          else if(e.target.value.toString().trim() =="client" || e.target.value.toString().trim() =="supplier" ){
            for (let i = 0; i < jsdata.ledger2.length; i++) {
              if(jsdata.ledger2[i].pay_start.toString().trim() != "started")
              {
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
                  row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="cash_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.ledger2[i].id+'  data-type="ledger2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="cash_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.ledger2[i].id+'  data-type="ledger2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
                  row += '</tr>';
                  $("#table_cashbook tbody").append(row);
              }
            }
           }
          }
          else if(e.target.value.toString().trim() =="all")
          {
            for (let i = 0; i < jsdata.cashbook_data.length; i++) {
              if(jsdata.cashbook_data[i].pay_start.toString().trim() != "started")
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
                row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="cash_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.cashbook_data[i].id+'  data-type="ledger"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="cash_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.cashbook_data[i].id+'  data-type="ledger"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
                row += '</tr>';
                $("#table_cashbook tbody").append(row);
              }
           }
          for (let i = 0; i < jsdata.ledger2.length; i++) {
            if(jsdata.ledger2[i].pay_start.toString().trim() != "started")
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
              row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="cash_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.ledger2[i].id+'  data-type="ledger2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="cash_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.ledger2[i].id+'  data-type="ledger2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
              row += '</tr>';
              $("#table_cashbook tbody").append(row);
            }
          }
        }
          $("#table_cashbook").DataTable();
      }))
    };
    
    const handleChange = (option) => {
      setSelectedOption(option);
      var sel_value = option.value.toString().trim().split("_Type_");
      var sel_id = sel_value[0];
      var sel_val = sel_value[1];
      if(sel_val != "general")
      {
        setHidden(false);
        $("#bill_number").empty();
        $("#bill_number").append("<option value=''>Select Bill</option>");
        fetch("https://backend-55jj.onrender.com/COA_data_bill", {
          method: 'POST', 
          headers:{   'Accept': 'application/json',
                    'Content-Type': 'application/json'  }, 
          body: JSON.stringify({ userid:localStorage.getItem('id'), id : sel_id, type :sel_val, name:option.label.toString().trim()} )
        }).then((res) =>
          res.json().then((jsprovdata) => {
            for (let i = 0; i < jsprovdata.length; i++) {
              $("#bill_number").append("<option style='text-transform:capitalize' value=\"" + jsprovdata[i].id  + "\">" + jsprovdata[i].bill_num + "</option>");     
          }
        }));
      }
      else
      {
        setHidden(true);
      }
    };

    
    const loadOptions = (inputValue) =>{
      return fetch("https://backend-55jj.onrender.com/COA_data_select",{
        method: 'POST', 
        headers:{   'Accept': 'application/json',
                  'Content-Type': 'application/json'  }, 
        body: JSON.stringify({param:inputValue, userid:localStorage.getItem('id')})
      }).then((res) =>
        res.json().then((jsprovdata) => {
          const options = []
          jsprovdata.forEach((data) => {
              var str = data.accnt_name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
              });          
              options.push({
                label: str,
                value: data.id + "_Type_" + data.account_mode
              })
          })
          return options;
        }));
    };

  
    const canSubmit = selectedOption != null && acc_Type.length > 0 && acc_Method.length > 0 && description.length > 0 && amount.length > 0 ;
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {  
      if($("#btncashsubmit").text().trim() == "Save")
      {
        var sel_value = selectedOption.value.toString().trim().split("_Type_");
        var sel_id = sel_value[0];
        var sel_val = sel_value[1];
        var debit_amnt = 0;
        var credit_amnt = 0;
        if(acc_Type == "in")
        {
          credit_amnt = amount;
        }
        else if(acc_Type == "out")
        {
          debit_amnt = amount;
        }
        fetch('https://backend-55jj.onrender.com/add_cashbook_values', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({ userid:localStorage.getItem('id'),ac_sel_party: selectedOption.label.toString().trim().toLowerCase(),ac_debit_amt: debit_amnt,ac_credit_amt: credit_amnt,ac_sel_id: sel_id, ac_cashbookDate: cashbookDate, ac_acc_Type:acc_Type, ac_acc_Method:acc_Method, ac_description:description,ac_amount:amount, ac_bill_no:bill_no, ac_party_type:sel_val, leg_inv_num : bill_text })
          }).then(res => {
              return res.json();
          }).then(data => {
          if(parseInt(data) != 0)
          {
              refreshtable("");
          }
        });
      }
      else if($("#btncashsubmit").text().trim() == "Update")
      {
        var debit_amnt = 0;
        var credit_amnt = 0;
        if(acc_Type == "in")
        {
          credit_amnt = amount;
        }
        else if(acc_Type == "out")
        {
          debit_amnt = amount;
        }
        var array_list =  JSON.parse($("#table_cashbook tbody tr:eq("+trrow+") td:eq(7)").find('span').text());
        var sel_id = array_list.ledger_account_no.toString().trim();
        var sel_val = array_list.ledger_type.toString().trim();
        var sel_label = array_list.ledger_account_name.toString().trim().toLowerCase();
        var u_bill_no = array_list.ledger_bill.toString().trim();
        var row_id = $(this).attr("data-lable");
        var row_type = $(this).attr("data-type");
        console.log(bill_text)
          fetch('https://backend-55jj.onrender.com/update_cashbook_values', { 
              method: 'POST', 
              headers:{   'Accept': 'application/json',
                'Content-Type': 'application/json'  },
              body: JSON.stringify({userid:localStorage.getItem('id'),led_Type:rowType,ac_cashId:cashId,ac_sel_party: sel_label.toLowerCase(),ac_debit_amt: debit_amnt,ac_credit_amt: credit_amnt,ac_sel_id: sel_id, ac_cashbookDate: cashbookDate, ac_acc_Type:acc_Type, ac_acc_Method:acc_Method, ac_description:description,ac_amount:amount, ac_bill_no:u_bill_no, ac_party_type:sel_val, leg_inv_num : bill_text})
            }).then(res => {
              return res.json();
            }).then(data => {
              if(data.data == "updated")
              {
                $("#select_party").removeClass('disabledDiv');
                $("#select_Type").removeClass('disabledDiv');
                $("#btncashsubmit").text("Save");
                refreshtable("");
              }
          });
      }
    }
  };
  
    const handleReset = () => {
      setSelectedOption(null);
      setcashbookDate(new Date());
      setacc_Type("");
      setacc_Method("");
      setDescription("");
      setAmount("");
      setbill_no("");
      setInputValue("");
      setHidden(true);
      setId(0);
      setrowIndex(0);
    };
      function refreshtable(sel_date)
      {
        if(sel_date == "")
        {
          handleReset();
          if ( $.fn.DataTable.isDataTable('#table_cashbook') ) {
            $('#table_cashbook').DataTable().destroy();
          }
          $('#table_cashbook tbody').empty();
          fetch('https://backend-55jj.onrender.com/cashbook_data'+'/'+localStorage.getItem('id')).then((res) =>
            res.json().then((jsdata) => {
              for (let i = 0; i < jsdata.cashbook_data.length; i++) {
                if(jsdata.cashbook_data[i].pay_start.toString().trim() != "started")
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
                  row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="cash_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.cashbook_data[i].id+'  data-type="ledger"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="cash_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.cashbook_data[i].id+'  data-type="ledger"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
                  row += '</tr>';
                  $("#table_cashbook tbody").append(row);
                }
             }
             for (let i = 0; i < jsdata.ledger2.length; i++) {
              if(jsdata.ledger2[i].pay_start.toString().trim() != "started")
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
                row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="cash_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.ledger2[i].id+'  data-type="ledger2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="cash_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.ledger2[i].id+'  data-type="ledger2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
                row += '</tr>';
                $("#table_cashbook tbody").append(row);
              }
           }
             $("#table_cashbook").DataTable();
          }))
         
        }  
        else
        {
          if ( $.fn.DataTable.isDataTable('#table_cashbook') ) {
            $('#table_cashbook').DataTable().destroy();
          }
          $('#table_cashbook tbody').empty();
          fetch('https://backend-55jj.onrender.com/cashbook_data'+'/'+localStorage.getItem('id')).then((res) =>
            res.json().then((jsdata) => {
              for (let i = 0; i < jsdata.cashbook_data.length; i++) {
                if(jsdata.cashbook_data[i].pay_start.toString().trim() != "started")
                {
                if(moment(jsdata.cashbook_data[i].ledger_gen_date).format("DD/MM/YYYY") == moment(sel_date).format("DD/MM/YYYY") )
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
                      row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="cash_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.cashbook_data[i].id+'  data-type="ledger"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="cash_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.cashbook_data[i].id+'  data-type="ledger"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
                      row += '</tr>';
                      $("#table_cashbook tbody").append(row);
                  }
                }
             }
             for (let i = 0; i < jsdata.ledger2.length; i++) {
              if(jsdata.ledger2[i].pay_start.toString().trim() != "started")
              {
              if(moment(jsdata.ledger2[i].ledger_gen_date).format("DD/MM/YYYY") == moment(sel_date).format("DD/MM/YYYY") )
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
                row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="cash_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.ledger2[i].id+'  data-type="ledger2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="cash_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.ledger2[i].id+'  data-type="ledger2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
                row += '</tr>';
                $("#table_cashbook tbody").append(row);
              }
            }
           }
            $("#table_cashbook").DataTable();
            }))
        }
      }

        useEffect(() => {
          var username = localStorage.getItem('username');
          if (username) {
            $(document).on("click", '.cash_sub_edit', function(e){
              e.preventDefault();
              var row_id = $(this).attr("data-lable");
              var row_type = $(this).attr("data-type");
              setrowType(row_type);
              $("#btncashsubmit").text("Update");
                var t_row =  $(this).closest('tr').index();
                var array_list =  JSON.parse($("#table_cashbook tbody tr:eq("+t_row+") td:eq(7)").find('span').text());
                $("#edit_id").val(row_id);
                setId(row_id);
                setrowIndex(t_row);
                const my_date = new Date(array_list.ledger_gen_date.toString().trim());
                const sel_val = array_list.ledger_account_no.toString().trim() + "_Type_" + array_list.ledger_type.toString().trim();
                setSelectedOption({"label": array_list.ledger_account_name.toString().trim(),"value": sel_val});
                $("#select_party").addClass('disabledDiv');
                $("#select_Type").addClass('disabledDiv');
                setcashbookDate(my_date);
                var account_type = "";
                var accnt_amt = "";
                if(parseInt(array_list.ledger_credit_amount.toString().trim()) == 0)
                {
                  account_type = "out";
                }
                else if(parseInt(array_list.ledger_debit_amount.toString().trim()) == 0)
                {
                  account_type = "in";
                }
                if(array_list.ledger_debit_amount.toString().trim() != 0)
                {
                  accnt_amt = array_list.ledger_debit_amount.toString().trim();
                }
                else if(array_list.ledger_credit_amount.toString().trim() != 0)
                {
                  accnt_amt = array_list.ledger_credit_amount.toString().trim();
                }
                setacc_Type(account_type);
                setacc_Method(array_list.ledger_method.toString().trim() );
                setDescription(array_list.ledger_descp.toString().trim() );
                setAmount(accnt_amt);
                setbill_no(array_list.ledger_bill.toString().trim());
                setbill_text(array_list.ledger_bill.toString().trim());
                setInputValue("");   
                setHidden(true);
          });
          $(document).off('click', '.cash_sub_delete').on("click", '.cash_sub_delete', function(e){
            e.preventDefault();
            var row_id = $(this).attr("data-lable");
            var row_type = $(this).attr("data-type");
            var t_row =  $(this).closest('tr').index();
            setId(row_id);
            var array_list =  JSON.parse($("#table_cashbook tbody tr:eq("+t_row+") td:eq(7)").find('span').text());
            fetch('https://backend-55jj.onrender.com/cashbook_delete', { 
              method: 'POST', 
              headers:{   'Accept': 'application/json',
                        'Content-Type': 'application/json'  }, 
              body: JSON.stringify({userid:localStorage.getItem('id'),ac_cashId:row_id,ac_cash_type: array_list.ledger_type.toString().trim(),ac_cash_accnt_no: array_list.ledger_account_no.toString().trim(), led_Type:row_type})
            }).then(res => {
              return res.json();
            }).then(data => {
              if(data.data == "deleted")
              {
                refreshtable("");
              }
          });
        });
            let table;   
            loadJQueryAndDataTables()
              .then(($) => {
                window.$ = window.jQuery = $;
                fetch('https://backend-55jj.onrender.com/cashbook_data'+'/'+localStorage.getItem('id')).then((res) =>
                  res.json().then((jsdata) => {
                    for (let i = 0; i < jsdata.cashbook_data.length; i++) {
                      if(jsdata.cashbook_data[i].pay_start.toString().trim() != "started")
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
                        row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="cash_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.cashbook_data[i].id+'  data-type="ledger"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="cash_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.cashbook_data[i].id+'  data-type="ledger"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
                        row += '</tr>';
                        $("#table_cashbook tbody").append(row);
                      }
                  }
                  for (let i = 0; i < jsdata.ledger2.length; i++) {
                    if(jsdata.ledger2[i].pay_start.toString().trim() != "started")
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
                      row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="cash_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.ledger2[i].id+'  data-type="ledger2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="cash_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata.ledger2[i].id+'  data-type="ledger2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
                      row += '</tr>';
                      $("#table_cashbook tbody").append(row);
                    }
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
          
        }, []);
      
  
  return (
    <div className="col-lg-12">
    <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Cash Book Entry</h5>
            </div>
            <div className="card-body">
              <form className="row gy-2 gx-2 align-items-center needs-validation" id="form_cash_bk" noValidate  onSubmit={e => e.preventDefault()}>
                {/* Date */}

                <div className="col-md-3" id="select_party">
              <label className="form-label">Select Account *</label>
              <AsyncSelect  
      cacheOptions 
      defaultOptions
      value={selectedOption}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      loadOptions={loadOptions}
    />
            </div>
            <div className="col-md-2" hidden={hidden}>
              <label className="form-label">Select Bill</label>
              <select 
              id="bill_number"
                className="form-select"
                value={bill_no}
                onChange={handleBillChange}
                required
              >   
              </select>
            </div>
                <div className="col-md-2">
                  <label className="form-label">Date *</label>
                
                  <DatePicker dateFormat="dd/MM/yyyy"  className="form-control" id="cash_bk_date" selected={cashbookDate}
                  onChange={date => { setcashbookDate(date); }} />
                </div>
                 <div className="col-md-1" id="select_Type">
              <label className="form-label">Type *</label>
              <select 
                className="form-select"
                value={acc_Type}
                onChange={(e) => setacc_Type(e.target.value)}
                required
              >
                    <option value="">Select</option>
                    <option value="in">IN</option>
                    <option value="out">OUT</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Method *</label>
              <select 
                className="form-select"
                value={acc_Method}
                onChange={(e) => setacc_Method(e.target.value)}
                required
              >
                    <option value="">Select Account</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="Bank">Cheque</option>
                    <option value="Digital Wallet">Digital Wallet</option>
              </select>
            </div>

            
                <div className="col-md-2">
              <label className="form-label">Amount *</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
              />
            </div>
    
                {/* Description */}
                <div className="col-md-4">
              <label className="form-label">Account Description *</label>
             
              <textarea
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>
    
                {/* Action Buttons */}
                  <div className="col-md-4 d-flex gap-2 align-items-end h-100">
                  <button className="btn btn-primary w-10" id="btncashsubmit" onClick={handleSubmit} disabled={!canSubmit}>
                    <Icon icon="mdi:content-save" className="me-1" /> Save
                  </button>
                  <button className="btn btn-secondary" province="button" onClick={handleReset} >
                        <Icon icon="mdi:refresh" className="me-1" /> Reset
                    </button>
                </div>
              </form>
            </div>
          </div>
    </div>
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Cash Book Entries</h5>
        </div>
        <div className="card-body">
        <select id="customSelect" onChange={handleSelTypechange} className="form-control custom-cash-cls" style={{marginLeft:"20%"}}>
            <option value="all">All</option>
            <option value="general">General</option>
            <option value="commission">Commission</option>
            <option value="party">Party</option>
            <option value="vehicle">Vehicle</option>
            <option value="client">Client</option>
            <option value="supplier">Supplier</option>
        </select>
        <input type="date" id="customFilter" name="filter_date" onChange={handleDatechange} className="form-control custom-cash-cls"/>


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
                  <th className="py-2">Action</th>
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
export default CashBookDataTable;