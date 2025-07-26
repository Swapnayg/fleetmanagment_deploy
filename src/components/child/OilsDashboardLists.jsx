"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import $  from 'jquery'; 
import { Icon } from "@iconify/react/dist/iconify.js";
import moment from 'moment';
import useReactApexChart from "../../hook/useReactApexChart";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
ssr: false,
});
const OilsDashboardLists = () => {
  let { createChart } = useReactApexChart();

   function numberWithCommas(x) {
      return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
   }

   const [freightAmt, setFreightAmt] = useState("");
   const [vehicleAmt, setVehicleAmt] = useState("");
   const [commAmt, setCommAmt] = useState("");
   const [netProfit, setnetProfit] = useState("");
   const [maniCount, setManiCount] = useState("");
   const [vehicleCount, setvehicleCount] = useState("");

   const [perFreightAmt, setperFreightAmt] = useState("");
   const [perVehicleAmt, setperVehicleAmt] = useState("");
   const [perCommAmt, setperCommAmt] = useState("");
   const [perNetProfit, setperNetProfit] = useState("");
   const [perManiCount, setperManiCount] = useState("");
   const [perVehicleCount, setperVehicleCount] = useState("");

   
   const [freightAmtStatus, setfreightAmtStatus] = useState("");
   const [vehicleAmtStatus, setvehicleAmtStatus] = useState("");
   const [commAmtStatus, setcommAmtStatus] = useState("");
   const [netProfitStatus, setnetProfitStatus] = useState("");
   const [maniCountStatus, setmaniCountStatus] = useState("");
   const [vehicleCountStatus, setvehicleCountStatus] = useState("");

   const [totalWeekFreight, settotalWeekFreight] = useState("");
   const [totalWeekVehFreight, settotalWeekVehFreight] = useState("");
   const [totalWeekComm, settotalWeekComm] = useState("");

   const [percPenRec, setpercPenRec] = useState("");
   const [percPenPay, setpercPenPay] = useState("");
   const [PenRec, setPenRec] = useState("");
   const [PenPay, setPenPay] = useState("");

  const [areaTotalIncom, setareaTotalIncom] = useState("");
  const [areaTotalExpe, setareaTotalExpe] = useState("");

const [seriesData, setseriesData] = useState([
  {
    name: "Income",
    data: [44, 42, 57, 86, 58, 55, 44, 42, 57, 86, 58, 55],
  },
  {
    name: "Expenses",
    data: [-34, -22, -37, -56, -21, -35,-34, -22, -37, -56, -21, -35],
  },
]);

 const [purseriesData, setpurseriesData] = useState([
  {
    name: "Net Profit",
    data: [44, 100, 40, 56, 30, 58, 50],
  },
  {
    name: "Revenue",
    data: [90, 140, 80, 125, 70, 140, 110],
  },
  {
    name: "Free Cash",
    data: [60, 120, 60, 90, 50, 95, 90],
  },
]);

 const [purchoptions, setpurchoptions] = useState({    
  colors: ["#45B369", "#144bd6", "#FF9F29"],
  labels: ["Active", "New", "Total"],

  legend: {
    show: false,
  },
  chart: {
    type: "bar",
    height: 350,
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
  yaxis: {
    categories: [
      "0",
      "10,000",
      "20,000",
      "30,000",
      "50,000",
      "1,00,000",
      "1,00,000",
    ],
  },
  fill: {
    opacity: 1,
    width: 18,
  },
 });

 const [doNutseriesData, setdoNutseriesData] = useState([30, 25]);

 const [doNutoptions, setdoNutoptions] = useState({       
  colors: ["#FF9F29", "#487FFF"],
  labels: ["Receivable", "Payable"],
  legend: {
    show: false,
  },
  chart: {
    type: "donut",
    height: 260,
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
    enabled: false,
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
   chart: {
     stacked: true,
     type: "bar",
     height: 263,
     fontFamily: "Poppins, sans-serif",
     toolbar: {
       show: false,
     },
   },
   colors: ["#487FFF", "#EF4A00"],
   plotOptions: {
     bar: {
       columnWidth: "8",
       borderRadius: 2,
       borderRadiusWhenStacked: "all",
     },
   },
   stroke: {
     width: [5, 5],
   },
   dataLabels: {
     enabled: false,
   },
   legend: {
     show: false,
     position: "top",
   },
   yaxis: {
     show: false,
     title: {
       text: undefined,
     },
     labels: {
       formatter: function (y) {
         return y.toFixed(0) + "";
       },
     },
   },
   xaxis: {
     show: false,
     type: "category",
     tickPlacement: 'on',
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
     axisBorder: {
       show: false,
     },
     axisTicks: {
       show: false,
     },
     labels: {
       show: true,
       style: {
         colors: "#d4d7d9",
         fontSize: "10px",
         fontWeight: 500,
       },
     },
   },
   tooltip: {
     enabled: true,
     shared: true,
     intersect: false,
     theme: "dark",
     x: {
       show: false,
     },
   },
 });

const handleIncomeExp = (e) => {
  e.preventDefault();
  fetch("https://backend-55jj.onrender.com/oils_area_data",{method: 'POST', 
   headers: {   'Accept': 'application/json',
     'Content-Type': 'application/json'  }, 
     body: JSON.stringify({"overallType":e.target.value, userid:localStorage.getItem('id')})
   }).then((res) =>
   res.json().then((jsprovdata) => {
      setareaTotalIncom(numberWithCommas(jsprovdata.TotalFreight).toString().trim().replace("-",""));
      setareaTotalExpe(numberWithCommas(jsprovdata.TotalVehFreight).toString().trim().replace("-",""));
   setseriesData([
      {
         name: "Income",
         data: jsprovdata.freight_data,
      },
      {
         name: "Expenses",
         data: jsprovdata.veh_freight_data,
      },
    ]);
}));
}


const handlePurchase = (e) => {
   e.preventDefault();
   const newSeriesData = purseriesData.map((series) => ({
      ...series,
      data: series.data.map(() => Math.floor(Math.random() * 50) + 1),
    }));
    setpurseriesData(newSeriesData);
}

useEffect(() => {
    var username = localStorage.getItem('username');
    if (username) {
        fetch("https://backend-55jj.onrender.com/oils_overall_data",{method: 'POST', 
        headers: {   'Accept': 'application/json',
          'Content-Type': 'application/json'  }, 
          body: JSON.stringify({"overallType":'year', userid:localStorage.getItem('id')})
        }).then((res) =>
        res.json().then((jsprovdata) => {
          setpercPenRec(jsprovdata.perTotalPRec.toString().trim().replace("-",""));
          setpercPenPay(jsprovdata.perTotalPay.toString().trim().replace("-",""));
          setPenRec(numberWithCommas(jsprovdata.totalRec).toString().trim().replace("-",""));
          setPenPay(numberWithCommas(jsprovdata.totalpay).toString().trim().replace("-",""));
        setdoNutseriesData([parseInt(jsprovdata.perTotalPay), parseInt(jsprovdata.perTotalPRec)]);
    })); 
    fetch("https://backend-55jj.onrender.com/oils_area_data",{method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({"overallType":'year',userid:localStorage.getItem('id')})
      }).then((res) =>
      res.json().then((jsprovdata) => {
        setareaTotalIncom(numberWithCommas(jsprovdata.TotalFreight).toString().trim().replace("-",""));
        setareaTotalExpe(numberWithCommas(jsprovdata.TotalVehFreight).toString().trim().replace("-",""));
        setseriesData([
        {
            name: "Income",
            data: jsprovdata.freight_data,
        },
        {
            name: "Expenses",
            data: jsprovdata.veh_freight_data,
        },
      ]);
  }));
    fetch('https://backend-55jj.onrender.com/oils_dashboard_data'+'/'+localStorage.getItem('id')).then((res) =>
        res.json().then((jsprovdata) => {
          setManiCount(jsprovdata.cw_mani_count.toString().trim().replace("-",""));
          setperManiCount(jsprovdata.mani_count_diff.toString().trim().replace("-",""));
          setmaniCountStatus(jsprovdata.mani_count_status);
          setvehicleCount(jsprovdata.cw_vehicles_count.toString().trim().replace("-",""));
          setperVehicleCount(jsprovdata.veh_count_diff.toString().trim().replace("-",""));
          setvehicleCountStatus(jsprovdata.veh_count_status);
          setFreightAmt(numberWithCommas(jsprovdata.cw_freight_count).toString().trim().replace("-",""));
          setperFreightAmt(jsprovdata.freight_count_diff.toString().trim().replace("-",""));
          setfreightAmtStatus(jsprovdata.freight_count_status);
          setVehicleAmt(numberWithCommas(jsprovdata.cw_veh_freight_count).toString().trim().replace("-",""));
          setperVehicleAmt(jsprovdata.veh_freight_count_diff.toString().trim().replace("-",""));
          setvehicleAmtStatus(jsprovdata.veh_freight_count_status);
          setCommAmt(numberWithCommas(jsprovdata.cw_comm_count).toString().trim().replace("-",""));
          setperCommAmt(jsprovdata.comm_count_diff.toString().trim().replace("-",""));
          setcommAmtStatus(jsprovdata.comm_count_status);

          settotalWeekFreight(jsprovdata.total_wk_freight.toString().trim().replace("-",""));
          settotalWeekVehFreight(jsprovdata.total_wk_veh_freight.toString().trim().replace("-",""));
          settotalWeekComm(jsprovdata.total_wk_commission.toString().trim().replace("-",""));

          jsprovdata.chart_party_data.sort(function(a,b){return a.partyNetworth - b.partyNetworth;});
          jsprovdata.chart_veh_data.sort(function(a,b){return a.vehNetworth - b.vehNetworth;});
          for (let i = 0; i < jsprovdata.chart_party_data.length; i++) {
            let row = '<tr>';
            row += '<td>' + (i +1) + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.chart_party_data[i].partyName + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.chart_party_data[i].partyNetworth + '</td>';
            row += '</tr>';
            $("#tbl_party tbody").append(row);
          }
          for (let j = 0; j < jsprovdata.chart_veh_data.length; j++) {
            let row = '<tr>';
            row += '<td>' + (j +1) + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.chart_veh_data[j].vehName + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.chart_veh_data[j].vehNetworth + '</td>';
            row += '</tr>';
            $("#tbl_vehicle tbody").append(row);
          }
          for (let k = 0; k < jsprovdata.trans_data.length; k++) {
            let row = '<tr>';
            row += '<td>' + (k +1) + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' +   moment(jsprovdata.trans_data[k].ledg_date).format("DD/MM/YYYY") + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.trans_data[k].ledg_invoice + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.trans_data[k].ledg_type + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.trans_data[k].ledg_paid + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.trans_data[k].total_bal + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.trans_data[k].ledg_balance + '</td>';
            row += '</tr>';
            $("#tbl_Trans tbody").append(row);
          }
          for (let l = 0; l < jsprovdata.manifest_data.length; l++) {
            let row = '<tr>';
            row += '<td>' + (l +1) + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' +   moment(jsprovdata.manifest_data[l].b_date).format("DD/MM/YYYY") + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.manifest_data[l].oil_party_name + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.manifest_data[l].oil_vehicle_name + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.manifest_data[l].quantity + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.manifest_data[l].per_ton + '</td>';
            row += '<td style="text-transform:capitalize" class="text-secondary-light">' + jsprovdata.manifest_data[l].freight + '</td>';
            row += '</tr>';
            $("#tbl_Manifest tbody").append(row);
          }

          setpurseriesData([
            {
              name: "Frieght",
              data: jsprovdata.wk_freight_data,
            },
            {
              name: "Vehicle Freight",
              data: jsprovdata.wk_vehicle_data,
            },
            {
              name: "Commission",
              data: jsprovdata.wk_comm_data,
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
               <div className='col-xxl-4 col-xl-4 col-sm-6'>
               <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-1'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-primary-600 bg-purple flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0'>
                    <Icon icon='fa-solid:shipping-fast' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      Total Freight
                    </span>
                    <h6 className='fw-semibold'>{freightAmt}</h6>
                  </div>
                </div>
                <div
                  id='new-user-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                  {createChart("#8252e9")}
                </div>
              </div>
              <p className='text-sm mb-0'>
              {freightAmtStatus == 'high'? "Increase" : "Decreased"} by{" "}
                {freightAmtStatus == 'high'? <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                  {perFreightAmt}
                </span> :  <span className='bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm'>
                  {perFreightAmt}
                </span>}
                {" "}
                this week
              </p>
            </div>
          </div>
               </div>
               <div className='col-xxl-4 col-xl-4 col-sm-6'>
               <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-1'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-red bg-primary-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0'>
                    <Icon icon='fluent:vehicle-truck-cube-24-regular' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      Total Vehicle
                    </span>
                    <h6 className='fw-semibold'>{vehicleAmt}</h6>
                  </div>
                </div>
                <div
                  id='new-user-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                  {createChart("#e30a0a")}
                </div>
              </div>
              <p className='text-sm mb-0'>
              {vehicleAmtStatus == 'high'? "Increase" : "Decreased"} by{" "}
                {vehicleAmtStatus == 'high'? <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                  {perVehicleAmt}
                </span> :  <span className='bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm'>
                  {perVehicleAmt}
                </span>}{" "}
                this week
              </p>
            </div>
          </div>
               </div>
               <div className='col-xxl-4 col-xl-4 col-sm-6'>
               <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-1'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-success-main bg-primary-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0'>
                    <Icon icon='streamline:interface-favorite-give-heart-reward-social-rating-media-heart-hand' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      Commission Earned
                    </span>
                    <h6 className='fw-semibold'>{commAmt}</h6>
                  </div>
                </div>
                <div
                  id='new-user-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                  {createChart("#45b369")}
                </div>
              </div>
              <p className='text-sm mb-0'>
              {commAmtStatus == 'high'? "Increase" : "Decreased"} by{" "}
                {commAmtStatus == 'high'? <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                  {perCommAmt}
                </span> :  <span className='bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm'>
                  {perCommAmt}
                </span>}{" "}
                this week
              </p>
            </div>
          </div>
               </div>
               {/* <div className='col-xxl-4 col-xl-4 col-sm-6'>
               <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-1'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-pink bg-primary-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0'>
                    <Icon icon='healthicons:low-income-level-outline-24px' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      Net Profit
                    </span>
                    <h6 className='fw-semibold'>{netProfit}</h6>
                  </div>
                </div>
                <div
                  id='new-user-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  
                  {createChart("#de3ace")}
                </div>
              </div>
              <p className='text-sm mb-0'>
                {netProfitStatus == 'high'? "Increase" : "Decreased"} by{" "}
                {netProfitStatus == 'high'? <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                  {perNetProfit}
                </span> :  <span className='bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm'>
                  {perNetProfit}
                </span>}{" "}
                this week
              </p>
            </div>
          </div>
               </div> */}

               <div className='col-xxl-4 col-xl-4 col-sm-6'>
               <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-1'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-yellow bg-primary-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0'>
                    <Icon icon='oui:number' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      No. of Maifests
                    </span>
                    <h6 className='fw-semibold'>{maniCount}</h6>
                  </div>
                </div>
                <div
                  id='new-user-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                  {createChart("#f4941e")}
                </div>
              </div>
              <p className='text-sm mb-0'>
              {maniCountStatus == 'high'? "Increase" : "Decreased"} by{" "}
                {maniCountStatus == 'high'? <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                  {perManiCount}
                </span> :  <span className='bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm'>
                  {perManiCount}
                </span>}{" "}
                this week
              </p>
            </div>
          </div>
               </div>

               <div className='col-xxl-4 col-xl-4 col-sm-6'>
               <div className='card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-1'>
            <div className='card-body p-0'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8'>
                <div className='d-flex align-items-center gap-2'>
                  <span className='mb-0 w-48-px h-48-px bg-info flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0'>
                    <Icon icon='hugeicons:traffic-jam-01' className='icon' />
                  </span>
                  <div>
                    <span className='mb-2 fw-medium text-secondary-light text-sm'>
                      No. Vehicles
                    </span>
                    <h6 className='fw-semibold'>{vehicleCount}</h6>
                  </div>
                </div>
                <div
                  id='new-user-chart'
                  className='remove-tooltip-title rounded-tooltip-value'
                >
                  {/* Pass the color value here */}
                  {createChart("#0dcaf0")}
                </div>
              </div>
              <p className='text-sm mb-0'>
              {vehicleCountStatus == 'high'? "Increase" : "Decreased"} by{" "}
                {vehicleCountStatus == 'high'? <span className='bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm'>
                  {perVehicleCount}
                </span> :  <span className='bg-danger-focus px-1 rounded-2 fw-medium text-danger-main text-sm'>
                  {perVehicleCount}
                </span>}{" "}
                this week
              </p>
            </div>
          </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   <div className='col-xxl-8'>
   <div className='card h-100 radius-8 border-0'>
                 <div className='card-body p-24'>
                   <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
                     <div>
                       <h6 className='mb-2 fw-bold text-lg'>Income Vs Expense</h6>
                     </div>
                     <div className=''>
                       <select
                         className='form-select form-select-sm w-auto bg-base border text-secondary-light'
                         defaultValue='Yearly' onChange={handleIncomeExp}>
                           <option value="year">Yearly</option>
                           <option value="6month">6 Months</option>
                       </select>
                     </div>
                   </div>
                   <div className='mt-24 mb-24 d-flex flex-wrap'>
                     <div className='me-40'>
                       <span className='text-secondary-light text-sm mb-1'>Income</span>
                       <div className=''>
                         <h6 className='fw-semibold d-inline-block mb-0'>Rs. {areaTotalIncom}</h6>
                         <span className='text-success-main fw-bold d-inline-flex align-items-center gap-1'>
                          <Icon icon='iconamoon:arrow-up-2-fill' className='icon' />{" "}
                         </span>
                       </div>
                     </div>
                     <div>
                       <span className='text-secondary-light text-sm mb-1'>
                         Expenses
                       </span>
                       <div className=''>
                         <h6 className='fw-semibold d-inline-block mb-0'>Rs. {areaTotalExpe}</h6>
                         <span className='text-danger-main fw-bold d-inline-flex align-items-center gap-1'>
                           {" "}
                           <Icon icon='iconamoon:arrow-down-2-fill' className='icon' />{" "}
                         </span>
                       </div>
                     </div>
                   </div>
                   <ReactApexChart
                     options={options} series={seriesData}
                     type='bar'
                     height={263}
                     id='upDownBarchart'
                   />
                 </div>
               </div>
   </div>
   <div className='col-xxl-4 col-md-6'>
   <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg'>Overall Report</h6>
            <div className=''>
            </div>
          </div>
          <div className='position-relative'>
            <span className='w-80-px h-80-px bg-base shadow text-primary-light fw-semibold text-xl d-flex justify-content-center align-items-center rounded-circle position-absolute end-0 top-0 z-1' style={{right:"15% !important"}}>
              {percPenPay}%
            </span>

            <ReactApexChart options={doNutoptions} series={doNutseriesData} type='donut' height={260}
              id='statisticsDonutChart' className='mt-36 flex-grow-1 apexcharts-tooltip-z-none title-style circle-none'/>
            <span className='w-80-px h-80-px bg-base shadow text-primary-light fw-semibold text-xl d-flex justify-content-center align-items-center rounded-circle position-absolute start-0 bottom-0 z-1' style={{left:"15% !important"}}>
            {percPenRec}%
            </span>
          </div>
          <ul className='d-flex flex-wrap align-items-center justify-content-between mt-3 gap-3'>
            <li className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px radius-2 bg-yellow' />
              <span className='text-secondary-light text-sm fw-normal'>
                Pending Receivables:
                <span className='text-primary-light fw-bold'>{PenRec}</span>
              </span>
            </li>
            <li className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px radius-2 bg-primary-600' />
              <span className='text-secondary-light text-sm fw-normal'>
              Pending Payable:
                <span className='text-primary-light fw-bold'>{PenPay}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

   </div>
   <div className='col-xxl-8 col-md-6'>
      <div className='card h-100'>
           <div className='card-header border-bottom bg-base ps-0 py-0 pe-24 d-flex align-items-center justify-content-between'>
             <ul
               className='nav bordered-tab nav-pills mb-0'
               id='pills-tab'
               role='tablist'
             >
               <li className='nav-item' role='presentation'>
                 <button
                   className='nav-link active'
                   id='pills-to-do-list-tab'
                   data-bs-toggle='pill'
                   data-bs-target='#pills-to-do-list'
                   type='button'
                   role='tab'
                   aria-controls='pills-to-do-list'
                   aria-selected='true'
                 >
                   Recent Manifest
                 </button>
               </li>
               <li className='nav-item' role='presentation'>
                 <button
                   className='nav-link'
                   id='pills-recent-leads-tab'
                   data-bs-toggle='pill'
                   data-bs-target='#pills-recent-leads'
                   type='button'
                   role='tab'
                   aria-controls='pills-recent-leads'
                   aria-selected='false'
                   tabIndex={-1}
                 >
                   Recent Transactions
                 </button>
               </li>
             </ul>
             <Link
               href='/manifest-goods-report'
               className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
             >
               View All
               <Icon icon='solar:alt-arrow-right-linear' className='icon' />
             </Link>
           </div>
           <div className='card-body p-24'>
             <div className='tab-content' id='pills-tabContent'>
               <div
                 className='tab-pane fade show active'
                 id='pills-to-do-list'
                 role='tabpanel'
                 aria-labelledby='pills-to-do-list-tab'
                 tabIndex={0}
               >
                 <div className='table-responsive scroll-sm'>
                 <table className='table bordered-table mb-0' id="tbl_Manifest">
                  <thead>
                     <tr>
                        <th scope='col'>SL</th>
                        <th scope='col'>Date </th>
                        <th scope='col'>Party </th>
                        <th scope='col'>Vehicle</th>
                        <th scope='col'>Weight</th>
                        <th scope='col'>Per/Ton</th>
                        <th scope='col'>Freight Amount</th>
                     </tr>
                  </thead>
                  <tbody>

                  </tbody>
               </table>
                 </div>
               </div>
               <div
                 className='tab-pane fade'
                 id='pills-recent-leads'
                 role='tabpanel'
                 aria-labelledby='pills-recent-leads-tab'
                 tabIndex={0}
               >
                 <div className='table-responsive scroll-sm'>
                 <table className='table bordered-table mb-0' id="tbl_Trans">
                  <thead>
                     <tr>
                        <th scope='col'>SL</th>
                        <th scope='col'>Date </th>
                        <th scope='col'>Invoice No </th>
                        <th scope='col'>Transaction Type</th>
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
         </div>
   </div>
   <div className='col-xxl-4 col-md-6'>
   <div className='card h-100 radius-8 border-0'>
        <div className='card-body p-24'>
          <h6 className='mb-2 fw-bold text-lg'>Profit Margin Over Time</h6>
          <span className='text-sm fw-medium text-secondary-light'>
            Weekly Report
          </span>
          <ul className='d-flex flex-wrap align-items-center justify-content-center mt-32'>
            <li className='d-flex align-items-center gap-2 me-28'>
              <span className='w-12-px h-12-px rounded-circle bg-success-main' />
              <span className='text-secondary-light text-sm fw-medium'>
                Freight: {totalWeekFreight}
              </span>
            </li>
            <li className='d-flex align-items-center gap-2 me-28'>
              <span className='w-12-px h-12-px rounded-circle bg-info-main' />
              <span className='text-secondary-light text-sm fw-medium'>
                Vehicles:  {totalWeekVehFreight}
              </span>
            </li>
            <li className='d-flex align-items-center gap-2'>
              <span className='w-12-px h-12-px rounded-circle bg-warning-main' />
              <span className='text-secondary-light text-sm fw-medium'>
                Comm:  {totalWeekComm}
              </span>
            </li>
          </ul>
          <div className='mt-40'>

          <ReactApexChart options={purchoptions} series={purseriesData} type='bar' height={350}
              id='paymentStatusChart' className='margin-16-minus' />
          </div>
        </div>
      </div>
   </div>

   <div className='col-xxl-6'>
      <div className='card h-100'>
         <div className='card-header'>
            <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
               <h6 className='mb-2 fw-bold text-lg mb-0'>Top Parties</h6>
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
            <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0' id="tbl_party">
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

   <div className='col-xxl-6'>
      <div className='card h-100'>
         <div className='card-header'>
            <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
               <h6 className='mb-2 fw-bold text-lg mb-0'>Top Vehicles</h6>
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
            <div className='table-responsive scroll-sm'>
           
         <table className='table bordered-table mb-0' id="tbl_vehicle">
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
);
};
export default OilsDashboardLists;