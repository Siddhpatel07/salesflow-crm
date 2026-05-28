import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form'; 
import { ArrowLeft, Save, Building2, User, Plus, Trash2, Landmark } from 'lucide-react';

export default function AddLedger() {
  const navigate = useNavigate();
  const location = useLocation();
  const ledgerData = location.state?.ledgerData;
  const isEditing = Boolean(ledgerData);
  const [status, setStatus] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
    defaultValues: {
      partyName: ledgerData?.partyName || '',
      partyType: ledgerData?.type || '',
      address: ledgerData?.address || '',
      state: ledgerData?.state || '',
      pinCode: ledgerData?.pin || '', 
      city: ledgerData?.city || '',
      email: ledgerData?.email || '',
      whatsapp: ledgerData?.whatsapp || '',
      contactName: ledgerData?.contactName || '',
      designation: ledgerData?.designation || '',
      branchName: ledgerData?.branchName || '',
      branchAddress: ledgerData?.branchAddress || '',
      branchState: ledgerData?.branchState || '',
      branchPincode: ledgerData?.branchPincode || '',
      mobileNumbers: ledgerData?.mobileNumbers?.length ? ledgerData.mobileNumbers : [{ number: '' }],
      bankDetails: ledgerData?.bankDetails?.length ? ledgerData.bankDetails : [{ bankName: '', accountNumber: '', ifscCode: '' }]
    }
  });

  const { fields: mobileFields, append: appendMobile, remove: removeMobile } = useFieldArray({
    control,
    name: "mobileNumbers"
  });

  const { fields: bankFields, append: appendBank, remove: removeBank } = useFieldArray({
    control,
    name: "bankDetails"
  });

  useEffect(() => {
    if (ledgerData) {
      reset({ 
        ...ledgerData, 
        pinCode: ledgerData.pin,
        mobileNumbers: ledgerData.mobileNumbers?.length ? ledgerData.mobileNumbers : [{ number: '' }],
        bankDetails: ledgerData.bankDetails?.length ? ledgerData.bankDetails : [{ bankName: '', accountNumber: '', ifscCode: '' }]
      }); 
    }
  }, [ledgerData, reset]);

  const onSubmit = async (data) => {
    //  NEW: DUPLICATE NAME VALIDATION 
    const existingLedgers = JSON.parse(localStorage.getItem('salesflow_ledgers')) || [];
    
    const isDuplicate = existingLedgers.some((ledger) => {
      if (isEditing && ledger.id === ledgerData.id) {
        return false;
      }
      return ledger.partyName.toLowerCase().trim() === data.partyName.toLowerCase().trim();
    });

    if (isDuplicate) {
      alert(`⚠️ A ledger with the name "${data.partyName}" already exists!\n\nPlease choose a different name.`);
      return; 
    }
    //  END OF VALIDATION 

    setStatus(isEditing ? 'Updating in Tally...' : 'Syncing to Tally...');
    const apiUrl = isEditing ? 'http://localhost:5000/api/tally/edit' : 'http://localhost:5000/api/tally/sync';
    const apiMethod = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.partyName,
          company: data.partyName,
          email: data.email || '',
          partyType: data.partyType,
          address: data.address || '',
          state: data.state || '',
          pinCode: data.pinCode || '',
          branchName: data.branchName || '',
          branchAddress: data.branchAddress || '',
          branchState: data.branchState || '',
          branchPincode: data.branchPincode || '',
          whatsapp: data.whatsapp || '',
          mobileNumbers: data.mobileNumbers || [],
          bankDetails: data.bankDetails || []
        })
      });

      if (response.ok) {
        const newLedgerItem = {
          id: isEditing ? ledgerData.id : `LDG-${Date.now()}`,
          partyName: data.partyName,
          type: data.partyType,
          address: data.address || '-',
          state: data.state || '',
          pin: data.pinCode || '-',
          city: data.city || '',
          email: data.email || '-',
          whatsapp: data.whatsapp || '-',
          contactName: data.contactName || '',
          designation: data.designation || '',
          branchName: data.branchName || '',
          branchAddress: data.branchAddress || '',
          branchState: data.branchState || '',
          branchPincode: data.branchPincode || '',
          mobileNumbers: data.mobileNumbers, 
          bankDetails: data.bankDetails, 
          updated: new Date().toLocaleDateString('en-GB'),
          by: 'Admin User',
          sync: 'Success'
        };

        if (isEditing) {
          const updatedLedgers = existingLedgers.map((ledger) =>
            ledger.id === ledgerData.id ? newLedgerItem : ledger
          );
          localStorage.setItem('salesflow_ledgers', JSON.stringify(updatedLedgers));
          setStatus('✅ Ledger successfully updated in Tally!');
        } else {
          existingLedgers.push(newLedgerItem);
          localStorage.setItem('salesflow_ledgers', JSON.stringify(existingLedgers));
          setStatus('✅ Ledger successfully synced to Tally!');
        }
        setTimeout(() => navigate('/ledgers'), 1500);
      } else {
        setStatus(`❌ Tally Error`);
      }
    } catch (error) {
      setStatus('❌ Failed to connect to Node.js server.');
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="relative flex items-center justify-center py-2">
        <button onClick={() => navigate('/ledgers')} className="absolute left-0 flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Ledgers
        </button>
        <h1 className="text-3xl font-bold text-slate-800">{isEditing ? 'Edit Ledger' : 'Add New Ledger'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* --- BASIC DETAILS --- */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center mb-6 pb-4 border-b border-slate-100">
            <Building2 className="text-emerald-600 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-slate-800">Basic Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Party Name *</label>
              <input {...register("partyName", { required: "Required" })} disabled={isEditing} className={`w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500 ${isEditing ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ledger / Party Type *</label>
              <select {...register("partyType", { required: "Required" })} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500 bg-white">
                <option value="Sundry Debtors">Sundry Debtors (Customer)</option>
                <option value="Sundry Creditors">Sundry Creditors (Supplier)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Registered Address</label>
              <textarea {...register("address")} rows="2" className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
              <select {...register("state")} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500 bg-white">
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pin Code</label>
              <input {...register("pinCode")} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500" />
            </div>
          </div>
        </div>

        {/* --- CONTACT INFO & DYNAMIC MOBILE NUMBERS --- */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center mb-6 pb-4 border-b border-slate-100">
            <User className="text-emerald-600 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-slate-800"> Primary Contact Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
              <input {...register("contactName")} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
              <input {...register("designation")} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" {...register("email")} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
              <input {...register("whatsapp")} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500" />
            </div>

            <div className="col-span-1 md:col-span-2 mt-2 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-slate-700">Mobile Numbers</label>
                <button 
                  type="button" 
                  onClick={() => appendMobile({ number: '' })} 
                  className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center font-bold cursor-pointer"
                >
                  <Plus size={14} className="mr-1" /> Add Another Mobile
                </button>
              </div>
              
              <div className="space-y-3">
                {mobileFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input 
                      {...register(`mobileNumbers.${index}.number`)} 
                      className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500 bg-white" 
                      placeholder={index === 0 ? "Primary Mobile Number" : `Secondary Mobile ${index}`} 
                    />
                    {index > 0 && (
                      <button 
                        type="button" 
                        onClick={() => removeMobile(index)} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Remove Number"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/*  BANK DETAILS SECTION (DYNAMIC ARRAY)  */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center">
              <Landmark className="text-emerald-600 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-slate-800">Bank Account Details</h2>
            </div>
            <button 
              type="button" 
              onClick={() => appendBank({ bankName: '', accountNumber: '', ifscCode: '' })} 
              className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center font-bold cursor-pointer"
            >
              <Plus size={14} className="mr-1" /> Add Another Bank
            </button>
          </div>
          
          <div className="space-y-6">
            {bankFields.map((field, index) => (
              <div key={field.id} className="relative bg-slate-50 p-4 rounded-lg border border-slate-100">
                {index > 0 && (
                  <button 
                    type="button" 
                    onClick={() => removeBank(index)} 
                    className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                    title="Remove Bank"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  {index === 0 ? "Primary Bank Account" : `Secondary Bank Account ${index}`}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                    <input {...register(`bankDetails.${index}.bankName`)} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500 bg-white" placeholder="e.g. HDFC Bank" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                    <input {...register(`bankDetails.${index}.accountNumber`)} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500 bg-white" placeholder="e.g. 50100123456" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
                    <input {...register(`bankDetails.${index}.ifscCode`)} className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500 bg-white" placeholder="e.g. HDFC0001234" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECONDARY ADDRESS --- */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Secondary Address (Optional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch Name</label>
              <input {...register("branchName")} className="w-full border border-slate-300 p-2 rounded outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch Address</label>
              <input {...register("branchAddress")} className="w-full border border-slate-300 p-2 rounded outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch State</label>
              <input {...register("branchState")} className="w-full border border-slate-300 p-2 rounded outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Branch Pincode</label>
              <input {...register("branchPincode")} className="w-full border border-slate-300 p-2 rounded outline-none focus:border-emerald-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-emerald-600">{status}</div>
          <button type="submit" className="flex items-center bg-emerald-600 text-white px-6 py-2.5 rounded-md hover:bg-emerald-700 font-medium cursor-pointer">
            <Save size={18} className="mr-2" />
            {isEditing ? 'Update Ledger' : 'Save Ledger'}
          </button>
        </div>

      </form>
    </div>
  );
}