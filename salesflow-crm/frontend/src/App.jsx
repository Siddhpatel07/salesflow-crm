import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail'; 
import LeadForm from './pages/LeadForm';
import AddLedger from './pages/AddLedger';
import Ledgers from './pages/Ledgers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Leads />} />
          
          <Route path="leads/:id" element={<LeadDetail />} /> 
          <Route path="leads/new" element={<LeadForm />} /> 
          <Route path="leads/:id/edit" element={<LeadForm />} /> 
          <Route path="/ledgers/new" element={<AddLedger />} />
          <Route path="/ledgers" element={<Ledgers />} />
          <Route path="contacts" element={<div>Contacts Page Coming Soon...</div>} />
          <Route path="accounts" element={<div>Accounts Page Coming Soon...</div>} />
          <Route path="deals" element={<div>Deals Page Coming Soon...</div>} />
          <Route path="activities" element={<div>Activities Page Coming Soon...</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;