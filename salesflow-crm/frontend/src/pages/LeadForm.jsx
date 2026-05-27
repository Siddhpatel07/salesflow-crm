import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { mockLeads } from '../mockData/leadsData';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';

export default function LeadForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // The "Smart" Check: Are we editing?
  const isEditMode = Boolean(id);
  const existingLead = isEditMode ? mockLeads.find((l) => l.id === id) : null;

  // If we are editing, prepare the pre-filled data
  let prefillData = {};
  if (existingLead) {
    const splitName = existingLead.name.split(' ');
    
    // THE FIX: Un-glue the phone, but grab ALL the digits and strip out extra spaces
    const splitPhone = existingLead.phone ? existingLead.phone.split(' ') : ['+91', ''];
    const countryCode = splitPhone[0]; // Grabs the '+91'
    const actualNumber = splitPhone.slice(1).join('').replace(/\s/g, ''); // Glues the rest together into '9876543210'
    
    prefillData = {
      firstName: splitName[0] || '',
      lastName: splitName.slice(1).join(' ') || '',
      company: existingLead.company,
      email: existingLead.email,
      countryCode: countryCode,
      phone: actualNumber, // Use the fixed number here!
      estimatedValue: existingLead.estimatedValue,
      source: existingLead.source || ''
    };
  }

  // Pass the prefillData into React Hook Form!
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: prefillData
  });
  
  const [showPopup, setShowPopup] = useState(false);

  const onSubmit = (data) => {
    if (isEditMode) {
      const leadIndex = mockLeads.findIndex((l) => l.id === id);
      
      if (leadIndex !== -1) {
        // Overwrite his data, but keep his original ID and createdAt time!
        mockLeads[leadIndex] = {
          ...mockLeads[leadIndex], 
          name: `${data.firstName} ${data.lastName}`,
          company: data.company,
          email: data.email,
          phone: `${data.countryCode} ${data.phone}`,
          estimatedValue: Number(data.estimatedValue),
          source: data.source
        };
      }
    } else {
      
      const newLead = {
        id: `L-${Math.floor(Math.random() * 10000)}`,
        createdAt: new Date().toISOString(),
        status: 'New',
        name: `${data.firstName} ${data.lastName}`,
        company: data.company,
        email: data.email,
        phone: `${data.countryCode} ${data.phone}`,
        estimatedValue: Number(data.estimatedValue),
        source: data.source
      };
      mockLeads.push(newLead);
    }

    localStorage.setItem('salesflow_leads', JSON.stringify(mockLeads));
   
    setShowPopup(true);
    
    
    setTimeout(() => {
      if (isEditMode) {
        navigate(`/leads/${id}`); 
      } else {
        navigate('/'); 
      }
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      
      {showPopup && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-3 rounded-lg shadow-lg flex items-center z-50">
          <CheckCircle size={20} className="mr-2 text-emerald-600" />
          <span className="font-medium">
            {isEditMode ? 'Lead successfully updated!' : 'Lead successfully saved!'}
          </span>
        </div>
      )}

      <div className="relative flex items-center justify-center py-2">
        <button 
          onClick={() => navigate(isEditMode ? `/leads/${id}` : '/')} 
          className="absolute left-0 flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} className="mr-1" />
          {isEditMode ? 'Back to Details' : 'Back to Leads'}
        </button>
        <h1 className="text-3xl font-bold text-slate-800">
          {isEditMode ? 'Edit Lead' : 'Create New Lead'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <p className="text-xs text-slate-400 mb-6 font-medium italic">
          * Fields marked with an asterisk are required
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
              <input 
                {...register("firstName", { required: "First name is required" })}
                placeholder="Aarav"
                className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500"
              />
              {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Surname *</label>
              <input 
                {...register("lastName", { required: "Surname is required" })}
                placeholder="Mehta"
                className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500"
              />
              {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
              <input 
                {...register("company", { required: "Company is required" })}
                placeholder="Reliance Industries"
                className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500"
              />
              {errors.company && <span className="text-xs text-red-500">{errors.company.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <input 
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                })}
                placeholder="aarav@example.com"
                className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500"
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
            <div className="flex space-x-2">
              <select 
                {...register("countryCode")}
                className="w-24 p-2 border border-slate-300 rounded-md outline-none bg-slate-50 cursor-pointer text-slate-700 font-medium"
              >
                <option value="+91">IN (+91)</option>
                <option value="+1">US (+1)</option>
                <option value="+44">UK (+44)</option>
              </select>
              <div className="flex-1">
                <input 
                  {...register("phone", { 
                    required: "Phone is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Must be exactly 10 digits" }
                  })}
                  placeholder="9876543210"
                  maxLength="10"
                  className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            {errors.phone && <span className="text-xs text-red-500 block mt-1">{errors.phone.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Value (₹) *</label>
              <input 
                type="number"
                {...register("estimatedValue", { 
                  required: "Value is required",
                  min: { value: 0, message: "Value cannot be negative" }
                })}
                placeholder="150000"
                className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500"
              />
              {errors.estimatedValue && <span className="text-xs text-red-500">{errors.estimatedValue.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lead Source *</label>
              <select 
                {...register("source", { required: "Please select a source" })}
                className="w-full p-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500 bg-white cursor-pointer text-slate-700"
              >
                <option value="">Select a source...</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
              </select>
              {errors.source && <span className="text-xs text-red-500">{errors.source.message}</span>}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Save size={18} className="mr-2" />
              {isEditMode ? 'Update Lead' : 'Save Lead'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}