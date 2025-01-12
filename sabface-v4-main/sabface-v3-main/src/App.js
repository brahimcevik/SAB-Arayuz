import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "./context/themeContenx";
import store from "./redux/store";
import NavBar from "./components/NavBar";
import TopBar from "./components/TopBar";
import SignInPage from "./containers/SignInPage";
import VehiclePage from "./containers/VehiclePage";
import MainPage from "./containers/MainPage";
import Camera from "./containers/CameraPage";
import Mode from "./containers/Mode";
import Graphic from "./containers/GrapichPage";
import ChatbotIcon from "./components/ChatbotIcon";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authState = sessionStorage.getItem("isAuthenticated");
    if (authState === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider theme>
      <Provider store={store}>
        <Router>
          <div className="min-h-screen flex flex-col h-screen font-poppins bg-white dark:bg-sabDarkBG p-0">
            {isAuthenticated && <NavBar />}
            <div className="flex flex-grow">
              {isAuthenticated && <TopBar />}

              {/* Giriş yapılmamış kullanıcılar için rotalar */}
              {!isAuthenticated && (
                <div className="w-full">
                  <Routes>
                    <Route
                      path="/signin"
                      element={
                        <SignInPage setIsAuthenticated={setIsAuthenticated} />
                      }
                    />
                    <Route path="*" element={<Navigate to="/signin" />} />
                  </Routes>
                </div>
              )}

              {/* Giriş yapılmış kullanıcılar için rotalar */}
              {isAuthenticated && (
                <div>
                  <Routes>
                    <Route path="/MainPage" element={<MainPage />} />
                    <Route path="/" element={<MainPage />} />
                    <Route path="/Camera" element={<Camera />} />
                    <Route path="/Mode" element={<Mode />} />
                    <Route path="/Graphic" element={<Graphic />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              )}
            </div>
            {isAuthenticated && <ChatbotIcon />}
          </div>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
