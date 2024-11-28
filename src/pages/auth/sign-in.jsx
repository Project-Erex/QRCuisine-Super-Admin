import {
  Input,
  Checkbox,
  Button,
  Typography,
  Spinner,
  Select,
  Option,
} from "@material-tailwind/react";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getBaseUrl} from "@/configs/base_url";
export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({email: "", password: "", general: ""});
  const [version, setVersion] = useState(localStorage.getItem("selectedVersion") || "");
  const [loading, setLoading] = useState(false);

  const apiUrl = getBaseUrl();

  const validate = () => {
    let valid = true;
    let errors = {};

    if (!email) {
      errors.email = "Email is required";
      valid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // Step 1: Authenticate user with email and password
      console.log("authenticating", apiUrl);
      const response = await fetch(`${apiUrl}/api/super-admin-sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors((prev) => ({
          ...prev,
          general: result.error || "Authentication failed",
        }));
        toast.error(result.error || "Authentication failed");
        return;
      }

      // Step 2: Check super admin permissions and token
      const {data, message} = result;

      if (message === "Super admin authenticated" && data.session?.access_token) {
        const accessToken = data.session.access_token;
        localStorage.setItem("accessToken", accessToken);
        toast.success("Login successful! Redirecting to the dashboard...");
        navigate("/dashboard/home");
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Unexpected response from server",
        }));
        toast.error("Unexpected response from server");
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: "An error occurred during login",
      }));
      console.error("Error during login:", err);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load the saved version from localStorage when the component mounts
    const savedVersion = localStorage.getItem("selectedVersion");
    if (savedVersion) {
      setVersion(savedVersion);
    }
  }, []);

  const handleSelectChange = (selectedVersion) => {
    setVersion(selectedVersion);
    localStorage?.setItem("selectedVersion", selectedVersion); // Save to local storage
    window.location.reload();
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal">
            Enter your email and password to Sign In.
          </Typography>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-3 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Select Version
            </Typography>
            <Select value={version} onChange={handleSelectChange} label="Select Version">
              <Option value="USA">USA</Option>
              <Option value="India">INDIA</Option>
            </Select>
          </div>

          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <Typography variant="small" color="red" className="-mt-4">
                {errors.email}
              </Typography>
            )}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <Typography variant="small" color="red" className="-mt-4">
                {errors.password}
              </Typography>
            )}
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium">
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline">
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{className: "-ml-2.5"}}
          />
          <Button
            disabled={loading}
            type="submit"
            className=" flex items-center justify-center mt-6"
            fullWidth>
            {loading ? <Spinner className="h-5 w-5  " /> : "Login"}
          </Button>

          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">
              Create account
            </Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img src="/img/pattern.png" className="h-full w-full object-cover rounded-3xl" />
      </div>
      <ToastContainer />
    </section>
  );
}

export default SignIn;
