import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const Home = () => {
  return (
    <>
    <main className="relative min-h-screen w-full bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-10 opacity-15">
            <DotLottieReact
      src="https://lottie.host/ddc4dbe5-5f24-42d7-b20d-cffe09e58334/DalP3tjYN1.lottie"
      loop
      autoplay
    />

        </div>
 
  

  <div className="relative z-50 flex w-full h-full px-15">
   
    <div className="flex-1 flex flex-col justify-center items-start border-r border-gray-700 pr-8">
      <h2 className="text-purple-400 text-lg font-semibold mb-2">
        Your AI Career Partner
      </h2>

      <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-4">
        Turn Your Resume <br /> Into a Career-Boosting Story
      </h1>

      <p className="text-gray-300 text-lg leading-relaxed mb-6">
        Not just another resume checker. An intelligent career assistant that
        analyzes your resume, highlights strengths, and generates tailored cover
        letters — all in seconds.
      </p>

      <div className="flex space-x-4">
        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-2xl shadow-lg hover:scale-105 transition">
          Upload Resume →
        </button>
        <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-2xl border border-gray-600 hover:bg-white/20 transition">
          Generate Cover Letter
        </button>
      </div>
    </div>

    <div className="flex-1 h-[500px] w-[500px] flex items-center justify-center plr-5">
     <DotLottieReact
      src="https://lottie.host/aff48220-8261-472c-af2f-ebd5673988d0/nW8nFZDshz.lottie"
      loop
      autoplay
    />
    </div>
  </div>
</main>

     
    </>
  );
};
