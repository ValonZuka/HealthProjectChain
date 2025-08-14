# HealthAndRecordChain 🏥🔗

**HealthAndRecordChain** is a blockchain-powered healthcare record management system that ensures patient data is **secure**, **tamper-proof**, and accessible only to authorized medical professionals.  
Using blockchain technology, every record is **immutable**, transparent for authorized parties, and protected from unauthorized access.

---

## 🌟 Why Blockchain in Healthcare?
In traditional healthcare systems, patient records are often stored in centralized databases, making them vulnerable to hacking, tampering, or loss.  
By storing records on a blockchain:
- **Immutability:** Once added, data cannot be altered or deleted without authorization.
- **Transparency:** Actions are traceable and verifiable.
- **Security:** Data is encrypted and accessible only to patients and approved doctors.
- **Patient Control:** The patient has ownership of their own records.

---

## 👥 Roles in the System

### **1. Patient**
- View personal medical records.
- Approve/revoke doctor access.
- Create new health records.
- Edit their own record details (if allowed by system policy).
- Delete outdated or incorrect entries.

### **2. Doctor**
- Access patient records **only if granted permission**.
- Create or update medical reports.
- Suggest edits to a patient’s record (with transparency).
- View complete medical history of authorized patients.

### **3. Admin**
- Manage user accounts (patients/doctors).
- Oversee system logs.
- Maintain blockchain node integrity.

---

## 🛠️ Main Features & Functions

### **Create Function**
Adds a new record to the blockchain.  
- For **patients**: Add personal health details (e.g., allergies, past surgeries, prescriptions).
- For **doctors**: Add a diagnosis, prescription, or lab report for a patient (with permission).
- Automatically timestamps and secures the entry.

### **Edit Function**
Updates an existing record while preserving historical changes.  
- Changes are saved as a **new block** linked to the old one (audit trail intact).
- Old versions remain viewable for transparency.

### **View Function**
Displays detailed health records.  
- **Patients** can see all their records.
- **Doctors** can only view records for patients who approved access.
- Data is shown in a clear, UI-friendly layout.

### **Delete Function**
Marks a record as **archived** or **revoked** in the blockchain.  
- The original data remains on-chain for legal compliance.
- Ensures no "hard delete" that would compromise traceability.

---

## 🔑 Demo Access
To see the **Patient Dashboard** in action, log in with:
- Email: valon@gmail.com
- Password: loni12345 -(IF YOU WANNA SEE EXCISTING TARs MENTIONING Valon )



## 📦 Tech Stack
- **Frontend:** Next.js + TailwindCSS
- **Backend:** Node.js / Express.js
- **Blockchain Layer:** Ethereum / Hyperledger (custom smart contracts)
- **Database (optional off-chain):** MongoDB
- **Auth:** JWT-based secure authentication

---

## 📜 License
MIT License — Free to use, modify, and distribute with proper attribution.
