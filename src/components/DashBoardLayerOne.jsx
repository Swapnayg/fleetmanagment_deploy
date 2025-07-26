"use client";
import useReactApexChart from "@/hook/useReactApexChart";
import React, { useState } from "react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import $  from 'jquery'; 

const DashBoardLayerOne = () => {

const [noCustm, setnoCustm] = useState("");
const [noSuppl, setnoSuppl] = useState("");
const [noGoodParty, setnoGoodParty] = useState("");
const [noOilParty, setnoOilParty] = useState("");
const [noGoodVeh, setnoGoodVeh] = useState("");
const [noOilVeh, setnoOilVeh] = useState("");
const [totalRevenue, settotalRevenue] = useState("");
const [totalExpense, settotalExpense] = useState("");
const [totalProfit, settotalProfit] = useState("");
const [totalReceive, settotalReceive] = useState("");
const [Totalpayable, setTotalpayable] = useState("");

const [perTotalRevenue, setperTotalRevenue] = useState("");
const [perTotalExpense, setperTotalExpense] = useState("");
const [perTotalProfit, setperTotalProfit] = useState("");
const [perTotalReceive, setperTotalReceive] = useState("");
const [perTotalpayable, setperTotalpayable] = useState("");

const [totalRevenueStatus, settotalRevenueStatus] = useState("");
const [totalExpenseStatus, settotalExpenseStatus] = useState("");
const [totalProfitStatus, settotalProfitStatus] = useState("");
const [totalReceiveStatus, settotalReceiveStatus] = useState("");
const [TotalpayableStatus, setTotalpayableStatus] = useState("");

const [chartExpenses, setchartExpenses] = useState("");
const [chartIncome, setchartIncome] = useState("");


function numberWithCommas(x) {
  return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
}


const handleIncomeExp = (e) => {
   e.preventDefault();
   fetch("https://backend-55jj.onrender.com/main_area_data",{method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({"overallType":e.target.value, userid:localStorage.getItem('id')})
      }).then((res) =>
      res.json().then((jsprovdata) => {
        setchartIncome(numberWithCommas(jsprovdata.TotalExp).toString().trim().replace("-",""));
        setchartExpenses(numberWithCommas(jsprovdata.TotalPurch).toString().trim().replace("-",""));
      setcandleseriesData([
         {
            name: "Income",
            data: jsprovdata.income_data,
         },
         {
            name: "Expense",
            data: jsprovdata.purchase_data,
         },
       ]);
   }));
}

const [candleseriesData, setcandleseriesData] = useState([
    {
      name: "Income",
      data: [30, 40, 35, 50, 49, 60, 70,78, 67, 89, 46,78],
    },
     {
      name: "Expense",
      data: [40, 50, 25, 45, 55, 20, 60, 48, 56,78,56, 78],
    },
  ]
);

const [candleoptions, setcandleoptions] = useState({
    chart: {
      type: "line",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors:["#487FFF", "#EF4A00"], // Line color
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories:  [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    },
    title: {
      text: "Monthly Sales",
      align: "center",
    },
  });


const [doNutseriesData, setdoNutseriesData] = useState([30, 30, 20]);

 const [doNutoptions, setdoNutoptions] = useState({       
   colors: ["#FF9F29", "#487FFF", "#45B369", "#9935FE"],
   labels: ["Expense", "Revenue", "Profit"],
   legend: {
     show: false,
   },
   chart: {
     type: "donut",
     height: 270,
     sparkline: {
       enabled: true, // Remove whitespace
     },
     margin: {
       top: 0,
       right: 0,
       bottom: 0,
       left: 0,
     },
     padding: {
       top: 0,
       right: 0,
       bottom: 0,
       left: 0,
     },
   },
   stroke: {
     width: 0,
   },
   dataLabels: {
     enabled: true,
   },
   responsive: [
     {
       breakpoint: 480,
       options: {
         chart: {
           width: 200,
         },
         legend: {
           position: "bottom",
         },
       },
     },
   ],
  });
 

function addProgressBar(stk, alert, perc) {
  var progress_txt = ''
  var backColor = ''
  if(parseInt(stk) == 0)
  {
    progress_txt = "Out of Stock";
    backColor = '#ced4da'  ;
  }
  else if(parseInt(stk) >= parseInt(alert))
  {
    progress_txt = stk + " High Stock";
    backColor = '#198754';
  }
  else
  {
    progress_txt = stk + " Low Stock";
    backColor = '#e30a0a';
  }
  const progressBar = `
    <div className='max-w-112 mx-auto'>
      <div className='w-100'>
        <div class="progress progress-sm rounded-pill'" role="progressbar" style="width: ${perc}%;background:`+backColor+`" aria-valuenow="${perc}" aria-valuemin="0" aria-valuemax="100"><div className='progress-bar  rounded-pill'
        style="width: 40%;" /></div></div> <span className='mt-12 text-secondary-light text-sm fw-medium'> `+ progress_txt +` </span></div>`;
        return progressBar;
    }
const handleOverall = (e) => {
   e.preventDefault();
   fetch("https://backend-55jj.onrender.com/main_overall_data",{method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({"overallType":e.target.value, userid:localStorage.getItem('id')})
      }).then((res) =>
      res.json().then((jsprovdata) => {
      setdoNutseriesData([parseInt(jsprovdata.cm_total_revenue), parseInt(jsprovdata.cm_total_expense), parseInt(jsprovdata.cm_total_income)]);
   }));   
}


 useEffect(() => {
  var username = localStorage.getItem('username');
  if (username) {
     fetch("https://backend-55jj.onrender.com/main_overall_data",{method: 'POST', 
         headers: {   'Accept': 'application/json',
         'Content-Type': 'application/json'  }, 
         body: JSON.stringify({"overallType":'year', userid:localStorage.getItem('id')})
         }).then((res) =>
         res.json().then((jsprovdata) => {
         setdoNutseriesData([parseInt(jsprovdata.cm_total_revenue), parseInt(jsprovdata.cm_total_expense), parseInt(jsprovdata.cm_total_income)]);
      }));
    fetch("https://backend-55jj.onrender.com/main_area_data",{method: 'POST', 
         headers: {   'Accept': 'application/json',
         'Content-Type': 'application/json'  }, 
         body: JSON.stringify({"overallType":'year', userid:localStorage.getItem('id') })
         }).then((res) =>
         res.json().then((jsprovdata) => {
            setchartIncome(numberWithCommas(jsprovdata.TotalExp).toString().trim().replace("-",""));
            setchartExpenses(numberWithCommas(jsprovdata.TotalPurch).toString().trim().replace("-",""));
            setcandleseriesData([
            {
               name: "Income",
               data: jsprovdata.income_data,
            },
            {
               name: "Expense",
               data: jsprovdata.purchase_data,
            },
         ]);
      }));   
    fetch('https://backend-55jj.onrender.com/main_dashboard_data'+'/'+localStorage.getItem('id')).then((res) =>
      res.json().then((jsprovdata) => {
        settotalRevenue(numberWithCommas(jsprovdata.cm_total_revenue).toString().trim().replace("-",""));
        setperTotalRevenue(jsprovdata.total_rev_diff.toString().trim().replace("-",""));
        settotalRevenueStatus(jsprovdata.total_rev_status);
        settotalExpense(numberWithCommas(jsprovdata.cm_total_expense).toString().trim().replace("-",""));
        setperTotalExpense(jsprovdata.total_exp_diff.toString().trim().replace("-",""));
        settotalExpenseStatus(jsprovdata.total_exp_status);
        settotalProfit(numberWithCommas(jsprovdata.cm_total_income).toString().trim().replace("-",""));
        setperTotalProfit(jsprovdata.total_income_diff.toString().trim().replace("-",""));
        settotalProfitStatus(jsprovdata.total_income_status);
        settotalReceive(numberWithCommas(jsprovdata.cm_total_receivable).toString().trim().replace("-",""));
        setperTotalReceive(jsprovdata.total_receivable_diff.toString().trim().replace("-",""));
        settotalReceiveStatus(jsprovdata.total_receivable_status);
        setTotalpayable(numberWithCommas(jsprovdata.cm_total_payable).toString().trim().replace("-",""));
        setperTotalpayable(jsprovdata.total_payable_diff.toString().trim().replace("-",""));
        setTotalpayableStatus(jsprovdata.total_payable_status);
        setnoCustm(jsprovdata.customerNO);
        setnoSuppl(jsprovdata.SupplNo);
        setnoGoodParty(jsprovdata.GoodsPartyNo);
        setnoOilParty(jsprovdata.OilsPartyNo);
        setnoGoodVeh(jsprovdata.GoodsVehNo);
        setnoOilVeh(jsprovdata.OilsVehNo);
        jsprovdata.payable_data.sort(function(a,b){return  b.ledgerBal - a.ledgerBal;});
        jsprovdata.receivable_data.sort(function(a,b){return b.ledgerBal - a.ledgerBal;});
        for (let i = 0; i < jsprovdata.payable_data.length; i++) {
          if(parseInt(jsprovdata.payable_data[i].ledgerBal) > 0)
          {
            let row = '<tr>';
            row += '<td>' + (i +1) + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.payable_data[i].accountName + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.payable_data[i].ledgerBal + '</td>';
            row += '</tr>';
            $("#tblPayable tbody").append(row);
          }
        }

        for (let j = 0; j < jsprovdata.receivable_data.length; j++) {
          if(parseInt(jsprovdata.receivable_data[j].ledgerBal) > 0)
          {
            let row = '<tr>';
            row += '<td>' + (j +1) + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.receivable_data[j].accountName + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.receivable_data[j].ledgerBal + '</td>';
            row += '</tr>';
            $("#tblReceive tbody").append(row);
          }
        }

        for (let k = 0; k < jsprovdata.stk_data.length; k++) {
          let row = '<tr>';
          row += '<td>' + (k +1) + '</td>';
          row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.stk_data[k].product_name + '</td>';
          row += '<td style="text-transform:capitalize" class="text-secondary-light">Rs. ' + jsprovdata.stk_data[k].product_rental + '</td>';
          row += '<td style="text-transform:capitalize" class="text-secondary-light">Rs. ' + jsprovdata.stk_data[k].product_whole_price + '</td>';
          row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.stk_data[k].product_tax + '</td>';
          row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.stk_data[k].product_discount + '</td>';
          row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.stk_data[k].sold_items + '</td>';
          row += '<td style="text-transform:capitalize" class="text-secondary-light">'+ addProgressBar(jsprovdata.stk_data[k].product_stock ,jsprovdata.stk_data[k].product_alert ,jsprovdata.stk_data[k].perStk ) +'</td>';
          row += '</tr>';
          $("#tblStockDeatils tbody").append(row);
        }
    }));
  }
  else
  {
    window.location.href = '/login';
  }
  }, []);
  return (
    <>
<div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-1 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Total Revenue</p>
                                <h6 className="mb-0">Rs. {totalRevenue}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="lineicons:revenue"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                            {totalRevenueStatus == 'high'? <span className="d-inline-flex align-items-center gap-1 text-success-main">
                                <Icon icon="bxs:up-arrow" className="text-xs" /> +{perTotalRevenue}
                            </span> :  <span className="d-inline-flex align-items-center gap-1 text-danger-main">
                                <Icon icon="bxs:down-arrow" className="text-xs" /> -{perTotalRevenue}
                            </span>}
                            Last 30 days revenue
                        </p>
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-2 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">
                                    Total Expenses
                                </p>
                                <h6 className="mb-0">Rs. {totalExpense}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="icon-park-outline:expenses"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                           {totalExpenseStatus == 'high'? <span className="d-inline-flex align-items-center gap-1 text-success-main">
                                <Icon icon="bxs:up-arrow" className="text-xs" /> +{perTotalExpense}
                            </span> :  <span className="d-inline-flex align-items-center gap-1 text-danger-main">
                                <Icon icon="bxs:down-arrow" className="text-xs" /> -{perTotalExpense}
                            </span>}
                            Last 30 days expenses
                        </p>
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-3 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">
                                    Total Profit
                                </p>
                                <h6 className="mb-0">Rs. {totalProfit}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-pink rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="healthicons:low-income-level-outline-24px"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                           {totalProfitStatus == 'high'? <span className="d-inline-flex align-items-center gap-1 text-success-main">
                                <Icon icon="bxs:up-arrow" className="text-xs" /> +{perTotalProfit}
                            </span> :  <span className="d-inline-flex align-items-center gap-1 text-danger-main">
                                <Icon icon="bxs:down-arrow" className="text-xs" /> -{perTotalProfit}
                            </span>}
                            Last 30 days profit
                        </p>
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-4 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Total Receivable</p>
                                <h6 className="mb-0">Rs. {totalReceive}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="iconoir:receive-dollars"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                         <span className="d-inline-flex align-items-center gap-1 text-success-main">
                            <Icon icon="bxs:up-arrow" className="text-xs" />
                         </span>
                            All over period
                        </p>
                    </div>
                </div>
                {/* card end */}
            </div>
            <div className="col">
                <div className="card shadow-none border bg-gradient-start-5 h-100">
                    <div className="card-body p-20">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <p className="fw-medium text-primary-light mb-1">Total Payable</p>
                                <h6 className="mb-0">Rs. {Totalpayable}</h6>
                            </div>
                            <div className="w-50-px h-50-px bg-red rounded-circle d-flex justify-content-center align-items-center">
                                <Icon
                                    icon="hugeicons:payment-01"
                                    className="text-white text-2xl mb-0"
                                />
                            </div>
                        </div>
                        <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                         <span className="d-inline-flex align-items-center gap-1 text-success-main">
                            <Icon icon="bxs:up-arrow" className="text-xs" />
                         </span>
                            All over period
                        </p>
                    </div>
                </div>
                {/* card end */}
            </div>
        </div>

      <section className='row gy-4 mt-1'>
    <div className='col-xxl-8 col-xl-12'>
      <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg'>Income Vs Expense</h6>
              <div className=''>
                    <select
                      className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                      defaultValue='Yearly' onChange={handleIncomeExp}>
                        <option value="year">Yearly</option>
                        <option value="6month">6 Months</option>
                    </select>
                  </div>
          </div>
          <ul className='d-flex flex-wrap align-items-center justify-content-center my-3 gap-24'>
               <li className='d-flex flex-column gap-1'>
                  <div className='d-flex align-items-center gap-2'>
                     <span className='w-8-px h-8-px rounded-pill bg-primary-600' />
                     <span className='text-secondary-light text-sm fw-semibold'>
                     Income{" "}
                     </span>
                  </div>
                  <div className='d-flex align-items-center gap-8'>
                     <h6 className='mb-0'>Rs. {chartIncome}</h6>
                     <span className='text-success-600 d-flex align-items-center gap-1 text-sm fw-bolder'>
                     
                     <i className='ri-arrow-up-s-fill d-flex' />
                     </span>
                  </div>
               </li>
               <li className='d-flex flex-column gap-1'>
                  <div className='d-flex align-items-center gap-2'>
                     <span className='w-8-px h-8-px rounded-pill bg-warning-600' />
                     <span className='text-secondary-light text-sm fw-semibold'>
                     Expenses{" "}
                     </span>
                  </div>
                  <div className='d-flex align-items-center gap-8'>
                     <h6 className='mb-0'>Rs. {chartExpenses}</h6>
                     <span className='text-danger-600 d-flex align-items-center gap-1 text-sm fw-bolder'>
                     
                     <i className='ri-arrow-down-s-fill d-flex' />
                     </span>
                  </div>
               </li>
            </ul>
          <ReactApexChart
            options={candleoptions}
            series={candleseriesData}
            type='line'
            height={400}
            id='candleStickChart'
          />
        </div>
      </div>
    </div>
    <div className='col-xxl-4 col-xl-6'>
          <div className='card h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg'>Overall Report</h6>
             <select className='form-select form-select-sm w-auto bg-base border text-secondary-light' onChange={handleOverall}>
                <option value="year">Yearly</option>
                <option value="month">Monthly</option>
                <option value="week">Weekly</option>
                <option value="today">Today</option>
            </select>
          </div>
        </div>
        <div className='card-body p-24'>
          <div className='mt-32'>
            <div
              id='userOverviewDonutChart'
              className='mx-auto apexcharts-tooltip-z-none'
            >
              <ReactApexChart
                options={doNutoptions}
                series={doNutseriesData}
                type='donut'
                height={270}
               />
            </div>
          </div>
          <div className='d-flex flex-wrap gap-20 justify-content-center mt-48'>
            <div className='d-flex align-items-center gap-8'>
              <span className='w-16-px h-16-px radius-2 bg-primary-600' />
              <span className='text-secondary-light'>Revenue</span>
            </div>
            <div className='d-flex align-items-center gap-8'>
              <span className='w-16-px h-16-px radius-2 bg-warning-600' />
              <span className='text-secondary-light'>Expense</span>
            </div>
            <div className='d-flex align-items-center gap-8'>
              <span className='w-16-px h-16-px radius-2 bg-success-600' />
              <span className='text-secondary-light'>Profit</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className='col-xxl-4 col-xl-6'>
    <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg'>Total Overview</h6>
            {/* <div className='border radius-4 px-3 py-2 pe-0 d-flex align-items-center gap-1 text-sm text-secondary-light'>
              <select
                className='form-select form-select-sm w-auto bg-base border-0 text-primary-light fw-semibold text-sm'
                defaultValue=''
              >
                <option value='' disabled>
                  Select Frequency
                </option>
                <option value='client'>No. Customers</option>
                <option value='suppl'>No. Suppliers</option>
                <option value='gdsparty'>No. Goods Parties</option>
                <option value='oilparty'>No. Oil Parties</option>
                <option value='gdsveh'>No. Goods Vehicles</option>
                <option value='oilveh'>No. Oil Vehicles</option>
              </select>
            </div> */}
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 px-8 py-8 radius-4 mb-16'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='assets/images/currency/crypto-img6.png'
                alt=''
                className='w-20-px h-20-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>No. Customers</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0'>{noCustm}</h6>
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 px-8 py-8 radius-4 mb-16'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='assets/images/currency/crypto-img3.png'
                alt=''
                className='w-20-px h-20-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>No. Suppliers</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0'>{noSuppl}</h6>
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 px-8 py-8 radius-4 mb-16'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='assets/images/currency/crypto-img10.png'
                alt=''
                className='w-20-px h-20-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>No. Goods Parties</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0'>{noGoodParty}</h6>
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 px-8 py-8 radius-4 mb-16'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='assets/images/currency/crypto-img11.png'
                alt=''
                className='w-20-px h-20-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>No. Oil Parties</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0'>{noOilParty}</h6>
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 px-8 py-8 radius-4 mb-16'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='assets/images/currency/crypto-img7.png'
                alt=''
                className='w-20-px h-20-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>No. Goods Vehicles</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0'>{noGoodVeh}</h6>
          </div>
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 px-8 py-4 radius-4'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-2'>
              <img
                src='assets/images/currency/crypto-img9.png'
                alt=''
                className='w-20-px h-20-px rounded-circle flex-shrink-0'
              />
              <div className='flex-grow-1'>
                <h6 className='text-md mb-0'>No. Oil Vehicles</h6>
              </div>
            </div>
            <h6 className='text-md fw-medium mb-0'>{noOilVeh}</h6>
          </div>
        </div>
      </div>
    </div>

    <div className='col-xxl-4 col-md-6'>
      <div className='card h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>Top Receivables</h6>
            <Link
              href='/all-party-report'
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              View All
              <iconify-icon
                icon='solar:alt-arrow-right-linear'
                className='icon'
              />
            </Link>
          </div>
        </div>
        <div className='card-body p-24'>
          <div className='table-responsive max-h-266-px overflow-y-auto scroll-sm'>
            <table className='table bordered-table mb-0' id="tblReceive">
              <thead>
                <tr>
                  <th scope='col'>SL</th>
                  <th scope='col'>Name </th>
                  <th scope='col'>Amount</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

        <div className='col-xxl-4 col-lg-6'>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>Top Payables</h6>
            <Link
              href='/all-party-report'
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              View All
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </Link>
          </div>
          <div className='mt-32'>
         <div className='table-responsive max-h-266-px overflow-y-auto scroll-sm'>
            <table className='table bordered-table mb-0' id="tblPayable">
              <thead>
                <tr>
                  <th scope='col'>SL</th>
                  <th scope='col'>Name </th>
                  <th scope='col'>Amount</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
    </div>

        <div className='col-xxl-12'>
      <div className='card h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>Stock Report</h6>
            <Link
              href='/stock-details'
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              View All
              <Icon icon='solar:alt-arrow-right-linear' className='icon' />
            </Link>
          </div>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0' id="tblStockDeatils">
              <thead>
                <tr>
                  <th scope='col'>SL</th>
                  <th scope='col'>Items</th>
                  <th scope='col'>Retails Price</th>
                  <th scope='col'>Wholesale Price</th>
                  <th scope='col'>Tax</th>
                  <th scope='col'>Discount</th>
                  <th scope='col'>Sold</th>
                  <th scope='col'>
                    <div className='max-w-112 mx-auto'>
                      <span>Stock</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
      </section>
    </>
  );
};

export default DashBoardLayerOne;
