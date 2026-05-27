import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockLeads } from '../mockData/leadsData';
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Leads() {

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const leadsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredLeads = mockLeads.filter((lead) => {

    const lowerSearch = searchTerm.toLowerCase();

    const matchesName = lead.name.toLowerCase().includes(lowerSearch);

    const matchesCompany = lead.company.toLowerCase().includes(lowerSearch);

    const matchesSearch = matchesName || matchesCompany;

    const matchesStatus =
      statusFilter === '' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const startIndex = (currentPage - 1) * leadsPerPage;

  const currentLeads = filteredLeads.slice(
    startIndex,
    startIndex + leadsPerPage
  );

  return (

    <div className="bg-white rounded-lg shadow-sm border border-slate-200">

      <div className="p-6 border-b border-slate-200 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-slate-800">
          Leads
        </h1>

        <div className="flex items-center space-x-3">

          <div className="flex items-center border border-slate-300 rounded-md px-3 py-2 bg-slate-50">

            <Search size={18} className="text-slate-400 mr-2" />

            <input
              type="text"
              placeholder="Search leads..."
              className="bg-transparent outline-none text-sm w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>

          <div className="flex items-center border border-slate-300 rounded-md px-3 py-2 bg-slate-50">

            <Filter size={18} className="text-slate-400 mr-2" />

            <select
              className="bg-transparent outline-none text-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>

          </div>

          <button
            onClick={() => navigate('/leads/new')}
            className="flex items-center bg-emerald-600 text-white px-3 py-2 rounded-md text-sm hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <Plus size={16} className="mr-1" />
            New Lead
          </button>

        </div>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-left border-collapse">

          <thead>

            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Company</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Est. Value</th>
            </tr>

          </thead>

          <tbody>

            {currentLeads.map((lead) => (

              <tr
                key={lead.id}
                onClick={() => navigate(`/leads/${lead.id}`)}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
              >

                <td className="p-4">
                  <div className="font-medium text-slate-800">
                    {lead.name}
                  </div>

                  <div className="text-xs text-slate-500">
                    {lead.email}
                  </div>
                </td>

                <td className="p-4 text-slate-700">
                  {lead.company}
                </td>

                <td className="p-4">

                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    lead.status === 'New'
                      ? 'bg-blue-100 text-blue-700'
                      : lead.status === 'Contacted'
                      ? 'bg-yellow-100 text-yellow-700'
                      : lead.status === 'Qualified'
                      ? 'bg-purple-100 text-purple-700'
                      : lead.status === 'Converted'
                      ? 'bg-emerald-100 text-emerald-700'
                      : lead.status === 'Lost'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>

                    {lead.status}

                  </span>

                </td>

                <td className="p-4 text-slate-700">
                  ₹{lead.estimatedValue.toLocaleString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 rounded-b-lg">

        <span className="text-sm text-slate-500">
          Showing
          <span className="font-medium text-slate-700">
            {filteredLeads.length === 0 ? 0 : startIndex + 1}
          </span>

          to

          <span className="font-medium text-slate-700">
            {Math.min(startIndex + leadsPerPage, filteredLeads.length)}
          </span>

          of

          <span className="font-medium text-slate-700">
            {filteredLeads.length}
          </span>

          leads
        </span>

        <div className="flex items-center space-x-4">

          <span className="text-sm font-medium text-slate-700">
            Page {currentPage} of {totalPages || 1}
          </span>

          <div className="flex space-x-2">

            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}