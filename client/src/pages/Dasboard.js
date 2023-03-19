import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Sidebar from "../components/Sidebar";
import TourPackageCard from "../components/TourPackageCard";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";

const Dashboard = ({
  currentPage,
  handleCurrentPage,
  logout,
  loginSuccess,
  closeUserMod,
  userData,
  addTourPackage,
  packageCreated,
  packageMssg,
  showLoader,
  tourPackageFromDb,
  noTourGuide,
  cancelAddTgPrompt,
  verifyStatus,
}) => {
  // console.log(tourPackageFromDb);
  return (
    <div className="w-full">
      {showLoader && <Loader />}
      <Sidebar
        currentPage={currentPage}
        handleCurrentPage={handleCurrentPage}
        logout={logout}
      />
      {loginSuccess && (
        <div className="bg-white w-[fit-content] px-10 py-6 mx-5 mt-[80px] z-0 md:mt-0 border border-green-500 rounded-xl md:fixed md:right-10 md:top-10 relative flex gap-4 items-center">
          <img
            className="w-[15px] h-[15px] cursor-pointer absolute top-[15px] right-[15px]"
            alt=""
            src="/images/icons8-close-50.png"
            onClick={closeUserMod}
          />
          <img
            alt=""
            src="/images/icons8-checkmark-64.png"
            className="w-10 h-10"
          />
          <p>Login Successful</p>
        </div>
      )}
      {packageCreated && (
        <div className="bg-white w-[fit-content] px-10 py-6 mx-5 mt-[80px] z-0 md:mt-0 border border-green-500 rounded-xl md:fixed md:right-10 md:top-10 relative flex gap-4 items-center">
          <img
            className="w-[15px] h-[15px] cursor-pointer absolute top-[15px] right-[15px]"
            alt=""
            src="/images/icons8-close-50.png"
            onClick={closeUserMod}
          />
          <img
            alt=""
            src="/images/icons8-checkmark-64.png"
            className="w-10 h-10"
          />
          <p>{packageMssg}</p>
        </div>
      )}
      {noTourGuide && (
        <div className="bg-slate-800/80 w-full h-screen p-3 z-[100] fixed top-0 right-0 flex justify-center items-center">
          <div className="w-full md:w-[600px] p-8 bg-white rounded-md text-center">
            <img
              alt=""
              src="/images/icons8-box-important-50.png"
              className="w-14 h-14 mx-auto mb-4"
            />
            <p className="font-normal mb-2">
              Kindly note that at least one tour guide must be added before
              creating a tour package
            </p>

            <div className="w-full flex justify-between gap-5 items-center">
              <button
                onClick={cancelAddTgPrompt}
                className="bg-gray-400 text-white rounded-md px-6 py-2 mt-4 text-[.85rem] md:text-[1rem]"
              >
                Cancel
              </button>
              <Link to="/add-tour-guide">
                <button className="bg-blue-500 text-white rounded-md px-6 py-2 mt-4 text-[.85rem] md:text-[1rem]">
                  Add tour guide
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <div
        className={`w-full md:w-[80%] float-right bg-white ${
          loginSuccess ? "pt-8" : "pt-[80px]"
        } md:pt-[50px] px-0 md:px-12 transition-all duration-500`}
      >
        <div className="w-full min-h-[80vh] mb-16 px-3">
          <p>Welcome back</p>
          <div className="flex items-center gap-2 mt-5">
            <img
              alt=""
              src="/images/icons8-user-64.png"
              className="w-10 h-10"
            />
            <strong>{userData.company_name}</strong>
            <img
              alt=""
              src="/images/icons8-chevron-right-30.png"
              className="w-3 h-4"
            />
          </div>
          <div className="w-full h-[fit-content] md:h-[80px] flex gap-4 mt-6">
            <div className="p-3 h-[fit-content] md:h-full flex items-center border border-gray-300 rounded-md">
              <img alt="" src="/images/Vector-info.png" className="w-10" />
            </div>
            <div className="w-full py-3 px-6 border border-gray-300 rounded-md block md:flex justify-between">
              <div>
                <p>How can we serve you better?</p>
                <p className="text-[0.8rem] mt-2">
                  Help us improve the platform by giving us your feedback
                </p>
              </div>
              <Link to="/product-feedback">
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <p className="text-blue-500">Send feedback</p>
                  <img
                    alt=""
                    src="/images/icons8-chevron-right-blue.png"
                    className="w-3 h-4"
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className="w-full h-[60px] flex gap-4 mt-6">
            <div className="p-3 flex items-center border border-gray-300 rounded-md">
              <img alt="" src="/images/Invite.png" className="w-10" />
            </div>
            <div className="w-full py-3 px-6 border border-gray-300 rounded-md flex items-center justify-between">
              <div className="flex gap-8">
                <p className="underline">7</p>
                <p>How can we serve you better?</p>
              </div>
              <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center">
                <img
                  alt=""
                  src="/images/icons8-chevron-right-blue.png"
                  className="w-3 h-4"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between mt-8 mb-16 md:md-0">
            <h1 className="font-bold text-[1.25rem]">Tour Packages</h1>
            <button
              onClick={addTourPackage}
              className="bg-blue-500 hover:bg-blue-400 text-white rounded-md p-3"
            >
              Create new package
            </button>
          </div>

          <div className="w-full min-h-[250px]">
            {tourPackageFromDb.length < 1 && (
              <div className="my-10 text-center">
                <img
                  alt=""
                  src="/images/undraw_no_data_re_kwbl 1.png"
                  className="w-[180px] h-auto mx-auto mb-5"
                />
                <p className="text-gray-500">No packages yet</p>
                <p
                  className="mt-4 text-blue-500 font-bold"
                  onClick={addTourPackage}
                >
                  Create new package
                </p>
              </div>
            )}

            {tourPackageFromDb.tours?.length > 0 &&
              tourPackageFromDb.tours?.map((item, index) => {
                return <TourPackageCard key={index} item={item} />;
              })}
          </div>

          <div className="w-full h-[fit-content] md:h-[80px] flex gap-4 mt-6">
            <div className="p-3 h-[fit-content] md:h-full flex items-center border border-gray-300 rounded-md">
              <img alt="" src="/images/Vector-user.png" className="w-10" />
            </div>
            {verifyStatus === "Unverified" ? (
              <div className="w-full py-3 px-6 border border-gray-300 rounded-md block md:flex justify-between">
                <div>
                  <p>Your identity is unverified</p>
                  <p className="text-[0.8rem] mt-2">
                    Your identity would need to be verified before you'll be
                    able to create a tour package
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Link to="/verify">
                    <p className="text-blue-500">Verify identity</p>
                  </Link>
                  <img
                    alt=""
                    src="/images/icons8-chevron-right-blue.png"
                    className="w-3 h-4"
                  />
                </div>
              </div>
            ) : verifyStatus === "Verified" ? (
              <div className="w-full py-3 px-6 border border-gray-300 rounded-md block md:flex justify-between">
                <div>
                  <p>Your identity is verified!</p>
                  {/* <p className="text-[0.8rem] mt-2">
                  Your identity would need to be verified before you'll be able
                  to create a tour package
                </p> */}
                </div>
                {/* <div className="flex items-center gap-2 mt-3">
                <Link to="/verify">
                  <p className="text-blue-500">Verify identity</p>
                </Link>
                <img
                  alt=""
                  src="/images/icons8-chevron-right-blue.png"
                  className="w-3 h-4"
                />
              </div> */}
              </div>
            ) : verifyStatus === "Under review" ? (
              <div className="w-full py-3 px-6 border border-gray-300 rounded-md block md:flex justify-between">
                <div>
                  <p>Your identity is under review</p>
                  <p className="text-[0.8rem] mt-2">
                    Your identity would need to be verified before you'll be
                    able to create a tour package
                  </p>
                </div>
                {/* <div className="flex items-center gap-2 mt-3">
                <Link to="/verify">
                  <p className="text-blue-500">Verify identity</p>
                </Link>
                <img
                  alt=""
                  src="/images/icons8-chevron-right-blue.png"
                  className="w-3 h-4"
                />
              </div> */}
              </div>
            ) : null}
          </div>
        </div>
        <Footer />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Dashboard;
