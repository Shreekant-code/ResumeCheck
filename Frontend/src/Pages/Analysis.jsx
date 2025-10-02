import { useEffect, useState } from "react";
import { useAuth } from "../Context/Authtoken";
import { useSnackbar } from "notistack";
import { FaCheckCircle, FaTimesCircle, FaLightbulb, FaExclamationCircle } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare, FaPython } from "react-icons/fa";
import { SiMongodb, SiRedux, SiTailwindcss } from "react-icons/si";

export const Analysis = () => {
  const { axiosInstance } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(true);

  const skillIcons = {
    "React": <FaReact className="inline text-blue-400 mr-1" />,
    "Node.js": <FaNodeJs className="inline text-green-500 mr-1" />,
    "JavaScript": <FaJsSquare className="inline text-yellow-400 mr-1" />,
    "HTML": <FaHtml5 className="inline text-orange-500 mr-1" />,
    "CSS": <FaCss3Alt className="inline text-blue-600 mr-1" />,
    "Python": <FaPython className="inline text-blue-300 mr-1" />,
    "MongoDB": <SiMongodb className="inline text-green-600 mr-1" />,
    "Redux": <SiRedux className="inline text-purple-600 mr-1" />,
    "TailwindCSS": <SiTailwindcss className="inline text-teal-400 mr-1" />,
  };

  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        const res = await axiosInstance.get("/resume", { withCredentials: true });
        setResume(res.data.resume);
      } catch (err) {
        console.error(err);
        enqueueSnackbar(err.response?.data?.message || "Failed to fetch resume", { variant: "error" });
      }
    };

    fetchLatestResume();

    // Simulate scanning delay
    const timer = setTimeout(() => {
      setScanning(false);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        {scanning ? (
          <>
            <div className="animate-pulse text-indigo-500 text-4xl mb-4">🔍 Scanning Resume...</div>
            <p className="text-gray-400">Analyzing content, extracting ATS metrics...</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        No resume found. Please upload first.
      </div>
    );
  }

 
  const chartData = [
    { name: "ATS Score", value: resume.atsScore },
    { name: "Skills", value: resume.skills?.length || 0 },
    { name: "Strengths", value: resume.strengths?.length || 0 },
    { name: "Weaknesses", value: resume.weaknesses?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400 flex items-center justify-center gap-2">
        <span>Resume Analysis</span>
        <FaCheckCircle className="text-green-400 animate-bounce" />
      </h1>

      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg max-w-5xl mx-auto space-y-6">

      
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-indigo-400 font-semibold mb-2">Skills</h3>
            <ul className="list-disc list-inside">
              {resume.skills?.length ? resume.skills.map((s, idx) => (
                <li key={idx}>{skillIcons[s] || null} {s}</li>
              )) : <li>None</li>}
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-1">
              <FaLightbulb /> Strengths
            </h3>
            <ul className="list-disc list-inside">
              {resume.strengths?.length ? resume.strengths.map((s, idx) => <li key={idx}>{s}</li>) : <li>None</li>}
            </ul>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-1">
              <FaExclamationCircle /> Weaknesses
            </h3>
            <ul className="list-disc list-inside">
              {resume.weaknesses?.length ? resume.weaknesses.map((s, idx) => <li key={idx}>{s}</li>) : <li>None</li>}
            </ul>
          </div>
        </div>

       
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-indigo-400 font-semibold mb-2 text-center">ATS Metrics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#6366F1" radius={[5, 5, 5, 5]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        
        {resume.suggestions?.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-indigo-400 font-semibold mb-2">Suggestions</h3>
            <ul className="list-disc list-inside">
              {resume.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};
