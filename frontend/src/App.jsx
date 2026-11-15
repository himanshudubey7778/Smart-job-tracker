import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ company: '', position: '', status: 'Applied', location: 'Remote' });
  
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', form);
      setForm({ company: '', position: '', status: 'Applied', location: 'Remote' });
      fetchJobs();
    } catch (err) {
      console.error('Error adding job:', err);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const handleAIAnalyze = async () => {
    if (!resumeText || !jobDescription) return alert('Please enter both resume and job description!');
    setLoading(true);
    setAiResult('');
    try {
      const res = await axios.post('http://localhost:5000/api/ai/analyze', { resumeText, jobDescription });
      setAiResult(res.data.result);
    } catch (err) {
      console.error('AI Analysis failed:', err);
      const errorMessage =
        err.response?.data?.details ||
        err.response?.data?.error ||
        err.message ||
        'Unknown error';
      setAiResult(`Error generating AI analysis: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // PDF Download Feature using jsPDF
  const downloadPDF = () => {
    if (!aiResult) return alert('Generate AI analysis first to export summary!');
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CareerPulse Pro - AI ATS Report", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(aiResult, 180);
    doc.text(splitText, 14, 30);
    doc.save("CareerPulse_AI_ATS_Report.pdf");
  };

  const totalJobs = jobs.length;
  const interviewingCount = jobs.filter(j => j.status === 'Interviewing').length;
  const offeredCount = jobs.filter(j => j.status === 'Offered').length;

  return (
    <div className="app-container">
      <div className="max-w">
        
        {/* Navbar */}
        <div className="navbar">
          <div>
            <div className="logo-title">CareerPulse<span className="logo-sub">Pro</span></div>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>AI-Powered Job Application & ATS Suite</p>
          </div>
          <span className="badge badge-offered">● System Live & Secured</span>
        </div>

        {/* Stats Row */}
        <div className="stats-grid">
          <div className="stat-card">
            <div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Total Applications</p>
              <h3>{totalJobs}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Active Interviews</p>
              <h3>{interviewingCount}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Offers Received</p>
              <h3>{offeredCount}</h3>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="main-grid">
          
          {/* Left: Job Manager */}
          <div className="card-box">
            <h2>💼 Track Job Applications</h2>
            <form onSubmit={handleAddJob} className="form-group">
              <input 
                type="text" placeholder="Company Name" value={form.company} 
                onChange={(e) => setForm({...form, company: e.target.value})} required className="input-field"
              />
              <input 
                type="text" placeholder="Position (e.g. MERN Developer)" value={form.position} 
                onChange={(e) => setForm({...form, position: e.target.value})} required className="input-field"
              />
              <select 
                value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="select-field"
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input 
                type="text" placeholder="Location (e.g. Remote / Noida)" value={form.location} 
                onChange={(e) => setForm({...form, location: e.target.value})} className="input-field"
              />
              <button type="submit" className="btn-primary">Save Application</button>
            </form>

            <div style={{ marginTop: '24px', maxHeight: '280px', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '15px', color: '#cbd5e1', marginBottom: '12px' }}>Saved Applications</h3>
              {jobs.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center' }}>No applications yet.</p>
              ) : (
                jobs.map((job) => (
                  <div key={job._id} className="job-item">
                    <div>
                      <h4>{job.company}</h4>
                      <p>{job.position} • {job.location}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className={`badge badge-${job.status.toLowerCase()}`}>{job.status}</span>
                      <button onClick={() => handleDeleteJob(job._id)} className="delete-btn">✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: AI Matcher & PDF Export */}
          <div className="card-box">
            <h2>✨ AI ATS Matcher & Report</h2>
            <div className="form-group">
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Your Resume Summary</label>
                <textarea 
                  placeholder="Paste resume content here..." value={resumeText} 
                  onChange={(e) => setResumeText(e.target.value)} rows={3} className="textarea-field"
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Target Job Description (JD)</label>
                <textarea 
                  placeholder="Paste job description requirements here..." value={jobDescription} 
                  onChange={(e) => setJobDescription(e.target.value)} rows={3} className="textarea-field"
                />
              </div>
              <button onClick={handleAIAnalyze} disabled={loading} className="btn-ai">
                {loading ? 'Gemini AI Analyzing...' : 'Evaluate ATS Match Score'}
              </button>

              {aiResult && (
                <div>
                  <div className="ai-result-box">
                    <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '6px' }}>AI Match Breakdown:</strong>
                    {aiResult}
                  </div>
                  <button onClick={downloadPDF} style={{ marginTop: '12px', width: '100%', background: '#047857' }} className="btn-primary">
                    📥 Download AI Report as PDF
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;