import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../services/helper";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ToastContainer, toast } from "react-toastify";

const COLORS = ['#0088FE', '#FFBB28', '#00C49F', '#FF8042', '#AF19FF', '#FF1919'];
const SEVERITY_COLORS = ['#FF1919', '#00C49F']; // Red for severe, Green for mild/moderate

const CounselorAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  const [filterYear, setFilterYear] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');

  useEffect(() => {
    fetchUserAndData();
  }, []);

  const fetchUserAndData = async () => {
    try {
      const authRes = await axios.get(`${BASE_URL}/login/success`, { withCredentials: true });
      if (!authRes.data.user || authRes.data.user.role !== 'counselor') {
        toast.error("Unauthorized access");
        return;
      }
      const counselor = authRes.data.user;
      setUser(counselor);

      const response = await axios.get(`${BASE_URL}/counselor/analytics`, {
        params: { counselorName: counselor.person_name },
        withCredentials: true
      });
      setData(response.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
      toast.error("Error loading analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Process data based on filters
  const filteredData = data.filter(appt => {
    if (!appt.appointmentDate) return false;
    const date = new Date(appt.appointmentDate);
    const apptYear = date.getFullYear().toString();
    const apptMonth = (date.getMonth() + 1).toString(); // 1-12

    if (filterYear !== 'All' && apptYear !== filterYear) return false;
    if (filterMonth !== 'All' && apptMonth !== filterMonth) return false;
    return true;
  });

  // Calculate generic stats
  // 1. Gender 
  const genderMap = {};
  // 2. Problem Related
  const problemMap = {
    'Academics': 0,
    'Relationship': 0,
    'Family': 0,
    'Finance': 0,
    'Health': 0,
    'Lifestyle related': 0,
    'Others': 0
  };
  // 3. Severity Flags
  let severeCount = 0;
  let mildModerateCount = 0;
  // 4. Age
  const ageMap = {
    '17-19': 0,
    '20-22': 0,
    '23-25': 0,
    '26-30': 0,
    '30+': 0,
    'Unknown': 0
  };
  // 5. Mode of Referral
  const referralMap = {};

  filteredData.forEach(appt => {
    const g = appt.gender || 'Not Specified';
    genderMap[g] = (genderMap[g] || 0) + 1;

    let p = appt.problemRelatedWith || 'Others';
    // Ensure case matching
    let foundKey = Object.keys(problemMap).find(k => k.toLowerCase() === p.toLowerCase());
    if (foundKey) {
      problemMap[foundKey] += 1;
    } else {
      problemMap['Others'] += 1;
    }

    const ext = (appt.problemExtent || '').toLowerCase();
    if (ext.includes('severe')) {
      severeCount++;
    } else if (ext.includes('mild') || ext.includes('moderate')) {
      mildModerateCount++;
    }

    const age = parseInt(appt.age, 10);
    if (!isNaN(age)) {
      if (age >= 17 && age <= 19) ageMap['17-19']++;
      else if (age >= 20 && age <= 22) ageMap['20-22']++;
      else if (age >= 23 && age <= 25) ageMap['23-25']++;
      else if (age >= 26 && age <= 30) ageMap['26-30']++;
      else if (age > 30) ageMap['30+']++;
      else ageMap['Unknown']++;
    } else {
      ageMap['Unknown']++;
    }

    const ref = appt.modeOfReferral || 'Not Specified';
    referralMap[ref] = (referralMap[ref] || 0) + 1;
  });

  const genderData = Object.keys(genderMap).map(k => ({ name: k, value: genderMap[k] }));
  const problemData = Object.keys(problemMap).map(k => ({ name: k, count: problemMap[k] }));
  const severityData = [
    { name: 'Red Flags (Severe)', value: severeCount },
    { name: 'Green Flags (Mild/Moderate)', value: mildModerateCount }
  ];
  // Filter out Unknown if 0
  const ageData = Object.keys(ageMap)
    .filter(k => k !== 'Unknown' || ageMap[k] > 0)
    .map(k => ({ name: k, value: ageMap[k] }));
  const referralData = Object.keys(referralMap).map(k => ({ name: k, value: referralMap[k] }));

  // Available Years for filter dropdown
  const availableYears = [...new Set(data.map(a => new Date(a.appointmentDate).getFullYear()))].sort().reverse();

  if (loading) return <div className="text-center p-5">Loading Analytics...</div>;

  return (
    <div className="container mt-4 mb-5 analytics-container">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .analytics-container, .analytics-container * {
              visibility: visible;
            }
            .analytics-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print, .recharts-tooltip-wrapper {
              display: none !important;
            }
            .card {
              border: none !important;
              box-shadow: none !important;
              break-inside: avoid;
              page-break-inside: avoid;
              margin-bottom: 2rem !important;
            }
            .row {
              display: flex;
              flex-wrap: wrap;
            }
            .col-md-6, .col-md-12 {
              width: 100% !important;
              max-width: 100% !important;
              flex: 0 0 100% !important;
            }
            /* Scale down charts slightly for printing so they don't break onto multiple pages unexpectedly */
            .recharts-responsive-container {
              max-height: 250px !important;
            }
          }
        `}
      </style>
      
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="text-primary">Analytics Dashboard</h2>
      </div>

      <div className="row mb-4 no-print bg-light p-3 rounded">
        <div className="col-md-4">
          <label className="fw-bold form-label">Filter by Year:</label>
          <select className="form-select" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="All">All Years</option>
            {availableYears.filter(y => !isNaN(y)).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="fw-bold form-label">Filter by Month:</label>
          <select className="form-select" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="All">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="alert alert-info text-center">No data found for the selected filters.</div>
      ) : (
        <div className="row">
          {/* 1. Severity Flags (Pie) */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="text-center text-secondary mb-3">Red Flags vs Green Flags</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={severityData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({name, value}) => `${name}: ${value}`}>
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[index % SEVERITY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 2. Gender Dist (Pie) */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="text-center text-secondary mb-3">Cases by Gender</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 3. Mode of Referral (Pie) */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="text-center text-secondary mb-3">Cases by Mode of Referral</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={referralData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {referralData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 4. Age Dist (Bar) */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="text-center text-secondary mb-3">Cases by Age Range</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={ageData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" barSize={40}>
                      {ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 5. Problem Related Dist (Bar) */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="text-center text-secondary mb-3">Cases by Problem Related</h5>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={problemData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#32CD32" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Print Button at Bottom Center */}
          <div className="col-12 mb-4 text-center no-print">
            <button className="btn btn-primary btn-lg px-5" onClick={handlePrint}>
              Print Report
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CounselorAnalytics;
