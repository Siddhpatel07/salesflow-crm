const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Helper to build Tally payload
const buildTallyPayload = (action, data) => {
  const {
    name,
    company,
    email,
    partyType,
    address,
    state,
    pinCode,
    branchName,
    branchAddress,
    branchState,
    branchPincode,
    whatsapp,
    contactName,
    mobileNumbers,
    bankDetails
  } = data;

  // Contact Details Mapping
  const contactDetailsArray = mobileNumbers && mobileNumbers.length > 0
    ? mobileNumbers
      .filter(m => m.number) 
      .map((m, index) => {

        let contactPersonName = "";

        if (index === 0) {

          contactPersonName = contactName ? contactName : "Primary Contact";
        } else {
          contactPersonName = m.name ? m.name.trim() : `Secondary Contact ${index}`;
        }

        return {
          name: contactPersonName,
          phonenumber: m.number,
          countryisdcode: "+91",
          isdefaultwhatsappnum: index === 0 ? "Yes" : "No"
        };
      })
    : [];
  // BANK PAYMENT DETAILS
  const paymentDetailsArray = bankDetails && bankDetails.length > 0
    ? bankDetails
      .filter(bank => bank.bankName || bank.accountNumber || bank.ifscCode) // Khali row filter karne ke liye
      .map((bank, index) => ({
        transactionname: index === 0 ? "Primary" : (index === 1 ? "Secondary" : `Secondary ${index}`),
        bankname: bank.bankName || "",
        ifscode: bank.ifscCode || "",
        accountnumber: bank.accountNumber || "",
        paymentfavouring: name, // Senior ke json me party ka naam hai yahan
        setasdefault: index === 0 ? "Yes" : "No",
        defaulttransactiontype: "Inter Bank Transfer" // Senior ke format ke mutabik fixed
      }))
    : [];

  // Ensure address is an array
  const addressLines = address ? address.split('\n').map(line => line.trim()).filter(line => line) : [];
  const branchAddressLines = branchAddress ? branchAddress.split('\n').map(line => line.trim()).filter(line => line) : [];

  const payload = {
    static_variables: [
      { name: "svMstImportFormat", value: "jsonex" },
      { name: "svCurrentCompany", value: "SalesFlow Testing" }
    ],
    tallymessage: [
      {
        metadata: {
          type: "Ledger",
          action: action,
          name: name
        },
        name: name,
        parent: partyType,
        email: email,
        ledgercontact: contactName || "",
        ledgermobile: mobileNumbers?.[0]?.number || "",
        defaultwhatsappno: whatsapp || mobileNumbers?.[0]?.number || "",
        address: addressLines.length > 0 ? addressLines : [address || ""],
        statename: state,
        countryname: "India",
        pincode: pinCode,

        // Arrays going to Tally
        contactdetails: contactDetailsArray,
        paymentdetails: paymentDetailsArray, // 👈 Naya array exactly senior format me

        hasmultipleaddresses: branchName ? "Yes" : "No"
      }
    ]
  };

  // Add mailing details if address provided
  if (address) {
    payload.tallymessage[0].ledmailingdetails = [{
      mailingname: name,
      applicablefrom: "20260401",
      address: addressLines.length > 0 ? addressLines : [address],
      state: state,
      country: "India",
      pincode: pinCode
    }];
  }

  // Add secondary branch address if provided
  if (branchName) {
    payload.tallymessage[0].ledmultiaddresslist = [{
      addressname: branchName,
      address: branchAddressLines.length > 0 ? branchAddressLines : [branchAddress],
      statename: branchState,
      pincode: branchPincode
    }];
  }

  return payload;
};

// --- SYNC ROUTE ---
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
    res.status(200).json({ status: "success", message: "Synced successfully", tallylog: resultText });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Tally connection failed" });
  }
});

// --- EDIT ROUTE ---
app.put('/api/tally/edit', async (req, res) => {
  console.log(`[ALTER] Data received from React: ${req.body.name}`);
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
    const resultText = await response.text();
    res.status(200).json({ status: "success", message: "Edited successfully", tallylog: resultText });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Tally connection failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Node Server is running on port ${PORT}`));