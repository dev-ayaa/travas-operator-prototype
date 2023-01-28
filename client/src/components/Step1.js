import React from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";

function Step1({
  handleTourChange,
  handleTimeChange,
  joinStr,
  tourPackageData,
  tourPackageTime,
}) {
  return (
    <>
      <div className="pt-[100px] md:pt-[120px] w-[90%] px-1 mx-auto md:w-full md:mx-0 md:pl-[80px] md:pr-[50px] pb-48">
        <Link to="/dashboard">
          <div className="flex items-center space-x-4">
            <img className="w-[16px]" src="/images/arrow.svg" alt="arrow" />
            <p>Back</p>
          </div>
        </Link>
        {/* progress ball 1 */}
        <div className="w-full flex justify-center">
          <img className="w-[20%]" src="images/Progress ball-1.svg" alt="" />
        </div>
        {/*  */}
        <div className="flex items-center space-x-5 pt-8">
          <div className="rounded-full border w-fit">
            <img
              className="w-[90%] mx-auto"
              src="/images/user-groups.svg"
              alt=""
            />
          </div>

          <div className="flex flex-col border rounded-3xl px-5 py-2 md:px-9">
            <p className="font-medium">Put it out there!</p>
            <p className="font-light">
              Get your tour package in front of a large audience of tourist and
              attract more bookings
            </p>
          </div>
        </div>
        {/* form */}
        <form>
          {/* Tour title */}
          <div className="space-y-9 pt-12">
            <div className="space-y-2">
              <p className="font-medium">Tour title</p>
              <p className="font-light">
                Captivate potential tourists with a catchy tour title
              </p>
            </div>
            <input
              className="border-b-2 focus:outline-none pb-2 pl-1 w-[90%] md:w-[70%]"
              type="text"
              placeholder="Tour title"
              value={tourPackageData.title ? tourPackageData.title : ""}
              id="title"
              onChange={handleTourChange}
              required
            />
          </div>
          {/* Destination */}
          <div className="space-y-9 pt-12">
            <div className="space-y-2">
              <p className="font-medium">Destination</p>
              <p className="font-light">
                Select the destination(s) where your tour is going to be
                organized
              </p>
            </div>
            <input
              className="border-b-2 focus:outline-none pb-2 pl-1 w-[90%] md:w-[70%]"
              type="text"
              placeholder="Destination"
              value={
                tourPackageData.destination ? tourPackageData.destination : ""
              }
              id="destination"
              onChange={handleTourChange}
              required
            />
          </div>
          {/* Meeting Point */}
          <div className="space-y-9 pt-12">
            <div className="space-y-2">
              <p className="font-medium">Meeting point</p>
              <p className="font-light">
                {" "}
                Where should your tourists meet you on the tour day?{" "}
              </p>
            </div>
            <input
              className="border-b-2 focus:outline-none pb-2 pl-1 w-[90%] md:w-[70%]"
              type="text"
              placeholder="Meeting point"
              value={
                tourPackageData.meeting_point
                  ? tourPackageData.meeting_point
                  : ""
              }
              id="meeting_point"
              onChange={handleTourChange}
              required
            />
          </div>
          {/* Duration */}
          <div className="space-y-9 pt-12 w-[100%]">
            <div className="space-y-2">
              <p className="font-medium">Duration</p>
              <p className="font-light">
                This information is important and necessary
              </p>
            </div>

            <div className="flex flex-wrap justify-between gap-6 w-[100%]">
              {/* Start time */}
              <div className="space-y-6 flex flex-col">
                <label htmlFor="time">Start time</label>
                <div className="flex items-center space-x-6">
                  <input
                    className=" border-b-2 focus:outline-none pb-2 pl-1 w-[70px]"
                    type="number"
                    placeholder="10"
                    maxLength="2"
                    value={
                      tourPackageTime.start_time_time
                        ? tourPackageTime.start_time_time
                        : ""
                    }
                    id="start_time_time"
                    onChange={handleTimeChange}
                    required
                  />
                  <select
                    className="border-b-2 bg-transparent pb-2 pl-1 w-[70px]"
                    value={
                      tourPackageTime.start_time_ampm
                        ? tourPackageTime.start_time_ampm
                        : ""
                    }
                    id="start_time_ampm"
                    onChange={handleTimeChange}
                    required
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              {/* Start date */}
              <div className="space-y-6 flex flex-col">
                <label htmlFor="time">Start date</label>
                <div id="time" className="number flex items-center space-x-6">
                  {/* day */}
                  <div className="flex flex-col">
                    <input
                      className="text-center border-b-2 focus:outline-none pb-2 pl-1 w-[70px]"
                      type="number"
                      placeholder="10"
                      maxLength="2"
                      value={
                        tourPackageTime.start_date_day
                          ? tourPackageTime.start_date_day
                          : ""
                      }
                      id="start_date_day"
                      onChange={handleTimeChange}
                      required
                    />
                    <label
                      className="font-light text-center text-xs"
                      htmlFor="day"
                    >
                      Day
                    </label>
                  </div>
                  {/* month */}
                  <div className="flex flex-col">
                    <input
                      className="text-center border-b-2 focus:outline-none pb-2 pl-1 w-[70px]"
                      type="number"
                      placeholder="10"
                      maxLength="2"
                      value={
                        tourPackageTime.start_date_month
                          ? tourPackageTime.start_date_month
                          : ""
                      }
                      id="start_date_month"
                      onChange={handleTimeChange}
                      required
                    />
                    <label
                      className="text-center font-light text-xs"
                      htmlFor="month"
                    >
                      Month
                    </label>
                  </div>
                  {/* year */}
                  <div className="flex flex-col">
                    <input
                      className="text-center border-b-2 focus:outline-none pb-2 pl-1 w-[70px]"
                      type="number"
                      placeholder="2023"
                      maxLength="4"
                      value={
                        tourPackageTime.start_date_year
                          ? tourPackageTime.start_date_year
                          : ""
                      }
                      id="start_date_year"
                      onChange={handleTimeChange}
                      required
                    />
                    <label
                      className="font-light text-center text-xs"
                      htmlFor="year"
                    >
                      Year
                    </label>
                  </div>
                </div>
              </div>

              {/* Start time */}
              <div className="space-y-6 flex flex-col">
                <label htmlFor="time">End date</label>
                <div id="time" className="number flex items-center space-x-6">
                  {/* day */}
                  <div className="flex flex-col">
                    <input
                      className="text-center border-b-2 focus:outline-none pb-2 pl-1 w-[70px]"
                      type="number"
                      placeholder="10"
                      maxLength="2"
                      value={
                        tourPackageTime.end_date_day
                          ? tourPackageTime.end_date_day
                          : ""
                      }
                      id="end_date_day"
                      onChange={handleTimeChange}
                      required
                    />
                    <label
                      className="font-light text-center text-xs"
                      htmlFor="day"
                    >
                      Day
                    </label>
                  </div>
                  {/* month */}
                  <div className="flex flex-col">
                    <input
                      className="border-b-2 text-center focus:outline-none pb-2 pl-1 w-[70px]"
                      type="number"
                      placeholder="10"
                      maxLength="2"
                      value={
                        tourPackageTime.end_date_month
                          ? tourPackageTime.end_date_month
                          : ""
                      }
                      id="end_date_month"
                      onChange={handleTimeChange}
                      required
                    />
                    <label
                      className="font-light text-center  text-xs"
                      htmlFor="month"
                    >
                      Month
                    </label>
                  </div>
                  {/* year */}
                  <div className="flex flex-col">
                    <input
                      className="border-b-2 text-center focus:outline-none pb-2 pl-1 w-[70px]"
                      type="number"
                      placeholder="2023"
                      maxLength="4"
                      value={
                        tourPackageTime.end_date_year
                          ? tourPackageTime.end_date_year
                          : ""
                      }
                      id="end_date_year"
                      onChange={handleTimeChange}
                      required
                    />
                    <label
                      className="font-light text-center text-xs"
                      htmlFor="year"
                    >
                      Year
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Duration ends */}

          <div className="flex items-center space-x-6 my-12">
            <div className="bg-[#D9D9D9] h-4 w-4"></div>
            <p className="font-light"> Just a day tour </p>
          </div>

          {/* More info */}
          <div className="space-y-2 pt-12">
            <p className="font-medium">More info</p>
            <div className="flex items-center flex-wrap gap-6 justify-between w-[100%]">
              {/* price/ per person */}
              <div className="flex flex-col space-y-6">
                <label htmlFor="price">Price Per Person</label>
                <input
                  className="border-b-2 focus:outline-none pl-1 pb-2"
                  type="number"
                  placeholder="5000"
                  value={tourPackageData.price ? tourPackageData.price : ""}
                  id="price"
                  onChange={handleTourChange}
                  required
                />
              </div>
              {/* Language */}
              <div className="flex flex-col space-y-6">
                <label htmlFor="language">
                  Language your tour would be offered in
                </label>
                <input
                  className="border-b-2 focus:outline-none pl-1 pb-2"
                  type="text"
                  placeholder="Language"
                  value={
                    tourPackageData.language ? tourPackageData.language : ""
                  }
                  id="language"
                  onChange={handleTourChange}
                  required
                />
              </div>
              {/* Number of tourists */}
              <div className="flex flex-col space-y-6">
                <label htmlFor="num_of_tourists">
                  Maximum number of tourists you can take
                </label>
                <input
                  className="border-b-2 focus:outline-none pl-1 pb-2"
                  type="number"
                  placeholder="100"
                  value={
                    tourPackageData.number_of_tourists
                      ? tourPackageData.number_of_tourists
                      : ""
                  }
                  id="number_of_tourists"
                  onChange={handleTourChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            type="submit"
            className="bg-[#1F66D0] text-white font-semibold px-12 py-3 mt-16 float-right md:px-24"
            onClick={joinStr}
          >
            Next
          </button>
        </form>
        <ScrollToTop />
      </div>
      <Footer />
    </>
  );
}

export default Step1;
