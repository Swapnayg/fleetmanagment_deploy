"use client";
import React, { useState } from "react";
import { useEffect } from "react";
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



const ManifestOilEntryForm = () => {
  const [OBiltyNo, setOBiltyNo] = useState("");
  const [OGBiltyId, setOGBiltyId] = useState(0);
  const [OBiltyDate, setOBiltyDate] = useState(new Date());
  const [OBVehicle, setOBVehicle] = useState("");
  const [O_loading, setO_loading] = useState("");
  const [unO_loading, setunO_loading] = useState("");
  const [O_material, setO_material] = useState("");
  const [O_Bweight, setO_Bweight] = useState("");
  const [O_BPerTon, setO_BPerTon] = useState("");
  const [O_BFreight, setO_BFreight] = useState("0");
  const [O_BWRT4Rate, setO_BWRT4Rate] = useState("0");
  const [O_BCommRate, setO_BCommRate] = useState("0");
  const [O_BWRT4Freight, setO_BWRT4Freight] = useState("0");
  const [O_Bparty, setO_Bparty] = useState("");
  const [O_BComm, setO_BComm] = useState("0");
  const [O_BOtherCharges, setO_BOtherCharges] = useState("");
  const [O_BVehicleFreight, setO_BVehicleFreight] = useState("");
  const [O_BVehicleBal, setO_BVehicleBal] = useState("");
  const [O_BVehicleAdvance, setBCO_BVehicleAdvanceomm] = useState("");
  const [paid_Method, setpaid_Method] = useState("Cash");
  const [Oils_GST, setOils_GST] = useState("");
  const [oilpaidhidden, setoilpaidhidden] = useState(true);
  const [selectDisable, setselectDisable] = useState(false);
  const [issueDateDisable, setissueDateDisable] = useState(false);

  const canSubmit = validateform1();
    
  function validateform1()
  {
    var result = false;
    if(OBiltyNo.toString().length > 0 && OBiltyDate.toString().length >0)
    {
      result = true;
      if(OBVehicle.toString().length > 0 && O_loading.toString().length >0)
      {
        result = true;
        if(unO_loading.toString().length > 0 && O_Bweight.toString().length >0)
        {
          result = true;
          if(O_BPerTon.toString().length > 0 && O_BFreight.toString().length >0)
          {
            result = true;
            if(O_BWRT4Freight.toString().length > 0 && O_Bparty.toString().length >0)
            {
              result = true;
              if(O_BComm.toString().length > 0 && O_BVehicleFreight.toString().length >0  && Oils_GST.toString().length >0 )
              {
                result = true;
                if(O_BWRT4Rate.toString().length > 0 && O_BCommRate.toString().length > 0)
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
      var veh_advance ;
      if(O_BVehicleAdvance.length == 0)
      {
        veh_advance = 0;
      }
      else
      {
        veh_advance = O_BVehicleAdvance;
      }
       if($("#btcnoilsubmit").text().trim() == "Save")
      {
      fetch('https://backend-55jj.onrender.com/add_manifest_oils', { 
        method: 'POST', 
        headers: {   'Accept': 'application/json',
          'Content-Type': 'application/json'  }, 
          body: JSON.stringify({userid:localStorage.getItem('id'), G_OBiltyNo: OBiltyNo, G_OBiltyDate: OBiltyDate, G_OBVehicle :OBVehicle , G_O_loading: O_loading, G_unO_loading: unO_loading,G_O_material: O_material, G_O_Bweight: O_Bweight, G_O_BPerTon :O_BPerTon , G_O_BFreight: O_BFreight, G_O_BWRT4Freight:O_BWRT4Freight, G_O_Bparty: O_Bparty, G_O_BComm : O_BComm, G_O_BOtherCharges: O_BOtherCharges, G_O_BVehicleFreight: O_BVehicleFreight, G_O_BVehicleBal: O_BVehicleBal, G_O_BVehicleAdvance: veh_advance, G_O_Oils_GST:Oils_GST , G_O_paid_Method:paid_Method, per_wft:O_BWRT4Rate, per_comm :O_BCommRate})
        }).then(res => {
            return res.json();
        }).then(data => {
          if(parseInt(data) != 0)
            {
              handleReset();
            }
      }); 
    }
    else if($("#btcnoilsubmit").text().trim() == "Update")
    {
      fetch('https://backend-55jj.onrender.com/update_manifest_oils_setup', { 
        method: 'POST', 
        headers: {   'Accept': 'application/json',
          'Content-Type': 'application/json'  }, 
          body: JSON.stringify({ userid:localStorage.getItem('id'), G_OBiltyId: OGBiltyId,G_OBiltyNo: OBiltyNo, G_OBiltyDate: OBiltyDate, G_OBVehicle :OBVehicle , G_O_loading: O_loading, G_unO_loading: unO_loading,G_O_material: O_material, G_O_Bweight: O_Bweight, G_O_BPerTon :O_BPerTon , G_O_BFreight: O_BFreight, G_O_BWRT4Freight:O_BWRT4Freight, G_O_Bparty: O_Bparty, G_O_BComm : O_BComm, G_O_BOtherCharges: O_BOtherCharges, G_O_BVehicleFreight: O_BVehicleFreight, G_O_BVehicleBal: O_BVehicleBal, G_O_BVehicleAdvance: veh_advance, G_O_Oils_GST:Oils_GST , G_O_paid_Method:paid_Method, per_wft:O_BWRT4Rate, per_comm :O_BCommRate})
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

         function refreshtable()
          {
  
            if ( $.fn.DataTable.isDataTable('#mani_oils_table') ) {
              $('#mani_oils_table').DataTable().destroy();
            }
            $('#mani_oils_table tbody').empty();
            fetch('https://backend-55jj.onrender.com/mainifest_oils_data'+'/'+localStorage.getItem('id')).then((res) =>
              res.json().then((jsdata) => {
               for (let i = 0; i < jsdata.length; i++) {
                let row = '<tr>';
                var data_obj = JSON.stringify(jsdata[i], null, 2);
                row += '<td style="text-transform:capitalize">' + jsdata[i].bilty_no + '</td>';
                row += '<td style="text-transform:capitalize">' +   moment(jsdata[i].b_date).format("DD/MM/YYYY") + '</td>';
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
                row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="manifest_oils_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="manifest_oils_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
                row += '</tr>';
                $("#mani_oils_table tbody").append(row);
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
                    { sWidth: '130px' }
                  ],
              }
               );
              }))
          }
  

  const handleReset = () => {
    location.reload();  
  };

  function handleDecimalsOnValue(value) {
    if(isNaN(value))
    {
      return 0;
    }
    else{
      return parseInt(value)
    }
  }

  function handleChange(e) {
    e.preventDefault();
    setO_Bweight(e.target.value);
    var freight = e.target.value * O_BPerTon ;
    var goodsgst = Oils_GST ? Oils_GST : 1;
    var gstfreight = 0;
    if(goodsgst > 1)
    {
      gstfreight =  ((freight/ 100) * goodsgst);
    }
    var total_freight = gstfreight + freight ;
    setO_BFreight(handleDecimalsOnValue(total_freight ));
    setO_BComm(0);
    setO_BOtherCharges(0);
    setO_BCommRate(0);
    setO_BWRT4Freight(0);
    setO_BWRT4Rate(0);
    setO_BVehicleFreight(total_freight);
    setO_BVehicleBal(total_freight);    
}

function handleChange2(e) {
  e.preventDefault();
    setO_BPerTon(e.target.value);
    var goodsgst = Oils_GST ? Oils_GST : 1;
    var freight = e.target.value * O_Bweight;
    var gstfreight = 0;
    if(goodsgst > 1)
    {
      var gstfreight = ((freight/ 100) * goodsgst);
    }
    var total_freight = gstfreight + freight;
    setO_BFreight(handleDecimalsOnValue(total_freight ));
    setO_BComm(0);
    setO_BOtherCharges(0);
    setO_BCommRate(0);
    setO_BWRT4Freight(0);
    setO_BWRT4Rate(0);
    setO_BVehicleFreight(total_freight);
    setO_BVehicleBal(total_freight);    
}
function handleChange6(e)
{
  e.preventDefault();
  if(e.target.value!= undefined || e.target.value!= null)
    {
      if(parseInt(e.target.value) != 0)
      {
        if(isNaN(handleDecimalsOnValue(e.target.value)))
        {     
          setO_BVehicleBal(O_BVehicleFreight);
          setBCO_BVehicleAdvanceomm("");
          setoilpaidhidden(true);
        }
        else{
          if((O_BVehicleFreight - e.target.value) > 0){
            setO_BVehicleBal(handleDecimalsOnValue(O_BVehicleFreight - e.target.value));
            setBCO_BVehicleAdvanceomm(e.target.value);
            setoilpaidhidden(false);
          }
          else
          {
            setO_BVehicleBal(O_BVehicleFreight);
            setBCO_BVehicleAdvanceomm(0);
            setoilpaidhidden(true);
          }
        }
      }
      else
      {
        setO_BVehicleBal(O_BVehicleFreight);
        setBCO_BVehicleAdvanceomm(0);
        setoilpaidhidden(true);
      }
    }
}
function handleChange5(e)
{
  e.preventDefault();
  setOils_GST(e.target.value);
  var freight = O_Bweight * O_BPerTon;
  var gstfreight = ((freight/ 100) * e.target.value);
  var total_freight = gstfreight + freight;
  setO_BFreight(handleDecimalsOnValue(total_freight ));
  setO_BComm(0);
  setO_BOtherCharges(0);
  setO_BCommRate(0);
  setO_BWRT4Freight(0);
  setO_BWRT4Rate(0);
  setO_BVehicleFreight(total_freight);
  setO_BVehicleBal(total_freight);    
}
function handleChange7(e) {
  e.preventDefault();
  if(e.target.value!= undefined || e.target.value!= null)
  {
    if(isNaN(handleDecimalsOnValue(e.target.value)))
    {       
      setO_BOtherCharges("");
      setO_BVehicleFreight(O_BFreight - O_BComm - O_BWRT4Freight);
      setO_BVehicleBal(O_BFreight - O_BComm - O_BWRT4Freight);
    }
    else{
        setO_BOtherCharges(handleDecimalsOnValue(e.target.value));
        var minus_Amt = O_BFreight - e.target.value - O_BComm - O_BWRT4Freight;
        if((minus_Amt) > 0){
            setO_BVehicleFreight(handleDecimalsOnValue(minus_Amt));
            setO_BVehicleBal(handleDecimalsOnValue(minus_Amt));
        }
        else
        {
          setO_BOtherCharges("");
          setO_BVehicleFreight(O_BFreight - O_BComm - O_BWRT4Freight);
          setO_BVehicleBal(O_BFreight - O_BComm - O_BWRT4Freight);
        }
      }
    }
}
function handleChange8(e) {
  e.preventDefault();
  if(e.target.value!= undefined || e.target.value!= null)
  {
    if(isNaN(handleDecimalsOnValue(e.target.value)))
    {       
      setO_BWRT4Freight("");
      setO_BWRT4Rate(0);
      setO_BCommRate(0);
      setO_BComm(0);
      setO_BVehicleFreight(O_BFreight - O_BOtherCharges);
      setO_BVehicleBal(O_BFreight - O_BOtherCharges);
    }
    else{
      setO_BCommRate(0);
      setO_BComm(0);
      setO_BWRT4Rate(handleDecimalsOnValue(e.target.value));
      var per_val = handleDecimalsOnValue(e.target.value) /100;
      var w4ft_val = handleDecimalsOnValue(per_val * O_BFreight)
      setO_BWRT4Freight(w4ft_val);
      var minus_Amt = O_BFreight - O_BOtherCharges - w4ft_val;
      if((minus_Amt) > 0){
            setO_BVehicleFreight(handleDecimalsOnValue(minus_Amt));
            setO_BVehicleBal(handleDecimalsOnValue(minus_Amt));
      }
      else
      {
        setO_BWRT4Freight("");
        setO_BWRT4Rate(0);
        setO_BCommRate(0);
        setO_BComm(0);
        setO_BVehicleFreight(O_BFreight - O_BOtherCharges);
        setO_BVehicleBal(O_BFreight - O_BOtherCharges);
      }
    }
  }
}

function handleChange4(e) {
  e.preventDefault();
  if(e.target.value!= undefined || e.target.value!= null)
  {
    if(isNaN(handleDecimalsOnValue(e.target.value)))
    {       
      setO_BComm("");
      setO_BCommRate(0);
      setO_BVehicleFreight(O_BFreight - O_BOtherCharges - O_BWRT4Freight);
      setO_BVehicleBal(O_BFreight - O_BOtherCharges - O_BWRT4Freight);
    }
    else{
        setO_BCommRate(handleDecimalsOnValue(e.target.value));
        var per_val = handleDecimalsOnValue(e.target.value) /100;
        var comm_val = handleDecimalsOnValue(per_val * O_BFreight)
        setO_BComm(comm_val);
        var minus_Amt = O_BFreight - comm_val - O_BOtherCharges - O_BWRT4Freight;
        if((minus_Amt) > 0){
            setO_BVehicleFreight(handleDecimalsOnValue(minus_Amt));
            setO_BVehicleBal(handleDecimalsOnValue(minus_Amt));
        }
        else
        {
          setO_BComm("");
          setO_BCommRate(0);
          setO_BVehicleFreight(O_BFreight - O_BOtherCharges - O_BWRT4Freight);
          setO_BVehicleBal(O_BFreight - O_BOtherCharges - O_BWRT4Freight);
        }
      }
    }
  }
      function pad(n, length) {
        var len = length - (''+n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
      }
  useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
      $(document).off('click', '.manifest_oils_edit').on("click", '.manifest_oils_edit', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        var t_row =  $(this).closest('tr').index();
        var array_list =  JSON.parse($("#mani_oils_table tbody tr:eq("+t_row+") td:eq(13)").find('span').text());
        setOBiltyNo(array_list.bilty_no.toString().trim());
        setOGBiltyId(array_list.id.toString().trim());
        const my_date = new Date(array_list.b_date.toString().trim());
        setOBiltyDate(my_date);
        setOBVehicle(array_list.vehicle.toString().trim());
        setO_loading(array_list.loading_point.toString().trim());
        setunO_loading(array_list.unloading_point.toString().trim());
        setO_material(array_list.material.toString().trim());
        setO_Bweight(array_list.quantity.toString().trim());
        setO_BPerTon(array_list.per_ton.toString().trim());
        setO_BFreight(array_list.freight.toString().trim());
        setO_BWRT4Rate(array_list.tax_per.toString().trim());
        setO_BCommRate(array_list.comm_per.toString().trim());
        setO_BWRT4Freight(array_list.wrt_4_per_freight.toString().trim());
        setO_Bparty(array_list.parties.toString().trim());
        setO_BComm(array_list.commission.toString().trim());
        setO_BOtherCharges(array_list.other_cahrges.toString().trim());
        setO_BVehicleFreight(array_list.vehicle_freight.toString().trim());
        setO_BVehicleBal(array_list.vehicle_balance.toString().trim());
        setBCO_BVehicleAdvanceomm(array_list.advance_to_vehicle.toString().trim());
        setpaid_Method(array_list.paid_by.toString().trim());
        setOils_GST(array_list.oils_gst.toString().trim());
        setselectDisable(true);
        setissueDateDisable(true);
        $("#btcnoilsubmit").text("Update");
      });

      $(document).off('click', '.manifest_oils_delete').on("click", '.manifest_oils_delete', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        setOGBiltyId(row_id);
        fetch('https://backend-55jj.onrender.com/manifest_oils_delete/'+row_id+'/'+localStorage.getItem('id'), { 
          method: 'DELETE', 
          headers: { 'Content-Type': 'application/json', }, 
          body: JSON.stringify({})
        }).then(res => {
          return res.json();
        }).then(data => {
          if(data.data.toString() == "deleted")
          {
            location.reload();  
          }
      });
      });

      fetch('https://backend-55jj.onrender.com/get_oil_billNo' +'/'+localStorage.getItem('id') ).then((res) =>
        res.json().then((jsprovdata) => {
        setOBiltyNo("OIL_" + pad(parseInt(jsprovdata.data), 3) );
      }
    ));
    fetch('https://backend-55jj.onrender.com/party_data' +'/'+localStorage.getItem('id') ).then((res) =>
      res.json().then((data_party) => {
        $("#oils_party_1").empty();
        $("#oils_party_1").append("<option value=''>Select Party</option>");
        for (let i = 0; i < data_party.length; i++) {
          if(data_party[i].type.toString().trim() == "oil")
            {
              $("#oils_party_1").append("<option value=\"" + data_party[i].id  + "\">" + data_party[i].english_name + "</option>");
            }
        }
    }));
    fetch('https://backend-55jj.onrender.com/vehicle_data' +'/'+localStorage.getItem('id')).then((res) =>
      res.json().then((data_vehicle) => {
        $("#oils_vehicle").empty();
        $("#oils_vehicle").append("<option value=''>Select Vehicle</option>");
        for (let i = 0; i < data_vehicle.length; i++) {
          if(data_vehicle[i].veh_type.toString().trim() == "oil")
          {
            $("#oils_vehicle").append("<option value=\"" + data_vehicle[i].id  + "\">" + data_vehicle[i].vehicle_num + "</option>");
          }
      }
    }));
    let table;
    loadJQueryAndDataTables()
      .then(($) => {
       window.$ = window.jQuery = $;
      fetch('https://backend-55jj.onrender.com/mainifest_oils_data'+'/'+localStorage.getItem('id')).then((res) =>
        res.json().then((jsdata) => {
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
            row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="manifest_oils_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="manifest_oils_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
            row += '</tr>';
            $("#mani_oils_table tbody").append(row);
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
            { sWidth: '130px' }
          ],
          }
        );
      }))
    }).catch((error) => {
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
    <div className="col-lg-12">
    <div className="card">
    <div className="card-header d-flex justify-content-between align-items-center">
    <h5 className="card-title mb-0">Bilty(Oils) Entry</h5>
   
  </div>
  <div className="card-body">
  <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
  <div className="col-md-2">
        <label className="form-label">Bilty No *</label>
        <input type="text" className="form-control" 
                value={OBiltyNo}
                onChange={(e) => setOBiltyNo(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
               required readOnly/>
      </div>
      <div className="col-md-2">
        <label className="form-label">Date *</label>
        {/* <input type="date" className="form-control" 
                value={OBiltyDate}
                onChange={(e) => setOBiltyDate(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
              required /> */}

        <DatePicker dateFormat="dd/MM/yyyy" disabled={issueDateDisable} className="form-control" selected={OBiltyDate} onChange={date => {setOBiltyDate(date);}}/>
      </div>
      <div className="col-md-2">
        <label className="form-label">Vehicle *</label>
        <select className="form-select" id="oils_vehicle"
               value={OBVehicle}
               onChange={(e) => setOBVehicle(e.target.value)}
               onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
               required>
              </select>
      </div>
      <div className="col-md-3">
        <label className="form-label">Loading Points *</label>
        <input type="text" className="form-control"
                value={O_loading}
                onChange={(e) => setO_loading(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
               required />
      </div>
      <div className="col-md-3">
        <label className="form-label">Un-Loading Points *</label>
        <input type="text" className="form-control" 
                value={unO_loading}
                onChange={(e) => setunO_loading(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
              required />
      </div>

      <div className="col-md-3">
        <label className="form-label">Parties *</label>
        <select className="form-select" id="oils_party_1" disabled={selectDisable} value={O_Bparty}  onChange={(e) => setO_Bparty(e.target.value)} onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}} required></select>
      </div>

    
      <div className="col-md-3">
              <label className="form-label">Material *</label>
              <input type="text" className="form-control"
                value={O_material}
                onChange={(e) => setO_material(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
               required />
            </div>
      <div className="col-md-2">
            <label className="form-label">Weight (kg)</label>
            <input type="number" className="form-control"
                    value={O_Bweight}
                    onChange={handleChange}
                   required />
          </div>

          <div className="col-md-2">
            <label className="form-label">Per/Ton</label>
            <input type="number" className="form-control"
                    value={O_BPerTon}
                    onChange= {handleChange2}
                    onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                   required />
          </div>

          <div className="col-md-2" >
        <label className="form-label">Tax Rate(%)</label>
        <input type="number" className="form-control" id="input_gst"
              value={Oils_GST}
              onChange= {handleChange5}
              onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
             required />
      </div>

          <div className="col-md-2">
        <label className="form-label">Freight Amount(Rs)</label>
        <input type="number" className="form-control"
               value= {O_BFreight}
               onChange={(e) => setO_BFreight(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
               required readOnly/>
      </div>
      <div className="col-md-2">
        <label className="form-label">WHT (%)</label>
        <input type="number" className="form-control" pattern='d\+\.\d\d$'
          value={O_BWRT4Rate}
          onChange={handleChange8}
          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
          required/>
      </div>
      <div className="col-md-2">
        <label className="form-label">WHT Amt(Rs)</label>
        <input type="number" className="form-control"
                value={O_BWRT4Freight}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required readOnly/>
      </div>
      <div className="col-md-2">
        <label className="form-label">Comm(%)</label>
        <input type="number" className="form-control" pattern='d\+\.\d\d$'
          value={O_BCommRate}
          onChange={handleChange4}
          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
          required/>
      </div>
      <div className="col-md-2">
        <label className="form-label">Commission Amount(Rs)</label>
        <input type="number" className="form-control"
                value={O_BComm} 
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
               required readOnly/>
      </div>
      <div className="col-md-2">
        <label className="form-label">Other Charges(Rs)*</label>
        <input type="number" className="form-control" 
                value={O_BOtherCharges}
                onChange={handleChange7}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
              required />
      </div>
      <div className="col-md-2">
        <label className="form-label">Vehicle Freight (Rs) *</label>
        <input type="number" className="form-control" 
                value={O_BVehicleFreight}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
               required readOnly />
      </div>
      <div className="col-md-2">
        <label className="form-label">Advance To Vehicle (Rs)</label>
        <input type="number" className="form-control" 
                value={O_BVehicleAdvance}
                onChange={handleChange6}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}} 
              required/>
      </div>

      <div className="col-md-3" hidden={oilpaidhidden}>
              <label className="form-label">Paid By *</label>
              <select 
                className="form-select"
                value={paid_Method}
                onChange={(e) => setpaid_Method(e.target.value)}
                required
              >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="Bank">Cheque</option>
                    <option value="Digital Wallet">Digital Wallet</option>
              </select>
            </div>
      <div className="col-md-2">
        <label className="form-label">Vehicle Balance (Rs)</label>
        <input type="number" className="form-control" 
                value={O_BVehicleBal}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}} 
               required readOnly/>
      </div>
      <div className="col-12 mt-3 d-flex gap-2">
        <button className="btn btn-primary" id="btcnoilsubmit" onClick={handleSubmit} disabled={!canSubmit}>
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
        <h5 className="card-title mb-0">Manifest Oils List</h5>
      </div>
      <div className="card-body">
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
              <th scope="col">4% Freight(Rs)</th>
              <th scope="col">Commisson (Rs)</th>
              <th scope="col">Vehicle F(Rs)</th>
              <th scope="col">Vehicle A(Rs)</th>
              <th scope="col">Status</th>
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

export default ManifestOilEntryForm;