"use client";
import { useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import $ from 'jquery'; 
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from 'moment';

const PartyGoodsLists = () => {

  const [listhidden, setlisthidden] = useState(false);
  const [addhidden, setaddhidden] = useState(true);
  const [viewhidden, setviewhidden] = useState(true);
  const [invoiceNo, setinvoiceNo] = useState("");
  const [issueDate, setissueDate] = useState(new Date());
  const [dueDate, setdueDate] = useState(new Date());
  const [invoiceParty, setinvoiceParty] = useState("");
  const [partyContact, setpartyContact] = useState("");
  const [partyphone, setpartyphone] = useState("");  
  const [partyid, setpartyid] = useState("");
  const [salesName, setsalesName] = useState("Jimmi");  
  const [thankMssg, setthankMssg] = useState("Thanks for your business.");  
  const [subTotal, setsubTotal] = useState("");  
  const [invTotal, setinvTotal] = useState(""); 
  const [rowNo, setrowNo] = useState(0); 
  const [openModal, setOpenModal] = useState(false);
  const [onClose, setCloseModal] = useState(false);
  const [selectList, setselectList] = useState();
  const [editMode, seteditMode] = useState();
  const [partybillId, setpartybillId] = useState();
  const [tempdeleterows, settempdeleterows] = useState("");
  const [selectDisable, setselectDisable] = useState(true);
  const [issueDateDisable, setissueDateDisable] = useState(true);

  const [view_row_id, setview_row_id] = useState();
  const [view_invoice_num, setview_invoice_num] = useState();
  const [view_issue_dt, setview_issue_dt] = useState();
  const [view_due_date, setview_due_date] = useState();
  const [view_party_id, setview_party_id] = useState();
  const [view_party_name, setview_party_name] = useState();
  const [view_party_conatct, setview_party_conatct] = useState();
  const [view_party_phone, setview_party_phone] = useState();
  const [view_sales, setview_sales] = useState();
  const [view_thanks, setview_thanks] = useState();
  const [view_subtotal, setview_subtotal] = useState();
  const [view_total, setview_total] = useState();

  //const canSubmit = $("#add_item_table tbody tr").length > 0 && invoiceParty.length > 0 && salesName.length > 0 && thankMssg.length > 0;

  const handleDownload = (e) => {
        // fetch('https://backend-55jj.onrender.com/generatebill_pdf/'+ view_row_id+'/'+localStorage.getItem('id'))
        // .then(resp => resp.blob())
        // .then(blob => {
        //   const url = window.URL.createObjectURL(blob);
        //   var partyname = view_party_name;
        //   const a = document.createElement('a');
        //   a.style.display = 'none';
        //   a.href = url;
        //   a.download = partyname.toString().replace(" ","_") + '_Bill.pdf';
        //   document.body.appendChild(a);
        //   a.click();
        // })
        // .catch(() => 
        // console.log("error"));
  };

  var deleteRows = '';
  function pad(n, length) {
    var len = length - (''+n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // if(canSubmit)
    // {
    //  if(editMode == "Edit")
    //   {
    //     fetch('https://backend-55jj.onrender.com/update_party_bill', { 
    //       method: 'POST', 
    //       headers: { 'Content-Type': 'application/json', }, 
    //       body: JSON.stringify({userid:localStorage.getItem('id'), pb_partybillId:partybillId,pb_invoiceNo:invoiceNo, pb_issueDate: issueDate, pb_dueDate: dueDate, pb_partyid: partyid, pb_invoiceParty: invoiceParty, pb_subTotal: subTotal, pb_salesName: salesName, pb_thankMssg:thankMssg, pb_subTotal:subTotal,pb_select_bilty:selectList.toString().trim()})
    //     }).then(res => {
    //         return res.json();
    //       }).then(data => {
    //         location.reload();  
    //     });
    //   }
    // }
  };

  function refreshtable(selec_val)
  {
    // if ( $.fn.DataTable.isDataTable('#party_gooods_table') ) {
    //   $('#party_gooods_table').DataTable().destroy();
    // }
    // $('#party_gooods_table tbody').empty();
    // fetch('https://backend-55jj.onrender.com/party_bill_data'+'/'+localStorage.getItem('id')).then((res) =>
    //   res.json().then((jsdata) => {
    //     if(selec_val == "")
    //     {
    //       for (let i = 0; i < jsdata.length; i++) {
    //         if(jsdata[i].invoice_type.toString().trim() == "goods")
    //         {
    //           let row = '<tr>';
    //           row += '<td>' + (i +1) + '</td>';
    //           row += '<td style="text-transform:capitalize">' + jsdata[i].invoice_no + '</td>';
    //           row += '<td style="text-transform:capitalize">' + jsdata[i].party_name + '</td>';
    //           row += '<td style="text-transform:capitalize">' +   moment(jsdata[i].invoice_date).format("DD/MM/YYYY") + '</td>';
    //           row += '<td style="text-transform:capitalize" data-label='+jsdata[i].invoice_balance+'>' + jsdata[i].invoice_balance + '</td>';
    //           if(jsdata[i].invoice_status.toString().trim() == "posted")
    //             {
    //               row += '<td style="text-transform:capitalize" data-label='+jsdata[i].invoice_bilties+'><span class="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm">Posted</span></td>';
    //             }
    //             else if(jsdata[i].invoice_status.toString().trim() == "paid")
    //             {
    //               row += '<td style="text-transform:capitalize" data-label='+jsdata[i].invoice_bilties+'><span class="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">Paid</span></td>';
    //             }
    //             row += '<td ><a class="party_bill_view w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"  data-lable='+jsdata[i].id+' ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconamoon" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0"></path><path d="M2 12c1.6-4.097 5.336-7 10-7s8.4 2.903 10 7c-1.6 4.097-5.336 7-10 7s-8.4-2.903-10-7"></path></g></svg></a><a class="party_bill_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="party_bill_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
    //             row += '</tr>';
    //             $("#party_gooods_table tbody").append(row); 
    //           }
    //         }
    //     }
    //     else{
    //       if(selec_val == "paid")
    //       {
    //         for (let i = 0; i < jsdata.length; i++) {
    //           if(jsdata[i].invoice_type.toString().trim() == "goods" && jsdata[i].invoice_status.toString().trim() == "paid")
    //           {
    //             let row = '<tr>';
    //             row += '<td>' + (i +1) + '</td>';
    //             row += '<td style="text-transform:capitalize">' + jsdata[i].invoice_no + '</td>';
    //             row += '<td style="text-transform:capitalize">' + jsdata[i].party_name + '</td>';
    //             row += '<td style="text-transform:capitalize">' +   moment(jsdata[i].invoice_date).format("DD/MM/YYYY") + '</td>';
    //             row += '<td style="text-transform:capitalize" data-label='+jsdata[i].invoice_balance+'>' + jsdata[i].invoice_balance + '</td>';
    //             row += '<td style="text-transform:capitalize" data-label='+jsdata[i].invoice_bilties+'><span class="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">Paid</span></td>';
    //             row += '<td ><a class="party_bill_view w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"  data-lable='+jsdata[i].id+' ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconamoon" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0"></path><path d="M2 12c1.6-4.097 5.336-7 10-7s8.4 2.903 10 7c-1.6 4.097-5.336 7-10 7s-8.4-2.903-10-7"></path></g></svg></a><a class="party_bill_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="party_bill_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
    //             row += '</tr>';
    //             $("#party_gooods_table tbody").append(row); 
    //           }
    //         }
    //       }
    //       else if(selec_val == "posted")
    //       {
    //         for (let i = 0; i < jsdata.length; i++) {
    //           if(jsdata[i].invoice_type.toString().trim() == "goods" && jsdata[i].invoice_status.toString().trim() == "posted")
    //           {
    //             let row = '<tr>';
    //             row += '<td>' + (i +1) + '</td>';
    //             row += '<td style="text-transform:capitalize">' + jsdata[i].invoice_no + '</td>';
    //             row += '<td style="text-transform:capitalize">' + jsdata[i].party_name + '</td>';
    //             row += '<td style="text-transform:capitalize">' +   moment(jsdata[i].invoice_date).format("DD/MM/YYYY") + '</td>';
    //             row += '<td style="text-transform:capitalize" data-label='+jsdata[i].invoice_balance+'>' + jsdata[i].invoice_balance + '</td>';
    //             row += '<td style="text-transform:capitalize" data-label='+jsdata[i].invoice_bilties+'><span class="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm">Posted</span></td>';
    //             row += '<td ><a class="party_bill_view w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"  data-lable='+jsdata[i].id+' ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconamoon" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0"></path><path d="M2 12c1.6-4.097 5.336-7 10-7s8.4 2.903 10 7c-1.6 4.097-5.336 7-10 7s-8.4-2.903-10-7"></path></g></svg></a><a class="party_bill_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="party_bill_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
    //             row += '</tr>';
    //             $("#party_gooods_table tbody").append(row); 
    //           }
    //         }
    //       }
    //     }
    //    $("#party_gooods_table").DataTable();
    //   }))   
  }
  
  const handlePartyChange= (e) => {
    // var index = e.nativeEvent.target.selectedIndex;
    // var selectTxt = e.nativeEvent.target[index].text;
    // var selectVal = e.target.value;
    // const element = e.target;
    // var selContact =  e.nativeEvent.target[index].dataset.contact;
    // var selPhone = e.nativeEvent.target[index].dataset.phone;
    // setinvoiceParty(selectTxt);
    // setpartyContact(selContact);
    // setpartyphone(selPhone);
    // setpartyid(selectVal);
  }

  const handleselectOnchange = (e) => {
    // refreshtable(e.target.value);
  };
  const handleAddInvoice = (e) => {
      // setaddhidden(false);
      // setviewhidden(true);
      // setlisthidden(true);
      // seteditMode("Add");
      // setselectDisable(false);
      // setissueDateDisable(false);
  };
  
  const handleAddItem = (e) => {
  //   if(invoiceParty != 0) 
  //   {
  //     let rows = '';
  //     fetch('https://backend-55jj.onrender.com/mainifest_good_data', { 
  //       method: 'POST', 
  //       headers: { 'Content-Type': 'application/json', }, 
  //       body: JSON.stringify({party_id: partyid, userid:localStorage.getItem('id')})
  //     }).then(res => {
  //           return res.json();
  //       }).then(data => {
  //           for (let i = 0; i < data.length; i++) {
  //             if ($.inArray(parseInt(data[i].id), selectList) === -1)
  //             {
  //               let row = '<tr>';
  //               row += '<td><input class="form-check-input tbl_check" data-label= " '+data[i].id+'" type="checkbox" value="" id="checkbox"'+i+'></td>';
  //               row += '<td style="text-transform:capitalize" data-id='+data[i].id+'>' +  moment(data[i].b_date).format("DD/MM/YYYY") + '</td>';
  //               row += '<td style="text-transform:capitalize" data-type='+data[i].bill_status+'>' + data[i].bilty_no + '</td>';
  //               row += '<td style="text-transform:capitalize">' + data[i].loading_point + '</td>';
  //               row += '<td style="text-transform:capitalize">' + data[i].unloading_point + '</td>';
  //               row += '<td style="text-transform:capitalize">' + data[i].weight + '</td>';
  //               row += '<td style="text-transform:capitalize">' + data[i].per_ton + '</td>';
  //               row += '<td style="text-transform:capitalize">' + data[i].freight + '</td>';
  //               row += '<td style="text-transform:capitalize">' + data[i].wrt_4_per_freight + '</td>';
  //               row += '<td style="text-transform:capitalize">' + data[i].commission + '</td>';
  //               rows += row;
  //             } 
  //           }
  //     var swal_html = `
  //     <table class="form-check table mb-0" id="AddItemTbl">
  //         <thead>
  //             <tr>
  //                 <th>
  //                     <input class="form-check-input" type="checkbox" value="1" id="check_all">
  //                 </th>
  //                 <th>Date#</th>
  //                 <th>Challan No#</th>
  //                 <th>Loading Point</th>
  //                 <th>Destination</th>
  //                 <th>Weight</th>
  //                 <th>Per/Ton</th>
  //                 <th>Freight</th>
  //                 <th>WHT 4%</th>
  //                 <th>Commission</th>
  //             </tr>
  //         </thead>
  //         <tbody>
              
  //            `+rows+` 
  //           `+tempdeleterows+` 
  //         </tbody>
  //     </table>
  // `;
  //       withReactContent(Swal).fire({
  //         title: "Select Items",
  //         html: swal_html,
  //         draggable: true,
  //         showConfirmButton: true,
  //         showCloseButton: true,
  //         showCancelButton: true,
  //         focusConfirm: false,
  //         width: '1100px',
  //         preConfirm: () => {
  //           var sel_Array = [];
  //           var check_len = $('#AddItemTbl tbody .tbl_check:checked').length;
  //           if(check_len != 0)
  //           {
  //             if(selectList != null)
  //               {
  //                 for (let k = 0; k < selectList.length; k++) {
  //                   sel_Array.push(parseInt(selectList[k]));
  //                 }
  //               }
  //             $('#AddItemTbl tbody .tbl_check:checked').each(function(e) {
  //               var t_row =  $(this).closest('tr').index();    
  //               var row_id = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(1)").attr("data-id");
  //               var row_status = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(2)").attr("data-type");
  //               sel_Array.push(parseInt(row_id)); 
  //               var tbl_row = $("#add_item_table tbody tr").length + 1;
  //               setrowNo($("#add_item_table tbody tr").length);
  //               var item_date = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(1)").html();
  //               var item_bill_no = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(2)").html();
  //               var item_loading = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(3)").html();
  //               var item_destin = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(4)").html();
  //               var item_weight = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(5)").html();
  //               var item_per_ton = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(6)").html();
  //               var item_freight = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(7)").html();
  //               var item_wht = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(8)").html();
  //               var item_comm = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(9)").html();
  //               $("#add_item_table tbody").append('<tr><td>'+tbl_row+'</td><td>'+item_date+'</td><td>'+item_bill_no+'</td><td>'+item_loading+'</td><td>'+item_destin+'</td><td>'+item_weight+'</td><td>'+item_per_ton+'</td><td>'+item_freight+'</td><td>'+item_wht+'</td><td>'+item_comm+'</td><td><button type="button" class="btn_item_dlt remove-row" data-lable='+row_id+'  data-status='+row_status+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic text-danger-main text-xl" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg></button></td></tr>');
  //             });
  //             setselectList(sel_Array);
  //             var sub_total = 0;
  //             $('#add_item_table tbody tr').each(function(e) {
  //               var t_row_a =  $(this).closest('tr').index();   
  //               var freight_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(7)").html();
  //               sub_total += parseInt(freight_amt);
  //             });
  //             setsubTotal(sub_total);
  //             setinvTotal(sub_total);
  //           }
  //           else
  //           {
  //             withReactContent(Swal).fire({
  //               icon: "error",
  //               title: "Oops...",
  //               text: "Please Select Atleast One Item To Add!",
  //               draggable: true
  //             });
  //           }
  //       },
  //         confirmButtonText: `<i class="fa fa-plus  "></i> Add`,
  //         cancelButtonText: `<i class="fa fa-close"></i> Cancel`,
  //         allowOutsideClick: false,
  //         allowEscapeKey: false
  //        });
  //     });
  //   }
  //   else
  //   {
  //     withReactContent(Swal).fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Please Select Party!",
  //       draggable: true
  //     });
  //   }
  };  

  const handleBack = (e) => {
    // e.preventDefault();
    // setaddhidden(true);
    // setviewhidden(true);
    // setlisthidden(false);
    };

  useEffect(() => {
    // var clicked = false;
    // $(document).off('click', '#check_all').on("click", '#check_all', function(e){
    //   e.preventDefault();
    //   $("#AddItemTbl .tbl_check").prop("checked", !clicked);
    //   clicked = !clicked;
    // });
    // $(document).off('click', '.party_bill_view').on("click", '.party_bill_view', function(e){
    //   e.preventDefault();
    //   setaddhidden(true);
    //   setviewhidden(false);
    //   setlisthidden(true);
    //   $('#tbl_view_party tbody').empty();
    //   var row_id = $(this).attr("data-lable");
    //   fetch('https://backend-55jj.onrender.com/get_party_bill_data', { 
    //     method: 'POST', 
    //     headers: { 'Content-Type': 'application/json', }, 
    //     body: JSON.stringify({userid:localStorage.getItem('id'), party_bill_id: row_id, party_bill_type: "goods"})
    //   }).then(res => {
    //         return res.json();
    //     }).then(data => {
    //       setview_row_id(data.party[0].id);
    //       setview_invoice_num(data.party[0].invoice_no);
    //       setview_issue_dt(moment(data.party[0].invoice_date.toString().trim()).format("DD/MM/YYYY"));
    //       setview_due_date(moment(data.party[0].invoice_due_date.toString().trim()).format("DD/MM/YYYY"));
    //       setview_party_name(data.party[0].party_name);
    //       setview_party_conatct(data.party[0].party_contact);
    //       setview_party_phone(data.party[0].party_phone);
    //       setview_party_id(data.party[0].party_id);
    //       setview_sales(data.party[0].invoice_sales_person);
    //       setview_thanks(data.party[0].invoice_thank_message);
    //       setsubTotal(data.party[0].invoice_balance);
    //       setview_subtotal(data.party[0].invoice_balance);
    //       setview_total(data.party[0].invoice_balance);
    //       for (let k = 0; k < data.items.length; k++) {
    //         var row_id = data.items[k].id;
    //         var row_status = data.items[k].bill_status;
    //         var item_date = moment(data.items[k].b_date).format("DD/MM/YYYY") ;
    //         var item_bill_no =data.items[k].bilty_no;
    //         var item_loading = data.items[k].loading_point;
    //         var item_destin = data.items[k].unloading_point;
    //         var item_weight = data.items[k].weight;
    //         var item_per_ton = data.items[k].per_ton;
    //         var item_freight = data.items[k].freight;
    //         var item_wht = data.items[k].wrt_4_per_freight;
    //         var item_comm =data.items[k].commission;
    //         $("#tbl_view_party tbody").append('<tr><td>'+(k+1)+'</td><td>'+item_date+'</td><td>'+item_bill_no+'</td><td>'+item_loading+'</td><td>'+item_destin+'</td><td>'+item_weight+'</td><td>'+item_per_ton+'</td><td>'+item_freight+'</td><td>'+item_wht+'</td><td>'+item_comm+'</td></tr>');
    //       }
    //     });
    // });

    // $(document).off('click', '.party_bill_edit').on("click", '.party_bill_edit', function(e){
    //   e.preventDefault();
    //   setaddhidden(false);
    //   setviewhidden(true);
    //   setlisthidden(true);
    //   seteditMode("Edit");
    //   $('#add_item_table tbody').empty();
    //   var row_id = $(this).attr("data-lable");
    //   fetch('https://backend-55jj.onrender.com/get_party_bill_data', { 
    //     method: 'POST', 
    //     headers: { 'Content-Type': 'application/json', }, 
    //     body: JSON.stringify({party_bill_id: row_id , party_bill_type: "goods",userid:localStorage.getItem('id')})
    //   }).then(res => {
    //         return res.json();
    //     }).then(data => {
    //       setpartybillId(data.party[0].id);
    //       setinvoiceNo(data.party[0].invoice_no);
    //       const issue_date = new Date(data.party[0].invoice_date.toString().trim());
    //       const due_date = new Date(data.party[0].invoice_due_date.toString().trim());
    //       setissueDate(issue_date);
    //       setdueDate(due_date);
    //       setinvoiceParty(data.party[0].party_name);
    //       setpartyContact(data.party[0].party_contact);
    //       setpartyphone(data.party[0].party_phone);
    //       setpartyid(data.party[0].party_id);
    //       setsalesName(data.party[0].invoice_sales_person);
    //       setthankMssg(data.party[0].invoice_thank_message);
    //       setsubTotal(data.party[0].invoice_balance);
    //       setinvTotal(data.party[0].invoice_balance);
    //       var sel_Array = [];
    //       setrowNo(data.items.length);
    //       for (let k = 0; k < data.items.length; k++) {
    //         var row_id = data.items[k].id;
    //         sel_Array.push(parseInt(row_id)); 
    //         var row_status = data.items[k].bill_status;
    //         var item_date = moment(data.items[k].b_date).format("DD/MM/YYYY") ;
    //         var item_bill_no =data.items[k].bilty_no;
    //         var item_loading = data.items[k].loading_point;
    //         var item_destin = data.items[k].unloading_point;
    //         var item_weight = data.items[k].weight;
    //         var item_per_ton = data.items[k].per_ton;
    //         var item_freight = data.items[k].freight;
    //         var item_wht = data.items[k].wrt_4_per_freight;
    //         var item_comm =data.items[k].commission;
    //         $("#add_item_table tbody").append('<tr><td>'+(k+1)+'</td><td>'+item_date+'</td><td>'+item_bill_no+'</td><td>'+item_loading+'</td><td>'+item_destin+'</td><td>'+item_weight+'</td><td>'+item_per_ton+'</td><td>'+item_freight+'</td><td>'+item_wht+'</td><td>'+item_comm+'</td><td><button type="button" class="btn_item_dlt remove-row" data-lable='+row_id+'  data-status='+row_status+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic text-danger-main text-xl" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg></button></td></tr>');
    //       }
    //       setselectList(sel_Array);
    //       setselectDisable(true);
    //       setissueDateDisable(true);
    //   });
    // });

    // $(document).off('click', '.party_bill_delete').on("click", '.party_bill_delete', function(e){
    //   e.preventDefault();
    // var row_id = $(this).attr("data-lable");
    //   fetch('https://backend-55jj.onrender.com/party_bill_delete/'+row_id+'/'+localStorage.getItem('id'), { 
    //     method: 'DELETE', 
    //     headers: { 'Content-Type': 'application/json', }, 
    //     body: JSON.stringify({})
    //   }).then(res => {
    //     return res.json();
    //   }).then(data => {
    //     if(data.data.toString() == "deleted")
    //     {
    //       location.reload();  
    //   }
    // });
    // });
    // $(document).off('click', '.btn_item_dlt').on("click", '.btn_item_dlt', function(e){
    //   e.preventDefault();
    //   var t_row =  $(this).closest('tr').index();
    //   var row_id = $(this).attr("data-lable");
    //   var row_status = $(this).attr("data-status");
    //   if(row_status != "pending")
    //   {
    //     var row_id = $(this).attr("data-lable");
    //     var row_status =$(this).attr("data-status");
    //     var tbl_row = $("#AddItemTbl tbody tr").length + 1;
    //     var item_date = $("#add_item_table tbody tr:eq("+t_row+") td:eq(1)").html();
    //     var item_bill_no =$("#add_item_table tbody tr:eq("+t_row+") td:eq(2)").html();
    //     var item_loading = $("#add_item_table tbody tr:eq("+t_row+") td:eq(3)").html();
    //     var item_destin = $("#add_item_table tbody tr:eq("+t_row+") td:eq(4)").html();
    //     var item_weight = $("#add_item_table tbody tr:eq("+t_row+") td:eq(5)").html();
    //     var item_per_ton = $("#add_item_table tbody tr:eq("+t_row+") td:eq(6)").html();
    //     var item_freight = $("#add_item_table tbody tr:eq("+t_row+") td:eq(7)").html();
    //     var item_wht = $("#add_item_table tbody tr:eq("+t_row+") td:eq(8)").html();
    //     var item_comm =$("#add_item_table tbody tr:eq("+t_row+") td:eq(9)").html();
    //     deleteRows += '<tr><td><input class="form-check-input tbl_check" data-label= " '+row_id+'" type="checkbox" value="" id="checkbox"'+tbl_row+'></td><td data-id='+row_id+'>'+item_date+'</td><td data-type='+row_status+'>'+item_bill_no+'</td><td style="text-transform:capitalize">'+item_loading+'</td><td style="text-transform:capitalize">'+item_destin+'</td><td>'+item_weight+'</td><td>'+item_per_ton+'</td><td>'+item_freight+'</td><td>'+item_wht+'</td><td>'+item_comm+'</td></tr>';
    //   }
    //   $("#add_item_table tbody tr").eq(t_row).remove();
    //   const index = selectList.indexOf(parseInt(row_id));
    //   if (index > -1) { 
    //       selectList.splice(index, 1); 
    //   }
    //   var sub_total = 0;
    //   $('#add_item_table tbody tr').each(function(e) {
    //     var t_row_a =  $(this).closest('tr').index();   
    //     var freight_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(7)").html();
    //     sub_total += parseInt(freight_amt);
    //   });
    //   setsubTotal(sub_total);
    //   setinvTotal(sub_total);
    //   settempdeleterows(deleteRows);
    // });

    //   let table;
    //   fetch('https://backend-55jj.onrender.com/get_party_bill_billNo'+'/'+localStorage.getItem('id')).then((res) =>
    //     res.json().then((jsprovdata) => {
    //       setinvoiceNo("PBG" + pad(parseInt(jsprovdata.data), 4));
    //     }
    //   ));

    //    fetch('https://backend-55jj.onrender.com/party_data'+'/'+localStorage.getItem('id')).then((res) =>
    //     res.json().then((data_party) => {
    //     $("#party_bill").empty();
    //     $("#party_bill").append("<option value=''>Select Party</option>");
    //     for (let i = 0; i < data_party.length; i++) {
    //       if(data_party[i].type.toString().trim() == "goods")
    //         {
    //           $("#party_bill").append("<option value='"+data_party[i].id+"' data-phone= '"+data_party[i].phone_number+"' data-contact = "+data_party[i].contact_person+">" + data_party[i].english_name + "</option>");
    //         }
    //       }
    //     }));
      
    //   loadJQueryAndDataTables()
    //     .then(($) => {
    //        window.$ = window.jQuery = $;
    //       fetch('https://backend-55jj.onrender.com/party_bill_data'+'/'+localStorage.getItem('id')).then((res) =>
    //         res.json().then((jsdata) => {
    //          for (let i = 0; i < jsdata.length; i++) {
    //           if(jsdata[i].invoice_type.toString().trim() == "goods")
    //           {
    //             let row = '<tr>';
    //             row += '<td>' + (i +1) + '</td>';
    //             row += '<td style="text-transform:capitalize">' + jsdata[i].invoice_no + '</td>';
    //             row += '<td style="text-transform:capitalize">' + jsdata[i].party_name + '</td>';
    //             row += '<td style="text-transform:capitalize">' +   moment(jsdata[i].invoice_date).format("DD/MM/YYYY") + '</td>';
    //             row += '<td style="text-transform:capitalize" data-label='+jsdata[i].invoice_balance+'>' + jsdata[i].invoice_balance + '</td>';
    //             if(jsdata[i].invoice_status.toString().trim() == "posted")
    //             {
    //               row += '<td style="text-transform:capitalize" data-label='+jsdata[i].invoice_bilties+'><span class="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm">Posted</span></td>';
    //             }
    //             else if(jsdata[i].invoice_status.toString().trim() == "paid")
    //             {
    //               row += '<td style="text-transform:capitalize" data-label='+jsdata[i].invoice_bilties+'><span class="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">Paid</span></td>';
    //             }
    //             row += '<td ><a class="party_bill_view w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"  data-lable='+jsdata[i].id+' ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconamoon" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0"></path><path d="M2 12c1.6-4.097 5.336-7 10-7s8.4 2.903 10 7c-1.6 4.097-5.336 7-10 7s-8.4-2.903-10-7"></path></g></svg></a><a class="party_bill_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="party_bill_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
    //             row += '</tr>';
    //             $("#party_gooods_table tbody").append(row);
    //           }
    //          }
    //          $("#party_gooods_table").DataTable();
    //         }))   
    //     })
    //     .catch((error) => {
    //       console.error("Error loading jQuery or DataTables:", error);
    //     });
  
    //   return () => {
    //     if (table) table.destroy(true);
    //   };
    }, []);

  return (
    <div>
     {/* <div className='card' hidden={listhidden}>
          <div className='card-header d-flex flex-wrap align-items-center justify-content-between gap-3'>
            <div className='d-flex flex-wrap align-items-center gap-3'>
           
            </div>
            <div className='d-flex flex-wrap align-items-center gap-3'>
              <select
                className='form-select form-select-sm w-auto' 
                defaultValue='Select Status' onChange={handleselectOnchange}
              >
                <option value='Select Status' disabled>
                  Select Status
                </option>
                <option value='posted'>Posted</option>
                <option value='paid'>Paid</option>
              </select>
            </div>
          </div>
          <div className='card-body'>
            
          <table className="table bordered-table mb-0" id="party_gooods_table" data-page-length={10}>
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope='col'>Invoice</th>
              <th scope='col'>Name</th>
              <th scope='col'>Issued Date</th>
              <th scope='col'>Amount</th>
              <th scope='col'>Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
          </div>
        </div> */}
        {/* <div className='card' hidden={addhidden}>
          <div className='card-header'>
            <div className='d-flex flex-wrap align-items-center justify-content-end gap-2'>
              <button type='button' className='btn btn-sm btn-neutral-900 radius-8 d-inline-flex align-items-center gap-1' onClick={handleBack} >
                <Icon icon='mingcute:square-arrow-left-line' className='text-xl' />
                Back
              </button>
              <button type='button' className='btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1' onClick={handleSubmit} disabled={!canSubmit}>
                <Icon icon='simple-line-icons:check' className='text-xl' />
                Save
              </button>
            </div>
          </div>
          <div className='card-body py-40'>
            <div className='row justify-content-center' id='invoice'>
              <div className='col-lg-10'>
                <div className='shadow-4 border radius-8'>
                  <div className='p-20 border-bottom'>
                    <div className='row justify-content-between g-3'>
                      <div className='col-sm-4'>
                        <h3 className='text-xl'>Invoice #{invoiceNo}</h3>
                        <p className='mb-1 text-sm'>
                          Date Issued:
                        </p>
                        <DatePicker dateFormat="dd/MM/yyyy" id="date_issue" disabled={issueDateDisable}   className="form-control" selected={issueDate} onChange={date => { setissueDate(date); }}/>
                        <p className='mb-0 text-sm'>
                          Date Due
                        </p>
                        <DatePicker dateFormat="dd/MM/yyyy" id="date_due"  className="form-control" selected={dueDate} onChange={date => { setdueDate(date);}} />
                      </div>
                      <div className='col-sm-4'>
                        <img
                          src='assets/images/logo.png'
                          alt='image_icon'
                          className='mb-8'
                        />
                        <p className='mb-1 text-sm'>
                          4517 Washington Ave. Manchester, Kentucky 39495
                        </p>
                        <p className='mb-0 text-sm'>
                          random@gmail.com, +1 543 2198
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='py-28 px-20'>
                    <div className='d-flex flex-wrap justify-content-between align-items-end gap-3'>
                      <div>
                        <h6 className='text-md'>Issus For:</h6>
                        <table className='text-sm text-secondary-light'>
                          <tbody>
                            <tr>
                              <td>Name:</td>
                              <td className='ps-8'> 
                              <select className="form-select" id="party_bill" disabled={selectDisable}  value={partyid} onChange={handlePartyChange} required> </select>
                              </td>
                            </tr>
                            <tr>
                              <td>Contact Person:</td>
                              <td className='ps-8'>
                                <span className=''>
                                {partyContact} 
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Phone number:</td>
                              <td className='ps-8'>
                                <span className=''>
                                   {partyphone} 
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <table className='text-sm text-secondary-light'>
                          <tbody>
                            <tr>
                              <td>Issus Date</td>
                              <td className='ps-8'>:25 Jan 2024</td>
                            </tr>
                            <tr>
                              <td>Order ID</td>
                              <td className='ps-8'>:#653214</td>
                            </tr>
                            <tr>
                              <td>Shipment ID</td>
                              <td className='ps-8'>:#965215</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className='mt-24'>
                      <div className='table-responsive scroll-sm'>
                        <table className='table bordered-table text-sm' id='add_item_table'>
                          <thead>
                            <tr>
                              <th scope='col' className='text-sm'>
                                SL.
                              </th>
                              <th scope='col' className='text-sm'>
                                Date
                              </th>
                              <th scope='col' className='text-sm'>
                                Bilty No.
                              </th>
                              <th scope='col' className='text-sm'>
                                Loading Points
                              </th>
                              <th scope='col' className='text-sm'>
                                Destination
                              </th>
                              <th scope='col' className='text-sm'>
                                Weight
                              </th>
                              <th scope='col' className='text-sm'>
                                Per/Ton
                              </th>
                              <th scope='col' className='text-sm'>
                                Freight
                              </th>
                              <th scope='col' className='text-sm'>
                                WHT 4%
                              </th>
                              <th scope='col' className='text-sm'>
                                Commission
                              </th>
                              <th scope='col' className='text-center text-sm'>
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <button type='button' id='addRow'  onClick={handleAddItem}  className='btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1'
                        >
                          <Icon icon='simple-line-icons:plus' className='text-xl' />
                          Add New
                        </button>
                      </div>
                      <div className='d-flex flex-wrap justify-content-between gap-3 mt-24'>
                        <div>
                          <p className='text-sm mb-0'>
                            <span className='text-primary-light fw-semibold'>
                              Sales By:
                            </span>{" "}
                            <input type="text" className="form-control"
                value={salesName}
                onChange={(e) => setsalesName(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
               required />
                          </p>
                          
                          <input type="text" className="form-control"
                value={thankMssg}
                onChange={(e) => setthankMssg(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
               required />
                        </div>
                        <div>
                          <table className='text-sm'>
                            <tbody>
                              <tr>
                                <td className='pe-64'>Subtotal:</td>
                                <td className='pe-16'>
                                  <span className='text-primary-light fw-semibold'>
                                  Rs. {subTotal}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className='pe-64 pt-4'>
                                  <span className='text-primary-light fw-semibold'>
                                    Total:
                                  </span>
                                </td>
                                <td className='pe-16 pt-4'>
                                  <span className='text-primary-light fw-semibold'>
                                  Rs. {invTotal}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className='mt-64'>
                      <p className='text-center text-secondary-light text-sm fw-semibold'>
                        Thank you for your purchase!
                      </p>
                    </div>
                    <div className='d-flex flex-wrap justify-content-between align-items-end mt-64'>
                      <div className='text-sm border-top d-inline-block px-12'>
                        Signature of Customer
                      </div>
                      <div className='text-sm border-top d-inline-block px-12'>
                        Signature of Authorized
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
    {/* <div className='card' hidden={viewhidden}>
      <div className='card-header'>
        <div className='d-flex flex-wrap align-items-center justify-content-end gap-2'>
        <button type='button' className='btn btn-sm btn-neutral-900 radius-8 d-inline-flex align-items-center gap-1' onClick={handleBack} >
                <Icon icon='mingcute:square-arrow-left-line' className='text-xl' />
                Back
              </button>
          <Link
            href='#'
            className='btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1'
          >
            <Icon icon='pepicons-pencil:paper-plane' className='text-xl' />
            Send Invoice
          </Link> 

           <button type='button' className='btn btn-sm btn-danger radius-8 d-inline-flex align-items-center gap-1' onClick={handleDownload}>
              <Icon icon='solar:download-linear' className='text-xl' />
              Download
            </button>
        </div>
      </div>
      <div className='card-body py-40' id='view_invoice'>
        <div className='row justify-content-center' id='invoice'>
          <div className='col-lg-10'>
            <div className='shadow-4 border radius-8'>
              <div className='p-20 d-flex flex-wrap justify-content-between gap-3 border-bottom'>
                <div>
                  <h3 className='text-xl'>Invoice #{view_invoice_num}</h3>
                  <p className='mb-1 text-sm'>Date Issued: {view_issue_dt}</p>
                  <p className='mb-0 text-sm'>Date Due: {view_due_date}</p>
                </div>
                <div>
                  <img
                    src='assets/images/logo.png'
                    alt='image_icon'
                    className='mb-8'
                  />
                  <p className='mb-1 text-sm'>
                    4517 Washington Ave. Manchester, Kentucky 39495
                  </p>
                  <p className='mb-0 text-sm'>random@gmail.com, +1 543 2198</p>
                </div>
              </div>
              <div className='py-28 px-20'>
                <div className='d-flex flex-wrap justify-content-between align-items-end gap-3'>
                  <div>
                    <h6 className='text-md'>Issus For:</h6>
                    <table className='text-sm text-secondary-light'>
                      <tbody>
                        <tr>
                          <td>Name</td>
                          <td className='ps-8'>:{view_party_name}</td>
                        </tr>
                        <tr>
                          <td>Contact Person</td>
                          <td className='ps-8'>:{view_party_conatct}</td>
                        </tr>
                        <tr>
                          <td>Phone number</td>
                          <td className='ps-8'>:{view_party_phone}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                  <table className='text-sm text-secondary-light'>
                      <tbody>
                        <tr>
                          <td>Issus Date</td>
                          <td className='ps-8'>:25 Jan 2024</td>
                        </tr>
                        <tr>
                          <td>Order ID</td>
                          <td className='ps-8'>:#653214</td>
                        </tr>
                        <tr>
                          <td>Shipment ID</td>
                          <td className='ps-8'>:#965215</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className='mt-24'>
                  <div className='table-responsive scroll-sm'>
                    <table className='table bordered-table text-sm' id="tbl_view_party">
                    <thead>
                            <tr>
                              <th scope='col' className='text-sm'>
                                SL.
                              </th>
                              <th scope='col' className='text-sm'>
                                Date
                              </th>
                              <th scope='col' className='text-sm'>
                                Bilty No.
                              </th>
                              <th scope='col' className='text-sm'>
                                Loading Points
                              </th>
                              <th scope='col' className='text-sm'>
                                Destination
                              </th>
                              <th scope='col' className='text-sm'>
                                Weight
                              </th>
                              <th scope='col' className='text-sm'>
                                Per/Ton
                              </th>
                              <th scope='col' className='text-sm'>
                                Freight
                              </th>
                              <th scope='col' className='text-sm'>
                                WHT 4%
                              </th>
                              <th scope='col' className='text-sm'>
                                Commission
                              </th>
                            </tr>
                          </thead>
                      <tbody> 
                      </tbody>
                    </table>
                  </div>
                  <div className='d-flex flex-wrap justify-content-between gap-3'>
                    <div>
                      <p className='text-sm mb-0'>
                        <span className='text-primary-light fw-semibold'>
                          Sales By:
                        </span>
                        {view_sales}
                      </p>
                      <p className='text-sm mb-0'>{view_thanks}</p>
                    </div>
                    <div>
                      <table className='text-sm'>
                        <tbody>
                          <tr>
                            <td className='pe-64'>Subtotal:</td>
                            <td className='pe-16'>
                              <span className='text-primary-light fw-semibold'>
                                Rs. {view_subtotal}
                              </span>
                            </td>
                          </tr> 
                          <tr>
                            <td className='pe-64 pt-4'>
                              <span className='text-primary-light fw-semibold'>
                                Total:
                              </span>
                            </td>
                            <td className='pe-16 pt-4'>
                              <span className='text-primary-light fw-semibold'>
                              Rs. {view_total}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className='mt-64'>
                  <p className='text-center text-secondary-light text-sm fw-semibold'>
                    Thank you for your purchase!
                  </p>
                </div>
                <div className='d-flex flex-wrap justify-content-between align-items-end mt-64'>
                  <div className='text-sm border-top d-inline-block px-12'>
                    Signature of Customer
                  </div>
                  <div className='text-sm border-top d-inline-block px-12'>
                    Signature of Authorized
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> */}
    </div>
  );
};

export default PartyGoodsLists;
