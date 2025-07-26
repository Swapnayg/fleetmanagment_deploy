"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import $  from 'jquery'; 
import moment from 'moment';
import useReactApexChart from "../../hook/useReactApexChart";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
ssr: false,
});
const SalesDashBoardList = () => {
   

   function numberWithCommas(x) {
      return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
   }

   const [grossSale, setgrossSale] = useState("");
   const [grossPurch, setgrossPurch] = useState("");
   const [grossIncome, setgrossIncome] = useState("");
   const [perGrossSale, setperGrossSale] = useState("");
   const [perGrossPurch, setperGrossPurch] = useState("");
   const [perGrossIncome, setperGrossIncome] = useState("");
   const [grossSaleStatus, setgrossSaleStatus] = useState("");
   const [grossPurchStatus, setgrossPurchStatus] = useState("");
   const [grossIncomeStatus, setgrossIncomeStatus] = useState("");
   const [totalPurch, settotalPurch] = useState("");
   const [totalSales, settotalSales] = useState("");

   const [areaTotalIncom, setareaTotalIncom] = useState("");
   const [areaTotalExpe, setareaTotalExpe] = useState("");


const [seriesData, setseriesData] = useState([
   {
      name: "series1",
      data: [48, 35, 50, 32, 48, 40, 55, 50, 60, 36, 67, 54],
   },
   {
      name: "series2",
      data: [12, 20, 15, 26, 22, 30, 25, 35, 25, 35, 42, 35],
   },
 ]);

 const [purseriesData, setpurseriesData] = useState([
   {
      name: "Net Profit",
      data: [44, 100, 40, 56, 30, 58, 50],
    },
    {
      name: "Free Cash",
      data: [60, 120, 60, 90, 50, 95, 90],
    },
 ]);

 const [purchoptions, setpurchoptions] = useState({    
   colors: ["#45B369", "#FF9F29"],
   labels: ["Active", "New", "Total"],

   legend: {
     show: false,
   },
   chart: {
     type: "bar",
     height: 260,
     toolbar: {
       show: false,
     },
   },
   grid: {
     show: true,
     borderColor: "#D1D5DB",
     strokeDashArray: 4, // Use a number for dashed style
     position: "back",
   },
   plotOptions: {
     bar: {
       borderRadius: 4,
       columnWidth: 8,
     },
   },
   dataLabels: {
     enabled: false,
   },
   states: {
     hover: {
       filter: {
         type: "none",
       },
     },
   },
   stroke: {
     show: true,
     width: 0,
     colors: ["transparent"],
   },
   xaxis: {
     categories: ["Sun","Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
   },
   fill: {
     opacity: 1,
     width: 18,
   },   
 });

 const [doNutseriesData, setdoNutseriesData] = useState([30, 30, 20, 20]);

 const [doNutoptions, setdoNutoptions] = useState({       
   colors: ["#FF9F29", "#487FFF", "#45B369", "#9935FE"],
   labels: ["Expense", "Purchase", "Profit", "Sales"],
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
  
 const [options, setOptions] = useState({       
 legend: {
      show: false,
    },
    chart: {
      type: "area",
      width: "100%",
      height: 270,
      toolbar: {
        show: false,
      },
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#487FFF", "#FF9F29"], // Use two colors for the lines
      lineCap: "round",
    },
    grid: {
      show: true,
      borderColor: "#D1D5DB",
      strokeDashArray: 1,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
      },
      padding: {
        top: -20,
        right: 0,
        bottom: -10,
        left: 0,
      },
    },
    fill: {
      type: "gradient",
      colors: ["#487FFF", "#FF9F29"], // Use two colors for the gradient

      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: [undefined, `${"#FF9F29"}00`], // Apply transparency to both colors
        inverseColors: false,
        opacityFrom: [0.4, 0.6], // Starting opacity for both colors
        opacityTo: [0.3, 0.3], // Ending opacity for both colors
        stops: [0, 100],
      },
    },
    markers: {
      colors: ["#487FFF", "#FF9F29"], // Use two colors for the markers
      strokeWidth: 3,
      size: 0,
      hover: {
        size: 10,
      },
    },
    xaxis: {
      categories: [
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
      ] ,
      tooltip: {
        enabled: false,
      },
      labels: {
        formatter: function (value) {
          return value;
        },
        style: {
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return "Rs. " + value;
        },
        style: {
          fontSize: "14px",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
});


const handleIncomeExp = (e) => {
   e.preventDefault();
   fetch("https://backend-55jj.onrender.com/sales_area_data",{method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({"overallType":e.target.value, userid:localStorage.getItem('id')})
      }).then((res) =>
      res.json().then((jsprovdata) => {
         setareaTotalIncom(numberWithCommas(jsprovdata.TotalExp).toString().trim().replace("-",""));
         setareaTotalExpe(numberWithCommas(jsprovdata.TotalPurch).toString().trim().replace("-",""));
      setseriesData([
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



useEffect(() => {
   var username = localStorage.getItem('username');
   if (username) {
      fetch("https://backend-55jj.onrender.com/sales_overall_data",{method: 'POST', 
         headers: {   'Accept': 'application/json',
         'Content-Type': 'application/json'  }, 
         body: JSON.stringify({"overallType":'year', userid:localStorage.getItem('id')})
         }).then((res) =>
         res.json().then((jsprovdata) => {
         setdoNutseriesData([parseInt(jsprovdata.cm_expense_gen), parseInt(jsprovdata.cm_gross_purch_val), parseInt(jsprovdata.cm_income_gen), parseInt(jsprovdata.cm_gross_total) ]);
      })); 
      
      fetch("https://backend-55jj.onrender.com/sales_area_data",{method: 'POST', 
         headers: {   'Accept': 'application/json',
         'Content-Type': 'application/json'  }, 
         body: JSON.stringify({"overallType":'year', userid:localStorage.getItem('id') })
         }).then((res) =>
         res.json().then((jsprovdata) => {
            setareaTotalIncom(numberWithCommas(jsprovdata.TotalExp).toString().trim().replace("-",""));
            setareaTotalExpe(numberWithCommas(jsprovdata.TotalPurch).toString().trim().replace("-",""));
         setseriesData([
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

      fetch('https://backend-55jj.onrender.com/sales_dashboard_data'+'/'+localStorage.getItem('id')).then((res) =>
         res.json().then((jsprovdata) => {
            jsprovdata.stk_details_data.sort(function(a,b){return a.stkQty - b.stkQty;});
            jsprovdata.chartOfSuppl.sort(function(a,b){return a.supplNetworth - b.supplNetworth;});
            jsprovdata.chartOfClient.sort(function(a,b){return a.clientNetworth - b.clientNetworth;});
            setgrossSale(numberWithCommas(jsprovdata.cm_gross_total).toString().trim().replace("-",""));
            setgrossPurch(numberWithCommas(jsprovdata.cm_gross_purch_val).toString().trim().replace("-",""));
            setgrossIncome(numberWithCommas(jsprovdata.cm_income_gen).toString().trim().replace("-",""));
            setperGrossSale(jsprovdata.perc_gross_sale.toString().trim().replace("-",""));
            setperGrossPurch(jsprovdata.perc_gross_purch.toString().trim().replace("-",""));
            setperGrossIncome(jsprovdata.perc_gross_income.toString().trim().replace("-",""));

            setgrossSaleStatus(jsprovdata.gross_sale_status);
            setgrossPurchStatus(jsprovdata.gross_purch_status);
            setgrossIncomeStatus(jsprovdata.gross_income_status);
            for (let i = 0; i < jsprovdata.chartOfSuppl.length; i++) {
               let row = '<tr>';
               row += '<td>' + (i +1) + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.chartOfSuppl[i].supplName + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.chartOfSuppl[i].supplNetworth + '</td>';
               row += '</tr>';
               $("#tbl_Suppl tbody").append(row);
            }
            for (let j = 0; j < jsprovdata.chartOfClient.length; j++) {
               let row = '<tr>';
               row += '<td>' + (j +1) + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.chartOfClient[j].clientName + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.chartOfClient[j].clientNetworth + '</td>';
               row += '</tr>';
               $("#tbl_Client tbody").append(row);
            }
            for (let k = 0; k < jsprovdata.ledger_data.length; k++) {
               let row = '<tr>';
               row += '<td>' + (k +1) + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' +   moment(jsprovdata.ledger_data[k].ledg_date).format("DD/MM/YYYY") + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.ledger_data[k].ledg_invoice + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.ledger_data[k].ledg_method + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.ledger_data[k].ledg_paid + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.ledger_data[k].total_bal + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.ledger_data[k].ledg_balance + '</td>';
               row += '</tr>';
               $("#tbl_Trans tbody").append(row);
            }
            for (let l = 0; l < jsprovdata.stk_details_data.length; l++) {
               let row = '<tr>';
               row += '<td>' + (l +1) + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.stk_details_data[l].stkName + '</td>';
               row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.stk_details_data[l].stkQty + '</td>';
               row += '</tr>';
               $("#tbl_Stk tbody").append(row);
            }
            settotalPurch(jsprovdata.total_pur.toString().trim().replace("-",""));
            settotalSales(jsprovdata.total_sales.toString().trim().replace("-",""));
            setpurseriesData([
               {
                  name: "Net Profit",
                  data: jsprovdata.wk_income_data,
               },
               {
                  name: "Free Cash",
                  data: jsprovdata.wk_purchase_data,
               },
            ]);
      }));
   }
   else
   {
      window.location.href = '/login';
   }   
}, []);
return (
<div className='row gy-4'>
   <div className='col-12'>
      <div className='card radius-12'>
         <div className='card-body p-16'>
            <div className='row gy-4'>
               <div className='col-xxl-3 col-xl-4 col-sm-6'>
                  <div className='px-20 py-16 shadow-none radius-8 h-100 gradient-deep-1 left-line line-bg-primary position-relative overflow-hidden'>
                     <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                        <div>
                           <span className='mb-2 fw-medium text-secondary-light text-md'>
                           Gross Sales
                           </span>
                           <h6 className='fw-semibold mb-1'>Rs. {grossSale}</h6>
                        </div>
                        <span className='w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-primary-100 text-primary-600'>
                        <i className='ri-shopping-cart-fill' />
                        </span>
                     </div>
                     <p className='text-sm mb-0'>
                     {grossSaleStatus == 'high'? <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                        <i className='ri-arrow-right-up-line' /> {perGrossSale}%</span> :  <span className='bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm'> <i className='ri-arrow-right-down-line' /> {perGrossSale}%</span>}{" "}
                        From last month{" "}
                     </p>
                  </div>
               </div>
               <div className='col-xxl-3 col-xl-4 col-sm-6'>
                  <div className='px-20 py-16 shadow-none radius-8 h-100 gradient-deep-2 left-line line-bg-lilac position-relative overflow-hidden'>
                     <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                        <div>
                           <span className='mb-2 fw-medium text-secondary-light text-md'>
                           Total Purchase
                           </span>
                           <h6 className='fw-semibold mb-1'>Rs. {grossPurch}</h6>
                        </div>
                        <span className='w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-lilac-200 text-lilac-600'>
                        <i className='ri-handbag-fill' />
                        </span>
                     </div>
                     <p className='text-sm mb-0'>
                     
                     {grossPurchStatus == 'high'? <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                        <i className='ri-arrow-right-up-line' /> {perGrossPurch}%</span> :  <span className='bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm'> <i className='ri-arrow-right-down-line' /> {perGrossPurch}%</span>}{" "}
                        From last month{" "}
                     </p>
                  </div>
               </div>
               <div className='col-xxl-3 col-xl-4 col-sm-6'>
                  <div className='px-20 py-16 shadow-none radius-8 h-100 gradient-deep-3 left-line line-bg-success position-relative overflow-hidden'>
                     <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                        <div>
                           <span className='mb-2 fw-medium text-secondary-light text-md'>
                           Total Income
                           </span>
                           <h6 className='fw-semibold mb-1'>Rs. {grossIncome}</h6>
                        </div>
                        <span className='w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-success-200 text-success-600'>
                        <i className='ri-shopping-cart-fill' />
                        </span>
                     </div>
                     <p className='text-sm mb-0'>
                     {grossIncomeStatus == 'high'? <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                     <i className='ri-arrow-right-up-line' /> {perGrossIncome}%</span> :  <span className='bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm'> <i className='ri-arrow-right-down-line' /> {perGrossIncome}%</span>} {" "}
                        From last month{" "}
                     </p>
                  </div>
               </div>
               <div className='col-xxl-3 col-xl-4 col-sm-6'>
                  <div className='px-20 py-16 shadow-none radius-8 h-100 gradient-deep-4 left-line line-bg-warning position-relative overflow-hidden'>
                     <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                        <div>
                           <span className='mb-2 fw-medium text-secondary-light text-md'>
                           Total Expense
                           </span>
                           <h6 className='fw-semibold mb-1'>Rs. 0</h6>
                        </div>
                        <span className='w-44-px h-44-px radius-8 d-inline-flex justify-content-center align-items-center text-2xl mb-12 bg-warning-focus text-warning-600'>
                        <i className='ri-shopping-cart-fill' />
                        </span>
                     </div>
                     <p className='text-sm mb-0'>
                        <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                        <i className='ri-arrow-right-up-line' /> 0%
                        </span>{" "}
                        From last month{" "}
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   <div className='col-xxl-8'>
      <div className='card h-100'>
         <div className='card-body p-24 mb-8'>
            <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
               <h6 className='mb-2 fw-bold text-lg mb-0'>Income Vs Expense </h6>
               <select className='form-select form-select-sm w-auto bg-base border text-secondary-light' onChange={handleIncomeExp}>
                  <option value="year">Yearly</option>
                  <option value="6month">6 Months</option>
               </select>
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
                     <h6 className='mb-0'>Rs. {areaTotalIncom}</h6>
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
                     <h6 className='mb-0'>Rs. {areaTotalExpe} </h6>
                     <span className='text-danger-600 d-flex align-items-center gap-1 text-sm fw-bolder'>
                     
                     <i className='ri-arrow-down-s-fill d-flex' />
                     </span>
                  </div>
               </li>
            </ul>
            <div id='incomeExpense' className='apexcharts-tooltip-style-1'>
               <ReactApexChart options={options} series={seriesData}  type='area'height={350} width={"100%"} />
            </div>
         </div>
      </div>
   </div>
   <div className='col-xxl-4 col-md-6'>
   <div className='card h-100'>
   <div className='card-header'>
            <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
               <h6 className='mb-2 fw-bold text-lg'>Overall Report</h6>
            </div>
         </div>
         <div className='card-body p-20'>
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
                  <span className='text-secondary-light'>Purchase</span>
               </div>
               <div className='d-flex align-items-center gap-8'>
                  <span className='w-16-px h-16-px radius-2 bg-lilac-600' />
                  <span className='text-secondary-light'>Sales</span>
               </div>
               <div className='d-flex align-items-center gap-8'>
                  <span className='w-16-px h-16-px radius-2 bg-warning-600' />
                  <span className='text-secondary-light'>Expense</span>
               </div>
               <div className='d-flex align-items-center gap-8'>
                  <span className='w-16-px h-16-px radius-2 bg-success-600' />
                  <span className='text-secondary-light'>Gross Profit</span>
               </div>
            </div>
         </div>
         </div>
      </div>
   </div>
   <div className='col-xxl-4 col-md-6'>
      <div className='card h-100'>
         <div className='card-header'>
            <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
               <h6 className='mb-2 fw-bold text-lg mb-0'>Top Suppliers</h6>
               <Link
                  href='/purchase-report'
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
            <div className='table-responsive scroll-sm'>
               <table className='table bordered-table mb-0' id="tbl_Suppl">
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
   <div className='col-xxl-4 col-md-6'>
      <div className='card h-100'>
         <div className='card-header'>
            <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
               <h6 className='mb-2 fw-bold text-lg mb-0'>Top Customer</h6>
               <Link
                  href='/sales-report'
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
            <div className='table-responsive scroll-sm'>
               <table className='table bordered-table mb-0'  id="tbl_Client">
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
   <div className='col-xxl-4 col-md-6'>
   <div className='card h-100'>
         <div className='card-header'>
            <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
               <h6 className='mb-2 fw-bold text-lg mb-0'>Purchase and Sales</h6>
            </div>
         </div>
         <div className='card-body p-24'>
            <ul className='d-flex flex-wrap align-items-center justify-content-center my-3 gap-3'>
               <li className='d-flex align-items-center gap-2'>
                  <span className='w-12-px h-8-px rounded-pill bg-warning-600' />
                  <span className='text-secondary-light text-sm fw-semibold'>
                  Purchase: Rs. 
                  <span className='text-primary-light fw-bold'>{totalPurch}</span>
                  </span>
               </li>
               <li className='d-flex align-items-center gap-2'>
                  <span className='w-12-px h-8-px rounded-pill bg-success-600' />
                  <span className='text-secondary-light text-sm fw-semibold'>
                  Sales: Rs. <span className='text-primary-light fw-bold'>{totalSales}</span>
                  </span>
               </li>
            </ul>
            <div id='purchaseSaleChart' className='margin-16-minus y-value-left'>
               <ReactApexChart
                  options={purchoptions}
                  series={purseriesData}
                  type='bar'
                  height={300}
                  />
            </div>
         </div>
      </div>
   </div>

   <div className='col-xxl-8'>
      <div className='card h-100'>
         <div className='card-header'>
            <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
               <h6 className='mb-2 fw-bold text-lg mb-0'>Recent Transactions</h6>
               <Link
                  href='/all-transactions'
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
            <div className='table-responsive scroll-sm'>
               <table className='table bordered-table mb-0' id="tbl_Trans">
                  <thead>
                     <tr>
                        <th scope='col'>SL</th>
                        <th scope='col'>Date </th>
                        <th scope='col'>Invoice No </th>
                        <th scope='col'>Payment Type</th>
                        <th scope='col'>Paid Amount</th>
                        <th scope='col'>Due Amount</th>
                        <th scope='col'>Payable Amount</th>
                     </tr>
                  </thead>
                  <tbody>

                  </tbody>
               </table>
            </div>
         </div>
      </div>
   </div>

   <div className='col-xxl-4'>
      <div className='card h-100'>
         <div className='card-header'>
            <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
               <h6 className='mb-2 fw-bold text-lg mb-0'>Stock Details</h6>
               <Link
                  href='/stock-details'
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
            <div className='table-responsive scroll-sm'>
               <table className='table bordered-table mb-0' id="tbl_Stk">
                  <thead>
                     <tr>
                        <th scope='col'>SL</th>
                        <th scope='col'>Product Name</th>
                        <th scope='col'>Present Qty</th>
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
);
};
export default SalesDashBoardList;