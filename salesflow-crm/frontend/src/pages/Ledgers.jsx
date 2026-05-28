import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Info, Eye, Edit2, X } from 'lucide-react';

export default function Ledgers() {
  const navigate = useNavigate();
  const [ledgers, setLedgers] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('salesflow_ledgers')) || [];
    setLedgers(savedData);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">

      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Ledgers</h1>

        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-slate-300 rounded-md px-3 py-2 bg-slate-50">
            <Search size={18} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Search ledgers..." className="bg-transparent outline-none text-sm w-48" />
          </div>

          <button
            onClick={() => navigate('/ledgers/new')}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors cursor-pointer font-medium"
          >
            <Plus size={16} className="mr-1" />
            New Ledger
          </button>

        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <th className="p-4 font-medium">Party Name</th>
              <th className="p-4 font-medium">Party Type</th>
              <th className="p-4 font-medium">Address</th>
              <th className="p-4 font-medium">Pincode</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">WhatsApp</th>
              <th className="p-4 font-medium">Updated At</th>
              <th className="p-4 font-medium">Tally Sync</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ledgers.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-8 text-center text-slate-500">
                  No ledgers found. Click 'New Ledger' to create one.
                </td>
              </tr>
            ) : (
              ledgers.map((ledger) => (
                <tr key={ledger.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">{ledger.partyName}</td>
                  <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">{ledger.type}</span></td>
                  <td className="p-4 text-slate-600 truncate max-w-xs">{ledger.address}</td>
                  <td className="p-4 text-slate-600">{ledger.pin}</td>
                  <td className="p-4 text-slate-600">{ledger.email}</td>
                  <td className="p-4 text-slate-600">{ledger.whatsapp}</td>
                  <td className="p-4 text-slate-600">{ledger.updated}</td>
                  <td className={`p-4 font-medium ${ledger.sync === 'Success' ? 'text-emerald-600' : 'text-yellow-600'}`}>
                    {ledger.sync}
                  </td>
                  <td className="p-4 flex items-center space-x-2 text-slate-400">
                    <button
                      onClick={() => navigate('/ledgers/new', { state: { ledgerData: ledger } })}
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Edit Ledger"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedLedger(ledger)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <Info size={16} className="hover:text-slate-700 cursor-pointer" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- VIEW DETAILS MODAL --- */}
      {selectedLedger && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-800">Ledger Details</h2>
              <button
                onClick={() => setSelectedLedger(null)}
                className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Primary Information</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Party Name</p>
                    <p className="font-medium text-slate-800">{selectedLedger.partyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Party Type</p>
                    <span className="bg-white text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                      {selectedLedger.type}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 mb-1">Registered Address</p>
                    <p className="text-sm text-slate-700">{selectedLedger.address}, {selectedLedger.city} {selectedLedger.state} - {selectedLedger.pin}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Contact Details</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Contact Person</p>
                    <p className="font-medium text-slate-800">{selectedLedger.contactName || '-'}</p>
                    <p className="text-xs text-slate-500">{selectedLedger.designation || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="text-sm text-slate-700">{selectedLedger.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Phone Numbers</p>
                    {selectedLedger.mobileNumbers && selectedLedger.mobileNumbers.length > 0 ? (
                      selectedLedger.mobileNumbers.map((m, idx) => (
                        <p key={idx} className="text-sm font-medium text-slate-700">
                          {m.number} {idx === 0 && <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded ml-1">Primary</span>}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-slate-700">{selectedLedger.phone || '-'}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">WhatsApp</p>
                    <p className="text-sm text-slate-700">{selectedLedger.whatsapp || '-'}</p>
                  </div>
                </div>
              </div>

              {selectedLedger.branchName && (
                <div>
                  <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Secondary Branch</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Branch Name</p>
                      <p className="font-medium text-slate-800">{selectedLedger.branchName}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500 mb-1">Branch Address</p>
                      <p className="text-sm text-slate-700">{selectedLedger.branchAddress}, {selectedLedger.branchState} - {selectedLedger.branchPincode}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 🌟 NEW: BANK DETAILS SECTION IN VIEW MODAL 🌟 */}
              <div>
                <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Bank Details</h3>
                
                {selectedLedger.bankDetails && selectedLedger.bankDetails.length > 0 ? (
                  <div className="space-y-4">
                    {selectedLedger.bankDetails.map((bank, index) => (
                      <div key={index} className="relative grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 bg-slate-50 p-4 rounded-lg border border-slate-100 mt-2">
                        <span className="absolute -top-2.5 left-4 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                          {index === 0 ? "Primary Bank" : `Secondary Bank ${index}`}
                        </span>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Bank Name</p>
                          <p className="text-sm font-medium text-slate-800">{bank.bankName || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Account Number</p>
                          <p className="text-sm font-medium text-slate-800">{bank.accountNumber || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">IFSC Code</p>
                          <p className="text-sm font-medium text-slate-800">{bank.ifscCode || '-'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-500 italic">
                    No bank details provided.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}