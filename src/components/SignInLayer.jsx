"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React, { useState } from "react";
import { useEffect } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import moment from 'moment';

const SignInLayer = () => {

  useEffect(() => {
  }, []);

  const [userName, setuserName] = useState("");
  const [userPass, setuserPass] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const canSubmit = userName.length > 0 && userPass.length > 0;
  const handleSubmit = (e) => {
    e.preventDefault();
    if(canSubmit)
    {
      fetch('https://backend-55jj.onrender.com/login', { 
          method: 'POST', 
          headers: {   'Accept': 'application/json',
            'Content-Type': 'application/json'  }, 
            body: JSON.stringify({ l_userName: userName, l_userPass: userPass})
          }).then(res => {
              return res.json();
          }).then(data => {
          if(data.data.toString().trim() == "fail")
          {
            handleReset();
              withReactContent(Swal).fire({
                icon: "error",
                title: "Oops...",
                text: "Email or Password is incorrect!",
                draggable: true
              });
          }
          else if(data.data.toString().trim() == "success")
          {
            localStorage.setItem('username', data.sessionData.username);
            localStorage.setItem('id', data.sessionData.userId);
            window.location.href = '/';
          }
        });
    }
  }

    const handleReset = () => {
    setuserName("");
    setuserPass("");
  };


    const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='assets/images/auth/auth-img.png' alt='' />
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <Link href='#' className='mb-40 max-w-290-px'>
              <img src='assets/images/logo.png' alt='' />
            </Link>
            <h4 className='mb-12'>Sign In to your Account</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Welcome back! please enter your detail
            </p>
          </div>
          <form  className="row gy-3 needs-validation" noValidate onSubmit={e => e.preventDefault()}>
            <div className='icon-field mb-20'>
              <span className='icon top-50 translate-middle-y' style={{left:"2%"}}>
                <Icon icon='mage:email' />
              </span>

              <input
                type='email'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Email' 
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
              />
            </div>
            <div className='position-relative mb-20'>
              <div className='icon-field'>
                <span className='icon top-50 translate-middle-y'>
                  <Icon icon='solar:lock-password-outline' />
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className='form-control h-56-px bg-neutral-50 radius-12'
                  id='your-password'
                  placeholder='Password'
                  value={userPass}
                  onChange={(e) => setuserPass(e.target.value)}
                  onKeyPress={(e)=>{e.target.keyCode === 13 && e.preventDefault();}}
                />
              </div>
                <span className={`toggle-password ${
                        passwordVisible ? "ri-eye-off-line" : "ri-eye-line"
                      } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                      onClick={togglePasswordVisibility} style={{right:"2% !important"}}></span>
            </div>
            <div className=''>
              {/* <div className='d-flex justify-content-between gap-2'>
                <div className='form-check style-check d-flex align-items-center'>
                  <input
                    className='form-check-input border border-neutral-300'
                    type='checkbox'
                    defaultValue=''
                    id='remeber'
                  />
                  <label className='form-check-label' htmlFor='remeber'>
                    Remember me{" "}
                  </label>
                </div>
                <Link href='#' className='text-primary-600 fw-medium'>
                  Forgot Password?
                </Link> 
              </div> */}
            </div>

             <button className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32" id="btnlogin" onClick={handleSubmit} disabled={!canSubmit} >
                 Sign In
            </button>
            {/* <div className='mt-32 center-border-horizontal text-center'>
              <span className='bg-base z-1 px-4'>Or sign in with</span>
            </div> */}
       
            {/* <div className='mt-32 text-center text-sm'>
              <p className='mb-0'>
                Don’t have an account?{" "}
                <Link href='/sign-up' className='text-primary-600 fw-semibold'>
                  Sign Up
                </Link>
              </p>
            </div> */}
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignInLayer;
