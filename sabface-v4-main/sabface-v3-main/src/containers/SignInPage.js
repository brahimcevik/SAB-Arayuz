import { useContext, useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import SABLogo from "../img/LogoBeyaz.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../redux/authSlice";
import { ThemeContext } from "../context/themeContenx";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { setCoordinates, setCityCoordinates } from "../redux/ugvCoordinatesSlice";
import { Select } from "antd";


const SignInPage = ({ setIsAuthenticated }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // State for toggling between Sign In and Sign Up forms
  const [isSignUp, setIsSignUp] = useState(false);
  

  const [countries, setCountries] = useState([]);
const [selectedCountry, setSelectedCountry] = useState(null);
const [cities, setCities] = useState([]);

// Ülkeleri API'den çek
useEffect(() => {
  fetch("https://countriesnow.space/api/v0.1/countries")
    .then((response) => response.json())
    .then((data) => setCountries(data.data))
    .catch((error) => console.error("Ülke verileri alınamadı:", error));
}, []);

const handleCountryChange = (value) => {
  setSelectedCountry(value);
  const countryData = countries.find((country) => country.country === value);
  setCities(countryData ? countryData.cities : []);
};
  // Handle sign in
  const onSignIn = async (values) => {
    const { username, password } = values;

    try {
      const response = await axios.post("https://localhost:44315/api/User/login", {
        id: "",
        username,
        password,
        createdAt: new Date().toISOString(),
        roles: ["User"],
        city: "string",
      
        
      });

      if (response.status === 200) {
        const { token, userId, coordinates, city,userName,firstName,lastName,email,phone,profilePicture,password,ulke,roles} = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("city", city);
        localStorage.setItem("userName", userName);
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("email", email);
        localStorage.setItem("phone", phone);
        localStorage.setItem("profilePicture", profilePicture);
        localStorage.setItem("password", password);
        localStorage.setItem("ulke", ulke);
        sessionStorage.setItem("roles", JSON.stringify(roles));
      
        //"userName": "emreMaster",

        if (coordinates) {
          dispatch(setCityCoordinates(coordinates));
        }

        setIsAuthenticated(true);
        dispatch(signIn());
        navigate("/MainPage");
        sessionStorage.setItem("isAuthenticated", "true");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      message.error("Kullanıcı adı veya şifre hatalı!");
    }
  };

  // Handle sign up
  const onSignUp = async (values) => {
    const { username, password, firstName,lastName, email, phone,city,ulke} = values;

    try {
      const response = await axios.post("https://localhost:44315/api/User", {
        id: "",
        username,
        password,
        createdAt: new Date().toISOString(),
        roles: ["User"],
        city,
        profile: {
          firstName,
          lastName,
          email,
          phone,
          profilePicture: "", // Default profile picture
          ulke,
        },
      });

      if (response.status === 200) {
        message.success("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        setIsSignUp(false); // Switch back to Sign In after successful sign up
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      message.error("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyiniz!");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Kullanıcı zaten giriş yapmışsa, doğrudan ana sayfaya yönlendirmeyin
    }
  }, [setIsAuthenticated, navigate]);

  // CSS Styles
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    perspective: "1000px", // 3D görünüm için perspektif
  };

  const formWrapperStyle = {
    width: "400px",
    height: "450px",
    position: "relative",
    transition: "transform 0.8s ease-in-out",
    transformStyle: "preserve-3d",
    transform: isSignUp ? "rotateY(180deg)" : "rotateY(0deg)",
  };

  const formStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };

  const logoContainerStyle = {
    marginBottom: "16px",
    display: "flex",
    justifyContent: "center",
  };

  const logoStyle = {
    maxWidth: "50%",
  };

  const signUpFormStyle = {
    ...formStyle,
    transform: "rotateY(180deg)", // Sign Up formunun arkaya dönüşü
  };

  return (
    <div style={containerStyle} className="bg-white dark:bg-sabDarkBG">
      <div style={formWrapperStyle}>
        {/* Sign In Form */}
        <div style={formStyle}>
          <Form
            name="sign_in"
            initialValues={{ remember: true }}
            onFinish={onSignIn}
            className="bg-sabGreenDark dark:bg-sabGreenHardDark"
            style={{ borderRadius: '30px' }}
          >
            <div style={logoContainerStyle}>
              <img src={SABLogo} style={logoStyle} alt="Logo" />
            </div>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Lütfen kullanıcı adınızı giriniz!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-black text-opacity-25 dark:text-gray-300" />}
                placeholder="Kullanıcı adı"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Lütfen şifrenizi giriniz!" }]}
            >
              <Input
                prefix={<LockOutlined className="text-black text-opacity-25 dark:text-gray-300" />}
                type="password"
                placeholder="Şifre"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Giriş Yap
              </Button>
            </Form.Item>
            <div className="text-center">
              <Button type="link" onClick={() => setIsSignUp(true)}>
                Kayıt Ol
              </Button>
            </div>
          </Form>
        </div>

        {/* Sign Up Form */}
        <div style={signUpFormStyle}>
          <Form
            name="sign_up"
            initialValues={{ remember: true }}
            onFinish={onSignUp}
            className="bg-sabGreenDark dark:bg-sabGreenHardDark"
                style={{ borderRadius: '30px' }}
          >
            <div style={logoContainerStyle}>
              <img src={SABLogo} style={logoStyle} alt="Logo" />
            </div>
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Lütfen adınızı giriniz!" }]}
            >
              <Input placeholder="Ad " />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Lütfen  soyadınızı giriniz!" }]}
            >
              <Input placeholder=" Soyad" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Lütfen e-posta adresinizi giriniz!" }]}
            >
              <Input placeholder="E-posta" />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: "Lütfen telefon numaranızı giriniz!" }]}
            >
              <Input placeholder="Telefon" />
            </Form.Item>
            <Form.Item
  name="ulke"
  rules={[{ required: true, message: "Lütfen ülkeyi seçiniz!" }]}
>
  <Select
    showSearch
    placeholder="Ülke seçiniz"
    onChange={handleCountryChange}
    options={countries.map((country) => ({
      value: country.country,
      label: country.country,
    }))}
    filterOption={(input, option) =>
      option.label.toLowerCase().includes(input.toLowerCase())
    }
  />
</Form.Item>

<Form.Item
  name="city"
  rules={[{ required: true, message: "Lütfen şehri seçiniz!" }]}
>
  <Select
    showSearch
    placeholder="Şehir seçiniz"
    disabled={!selectedCountry}
    options={cities.map((city) => ({
      value: city,
      label: city,
    }))}
    filterOption={(input, option) =>
      option.label.toLowerCase().includes(input.toLowerCase())
    }
  />
</Form.Item>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Lütfen kullanıcı adınızı giriniz!" }]}
            >
              <Input placeholder="Kullanıcı adı" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Lütfen şifrenizi giriniz!" }]}
            >
              <Input type="password" placeholder="Şifre" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Kayıt Ol
              </Button>
            </Form.Item>
            <div className="text-center">
              <Button type="link" onClick={() => setIsSignUp(false)}>
                Zaten bir hesabınız var mı? Giriş yapın
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <div className="fixed bottom-4 right-4">
        <button
          className={`${
            theme === "dark" ? "bg-sabGreenDark text-white" : "bg-sabDarkBG text-white"
          } px-4 py-2 rounded flex items-center space-x-2`}
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
          <span>{theme === "dark" ? "Gündüz Modu" : "Gece Modu"}</span>
        </button>
      </div>
    </div>
  );
};

export default SignInPage;