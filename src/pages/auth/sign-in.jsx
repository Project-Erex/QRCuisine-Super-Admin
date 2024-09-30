import {Input, Checkbox, Button, Typography, Spinner} from "@material-tailwind/react";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import supabase from "@/configs/supabase";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({email: "", password: "", general: ""});

  const [loading, setLoading] = useState(false);

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
      const {data, error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error || !data) {
        setErrors((prev) => ({
          ...prev,
          general: error?.message || "Login failed",
        }));
        toast.error(error?.message || "Login failed");
        return;
      }

      const userData = data.user;

      if (
        userData?.user_metadata?.isVerified &&
        userData?.user_metadata?.is_super_admin
      ) {
        const accessToken = data.session.access_token;
        localStorage.setItem("accessToken", accessToken);

        console.log("User ID:", userData.id);
        toast.success("Login successful! Fetching restaurant data...");
        await fetchRestaurantData(userData.id);
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "You do not have the necessary permissions to access this area",
        }));
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: "An unexpected error occurred",
      }));
      console.error("Error during login:", err);
    } finally {
      setLoading(false); // Always set loading to false when the operation ends
    }
  };

  const fetchRestaurantData = async (adminId) => {
    console.log("fetchRestaurantData called with adminId:", adminId); // Check if this line is executed
    if (!adminId) {
      console.error("adminId is undefined or invalid");
      setErrors((prev) => ({...prev, general: "Invalid admin ID"}));
      return; // Early exit if adminId is not valid
    }

    try {
      const {data, error} = await supabase
        .from("restaurants")
        .select("id, upload_preset, cloud_name, unique_name")
        .eq("admin_id", adminId)
        .single();

      console.log("Restaurant data:", data); // Log data for inspection
      if (error || !data) {
        setErrors((prev) => ({
          ...prev,
          general: error?.message || "Failed to fetch restaurant data",
        }));
        return;
      }

      localStorage.setItem("restaurants_id", data.id);
      localStorage.setItem("cloudName", data.cloud_name);
      localStorage.setItem("uploadPreset", data.upload_preset);
      localStorage.setItem("restaurantName", data.unique_name);
      console.log("Navigating to /dashboard/home");
      navigate("/dashboard/home");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: "An unexpected error occurred while fetching restaurant data",
      }));
      console.error("Error fetching restaurant data:", err);
    }
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
