const express = require("express");
require("./db/conn");
const Company = require("./models/companySchema");
const User = require("./models/userSchema");

const port = 3000;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "ping pong" });
});

//1.	Add a Company
app.post("/add-company", async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    const result = await newCompany.save();
    return res.status(201).json({
      message: "Company added succesfully!",
      success: true,
      result,
    });
  } catch (error) {
    console.log("error in adding company", error);
    return res.status(400).json({
      message: "Bad Request",
      success: false,
    });
  }
});
//Get companies
app.get("/companies", async (req, res) => {
  try {
    const result = await Company.find({});
    return res.status(200).json({
      message: "Compnaies Fetch Successfully!",
      success: true,
      result,
    });
  } catch (error) {
    console.log("error in getting companies", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
});

//3.	Allocate a User to one or more Companies.
app.post("/add-user", async (req, res) => {
  try {
    const { name, email, phone, companyId } = req.body;
    // console.log(name, email, phone, companyId);
    if (!companyId) {
      return res.status(400).json({
        message: "Bad Request",
        success: false,
      });
    }
    const company = await Company.findById({ _id: companyId });
    // console.log("company", company);
    if (!company) {
      return res.status(404).json({
        message: "Company Not Found!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    // console.log("user", user);
    if (user) {
      user.companies.push(companyId);
      await user.save();
      return res.status(200).json({
        message: "User allocated to company successfully!",
        success: true,
        user,
      });
    }

    const newUser = new User({
      name,
      email,
      phone,
      companies: [companyId],
    });
    const result = await newUser.save();
    return res.status(201).json({
      message: "User Added Successfully!",
      success: true,
      result,
    });
  } catch (error) {
    console.log("error in adding user", error);
    res.status(500).json({
      message: "Internal Server!",
      success: false,
    });
  }
});

//4.	List Users [Name, Email, Phone, Allocated Companies (comma separated string)].
app.get("/users", async (req, res) => {
  try {
    const result = await User.find({}).populate("companies");
    // console.log("result=>", result);
    return res.status(200).json({
      message: "User Fetch Successfully!",
      success: true,
      result,
    });
  } catch (error) {
    console.log("error in getting users", error);
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
    });
  }
});

//6.	Get all Users’ data for a given Company.
app.get("/users/:companyId", async (req, res) => {
  try {
    // console.log(req.params.companyId);
    const company = await Company.findById({ _id: req.params.companyId });
    if (!company) {
      return res.status(404).json({
        message: "Company Not Found!",
        success: false,
      });
    }
    const result = await User.find({
      companies: req.params.companyId,
    });
    // console.log("result", result);
    return res.status(200).json({
      message: "User for given company fetched successfully!",
      success: true,
      result,
    });
  } catch (error) {
    console.log("error in fetching users for given company", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
});

//5.	Delete a given Company.
app.delete("/company/:companyId", async (req, res) => {
  try {
    const company = await Company.findById({ _id: req.params.companyId });
    if (!company) {
      return res.status(404).json({
        message: "Company Not Found!",
        success: false,
      });
    }
    const result = await Company.deleteOne({ _id: req.params.companyId });
    // console.log(result);
    return res.status(200).json({
      message: "Company Deleted Successfully!",
      success: true,
    });
  } catch (error) {
    console.log("error in deleting company", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
});
app.listen(port, () => {
  console.log(`server is running at port${port}`);
});
