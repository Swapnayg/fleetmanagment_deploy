"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import Link from "next/link";
import Autocomplete from "../components/Autocomplete";

const MasterLayout = ({ children }) => {
  let pathname = usePathname();
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  let [UserName, setUserName] = useState("");
  let [UserDesig, setUserDesig] = useState("");
  const [suggestions, setsuggestions] = useState([]);

  const location = usePathname(); // Hook to get the current route


const handleLogOut = (e) => {
  e.preventDefault();
  fetch('https://backend-55jj.onrender.com/logout').then(res => {
      return res.json();
    }).then(data => {
      localStorage.clear();
      window.location.href = '/login';
  });
}

  useEffect(() => {
    const response =  fetch("https://backend-55jj.onrender.com/search_select",{
          method: 'POST', 
          headers:{ 'Accept': 'application/json',
                    'Content-Type': 'application/json'  }, 
          body: JSON.stringify({param:"",userid:localStorage.getItem('id')})
        }).then((res) =>
          res.json().then((jsprovdata) => {
          const formattedoptions = []
            jsprovdata.forEach((data) => {
              var str = data.name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
              });          
            formattedoptions.push({
            value: data.name.toString().trim().toLowerCase() +"_Type_"+ data.type.toString().trim().toLowerCase()+"_SubType_"+ data.subtype.toString().trim().toLowerCase(),
            label: str,
          })
        }); 
        setsuggestions(formattedoptions);
      }));
    fetch('https://backend-55jj.onrender.com/get_user', { 
      method: 'POST', 
        headers: {   'Accept': 'application/json',
          'Content-Type': 'application/json'  }, 
          body: JSON.stringify({ l_Username:localStorage.getItem('username'),l_userId:localStorage.getItem('id')})
      }).then(res => {
              return res.json();
      }).then(data => {
        setUserName((data.user_data[0].username == null) ? "" : data.user_data[0].username.toString().trim().toUpperCase());
        setUserDesig((data.user_data[0].designation == null) ? "" : data.user_data[0].designation.toString().trim());
    });
    if (typeof window === "undefined") return; 
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
        }
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location ||
            link.getAttribute("to") === location
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type="button"
          className="sidebar-close-btn"
        >
          <Icon icon="radix-icons:cross-2" />
        </button>
        <div>
          <Link href="/" className="sidebar-logo">
            <img
              src="assets/images/logo.png"
              alt="site logo"
              className="light-logo"
            />
            <img
              src="assets/images/logo-light.png"
              alt="site logo"
              className="dark-logo"
            />
            <img
              src="assets/images/logo-icon.png"
              alt="site logo"
              className="logo-icon"
            />
          </Link>
        </div>
        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
            <li className="dropdown">
              <Link href="#">
                <Icon
                  icon="solar:home-smile-angle-outline"
                  className="menu-icon"
                />
                <span>Dashboard</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/"
                    className={pathname === "/" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sales-dashboard"
                    className={
                      pathname === "/sales-dashboard" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />{" "}
                    Sales Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/goods-dashboard"
                    className={pathname === "/goods-dashboard" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />
                    Goods Dashboard
                  </Link>
                </li>
                <li>
                <Link
                    href="/oils-dashboard"
                    className={pathname === "/oils-dashboard" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-purple w-auto" />
                    Oils Dashboard
                  </Link>
                </li>
              </ul>   
            </li>
            <li className="dropdown">
              <Link href="#">
                <Icon
                  icon="mingcute:exchange-dollar-line"
                  className="menu-icon"
                />
                <span>Transactions</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/cash-book"
                    className={pathname === "/cash-book" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />{" "}
                    CashBook
                  </Link>
                </li>
              </ul>
            </li>

            <li className="sidebar-menu-group-title">Logistics</li>
            <li className="dropdown">
              <Link href="#">
                <Icon
                  icon="mingcute:shopping-bag-3-line"
                  className="menu-icon"
                />
                <span>Goods</span>
              </Link>
              <ul className="sidebar-submenu">
              <li>
                  <Link
                    href="/add-manifest"
                    className={
                      pathname === "/add-manifest" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />{" "}
                    Manifest
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/add_party-goods"
                    className={
                      pathname === "/add_party-goods" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />{" "}
                    New Party Bill
                  </Link>
                </li> */}
                {/* <li>
                  <Link
                    href="/party-goods"
                    className={
                      pathname === "/party-goods" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />{" "}
                    Party Bill
                  </Link>
                </li> */}

                  <li>
                  <Link
                    href="/goods-parties"
                    className={pathname === "/goods-parties" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    Parties
                  </Link>
                </li>

                <li>
                  <Link
                    href="/goods-vehicle"
                    className={pathname === "/goods-vehicle" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />{" "}
                    Vehicles
                  </Link>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <Link href="#">
                <Icon
                  icon="tabler:shopping-bag-check"
                  className="menu-icon"
                />
                <span>Oil</span>
              </Link>
              <ul className="sidebar-submenu">
              <li>
                  <Link
                    href="/add-oil-manifest"
                    className={
                      pathname === "/add-oil-manifest" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />{" "}
                    Manifest
                  </Link>
                </li>
                    {/* <li>
                  <Link
                    href="/add_party-oil"
                    className={
                      pathname === "/add_party-oil" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />{" "}
                    New Party Bill
                  </Link>
                </li> */}
                {/* <li>
                  <Link
                    href="/party-oils"
                    className={pathname === "/party-oils" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    Party Bill
                  </Link>
                </li> */}

                  <li>
                  <Link
                    href="/oil-parties"
                    className={pathname === "/oil-parties" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />{" "}
                    Parties
                  </Link>
                </li>

                <li>
                  <Link
                    href="/oil-vehicles"
                    className={pathname === "/oil-vehicles" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />{" "}
                    Vehicles
                  </Link>
                </li>
              </ul>
            </li>
            <li className="sidebar-menu-group-title">Sales & Inventory</li>
            <li className="dropdown">
            <Link href="#">
                <Icon
                  icon="octicon:graph"
                  className="menu-icon"
                />
                <span>Sales</span>
              </Link>

              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/new-invoice"
                    className={
                      pathname === "/new-invoice" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    New Invoice
                  </Link>
                </li>
				
				                <li>
                  <Link
                    href="/manage-invoice"
                    className={
                      pathname === "/manage-invoice" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />{" "}
                    Manage Invoice
                  </Link>
                </li>
				
				                <li>
                  <Link
                    href="/new-quote"
                    className={
                      pathname === "/new-quote" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />{" "}
                    New Quote
                  </Link>
                </li>

                
                <li>
                  <Link
                    href="/manage-quote"
                    className={
                      pathname === "/manage-quote" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-purple w-auto" />{" "}
                    Manage Quote
                  </Link>
                </li>
              </ul>
            </li>

            {/* <li className="dropdown">
            <Link href="#">
                <Icon
                  icon="fluent-mdl2:recurring-task"
                  className="menu-icon"
                />
                <span>Recurring Sales</span>
              </Link>

              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/recc-new-invoice"
                    className={
                      pathname === "/recc-new-invoice" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    New Invoice
                  </Link>
                </li>

                <li>
                  <Link
                    href="/manage-recc-invoice"
                    className={
                      pathname === "/manage-recc-invoice" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Manage Invoice
                  </Link>
                </li>
              </ul>
            </li> */}

            <li className="sidebar-menu-group-title">Stock</li>
            <li className="dropdown">
            <Link href="#">
                <Icon
                  icon="ep:element-plus"
                  className="menu-icon"
                />
                <span>Product Manager</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/add-product"
                    className={
                      pathname === "/add-product" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    New Product
                  </Link>
                </li>

                <li>
                  <Link
                    href="/manage-product"
                    className={
                      pathname === "/manage-product" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Manage Product
                  </Link>
                </li>
				
				                <li>
                  <Link
                    href="/product_category"
                    className={
                      pathname === "/product_category" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />{" "}
                    Product Categories
                  </Link>
                </li>
				
				        <li>
                  <Link
                    href="/add-warehouse-list"
                    className={
                      pathname === "/add-warehouse-list" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />{" "}
                    Warehouse
                  </Link>
                </li>

                <li>
                  <Link
                    href="/stock-transfer"
                    className={
                      pathname === "/stock-transfer" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-purple w-auto" />{" "}
                    Stock Transfer
                  </Link>
                </li>
              </ul>
            </li>
            <li className="dropdown">
            <Link href="#">
                <Icon
                  icon="ep:shopping-cart-full"
                  className="menu-icon"
                />
                <span>Purchase Order</span>
              </Link>

              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/new-order"
                    className={
                      pathname === "/new-order" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    New Order
                  </Link>
                </li>

                <li>
                  <Link
                    href="/manage-order"
                    className={
                      pathname === "/manage-order" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Manage Order
                  </Link>
                </li>
              </ul>
            </li>
            <li className="dropdown">
            <Link href="#">
                <Icon
                  icon="ep:refresh-left"
                  className="menu-icon"
                />
                <span>Stock Return</span>
              </Link>

              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/new-stock"
                    className={
                      pathname === "/new-stock" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    Add New
                  </Link>
                </li>

                <li>
                  <Link
                    href="/manage-stock"
                    className={
                      pathname === "/manage-stock" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Records
                  </Link>
                </li>
              </ul>
            </li>
            <li className="sidebar-menu-group-title">Contacts</li>
            <li className="dropdown">
            <Link href="#">
                <Icon
                  icon="rivet-icons:user-group"
                  className="menu-icon"
                />
                <span>Customer</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/new-customer"
                    className={
                      pathname === "/new-customer" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    New Customer
                  </Link>
                </li>

                <li>
                  <Link
                    href="/manage-customer"
                    className={
                      pathname === "/manage-customer" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Manage Customer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/manage-customer-group"
                    className={
                      pathname === "/manage-customer-group" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />{" "}
                    Manage Group
                  </Link>
                </li>
              </ul>
            </li>
            <li className="dropdown">
            <Link href="#">
                <Icon
                  icon="ep:van"
                  className="menu-icon"
                />
                <span>Supplier</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/new-supplier"
                    className={
                      pathname === "/new-supplier" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    New  Supplier
                  </Link>
                </li>

                <li>
                  <Link
                    href="/manage-supplier"
                    className={
                      pathname === "/manage-supplier" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Manage  Supplier
                  </Link>
                </li>
              </ul>
            </li>
            <li className="sidebar-menu-group-title">Finance</li>
           
            <li className="dropdown">
            <Link href="#">
                <Icon
                  icon="carbon:account"
                  className="menu-icon"
                />
                <span>Accounts</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/add-chart-account"
                    className={
                      pathname === "/add-chart-account" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    Chart of Account
                  </Link>
                </li>

                <li>
                  <Link
                    href="/tial-balance"
                    className={
                      pathname === "/tial-balance" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Trial Balance
                  </Link>
                </li>
				
				                <li>
                  <Link
                    href="/profit-loss"
                    className={
                      pathname === "/profit-loss" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />{" "}
                    Profit & Loss
                  </Link>
                </li>         
              </ul>
              </li>

              <li className="dropdown">
            <Link href="#">
                <Icon
                  icon="ix:report-text"
                  className="menu-icon"
                />
                <span>Reports</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/sales-report"
                    className={
                      pathname === "/sales-report" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    Sales Report
                  </Link>
                </li>

                <li>
                  <Link
                    href="/purchase-report"
                    className={
                      pathname === "/purchase-report" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Purchase Report
                  </Link>
                </li>
				
				      <li>
                  <Link
                    href="/stock-details"
                    className={
                      pathname === "/stock-details" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />{" "}
                    Stock Details
                  </Link>
                </li>
                <li>
                  <Link
                    href="/manifest-goods-report"
                    className={
                      pathname === "/manifest-goods-report" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />{" "}
                    Manifest Goods
                  </Link>
                </li>
                <li>
                  <Link
                    href="/manifest-oil-report"
                    className={
                      pathname === "/manifest-oil-report" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-purple w-auto" />{" "}
                    Manifest Oils
                  </Link>
                </li>  
                <li>
                  <Link
                    href="/all-goods-report"
                    className={
                      pathname === "/all-goods-report" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />{" "}
                    Goods Report
                  </Link>
                </li>         
                <li>
                <Link
                    href="/all-oil-report"
                    className={
                      pathname === "/all-oil-report" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    Oils Report
                  </Link>
                </li>            
                <li>
                  <Link
                    href="/all-party-report"
                    className={
                      pathname === "/all-party-report" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-purple w-auto" />{" "}
                    All Parties Report
                  </Link>
                </li>         
                <li>
                  <Link
                    href="/tax-report"
                    className={
                      pathname === "/tax-report" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />{" "}
                    Tax Report
                  </Link>
                </li>         
                <li>
                  <Link
                    href="/all-transactions"
                    className={
                      pathname === "/all-transactions" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />{" "}
                    All Transactions
                  </Link>
                </li> 
                <li>
                  <Link
                    href="/balancesheet"
                    className={
                      pathname === "/balancesheet" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    Balancesheet
                  </Link>
                </li>             
                <li>
                  <Link
                    href="/bank-statement"
                    className={
                      pathname === "/bank-statement" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Bank Statement
                  </Link>
                </li>                         
              </ul>
              </li>
              <li className="dropdown">
              <Link href="#">
                <Icon
                  icon="icon-park-outline:setting-two"
                  className="menu-icon"
                />
                <span>Setups</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/add-account-types"
                    className={
                      pathname === "/add-account-types" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    Account Types
                  </Link>
                </li>

                <li>
                  <Link
                    href="/add-account-sub-types"
                    className={
                      pathname === "/add-account-sub-types" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Account Sub Types
                  </Link>
                </li> 
              </ul>
            </li>
          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon="iconoir:arrow-right"
                      className="icon text-2xl non-active"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:bars-3-solid"
                      className="icon text-2xl non-active "
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type="button"
                  className="sidebar-mobile-toggle"
                >
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>
                <div> 
                <form className="navbar-search">
                <Autocomplete suggestions={suggestions} />
                  </form>
                </div>

              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                {/* ThemeToggleButton */}
                <ThemeToggleButton />
                {/* Notification dropdown end */}
                <div className="dropdown">
                  <button
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src="assets/images/user.png"
                      alt="image_user"
                      className="w-40-px h-40-px object-fit-cover rounded-circle"
                    />
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-sm">
                    <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-2">
                          {UserName}
                        </h6>
                        <span className="text-secondary-light fw-medium text-sm">
                          {UserDesig}
                        </span>
                      </div>
                      <button type="button" className="hover-text-danger">
                        <Icon
                          icon="radix-icons:cross-1"
                          className="icon text-xl"
                        />
                      </button>
                    </div>
                    <ul className="to-top-list">
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                          href="/view-profile"
                        >
                          <Icon
                            icon="solar:user-linear"
                            className="icon text-xl"
                          />{" "}
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3"
                          href="#" onClick={handleLogOut}
                        >
                          <Icon icon="lucide:power" className="icon text-xl" />{" "}
                          Log Out
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Profile dropdown end */}
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className="dashboard-main-body">{children}</div>

        {/* Footer section */}
        <footer className="d-footer">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <p className="mb-0"></p>
            </div>
            <div className="col-auto">
              <p className="mb-0">
                <span className="text-primary-600"></span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;
