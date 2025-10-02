import { useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { useSnackbar } from "notistack";
import { useAuth } from "../Context/Authtoken"; 
import { useNavigate } from "react-router-dom";

export const Modalpop = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { axiosInstance } = useAuth(); 
  const navigate=useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !position) {
      enqueueSnackbar("Please select a file and enter your position", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
    formData.append("myfile", file); // must match backend Multer key
formData.append("position", position);


      // POST to /profile with token from axiosInstance
      const res = await axiosInstance.post("/profile", formData, {
        withCredentials: true, // sends refresh token cookie
      });

      enqueueSnackbar(res.data.message || "Resume uploaded successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      navigate("/analysis");
      setFile(null);
      setPosition("");
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      enqueueSnackbar(err.response?.data?.message || "Upload failed", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md p-6 shadow-xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-white text-2xl font-bold mb-4 text-center">
          Upload Your Resume
        </h2>

        {/* Position input */}
        <input
          type="text"
          placeholder="Eg. Frontend Developer"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
        />

        {/* File input */}
        <label className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors mb-4">
          <FaUpload className="text-gray-400 mb-2" size={24} />
          <span className="text-gray-400 text-sm">
            {file ? file.name : "Click to select your resume"}
          </span>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};
