import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Authtoken"; // adjust path
import { Modalpop } from "../Context/Modalpopup";

export const Home = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadClick = () => {
    if (accessToken) {
      // show modal
      setShowUploadModal(true);
    } else {
      // redirect to signup
      navigate("/signup");
    }
  };

  const closeModal = () => setShowUploadModal(false);

  return (
    <>
      <h1 className="text-2xl font-extrabold flex gap-2 bg-black px-4">
        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
          Resume
        </span>
        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse">
          Check.
        </span>
        <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
          Com
        </span>
      </h1>

      <main className="relative min-h-screen w-full bg-black flex items-center justify-center overflow-x-hidden px-4 md:px-0">
        <div className="absolute inset-0 w-full h-full z-10 opacity-15">
          <DotLottieReact
            src="https://lottie.host/ddc4dbe5-5f24-42d7-b20d-cffe09e58334/DalP3tjYN1.lottie"
            loop
            autoplay
          />
        </div>

        <div className="relative z-50 flex flex-col-reverse md:flex-row w-full max-w-7xl h-full px-0 md:px-15">
          <div className="flex-1 flex flex-col justify-center items-start md:border-b-0 md:border-r border-gray-700 pr-0 md:pr-8 pb-8 md:pb-0">
            <h2 className="text-purple-400 text-lg font-semibold mb-2">
              Your AI Career Partner
            </h2>

            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              Turn Your Resume <br /> Into a Career-Boosting Story
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              Not just another resume checker. An intelligent career assistant
              that analyzes your resume, highlights strengths, and generates
              tailored cover letters — all in seconds.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={handleUploadClick}
                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
              >
                Upload Resume →
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center mt-8 md:mt-0 md:pl-5">
            <DotLottieReact
              src="https://lottie.host/aff48220-8261-472c-af2f-ebd5673988d0/nW8nFZDshz.lottie"
              loop
              autoplay
              className="w-full  h-[400px] md:w-[500px] md:h-[500px]"
            />
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
       <Modalpop />
          
      )}
    </>
  );
};
