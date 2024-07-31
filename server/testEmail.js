require("dotenv").config();

const sendEmail = require("./utils/sendEmail");

const recipientEmail = "test-recipient@example.com";
const emailSubject = "Test Email";
const emailBody = "This is a test email sent from Node.js";

sendEmail("23ucc569@lnmiit.ac.in", "Test Subject", "Test email body");
