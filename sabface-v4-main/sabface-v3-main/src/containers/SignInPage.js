import { useContext } from "react";
import { Form, Input, Button, message } from "antd"; 
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import SABLogo from "../img/LogoBeyaz.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../redux/authSlice";
import { ThemeContext } from "../context/themeContenx";
import { SunIcon } from "@heroicons/react/24/solid";
import { MoonIcon } from "@heroicons/react/24/solid";

const SignInPage = ({ setIsAuthenticated }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle button click to change the route
  const handleButtonClick = () => {
    setIsAuthenticated(true);
    // Use the navigate function to change the route
    navigate("/MainPage"); // Change '/vehicle' to the desired route
  };

  const onFinish = (values) => {
    const { username, password } = values;

    // Check if the username and password match the specified values
    if (username === "admin" && password === "123456") {
      handleButtonClick();
      dispatch(signIn());
    } else {
      message.error("Kullanıcı adı veya şifre hatalı!"); 
    }
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  const formStyle = {
    width: "45vh",
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
    maxWidth: "50%", // Ensure the logo doesn't exceed its container
  };

  return (
    <div style={containerStyle} className="bg-white dark:bg-sabDarkBG">
      <Form
        name="normal_login"
        style={formStyle}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className="bg-sabGreenDark dark:bg-sabGreenHardDark "
      >
        {/* Your logo */}
        <div style={logoContainerStyle}>
          <img src={SABLogo} style={logoStyle} alt="Logo" />
        </div>

        {/* Username input */}
        <Form.Item
          name="username"
          rules={[
            { required: true, message: "Lütfen kullanıcı adınızı giriniz!" },
          ]}
        >
          <Input
            prefix={
              <UserOutlined className="text-black text-opacity-25 dark:text-gray-300" />
            }
            placeholder="Kullanıcı adı"
          />
        </Form.Item>

        {/* Password input */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Lütfen şifrenizi giriniz!" }]}
        >
          <Input
            prefix={
              <LockOutlined className="text-black text-opacity-25 dark:text-gray-300" />
            }
            type="password"
            placeholder="Şifre"
          />
        </Form.Item>

        {/* Sign in button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Giriş Yap
          </Button>
        </Form.Item>
      </Form>
      <div className="fixed bottom-4 right-4">
        <button
          className={`${
            theme === "dark"
              ? "bg-sabGreenDark text-white"
              : "bg-sabDarkBG text-white"
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
