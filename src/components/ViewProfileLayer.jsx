"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ViewProfileLayer = () => {
  const [imagePreview, setImagePreview] = useState(
    "assets/images/user-grid/user-grid-img13.png"
  );

  const [fullName, setfullName] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [userPhone, setuserPhone] = useState("");
  const [designation, setdesignation] = useState("");
  const [department, setdepartment] = useState("");
  const [language, setlanguage] = useState("");
  const [descrip, setdescrip] = useState("");
  const [profileId, setId] = useState("");
  const [userName, setuserName] = useState("");
  const canSubmit = fullName.length > 0 && userEmail.length > 0;


  const [v_fullName, setv_fullName] = useState("");
  const [v_userEmail, setv_userEmail] = useState("");
  const [v_userPhone, setv_userPhone] = useState("");
  const [v_designation, setv_designation] = useState("");
  const [v_department, setv_department] = useState("");
  const [v_language, setv_language] = useState("");
  const [v_descrip, setv_descrip] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);


  const [u_password, setu_password] = useState("");
  const [u_confpassword, setu_confpassword] = useState("");

  const canSubmitPass = u_password.length > 0 && u_confpassword.length > 0;

  // Toggle function for password field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Toggle function for confirm password field
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
        fetch('https://backend-55jj.onrender.com/update_user_profile', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({ u_userId:localStorage.getItem('id'), u_fullName: fullName, u_userEmail: userEmail, u_userPhone: userPhone,u_designation:designation,u_department:department,u_language:language,u_descrip:descrip})
          }).then(res => {
              return res.json();
          }).then(data => {
           if(data.data == "updated")
            {
              refreshtable();
            }
        });
    }
  }
  function refreshtable()
  {
    handleReset();
    fetch('https://backend-55jj.onrender.com/get_user', { 
      method: 'POST', 
      headers: {   'Accept': 'application/json',
        'Content-Type': 'application/json'  }, 
        body: JSON.stringify({ l_Username:localStorage.getItem('username'),l_userId:localStorage.getItem('id')})
      }).then(res => {
          return res.json();
      }).then(data => {
        setv_fullName((data.user_data[0].fullname == null) ? "" : data.user_data[0].fullname.toString().trim());
        setv_userEmail((data.user_data[0].email == null) ? "" : data.user_data[0].email.toString().trim());
        setv_userPhone((data.user_data[0].phone == null) ? "" : data.user_data[0].phone.toString().trim());
        setv_designation((data.user_data[0].designation == null) ? "" : data.user_data[0].designation.toString().trim());
        setv_department((data.user_data[0].department == null) ? "" : data.user_data[0].department.toString().trim());
        setv_language((data.user_data[0].language == null) ? "" : data.user_data[0].language.toString().trim());
        setv_descrip((data.user_data[0].description == null) ? "" : data.user_data[0].description.toString().trim());
    });
  }

  const handleReset = () => {
    setfullName("");
    setuserEmail("");
    setuserPhone("");
    setdesignation("");
    setdepartment("");
    setlanguage("");
    setdescrip("");
  };

   const handleSubmitPass = (e) => {
    e.preventDefault();
    if(canSubmitPass)
    {
      if(u_password.toString().trim() == u_confpassword.toString().trim())
      {
        fetch('https://backend-55jj.onrender.com/change_Password', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({ u_userId:localStorage.getItem('id'), u_newPass : u_password})
          }).then(res => {
              return res.json();
          }).then(data => {
            if(data.data == "updated")
            {
              handleResetPass();
            }
        });
      }
      else
      {
        handleResetPass();
        withReactContent(Swal).fire({
          icon: "error",
          title: "Oops...",
          text: "Password Didn't Match!",
          draggable: true
        });
      }
    }
  }


  const handleResetPass = () => {
    setu_confpassword("");
    setu_password("");
  };
  const readURL = (input) => {
    if (input.target.files && input.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(input.target.files[0]);
    }
  };
  useEffect(() => {

    var username = localStorage.getItem('username');
    if (username) {
      setId(localStorage.getItem('id'));
      setuserName(localStorage.getItem('username').toString().toUpperCase());
      fetch('https://backend-55jj.onrender.com/get_user', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({ l_Username:localStorage.getItem('username'),l_userId:localStorage.getItem('id')})
          }).then(res => {
              return res.json();
          }).then(data => {
            setv_fullName((data.user_data[0].fullname == null) ? "" : data.user_data[0].fullname.toString().trim());
            setv_userEmail((data.user_data[0].email == null) ? "" : data.user_data[0].email.toString().trim());
            setv_userPhone((data.user_data[0].phone == null) ? "" : data.user_data[0].phone.toString().trim());
            setv_designation((data.user_data[0].designation == null) ? "" : data.user_data[0].designation.toString().trim());
            setv_department((data.user_data[0].department == null) ? "" : data.user_data[0].department.toString().trim());
            setv_language((data.user_data[0].language == null) ? "" : data.user_data[0].language.toString().trim());
            setv_descrip((data.user_data[0].description == null) ? "" : data.user_data[0].description.toString().trim());
      });
    }
    else
    {
      window.location.href = '/login';
    }
    }, []);
  return (
    <div className='row gy-4'>
      <div className='col-lg-4'>
        <div className='user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100'>
          <img
            src='assets/images/user-grid/user-grid-bg1.png'
            alt=''
            className='w-100 object-fit-cover'
          />
          <div className='pb-24 ms-16 mb-24 me-16  mt--100'>
            <div className='text-center border border-top-0 border-start-0 border-end-0'>
              <img
                src='assets/images/user-grid/user-grid-img14.png'
                alt=''
                className='border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover'
              />
              <h6 className='mb-0 mt-16'>{userName}</h6>
              <span className='text-secondary-light mb-16'>
                {userEmail}
              </span>
            </div>
            <div className='mt-24'>
              <h6 className='text-xl mb-16'>Personal Info</h6>
              <ul>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    Full Name
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {v_fullName}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    Email
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {v_userEmail}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    Phone Number
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {v_userPhone}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    Department
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {v_department}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    Designation
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {v_designation}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1 mb-12'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    Languages
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {v_language}
                  </span>
                </li>
                <li className='d-flex align-items-center gap-1'>
                  <span className='w-30 text-md fw-semibold text-primary-light'>
                    {" "}
                    Bio
                  </span>
                  <span className='w-70 text-secondary-light fw-medium'>
                    : {v_descrip}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className='col-lg-8'>
        <div className='card h-100'>
          <div className='card-body p-24'>
            <ul
              className='nav border-gradient-tab nav-pills mb-20 d-inline-flex'
              id='pills-tab'
              role='tablist'
            >
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link d-flex align-items-center px-24 active'
                  id='pills-edit-profile-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-edit-profile'
                  type='button'
                  role='tab'
                  aria-controls='pills-edit-profile'
                  aria-selected='true'
                >
                  Edit Profile
                </button>
              </li>
              <li className='nav-item' role='presentation'>
                <button
                  className='nav-link d-flex align-items-center px-24'
                  id='pills-change-passwork-tab'
                  data-bs-toggle='pill'
                  data-bs-target='#pills-change-passwork'
                  type='button'
                  role='tab'
                  aria-controls='pills-change-passwork'
                  aria-selected='false'
                  tabIndex={-1}
                >
                  Change Password
                </button>
              </li>
            </ul>
            <div className='tab-content' id='pills-tabContent'>
              <div
                className='tab-pane fade show active'
                id='pills-edit-profile'
                role='tabpanel'
                aria-labelledby='pills-edit-profile-tab'
                tabIndex={0}
              >
                <form className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
                  <div className='row'>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='name'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Full Name
                          <span className='text-danger-600'>*</span>
                        </label>
                        <input
                          type='text'
                          className='form-control radius-8'
                          id='name'
                          placeholder='Enter Full Name'
                          value={fullName}
                          onChange={(e) => setfullName(e.target.value)}
                          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='email'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Email <span className='text-danger-600'>*</span>
                        </label>
                        <input
                          type='email'
                          className='form-control radius-8'
                          id='email'
                          placeholder='Enter email address'
                          value={userEmail}
                          onChange={(e) => setuserEmail(e.target.value)}
                          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='number'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Phone
                        </label>
                        <input
                          type='email'
                          className='form-control radius-8'
                          id='number'
                          placeholder='Enter phone number'
                          value={userPhone}
                          onChange={(e) => setuserPhone(e.target.value)}
                          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                        />
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='depart'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Department
                          <span className='text-danger-600'>*</span>{" "}
                        </label>
                        <select
                          className='form-control radius-8 form-select'
                          id='depart'
                          value={department}
                          onChange={(e) => setdepartment(e.target.value)}
                        >
                          <option value='Select Department' disabled>
                            Select Department
                          </option>
                          <option value='Strategic Planning & Forecasting'>
                            Strategic Planning & Forecasting
                          </option>
                          <option value='Inventory Management'>
                            Inventory Management
                          </option>
                          <option value='Warehousing & Storage'>
                            Warehousing & Storage
                          </option>
                          <option value='Transportation Management'>
                            Transportation Management
                          </option>
                          <option value='Freight Forwarding & Customs Compliance'>
                            Freight Forwarding & Customs Compliance
                          </option>
                          <option value='Procurement & Supplier Management'>
                            Procurement & Supplier Management
                          </option>
                          <option value='Customer Service & Returns'>
                            Customer Service & Returns
                          </option>
                          <option value='Risk Management & Compliance'>
                            Risk Management & Compliance
                          </option>
                          <option value='Technology & Data Analytics'>
                           Technology & Data Analytics
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='desig'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Designation
                          <span className='text-danger-600'>*</span>{" "}
                        </label>
                        <select
                          className='form-control radius-8 form-select'
                          id='desig'
                          value={designation}
                          onChange={(e) => setdesignation(e.target.value)}
                        >
                          <option value='' disabled>
                            Select Designation
                          </option>
                          <option value='Logistics Coordinator'>
                            Logistics Coordinator
                          </option>
                          <option value='Supply Chain Manager'>
                            Supply Chain Manager
                          </option>
                          <option value='Warehouse Manager'>
                            Warehouse Manager
                          </option>

                          <option value='Transportation Manager'>
                            Transportation Manager
                          </option>
                          <option value='Freight Forwarder'>
                            Freight Forwarder
                          </option>
                          <option value='Procurement Specialist'>
                            Procurement Specialist
                          </option>

                          <option value='Inventory Control Manager'>
                            Inventory Control Manager
                          </option>
                          <option value='Operations Manager'>
                            Operations Manager
                          </option>
                          <option value='Customer Service Representative'>
                            Customer Service Representative
                          </option>
                          <option value='Risk & Compliance Manager'>
                            Risk & Compliance Manager
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className='col-sm-6'>
                      <div className='mb-20'>
                        <label
                          htmlFor='Language'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Language
                          <span className='text-danger-600'>*</span>{" "}
                        </label>
                        <select
                          className='form-control radius-8 form-select'
                          id='Language'
                          value={language}
                          onChange={(e) => setlanguage(e.target.value)}
                        >
                          <option value='' disabled>
                            Select Language
                          </option>
                          <option value='English'>English</option>
                          <option value='Japan'>Japan</option>
                          <option value='France'>France</option>
                          <option value='Germany'>Germany</option>
                          <option value='South Korea'>South Korea</option>
                          <option value='Bangladesh'>Bangladesh</option>
                          <option value='India'>India</option>
                          <option value='Canada'>Canada</option>
                        </select>
                      </div>
                    </div>
                    <div className='col-sm-12'>
                      <div className='mb-20'>
                        <label
                          htmlFor='desc'
                          className='form-label fw-semibold text-primary-light text-sm mb-8'
                        >
                          Description
                        </label>
                        <textarea
                          name='#0'
                          className='form-control radius-8'
                          id='desc'
                          placeholder='Write description...'
                          value={descrip}
                          onChange={(e) => setdescrip(e.target.value)}
                          onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='d-flex align-items-center justify-content-center gap-3'>
                    <button type='button' className='border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8'  onClick={handleReset}>
                      Cancel
                    </button>
                    <button type='button' className='btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8' id="btnupdateProfile" onClick={handleSubmit} disabled={!canSubmit}>
                      Save
                    </button>
                  </div>
                </form>
              </div>
              <div
                className='tab-pane fade'
                id='pills-change-passwork'
                role='tabpanel'
                aria-labelledby='pills-change-passwork-tab'
                tabIndex='0'
              >
                <div className='mb-20'>
                  <label
                    htmlFor='your-password'
                    className='form-label fw-semibold text-primary-light text-sm mb-8'
                  >
                    New Password <span className='text-danger-600'>*</span>
                  </label>
                  <div className='position-relative'>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className='form-control radius-8'
                      id='your-password'
                      placeholder='Enter New Password*'
                      value={u_password}
                      onChange={(e) => setu_password(e.target.value)}
                      onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                    />
                    <span
                      className={`toggle-password ${
                        passwordVisible ? "ri-eye-off-line" : "ri-eye-line"
                      } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                </div>

                <div className='mb-20'>
                  <label
                    htmlFor='confirm-password'
                    className='form-label fw-semibold text-primary-light text-sm mb-8'
                  >
                    Confirm Password <span className='text-danger-600'>*</span>
                  </label>
                  <div className='position-relative'>
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      className='form-control radius-8'
                      id='confirm-password'
                      placeholder='Confirm Password*'
                      value={u_confpassword}
                      onChange={(e) => setu_confpassword(e.target.value)}
                      onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                    />
                    <span
                      className={`toggle-password ${
                        confirmPasswordVisible
                          ? "ri-eye-off-line"
                          : "ri-eye-line"
                      } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                      onClick={toggleConfirmPasswordVisibility}
                    ></span>
                  </div>
                </div>

                <div className='d-flex align-items-center justify-content-center gap-3'>
                    <button type='button' className='border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8'  onClick={handleResetPass}>
                      Cancel
                    </button>
                    <button type='button' className='btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8' id="btnupdateProfile" onClick={handleSubmitPass} disabled={!canSubmitPass}>
                      Confirm
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileLayer;
