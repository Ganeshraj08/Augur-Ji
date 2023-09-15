import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Define the views directory

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

await mongoose
  .connect("mongodb://127.0.0.1:27017/AugurJi")
  .then(() => console.log("MongoDB Connected!"));

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  basicDetails: {
    height: String,
    weight: String,
    age: Number,
    gender: String,
    phone: String,
    healthIssues: String,
    healthIssueDetails: String,
  },
  additionalDetails: {
    medications: String,
    allergies: String,
    surgeries: String,
    healthcareProvider: String,
    smoking: String,
    alcohol: String,
    physicalActivity: String,
    diet: String,
    dietaryRestrictions: String,
    familyMedicalHistory: String,
    currentSymptoms: String,
    emergencyContact: String,
    additionalComments: String,
  },
});

const User = mongoose.model("userDetails", userSchema);

var mailId;

app.get("/signUp", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/", (req, res) => {
  res.render("home1");
});

app.post("/signUp", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.firstName + " " + req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });

    // Save the user and handle any errors that may occur
    await newUser.save();

    // If the user is successfully saved, send a success response

    res.redirect("login");
  } catch (error) {
    // Handle the error
    console.error("Error saving user:", error);
    // Send an error response
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const currUser = await User.findOne({ email: req.body.email });
    if (currUser) {
      if (currUser.password === req.body.password) {
        res.render("mainPage", { userDetails: currUser });
        mailId = req.body.email;
      } else {
        res.render("login", { Verified: "no" });
      }
    } else {
      res.render("login", { Verified: "no" });
    }
  } catch (error) {
    console.error("Error Occured:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/submitMedicalForm", async (req, res) => {
  try {
    const formData = req.body;
    // Assuming you have a way to identify the user

    // Find the user by their ID
    const user = await User.findOne({ email: mailId });

    if (!user) {
      // Handle the case where the user isn't found
      return res.status(404).send("User not found");
    }

    // Update the user's medical details with the form data
    user.basicDetails = {
      height: formData.height,
      weight: formData.weight,
      age: formData.age,
      gender: formData.gender,
      phone: formData.phone,
      healthIssues: formData.healthIssues,
      healthIssueDetails: formData.healthIssueDetails,
    };

    user.additionalDetails = {
      medications: formData.medications,
      allergies: formData.allergies,
      surgeries: formData.surgeries,
      healthcareProvider: formData.healthcareProvider,
      smoking: formData.smoking,
      alcohol: formData.alcohol,
      physicalActivity: formData.physicalActivity,
      diet: formData.diet,
      dietaryRestrictions: formData.dietaryRestrictions,
      familyMedicalHistory: formData.familyMedicalHistory,
      currentSymptoms: formData.currentSymptoms,
      emergencyContact: formData.emergencyContact,
      additionalComments: formData.additionalComments,
    };

    // Save the updated user document
    await user.save();
    res.render("mainPage", { userDetails: user });
  } catch (error) {
    console.error("Error submitting medical form:", error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
