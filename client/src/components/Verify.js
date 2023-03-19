import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";
import Loader from "./Loader";

const Verify = ({
  handleVerifySubmit,
  verifyformData,
  handleVerifyInputChange,
  handleIdChange,
  handleCertChange,
  showLoader,
  verifySubmitted,
  confirmVerify,
}) => {
  return (
    <>
      {showLoader && <Loader />}
      {verifySubmitted && (
        <div className="bg-slate-800/80 w-full h-screen p-3 z-[100] fixed top-0 right-0 flex justify-center items-center">
          <div className="w-full md:w-[600px] p-8 bg-white rounded-md text-center">
            <img
              alt=""
              src="/images/icons8-checkmark-64.png"
              className="w-14 h-14 mx-auto mb-4"
            />
            <p className="font-medium mb-3">
              Your details have been submitted succesfully{" "}
            </p>

            <button
              onClick={confirmVerify}
              className="bg-blue-500 text-white rounded-md px-8 py-2 mt-4"
            >
              Okay
            </button>
          </div>
        </div>
      )}
      <div className="pt-[100px] pb-48 w-[90%] mx-auto md:w-[50%] md:pt-[150px] md:mx-0 md:pl-[80px]">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/dashboard">
            <img src="/images/arrow.svg" alt="arrow" />
          </Link>
          <h2 className="text-[1.5rem]">Verify identity</h2>
        </div>

        {/* Personnel details form */}
        <form onSubmit={handleVerifySubmit} className="space-y-12">
          <div className="space-y-2 pt-5 ">
            <h3 className="font-medium">Personal details</h3>
            <p className="font-light">
              Provide some neccessary information of a sole proprietor, director
              or representative of your business/company
            </p>
            <p className="font-medium">
              This is a compulsory step before being able to create tour package
            </p>
          </div>
          {/* name */}
          <div className="space-y-3">
            <label className="block font-light" htmlFor="full-name">
              Name of Sole proprietor, Director or representative
            </label>
            <input
              id="full_name"
              className="login-input"
              type="text"
              placeholder="Full name"
              onChange={handleVerifyInputChange}
            />
          </div>
          {/* number */}
          <div className="space-y-3">
            <label className="block font-light" htmlFor="num">
              Mobile number of Sole proprietor Director or representative
            </label>
            <div className="space-x-3 flex">
              {/* <input
                className="bg-[#F5F5F5] text-black text-opacity-50 w-[20%] pl-4 py-2.5 focus:outline-none rounded-sm"
                type="dropdown"
              /> */}
              {/* <select
                id="country_code"
                defaultValue={"DEFAULT"}
                className="bg-[#F5F5F5] text-black text-opacity-50 w-[20%] pl-4 py-2.5 focus:outline-none rounded-sm"
              >
                <option value="DEFAULT" disabled hidden>
                  +234
                </option>
                <>
                  <option value="+234">+234</option>
                </>
              </select> */}

              <input
                id="number"
                className="bg-[#F5F5F5] text-black text-opacity-50 w-full pl-4 py-2.5 focus:outline-none rounded-sm"
                type="number"
                placeholder="Mobile number"
                onChange={handleVerifyInputChange}
              />
            </div>
          </div>

          {/* means of identification */}
          <div>
            <div className="">
              <h3 className="font-medium">Means of identification</h3>
              <p className="font-light">Upload a valid ID card</p>
            </div>

            <div className="mt-3">
              <div className="w-full rounded-sm border p-2 block sm:flex justify-start items-center gap-2">
                <input
                  id="id_card"
                  className="custom-file-input"
                  type="file"
                  placeholder="Upload ID"
                  accept="image/*"
                  onChange={handleIdChange}
                />
                <p>{verifyformData.id_card?.name}</p>
              </div>
            </div>
            {/* <button className="bg-[#B6B1B1] text-center py-2 px-12 rounded-lg pointer">
              Upload
            </button> */}
          </div>

          {/* Business/Company details form */}
          <div>
            <div className="space-y-2">
              <h3 className="font-medium">Business/Company details</h3>
              <p className="font-light">
                Upload your business certificate of registration from the
                Coporate Affairs Commission
              </p>
            </div>

            {/* means of identification */}
            <div className="space-y-8 mt-3">
              <div className="w-full rounded-sm border p-2 block sm:flex justify-start items-center gap-2">
                <input
                  id="certificate"
                  className="custom-file-input"
                  type="file"
                  placeholder="Upload ID"
                  accept="image/*"
                  onChange={handleCertChange}
                />
                <p>{verifyformData.certificate?.name}</p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-2">
              <p className="font-light">
                The information provided would be reviewed
              </p>
              <p className="font-medium">Review might take up to 24 hours.</p>
            </div>

            <div className=" mx-auto">
              <button
                onClick={handleVerifySubmit}
                className="bg-[#B6B1B1] text-center py-2 px-12 rounded-md pointer w-full"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
        {/* <div className="flex items-center space-x-5 pt-14">
          <img src="/images/Checkmark.svg" alt="checkmark" />
          <p>Your details have been submitted succesfully</p>
        </div> */}
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Verify;
