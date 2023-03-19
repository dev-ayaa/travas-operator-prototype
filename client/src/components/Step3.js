import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";

export default function Step3({
  joinRules,
  handleRuleChange,
  rules,
  tourGuideFromDb,
}) {
  const [assignTg, setAssignTg] = useState(false);
  function toggleAssign() {
    setAssignTg((prev) => !prev);
  }

  const [imageArr, setImageArr] = useState([]);
  useEffect(() => {
    tourGuideFromDb.forEach((item) => {
      const file = item?.profile_image.profile_data;
      if (file) {
        const data = new Uint8Array(
          atob(file.Data)
            .split("")
            .map((c) => c.charCodeAt(0))
        );
        const blob = new Blob([data], {
          type: "image/jpeg" || "image/png" || "image/jpg",
        });
        const url = URL.createObjectURL(blob);
        setImageArr((prev) => [...prev, url]);
      }
    });
  }, [tourGuideFromDb]);
  return (
    <>
      <div className="pt-[100px] md:pt-[120px] w-[90%] px-1 mx-auto md:w-full md:mx-0 md:px-[80px] pb-20 ">
        <Link to="/step2">
          <div className="flex items-center space-x-4">
            <img className="w-[16px]" src="/images/arrow.svg" alt="arrow" />
            <p>Back to step 2</p>
          </div>
        </Link>
        {/* progress ball 2 */}
        <div className="w-full flex justify-center">
          <img
            className="w-[20%]"
            src="images/Progress-balls-3.svg"
            alt="Progress-balls-3"
          />
        </div>
        {/*  Get creative */}
        <div className="flex items-center space-x-5 pt-8">
          <div className="rounded-full border w-fit">
            <img
              className="w-[90%] mx-auto"
              src="/images/Bright Mind.svg"
              alt=""
            />
          </div>

          <div className="flex flex-col border rounded-3xl px-5 py-2 md:px-9">
            <p className="font-medium">Get creative!</p>
            <p className="font-light">
              Don’t just stick to the old ways. Try out new ways to satisfy your
              tourists to the fullest
            </p>
          </div>
        </div>
        {/* Get creative ends */}

        {/* Guidelines */}
        <div className="mt-10 space-y-2">
          <h3 className="font-medium">Guidelines</h3>
          <p className="font-light">
            Give your clients some important rules they will need to adhere to
            better their safety, comfort and overall experience
          </p>
          <p className="font-medium text-sm">
            Give a minimum of 2, maximum of 6
          </p>

          {/* Guideline input */}
          {/* first row */}
          <div className="flex flex-wrap gap-6 w-[100%] pt-9">
            <div>
              <input
                className="border-b-2 focus:outline-none pl-2 pb-2 placeholder:text-xs"
                placeholder="Guideline 1"
                value={rules.rule_1 ? rules.rule_1 : ""}
                id="rule_1"
                onChange={handleRuleChange}
              />
            </div>
            <div>
              <input
                className="border-b-2 focus:outline-none pl-2 pb-2 placeholder:text-xs"
                placeholder="Guideline 2"
                value={rules.rule_2 ? rules.rule_2 : ""}
                id="rule_2"
                onChange={handleRuleChange}
              />
            </div>
            <div>
              <input
                className="border-b-2 focus:outline-none pl-2 pb-2 placeholder:text-xs"
                placeholder="Guideline 3"
                value={rules.rule_3 ? rules.rule_3 : ""}
                id="rule_3"
                onChange={handleRuleChange}
              />
            </div>
          </div>

          {/* second row */}
          <div className="flex flex-wrap gap-6 w-[100%] pt-4">
            <div>
              <input
                className="border-b-2 focus:outline-none pl-2 pb-2 placeholder:text-xs"
                placeholder="Guideline 4"
                value={rules.rule_4 ? rules.rule_4 : ""}
                id="rule_4"
                onChange={handleRuleChange}
              />
            </div>
            <div>
              <input
                className="border-b-2 focus:outline-none pl-2 pb-2 placeholder:text-xs"
                placeholder="Guideline 5"
                value={rules.rule_5 ? rules.rule_5 : ""}
                id="rule_5"
                onChange={handleRuleChange}
              />
            </div>
          </div>
        </div>
        {/* Assign a tour guide */}
        <div className="mt-10 space-y-2">
          <h3 className="font-medium">Assign a tour guide</h3>
          <p className="font-light">And lastly assign a tour to your package</p>
          <p className="font-medium text-sm">
            A tour guide impacts the overall experience of tourists during the
            tour by a lot. So get the best!
          </p>
        </div>

        {/* Assign budget */}
        {!assignTg ? (
          <div
            onClick={toggleAssign}
            className="flex justify-start mt-12 space-x-6"
          >
            <button className="bg-[#1F66D0] text-white font-semibold py-2 px-12 flex items-center shadow-md">
              Assign
              <span className="pl-4">
                <img className="w-[14px]" src="/images/plus2.svg" alt="img" />
              </span>
            </button>
          </div>
        ) : (
          <div className="w-full sm:w-[500px] mt-6 pt-14 px-4 rounded-lg bg-white border shadow-lg relative transition-all duration-300 ease-out">
            <img
              onClick={toggleAssign}
              alt=""
              src="/images/Cancel.svg"
              className="w-8 h-8 absolute top-1 right-1 cursor-pointer"
            />
            <h2 className="font-medium mb-4 text-center">
              Select a tour guide
            </h2>
            {tourGuideFromDb.map((item, index) => {
              return (
                <div
                  key={index}
                  className="w-full px-3 md:px-5 py-2 mb-3 border rounded-md flex items-center gap-3 md:gap-6 hover:bg-blue-400/30 cursor-pointer"
                >
                  <img
                    alt=""
                    src={imageArr[index]}
                    className="w-8 md:w-14 h-8 md:h-14 rounded-full object-cover border border-blue-400"
                  />
                  <p className="font-normal text-[0.85rem] md:text-[1rem]">
                    {item?.full_name}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Invite */}
        {/* <div className="pt-16">
          <a className="text-[#1F66D0] text-sm font-medium" href="/">
            Invite a new guide
          </a>
        </div> */}

        {/* Back and submit button */}
        <div className="flex sm:justify-end justify-between mt-24 space-x-6">
          <Link to="/step2">
            <button className="text-[#1F66D0] bg-white border border-[#1F66D0] font-semibold px-12 py-3 md:px-24">
              Back
            </button>
          </Link>
          <button
            className="bg-[#1F66D0] text-white font-semibold px-12 py-3 md:px-24"
            onClick={joinRules}
          >
            Preview
          </button>
        </div>
        <ScrollToTop />
      </div>
      <Footer />
    </>
  );
}
