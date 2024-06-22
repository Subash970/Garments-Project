const UserCredentials = require("../../models/userCredentials");
const UserCompany = require("../../models/userCompanies");
const Bill = require("../../models/bill");

const newBill = async (req, res) => {
  const { items } = req.body;
  const { company } = req.body;
  const totalNumbers = [];
  const total = () => {
    items.map((item) => totalNumbers.push(item.Total));
  };
  total();
  let TotalTaxableAmount = 0;
  totalNumbers.map((num) => (TotalTaxableAmount += num));
  const SGST = (2.5 / 100) * TotalTaxableAmount;
  const CGST = (2.5 / 100) * TotalTaxableAmount;
  const ToatalInvoiceAmount = TotalTaxableAmount + SGST + CGST;
  const user = req.user;
  const userCredential = await UserCredentials.findOne({ user });
  let invoiceNo = 1;
  const lastInvoice = await Bill.findOne({ user })
    .sort("-createdAt")
    .select("invoiceNo");
  if (lastInvoice) {
    invoiceNo = lastInvoice.invoiceNo + 1;
  }
  const data = {
    user,
    userCredential,
    company,
    items,
    TotalTaxableAmount,
    SGST,
    CGST,
    ToatalInvoiceAmount,
    invoiceNo,
  };
  try {
    await Bill.newBill(data);
    res.status(200).json({ msg: "bill added" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await UserCompany.find({ user: req.user }).select(
      "company.CompanyName"
    );
    res.status(200).json({ companies: companies.map((c) => c.company) });
  } catch (err) {
    res.status(400).json({ msg: "an error occured. please try again" });
  }
};

const companyDetails = async (req, res) => {
  const { companyName } = req.body;
  try {
    const company = await UserCompany.findOne({
      user: req.user,
      "company.CompanyName": companyName,
    }).select("company");
    if (!company) {
      res.status(400).json({ msg: "No companies found" });
      return;
    }
    res.status(200).json({ company });
  } catch (err) {
    res.status(400).json({ msg: "an error occured. please try again" });
  }
};

module.exports = {
  newBill,
  getCompanies,
  companyDetails,
};
