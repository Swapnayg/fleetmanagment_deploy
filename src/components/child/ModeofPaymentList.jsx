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


const ModeofPayList = () => {

    const [modePay, setmodePay] = useState("");
    const [modeId, setId] = useState(0);
    const [mode_status, setmode_status] = useState("");
    const [mode_cash_excl, setcash_excl_mode] = useState("");
    const canSubmit = modePay.length > 0 && mode_status.length > 0 && mode_cash_excl.length > 0;
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      if($("#btnmodesubmit").text().trim() == "Save")
      {
        fetch('https://backend-55jj.onrender.com/add_mode_pay', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({userid:localStorage.getItem('id'), mode_name: modePay, mode_status: mode_status, mode_pay_exclude: mode_cash_excl})
          }).then(res => {
              return res.json();
          }).then(data => {
          if(parseInt(data) != 0)
          {
              refreshtable();
          }
        });
      }
      else if($("#btnmodesubmit").text().trim() == "Update")
        {
            fetch('https://backend-55jj.onrender.com/update_mode_of_pay', { 
              method: 'POST', 
              headers:{   'Accept': 'application/json',
                'Content-Type': 'application/json'  },
              body: JSON.stringify({userid:localStorage.getItem('id'), mode_id:modeId, mode_name: modePay, mode_status: mode_status, mode_pay_exclude: mode_cash_excl})
            }).then(res => {
              return res.json();
            }).then(data => {
              if(data.data == "updated")
              {
                $("#btnmodesubmit").text("Save");
                refreshtable();
              }
          });
        }
    }
  }

  const handleReset = () => {
    setmodePay("");
    setmode_status("");
    setcash_excl_mode("");
    setId(0);
  };

  function refreshtable()
  {
    handleReset();
    if ( $.fn.DataTable.isDataTable('#mode_pay_table') ) {
      $('#mode_pay_table').DataTable().destroy();
    }
    $('#mode_pay_table tbody').empty();
    fetch('https://backend-55jj.onrender.com/mode_of_pay_data'+'/'+localStorage.getItem('id')).then((res) =>
      res.json().then((jsdata) => {
       for (let i = 0; i < jsdata.length; i++) {
        let row = '<tr>';
        row += '<td>' + (i +1) + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].pay_name + '</td>';
        row += '<td style="text-transform:capitalize" data-label='+jsdata[i].pay_status+'>' + jsdata[i].pay_status + '</td>';
        row += '<td style="text-transform:capitalize" data-label='+jsdata[i].exlc_in_cash+'>' + jsdata[i].exlc_in_cash + '</td>';
        row += '<td ><a class="mode_pay_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="mode_pay_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
        row += '</tr>';
        $("#mode_pay_table tbody").append(row);
       }
       $("#mode_pay_table").DataTable();
      }))
    
  }
  
  useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
      $(document).on("click", '.mode_pay_edit', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        $("#btnmodesubmit").text("Update");
        var t_row =  $(this).closest('tr').index();
        var modePay = $("#mode_pay_table tbody tr:eq("+t_row+") td:eq(1)").html();
        var mode_status = $("#mode_pay_table tbody tr:eq("+t_row+") td:eq(2)").attr("data-label");
        var mode_cash_excl = $("#mode_pay_table tbody tr:eq("+t_row+") td:eq(3)").attr("data-label");
        $("#edit_id").val(row_id);
        setId(row_id);
        setmodePay(modePay.toString().trim());
        setmode_status(mode_status.toString().trim());
        setcash_excl_mode(mode_cash_excl.toString().trim());
      });
      $(document).off('click', '.mode_pay_delete').on("click", '.mode_pay_delete', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        setId(row_id);
        fetch('https://backend-55jj.onrender.com/mode_of_pay_delete/'+row_id+'/'+localStorage.getItem('id'), { 
          method: 'DELETE', 
          headers: { 'Content-province': 'application/json', }, 
          body: JSON.stringify({})
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
          fetch('https://backend-55jj.onrender.com/mode_of_pay_data'+'/'+localStorage.getItem('id')).then((res) =>
            res.json().then((jsdata) => {
            for (let i = 0; i < jsdata.length; i++) {
              let row = '<tr>';
              row += '<td>' + (i +1) + '</td>';
              row += '<td style="text-transform:capitalize">' + jsdata[i].pay_name + '</td>';
              row += '<td style="text-transform:capitalize" data-label='+jsdata[i].pay_status+'>' + jsdata[i].pay_status + '</td>';
              row += '<td style="text-transform:capitalize" data-label='+jsdata[i].exlc_in_cash+'>' + jsdata[i].exlc_in_cash + '</td>';
              row += '<td ><a class="mode_pay_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="mode_pay_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
              row += '</tr>';
              $("#mode_pay_table tbody").append(row);
            }
            $("#mode_pay_table").DataTable();
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
    <div className="col-lg-12">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Add Mode of Payments</h5>
        </div>
        <div className="card-body">
          <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
            {/* Party Name */}
            <div className="col-md-3">
              <label className="form-label"> Payment Mode *</label>
              

              <input
                type="text"
                className="form-control"
                value={modePay}
                onChange={(e) => setmodePay(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            {/* province */}
            <div className="col-md-3">
              <label className="form-label">Status *</label>
              <select 
                className="form-select"
                value={mode_status}
                onChange={(e) => setmode_status(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">In-Active</option>
                
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Status *</label>
              <select 
                className="form-select"
                value={mode_cash_excl}
                onChange={(e) => setcash_excl_mode(e.target.value)}
                required
              >
                <option value="">Select Cash Exclude </option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
                
              </select>
            </div>

            {/* Action Buttons */}
            <div className="col-12 mt-3 d-flex gap-2">
              <button className="btn btn-primary" id="btnmodesubmit" onClick={handleSubmit} disabled={!canSubmit} >
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

    <div className="card basic-data-table">
      <div className="card-header">
        <h5 className="card-title mb-0">Cities List</h5>
      </div>
      <div className="card-body">
        <table
          className="table bordered-table mb-0"
          id="mode_pay_table"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Mode of Payment</th>
              <th scope="col">Status</th>
              <th scope="col">Exclude In Cash</th>
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

export default ModeofPayList;