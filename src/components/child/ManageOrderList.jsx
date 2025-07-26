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
import moment from 'moment';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManageOrderList = () => {

  const [orderId, setId] = useState(0);
  const [payment_due, setpayment_due] = useState("receipt");
  const [update_stk, setupdate_stk] = useState(false);
  const [OInvoiceNo, setOInvoiceNo] = useState("");

  const [ORefNo, setORefNo] = useState("");
  const [Warehouse, setWarehouse] = useState("");
  const [WarehouseName, setWarehouseName] = useState("");
  const [OInvDate, setOInvDate] = useState();
  const [OInvDueDate, setOInvDueDate] = useState(new Date());
  const [OInvTax, setOInvTax] = useState("on");
  const [OInvDisc, setOInvDisc] = useState("pdat");
  const [OInvNote, setOInvNote] = useState("");

  const [OInvTotax, setOInvTotax] = useState(0);
  const [OInvDist, setOInvDist] = useState(0);
  const [OInvShipp, setOInvShipp] = useState(0);
  const [OInvGrnTotal, setOInvGrnTotal] = useState(0);
  const [OInvTotal, setOInvTotal] = useState(0);
  
  const [supplhidden, setsupplhidden] = useState(true);
  const [supplName, setsupplName] = useState("");
  const [supplAddss, setsupplAddss] = useState("");
  const [supplCity, setsupplCity] = useState("");
  const [supplCountry, setsupplCountry] = useState("");
  const [supplPhone, setsupplPhone] = useState("");
  const [supplEmail, setsupplEmail] = useState("");
  const [rowNo, setrowNo] = useState(0); 
  const [selectList, setselectList] = useState();


  const [viewhidden, setviewhidden] = useState(true);
  const [edithidden, setedithidden] = useState(true);
  const [listhidden, setlisthidden] = useState(false);

  const [v_Inv_Id, setv_Inv_Id] = useState(0);
  const [v_Inv_Num, setv_Inv_Num] = useState("");
  const [v_Inv_Date, setv_Inv_Date] = useState("");
  const [v_Inv_Due_Dt, setv_Inv_Due_Dt] = useState("");
  const [v_Inv_Ref, setv_Inv_Ref] = useState("");
  const [v_Inv_Term, setv_Inv_Term] = useState("");
  const [v_Inv_Shipp, setv_Inv_Shipp] = useState("");
  const [v_Inv_Cus_Name, setv_Inv_Cus_Name] = useState("");
  const [v_Inv_Cus_Addrs, setv_Inv_Cus_Addrs] = useState("");
  const [v_Inv_Cus_Cnty, setv_Inv_Cus_Cnty] = useState("");
  const [v_Inv_Cus_City, setv_Inv_Cus_City] = useState("");
  const [v_Inv_Cus_Phone, setv_Inv_Cus_Phone] = useState("");
  const [v_Inv_Cus_Email, setv_Inv_Cus_Email] = useState("");
  const [v_Inv_SubTotal, setv_Inv_SubTotal] = useState("");
  const [v_Inv_TotalTax, setv_Inv_TotalTax] = useState("");
  const [v_Inv_TotalDisc, setv_Inv_TotalDisc] = useState("");
  const [v_Inv_Total, setv_Inv_Total] = useState("");

  function numberWithCommas(x) {
    return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
  }

  function refreshtable()
  {
    if ( $.fn.DataTable.isDataTable('#order_table') ) {
      $('#order_table').DataTable().destroy();
    }
    $('#order_table tbody').empty();
    fetch('https://backend-55jj.onrender.com/inv_order_data'+'/'+localStorage.getItem('id')).then((res) =>
      res.json().then((jsdata) => {
       for (let i = 0; i < jsdata.length; i++) {
        let row = '<tr>';
        row += '<td>' + (i +1) + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].order_num + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].supplier_name + '</td>';
        row += '<td style="text-transform:capitalize">' + moment(jsdata[i].order_date).format("DD/MM/YYYY") + '</td>';
        row += '<td style="text-transform:capitalize">' + "Rs. "+numberWithCommas(jsdata[i].grand_total) + '</td>';
        if(jsdata[i].order_status.toString().trim() == "partial")
        {
          row += '<td style="text-transform:capitalize;"><span class="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm" style="font-size: 12px !important;">Partial</span></td>';
        }
        else if(jsdata[i].order_status.toString().trim() == "paid")
        {
          row += '<td style="text-transform:capitalize;"><span class="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm" style="font-size: 12px !important;">Paid</span></td>';
        }
        else if(jsdata[i].order_status.toString().trim() == "pending")
        {
          row += '<td style="text-transform:capitalize;"><span class="bg-danger-focus text-danger-main px-24 py-4 rounded-pill fw-medium text-sm" style="font-size: 12px !important;">'+jsdata[i].order_status.toString().trim()+'</span></td>';
        }
        row += '<td ><a class="order_view w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"  data-lable='+jsdata[i].id+' ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--hugeicons menu-icon" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M21.544 11.045c.304.426.456.64.456.955c0 .316-.152.529-.456.955C20.178 14.871 16.689 19 12 19c-4.69 0-8.178-4.13-9.544-6.045C2.152 12.529 2 12.315 2 12c0-.316.152-.529.456-.955C3.822 9.129 7.311 5 12 5c4.69 0 8.178 4.13 9.544 6.045"></path><path d="M15 12a3 3 0 1 0-6 0a3 3 0 0 0 6 0"></path></g></svg></a><a class="order_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="order_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
        row += '</tr>';
        $("#order_table tbody").append(row);
       }
       $("#order_table").DataTable();
      }))
    
  }
  
  useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
      $(document).off('click', '.btn_item_dlt').on("click", '.btn_item_dlt', function(e){
        e.preventDefault();
        var t_row =  $(this).closest('tr').index();
        var row_id = $(this).attr("data-lable");
        var row_ind = $(this).attr("data-number");
        $("#add_item_table tbody tr").eq(t_row).remove();
        $("#add_item_table").find("[data-index='" + row_ind + "']").remove();
        const index = selectList.indexOf(parseInt(row_id));
        if (index > -1) { 
            selectList.splice(index, 1); 
        }
        var totalTax = 0.00;
        var totalDis = 0.00;
        var totalAmt = 0.00;
        $('#add_item_table tbody tr.main_row').each(function(e) {
          var t_row_a =  $(this).closest('tr').index();   
          var tax_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(5)").html();
          var dis_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(7)").html();
          var total_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(8)").html();
          totalTax += parseFloat(tax_amt);
          totalDis += parseFloat(dis_amt);
          totalAmt += parseFloat(total_amt);
        });
        setOInvTotax(parseFloat(totalTax).toFixed(2));
        setOInvDist(parseFloat(totalDis).toFixed(2));
        setOInvGrnTotal(parseFloat(parseFloat(totalAmt)  + parseFloat(OInvShipp)).toFixed(2));
        setOInvTotal(parseFloat(totalAmt));
      });

      $(document).off('click', '.order_edit').on("click", '.order_edit', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        setviewhidden(true);
        setlisthidden(true);
        setedithidden(false);
        $('#add_item_table tbody').empty();
        var row_id = $(this).attr("data-lable");
        fetch('https://backend-55jj.onrender.com/get_order_invoice_data', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json', }, 
          body: JSON.stringify({userid:localStorage.getItem('id'), order_id: row_id})
        }).then(res => {
          return res.json();
        }).then(data => {
          const due_date = new Date(data.order_data.order_due_date.toString().trim());
          setId(data.order_data.id);
          setOInvoiceNo(data.order_data.order_num);
          setOInvDate(moment(data.order_data.stock_date).format("DD/MM/YYYY"));
          setOInvDueDate(due_date);
          setupdate_stk(data.order_data.update_stock.toString().trim());
          setORefNo(data.order_data.order_refer.toString().trim());
          if(data.order_data.payment_terms.toString().trim()=="receipt")
          {
            setpayment_due(data.order_data.payment_terms.toString());
          }
          setOInvTax(data.order_data.order_tax.toString());
          setOInvDisc(data.order_data.order_discount.toString());
          setOInvShipp(data.order_data.shipping);
          setsupplhidden(false);
          setsupplName(data.suppl_data.suppl_name);
          setsupplAddss(data.suppl_data.suppl_address);
          setsupplCountry(data.suppl_data.suppl_country);
          setsupplCity(data.suppl_data.suppl_city);
          setsupplPhone(data.suppl_data.suppl_phone.toString().trim());
          setsupplEmail(data.suppl_data.suppl_email);
          setOInvTotal(parseFloat(data.order_data.grand_total).toFixed(2) - parseFloat(data.order_data.shipping).toFixed(2));
          setOInvTotax(data.order_data.total_tax);
          setOInvDist(data.order_data.total_discount);
          setOInvGrnTotal(data.order_data.grand_total);
          setOInvNote(data.order_data.order_note);
          setWarehouse(data.order_data.warehouse_id);
          setWarehouseName(data.order_data.warehouse_name);
          var sel_Array = [];
          for (let k = 0; k < data.order_items.length; k++) {
            var row_id = data.order_items[k].item_product;
            sel_Array.push(parseInt(row_id)); 
            var tbl_row = $("#add_item_table tbody tr.main_row").length + 1;
            var tbl_row_indx = $("#add_item_table tbody tr").length;
            var item_name =data.order_items[k].item_name;
            var item_rate = data.order_items[k].item_rate;
            var item_qty = data.order_items[k].item_qnty;
            var item_per_tax = data.order_items[k].item_per_tax;
            var item_tax = data.order_items[k].item_tax;
            var item_disc = data.order_items[k].item_disc;
            var item_disc_val = data.order_items[k].item_disc_val;
            var item_amt = data.order_items[k].item_amount;
            var item_descp = data.order_items[k].item_description;
            $("#add_item_table tbody").append('<tr class="main_row" data-label="'+row_id+'" data-index1="'+tbl_row_indx+'" ><td>'+tbl_row+'</td><td> <input type="text" name="itemname" placeholder="Enter Product Name." value="'+item_name+'"></td><td><input type="number" placeholder = "1" className="form-control" name="itemqunty" value="'+parseInt(item_qty)+'"></td><td> <input type="number" step="0.01" placeholder="1.00" className="form-control" name="itmrate" value="'+parseFloat(item_rate).toFixed(2)+'"></td><td><input type="number" step="0.01" placeholder="1.00" className="form-control" name="itemtax" value="'+parseFloat(item_per_tax).toFixed(2)+'"></td><td>'+item_tax+'</td><td><input type="number" step="0.01" placeholder = "1.00" className="form-control" name="itemdiscount" value="'+parseFloat(item_disc).toFixed(2)+'"></td><td>'+item_disc_val+'</td><td>'+item_amt+'</td><td><button type="button" class="btn_item_dlt remove-row" data-lable='+row_id+'  data-number="'+tbl_row_indx+'"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic text-danger-main text-xl" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg></button></td></tr><tr class="descp_row" data-label="'+row_id+'" data-index="'+tbl_row_indx+'" ><td colspan="10"><textarea type="text" placeholder="Enter Product Description.." name="formtext" className="form-control" value="'+item_descp+'"></textarea></td></tr>');
          }
          setselectList(sel_Array);
        });
    });
  
    $(document).off('click', '.order_delete').on("click", '.order_delete', function(e){
      e.preventDefault();
      var row_id = $(this).attr("data-lable");
      setId(row_id);
      fetch('https://backend-55jj.onrender.com/invoice_order_delete/'+row_id+'/'+localStorage.getItem('id'), { 
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

      var clicked = false;
      $(document).off('click', '#check_all').on("click", '#check_all', function(e){
        e.preventDefault();
        $("#AddItemTbl .tbl_check").prop("checked", !clicked);
        clicked = !clicked;
      });

      $(document).off('click', '.order_view').on("click", '.order_view', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        setviewhidden(false);
        setlisthidden(true);
        setedithidden(true);
        $('#tbl_view_order tbody').empty();
          var row_id = $(this).attr("data-lable");
          fetch('https://backend-55jj.onrender.com/get_order_invoice_data', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', }, 
            body: JSON.stringify({userid:localStorage.getItem('id'),order_id: row_id})
          }).then(res => {
            return res.json();
          }).then(data => {
            setv_Inv_Id(data.order_data.id);
            setv_Inv_Num(data.order_data.order_num);
            setv_Inv_Date(moment(data.order_data.order_date.toString().trim()).format("DD/MM/YYYY"));
            setv_Inv_Due_Dt(moment(data.order_data.order_due_date.toString().trim()).format("DD/MM/YYYY"));
            setv_Inv_Ref(data.order_data.order_refer);
            if(data.order_data.payment_terms.toString().trim()=="receipt")
            {
              setv_Inv_Term("Payment Due on Receipt");
            }
            setv_Inv_Shipp(data.order_data.shipping);
            setv_Inv_Cus_Name(data.suppl_data.suppl_name);
            setv_Inv_Cus_Addrs(data.suppl_data.suppl_address);
            setv_Inv_Cus_Cnty(data.suppl_data.client_country);
            setv_Inv_Cus_City(data.suppl_data.suppl_city);
            setv_Inv_Cus_Phone(data.suppl_data.suppl_phone.toString().trim());
            setv_Inv_Cus_Email(data.suppl_data.suppl_email);
            setv_Inv_SubTotal(parseFloat(data.order_data.grand_total).toFixed(2) - parseFloat(data.order_data.shipping).toFixed(2));
            setv_Inv_TotalTax(data.order_data.total_tax);
            setv_Inv_TotalDisc(data.order_data.total_discount);
            setv_Inv_Total(data.order_data.grand_total);
            for (let k = 0; k < data.order_items.length; k++) {
              var row_id = data.order_items[k].id;
              var item_name =data.order_items[k].item_name;
              var item_rate = data.order_items[k].item_rate;
              var item_qty = data.order_items[k].item_qnty;
              var item_tax = data.order_items[k].item_tax;
              var item_disc = data.order_items[k].item_disc_val;
              var item_amt = data.order_items[k].item_amount;
              $("#tbl_view_order tbody").append('<tr><td>'+(k+1)+'</td><td>'+item_name+'</td><td>'+item_rate+'</td><td>'+item_qty+'</td><td>'+item_tax+'</td><td>'+item_disc+'</td><td>'+item_amt+'</td></tr>');
            }
        });
      });
      $(document).off('change', '[name=itemqunty]').on("change", '[name=itemqunty]', function(e){
        var t_row =  $(this).closest('tr').index();  
        refreshtableValues(t_row);
      });

      $(document).off('change', '[name=itmrate]').on("change", '[name=itmrate]', function(e){
        var t_row =  $(this).closest('tr').index();  
        refreshtableValues(t_row);
      });

      $(document).off('change', '[name=itemtax]').on("change", '[name=itemtax]', function(e){
        var t_row =  $(this).closest('tr').index();  
        refreshtableValues(t_row);
      });

      $(document).off('change', '[name=itemdiscount]').on("change", '[name=itemdiscount]', function(e){
        var t_row =  $(this).closest('tr').index();  
        refreshtableValues(t_row);
      });

      let table;
      fetch('https://backend-55jj.onrender.com/warehouse_data' +'/'+localStorage.getItem('id')).then((res) =>
        res.json().then((data_party) => {
        $("#order_ware").empty();
        $("#order_ware").append("<option value=''>Select Warehouse</option>");
        for (let i = 0; i < data_party.length; i++) {
          $("#order_ware").append("<option value=\"" + data_party[i].id  + "\">" + data_party[i].ware_name + "</option>");
        }
      }));
      loadJQueryAndDataTables()
        .then(($) => {
           window.$ = window.jQuery = $;
          fetch('https://backend-55jj.onrender.com/inv_order_data' +'/'+localStorage.getItem('id') ).then((res) =>
            res.json().then((jsdata) => {
            for (let i = 0; i < jsdata.length; i++) {
                  let row = '<tr>';
                  row += '<td>' + (i +1) + '</td>';
                  row += '<td style="text-transform:capitalize">' + jsdata[i].order_num + '</td>';
                  row += '<td style="text-transform:capitalize">' + jsdata[i].supplier_name + '</td>';
                  row += '<td style="text-transform:capitalize">' + moment(jsdata[i].order_date).format("DD/MM/YYYY") + '</td>';
                  row += '<td style="text-transform:capitalize">' + "Rs. "+numberWithCommas(jsdata[i].grand_total) + '</td>';
                  if(jsdata[i].order_status.toString().trim() == "partial")
                  {
                    row += '<td style="text-transform:capitalize;"><span class="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm" style="font-size: 12px !important;">Partial</span></td>';
                  }
                  else if(jsdata[i].order_status.toString().trim() == "paid")
                  {
                    row += '<td style="text-transform:capitalize;"><span class="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm" style="font-size: 12px !important;">Paid</span></td>';
                  }
                  else if(jsdata[i].order_status.toString().trim() == "pending")
                  {
                    row += '<td style="text-transform:capitalize;"><span class="bg-danger-focus text-danger-main px-24 py-4 rounded-pill fw-medium text-sm" style="font-size: 12px !important;">'+jsdata[i].order_status.toString().trim()+'</span></td>';
                  }
                  row += '<td ><a class="order_view w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"  data-lable='+jsdata[i].id+' ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--hugeicons menu-icon" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M21.544 11.045c.304.426.456.64.456.955c0 .316-.152.529-.456.955C20.178 14.871 16.689 19 12 19c-4.69 0-8.178-4.13-9.544-6.045C2.152 12.529 2 12.315 2 12c0-.316.152-.529.456-.955C3.822 9.129 7.311 5 12 5c4.69 0 8.178 4.13 9.544 6.045"></path><path d="M15 12a3 3 0 1 0-6 0a3 3 0 0 0 6 0"></path></g></svg></a><a class="order_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="order_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
                  row += '</tr>';
                  $("#order_table tbody").append(row);
            }
            $("#order_table").DataTable();
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

const handleDownload = (e) => {
  var type = "order";
  fetch('https://backend-55jj.onrender.com/generatePrd_pdf/'+v_Inv_Id+'/'+type+'/'+localStorage.getItem('id'))
  .then(resp => resp.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    var partyname =  v_Inv_Num.toString().trim() +"_"+ v_Inv_Cus_Name.toString().trim();
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = partyname.toString().replace(" ","_") + '_Purchase_Invoice.pdf';
    document.body.appendChild(a);
    a.click();
  })
  .catch(() => 
  console.log("error"));
}
  const handleBack = (e) => {
    e.preventDefault();
    setviewhidden(true);
    setedithidden(true);
    setlisthidden(false);
  };
  
  const canSubmit =  ORefNo.length > 0 && $("#add_item_table tbody tr").length > 0 && ORefNo.length > 0;

  function refreshDropValues(taxvalue)
  {
    var OInvTax1 = taxvalue.toString().trim();
    $('#add_item_table tbody tr.main_row').each(function(e) {
      var t_row =  $(this).closest('tr').index();   
      var qty = $("#add_item_table tbody tr:eq("+t_row+") td:eq(2)").find('input').val();
      var rate = $("#add_item_table tbody tr:eq("+t_row+") td:eq(3)").find('input').val();
      var item_tax = $("#add_item_table tbody tr:eq("+t_row+") td:eq(4)").find('input').val();
      var item_discount = $("#add_item_table tbody tr:eq("+t_row+") td:eq(6)").find('input').val();
      var item_rate = parseInt(qty) * parseFloat(rate).toFixed(2);
      var tax_val = 0;
      var disc_val = 0;
      var amnt_val = 0;
      if(OInvTax1.trim() == "on")
      {
        if(OInvDisc.trim() == "pdat")
        {
          tax_val = parseFloat(parseInt(item_tax) * parseInt(item_rate)  /100).toFixed(2);
          amnt_val =  parseInt(item_rate) + parseFloat(tax_val);
          disc_val = parseFloat(parseFloat(amnt_val).toFixed(2) * parseInt(item_discount)  /100).toFixed(2);
          amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
        }
        else if(OInvDisc.trim() == "fdat")
        {
          tax_val = parseFloat(parseInt(item_tax) * parseInt(item_rate)  /100).toFixed(2);
          amnt_val = parseInt(item_rate) + parseFloat(tax_val);
          disc_val = parseInt(item_discount);
          amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
        }
        else if(OInvDisc.trim() == "pdbt")
        {
          disc_val = parseFloat(parseInt(item_rate) * parseInt(item_discount)  /100).toFixed(2);
          amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
          tax_val = parseFloat(parseFloat(item_tax) * parseFloat(amnt_val)  /100).toFixed(2);
          amnt_val =  parseFloat(amnt_val) + parseFloat(tax_val);
        }
        else if(OInvDisc.trim() == "fdbt")
        {
          disc_val = parseInt(item_discount);
          amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
          tax_val = parseFloat(parseFloat(item_tax) * parseFloat(amnt_val)  /100).toFixed(2);
          amnt_val =  parseFloat(amnt_val) + parseFloat(tax_val);
        }
      }
      else if(OInvTax1.trim() == "off")
      {
        if(OInvDisc.trim() == "pdat")
        {
          tax_val = 0;
          amnt_val =  parseInt(item_rate);
          disc_val = parseFloat(parseFloat(amnt_val).toFixed(2) * parseInt(item_discount)  /100).toFixed(2);
          amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
        }
        else if(OInvDisc.trim() == "fdat")
        {
          tax_val = 0;
          amnt_val = parseInt(item_rate);
          disc_val = parseInt(item_discount);
          amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
        }
        else if(OInvDisc.trim() == "pdbt")
        {
          disc_val = parseFloat(parseInt(item_rate) * parseInt(item_discount)  /100).toFixed(2);
          amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
          tax_val = 0;
          amnt_val =  parseFloat(amnt_val);
        }
        else if(OInvDisc.trim() == "fdbt")
        {
          disc_val = parseInt(item_discount);
          amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
          tax_val = 0;
          amnt_val =  parseFloat(amnt_val) + parseFloat(tax_val);
        }         
      }
      $("#add_item_table tbody tr:eq("+t_row+") td:eq(5)").html(parseFloat(tax_val).toFixed(2));
      $("#add_item_table tbody tr:eq("+t_row+") td:eq(7)").html(parseFloat(disc_val).toFixed(2));
      $("#add_item_table tbody tr:eq("+t_row+") td:eq(8)").html(parseFloat(amnt_val).toFixed(2));
  });
  
    var totalTax = 0.00;
    var totalDis = 0.00;
    var totalAmt = 0.00;
    $('#add_item_table tbody tr.main_row').each(function(e) {
      var t_row_a =  $(this).closest('tr').index();   
      var tax_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(5)").html();
      var dis_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(7)").html();
      var total_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(8)").html();
      totalTax += parseFloat(tax_amt);
      totalDis += parseFloat(dis_amt);
      totalAmt += parseFloat(total_amt);
    });
    setOInvTotax(parseFloat(totalTax).toFixed(2));
    setOInvDist(parseFloat(totalDis).toFixed(2));
    setOInvGrnTotal(parseFloat(parseFloat(totalAmt)  + parseFloat(OInvShipp)).toFixed(2));
    setOInvTotal(parseFloat(totalAmt));
  }

  function refreshtableValues(t_row)
  {
    var qty = $("#add_item_table tbody tr:eq("+t_row+") td:eq(2)").find('input').val();
    var rate = $("#add_item_table tbody tr:eq("+t_row+") td:eq(3)").find('input').val();
    var item_tax = $("#add_item_table tbody tr:eq("+t_row+") td:eq(4)").find('input').val();
    var item_discount = $("#add_item_table tbody tr:eq("+t_row+") td:eq(6)").find('input').val();
    var item_rate = parseInt(qty) * parseFloat(rate).toFixed(2);
    var tax_val = 0;
    var disc_val = 0;
    var amnt_val = 0;
    if(OInvTax.trim() == "on")
    {
      if(OInvDisc.trim() == "pdat")
      {
        tax_val = parseFloat(parseInt(item_tax) * parseInt(item_rate)  /100).toFixed(2);
        amnt_val =  parseInt(item_rate) + parseFloat(tax_val);
        disc_val = parseFloat(parseFloat(amnt_val).toFixed(2) * parseInt(item_discount)  /100).toFixed(2);
        amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
      }
      else if(OInvDisc.trim() == "fdat")
      {
        tax_val = parseFloat(parseInt(item_tax) * parseInt(item_rate)  /100).toFixed(2);
        amnt_val = parseInt(item_rate) + parseFloat(tax_val);
        disc_val = parseInt(item_discount);
        amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
      }
      else if(OInvDisc.trim() == "pdbt")
      {
        disc_val = parseFloat(parseInt(item_rate) * parseInt(item_discount)  /100).toFixed(2);
        amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
        tax_val = parseFloat(parseFloat(item_tax) * parseFloat(amnt_val)  /100).toFixed(2);
        amnt_val =  parseFloat(amnt_val) + parseFloat(tax_val);
      }
      else if(OInvDisc.trim() == "fdbt")
      {
        disc_val = parseInt(item_discount);
        amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
        tax_val = parseFloat(parseFloat(item_tax) * parseFloat(amnt_val)  /100).toFixed(2);
        amnt_val =  parseFloat(amnt_val) + parseFloat(tax_val);
      }
    }
    else if(OInvTax.trim() == "off")
    {
      if(OInvDisc.trim() == "pdat")
      {
        tax_val = 0;
        amnt_val =  parseInt(item_rate);
        disc_val = parseFloat(parseFloat(amnt_val).toFixed(2) * parseInt(item_discount)  /100).toFixed(2);
        amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
      }
      else if(OInvDisc.trim() == "fdat")
      {
        tax_val = 0;
        amnt_val = parseInt(item_rate);
        disc_val = parseInt(item_discount);
        amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
      }
      else if(OInvDisc.trim() == "pdbt")
      {
        disc_val = parseFloat(parseInt(item_rate) * parseInt(item_discount)  /100).toFixed(2);
        amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
        tax_val = 0;
        amnt_val =  parseFloat(amnt_val);
      }
      else if(OInvDisc.trim() == "fdbt")
      {
        disc_val = parseInt(item_discount);
        amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
        tax_val = 0;
        amnt_val =  parseFloat(amnt_val) + parseFloat(tax_val);
      }         
    }
      $("#add_item_table tbody tr:eq("+t_row+") td:eq(5)").html(parseFloat(tax_val).toFixed(2));
      $("#add_item_table tbody tr:eq("+t_row+") td:eq(7)").html(parseFloat(disc_val).toFixed(2));
      $("#add_item_table tbody tr:eq("+t_row+") td:eq(8)").html(parseFloat(amnt_val).toFixed(2));
  
    var totalTax = 0.00;
    var totalDis = 0.00;
    var totalAmt = 0.00;
    $('#add_item_table tbody tr.main_row').each(function(e) {
      var t_row_a =  $(this).closest('tr').index();   
      var tax_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(5)").html();
      var dis_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(7)").html();
      var total_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(8)").html();
      totalTax += parseFloat(tax_amt);
      totalDis += parseFloat(dis_amt);
      totalAmt += parseFloat(total_amt);
    });

    setOInvTotax(parseFloat(totalTax).toFixed(2));
    setOInvDist(parseFloat(totalDis).toFixed(2));
    setOInvGrnTotal(parseFloat(parseFloat(totalAmt)  + parseFloat(OInvShipp)).toFixed(2));
    setOInvTotal(parseFloat(totalAmt));
  }

  const handleAddItem = (e) => {
    let rows = '';
    fetch('https://backend-55jj.onrender.com/product_data' +'/'+localStorage.getItem('id')).then(res => {
        return res.json();
      }).then(data => {
        for (let i = 0; i < data.length; i++) {
          if (parseInt(data[i].product_stock) > 1 && ($.inArray(parseInt(data[i].id), selectList) === -1))
            {
              let row = '<tr>';
              row += '<td><input class="form-check-input tbl_check" data-label= " '+data[i].id+'" type="checkbox" value="" id="checkbox"'+i+'></td>';
              row += '<td style="text-transform:capitalize"  data-id='+data[i].id+'>' + data[i].product_name + '</td>';
              row += '<td style="text-transform:capitalize" data-type='+data[i].product_cat+'>' + data[i].product_cat_name + '</td>';
              row += '<td style="text-transform:capitalize">' + data[i].product_stock + '</td>';
              row += '<td style="text-transform:capitalize">' + data[i].product_rental + '</td>';
              row += '<td style="text-transform:capitalize">' + data[i].product_tax + '</td>';
              row += '<td style="text-transform:capitalize">' + data[i].product_discount + '</td>';
              rows += row;
            } 
          }
        var swal_html = `
      <table class="form-check table mb-0" id="AddItemTbl">
          <thead>
              <tr>
                  <th>
                      <input class="form-check-input" type="checkbox" value="1" id="check_all">
                  </th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Quantity</th></th>
                  <th>Rate</th>
                  <th>Tax (%)</th>
                  <th>Discount</th>
              </tr>
          </thead>
          <tbody>
              
             `+rows+` 
          </tbody>
      </table>
  `;
   withReactContent(Swal).fire({
            title: "Select Products",
            html: swal_html,
            draggable: true,
            showConfirmButton: true,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            width: '1100px',
            preConfirm: () => {
              var sel_Array = [];
              var check_len = $('#AddItemTbl tbody .tbl_check:checked').length;
              if(check_len != 0)
              {
                $('#AddItemTbl tbody .tbl_check:checked').each(function(e) {
                  var t_row =  $(this).closest('tr').index();  
                  var row_id = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(1)").attr("data-id");  
                  sel_Array.push(parseInt(row_id)); 
                  var tbl_row = $("#add_item_table tbody tr.main_row").length + 1;
                  var tbl_row_indx = $("#add_item_table tbody tr").length;
                  setrowNo($("#add_item_table tbody tr").length);
                  var item_name = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(1)").html();
                  var item_category = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(2)").attr("data-lable");
                  var item_rate = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(4)").html();
                  var item_tax = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(5)").html();
                  var item_discount = $("#AddItemTbl tbody tr:eq("+t_row+") td:eq(6)").html();
                  var tax_val = 0;
                  var disc_val = 0;
                  var amnt_val = 0;
                  if(OInvTax.trim() == "on")
                  {
                    if(OInvDisc.trim() == "pdat")
                    {
                      tax_val = parseFloat(parseInt(item_tax) * parseInt(item_rate)  /100).toFixed(2);
                      amnt_val =  parseInt(item_rate) + parseFloat(tax_val);
                      disc_val = parseFloat(parseFloat(amnt_val).toFixed(2) * parseInt(item_discount)  /100).toFixed(2);
                      amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
                    }
                    else if(OInvDisc.trim() == "fdat")
                    {
                      tax_val = parseFloat(parseInt(item_tax) * parseInt(item_rate)  /100).toFixed(2);
                      amnt_val = parseInt(item_rate) + parseFloat(tax_val);
                      disc_val = parseInt(item_discount);
                      amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
                    }
                    else if(OInvDisc.trim() == "pdbt")
                    {
                      disc_val = parseFloat(parseInt(item_rate) * parseInt(item_discount)  /100).toFixed(2);
                      amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
                      tax_val = parseFloat(parseFloat(item_tax) * parseFloat(amnt_val)  /100).toFixed(2);
                      amnt_val =  parseFloat(amnt_val) + parseFloat(tax_val);
                    }
                    else if(OInvDisc.trim() == "fdbt")
                    {
                      disc_val = parseInt(item_discount);
                      amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
                      tax_val = parseFloat(parseFloat(item_tax) * parseFloat(amnt_val)  /100).toFixed(2);
                      amnt_val =  parseFloat(amnt_val) + parseFloat(tax_val);
                    }
                  }
                  else if(OInvTax.trim() == "off")
                  {
                    if(OInvDisc.trim() == "pdat")
                      {
                        tax_val = 0;
                        amnt_val =  parseInt(item_rate);
                        disc_val = parseFloat(parseFloat(amnt_val).toFixed(2) * parseInt(item_discount)  /100).toFixed(2);
                        amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
                      }
                      else if(OInvDisc.trim() == "fdat")
                      {
                        tax_val = 0;
                        amnt_val = parseInt(item_rate);
                        disc_val = parseInt(item_discount);
                        amnt_val = parseFloat(amnt_val).toFixed(2) - parseFloat(disc_val).toFixed(2);
                      }
                      else if(OInvDisc.trim() == "pdbt")
                      {
                        disc_val = parseFloat(parseInt(item_rate) * parseInt(item_discount)  /100).toFixed(2);
                        amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
                        tax_val = 0;
                        amnt_val =  parseFloat(amnt_val);
                      }
                      else if(OInvDisc.trim() == "fdbt")
                      {
                        disc_val = parseInt(item_discount);
                        amnt_val = parseFloat(item_rate).toFixed(2) - parseFloat(disc_val).toFixed(2);
                        tax_val = 0;
                        amnt_val =  parseFloat(amnt_val) + parseFloat(tax_val);
                      }         
                  }
                  $("#add_item_table tbody").append('<tr class="main_row" data-label="'+row_id+'" data-index1="'+tbl_row_indx+'" ><td>'+tbl_row+'</td><td> <input type="text" name="itemname" placeholder="Enter Product Name." value="'+item_name+'"></td><td><input type="number" placeholder = "1" className="form-control" name="itemqunty" value="1"></td><td> <input type="number" step="0.01" placeholder="1.00" className="form-control" name="itmrate" value="'+parseFloat(item_rate).toFixed(2)+'"></td><td><input type="number" step="0.01" placeholder="1.00" className="form-control" name="itemtax" value="'+parseFloat(item_tax).toFixed(2)+'"></td><td>'+tax_val+'</td><td><input type="number" step="0.01" placeholder = "1.00" className="form-control" name="itemdiscount" value="'+parseFloat(item_discount).toFixed(2)+'"></td><td>'+disc_val+'</td><td>'+amnt_val+'</td><td><button type="button" class="btn_item_dlt remove-row" data-lable='+row_id+'  data-number="'+tbl_row_indx+'"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic text-danger-main text-xl" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg></button></td></tr><tr class="descp_row" data-label="'+row_id+'" data-index="'+tbl_row_indx+'" ><td colspan="10"><textarea type="text" placeholder="Enter Product Description.." name="formtext" className="form-control" value=""></textarea></td></tr>');
                });
                setselectList(sel_Array);
                var totalTax = 0.00;
                var totalDis = 0.00;
                var totalAmt = 0.00;
                $('#add_item_table tbody tr.main_row').each(function(e) {
                    var t_row_a =  $(this).closest('tr').index();   
                    var tax_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(5)").html();
                    var dis_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(7)").html();
                    var total_amt = $("#add_item_table tbody tr:eq("+t_row_a+") td:eq(8)").html();
                    totalTax += parseFloat(tax_amt);
                    totalDis += parseFloat(dis_amt);
                    totalAmt += parseFloat(total_amt);
                });
                setOInvTotax(parseFloat(totalTax).toFixed(2));
                setOInvDist(parseFloat(totalDis).toFixed(2));
                setOInvGrnTotal(parseFloat(parseFloat(totalAmt)  + parseFloat(OInvShipp)).toFixed(2));
                setOInvTotal(parseFloat(totalAmt));
              }
              else
              {
                withReactContent(Swal).fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Please Select Atleast One Item To Add!",
                  draggable: true
                });
              }
          },
            confirmButtonText: `<i class="fa fa-plus  "></i> Add`,
            cancelButtonText: `<i class="fa fa-close"></i> Cancel`,
            allowOutsideClick: false,
            allowEscapeKey: false
           });
    });
  } 
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      if($("#btnordersubmit").text().trim() == "Update")
      {
        var ord_items = [];
        $('#add_item_table tbody tr.main_row').each(function(e) {
          var t_row =  $(this).closest('tr').index(); 
          var row_ind = $("#add_item_table tbody tr:eq("+t_row+")").attr("data-index1");
          var product = $("#add_item_table tbody tr:eq("+t_row+")").attr("data-label");  
          var name = $("#add_item_table tbody tr:eq("+t_row+") td:eq(1)").find('input').val();
          var qty = $("#add_item_table tbody tr:eq("+t_row+") td:eq(2)").find('input').val();
          var rate = $("#add_item_table tbody tr:eq("+t_row+") td:eq(3)").find('input').val();
          var item_tax = $("#add_item_table tbody tr:eq("+t_row+") td:eq(4)").find('input').val();
          var tax_amt = $("#add_item_table tbody tr:eq("+t_row+") td:eq(5)").html();
          var item_discount = $("#add_item_table tbody tr:eq("+t_row+") td:eq(6)").find('input').val();
          var dis_amt = $("#add_item_table tbody tr:eq("+t_row+") td:eq(7)").html();
          var total_amt = $("#add_item_table tbody tr:eq("+t_row+") td:eq(8)").html();
          var description =  $("#add_item_table").find("[data-index='" + row_ind + "']").find('textarea').val();
          var invoice_num = OInvoiceNo;
          ord_items.push({"product":product.toString().trim(),"name":name.toString().trim(),"qty":qty.toString().trim(),"rate":rate.toString().trim(),"item_tax":item_tax.toString().trim(),"tax_amt":tax_amt.toString().trim(),"item_discount":item_discount.toString().trim(),"dis_amt":dis_amt.toString().trim(),"total_amt":total_amt.toString().trim(),"invoice_num":invoice_num.toString().trim(),"description":description.toString().trim()})
       });

        fetch('https://backend-55jj.onrender.com/update_order_values', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({ userid:localStorage.getItem('id'),o_orderId: orderId, o_invoiceNm :OInvoiceNo.toString().trim(), o_invoiceRef: ORefNo.toString().trim(), a_OInvDate: Date(OInvDate.toString().trim()), o_OInvDueDate: OInvDueDate, o_OInvTax: OInvTax.toString().trim(), o_OInvDisc: OInvDisc.toString().trim(), o_OInvNote: OInvNote.toString().trim(), o_OInvTotax: OInvTotax.toString().trim(), o_OInvDist:OInvDist.toString().trim(), o_OInvShipp:OInvShipp.toString().trim(), o_OInvGrnTotal:OInvGrnTotal.toString().trim(),OInvTotal:OInvTotal.toString().trim(), o_payment_due:payment_due.toString().trim(),o_update_stk:update_stk.toString().trim(), o_items : ord_items})
          }).then(res => {
              return res.json();
          }).then(data => {
          if(parseInt(data) != 0)
          {
             location.reload();
          }
        });
      }
  }
}

const handleShipChange = (e) => {
  e.preventDefault();
  if(e.target.value!= undefined || e.target.value!= null || e.target.value!= 0)
  {
    setOInvShipp(e.target.value);
    setOInvGrnTotal(parseFloat(OInvTotal) + parseInt(e.target.value));
  }
};
const handleTaxChange = (e) => {
  e.preventDefault();
  setOInvTax(e.target.value);
  refreshDropValues(e.target.value);
};

const handleDiscountChange = (e) => {
  e.preventDefault();
  setOInvDisc(e.target.value);
  refreshDropValues(OInvTax);
};
  

const handleYesClick = () => {
  setupdate_stk(true);
};
const handleNoClick = () => {
  setupdate_stk(false);
}; 
  
  return (
    <div>
       <div className="col-lg-12">
            <div className='card' hidden={edithidden}>
            <div className="card-header">
              <h5 className="card-title mb-0">Update Order</h5>
            </div>
            <div className='card-header'>
                <div className='d-flex flex-wrap align-items-center justify-content-end gap-2'>
                <div className="col-4 d-flex gap-1">
                <label className="form-label mt-3 w-50">Payment Terms</label>
                <select 
                        id="order_pay_terms"
                        className="form-select"
                        value={payment_due}
                        onChange={(e) => setpayment_due(e.target.value)}
                        required> 
                    <option value="receipt">Payment Due on Receipt</option>
                </select>
                </div>
             
                <div className="col-1 d-flex">
                <button type='button' className='btn btn-sm btn-neutral-900 radius-8 d-inline-flex align-items-center gap-1' onClick={handleBack} >
                  <Icon icon='mingcute:square-arrow-left-line' className='text-xl' />
                    Back
                </button>    
                </div>
                <div className="col-1 d-flex gap-1">
                <button className="btn btn-sm btn-primary radius-8 d-inline-flex align-items-center gap-1" id="btnordersubmit" onClick={handleSubmit} disabled={!canSubmit} >
                  <Icon icon='simple-line-icons:check' className='text-xl' /> Update
                  </button>
                </div>
                </div>   
            </div>
   <div className="card-body">
          <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
            <div className="col-md-5">
             <div className="col-md-12 mb-3">
                <h6 className="text-md fw-semibold mb-0">Bill From</h6>
              </div>
                <div className="col-md-12" >
                  <div className="card-header p-0">
                  <label className="form-label mb-0">Supplier Details</label>
                  </div>
                  <div hidden={supplhidden}>
                  <h6 className="text-md fw-semibold mb-1 mt-3" style={{ textTransform: 'capitalize'}}>{supplName}</h6>
                  <h6 className="text-md fw-semibold mb-1">{supplAddss}</h6>
                  <h6 className="text-md fw-semibold mb-1">{supplCity}, {supplCountry}</h6>
                  <div className="col-md-12">
                  <label className="form-label mb-0" style={{display:"flex"}}>Phone: <h6 className="text-sm fw-semibold mt-1">{supplPhone}</h6></label>
                  </div>
                  <div className="card-header p-0">
                  <label className="form-label mb-0" style={{display:"flex"}}>Email: <h6 className="text-sm fw-semibold mt-1">{supplEmail}</h6></label>
                  </div>
                  </div>
                </div>
                <div className="col-md-12 mb-3" id="select_party">
                  <label className="form-label">Warehouse</label>
                  <h6 className="text-md mb-1">{WarehouseName}</h6>
                </div>
            </div>
            <div className="col-md-1">

            </div>
            <div className="col-md-6">
             <div className="col-md-12 mb-3">
                <h6 className="text-md fw-semibold mb-0">Order Properties</h6>
              </div>
              <div className="col-md-12 mb-3" style={{display:"flex"}}>
              <div className="col-md-5 mb-3">
              <label className="form-label">Invoice No *</label>
                  <input type="text" className="form-control" 
                    value={OInvoiceNo}
                    onChange={(e) => setOInvoiceNo(e.target.value)}
                    onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                    required readOnly/>
              </div>
              <div className="col-md-1 mb-3">

              </div>
              <div className="col-md-5">
              <label className="form-label">Reference No *</label>
                  <input type="text" className="form-control" 
                    value={ORefNo}
                    onChange={(e) => setORefNo(e.target.value)}
                    onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                    required />
                </div>
              </div>

              <div className="col-md-12 mb-3" style={{display:"flex"}}>
              <div className="col-md-5 mb-3">
              
              <label className="form-label">Order Date </label>
              <h6 className="text-md mb-1">{OInvDate}</h6>
              </div>
              <div className="col-md-1 mb-3">

              </div>
              <div className="col-md-5">
              <label className="form-label">Order Due Date </label>
                    <DatePicker dateFormat="dd/MM/yyyy" id="date_issue"  className="form-control" selected={OInvDueDate} onChange={date => { setOInvDueDate(date); }}/>
                </div>
              </div>
              <div className="col-md-12 mb-3" style={{display:"flex"}}>
              <div className="col-md-5 mb-3">
              <label className="form-label">Tax </label>

              <select id="client_group" className="form-select" value={OInvTax} onChange={handleTaxChange}  required> 
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
              </div>
              <div className="col-md-1 mb-3">

              </div>
              <div className="col-md-5">
              <label className="form-label">Discount </label>
                <select id="client_group" className="form-select" value={OInvDisc} onChange={handleDiscountChange}   required> 
                    <option value="pdat">% Discount After Tax</option>
                    <option value="fdat">Flat Discount After Tax</option>
                    <option value="pdbt">% Discount Before Tax</option>
                    <option value="fdbt">Flat Discount Before Tax</option>
                </select>      
                </div>
              </div>
            </div>

            <div className="col-md-12">
            <label className="form-label">Invoice Note </label>
            <textarea type="text" className="form-control" 
                    value={OInvNote}
                    onChange={(e) => setOInvNote(e.target.value)}
                    onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                    required></textarea>
            </div>
            <div className="col-md-12">
            <div className='table-responsive scroll-sm'>
                <table className='table bordered-table text-sm' id='add_item_table'>
                  <thead>
                    <tr>
                      <th scope='col' className='text-sm'>
                        SL.
                      </th>
                      <th scope='col' className='text-sm'>
                        Item Name
                      </th> 
                      <th scope='col' className='text-sm' style={{width:'150px'}}>
                        Quantity
                      </th>
                      <th scope='col' className='text-sm'  style={{width:'150px'}}>
                        Rate
                      </th>
                      <th scope='col' className='text-sm' style={{width:'150px'}}>
                        Tax (%)
                      </th>
                      <th scope='col' className='text-sm' style={{width:'100px'}}>
                        Tax
                      </th>
                      <th scope='col' className='text-sm' style={{width:'150px'}}>
                        Discount
                      </th>
                      <th scope='col' className='text-sm' style={{width:'100px'}}>
                        Dist Val
                      </th>
                      <th scope='col' className='text-sm' style={{width:'100px'}}>
                        Amount(Rs.)
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
                    <button type='button' id='addRow'  onClick={handleAddItem} className='btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1'>
                      <Icon icon='simple-line-icons:plus' className='text-xl' />Add New</button>
                </div>
            </div>

            <div className="col-md-12 mb-3" style={{display:"flex"}}>
              
              <div className="col-md-9 mb-3">

              </div>
              <div className="col-md-4">
              <table className='text-sm'>
                            <tbody>
                              <tr>
                                <td className='pe-64 mt-1'>Total Tax:</td>
                                <td className='pe-16'>
                                  <span className='text-primary-light fw-semibold'>
                                  Rs. {OInvTotax}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className='pe-64 mt-1'>Total Discount:</td>
                                <td className='pe-16'>
                                  <span className='text-primary-light fw-semibold'>
                                  Rs. {OInvDist}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className='pe-64 mt-3 pt-3'>Shipping:</td>
                                <td className='pe-16'>
                                  <input type="text" style={{width:"50%"}} className="form-control" value={OInvShipp} onChange={handleShipChange} onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}} required/>
                                  
                                </td>
                              </tr>
                              <tr>
                                <td className='pe-64 pt-4 mt-1'>
                                  <span className='text-primary-light fw-semibold'>
                                  Grand Total (Rs.):
                                  </span>
                                </td>
                                <td className='pe-16 pt-4'>
                                  <span className='text-primary-light fw-semibold'>
                                  Rs. {OInvGrnTotal}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                    </table>
                </div>
              </div>
          </form>
        </div>
            </div>
        </div>
    <div className="col-lg-12">
        <div className='card' hidden={viewhidden}>
                <div className='card-header'>
                  <div className='d-flex flex-wrap align-items-center justify-content-end gap-2'>
                  <button type='button' className='btn btn-sm btn-neutral-900 radius-8 d-inline-flex align-items-center gap-1' onClick={handleBack} >
                          <Icon icon='mingcute:square-arrow-left-line' className='text-xl' />
                          Back
                        </button>
                    {/* <Link
                      href='#'
                      className='btn btn-sm btn-primary-600 radius-8 d-inline-flex align-items-center gap-1'
                    >
                      <Icon icon='pepicons-pencil:paper-plane' className='text-xl' />
                      Send Invoice
                    </Link> */}
          
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
                            <h3 className='text-xl'>Invoice #{v_Inv_Num}</h3>
                            <p className='mb-1 text-sm'>Date Issued: {v_Inv_Date}</p>
                            <p className='mb-0 text-sm'>Date Due: {v_Inv_Due_Dt}</p>
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
                                    <td className='ps-8'>: {v_Inv_Cus_Name}</td>
                                  </tr>
                                  <tr>
                                    <td>Address</td>
                                    <td className='ps-8'>: {v_Inv_Cus_Addrs}</td>
                                  </tr>
                                  <tr>
                                    <td>Country</td>
                                    <td className='ps-8'>: {v_Inv_Cus_City} , {v_Inv_Cus_Cnty}</td>
                                  </tr>
                                  <tr>
                                    <td>Phone number</td>
                                    <td className='ps-8'>: {v_Inv_Cus_Phone}</td>
                                  </tr>
                                  <tr>
                                    <td>Email</td>
                                    <td className='ps-8'>: {v_Inv_Cus_Email}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div>
                            <table className='text-sm text-secondary-light'>
                                <tbody>
                                  <tr>
                                    <td>Reference:</td>
                                    <td className='ps-8'>:{v_Inv_Ref}</td>
                                  </tr>
                                  <tr>
                                    <td>Terms</td>
                                    <td className='ps-8'>:{v_Inv_Term}</td>
                                  </tr>
                                  <tr>
                                    <td>Shipping</td>
                                    <td className='ps-8'>:Rs. {v_Inv_Shipp}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className='mt-24'>
                            <div className='table-responsive scroll-sm'>
                              <table className='table bordered-table text-sm' id="tbl_view_order">
                              <thead>
                                      <tr>
                                        <th scope='col' className='text-sm'>
                                          SL.
                                        </th>
                                        <th scope='col' className='text-sm'>
                                          Name
                                        </th>
                                        <th scope='col' className='text-sm'>
                                          Rate
                                        </th>
                                        <th scope='col' className='text-sm'>
                                        Quantity
                                        </th>
                                        <th scope='col' className='text-sm'>
                                          Tax
                                        </th>
                                        <th scope='col' className='text-sm'>
                                          Discount
                                        </th>
                                        <th scope='col' className='text-sm'>
                                          Amount
                                        </th>
                                      </tr>
                                    </thead>
                                <tbody> 
                                </tbody>
                              </table>
                            </div>
                            <div className='d-flex flex-wrap justify-content-between gap-3'>
                              <div>
                                
                              </div>
                              <div>
                                <table className='text-sm'>
                                  <tbody>
                                    <tr>
                                      <td className='pe-64'>Subtotal:</td>
                                      <td className='pe-16'>
                                        <span className='text-primary-light fw-semibold'>
                                          Rs. {v_Inv_SubTotal}
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className='pe-64'>Discount:</td>
                                      <td className='pe-16'>
                                        <span className='text-primary-light fw-semibold'>
                                          Rs. {v_Inv_TotalDisc}
                                        </span>
                                      </td>
                                    </tr> 
                                    <tr>
                                      <td className='pe-64'>Tax:</td>
                                      <td className='pe-16'>
                                        <span className='text-primary-light fw-semibold'>
                                          Rs. {v_Inv_TotalTax}
                                        </span>
                                      </td>
                                    </tr>  
                                    <tr>
                                      <td className='pe-64'>Shipping:</td>
                                      <td className='pe-16'>
                                        <span className='text-primary-light fw-semibold'>
                                          Rs. {v_Inv_Shipp} 
                                        </span>
                                      </td>
                                    </tr>  
                                    <tr>
                                      <td className='pe-64 pt-4'>
                                        <span className='text-primary-light fw-semibold'>
                                          Grand Total:
                                        </span>
                                      </td>
                                      <td className='pe-16 pt-4'>
                                        <span className='text-primary-light fw-semibold'>
                                        Rs. {v_Inv_Total} 
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
              </div>
    </div>

    <div className="card basic-data-table" hidden={listhidden}>
      <div className="card-header">
        <h5 className="card-title mb-0">Order List</h5>
      </div>
      <div className="card-body">
        <table
          className="table bordered-table mb-0"
          id="order_table"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Order#</th>
              <th scope="col">Customer</th>
              <th scope="col">Date</th>
              <th scope="col">Total</th>
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

export default ManageOrderList;