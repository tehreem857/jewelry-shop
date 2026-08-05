// ─────────────────────────────────────────────────────────────────────────────
// AURÉLIE Studio — All-in-One Server
// Serves the shop website AND sends order emails via Gmail SMTP.
// Just run: node server.js
// ─────────────────────────────────────────────────────────────────────────────

const express    = require("express");
const nodemailer = require("nodemailer");
const cors       = require("cors");
const path       = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ── Serve the jewelry shop static files (HTML, CSS, JS, images) ──────────────
app.use(express.static(path.join(__dirname)));

// ── Your Gmail credentials ───────────────────────────────────────────────────
const GMAIL_USER     = "umamafatimaumer@gmail.com";
const GMAIL_APP_PASS = "prsgthlwfffqcwhp";
// ─────────────────────────────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASS
  }
});

// ── POST /send-order — receives order and emails it ───────────────────────────
app.post("/send-order", async (req, res) => {
  const {
    order_id, order_date,
    customer_name, customer_email, customer_phone,
    delivery_address, special_notes,
    items_summary, total_amount
  } = req.body;

  if (!order_id || !customer_name || !customer_phone || !delivery_address) {
    return res.status(400).json({ success: false, message: "Missing required order fields." });
  }

  const emailBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌸 NEW ORDER — AURÉLIE Studio
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order ID   : ${order_id}
Order Date : ${order_date}

CUSTOMER DETAILS
─────────────────
Name     : ${customer_name}
Gmail    : ${customer_email}
Phone    : ${customer_phone}
Address  : ${delivery_address}
Notes    : ${special_notes || "None"}

ITEMS ORDERED
─────────────────
${items_summary}

─────────────────
Total Amount : ${total_amount}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  const mailOptions = {
    from:    `"AURÉLIE Studio Orders" <${GMAIL_USER}>`,
    to:      "umamafatimaumer@gmail.com",
    cc:      "tehreems857@gmail.com",
    subject: `🌸 New Order ${order_id} — ${customer_name}`,
    text:    emailBody
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Order ${order_id} email sent.`);
    res.json({ success: true, message: "Email sent successfully." });
  } catch (err) {
    console.error("❌ Email error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send email.", error: err.message });
  }
});

// ── Start server & open browser automatically ────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n🌸 AURÉLIE Studio is running!`);
  console.log(`👉 Open your shop: ${url}\n`);

  // Auto-open in browser
  const { exec } = require("child_process");
  exec(`start ${url}`);
});
