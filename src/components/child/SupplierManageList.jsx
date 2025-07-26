"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import $ from 'jquery'; 
import { Icon } from "@iconify/react/dist/iconify.js";
import { validate } from "uuid";
const loadJQueryAndDataTables = async () => {
  const $ = (await import("jquery")).default;
  await import("datatables.net-dt/js/dataTables.dataTables.js");
  return $;
};
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from 'moment';


const SupplierManageList = () => {

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

    const [Edithidden, setEdithidden] = useState(true);
    const [detailshidden, setdetailshidden] = useState(false);
    const [leghidden, setleghidden] = useState(true);

    const [ledSuppId, setledSuppId] = useState(0);
    const [ledChartId, setledChartId] = useState(0);

    const [l_partyName, setl_partyName] = useState("");
    const [l_partyBal, setl_partyBal] = useState("");
    const [l_partyId, setl_partyId] = useState("");

    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  
    const canSubmit = supplName.length > 0 && supplPhone.length > 0 ;

const handlePrint = (e) => {
  var party_type = 'supplier';
  fetch('https://backend-55jj.onrender.com/generate_pdf/'+party_type+'/'+l_partyId+'/'+localStorage.getItem('id'))
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
      setEdithidden(true);
      setdetailshidden(false);
      setleghidden(true);
      setledSuppId(0);
      setledChartId(0);
      setl_partyName("");
      setl_partyBal("");
      setl_partyId(0);
      $('#party_ledger tbody').empty();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      if($("#btnsupplsubmit").text().trim() == "Update")
        {
            fetch('https://backend-55jj.onrender.com/update_supplier_setup', { 
              method: 'POST', 
              headers:{   'Accept': 'application/json',
                'Content-Type': 'application/json'  },
              body: JSON.stringify({userid:localStorage.getItem('id'),s_supplId:supplId,  s_supplName: supplName, s_supplCmp: supplCmp, s_supplPhone :supplPhone , s_supplEmail: supplEmail , s_supplAddress: supplAddress, s_supplCity: supplCity, s_supplRegion: supplRegion, s_supplCountry: supplCountry, s_supplPostBox: supplPostBox, s_supplTaxid: supplTaxid})
            }).then(res => {
              return res.json();
            }).then(data => {
              if(data.data == "updated")
              {
                $("#btnsupplsubmit").text("Save");
                refreshtable();
              }
          });
        }
    }
  }

  function numberWithCommas(x) {
    return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
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
    
    setEdithidden(true);
    setdetailshidden(false);
    setleghidden(true);
    setId(0);
  };

  function refreshtable()
  {
    handleReset();
    if ( $.fn.DataTable.isDataTable('#supplier_table') ) {
      $('#supplier_table').DataTable().destroy();
    }
    $('#supplier_table tbody').empty();
    fetch('https://backend-55jj.onrender.com/supplier_data'+'/'+localStorage.getItem('id')).then((res) =>
      res.json().then((jsdata) => {
       for (let i = 0; i < jsdata.length; i++) {
        let row = '<tr>';
        var data_obj = JSON.stringify(jsdata[i], null, 2);
        row += '<td>' + (i +1) + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].suppl_name + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].suppl_address + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].suppl_email + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].suppl_phone + '</td>';
        row += '<td style="text-transform:capitalize">' + "Rs. "+numberWithCommas(jsdata[i].networth) + '</td>';
        row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="ledger_view w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center" data-lable = '+jsdata[i].id+' data-chart = '+jsdata[i].chart_accnt+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--octicon menu-icon" width="1em" height="1em" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z" fill="currentColor"></path></svg></a><a class="supplier_view w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"  data-lable='+jsdata[i].id+' ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--hugeicons menu-icon" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M21.544 11.045c.304.426.456.64.456.955c0 .316-.152.529-.456.955C20.178 14.871 16.689 19 12 19c-4.69 0-8.178-4.13-9.544-6.045C2.152 12.529 2 12.315 2 12c0-.316.152-.529.456-.955C3.822 9.129 7.311 5 12 5c4.69 0 8.178 4.13 9.544 6.045"></path><path d="M15 12a3 3 0 1 0-6 0a3 3 0 0 0 6 0"></path></g></svg></a><a class="supplier_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="supplier_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
        row += '</tr>';
        $("#supplier_table tbody").append(row);
       }
       $("#supplier_table").DataTable();
      }))
  }

  useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
      $(document).off('click', '.ledger_view').on("click", '.ledger_view', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        var chart_id = $(this).attr("data-chart");
        setEdithidden(true);
        setdetailshidden(true);
        setleghidden(false);
        setledSuppId(row_id);
        setledChartId(chart_id);
        fetch('https://backend-55jj.onrender.com/ledger_account_data', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({ userid:localStorage.getItem('id'), ledg_id: row_id, ledg_chart_id : chart_id, ledger_type :'supplier'})
          }).then(res => {
              return res.json();
          }).then(data => {
            setl_partyName(data.party_data[0].party_Name.toString().trim().toUpperCase());
            setl_partyBal(data.party_data[0].party_Balance);
            setl_partyId(data.party_data[0].party_id);
            for (let i = 0; i < data.ledger_data.length; i++) {
              var u_bill_no = data.ledger_data[i].ledger_bill.toString().trim();
              var leg_bill_no = '';
              var regExp = /[a-zA-Z]/g;
              if(regExp.test(u_bill_no))
              {
                leg_bill_no = u_bill_no;
              }
              else
              {
                leg_bill_no = "Order_" +  data.ledger_data[i].id.toString().trim();
              }
              let row = '<tr>';
              row += '<td style="text-transform:capitalize">' +   moment(data.ledger_data[i].ledger_gen_date).format("DD/MM/YYYY") + '</td>';
              row += '<td style="text-transform:capitalize">' + leg_bill_no + '</td>';
              row += '<td style="text-transform:capitalize">' + data.ledger_data[i].ledger_descp + '</td>';
              row += '<td style="text-transform:capitalize; text-align: right;">' +  data.ledger_data[i].ledger_credit_amount+ '</td>';
              row += '<td style="text-transform:capitalize; text-align: right;">' + data.ledger_data[i].ledger_debit_amount + '</td>';
              row += '<td style="text-transform:capitalize; text-align: right;">' + data.ledger_data[i].ledger_balance + '</td>';
              row += '</tr>';
              $("#party_ledger tbody").append(row);
            }
          }); 
      });

      $(document).off('click', '.supplier_view').on("click", '.supplier_view', function(e){
          e.preventDefault();
          var row_id = $(this).attr("data-lable");
          var t_row =  $(this).closest('tr').index();
          var array_list =  JSON.parse($("#supplier_table tbody tr:eq("+t_row+") td:eq(6)").find('span').text());
          var swal_html = `
          <table class="table bordered-table mb-0" style="text-align: left;" id="SupplTbl">
              <tbody>
              <tr>
                <td> <label className="form-label" style="font-weight: bold;">Name </label></td>
                <td> <label className="form-label" style="text-transform: capitalize;">`+array_list.suppl_name.toString().trim()+`</label></td>
                <td> <label className="form-label" style="font-weight: bold;">Company</label></td>
                <td> <label className="form-label" style="text-transform: capitalize;">`+array_list.suppl_company.toString().trim()+`</label></td>
              </tr>
              <tr>
                <td> <label className="form-label" style="font-weight: bold;">Address </label></td>
                <td> <label className="form-label" style="text-transform: capitalize;">`+array_list.suppl_address.toString().trim()+`</label></td>
                <td> <label className="form-label" style="font-weight: bold;">City</label></td>
                <td> <label className="form-label" style="text-transform: capitalize;">`+array_list.suppl_city.toString().trim()+`</label></td>
              </tr>
              <tr>
                <td> <label className="form-label" style="font-weight: bold;">Region </label></td>
                <td> <label className="form-label" style="text-transform: capitalize;">`+array_list.suppl_region.toString().trim()+`</label></td>
                <td> <label className="form-label" style="font-weight: bold;">Country</label></td>
                <td> <label className="form-label" style="text-transform: capitalize;">`+array_list.suppl_country.toString().trim()+`</label></td>
              </tr>
              <tr>
                <td> <label className="form-label" style="font-weight: bold;">PostBox </label></td>
                <td> <label className="form-label" style="text-transform: capitalize;">`+array_list.suppl_postbox.toString().trim()+`</label></td>
                <td> <label className="form-label" style="font-weight: bold;">Tax-Id</label></td>
                <td> <label className="form-label" style="text-transform: capitalize;">`+array_list.suppl_tax_id.toString().trim()+`</label></td>
              </tr>
              <tr>
                <td> <label className="form-label" style="font-weight: bold;">Phone </label></td>
                <td> <label className="form-label" style="text-transform: capitalize;">`+array_list.suppl_phone.toString().trim()+`</label></td>
                <td> <label className="form-label" style="font-weight: bold;">Email</label></td>
                <td> <label className="form-label" style="text-transform: capitalize;">`+array_list.suppl_email.toString().trim()+`</label></td>
              </tr>
              </tbody>
          </table>
      `;
          withReactContent(Swal).fire({
            title: "Supplier Details",
            html: swal_html,
            draggable: true,
            showConfirmButton: false,
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            width: '1100px',
            allowOutsideClick: false,
            allowEscapeKey: false
        });
      });
      $(document).on("click", '.supplier_edit', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        $("#btnsupplsubmit").text("Update");
          var t_row =  $(this).closest('tr').index();
          var array_list =  JSON.parse($("#supplier_table tbody tr:eq("+t_row+") td:eq(6)").find('span').text());
          setsupplName(array_list.suppl_name.toString().trim());
          setId(array_list.id.toString().trim());
          setsupplCmp(array_list.suppl_company.toString().trim());
          setsupplPhone(array_list.suppl_phone.toString().trim());
          setsupplEmail(array_list.suppl_email.toString().trim());
          setsupplAddress(array_list.suppl_address.toString().trim());
          setsupplCity(array_list.suppl_city.toString().trim());
          setsupplRegion(array_list.suppl_region.toString().trim());
          setsupplCountry(array_list.suppl_country.toString().trim());
          setsupplPostBox(array_list.suppl_postbox.toString().trim());
          setsupplTaxid(array_list.suppl_tax_id.toString().trim());
          setEdithidden(false);
          setdetailshidden(true);
          setleghidden(true);
      });
      $(document).off('click', '.supplier_delete').on("click", '.supplier_delete', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        setId(row_id);
        fetch('https://backend-55jj.onrender.com/supplier_delete/'+row_id+'/'+localStorage.getItem('id'), { 
          method: 'DELETE', 
          headers:{   'Accept': 'application/json',
                    'Content-Type': 'application/json'  }, 
          body: JSON.stringify()
        }).then(res => {
          return res.json();
        }).then(data => {
          if(data.data == "deleted")
          {
            refreshtable();
          }
      });
      });

      let table;
      loadJQueryAndDataTables()
        .then(($) => {
           window.$ = window.jQuery = $;
          fetch('https://backend-55jj.onrender.com/supplier_data'+'/'+localStorage.getItem('id')).then((res) =>
            res.json().then((jsdata) => {
            for (let i = 0; i < jsdata.length; i++) {
              let row = '<tr>';
              var data_obj = JSON.stringify(jsdata[i], null, 2);
              row += '<td>' + (i +1) + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].suppl_name + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].suppl_address + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].suppl_email + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].suppl_phone + '</td>';
              row += '<td style="text-transform:capitalize">' + "Rs. "+numberWithCommas(jsdata[i].networth) + '</td>';
              row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="ledger_view w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center" data-lable = '+jsdata[i].id+' data-chart = '+jsdata[i].chart_accnt+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--octicon menu-icon" width="1em" height="1em" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z" fill="currentColor"></path></svg></a><a class="supplier_view w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"  data-lable='+jsdata[i].id+' ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--hugeicons menu-icon" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M21.544 11.045c.304.426.456.64.456.955c0 .316-.152.529-.456.955C20.178 14.871 16.689 19 12 19c-4.69 0-8.178-4.13-9.544-6.045C2.152 12.529 2 12.315 2 12c0-.316.152-.529.456-.955C3.822 9.129 7.311 5 12 5c4.69 0 8.178 4.13 9.544 6.045"></path><path d="M15 12a3 3 0 1 0-6 0a3 3 0 0 0 6 0"></path></g></svg></a><a class="supplier_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="supplier_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
              row += '</tr>';
              $("#supplier_table tbody").append(row);
            }
            $("#supplier_table").DataTable();
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
    <div>
<div className="col-lg-12" id="ledger_details" hidden={leghidden}>
    <div className="card">
    <div className="col-md-3">
    <button type="button" className="custom_back btn rounded-pill btn-outline-primary-600 radius-8 px-20 py-11 d-flex align-items-center gap-2"  onClick={handleBack}  >
        <Icon icon="mingcute:square-arrow-left-line" className="text-xl" />{" "} Back To List </button>
        </div>
        <div className="card-header border-bottom-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title mb-0">Supplier Ledger Statement</h5>
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
              <tbody>
                
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
    <div className="col-lg-12" hidden={Edithidden}>
       <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Update Supplier</h5>
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
                    <button className="btn btn-primary" id="btnsupplsubmit" onClick={handleSubmit} disabled={!canSubmit} >
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

    <div className="card basic-data-table" hidden={detailshidden}>
      <div className="card-header">
        <h5 className="card-title mb-0">Supplier List</h5>
      </div>
      <div className="card-body">
        <table
          className="table bordered-table mb-0"
          id="supplier_table"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Networth</th>
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

export default SupplierManageList;