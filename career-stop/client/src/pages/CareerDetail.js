import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { careerAPI } from '../utils/api';
import { FaBook, FaGraduationCap, FaUniversity, FaNewspaper, FaGlobe, FaCheckCircle } from 'react-icons/fa';

const InfoCard = ({ title, children }) => (
  <div className="rounded-lg shadow p-5 flex-1 min-w-[220px]" style={{ backgroundColor: '#23272f' }}>
    <div className="text-xs text-gray-400 font-semibold mb-1">{title}</div>
    <div className="text-base text-white font-bold">{children}</div>
  </div>
);

const ListWithIcon = ({ items = [], icon: Icon, showDetails }) => (
  <ul className="space-y-2">
    {items.map((item, idx) => (
      <li key={idx} className="flex flex-col md:flex-row md:items-center text-gray-200">
        <div className="flex items-center">
          <Icon className="text-blue-400 mr-2 text-sm" />
          {item.link ? (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-300 font-medium">{item.title || item.name}</a>
          ) : (
            <span className="font-medium">{item.title || item.name || item}</span>
          )}
        </div>
        {showDetails && (
          <div className="ml-7 mt-1 text-sm">
            {item.author && <div className="text-gray-400">by {item.author}</div>}
            {item.description && <div className="text-gray-400">{item.description}</div>}
            {item.provider && <div className="text-gray-400">Provider: {item.provider}</div>}
            {item.duration && <div className="text-gray-400">Duration: {item.duration}</div>}
            {item.isOnline !== undefined && <div className="text-gray-400">{item.isOnline ? 'Online' : 'Offline'}</div>}
            {item.location && <div className="text-gray-400">Location: {item.location}</div>}
            {item.programs && item.programs.length > 0 && (
              <div className="text-gray-400">Programs: {item.programs.join(', ')}</div>
            )}
          </div>
        )}
      </li>
    ))}
  </ul>
);

const CareerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        console.log('Fetching career with ID:', id);
        const response = await careerAPI.getCareer(id);
        console.log('Career API Response:', response);
        
        if (response.data.success) {
          console.log('Career data:', response.data.data);
          setCareer(response.data.data);
        } else {
          console.error('Failed to load career details:', response.data);
          setError('Failed to load career details');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching career:', err);
        setError('Failed to load career details');
        setLoading(false);
      }
    };
    fetchCareer();
  }, [id]);

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-50">Loading...</div>;
  if (error) return <div className="min-h-screen flex justify-center items-center text-red-500">{error}</div>;
  if (!career) return <div className="min-h-screen flex justify-center items-center">Career not found</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#18181b' }}>
      <div className="max-w-6xl mx-auto py-8 px-2 md:px-0">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-blue-200 mb-2">← Back</button>
          <h1 className="text-4xl font-bold text-white mb-2">{career.title}</h1>
          <p className="text-gray-200 text-lg">{career.description}</p>
        </div>

        {/* Info Cards Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <InfoCard title="Education Requirements">
            {career.educationRequirements}
          </InfoCard>
          <InfoCard title="Average Salary">
            {career.averageSalary}
          </InfoCard>
          <InfoCard title="Job Outlook">
            {career.jobOutlook}
          </InfoCard>
        </div>

        {/* Skills Section */}
        {career.skills && career.skills.length > 0 && (
          <div className="rounded-lg shadow p-6 mb-6" style={{ backgroundColor: '#23272f' }}>
            <h2 className="text-2xl font-semibold text-white mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {career.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Career Traits */}
        {career.careerTraits && Object.keys(career.careerTraits).length > 0 && (
          <div className="rounded-lg shadow p-6 mb-6" style={{ backgroundColor: '#23272f' }}>
            <h2 className="text-2xl font-semibold text-white mb-4">Career Traits</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(career.careerTraits).map(([trait, value]) => (
                <div key={trait} className="flex flex-col">
                  <span className="text-gray-300 capitalize">{trait}</span>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${(value / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            {/* Books Section */}
            {career.books && career.books.length > 0 && (
              <div className="rounded-lg shadow p-6 mb-6" style={{ backgroundColor: '#23272f' }}>
                <h2 className="text-2xl font-semibold text-white mb-4">Recommended Books</h2>
                <ListWithIcon items={career.books} icon={FaBook} showDetails={true} />
              </div>
            )}

            {/* Courses Section */}
            {career.courses && career.courses.length > 0 && (
              <div className="rounded-lg shadow p-6 mb-6" style={{ backgroundColor: '#23272f' }}>
                <h2 className="text-2xl font-semibold text-white mb-4">Recommended Courses</h2>
                <ListWithIcon items={career.courses} icon={FaGraduationCap} showDetails={true} />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* Colleges Section */}
            {career.colleges && career.colleges.length > 0 && (
              <div className="rounded-lg shadow p-6 mb-6" style={{ backgroundColor: '#23272f' }}>
                <h2 className="text-2xl font-semibold text-white mb-4">Top Colleges</h2>
                <ListWithIcon items={career.colleges} icon={FaUniversity} showDetails={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDetail; 