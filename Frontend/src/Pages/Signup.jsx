import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../Context/Authtoken"; 
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const { setAccessToken, API_BASE_URL, axiosInstance } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleAuth = () => {
    setIsSignup(!isSignup);
    setForm({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || (isSignup && !form.name)) {
      enqueueSnackbar("Please fill all required fields", { variant: "warning" });
      return;
    }

    setLoading(true);

    try {
      let res;

      if (isSignup) {
      
        res = await axiosInstance.post("/register", form, { withCredentials: true });
        enqueueSnackbar("Signup successful!", { variant: "success" });
      } else {
        
        res = await axiosInstance.post(
          "/login",
          { email: form.email, password: form.password },
          { withCredentials: true }
        );
        enqueueSnackbar("Login successful!", { variant: "success" });
      }

     
      setAccessToken(res.data.accessToken);

      
      navigate("/");
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.response?.data?.message || "Something went wrong", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-5 flex items-center justify-center bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="flex items-center bg-gray-700 px-4 py-2 rounded-xl">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
              />
            </div>
          )}

          <div className="flex items-center bg-gray-700 px-4 py-2 rounded-xl">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center bg-gray-700 px-4 py-2 rounded-xl relative">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-transparent outline-none pr-10"
            />
            <span
              className="absolute right-3 cursor-pointer text-gray-400"
              onClick={togglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={toggleAuth}
            className="text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};
