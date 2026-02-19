import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResumeAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem('token');
        // Backend se process kiya hua result mango
        const response = await axios.get('http://localhost:5000/api/resume/my-resume', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setData(response.data.resume);
      } catch (err) {
        console.error(err);
        // Agar data nahi mila (jaise direct URL access kiya bina upload ke) toh wapas upload par bhejo
        navigate('/student-dashboard/upload');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-20 text-xl font-bold">Loading AI Report...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your AI Career Intelligence Report</h2>
      
      {/* Total Score */}
      <div className="flex justify-center mb-8">
        <div className="bg-blue-100 p-8 rounded-full border-4 border-blue-500 text-center">
          <p className="text-sm font-bold text-blue-600 uppercase">Strength</p>
          <h1 className="text-5xl font-black text-blue-800">{data?.scores?.totalStrength || 0}%</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verified Skills */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-bold text-green-800 mb-2">Verified Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data?.extractedSkills?.map((skill, index) => (
              <span key={index} className="bg-white border border-green-300 px-2 py-1 rounded text-sm">{skill}</span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-bold text-red-800 mb-2">Missing Skills for {data?.targetRole}</h3>
          <div className="flex flex-wrap gap-2">
            {data?.missingSkills?.map((skill, index) => (
              <span key={index} className="bg-white border border-red-300 px-2 py-1 rounded text-sm text-red-600">{skill}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Button to Next Module */}
      <div className="mt-8 text-center">
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700">
          Generate Adaptive Quiz
        </button>
      </div>
    </div>
  );
};

export default ResumeAnalysis;