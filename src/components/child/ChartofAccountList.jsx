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



const ChartofAccountList = () => {

    const [acctName, setacctName] = useState("");
    const [acctId, setId] = useState(0);
    const [acctcode, setacctcode] = useState("");
    const [accttype, setaccttype] = useState("");
    const [acctstatus, setacctstatus] = useState("");
    const [acctdescp, setacctdescp] = useState("");

    const [hidden, setHidden] = useState(true);
    const [l_partyName, setl_partyName] = useState("");
    const [l_partyBal, setl_partyBal] = useState("");
    const [l_partyId, setl_partyId] = useState("");
    const [l_charttype, setl_charttype] = useState("");
    const [mainhidden, setHiddenmain] = useState(false);
    const [ledPartId, setledPartId] = useState(0);
    const [ledParChatId, setledParChatId] = useState(0);

    const canSubmit = acctName.length > 0 && acctcode.length > 0 && accttype.length > 0 && acctstatus.length > 0 && acctdescp.length > 0;

    const handlePrint = (e) => {
      var party_type = l_charttype;
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
      const rows = document.querySelectorAll("#chart_ledger tr");
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
          setHiddenmain(false);
          setHidden(true);
          setledPartId(0);
          setledParChatId(0);
          setl_partyName("");
          setl_partyBal("");
          setl_partyId(0);
          $('#chart_ledger tbody').empty();
      };

    const handleChange = (option) => {
      setSelectedOption(option);
      console.log(`Option selected:`, option);
    };
    
  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      if($("#btcaccntsubmit").text().trim() == "Save")
      {
        fetch('https://backend-55jj.onrender.com/add_chart_of_account_values', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({ userid:localStorage.getItem('id'), a_acctName: acctName, a_acctcode: acctcode, a_accttype: accttype, a_acctstatus: acctstatus, a_acctdescp: acctdescp})
          }).then(res => {
              return res.json();
          }).then(data => {
            if(data.data.toString().trim() == "exits")
            {
              withReactContent(Swal).fire({
                icon: "error",
                title: "Oops...",
                text: "Account Already Exists!",
                draggable: true
              });
              handleReset();
            }
            else{
              if(parseInt(data) != 0)
                {
                    refreshtable();
                }
            }
        });
      }
      else if($("#btcaccntsubmit").text().trim() == "Update")
        {
            fetch('https://backend-55jj.onrender.com/update_chart_of_account_setup', { 
              method: 'POST', 
              headers:{   'Accept': 'application/json',
                'Content-Type': 'application/json'  },
              body: JSON.stringify({userid:localStorage.getItem('id'), a_acctId:acctId,  a_acctName: acctName, a_acctcode: acctcode, a_accttype: accttype, a_acctstatus: acctstatus, a_acctdescp: acctdescp})
            }).then(res => {
              return res.json();
            }).then(data => {
              if(data.data == "updated")
              {
                $("#btcaccntsubmit").text("Save");
                refreshtable();
              }
          });
        }
    }
  }

  const handleReset = () => {
    setacctName("");
    setacctcode("");
    setaccttype("");
    setacctstatus("");
    setacctdescp("");
    setId(0);
  };

  function refreshtable()
  {
    handleReset();
    if ( $.fn.DataTable.isDataTable('#accnt_table') ) {
      $('#accnt_table').DataTable().destroy();
    }
    $('#accnt_table tbody').empty();
    fetch('https://backend-55jj.onrender.com/chart_of_account_data' +'/'+localStorage.getItem('id') ).then((res) =>
      res.json().then((jsdata) => {
       for (let i = 0; i < jsdata.length; i++) {
          if(jsdata[i].account_mode.toString().trim() == "general" || jsdata[i].account_mode.toString().trim() == "commission")
          {
            var delete_txt = '';
            if( jsdata[i].accnt_name == "commission")
            {
              delete_txt = "";
            }
            else
            {
              delete_txt = '<a class="accnt_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a>';
            }
            let row = '<tr>';
            row += '<td>' + (i +1) + '</td>';
            row += '<td style="text-transform:capitalize">' + jsdata[i].accnt_name + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata[i].accnt_code+'>' + jsdata[i].accnt_code + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata[i].accnt_type+'>' + jsdata[i].accnt_type_name + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata[i].accnt_description+'>' + jsdata[i].accnt_description + '</td>';
            row += '<td style="text-transform:capitalize" data-label='+jsdata[i].accnt_status+'>' + jsdata[i].accnt_status + '</td>';
            row += '<td ><a class="chart_view w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center" data-lable = '+jsdata[i].id+'  data-chart = '+jsdata[i].account_mode+' data-ch-name = '+jsdata[i].accnt_name+' ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconamoon" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="currentColor" d="M17.293 2.293C17 2.586 17 3.057 17 4v13c0 .943 0 1.414.293 1.707S18.057 19 19 19s1.414 0 1.707-.293S21 17.943 21 17V4c0-.943 0-1.414-.293-1.707S19.943 2 19 2s-1.414 0-1.707.293M10 7c0-.943 0-1.414.293-1.707S11.057 5 12 5s1.414 0 1.707.293S14 6.057 14 7v10c0 .943 0 1.414-.293 1.707S12.943 19 12 19s-1.414 0-1.707-.293S10 17.943 10 17zM3.293 9.293C3 9.586 3 10.057 3 11v6c0 .943 0 1.414.293 1.707S4.057 19 5 19s1.414 0 1.707-.293S7 17.943 7 17v-6c0-.943 0-1.414-.293-1.707S5.943 9 5 9s-1.414 0-1.707.293M3 21.25a.75.75 0 0 0 0 1.5h18a.75.75 0 0 0 0-1.5z"></path></g></svg></a><a class="accnt_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a>'+ delete_txt +'</td>';
            row += '</tr>';
            $("#accnt_table tbody").append(row);
          }
       }
       $("#accnt_table").DataTable(
       );
      }))
    
  }
  
  useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
        let table;
        $("#chart_main_accnt").empty();
              $("#chart_main_accnt").append("<option value=''>Select Account</option>");
                fetch('https://backend-55jj.onrender.com/chart_accnt_type_data'+'/'+localStorage.getItem('id')).then((res) =>
                  res.json().then((jsprovdata) => {
                    let sel_string = '';
                    for (let i = 0; i < jsprovdata.length; i++) {
                      sel_string += "<optgroup style='text-transform:capitalize'  label="+jsprovdata[i].accnt_type +">";
                      var sub_data = JSON.parse(JSON.stringify(jsprovdata[i].sub_accnt));
                      for (let j = 0; j < sub_data.length; j++) {
                        sel_string += "<option style='text-transform:capitalize' value=\"" + sub_data[j].sub_id  + "\">" +sub_data[j].sub_type  + "</option>"; 
                      }
                      sel_string += "</optgroup>";
                    }
                    $("#chart_main_accnt").append(sel_string);
        }));
      $(document).off('click', '.chart_view').on("click", '.chart_view', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        var chart_id = $(this).attr("data-chart");
        var chart_type = $(this).attr("data-ch-name");  
        var ledg_type = "";
        setl_charttype(chart_id);
        setHidden(false);
        setHiddenmain(true);
        setledPartId(row_id);
        setledParChatId(chart_id);
        fetch('https://backend-55jj.onrender.com/ledger_account_data', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({ userid:localStorage.getItem('id'), ledg_id: row_id, ledg_chart_id : row_id, ledger_type :chart_id })
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
              $("#chart_ledger tbody").append(row);
            }
          });   
      });

  
      $(document).on("click", '.accnt_edit', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        $("#btcaccntsubmit").text("Update");
        var t_row =  $(this).closest('tr').index();
        var acctName = $("#accnt_table tbody tr:eq("+t_row+") td:eq(1)").html();
        var acctcode = $("#accnt_table tbody tr:eq("+t_row+") td:eq(2)").attr("data-label");
        var accttype = $("#accnt_table tbody tr:eq("+t_row+") td:eq(3)").attr("data-label");
        var acctdescp = $("#accnt_table tbody tr:eq("+t_row+") td:eq(4)").attr("data-label");
        var acctstatus = $("#accnt_table tbody tr:eq("+t_row+") td:eq(5)").attr("data-label");
        $("#edit_id").val(row_id);
        setId(row_id);
        setacctName(acctName.toString().trim());
        setacctcode(acctcode.toString().trim());
        setaccttype(accttype.toString().trim());
        setacctdescp(acctdescp.toString().trim());
        setacctstatus(acctstatus.toString().trim());
      });
      $(document).off('click', '.accnt_delete').on("click", '.accnt_delete', function(e){
        e.preventDefault();
        var row_id = $(this).attr("data-lable");
        setId(row_id);
        fetch('https://backend-55jj.onrender.com/chart_of_accnt_delete/'+row_id +'/'+localStorage.getItem('id'), { 
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
          fetch('https://backend-55jj.onrender.com/chart_of_account_data'+'/'+localStorage.getItem('id')).then((res) =>
            res.json().then((jsdata) => {
              console.log(jsdata);
            for (let i = 0; i < jsdata.length; i++) {
                if(jsdata[i].account_mode.toString().trim() == "general" || jsdata[i].account_mode.toString().trim() == "commission")
                {
                  var delete_txt = '';
                  if(jsdata[i].account_mode.toString().trim() == "commission")
                  {
                    delete_txt = "";
                  }
                  else
                  { 
                    delete_txt = '<a class="accnt_delete w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"></path></g></svg></a>';
                  }
                let row = '<tr>';
                row += '<td>' + (i +1) + '</td>';
                row += '<td style="text-transform:capitalize">' + jsdata[i].accnt_name + '</td>';
                row += '<td style="text-transform:capitalize" data-label='+jsdata[i].accnt_code+'>' + jsdata[i].accnt_code + '</td>';
                row += '<td style="text-transform:capitalize" data-label='+jsdata[i].accnt_type+'>' + jsdata[i].accnt_type_name + '</td>';
                row += '<td style="text-transform:capitalize" data-label='+jsdata[i].accnt_description+'>' + jsdata[i].accnt_description + '</td>';
                row += '<td style="text-transform:capitalize" data-label='+jsdata[i].accnt_status+'>' + jsdata[i].accnt_status + '</td>';
                row += '<td ><a class="chart_view w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center" data-lable = '+jsdata[i].id+'  data-chart = '+jsdata[i].account_mode+'  data-ch-name = '+jsdata[i].accnt_name+' ><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--iconamoon" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="currentColor" d="M17.293 2.293C17 2.586 17 3.057 17 4v13c0 .943 0 1.414.293 1.707S18.057 19 19 19s1.414 0 1.707-.293S21 17.943 21 17V4c0-.943 0-1.414-.293-1.707S19.943 2 19 2s-1.414 0-1.707.293M10 7c0-.943 0-1.414.293-1.707S11.057 5 12 5s1.414 0 1.707.293S14 6.057 14 7v10c0 .943 0 1.414-.293 1.707S12.943 19 12 19s-1.414 0-1.707-.293S10 17.943 10 17zM3.293 9.293C3 9.586 3 10.057 3 11v6c0 .943 0 1.414.293 1.707S4.057 19 5 19s1.414 0 1.707-.293S7 17.943 7 17v-6c0-.943 0-1.414-.293-1.707S5.943 9 5 9s-1.414 0-1.707.293M3 21.25a.75.75 0 0 0 0 1.5h18a.75.75 0 0 0 0-1.5z"></path></g></svg></a><a class="accnt_edit w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center" data-lable='+jsdata[i].id+'><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--lucide" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></g></svg></a>'+delete_txt+'</td>';
                row += '</tr>';
                $("#accnt_table tbody").append(row);
              }
            }
            $("#accnt_table").DataTable(
            );
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

        <div className="col-lg-12" id="ledger_details" hidden={hidden}>
        <div className="card">
        <div className="col-md-3">
        <button type="button" className="custom_back btn rounded-pill btn-outline-primary-600 radius-8 px-20 py-11 d-flex align-items-center gap-2"  onClick={handleBack}  >
            <Icon icon="mingcute:square-arrow-left-line" className="text-xl" />{" "} Back To List </button>
            </div>
            <div className="card-header border-bottom-0 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0">Party Ledger Statement</h5>
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
                <table className="table mb-0" id="chart_ledger">
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
    <div className="col-lg-12"  hidden={mainhidden}>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Add Chart of Accounts</h5>
        </div>
        <div className="card-body">
          <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
            {/* Party Name */}
            <div className="col-md-3">
              <label className="form-label">Account Name *</label>
              <input
                type="text"
                className="form-control"
                value={acctName}
                onChange={(e) => setacctName(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>

            {/* province */}
            <div className="col-md-3">
              <label className="form-label">Account Code *</label>
             
              <input
                type="text"
                className="form-control"
                value={acctcode}
                onChange={(e) => setacctcode(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Select Account *</label>
              
              <select 
              id="chart_main_accnt"
                className="form-select"
                value={accttype}
                onChange={(e) => setaccttype(e.target.value)}
                required
              >   
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Select Status *</label>
              <select 
                className="form-select"
                value={acctstatus}
                onChange={(e) => setacctstatus(e.target.value)}
                required
              >
                 <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">In-Active</option>
              </select>
            </div>
            <div className="col-md-9">
              <label className="form-label">Account Description *</label>
             
              <textarea
                type="text"
                className="form-control"
                value={acctdescp}
                onChange={(e) => setacctdescp(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                required
              />
            </div>


            {/* Action Buttons */}
            <div className="col-12 mt-3 d-flex gap-2">
              <button className="btn btn-primary" id="btcaccntsubmit" onClick={handleSubmit} disabled={!canSubmit} >
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

    <div className="card basic-data-table"  hidden={mainhidden}>
      <div className="card-header">
        <h5 className="card-title mb-0">Category List</h5>
      </div>
      <div className="card-body">
        <table
          className="table bordered-table mb-0"
          id="accnt_table"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope="col">Sno</th>
              <th scope="col"> Account Name</th>
              <th scope="col">Account Code</th>
              <th scope="col">Account Type</th>
              <th scope="col">Description</th>
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

export default ChartofAccountList;