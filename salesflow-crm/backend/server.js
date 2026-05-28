const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const buildTallyPayload = (action, reqBody) => {
  const { 
    name, email, address, state, pincode, 
    branchName, branchAddress, branchState, branchPincode, 
    mobileNumbers, partyType, whatsapp,
    //  NEW BANK FIELDS FROM CRM FRONTEND 
    bankName, ifscCode, accountNumber 
  } = reqBody;

  const primaryMobile = mobileNumbers && mobileNumbers.length > 0 ? mobileNumbers[0].number : "";
  
  // Exact Senior Format Mapping for Contact Details
  const contactDetailsArray = mobileNumbers && mobileNumbers.length > 0 
    ? mobileNumbers.map((m, index) => ({ 
        name: index === 0 ? "Primary Contact" : `Secondary ${index}`, 
        phonenumber: m.number, 
        countryisdcode: "+91",
        isdefaultwhatsappnum: index === 0 ? "Yes" : "No"
      })) 
    : [];

  //  EXACT SENIOR FORMAT FOR BANK DETAILS (Single Account for now) 
  const paymentDetailsArray = bankName ? [{
    transactionname: "Primary",
    bankname: bankName,
    ifscode: ifscCode || "",
    accountnumber: accountNumber || "",
    paymentfavouring: name, // Default to party name
    setasdefault: "Yes",
    defaulttransactiontype: "Inter Bank Transfer"
  }] : [];

  return {
    static_variables: [
      { name: "svMstImportFormat", value: "jsonex" },
      { name: "svCurrentCompany", value: "SalesFlow Testing" }
    ],
    tallymessage: [
      {
        metadata: { type: "Ledger", action: action, name: name },
        name: name,
        parent: partyType || "Sundry Debtors",
        
        email: email || "",
        ledgermobile: primaryMobile, 
        defaultwhatsappno: whatsapp || "",
        
        address: [address || ""],
        statename: state || "",
        countryname: "India",
        pincode: pincode || "",
        
        // Contact Details List (Senior Format Verified)
        contactdetails: contactDetailsArray,
        
        //  EXACT BANK PAYLOAD FROM SENIOR'S FILE 
        paymentdetails: paymentDetailsArray,
        
        hasmultipleaddresses: "Yes",
        
        ledmailingdetails: [{
          mailingname: name,
          applicablefrom: "20260401",
          address: [address || ""],
          state: state || "",
          country: "India",
          pincode: pincode || ""
        }],
        
        ledmultiaddresslist: branchName ? [{
          addressname: branchName,
          address: [branchAddress || ""],
          statename: branchState || "",
          pincode: branchPincode || ""
        }] : []
      }
    ]
  };
};

// --- CREATE ROUTE ---
app.post('/api/tally/sync', async (req, res) => {
  console.log(`[CREATE] Data received from React: ${req.body.name}`);
  const jsonPayload = buildTallyPayload("Create", req.body);
  
  console.log("--- EXACT JSON GOING TO TALLY ---");
  console.log(JSON.stringify(jsonPayload, null, 2));
  console.log("-----------------------------------------");

  try {
    const response = await fetch('http://127.0.0.1:3000', {
      method: 'POST',
      body: JSON.stringify(jsonPayload),
      headers: { 
        'Content-Type': 'application/json', 
        'Origin': 'https://tallysolutions.com', 
        'Referer': 'https://tallysolutions.com/', 
        'tallyrequest': 'Import', 
        'type': 'Data', 
        'id': 'All Masters' 
      }
    });
    const resultText = await response.text();
    res.status(200).json({ status: "success", message: "Synced successfully", tallyLog: resultText });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Tally connection failed" });
  }
});

// --- EDIT ROUTE ---
app.put('/api/tally/edit', async (req, res) => {
  const jsonPayload = buildTallyPayload("Alter", req.body);
  try {
    const response = await fetch('http://127.0.0.1:3000', { 
      method: 'POST', 
      body: JSON.stringify(jsonPayload), 
      headers: { 
        'Content-Type': 'application/json', 
        'Origin': 'https://tallysolutions.com', 
        'Referer': 'https://tallysolutions.com/', 
        'tallyrequest': 'Import', 
        'type': 'Data', 
        'id': 'All Masters' 
      } 
    });
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));