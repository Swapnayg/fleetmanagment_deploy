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


const ManageProductList = () => {

  const [prodName, setprodName] = useState("");
  const [prodId, setId] = useState(0);
  const [prodcat, setprodcat] = useState("");
  const [prodware, setprodware] = useState("");
  const [prodcode, setprodcode] = useState("");
  const [retltprice, setretltprice] = useState("");
  const [wholeprice, setwholeprice] = useState("");
  const [pdttax, setpdttax] = useState("");
  const [pdtdisc, setpdtdisc] = useState("");
  const [pdtunits, setpdtunits] = useState("");
  const [pdtalert, setpdtalert] = useState("");
  const [pdtdesrip, setpdtdesrip] = useState("");
  const [Edithidden, setEdithidden] = useState(true);
  const [detailshidden, setdetailshidden] = useState(false);

  const canSubmit = prodName.length > 0 && prodcat.length > 0 && prodware.length > 0 && prodcode.length > 0 && retltprice.length > 0 && wholeprice.length > 0 && pdttax.length > 0 && pdtdisc.length > 0 && pdtunits.length > 0 && pdtalert.length > 0 && pdtdesrip.length > 0;
  

  

  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      if($("#btcnproductubmit").text().trim() == "Update")
        {
            fetch('https://backend-55jj.onrender.com/update_product_setup', { 
              method: 'POST', 
              headers:{   'Accept': 'application/json',
                'Content-Type': 'application/json'  },
              body: JSON.stringify({userid:localStorage.getItem('id'), p_prodId:prodId,  p_prodName: prodName, p_prodcat: prodcat, p_prodware :prodware , p_prodcode: prodcode , p_retltprice: retltprice, p_wholeprice: wholeprice, p_pdttax: pdttax, p_pdtdisc: pdtdisc, p_pdtunits: pdtunits, p_pdtalert: pdtalert, p_pdtdesrip: pdtdesrip})
            }).then(res => {
              return res.json();
            }).then(data => {
              if(data.data == "updated")
              {
                $("#btcnproductubmit").text("Save");
                refreshtable();
              }
          });
        }
    }
  }


  const handleReset = () => {
    setprodName("");
    setprodcat("");
    setprodware("");
    setprodcode("");
    setretltprice("");
    setwholeprice("");
    setpdttax("");
    setpdtdisc("");
    setpdtunits("");
    setpdtalert("");
    setpdtdesrip("");
    setEdithidden(true);
    setdetailshidden(false);
    setId(0);
  };


  function refreshtable()
  {
    handleReset();
    if ( $.fn.DataTable.isDataTable('#product_table') ) {
      $('#product_table').DataTable().destroy();
    }
    $('#product_table tbody').empty();
    fetch('https://backend-55jj.onrender.com/product_data'+'/'+localStorage.getItem('id')).then((res) =>
      res.json().then((jsdata) => {
       for (let i = 0; i < jsdata.length; i++) {
        let row = '<tr>';
        var data_obj = JSON.stringify(jsdata[i], null, 2);
        row += '<td>' + (i +1) + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].product_name + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].product_cat_name + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].product_stock + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].product_code + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].product_rental + '</td>';
        row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="product_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="product_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
        row += '</tr>';
        $("#product_table tbody").append(row);
       }
       $("#product_table").DataTable();
      }))
    
  }
  
  useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
        let table;
        $("#prod_category").empty();
        $("#prod_category").append("<option value=''>Select Category</option>");
        fetch('https://backend-55jj.onrender.com/p_category_data'+'/'+localStorage.getItem('id')).then((res) =>
          res.json().then((jsprovdata) => {
          for (let i = 0; i < jsprovdata.length; i++) {
            $("#prod_category").append("<option value=\"" + jsprovdata[i].id  + "\">" + jsprovdata[i].cat_name + "</option>");
          }
        }));

      $(document).on("click", '.product_edit', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        $("#btcnproductubmit").text("Update");
          var t_row =  $(this).closest('tr').index();
          var array_list =  JSON.parse($("#product_table tbody tr:eq("+t_row+") td:eq(6)").find('span').text());
          setprodName(array_list.product_name.toString().trim());
          setId(array_list.id.toString().trim());
          setprodcat(array_list.product_cat.toString().trim());
          setprodware(array_list.product_ware.toString().trim());
          setprodcode(array_list.product_code.toString().trim());
          setretltprice(array_list.product_rental.toString().trim());
          setwholeprice(array_list.product_whole_price.toString().trim());
          setpdttax(array_list.product_tax.toString().trim());
          setpdtdisc(array_list.product_discount.toString().trim());
          setpdtdesrip(array_list.product_description.toString().trim());
          setpdtunits(array_list.product_stock.toString().trim());
          setpdtalert(array_list.product_alert.toString().trim());
          setEdithidden(false);
          setdetailshidden(true);
      });
      $(document).off('click', '.product_delete').on("click", '.product_delete', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        setId(row_id);
        fetch('https://backend-55jj.onrender.com/product_delete/'+row_id+'/'+localStorage.getItem('id'), { 
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
        $("#prod_unit").empty();
        $("#prod_unit").append("<option value=''>Select Warehouse</option>");
        fetch('https://backend-55jj.onrender.com/warehouse_data'+'/'+localStorage.getItem('id')).then((res) =>
            res.json().then((jsprovdata) => {
            for (let i = 0; i < jsprovdata.length; i++) {
              $("#prod_unit").append("<option value=\"" + jsprovdata[i].id  + "\">" + jsprovdata[i].ware_name + "</option>");
            }
        }));
        loadJQueryAndDataTables()
        .then(($) => {
           window.$ = window.jQuery = $;
          fetch('https://backend-55jj.onrender.com/product_data'+'/'+localStorage.getItem('id')).then((res) =>
            res.json().then((jsdata) => {
            for (let i = 0; i < jsdata.length; i++) {
              let row = '<tr>';
              var data_obj = JSON.stringify(jsdata[i], null, 2);
              row += '<td>' + (i +1) + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].product_name + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].product_cat_name + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].product_stock + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].product_code + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].product_rental + '</td>';
              row += '<td ><span style="display:none" class="data_array">'+data_obj+'</span><a class="product_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="product_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
              row += '</tr>';
              $("#product_table tbody").append(row);
            }
            $("#product_table").DataTable();
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
    <div className="col-lg-12" hidden={Edithidden}>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Update Product</h5>
        </div>
        <div className="card-body">
          <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
            {/* Party Name */}
            <div className="col-md-4">
              <label className="form-label">Product Name *</label>
              

              <input
                type="text"
                className="form-control"
                value={prodName}
                onChange={(e) => setprodName(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            {/* province */}
            <div className="col-md-4">
              <label className="form-label"> Select Category *</label>
             
              <select 
              id="prod_category"
                className="form-select"
                value={prodcat}
                onChange={(e) => setprodcat(e.target.value)}
                required
              >
                 
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label"> Select Warehouse *</label>
             
              <select 
              id="prod_unit"
                className="form-select"
                value={prodware}
                onChange={(e) => setprodware(e.target.value)}
                required
              >
                 
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Product Code *</label>
              

              <input
                type="number"
                className="form-control"
                value={prodcode}
                onChange={(e) => setprodcode(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Product Retail Price *</label>
              <div className="input-group">
              <span className="input-group-text bg-base"> <Icon icon='solar:dollar-line-duotone' /> </span>
              <input
                type="text"
                className="form-control"
                value={retltprice}
                onChange={(e) => setretltprice(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Product Wholesale Price *</label>
              <div className="input-group">
              <span className="input-group-text bg-base"> <Icon icon='solar:dollar-line-duotone' /> </span>
              <input
                type="text"
                className="form-control"
                value={wholeprice}
                onChange={(e) => setwholeprice(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Default TAX Rate *</label>
              <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={pdttax}
                onChange={(e) => setpdttax(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
              <span className='input-group-text bg-base'>
              <Icon icon='material-symbols:percent' />
              </span>
            </div>
            <p className="text-sm mt-1 mb-0">You can change Tax rate during invoice creation also.</p>
            </div>

            <div className="col-md-4">
              <label className="form-label">Default Discount Rate *</label>
              <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={pdtdisc}
                onChange={(e) => setpdtdisc(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
              <span className='input-group-text bg-base'>
              <Icon icon='material-symbols:percent' />
              </span>
            </div>
            <p className="text-sm mt-1 mb-0">You can change Discount rate during invoice creation also.</p>
            </div>

            <div className="col-md-4">
              <label className="form-label">Stock Units *</label>
              

              <input
                type="text"
                className="form-control"
                value={pdtunits}
                onChange={(e) => setpdtunits(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Alert Quantity *</label>
              

              <input
                type="text"
                className="form-control"
                value={pdtalert}
                onChange={(e) => setpdtalert(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Description *</label>
              

              <textarea
                type="text"
                className="form-control"
                value={pdtdesrip}
                onChange={(e) => setpdtdesrip(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required></textarea>
            </div>

            {/* Action Buttons */}
            <div className="col-12 mt-3 d-flex gap-2">
              <button className="btn btn-primary" id="btcnproductubmit" onClick={handleSubmit} disabled={!canSubmit} >
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
        <h5 className="card-title mb-0">Product List</h5>
      </div>
      <div className="card-body">
        <table
          className="table bordered-table mb-0"
          id="product_table"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Quantity</th>
              <th scope="col">Code</th>
              <th scope="col">Price</th>
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

export default ManageProductList;