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


const NewPartyGoodsLists = () => {

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
  const [selectList, setselectList] = useState();
  const [editMode, seteditMode] = useState();
  const [tempdeleterows, settempdeleterows] = useState("");
  const [rowNo , setrowNo ] = useState(0);

  const [totalComm , settotalComm ] = useState("");
  const [totalWFT , settotalWFT ] = useState("");
  const [totalOthCharges , settotalOthCharges ] = useState("");


  // const canSubmit = $("#add_item_table tbody tr").length > 0 && invoiceParty.length > 0 && salesName.length > 0 && thankMssg.length > 0;


  var deleteRows = '';
  function pad(n, length) {
    var len = length - (''+n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // if(canSubmit)
    // {
    //   fetch('https://backend-55jj.onrender.com/add_party_bill', { 
    //     method: 'POST', 
    //       headers: { 'Content-Type': 'application/json', }, 
    //       body: JSON.stringify({userid:localStorage.getItem('id'), pb_invoiceNo:invoiceNo, pb_issueDate: issueDate, pb_dueDate: dueDate, pb_partyid: partyid, pb_invoiceParty: invoiceParty, pb_salesName: salesName, pb_thankMssg:thankMssg, pb_subTotal: subTotal,pb_select_bilty:selectList.toString().trim(),pb_status:"posted" , pb_type:"goods"})
    //     }).then(res => {
    //         return res.json();
    //     }).then(data => {
    //       location.reload();  
    //   });
    // }
  };
  
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
  //               var other_charge = data[i].other_cahrges.toString().trim().length == 0 ? 0 : data[i].other_cahrges.toString().trim();
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
  //               row += '<td style="text-transform:capitalize">' + other_charge + '</td>';
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
  //                 <th>Other Charges</th>
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
  //               var item_other = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(10)").html();
  //               $("#add_item_table tbody").append('<tr><td>'+tbl_row+'</td><td>'+item_date+'</td><td>'+item_bill_no+'</td><td>'+item_loading+'</td><td>'+item_destin+'</td><td>'+item_weight+'</td><td>'+item_per_ton+'</td><td>'+item_freight+'</td><td>'+item_wht+'</td><td>'+item_comm+'</td><td>'+item_other+'</td><td><button type="button" class="btn_item_dlt remove-row" data-lable='+row_id+'  data-status='+row_status+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic text-danger-main text-xl" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg></button></td></tr>');
  //             });
  //             setselectList(sel_Array);
  //             var sub_total = 0;
  //             var tot_Comm = 0;
  //             var tot_WFT = 0;
  //             var tot_Other = 0;
  //             $('#add_item_table tbody tr').each(function(e) {
  //               var t_row_a =  $(this).closest('tr').index();   
  //               var freight_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(7)").html();
  //               var wft_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(8)").html();
  //               var comm_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(9)").html();
  //               var other_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(10)").html();
  //               sub_total += parseInt(freight_amt);
  //               tot_Comm += parseInt(comm_amt);
  //               tot_WFT += parseInt(wft_amt);
  //               tot_Other += parseInt(other_amt);
  //             });
  //             setsubTotal(sub_total);
  //             settotalWFT(tot_WFT);
  //             settotalComm(tot_Comm);
  //             settotalOthCharges(tot_Other);
  //             setinvTotal(sub_total - (tot_WFT +tot_Comm +  tot_Other));
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

  useEffect(() => {
      // let table;
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
      //     var item_other =$("#add_item_table tbody tr:eq("+t_row+") td:eq(10)").html();
      //     deleteRows += '<tr><td><input class="form-check-input tbl_check" data-label= " '+row_id+'" type="checkbox" value="" id="checkbox"'+tbl_row+'></td><td data-id='+row_id+'>'+item_date+'</td><td data-type='+row_status+'>'+item_bill_no+'</td><td style="text-transform:capitalize">'+item_loading+'</td><td style="text-transform:capitalize">'+item_destin+'</td><td>'+item_weight+'</td><td>'+item_per_ton+'</td><td>'+item_freight+'</td><td>'+item_wht+'</td><td>'+item_comm+'</td><td>'+item_other+'</td></tr>';
      //   }
      //   $("#add_item_table tbody tr").eq(t_row).remove();
      //   const index = selectList.indexOf(parseInt(row_id));
      //   if (index > -1) { 
      //       selectList.splice(index, 1); 
      //   }
      //   var sub_total = 0;
      //   var tot_Comm = 0;
      //   var tot_WFT = 0;
      //   var tot_Other = 0;
      //   $('#add_item_table tbody tr').each(function(e) {
      //     var t_row_a =  $(this).closest('tr').index();   
      //     var freight_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(7)").html();
      //     var wft_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(8)").html();
      //     var comm_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(9)").html();
      //     var other_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(10)").html();
      //     sub_total += parseInt(freight_amt);
      //     tot_Comm += parseInt(comm_amt);
      //     tot_WFT += parseInt(wft_amt);
      //     tot_Other += parseInt(other_amt);
      //   });
      //   setsubTotal(sub_total);
      //   settotalWFT(tot_WFT);
      //   settotalComm(tot_Comm);
      //   settotalOthCharges(tot_Other);
      //   setinvTotal(sub_total - (tot_WFT +tot_Comm +  tot_Other));
      //   settempdeleterows(deleteRows);
      // });

      // var clicked = false;
      // $(document).off('click', '#check_all').on("click", '#check_all', function(e){
      //   e.preventDefault();
      //   $("#AddItemTbl .tbl_check").prop("checked", !clicked);
      //   clicked = !clicked;
      // });
      // fetch('https://backend-55jj.onrender.com/get_party_bill_billNo'+'/'+localStorage.getItem('id')).then((res) =>
      //   res.json().then((jsprovdata) => {
      //     setinvoiceNo("PBG" + pad(parseInt(jsprovdata.data), 4));
      //   }
      // ));

      //  fetch('https://backend-55jj.onrender.com/party_data'+'/'+localStorage.getItem('id')).then((res) =>
      //   res.json().then((data_party) => {
      //   $("#party_bill").empty();
      //   $("#party_bill").append("<option value=''>Select Party</option>");
      //   for (let i = 0; i < data_party.length; i++) {
      //     if(data_party[i].type.toString().trim() == "goods")
      //       {
      //         $("#party_bill").append("<option value='"+data_party[i].id+"' data-phone= '"+data_party[i].phone_number+"' data-contact = "+data_party[i].contact_person+">" + data_party[i].english_name + "</option>");
      //       }
      //     }
      //   }));
      
    }, []);
  
    return (
    <div>
        {/* <div className='card'>
          <div className='card-header'>
            <div className='d-flex flex-wrap align-items-center justify-content-end gap-2'>
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
                        <DatePicker dateFormat="dd/MM/yyyy" id="date_issue" className="form-control" selected={issueDate} onChange={date => { setissueDate(date); }}/>
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
                              <select className="form-select" id="party_bill"  value={partyid} onChange={handlePartyChange} required> </select>
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
                              <th scope='col' className='text-sm'>
                                Other Charges
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
                                <td className='pe-64'>Commission:</td>
                                <td className='pe-16'>
                                  <span className='text-primary-light fw-semibold'>
                                  Rs. {totalComm}
                                  </span>
                                </td>
                              </tr>
                               <tr>
                                <td className='pe-64'>WFT:</td>
                                <td className='pe-16'>
                                  <span className='text-primary-light fw-semibold'>
                                  Rs. {totalWFT}
                                  </span>
                                </td>
                              </tr>
                               <tr>
                                <td className='pe-64'>Other Charges:</td>
                                <td className='pe-16'>
                                  <span className='text-primary-light fw-semibold'>
                                  Rs. {totalOthCharges}
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
    </div>
  );
};


export default NewPartyGoodsLists;