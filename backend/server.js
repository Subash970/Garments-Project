require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const requireAuth = require("./middleware/requireAuth");

//controllers
const controller = require("./controller/controller");
const authController = require("./controller/authController/authController");
const GarmentController = require("./controller/GarmentController/GarmentController");
const billController = require("./controller/billController/billController");

const app = express();

//db connnection
const PORT = process.env.PORT;
const dbURI = process.env.dbURI;
const MongoDb = async () => {
  try {
    await mongoose.connect(dbURI);
    app.listen(PORT, "0.0.0.0");
    console.log("Connection established with MongoDb");
  } catch (err) {
    setTimeout(() => {
      MongoDb();
    }, 5000);
  }
};
MongoDb();

//Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

//app routes

//auth routes
app.post("/user/signup", authController.Signup);
app.post("/user/login", authController.Login);

app.get("/", controller.Index);
app.get("/user/user-companies", requireAuth, controller.getUserCompanies);
app.get("/:user", requireAuth, controller.userDetail);

//garments routes
app.post(
  "/user/add-credentials",
  requireAuth,
  GarmentController.AddCredentials
);
app.post("/user/add-companies", requireAuth, GarmentController.AddCompanies);
app.post(
  "/user/:company/edit-companies",
  requireAuth,
  GarmentController.EditCompany
);

//bill routes
app.post("/bill/new-bill", requireAuth, billController.newBill);
app.get("/bill/getCompanies", requireAuth, billController.getCompanies);
app.post("/bill/companyDetails", requireAuth, billController.companyDetails);

//routes
app.get("/user/bills", requireAuth, controller.userBills);
app.get("/bill/:_id", requireAuth, controller.singleBill);
app.get("/:user/:companyName", requireAuth, controller.singleCompany);
app.get(
  "/:user/:companyName/bills",
  requireAuth,
  controller.singleCompanyBills
);
