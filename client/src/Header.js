import { Link } from "react-router-dom";
import { useState } from "react";

const Header = ({ isLoggedIn, logout }) => {
  const [openMenu, setOpenMenu] = useState(false);
  function handleClick() {
    setOpenMenu((prevState) => !prevState);
  }

  //to close the dropdown after clicking a link
  const hideDropdown = () => {
    setOpenMenu(false);
  };

  return (
    <header>
      <div className="w-full h-20 bg-white px-[5%] fixed top-0 left-0 hidden md:flex items-center z-[100] shadow-md">
        <Link to="/" className="mr-[150px]">
          <img
            alt="logo"
            src="/images/Travas Logo.png"
            className="w-[120px] h-auto mr-auto"
          />
        </Link>
        <nav className="mr-auto">
          <div className="flex items-center gap-[60px] mr-auto">
            <Link
              to="/"
              className="cursor-pointer px-[10px] py-[5px] rounded-md hover:bg-blue-500 hover:text-white hover:translate-y-[6px] transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="cursor-pointer px-[10px] py-[5px] rounded-md hover:bg-blue-500 hover:text-white hover:translate-y-[6px] transition-all duration-300"
            >
              About
            </Link>
            <Link
              to="/pricing"
              className="cursor-pointer px-[10px] py-[5px] rounded-md hover:bg-blue-500 hover:text-white hover:translate-y-[6px] transition-all duration-300"
            >
              Pricing
            </Link>
            <Link
              to="/support"
              className="cursor-pointer px-[10px] py-[5px] rounded-md hover:bg-blue-500 hover:text-white hover:translate-y-[6px] transition-all duration-300"
            >
              Support
            </Link>
          </div>
        </nav>
        {!isLoggedIn && (
          <div>
            <Link to="/login">
              <button className="bg-white font-[700] text-[0.90rem] text-blue-500 mr-[20px] px-[20px] py-[5px] border-2 border-blue-500 rounded-md hover:bg-blue-500 hover:text-white hover:translate-y-[6px] transition-all duration-300">
                Log in
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-blue-500 font-[700] text-[0.90rem] text-white px-[20px] py-[5px] rounded-md border-2 border-blue-500 hover:bg-blue-500 hover:translate-y-[6px] transition-all duration-300">
                Sign Up
              </button>
            </Link>
          </div>
        )}
        {isLoggedIn && (
          <div>
            <button
              onClick={logout}
              className="bg-white font-[700] text-[0.90rem] text-blue-500 mr-[20px] px-[20px] py-[5px] border-2 border-blue-500 rounded-md hover:bg-blue-500 hover:text-white hover:translate-y-[6px] transition-all duration-300"
            >
              Log out
            </button>
            <Link to="/dashboard">
              <button className="bg-blue-500 font-[700] text-[0.90rem] text-white px-[20px] py-[5px] rounded-md border-2 border-blue-500 hover:bg-blue-500 hover:translate-y-[6px] transition-all duration-300">
                Dashboard
              </button>
            </Link>
          </div>
        )}
      </div>

      {/*mobile header */}
      <div
        className={`md:hidden w-full h-[70px] px-[20px] bg-white fixed top-0 left-0 z-[100] border-b-[0px] border-b-[#47a3b3] flex justify-between items-center shadow-md`}
      >
        <Link to="/">
          <img
            alt="logo"
            src="/images/Travas Logo.png"
            className="w-[80px] h-auto mr-auto"
          />
        </Link>
        <img
          alt="hamburger"
          src="/images/icons8-menu-squared-50.png"
          onClick={handleClick}
          className="w-[30px] h-[30px] cursor-pointer"
        />

        {openMenu && (
          <div className="w-full h-[100vh] z-[200] bg-black/80 fixed top-0 left-0">
            <img
              className="w-[30px] h-[30px] cursor-pointer mr-[25px] absolute top-[30px] right-[10px]"
              alt=""
              src="/images/icons8-close-window-50.png"
              onClick={handleClick}
            />
            <ul className="slide float-right w-[65%] h-full bg-white px-[30px] text-[1.25rem] text-[#3F3D56] pt-[100px]">
              <li className="my-4">
                <Link to="/" onClick={hideDropdown}>
                  <div className="w-full">Home</div>
                </Link>
              </li>
              <li className="my-4">
                <Link to="/about" onClick={hideDropdown}>
                  <div className="w-full">About</div>
                </Link>
              </li>
              <li className="my-4">
                <Link to="/pricing" onClick={hideDropdown}>
                  <div className="w-full">Pricing</div>
                </Link>
              </li>
              <li className="my-4">
                <Link to="/support" onClick={hideDropdown}>
                  <div className="w-full">Support</div>
                </Link>
              </li>
              {!isLoggedIn && (
                <li className="mt-12 mb-4">
                  <Link to="/login" onClick={hideDropdown}>
                    <div className="w-[fit-content] px-10 py-1 text-center text-[0.95rem] rounded-md border-2 border-blue-500">
                      Sign In
                    </div>
                  </Link>
                </li>
              )}
              {!isLoggedIn && (
                <li className="my-4">
                  <Link to="/register" onClick={hideDropdown}>
                    <div className="w-[fit-content] px-10 py-1 text-center text-[0.95rem] rounded-md border-2 border-blue-500 bg-blue-500 text-white">
                      Register
                    </div>
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <Link to="/dashboard">
                  <li className="mt-12 mb-4">
                    <div className="w-[fit-content] bg-blue-500 px-10 py-1 text-center text-[0.95rem] rounded-md border-2 border-blue-500 text-white">
                      Dashboard
                    </div>
                  </li>
                </Link>
              )}
              {isLoggedIn && (
                <li
                  className="mb-4"
                  onClick={() => {
                    hideDropdown();
                    logout();
                  }}
                >
                  <div className="w-[fit-content] px-10 py-1 text-center text-[0.95rem] rounded-md border-2 border-blue-500">
                    Log out
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {/*mobile header */}
    </header>
  );
};

export default Header;
