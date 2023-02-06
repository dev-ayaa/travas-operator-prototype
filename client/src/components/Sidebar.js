import { Link } from "react-router-dom";
import { useState } from "react";

const Sidebar = ({ currentPage, logout }) => {
  const [openMenu, setOpenMenu] = useState(false);
  function handleClick() {
    setOpenMenu((prevState) => !prevState);
  }

  //to close the dropdown after clicking a link
  const hideDropdown = () => {
    setOpenMenu(false);
  };

  return (
    <div>
      <div className="w-[20%] h-[100vh] py-8 fixed top-0 left-0 bg-white md:block hidden">
        <img
          alt=""
          src="/images/Travas Logo.png"
          className="w-1/3 h-auto ml-12 mb-8"
        />
        <ul className="w-full">
          <Link to="/dashboard">
            <li
              id="dashboard"
              className={`w-[90%] mb-6 py-3 px-12 cursor-pointer ${
                currentPage === "/dashboard"
                  ? "bg-white border-slate-600"
                  : "bg-gray-200 border-gray-200"
              } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
            >
              Dashboard
            </li>
          </Link>
          <Link to="/tour-request">
            <li
              id="tourRequest"
              className={`w-[90%] mb-6 py-3 px-12 cursor-pointer ${
                currentPage === "/tour-request"
                  ? "bg-white border-slate-600"
                  : "bg-gray-200 border-gray-200"
              } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
            >
              Tour Requests
            </li>
          </Link>
          <Link to="/tour-guide">
            <li
              id="tourGuide"
              className={`w-[90%] mb-6 py-3 px-12 cursor-pointer ${
                currentPage === "/tour-guide"
                  ? "bg-white border-slate-600"
                  : "bg-gray-200 border-gray-200"
              } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
            >
              My tour guides
            </li>
          </Link>
          <Link to="/payment">
            <li
              id="payment"
              className={`w-[90%] mb-6 py-3 px-12 cursor-pointer ${
                currentPage === "/payment"
                  ? "bg-white border-slate-600"
                  : "bg-gray-200 border-gray-200"
              } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
            >
              Payment
            </li>
          </Link>
          <Link to="/support-user">
            <li
              id="support"
              className={`w-[90%] mb-6 py-3 px-12 cursor-pointer ${
                currentPage === "/support-user"
                  ? "bg-white border-slate-600"
                  : "bg-gray-200 border-gray-200"
              } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
            >
              Support
            </li>
          </Link>
          <Link to="/product-feedback">
            <li
              id="product"
              className={`w-[90%] mb-6 py-3 px-12 cursor-pointer ${
                currentPage === "/product-feedback"
                  ? "bg-white border-slate-600"
                  : "bg-gray-200 border-gray-200"
              } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
            >
              Product Feedback
            </li>
          </Link>
          <Link to="/">
            <li
              id="home"
              className={`w-[90%] mb-6 py-3 px-12 cursor-pointer ${
                currentPage === "/"
                  ? "bg-white border-slate-600"
                  : "bg-gray-200 border-gray-200"
              } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
            >
              Homepage
            </li>
          </Link>
          <li
            onClick={logout}
            className={`w-[90%] mb-8 py-3 px-12 cursor-pointer bg-gray-200 border-gray-200 hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
          >
            Log out
          </li>
        </ul>
      </div>

      {/* mobile nav */}
      <div className="w-full h-[60px] fixed top-0 left-0 bg-white flex md:hidden justify-between items-center px-4 shadow-md z-50">
        <img
          alt=""
          src="/images/Travas Logo.png"
          className="w-[100px] h-auto"
        />
        <img
          alt=""
          src="/images/icons8-menu-squared-50.png"
          className="w-8 h-8"
          onClick={handleClick}
        />

        {openMenu && (
          <ul className="w-full h-[100vh] slide bg-white pt-[60px] absolute top-0 left-0">
            <img
              alt=""
              src="/images/icons8-close-window-50.png"
              className="w-8 h-8 mb-8 absolute top-5 right-3"
              onClick={hideDropdown}
            />
            <Link to="/dashboard">
              <li
                id="dashboard"
                className={`w-[70%] mb-8 py-3 px-12 cursor-pointer ${
                  currentPage === "/dashboard"
                    ? "bg-white border-slate-600"
                    : "bg-gray-200 border-gray-200"
                } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
              >
                Dashboard
              </li>
            </Link>
            <Link to="/tour-request">
              <li
                id="tourRequest"
                className={`w-[70%] mb-8 py-3 px-12 cursor-pointer ${
                  currentPage === "/tour-request"
                    ? "bg-white border-slate-600"
                    : "bg-gray-200 border-gray-200"
                } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
              >
                Tour Requests
              </li>
            </Link>
            <Link to="/tour-guide">
              <li
                id="tourGuide"
                className={`w-[70%] mb-8 py-3 px-12 cursor-pointer ${
                  currentPage === "/tour-guide"
                    ? "bg-white border-slate-600"
                    : "bg-gray-200 border-gray-200"
                } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
              >
                My tour guides
              </li>
            </Link>
            <Link to="/payment">
              <li
                id="payment"
                className={`w-[70%] mb-8 py-3 px-12 cursor-pointer ${
                  currentPage === "/payment"
                    ? "bg-white border-slate-600"
                    : "bg-gray-200 border-gray-200"
                } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
              >
                Payment
              </li>
            </Link>
            <Link to="/support-user">
              <li
                id="support"
                className={`w-[70%] mb-8 py-3 px-12 cursor-pointer ${
                  currentPage === "/support-user"
                    ? "bg-white border-slate-600"
                    : "bg-gray-200 border-gray-200"
                } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
              >
                Support
              </li>
            </Link>
            <Link to="/product-feedback">
              <li
                id="product"
                className={`w-[70%] mb-8 py-3 px-12 cursor-pointer ${
                  currentPage === "/product-feedback"
                    ? "bg-white border-slate-600"
                    : "bg-gray-200 border-gray-200"
                } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
              >
                Product Feedback
              </li>
            </Link>
            <Link to="/">
              <li
                id="home"
                className={`w-[70%] mb-8 py-3 px-12 cursor-pointer ${
                  currentPage === "/"
                    ? "bg-white border-slate-600"
                    : "bg-gray-200 border-gray-200"
                } hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
              >
                Homepage
              </li>
            </Link>
            <li
              className={`w-[70%] mb-8 py-3 px-12 cursor-pointer bg-gray-200 border-gray-200" hover:bg-white hover:border-slate-600 border rounded-r-2xl`}
              onClick={logout}
            >
              logout
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
