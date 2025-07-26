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


const AccountSubTypeList = () => {

    const [accntName, setaccntName] = useState("");
    const [accntSubName, setaccntSubName] = useState("");
    const [accntId, setId] = useState(0);
    const [accnt_status, setaccnt_status] = useState("");
    const canSubmit = accntName.length > 0 && accnt_status.length > 0;
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      if($("#btcnsubaccntubmit").text().trim() == "Save")
      {
        fetch('https://backend-55jj.onrender.com/add_sub_acconttype_values', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({ a_accnt_name: accntName, a_sub_accnt_name: accntSubName, a_accnt_status: accnt_status, userid:localStorage.getItem('id')})
          }).then(res => {
              return res.json();
          }).then(data => {
          if(parseInt(data) != 0)
          {
              refreshtable();
          }
        });
      }
      else if($("#btcnsubaccntubmit").text().trim() == "Update")
        {
            fetch('https://backend-55jj.onrender.com/update_account_sub_types_setup', { 
              method: 'POST', 
              headers:{   'Accept': 'application/json',
                'Content-Type': 'application/json'  },
              body: JSON.stringify({a_accnt_id:accntId,   a_accnt_name: accntName,a_sub_accnt_name: accntSubName, a_accnt_status: accnt_status, userid:localStorage.getItem('id')})
            }).then(res => {
              return res.json();
            }).then(data => {
              if(data.data == "updated")
              {
                $("#btcnsubaccntubmit").text("Save");
                refreshtable();
              }
          });
        }
    }
  }

  const handleReset = () => {
    setaccntName("");
    setaccntSubName("");
    setaccnt_status("");
    setId(0);
  };

  function refreshtable()
  {
    handleReset();
    if ( $.fn.DataTable.isDataTable('#accnt_subtype_table') ) {
      $('#accnt_subtype_table').DataTable().destroy();
    }
    $('#accnt_subtype_table tbody').empty();
    fetch('https://backend-55jj.onrender.com/account_sub_type_data'+'/'+localStorage.getItem('id')).then((res) =>
      res.json().then((jsdata) => {
       for (let i = 0; i < jsdata.length; i++) {
        let row = '<tr>';
        row += '<td>' + (i +1) + '</td>';
        row += '<td style="text-transform:capitalize" data-label='+jsdata[i].type_name_id+'>' + jsdata[i].type_name_name + '</td>';
        row += '<td style="text-transform:capitalize">' + jsdata[i].sub_type_name + '</td>';
        row += '<td style="text-transform:capitalize" data-label='+jsdata[i].type_status+'>' + jsdata[i].type_status + '</td>';
        if(jsdata[i].username.toString().trim() == 'user')
        {
          row += '<td ><a class="accnt_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="accnt_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
        }
        else
        {
          row += '<td></td>';
        }
        row += '</tr>';
        $("#accnt_subtype_table tbody").append(row);
       }
       $("#accnt_subtype_table").DataTable();
      }))
    
  }
  
  useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
      let table;
      $("#main_accnt").empty();
        $("#main_accnt").append("<option value=''>Select Account</option>");
          fetch('https://backend-55jj.onrender.com/account_type_data'+'/'+localStorage.getItem('id')).then((res) =>
            res.json().then((jsprovdata) => {
              for (let i = 0; i < jsprovdata.length; i++) {
                $("#main_accnt").append("<option style='text-transform:capitalize' value=\"" + jsprovdata[i].id  + "\">" + jsprovdata[i].type_name + "</option>");     
        }
      }));
    $(document).on("click", '.accnt_sub_edit', function(e){
      e.preventDefault();
      var row_id = $(this).attr("data-lable");
      $("#btcnsubaccntubmit").text("Update");
      var t_row =  $(this).closest('tr').index();
      var accntName = $("#accnt_subtype_table tbody tr:eq("+t_row+") td:eq(1)").attr("data-label");
      var accntSubName = $("#accnt_subtype_table tbody tr:eq("+t_row+") td:eq(2)").html();
      var accnt_status = $("#accnt_subtype_table tbody tr:eq("+t_row+") td:eq(3)").attr("data-label");
      $("#edit_id").val(row_id);
      setId(row_id);
      setaccntName(accntName.toString().trim());
      setaccntSubName(accntSubName.toString().trim());
      setaccnt_status(accnt_status.toString().trim());
    });
    $(document).off('click', '.accnt_sub_delete').on("click", '.accnt_sub_delete', function(e){
      e.preventDefault();
      var row_id = $(this).attr("data-lable");
      setId(row_id);
      fetch('https://backend-55jj.onrender.com/accountsub_type_delete/'+row_id+'/'+localStorage.getItem('id'), { 
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
    loadJQueryAndDataTables()
      .then(($) => {
         window.$ = window.jQuery = $;
        fetch('https://backend-55jj.onrender.com/account_sub_type_data'+'/'+localStorage.getItem('id')).then((res) =>
          res.json().then((jsdata) => {
           for (let i = 0; i < jsdata.length; i++) {
            let row = '<tr>';
            row += '<td>' + (i +1) + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata[i].type_name_id+'>' + jsdata[i].type_name_name + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].sub_type_name + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata[i].type_status+'>' + jsdata[i].type_status + '</td>';
            if(jsdata[i].username.toString().trim() == 'user')
            {
              row += '<td ><a class="accnt_sub_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a><a class="accnt_sub_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a></td>';
            }
            else
            {
              row += '<td></td>';
            }
            row += '</tr>';
            $("#accnt_subtype_table tbody").append(row);
           }
           $("#accnt_subtype_table").DataTable();
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
          <h5 className="card-title mb-0">Add Account Sub Type</h5>
        </div>
        <div className="card-body">
          <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
            {/* Party Name */}
            <div className="col-md-3">
              <label className="form-label">Select Account *</label>
              
              <select 
              id="main_accnt"
                className="form-select"
                value={accntName}
                onChange={(e) => setaccntName(e.target.value)}
                required
              >   
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Sub Account Name *</label>
              

              <input
                type="text"
                className="form-control"
                value={accntSubName}
                onChange={(e) => setaccntSubName(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            {/* province */}
            <div className="col-md-3">
              <label className="form-label">Select Status *</label>
              <select 
                className="form-select"
                value={accnt_status}
                onChange={(e) => setaccnt_status(e.target.value)}
                required
              >
                 <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">In-Active</option>
              </select>
             
            </div>

            {/* Action Buttons */}
            <div className="col-12 mt-3 d-flex gap-2">
              <button className="btn btn-primary" id="btcnsubaccntubmit" onClick={handleSubmit} disabled={!canSubmit} >
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
        <h5 className="card-title mb-0">Category List</h5>
      </div>
      <div className="card-body">
        <table
          className="table bordered-table mb-0"
          id="accnt_subtype_table"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col">Account Name</th>
              <th scope="col">Sub Account</th>
              <th scope="col">Account Status</th>
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

export default AccountSubTypeList;