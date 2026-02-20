require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/send", async (req, res) => {
  const { name, phone, email, location, capacity } = req.body;

  // Server-side validation
  const errors = [];

  if (!name || name.trim().length < 3) {
    errors.push("Name must be at least 3 characters long.");
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push("Name should contain only letters and spaces.");
  }

  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    errors.push("Phone number must be exactly 10 digits.");
  }

  if (!email || !email.includes("@")) {
    errors.push("Valid email address is required.");
  }

  if (!location || location.trim().length < 3) {
    errors.push("Location must be at least 3 characters long.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "New Solar Quotation Request",
    text: `
        Name: ${name}
        Phone: ${phone}
        Email: ${email}
        Location: ${location}
        Capacity: ${capacity} kW
        `,
  };

  await transporter.sendMail(mailOptions);

  res.sendFile(path.join(__dirname, "public", "success.html"));
});

app.post("/complaint", async (req, res) => {
  const { phone, email, complaint } = req.body;

  // Server-side validation
  const errors = [];

  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    errors.push("Phone number must be exactly 10 digits.");
  }

  if (!email || !email.includes("@")) {
    errors.push("Valid email address is required.");
  }

  if (!complaint || complaint.trim().length < 10) {
    errors.push("Complaint must be at least 10 characters long.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "New Complaint - Staraxis Solar",
    text: `
        Phone: ${phone}
        Email: ${email}
        Complaint: ${complaint}
        `,
  };

  await transporter.sendMail(mailOptions);

  res.sendFile(path.join(__dirname, "public", "complaint-success.html"));
});

app.post("/service-request", async (req, res) => {
  const { name, phone, email, system_model, service_type, description } =
    req.body;

  // Server-side validation
  const errors = [];

  if (!name || name.trim().length < 3) {
    errors.push("Name must be at least 3 characters long.");
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push("Name should contain only letters and spaces.");
  }

  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    errors.push("Phone number must be exactly 10 digits.");
  }

  if (!email || !email.includes("@")) {
    errors.push("Valid email address is required.");
  }

  if (!system_model || system_model.trim().length < 2) {
    errors.push("Please enter system model or capacity.");
  }

  if (!service_type) {
    errors.push("Service type is required.");
  }

  if (!description || description.trim().length < 10) {
    errors.push("Description must be at least 10 characters long.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "New Service Request - Staraxis Solar",
    text: `
        Name: ${name}
        Phone: ${phone}
        Email: ${email}
        System Model/Capacity: ${system_model}
        Service Type: ${service_type}
        Description: ${description}
        `,
  };

  await transporter.sendMail(mailOptions);

  res.sendFile(path.join(__dirname, "public", "service-success.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
