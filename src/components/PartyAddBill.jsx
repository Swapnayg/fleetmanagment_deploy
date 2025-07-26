"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import $ from 'jquery'; 
import { Icon } from "@iconify/react/dist/iconify.js";
import { validate } from "uuid";
import moment from 'moment'
const loadJQueryAndDataTables = async () => {
  const $ = (await import("jquery")).default;
  await import("datatables.net-dt/js/dataTables.dataTables.js");
  return $;
};

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const PartyAddBill = () => {
    const [BiltyNo, setBiltyNo] = useState("");
    const [GBiltyId, setGBiltyId] = useState(0);
    const [BiltyDate, setBiltyDate] = useState(new Date());
    const [loading, setloading] = useState("");
    const [unloading, setunloading] = useState("");
    const [Bweight, setBweight] = useState("");
    const [BPerTon, setBPerTon] = useState("");
    const [BFreight, setBFreight] = useState("0");
    const [BWRT4Freight, setBWRT4Freight] = useState("0");
    const [Bparty, setBparty] = useState("");
    const [BComm, setBComm] = useState("0");
    const [BOtherCharges, setBOtherCharges] = useState("");
    const [BMaterial, setBMaterial] = useState("");
    const [BGoods_Oil, setBGoods_Oil] = useState("");
    const [paid_Method, setpaid_Method] = useState("");
    var [party_GST, setparty_GST] = useState("");
    const [hidden, setHidden] = useState(true);

    const canSubmit = validateform();
    
      function validateform()
      {
        var result = false;
        if(BiltyNo.toString().length > 0 && BiltyDate.toString().length >0)
        {
          result = true;
          if(unloading.length > 0 && loading.length >0)
          {
            result = true;
            if(BPerTon.length > 0 && Bweight.length >0)
            {
              result = true;
              if(BWRT4Freight.toString().length > 0 && BFreight.toString().length >0)
              {
                result = true;
                if(BComm.toString().length > 0 && Bparty.toString().length >0)
                {
                  result = true;
                  if(BOtherCharges.toString().length >0 )
                  {
                    result = true;
                  }
                  else
                  {
                    result = false;
                  }
                }
                else
                {
                  result = false;
                }
              }
              else{
                result = false;
              }
            }
            else{
              result = false;
            }
          }
          else{
            result = false;
          }
        }
        else
        {
          result = false;
        }
        return result;
      }

      const handleSubmit = (e) => {
        e.preventDefault();
        if(canSubmit)
        {
        if($("#btnpartybillsubmit").text().trim() == "Save")
          {
          fetch('https://backend-55jj.onrender.com/add_party_bill', { 
            method: 'POST', 
            headers: {   'Accept': 'application/json',
              'Content-Type': 'application/json'  }, 
              body: JSON.stringify({ G_BiltyNo: BiltyNo, G_BiltyDate: BiltyDate , G_loading: loading, G_unloading: unloading, G_Bweight: Bweight, G_BPerTon :BPerTon , G_BFreight: BFreight, G_BWRT4Freight:BWRT4Freight, G_Bparty: Bparty, G_BComm : BComm, G_BOtherCharges: BOtherCharges, G_BGoods_Oil:BGoods_Oil, G_BMaterial: BMaterial, userid:localStorage.getItem('id')})
            }).then(res => {
                return res.json();
            }).then(data => {
              if(parseInt(data) != 0)
              {
                handleReset();
              }
          }); 
        }
        else if($("#btnpartybillsubmit").text().trim() == "Update")
        {
          fetch('https://backend-55jj.onrender.com/update_party_bill', { 
            method: 'POST', 
            headers: {   'Accept': 'application/json',
              'Content-Type': 'application/json'  }, 
              body: JSON.stringify({ G_BiltyId:GBiltyId,G_BiltyNo: BiltyNo, G_BiltyDate: BiltyDate , G_loading: loading, G_unloading: unloading, G_Bweight: Bweight, G_BPerTon :BPerTon , G_BFreight: BFreight, G_BWRT4Freight:BWRT4Freight, G_Bparty: Bparty, G_BComm : BComm, G_BOtherCharges: BOtherCharges, G_BGoods_Oil:BGoods_Oil, G_BMaterial: BMaterial, userid:localStorage.getItem('id')})
            }).then(res => {
                return res.json();
            }).then(data => {
              if(parseInt(data) != 0)
              {
                handleReset();
              }
          }); 
        }
        }
      }

      const handleReset = () => {
        location.reload();  
      };

      function pad(n, length) {
        var len = length - (''+n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
      }

       function refreshtable()
        {

          if ( $.fn.DataTable.isDataTable('#party_bill_table') ) {
            $('#party_bill_table').DataTable().destroy();
          }
          $('#party_bill_table tbody').empty();
          fetch("https://backend-55jj.onrender.com/party_bill_data/" + localStorage.getItem('id')).then((res) =>
            res.json().then((jsdata) => {
             for (let i = 0; i < jsdata.length; i++) {
              let row = '<tr>';
              var data_obj = JSON.stringify(jsdata[i], null, 2);
              row += '<td style="text-transform:capitalize">' + jsdata[i].bilty_no + '</td>';
              row += '<td style="text-transform:capitalize">' +   moment(jsdata[i].b_date).format("DD/MM/YYYY") + '</td>';
              row += '<td style="text-transform:capitalize" data-type='+jsdata[i].party_party_name+'>' +  jsdata[i].party_party_name+ '</td>';
              row += '<td style="text-transform:capitalize" data-type='+jsdata[i].party_party_type+'>' +  jsdata[i].party_party_type+ '</td>';
              row += '<td>' + jsdata[i].weight + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].per_ton + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].freight + '</td>';
              row += '<td data-type='+jsdata[i].wrt_4_per_freight+'>' + jsdata[i].wrt_4_per_freight + '</td>';
              row += '<td>' + jsdata[i].commission + '</td>';
              row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="party_bill_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="party_bill_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
              row += '</tr>';
              $("#party_bill_table tbody").append(row);
             }
             $("#party_bill_table").DataTable();
            }))
        }
  useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
      fetch('https://backend-55jj.onrender.com/get_party_bill_billNo'+'/'+localStorage.getItem('id')).then((res) =>
      res.json().then((jsprovdata) => {
        setBiltyNo("PT_" +pad(parseInt(jsprovdata.data), 3) );
      }
      ));
      $(document).off('click', '.party_bill_edit').on("click", '.party_bill_edit', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        var t_row =  $(this).closest('tr').index();
        var array_list =  JSON.parse($("#party_bill_table tbody tr:eq("+t_row+") td:eq(9)").find('span').text());
        setBiltyNo(array_list.bilty_no.toString().trim());
        setGBiltyId(array_list.id.toString().trim());
        const my_date = new Date(array_list.b_date.toString().trim());
        setBiltyDate(my_date);
        setloading(array_list.loading_point.toString().trim());
        setunloading(array_list.unloading_point.toString().trim());
        setBweight(array_list.weight.toString().trim());
        setBPerTon(array_list.per_ton.toString().trim());
        setBFreight(array_list.freight.toString().trim());
        setBWRT4Freight(array_list.wrt_4_per_freight.toString().trim());
        setBparty(array_list.parties.toString().trim());
        setBComm(array_list.commission.toString().trim());
        setBOtherCharges(array_list.other_cahrges.toString().trim());
        setBMaterial(array_list.material.toString().trim());
        setBGoods_Oil(array_list.party_party_type.toString().trim());

        $("#btnpartybillsubmit").text("Update");
      });

      $(document).off('click', '.party_bill_delete').on("click", '.party_bill_delete', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        setGBiltyId(row_id);
        fetch('https://backend-55jj.onrender.com/party_bills_delete/'+row_id +'/'+localStorage.getItem('id'), { 
          method: 'DELETE', 
          headers: { 'Content-Type': 'application/json', }, 
          body: JSON.stringify({})
        }).then(res => {
          return res.json();
        }).then(data => {
          if(data.data.toString() == "deleted")
          {
              refreshtable();
          }
        });
      });
      fetch('https://backend-55jj.onrender.com/party_data'+'/'+localStorage.getItem('id')).then((res) =>
        res.json().then((data_party) => {
          $("#bill_party_1").empty();
          $("#bill_party_1").append("<option value=''>Select Party</option>");
          for (let i = 0; i < data_party.length; i++) {
            $("#bill_party_1").append("<option value=" + data_party[i].id  + " data_label=" + data_party[i].type  + ">" + data_party[i].english_name + "</option>");
          }
      }));
       
      let table;
      loadJQueryAndDataTables()
        .then(($) => {
           window.$ = window.jQuery = $;
          fetch('https://backend-55jj.onrender.com/party_bill_data'+'/'+localStorage.getItem('id')).then((res) =>
            res.json().then((jsdata) => {
            for (let i = 0; i < jsdata.length; i++) {
              let row = '<tr>';
              var data_obj = JSON.stringify(jsdata[i], null, 2);
              row += '<td style="text-transform:capitalize">' + jsdata[i].bilty_no + '</td>';
              row += '<td style="text-transform:capitalize">' +   moment(jsdata[i].b_date).format("DD/MM/YYYY") + '</td>';
              row += '<td style="text-transform:capitalize" data-type='+jsdata[i].party_party_name+'>' +  jsdata[i].party_party_name+ '</td>';
              row += '<td style="text-transform:capitalize" data-type='+jsdata[i].party_party_type+'>' +  jsdata[i].party_party_type+ '</td>';
              row += '<td>' + jsdata[i].weight + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].per_ton + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].freight + '</td>';
              row += '<td data-type='+jsdata[i].wrt_4_per_freight+'>' + jsdata[i].wrt_4_per_freight + '</td>';
              row += '<td>' + jsdata[i].commission + '</td>';
              row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="party_bill_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="party_bill_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
              row += '</tr>';
              $("#party_bill_table tbody").append(row);
            }
            $("#party_bill_table").DataTable();
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
  
  function handleDecimalsOnValue(value) {
    const regex = /([0-9]*[\.|\,]{0,1}[0-9]{0,2})/s;
    return value.toString().match(regex)[0];
  }
  function handleChange(e) {
    e.preventDefault();
    setBweight(e.target.value);
    setBFreight(e.target.value * BPerTon);
    var freight = e.target.value * BPerTon ;
    var partygst = party_GST ? party_GST : 1;
    var gstfreight = 0;
    if(partygst > 1)
    {
      gstfreight = parseFloat((freight/ 100) * partygst).toFixed(2);
    }
    var total_freight = gstfreight + freight;
    setBFreight(handleDecimalsOnValue(total_freight));
    setBWRT4Freight(handleDecimalsOnValue((total_freight/ 100) * 4));
}
function handleChange3(e)
{
  e.preventDefault();
  setparty_GST(e.target.value);
  var freight = Bweight * BPerTon;
  var gstfreight = parseFloat((freight/ 100) * e.target.value).toFixed(2);
  var total_freight = gstfreight + freight;
  setBFreight(handleDecimalsOnValue(total_freight));
  setBWRT4Freight(handleDecimalsOnValue((total_freight/ 100) * 4));
}

function handleChange2(e) {
  e.preventDefault();
  setBPerTon(e.target.value);
  var partygst = party_GST ? party_GST : 1;
  var freight = e.target.value * Bweight;
  var gstfreight = 0;
  if(partygst > 1)
  {
    var gstfreight =  parseFloat((freight/ 100) * partygst).toFixed(2);
  }
  var total_freight = gstfreight + freight;
  setBFreight(handleDecimalsOnValue(total_freight));
  setBWRT4Freight(handleDecimalsOnValue((total_freight/ 100) * 4));
}


function handleChange5(e) {
  setBparty(e.target.value);
  var index = e.target.selectedIndex;
  var optionElement = e.target.childNodes[index]
  var option =  optionElement.getAttribute('data_label');
  setBGoods_Oil(option.toString().trim());
  if(option.toString().trim() == "oil")
  {
    setHidden(false);
  }
  else
  {
    setHidden(true);
  }
}
function handleChange4(e) {
e.preventDefault();
setBComm(e.target.value);
}
  return (
    <div>
    <div className="col-lg-12">
    <div className="card">
    <div className="card-header d-flex justify-content-between align-items-center">
    <h5 className="card-title mb-0">Party Bill Entry</h5>
   
  </div>
  <div className="card-body">
  <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
  <div className="col-md-2">
        <label className="form-label">Bilty No *</label>
        <input type="text" className="form-control" 
          value={BiltyNo}
          onChange={(e) => setBiltyNo(e.target.value)}
          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
         required readOnly/>
      </div>
      <div className="col-md-2">
        <label className="form-label">Date *</label>

         <DatePicker
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        selected={BiltyDate}
                        onChange={date => {
                          setBiltyDate(date);
                        }}
                    />
      </div>

      <div className="col-md-3">
        <label className="form-label">Loading Points *</label>
        <input type="text" className="form-control"
          value={loading}
          onChange={(e) => setloading(e.target.value)}
          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
         required />
      </div>
      <div className="col-md-3">
        <label className="form-label">Un-Loading Points *</label>
        <input type="text" className="form-control" 
          value={unloading}
          onChange={(e) => setunloading(e.target.value)}
          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
        required />
      </div>

      <div className="col-md-3">
        <label className="form-label">Parties *</label>

        <select className="form-select" id="bill_party_1" 
          value={Bparty}
          onChange={handleChange5}
        required>
        </select>
      </div>

      <div className="col-md-3">
              <label className="form-label">Paid By *</label>
              <select 
                className="form-select"
                value={paid_Method}
                onChange={(e) => setpaid_Method(e.target.value)}
                required
              >
                    <option value="">Select Account</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="Bank">Cheque</option>
                    <option value="Digital Wallet">Digital Wallet</option>
              </select>
            </div>

      <div className="col-md-3" hidden={hidden}>
              <label className="form-label">Material *</label>
              <input type="text" className="form-control"
                value={BMaterial}
                onChange={(e) => setBMaterial(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
               required />
            </div>
      <div className="col-md-2">
            <label className="form-label">Weight (kg)</label>
            <input type="number" className="form-control"
              value={Bweight}
              onChange={handleChange}
             required />
          </div>

          <div className="col-md-2">
            <label className="form-label">Per/Ton</label>
            <input type="number" className="form-control"
              value={BPerTon}
              onChange= {handleChange2}
              onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
             required />
          </div>
          <div className="col-md-2">
        <label className="form-label">Tax Rate(%)</label>
        <input type="number" className="form-control" id="input_gst"
              value={party_GST}
              onChange= {handleChange3}
              onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
             required />
      </div>
          <div className="col-md-2">
        <label className="form-label">Freight Amount(Rs)</label>
        <input type="number" className="form-control"
         value= {BFreight}
         onChange={(e) => setBFreight(e.target.value)}
          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
         required readOnly/>
      </div>
      <div className="col-md-2">
        <label className="form-label">WHT 4% Amount(Rs)</label>
        <input type="number" className="form-control"
          value={BWRT4Freight}
          onChange={(e) => setBWRT4Freight(e.target.value)}
          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
          required readOnly/>
      </div>
      <div className="col-md-2">
        <label className="form-label">Commisson Amount(Rs)</label>
        <input type="number" className="form-control"
          value={BComm} 
          onChange={handleChange4}
          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
         required/>
      </div>
      <div className="col-md-2">
        <label className="form-label">Other Charges(Rs)*</label>
        <input type="number" className="form-control" 
          value={BOtherCharges}
          onChange={(e) => setBOtherCharges(e.target.value)}
          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
        required />
      </div>
      <div className="col-12 mt-3 d-flex gap-2">
        <button className="btn btn-primary" id="btnpartybillsubmit" onClick={handleSubmit} disabled={!canSubmit}>
          <Icon icon="mdi:content-save" className="me-1" /> Save
        </button>
        <button className="btn btn-secondary" province="button" onClick={handleReset}>
            <Icon icon="mdi:refresh" className="me-1" /> Reset
        </button>
      </div>
  </form>
  </div>
    </div>
    </div>
    <div className="card basic-data-table">
      <div className="card-header">
        <h5 className="card-title mb-0">Manifest Goods List</h5>
      </div>
      <div className="card-body">
        <table
          className="table bordered-table mb-0"
          id="party_bill_table"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope="col">BillNo</th>
              <th scope="col">Date</th>
              <th scope="col">Party</th>
              <th scope="col">Type</th>
              <th scope="col">Weight (kg)</th>
              <th scope="col">Per/Ton</th>
              <th scope="col">Freight Amount(Rs)</th>
              <th scope="col">WHT 4% Amount(Rs)</th>
              <th scope="col">Commisson Amount(Rs)</th>
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

export default PartyAddBill;