import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockLeads } from '../mockData/leadsData';
import { ArrowLeft, Mail, Phone, Building2, Calendar, DollarSign, Clock, Globe, Edit, Trash2, ChevronDown } from 'lucide-react';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = mockLeads.find((l) => l.id === id);

  const [currentStatus, setCurrentStatus] = useState(lead ? lead.status : '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const statuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);

    const leadIndex = mockLeads.findIndex((l) => l.id === id);
    if (leadIndex !== -1) {
      mockLeads[leadIndex].status = newStatus;
      localStorage.setItem('salesflow_leads', JSON.stringify(mockLeads));
    }

    setIsDropdownOpen(false);
  };

  if (!lead) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">Lead not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-emerald-600 hover:underline">
          Go back to Leads
        </button>
      </div>
    );
  }
  const getStatusColor = (status) => {
    if (status === 'New') return 'bg-blue-100 text-blue-700';
    if (status === 'Contacted') return 'bg-yellow-100 text-yellow-700';
    if (status === 'Qualified') return 'bg-purple-100 text-purple-700';
    if (status === 'Converted') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Lost') return 'bg-red-100 text-red-700';
    return 'bg-slate-100 text-slate-700';
  };

  const handleDelete = () => {

    const isConfirmed = window.confirm("Are you sure you want to delete this lead?");

    if (isConfirmed) {

      const leadIndex = mockLeads.findIndex((l) => l.id === id);

      if (leadIndex !== -1) {

        mockLeads.splice(leadIndex, 1);

        localStorage.setItem('salesflow_leads', JSON.stringify(mockLeads));

        navigate('/');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">


      <button
        onClick={() => navigate('/')}
        className="flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Leads
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{lead.name}</h1>
          <div className="flex items-center text-slate-600 mt-2">
            <Building2 size={16} className="mr-2 text-slate-400" />
            {lead.company}
          </div>
        </div>

        <div className="flex space-x-3 items-center">

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium outline-none cursor-pointer border border-transparent hover:border-current transition-colors ${getStatusColor(currentStatus)}`}
            >
              {currentStatus}
              <ChevronDown size={14} className="ml-1 opacity-70" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 w-36 bg-white border border-slate-200 rounded-md shadow-lg z-10 py-1">
                {statuses.map((statusOption) => (
                  <div
                    key={statusOption}
                    onClick={() => handleStatusChange(statusOption)}
                    className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                  >
                    {statusOption}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(`/leads/${lead.id}/edit`)}
            className="flex items-center bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-md text-sm hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-md text-sm hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </button>
          
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Lead Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <Mail className="text-slate-400 mt-1 mr-3" size={18} />
            <div>
              <div className="text-sm text-slate-500 font-medium">Email</div>
              <div className="text-slate-800">{lead.email}</div>
            </div>
          </div>

          <div className="flex items-start">
            <Phone className="text-slate-400 mt-1 mr-3" size={18} />
            <div>
              <div className="text-sm text-slate-500 font-medium">Phone</div>
              <div className="text-slate-800">{lead.phone || 'Not provided'}</div>
            </div>
          </div>

          <div className="flex items-start">
            <DollarSign className="text-slate-400 mt-1 mr-3" size={18} />
            <div>
              <div className="text-sm text-slate-500 font-medium">Estimated Value</div>
              <div className="text-slate-800">₹{lead.estimatedValue.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar className="text-slate-400 mt-1 mr-3" size={18} />
            <div>
              <div className="text-sm text-slate-500 font-medium">System ID</div>
              <div className="text-slate-800">{lead.id}</div>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="text-slate-400 mt-1 mr-3" size={18} />
            <div>
              <div className="text-sm text-slate-500 font-medium">Added On</div>
              <div className="text-slate-800">
                {lead.createdAt
                  ? new Date(lead.createdAt).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                  : 'Date not recorded'}
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <Globe className="text-slate-400 mt-1 mr-3" size={18} />
            <div>
              <div className="text-sm text-slate-500 font-medium">Lead Source</div>
              <div className="text-slate-800">{lead.source || 'Unknown'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}