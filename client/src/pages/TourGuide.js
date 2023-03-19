import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Sidebar from "../components/Sidebar";
import TourGuideCard from "../components/TourGuideCard";
import Footer from "../Footer";
import ScrollToTop from "../ScrollToTop";

const TourGuide = ({
  currentPage,
  handleCurrentPage,
  logout,
  showLoader,
  tourGuideFromDb,
  tgDeleted,
  handleDeleteTg,
  tgDeletedReset,
}) => {
  return (
    <div className="w-full">
      {showLoader && <Loader />}
      <Sidebar
        currentPage={currentPage}
        handleCurrentPage={handleCurrentPage}
        logout={logout}
      />

      {tgDeleted && (
        <div className="bg-slate-800/80 w-full h-screen p-3 z-[100] fixed top-0 right-0 flex justify-center items-center">
          <div className="w-full md:w-[600px] p-8 bg-white rounded-md text-center">
            <img
              alt=""
              src="/images/icons8-checkmark-64.png"
              className="w-14 h-14 mx-auto mb-4"
            />
            <p className="font-normalmb-2">Tour guide deleted successfully!</p>

            <div className="w-full flex justify-center gap-5 items-center">
              <button
                onClick={tgDeletedReset}
                className="bg-blue-500 text-white rounded-md px-8 py-2 mt-4"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full md:w-[80%] float-right bg-white pt-[70px] md:pt-[50px] px-0 md:px-12">
        <div className="w-full min-h-[80vh] mb-16 px-2 md:px-0">
          <div className="flex items-center gap-2 mt-5 mb-5 text-[1.25rem]">
            <strong>My tour guide</strong>
          </div>
          <p>View all tour guides added so far</p>

          <div className="w-full flex justify-between mt-8">
            <h1 className="font-bold text-[1.25rem]">Tour guides</h1>
            <Link to="/add-tour-guide">
              <button className="bg-blue-500 text-white rounded-md p-3">
                Add tour guide
              </button>
            </Link>
          </div>

          <div className="my-8 text-center">
            {!tourGuideFromDb.length > 0 ? (
              <div>
                <img
                  alt=""
                  src="/images/Boy with map going on a hike.png"
                  className="w-[180px] h-auto mx-auto mb-5"
                />
                <p className="text-gray-500">
                  You haven’t added any tour guide yet
                </p>
                <p className="mt-4 text-blue-500 font-bold">Add a tour guide</p>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-6 md:gap-10">
                {/* cont */}
                {tourGuideFromDb.map((item, index) => {
                  return (
                    <TourGuideCard
                      item={item}
                      key={index}
                      handleDeleteTg={handleDeleteTg}
                      tgDeleted={tgDeleted}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default TourGuide;
