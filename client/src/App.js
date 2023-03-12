import Main from "./Main";
import "./input.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./components/Verify";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Preview from "./components/Preview";
import Dashboard from "./pages/Dasboard";
import TourRequest from "./pages/TourRequest";
import { useEffect, useState } from "react";
import TourGuide from "./pages/TourGuide";
import Payment from "./pages/Payment";
import Withdraw from "./components/Withdraw";
import SupportUser from "./pages/SupportUser";
import ProductFeedback from "./pages/ProductFeedback";
import PageNotFound from "./pages/PageNotFound";
import FormData from "form-data";
import AddTourGuide from "./components/AddTourGuide";

function App() {
  //to save reg form input
  const [regForm, setRegForm] = useState({
    company_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  // console.log(regForm);

  //to handle form input change chnage
  function handleRegChange(event) {
    const { id, value } = event.target;
    setLoginErrorMessage("");
    setRegErrorMessage("");
    setRegForm((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  }

  //to save login form input
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  //to handle form input change chnage
  function handleLoginChange(event) {
    const { id, value } = event.target;
    setLoginErrorMessage("");
    setNetworkError(false);
    setRegErrorMessage("");
    setLoginForm((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  }

  const [showLoader, setShowLoader] = useState(false);

  const navigate = useNavigate();

  const [regErrorMessage, setRegErrorMessage] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  function closeUserMod() {
    setRegisterSuccess(false);
    setLoginSuccess(false);
    setRegErrorMessage("");
    setLoginErrorMessage("");
    setLoggedOut(false);
    setPackageCreated(false);
  }

  async function regGo(e) {
    e?.preventDefault();
    setShowLoader(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: new URLSearchParams(regForm), //to send as form encoded
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const data = await response.json();

      if (response.ok) {
        setRegisterSuccess(true);
        setTimeout(() => {
          setRegisterSuccess(false);
        }, 10000);
        navigate("/login");
      } else if (!response.ok) {
        window.scrollTo(0, 0);
        setRegErrorMessage(data.message);
      }
    } catch (error) {
      setNetworkError(true);
    } finally {
      setShowLoader(false);
    }
  }

  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("isLoggedIn")) || false
  );
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );

  async function loginGo(e) {
    e.preventDefault();
    setShowLoader(true);
    try {
      const response = await fetch("/api/login", {
        //change back to /api/login
        method: "POST",
        body: new URLSearchParams(loginForm), //to send as form encoded
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        setIsLoggedIn(true);
        setLoginSuccess(true);
        setTimeout(() => {
          setLoginSuccess(false);
        }, 10000);
        navigate("/dashboard");
        window.scrollTo(0, 0);
        console.log(response.status, response.statusText);
      } else if (!response.ok) {
        setLoginErrorMessage(data.message);
        console.log(response.status, response.statusText);
        setIsLoggedIn(false);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      setNetworkError(true);
      console.log(error);
    } finally {
      setShowLoader(false);
    }
  }

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  const [loggedOut, setLoggedOut] = useState(false);

  //to log out users
  const logout = async () => {
    localStorage.setItem("isLoggedIn", false);
    localStorage.removeItem("userData");
    localStorage.removeItem("tourPackages");
    localStorage.removeItem("tourGuides");
    setTourPackageFromDb([]);

    navigate("/");
    setIsLoggedIn(false);
    setLoggedOut(true);
    setTimeout(() => {
      setLoggedOut(false);
    }, 5000);
  };

  //to upload tour photos
  const [tourPhotos, setTourPhotos] = useState([]);
  function handleAddPhotos(e) {
    let key = `tour_image_${tourPhotos.length + 1}`;
    setTourPhotos((prev) => {
      return [
        ...prev,
        {
          [key]: `${(window.URL || window.webkitURL)?.createObjectURL(
            e.target.files[0]
          )}`,
          hover: false,
        },
      ];
    });
  }
  function handleRemovePhoto(index) {
    let photos = [...tourPhotos];
    photos.splice(index, 1);
    setTourPhotos(photos);
  }

  function handlePhotoHover(index) {
    let photos = [...tourPhotos];
    photos[index].hover = true;
    setTourPhotos(photos);
  }

  function handlePhotoMouseout(index) {
    let photos = [...tourPhotos];
    photos[index].hover = false;
    setTourPhotos(photos);
  }

  //to join rules fields
  const [rules, setRules] = useState({
    rule_1: "",
    rule_2: "",
    rule_3: "",
    rule_4: "",
    rule_5: "",
  });

  //to join what to expect fields
  const [whatToExpect, setWhatToExpect] = useState({
    what_to_expect_1: "",
    what_to_expect_2: "",
    what_to_expect_3: "",
    what_to_expect_4: "",
    what_to_expect_5: "",
  });

  //to join dates and times
  const [tourPackageTime, setTourPackageTime] = useState({
    start_time_time: "",
    start_time_ampm: "AM",
    start_date_day: "",
    start_date_month: "",
    start_date_year: "",
    end_date_day: "",
    end_date_month: "",
    end_date_year: "",
  });

  //to create tour package
  const [tourPackageData, setTourPackageData] = useState({
    title: "",
    destination: "",
    meeting_point: "",
    start_time: "",
    start_date: "",
    end_date: "",
    price: "",
    tour_image: [
      {
        tour_image: "",
        hover: false,
      },
      {
        tour_image: "",
        hover: false,
      },
      {
        tour_image: "",
        hover: false,
      },
    ],
    language: "",
    number_of_tourists: "",
    description: "",
    what_to_expect: {
      what_to_expect_1: "",
      what_to_expect_2: "",
      what_to_expect_3: "",
    },
    rules: {
      rule_1: "",
      rule_2: "",
      rule_3: "",
    },
  });

  //to handle form input change chnage
  function handleTourChange(event) {
    const { id, value } = event.target;
    setTourPackageData((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  }

  //to handle form input time chnage
  function handleTimeChange(event) {
    const { id, value } = event.target;
    setTourPackageTime((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  }

  //to handle form input time chnage
  function handleWhatToEXpectChange(event) {
    const { id, value } = event.target;
    setWhatToExpect((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  }

  //to handle form input rule chnage
  function handleRuleChange(event) {
    const { id, value } = event.target;
    setRules((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  }

  //to join time strings together
  function joinStr(e) {
    e.preventDefault();
    tourPackageData.start_time = `${tourPackageTime.start_time_time}${tourPackageTime.start_time_ampm}`;
    tourPackageData.start_date = `${tourPackageTime.start_date_day}-${tourPackageTime.start_date_month}-${tourPackageTime.start_date_year}`;
    tourPackageData.end_date = `${tourPackageTime.end_date_day}-${tourPackageTime.end_date_month}-${tourPackageTime.end_date_year}`;
    console.log(tourPackageData);
    navigate("/step2");
  }

  function joinWhatToExpect() {
    tourPackageData.what_to_expect = whatToExpect;
    tourPackageData.tour_image = tourPhotos;
    console.log(tourPackageData);
  }

  function joinRules() {
    tourPackageData.rules = rules;
    console.log(tourPackageData);
    navigate("/preview");
  }

  //to handle the link highlight of current page
  const location = useLocation();
  let currentPage = location.pathname;

  useEffect(() => {
    setLoginErrorMessage("");
    setRegErrorMessage("");
    setNetworkError(false);
    setpasswordDoNotMatch(false);
  }, [currentPage]);

  const [passwordDoNotMatch, setpasswordDoNotMatch] = useState(false);
  function retypePassword() {
    setpasswordDoNotMatch(true);
  }
  //to show and hide password
  const [showPassword, setShowPassword] = useState(false);
  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  //create tour package button
  function addTourPackage() {
    navigate("/step1");
  }

  const [packageCreated, setPackageCreated] = useState(false);
  const [packageMssg, setPackageMssg] = useState("");

  async function submitTourPackage(e) {
    e.preventDefault();
    setShowLoader(true);

    const formData = new FormData();
    formData.append("data", JSON.stringify(tourPackageData));

    const headers = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    };

    try {
      const response = await fetch("/api/auth/add/packages", {
        method: "POST",
        body: formData,
        headers,
      });
      const data = await response.json();

      if (response.ok) {
        setPackageMssg(data.message);
        setPackageCreated(true);
        setTimeout(() => {
          setPackageCreated(false);
        }, 10000);
        navigate("/dashboard");
        window.scrollTo(0, 0);
        console.log(response.status, data, data.message);
      } else {
        console.error(`Error: (${response.status} ${response.statusText})`);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoader(false);
    }
  }

  // async function submitTourPackage(e) {
  //   e.preventDefault();
  //   setShowLoader(true);

  //   const formData = new FormData();
  //   formData.set("data", tourPackageData);

  //   try {
  //     const response = await fetch("/api/auth/add/packages", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const data = await response.json();

  //     if (response.ok) {
  //       setPackageMssg(data.message);
  //       setPackageCreated(true);
  //       setTimeout(() => {
  //         setPackageCreated(false);
  //       }, 10000);
  //       navigate("/dashboard");
  //       window.scrollTo(0, 0);
  //       console.log(response.status, data);
  //     } else {
  //       console.error(`Error: (${response.status} ${response.statusText})`);
  //       window.scrollTo(0, 0);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setShowLoader(false);
  //   }
  // }

  //to get tour packages
  const [tourPackageFromDb, setTourPackageFromDb] = useState(
    JSON.parse(localStorage.getItem("tourPackages")) || []
  );
  const [errorTpFetch, setErrorTpFetch] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchTourPackageFromDb = async () => {
        setShowLoader(true);

        try {
          const response = await fetch("/api/auth/load/packages");
          const data = await response.json();
          // console.log(data);

          if (data.message === "No available tour package\n") {
            return;
          } else if (data.tours?.length > 0) {
            setTourPackageFromDb(data);
            localStorage.setItem("tourPackages", JSON.stringify(data));
          }
          if (!response.ok) {
            setErrorTpFetch("Bad network connection");
            throw new Error("Network response was not ok");
          }
        } catch (error) {
          setErrorTpFetch(error.message);
        } finally {
          setShowLoader(false);
        }
      };

      fetchTourPackageFromDb();
    }
  }, [isLoggedIn]);

  //to verify identity   //to verify identity   //to verify identity   //to verify identity   //to verify identity   //to verify identity
  //to verify identity   //to verify identity   //to verify identity   //to verify identity   //to verify identity   //to verify identity
  //to verify identity   //to verify identity   //to verify identity   //to verify identity   //to verify identity   //to verify identity

  const [verifyformData, setVerifyFormData] = useState({
    fullName: "",
    phoneNumber: "",
    idImage: null,
    certImage: null,
  });

  const handleVerifyInputChange = (event) => {
    const { name, value } = event.target;
    setVerifyFormData({ ...verifyformData, [name]: value });
  };

  const handleIdChange = (event) => {
    const idImage = event.target.files[0];
    setVerifyFormData({ ...verifyformData, idImage });
  };

  const handleCertChange = (event) => {
    const certImage = event.target.files[0];
    setVerifyFormData({ ...verifyformData, certImage });
  };

  const handleVerifySubmit = async (event) => {
    event.preventDefault();
    setShowLoader(true);
    const endpoint = "/api/verify/document";
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", verifyformData.fullName);
    formDataToSend.append("phoneNumber", verifyformData.phoneNumber);
    formDataToSend.append("idImage", verifyformData.idImage);
    formDataToSend.append("certImage", verifyformData.certImage);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formDataToSend,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoader(false);
    }
  };

  //to add tour guide   //to add tour guide   //to add tour guide   //to add tour guide   //to add tour guide   //to add tour guide
  //to add tour guide   //to add tour guide   //to add tour guide   //to add tour guide   //to add tour guide   //to add tour guide
  //to add tour guide   //to add tour guide   //to add tour guide   //to add tour guide   //to add tour guide   //to add tour guide

  const [tourGuideformData, setTourGuideFormData] = useState({
    full_name: "",
    bio: "",
    profile_image: null,
    id_card: null,
  });
  // console.log(tourGuideformData);

  const handleTourGuideInputChange = (event) => {
    const { id, value } = event.target;
    setTourGuideFormData({ ...tourGuideformData, [id]: value });
  };

  const [displaProfileImage, setDisplayProfileImage] = useState(null);
  const handlePhotoChange = (event) => {
    setDisplayProfileImage(URL.createObjectURL(event.target.files[0]));
    const profile_image = event.target.files[0];
    setTourGuideFormData({ ...tourGuideformData, profile_image });
  };

  const handleTourGuideIdChange = (event) => {
    const id_card = event.target.files[0];
    setTourGuideFormData({ ...tourGuideformData, id_card });
  };

  const [trackAddTg, setTrackAddTg] = useState(false);
  const [tourGuideAdded, setTourGuideAdded] = useState(false);
  const handleTourGuideSubmit = async (event) => {
    event.preventDefault();
    setShowLoader(true);
    const endpoint = "/api/auth/guide/add";
    const formDataToSend = new FormData();
    formDataToSend.append("full_name", tourGuideformData.full_name);
    formDataToSend.append("bio", tourGuideformData.bio);
    formDataToSend.append("profile_image", tourGuideformData.profile_image);
    formDataToSend.append("id_card", tourGuideformData.id_card);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formDataToSend,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // const data = await response.json();
      setTrackAddTg((prev) => !prev);
      setTourGuideAdded(true);
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoader(false);
    }
  };

  function confirmAddedTg() {
    setTourGuideAdded(false);
    navigate("/tour-guide");
    window.location.reload();
  }

  // to get tour guides
  const [tourGuideFromDb, setTourGuideFromDb] = useState(
    JSON.parse(localStorage.getItem("tourGuides")) || []
  );

  useEffect(() => {
    if (isLoggedIn) {
      const fetchTourGuideFromDb = async () => {
        setShowLoader(true);

        try {
          const response = await fetch("/api/auth/guide/load");
          const data = await response.json();
          console.log(data);

          if (data.TourGuides === null) {
            return;
          } else if (data.TourGuides !== null) {
            setTourGuideFromDb(data.TourGuides);
            localStorage.setItem("tourGuides", JSON.stringify(data.TourGuides));
          }
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
        } catch (error) {
          console.log(error);
        } finally {
          setShowLoader(false);
        }
      };

      fetchTourGuideFromDb();
    }
  }, [isLoggedIn, trackAddTg]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Main
              isLoggedIn={isLoggedIn}
              logout={logout}
              loggedOut={loggedOut}
              closeUserMod={closeUserMod}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/support" element={<Support />} />
        <Route
          path="/login"
          element={
            <Login
              handleLoginChange={handleLoginChange}
              showLoader={showLoader}
              registerSuccess={registerSuccess}
              closeUserMod={closeUserMod}
              loginGo={loginGo}
              loginErrorMessage={loginErrorMessage}
              showPassword={showPassword}
              togglePassword={togglePassword}
              networkError={networkError}
              isLoggedIn={isLoggedIn}
              logout={logout}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              regForm={regForm}
              handleRegChange={handleRegChange}
              showLoader={showLoader}
              regGo={regGo}
              closeUserMod={closeUserMod}
              regErrorMessage={regErrorMessage}
              isLoggedIn={isLoggedIn}
              logout={logout}
              passwordDoNotMatch={passwordDoNotMatch}
              retypePassword={retypePassword}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard
                currentPage={currentPage}
                logout={logout}
                isLoggedIn={isLoggedIn}
                loginSuccess={loginSuccess}
                closeUserMod={closeUserMod}
                userData={userData}
                addTourPackage={addTourPackage}
                packageCreated={packageCreated}
                packageMssg={packageMssg}
                tourPackageFromDb={tourPackageFromDb}
                errorTpFetch={errorTpFetch}
                showLoader={showLoader}
              />
            ) : (
              <Login
                handleLoginChange={handleLoginChange}
                showLoader={showLoader}
                registerSuccess={registerSuccess}
                closeUserMod={closeUserMod}
                loginGo={loginGo}
                loginErrorMessage={loginErrorMessage}
                showPassword={showPassword}
                togglePassword={togglePassword}
                networkError={networkError}
                isLoggedIn={isLoggedIn}
                logout={logout}
              />
            )
          }
        />
        <Route
          path="/add-tour-guide"
          element={
            <AddTourGuide
              handleTourGuideInputChange={handleTourGuideInputChange}
              handlePhotoChange={handlePhotoChange}
              handleTourGuideIdChange={handleTourGuideIdChange}
              handleTourGuideSubmit={handleTourGuideSubmit}
              tourGuideformData={tourGuideformData}
              displaProfileImage={displaProfileImage}
              showLoader={showLoader}
              tourGuideAdded={tourGuideAdded}
              confirmAddedTg={confirmAddedTg}
            />
          }
        />
        <Route
          path="/tour-request"
          element={<TourRequest currentPage={currentPage} logout={logout} />}
        />
        <Route
          path="/tour-guide"
          element={
            <TourGuide
              currentPage={currentPage}
              logout={logout}
              tourGuideAdded={tourGuideAdded}
              closeUserMod={closeUserMod}
              showLoader={showLoader}
              tourGuideFromDb={tourGuideFromDb}
            />
          }
        />
        <Route
          path="/payment"
          element={<Payment currentPage={currentPage} logout={logout} />}
        />
        <Route
          path="/withdraw"
          element={<Withdraw currentPage={currentPage} logout={logout} />}
        />
        <Route
          path="/support-user"
          element={<SupportUser currentPage={currentPage} logout={logout} />}
        />
        <Route
          path="/product-feedback"
          element={
            <ProductFeedback currentPage={currentPage} logout={logout} />
          }
        />
        <Route
          path="/verify"
          element={
            <Verify
              verifyformData={verifyformData}
              handleVerifyInputChange={handleVerifyInputChange}
              handleIdChange={handleIdChange}
              handleCertChange={handleCertChange}
              handleVerifySubmit={handleVerifySubmit}
              showLoader={showLoader}
            />
          }
        />
        <Route
          path="/step1"
          element={
            <Step1
              handleTourChange={handleTourChange}
              handleTimeChange={handleTimeChange}
              joinStr={joinStr}
              tourPackageData={tourPackageData}
              tourPackageTime={tourPackageTime}
            />
          }
        />
        <Route
          path="/step2"
          element={
            <Step2
              handleTourChange={handleTourChange}
              handleWhatToEXpectChange={handleWhatToEXpectChange}
              joinWhatToExpect={joinWhatToExpect}
              whatToExpect={whatToExpect}
              tourPackageData={tourPackageData}
              tourPhotos={tourPhotos}
              handleAddPhotos={handleAddPhotos}
              handlePhotoHover={handlePhotoHover}
              handlePhotoMouseout={handlePhotoMouseout}
              handleRemovePhoto={handleRemovePhoto}
            />
          }
        />
        <Route
          path="/step3"
          element={
            <Step3
              handleRuleChange={handleRuleChange}
              joinRules={joinRules}
              rules={rules}
            />
          }
        />
        <Route
          path="/preview"
          element={
            <Preview
              tourPackageData={tourPackageData}
              submitTourPackage={submitTourPackage}
              showLoader={showLoader}
            />
          }
        />

        {/* user will be redirected to this page if they input invalid URL  */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
