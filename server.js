require("dotenv").config();
const express = require("express");
const path = require("path");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;

const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
    await resend.emails.send({
      from: "Staraxis Solar <onboarding@resend.dev>",
      to: process.env.EMAIL,
      subject: "New Solar Quotation Request",
      html: `
      <h2>New Solar Quotation Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Capacity:</strong> ${capacity} kW</p>
    `,
    });

    res.sendFile(path.join(__dirname, "public", "success.html"));
  } catch (error) {
    console.error(error);
    res.status(500).send("Email sending failed");
  }
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

  try {
    await resend.emails.send({
      from: "Staraxis Solar <onboarding@resend.dev>",
      to: process.env.EMAIL,
      subject: "New Complaint - Staraxis Solar",
      html: `
      <h2>New Complaint</h2>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Complaint:</strong> ${complaint}</p>
    `,
    });

    res.sendFile(path.join(__dirname, "public", "complaint-success.html"));
  } catch (error) {
    console.error(error);
    res.status(500).send("Email sending failed");
  }
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

  try {
    await resend.emails.send({
      from: "Staraxis Solar <onboarding@resend.dev>",
      to: process.env.EMAIL,
      subject: "New Service Request - Staraxis Solar",
      html: `
      <h2>New Service Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>System Model:</strong> ${system_model}</p>
      <p><strong>Service Type:</strong> ${service_type}</p>
      <p><strong>Description:</strong> ${description}</p>
    `,
    });

    res.sendFile(path.join(__dirname, "public", "service-success.html"));
  } catch (error) {
    console.error(error);
    res.status(500).send("Email sending failed");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
