const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const buildTallyPayload = (action, reqBody) => {
  const { 
    name, email, address, state, pincode, 
    branchName, branchAddress, branchState, branchPincode, 
    mobileNumbers, partyType, whatsapp 
  } = reqBody;

  const primaryMobile = mobileNumbers && mobileNumbers.length > 0 ? mobileNumbers[0].number : "";
  
  // EXACT SENIOR FORMAT - Without any .list suffix
  const contactDetailsArray = mobileNumbers && mobileNumbers.length > 0 
    ? mobileNumbers.map((m, index) => ({ 
        name: index === 0 ? "Primary Contact" : `Secondary ${index}`, 
        phonenumber: m.number, // Using 'phonenumber' prevents the overwrite bug
        countryisdcode: "+91",
        isdefaultwhatsappnum: index === 0 ? "Yes" : "No"
      })) 
    : [];

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
        
        // 🚀 EXACT KEYS AS PER SENIOR'S JSON (NO .list) 🚀
        contactdetails: contactDetailsArray,
        
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
  console.log(`📥 [CREATE] Data received from React: ${req.body.name}`);
  const jsonPayload = buildTallyPayload("Create", req.body);
  
  console.log("🚀 --- EXACT JSON GOING TO TALLY --- 🚀");
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

app.listen(5000, () => console.log('✅ Server running on port 5000'));