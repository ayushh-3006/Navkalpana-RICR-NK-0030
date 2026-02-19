import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('MERN Stack Developer'); // Default example
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Redirect karne ke liye

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }

    setLoading(true); // Loader start karo

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);

      const token = localStorage.getItem('token');
      
      // Backend ko API request bhejo jahan AI analysis hoga
      await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });

      // API success hone ke baad turant Analysis page par bhej do
      navigate('/student-dashboard/analysis');
      
    } catch (err) {
      console.error(err);
      setError('Failed to process resume. Please try again.');
      setLoading(false); // Error aaye toh loader band karo
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Resume for AI Analysis</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Target Role</label>
          <input 
            type="text" 
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. MERN Stack Developer, Frontend Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload PDF</label>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Processing with AI Engine...' : 'Analyze Resume'}
        </button>
      </form>
    </div>
  );
};

export default ResumeUpload;