"use client";
import { useEffect } from "react";
import $ from 'jquery'; 
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const NewStockList = () => {
  const [options, setOptions] = useState([]);
  const [cusoptions, setcusoptions] = useState([]);

  const [rtnType, setrtnType] = useState("Supplier");

  const [cusId, setcusId] = useState("");
  const [stkId, setstkId] = useState("");

  const [custHidden, setcustHidden] = useState(true);
	const [suppldropHidden, setsuppldropHidden] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");
  const [cusselectedOption, setcusselectedOption] = useState("");

  const [purchId, setId] = useState(0);
  const [payment_due, setpayment_due] = useState("receipt");
  const [update_stk, setupdate_stk] = useState(false);
  const [OInvoiceNo, setOInvoiceNo] = useState("");
  

  const [ORefNo, setORefNo] = useState("");
  const [Warehouse, setWarehouse] = useState("");
  const [OInvDate, setOInvDate] = useState(new Date());
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

  const canSubmit =   Warehouse != '' && $("#add_item_table tbody tr").length > 0 && ORefNo.length > 0  && ORefNo.length > 0;
  
  const handleChangeType = (e) => {
    setrtnType(e.target.value);
    setsupplName("");
    setsupplAddss("");
    setsupplCity("");
    setsupplCountry("");
    setsupplPhone("");
    setsupplEmail("");
    setsupplhidden(true);
    if(e.target.value =="Supplier")
    {
      setOInvoiceNo(stkId);
      setcustHidden(true);
      setsuppldropHidden(false);
    }
    else if(e.target.value =="Customer")
    {
      setOInvoiceNo(cusId);
      setcustHidden(false);
      setsuppldropHidden(true);
    }
  };
  const handleChange = (option) => {
    setSelectedOption(option);
    var sel_value = option.value.toString().trim();
    fetch("https://backend-55jj.onrender.com/supplier_details", {
      method: 'POST', 
      headers:{   'Accept': 'application/json',
                'Content-Type': 'application/json'  }, 
      body: JSON.stringify({ id : sel_value,userid:localStorage.getItem('id')} )
    }).then((res) =>
      res.json().then((jsprovdata) => {
        setsupplName(jsprovdata[0].suppl_name);
        setsupplAddss(jsprovdata[0].suppl_addrss);
        setsupplCity(jsprovdata[0].suppl_city);
        setsupplCountry(jsprovdata[0].suppl_country);
        setsupplPhone(jsprovdata[0].suppl_phone);
        setsupplEmail(jsprovdata[0].suppl_email);
        setsupplhidden(false);
    }));
  }


  const handleChangeCus = (option) => {
    setcusselectedOption(option);
    var sel_value = option.value.toString().trim();
    fetch("https://backend-55jj.onrender.com/clients_details", {
      method: 'POST', 
      headers:{   'Accept': 'application/json',
                'Content-Type': 'application/json'  }, 
      body: JSON.stringify({ id : sel_value, userid:localStorage.getItem('id')} )
    }).then((res) =>
      res.json().then((jsprovdata) => {
        setsupplName(jsprovdata[0].suppl_name);
        setsupplAddss(jsprovdata[0].suppl_addrss);
        setsupplCity(jsprovdata[0].suppl_city);
        setsupplCountry(jsprovdata[0].suppl_country);
        setsupplPhone(jsprovdata[0].suppl_phone);
        setsupplEmail(jsprovdata[0].suppl_email);
        setsupplhidden(false);
    }));
  }



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
  if(Warehouse != 0) 
  {
    let rows = '';
    fetch('https://backend-55jj.onrender.com/product_data', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json', }, 
      body: JSON.stringify({warehouse_id: Warehouse, userid:localStorage.getItem('id')})}).then(res => {
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
  else
  {
    withReactContent(Swal).fire({
      icon: "error",
      title: "Oops...",
      text: "Please Select Warehouse!",
      draggable: true
    });
  }
  } 

  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      if($("#btnordersubmit").text().trim() == "Save")
      {
        if(selectedOption != "" || cusselectedOption != "")
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
        var selectvalue= "";
        if($("#stk_type").val() =="Supplier")
        {
          selectvalue = selectedOption.value.toString().trim();
        }
        else if($("#stk_type").val() =="Customer")
        {
          selectvalue = cusselectedOption.value.toString().trim();
        }
          fetch('https://backend-55jj.onrender.com/add_stock_return_values', { 
            method: 'POST', 
            headers: {   'Accept': 'application/json',
              'Content-Type': 'application/json'  }, 
              
              body: JSON.stringify({userid:localStorage.getItem('id'),  o_type:$("#stk_type").val(), o_supplid:selectvalue, o_warehouse: Warehouse.toString().trim(), o_invoiceNm :OInvoiceNo.toString().trim(), o_invoiceRef: ORefNo.toString().trim(), a_OInvDate: OInvDate, o_OInvDueDate: OInvDueDate, o_OInvTax: OInvTax.toString().trim(), o_OInvDisc: OInvDisc.toString().trim(), o_OInvNote: OInvNote.toString().trim(), o_OInvTotax: OInvTotax.toString().trim(), o_OInvDist:OInvDist.toString().trim(), o_OInvShipp:OInvShipp.toString().trim(), o_OInvGrnTotal:OInvGrnTotal.toString().trim(),OInvTotal:OInvTotal.toString().trim(), o_payment_due:payment_due.toString().trim(),o_update_stk:update_stk.toString().trim(), o_items : ord_items})
            }).then(res => {
                return res.json();
            }).then(data => {
            if(parseInt(data) != 0)
            {
                handleReset();
            }
        });
      }
      else
      {
        withReactContent(Swal).fire({
          icon: "error",
          title: "Oops...",
          text: "Please Select "+ rtnType + ".",
          draggable: true
        });       
      }
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

  const handleReset = () => {
    location.reload();  
  };

  const handleYesClick = () => {
    setupdate_stk(true);
  };
  const handleNoClick = () => {
    setupdate_stk(false);
  };

  function pad(n, length) {
    var len = length - (''+n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
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
  
        var clicked = false;
        $(document).off('click', '#check_all').on("click", '#check_all', function(e){
          e.preventDefault();
          $("#AddItemTbl .tbl_check").prop("checked", !clicked);
          clicked = !clicked;
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
        const response =  fetch("https://backend-55jj.onrender.com/supplier_select",{
          method: 'POST', 
          headers:{ 'Accept': 'application/json',
                    'Content-Type': 'application/json'  }, 
          body: JSON.stringify({userid:localStorage.getItem('id'), param:""})
        }).then((res) =>
          res.json().then((jsprovdata) => {
          const formattedoptions = []
            jsprovdata.forEach((data) => {
              var str = data.suppl_name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
              });          
            formattedoptions.push({
            value: data.id,
            label: str,
          })
        }); 
        setOptions(formattedoptions);
      }));
        
      const responseCus =  fetch("https://backend-55jj.onrender.com/customer_select",{
        method: 'POST', 
        headers:{ 'Accept': 'application/json',
                  'Content-Type': 'application/json'  }, 
        body: JSON.stringify({param:"", userid:localStorage.getItem('id')})
      }).then((res) =>
        res.json().then((jsprovdata) => {
        const formattedoptions = []
          jsprovdata.forEach((data) => {
            var str = data.client_name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
              return letter.toUpperCase();
            });          
          formattedoptions.push({
          value: data.id,
          label: str,
        })
      }); 
      setcusoptions(formattedoptions);
    }));

        fetch('https://backend-55jj.onrender.com/get_stk_return_invNo'+'/'+localStorage.getItem('id')).then((res) =>
          res.json().then((jsprovdata) => {
            setOInvoiceNo("STK_" + pad(parseInt(jsprovdata.data), 4) );
            setstkId("STK_" + pad(parseInt(jsprovdata.data), 4) );
          }
        )); 
        fetch('https://backend-55jj.onrender.com/get_cust_rtn_invNo'+'/'+localStorage.getItem('id')).then((res) =>
          res.json().then((jsprovdata1) => {
            setcusId("CUST_" + pad(parseInt(jsprovdata1.data), 4) );
          }
        )); 
        fetch('https://backend-55jj.onrender.com/warehouse_data'+'/'+localStorage.getItem('id')).then((res) =>
          res.json().then((data_party) => {
          $("#order_ware").empty();
          $("#order_ware").append("<option value=''>Select Warehouse</option>");
          for (let i = 0; i < data_party.length; i++) {
            $("#order_ware").append("<option value=\"" + data_party[i].id  + "\">" + data_party[i].ware_name + "</option>");
          }
        })); 
        return () => {
          if (table) table.destroy(true);
        };
      }
      else
      {
        window.location.href = '/login';
      }

  },  []);
  
  
  return (
    <div>
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Return Stock</h5>
        </div>

         <div className='card-header'>
            <div className='d-flex flex-wrap align-items-center justify-content-end gap-2'>
            <div className="col-4 d-flex gap-1">
            <label className="form-label mt-1 w-50">Payment Terms</label>
            <select 
                    id="order_pay_terms"
                    className="form-select"
                    value={payment_due}
                    onChange={(e) => setpayment_due(e.target.value)}
                    required> 
                <option value="receipt">Payment Due on Receipt</option>
            </select>
            </div>
            <div className="col-2 d-flex gap-1">
            <label className="form-label mt-1">Update Stock</label>
            <div className="form-check checked-primary d-flex align-items-center gap-2">
            <input className="form-check-input" type="radio" name="horizontal" id="horizontal1" defaultChecked="true" onClick={handleYesClick}/>
              <label className="form-check-label line-height-1 fw-medium text-secondary-light" htmlFor="horizontal1">Yes{" "}</label>
            </div>
            <div className="form-check checked-primary d-flex align-items-center gap-2">
            <input className="form-check-input" type="radio" name="horizontal" id="horizontal2" onClick={handleNoClick}/>
            <label className="form-check-label line-height-1 fw-medium text-secondary-light" htmlFor="horizontal2">No{" "}</label>
            </div>
            </div>
            <div className="col-1 d-flex gap-1">
            <button className="btn btn-secondary" province="button" onClick={handleReset}>
            <Icon icon="mdi:refresh" className="me-1" /> Reset</button>
            </div>
            <div className="col-1 d-flex gap-2">
            <button className="btn btn-primary" id="btnordersubmit" onClick={handleSubmit} disabled={!canSubmit} >
              <Icon icon='simple-line-icons:check' className='text-xl' /> Save
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
              <div className="col-md-12 mb-3" id="select_party">
                  <label className="form-label">Select Type *</label>
                  <select 
                    id="stk_type"
                    className="form-select"
                    value={rtnType}
                    onChange={handleChangeType}
                    required> 
                    <option value="Supplier">Supplier</option>
                    <option value="Customer">Customer</option>    
                  </select>
              </div>
              <div className="col-md-12 mb-3" id="select_party">
                  <label className="form-label">Search {rtnType} *</label>
                  <div hidden={suppldropHidden} id="suppl_drop">
                  <Select  id="suppl_drop" options={options} onChange={handleChange}/>
                  </div>
                  <div hidden={custHidden} id="cust_drop">
                  <Select  id="cust_drop" options={cusoptions} onChange={handleChangeCus}/>
                  </div>
                </div>
                <div className="col-md-12" >
                  <div className="card-header p-0">
                  <label className="form-label mb-0">{rtnType} Details</label>
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
                  <label className="form-label">Select Warehouse *</label>
                  <select 
                    id="order_ware"
                    className="form-select"
                    value={Warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    required>     
                  </select>
                </div>
            </div>
            <div className="col-md-1">

            </div>
            <div className="col-md-6">
             <div className="col-md-12 mb-3">
                <h6 className="text-md fw-semibold mb-0">Stock Properties</h6>
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
              
                    <DatePicker dateFormat="dd/MM/yyyy" id="date_issue" className="form-control" selected={OInvDate} onChange={date => { setOInvDate(date); }}/>
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
    </div>
  );
};


export default NewStockList;