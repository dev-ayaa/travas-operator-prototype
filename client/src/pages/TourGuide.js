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
}) => {
  return (
    <div className="w-full">
      {showLoader && <Loader />}
      <Sidebar
        currentPage={currentPage}
        handleCurrentPage={handleCurrentPage}
        logout={logout}
      />

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
                  return <TourGuideCard item={item} key={index} />;
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
