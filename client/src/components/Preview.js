import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";
import Loader from "./Loader";

export default function Preview({
  tourPackageData,
  submitTourPackage,
  showLoader,
}) {
  return (
    <>
      <div className="pt-[100px] md:pt-[120px] w-[90%] px-1 mx-auto md:w-full md:mx-0 md:px-[80px] pb-20">
        {showLoader && <Loader />}

        <Link to="/step3">
          <div className="flex items-center space-x-4">
            <img className="w-[16px]" src="/images/arrow.svg" alt="arrow" />
            <p>Preview</p>
          </div>
        </Link>

        <p className="font-light pt-10">
          Check through the information you provided, carefully before
          submitting
        </p>
        {/* Grid */}
        <div className="grid grid-cols-2 space-x-9 md:space-x-24 mt-10">
          {/* left grid */}
          <div className="space-y-3">
            <div>
              <h3 className="font-medium">Tour title:</h3>
              <p className="font-light">{tourPackageData.title}</p>
            </div>
            <div>
              <h3 className="font-medium">Meeting point:</h3>
              <p className="font-light">{tourPackageData.meeting_point}</p>
            </div>
            <div>
              <h3 className="font-medium">Duration:</h3>
              <p className="font-light">
                From {tourPackageData.start_date} till{" "}
                {tourPackageData.end_date}
              </p>
            </div>
            <div>
              <h3 className="font-medium">Maximum:</h3>
              <p className="font-light">
                {tourPackageData.number_of_tourists} persons
              </p>
            </div>
          </div>
          {/* right grid */}
          <div className="space-y-3">
            <div>
              <h3 className="font-medium">Destination:</h3>
              <p className="font-light">{tourPackageData.destination}</p>
            </div>
            <div>
              <h3 className="font-medium">Start time:</h3>
              <p className="font-light">{tourPackageData.start_time}</p>
            </div>
            <div>
              <h3 className="font-medium">Price:</h3>
              <p className="font-light">NGN {tourPackageData.price}</p>
            </div>
          </div>
        </div>
        {/* Itinerary */}
        <div className="mt-10">
          <h3 className="font-medium">Description:</h3>
          <p className="font-light pt-4">{tourPackageData.description}</p>
        </div>

        {/* What to expect */}
        <div className="mt-10">
          <h3 className="font-medium">What to expect:</h3>
          <ul className="font-light pt-4">
            {tourPackageData.what_to_expect.what_to_expect_1 && (
              <li>{tourPackageData.what_to_expect.what_to_expect_1}</li>
            )}
            {tourPackageData.what_to_expect.what_to_expect_2 && (
              <li>{tourPackageData.what_to_expect.what_to_expect_2}</li>
            )}
            {tourPackageData.what_to_expect.what_to_expect_3 && (
              <li>{tourPackageData.what_to_expect.what_to_expect_3}</li>
            )}
            {tourPackageData.what_to_expect.what_to_expect_4 && (
              <li>{tourPackageData.what_to_expect.what_to_expect_4}</li>
            )}
            {tourPackageData.what_to_expect.what_to_expect_5 && (
              <li>{tourPackageData.what_to_expect.what_to_expect_5}</li>
            )}
          </ul>
        </div>

        {/* Tour photos */}
        <div className="mt-10">
          <h3 className="font-medium">Tour photos</h3>
          <div className="flex items-center flex-wrap gap-4 pt-4 w-[100%]">
            {tourPackageData.tour_image?.map((item, index) => {
              return (
                <img
                  key={index}
                  src={Object.values(item)[0]}
                  alt="tour"
                  className="w-[100px] h-[100px] rounded-md object-cover object-center"
                />
              );
            })}
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-10">
          <h3 className="font-medium">Guidelines:</h3>
          <ul className="font-light pt-4">
            {tourPackageData.rules.rule_1 && (
              <li>{tourPackageData.rules.rule_1}</li>
            )}
            {tourPackageData.rules.rule_2 && (
              <li>{tourPackageData.rules.rule_2}</li>
            )}
            {tourPackageData.rules.rule_3 && (
              <li>{tourPackageData.rules.rule_3}</li>
            )}
            {tourPackageData.rules.rule_4 && (
              <li>{tourPackageData.rules.rule_4}</li>
            )}
            {tourPackageData.rules.rule_5 && (
              <li>{tourPackageData.rules.rule_5}</li>
            )}
          </ul>
        </div>

        {/* Tour guide */}
        <div className="mt-10">
          <h3 className="font-medium">Tour guide</h3>
          <div className="flex items-center space-x-4 pt-4">
            <img src="/images/tour-guide-photo.svg" alt="tour-guide" />
            <div>
              <p className="font-medium">Williams Kennedy</p>
              <p className="font-light">
                A passionate soul, a nature lover, a culture lover and someone
                who just love making people happy.
              </p>
            </div>
          </div>
        </div>

        {/* note div */}
        <div className="md:w-[50%] mx-auto mt-20 border-2 font-light text-sm py-2.5 pl-3 pr-5 space-y-2">
          <p className="font-medium">Note</p>
          <p>
            This tour package would be reviewed before being accepted on the
            Travas touurist platform
          </p>
          <p>This may take up to three(3) working days</p>
        </div>

        {/* Edit and submit button */}
        <div className="flex sm:justify-end justify-between mt-24 space-x-6">
          <Link to="/step1">
            <button className="text-[#1F66D0] bg-white border border-[#1F66D0] font-semibold px-12 py-3 md:px-24">
              Edit
            </button>
          </Link>
          <button
            onClick={submitTourPackage}
            className="bg-[#1F66D0] text-white font-semibold px-12 py-3 md:px-24"
          >
            Submit
          </button>
        </div>
        <ScrollToTop />
      </div>
      <Footer />
    </>
  );
}
