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


const ManageReccInvoiceList = () => {

  
  return (
    <div>
    <div className="col-lg-12">

    This is Manage Recc Invoice page
    </div>

    </div>
  );
};

export default ManageReccInvoiceList;