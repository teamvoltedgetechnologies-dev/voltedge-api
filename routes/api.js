const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const Otp = require('../models/Otp');
const { Resend } = require('resend');
const jwt = require('jsonwebtoken');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Admin Auth Middleware
const authAdmin = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
    
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'super_secret_voltedge_master_key_10x');
        if (decoded.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Access denied. Not an admin.' });
        }
    } catch (err) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

// @route   POST /api/admin/login
// @desc    Authenticate admin and get token
router.post('/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === (process.env.ADMIN_PASSWORD || 'voltedge2026')) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'super_secret_voltedge_master_key_10x', { expiresIn: '8h' });
        res.status(200).json({ token });
    } else {
        res.status(401).json({ error: 'Invalid administrator credentials.' });
    }
});

// Email Configuration uses Resend
// No transporter needed - Resend handles SMTP

// @route   GET /api/products
// @desc    Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products.' });
    }
});

// @route   POST /api/products
// @desc    Add a new product (Admin Only)
router.post('/products', authAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create product.', details: err });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin Only)
router.delete('/products/:id', authAdmin, async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Product not found.' });
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product.' });
    }
});

// @route   POST /api/contact/request-otp
// @desc    Generate OTP and send it to user's email
router.post('/contact/request-otp', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email
        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }
        
        // Generate a 6-digit OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save in DB temporarily
        const newOtpEntry = new Otp({
            email,
            otp: generatedOtp,
            formData: req.body
        });
        await newOtpEntry.save();

        // Send OTP email using Resend
        if (process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: 'VoltEdge Security <onboarding@resend.dev>',
                    to: email,
                    subject: `VoltEdge Security: Your Verification Code`,
                    html: `<p>Hello,</p>
<p>Your 6-digit VoltEdge verification code to authorize your contact submission is: <strong>${generatedOtp}</strong></p>
<p>This code will expire in 10 minutes.</p>
<p>Thank you,<br>VoltEdge Technologies</p>`
                });
                console.log(`📧 Generated OTP sent to ${email}`);
            } catch (emailErr) {
                console.error(`❌ Email sending failed for ${email}:`, emailErr);
                return res.status(500).json({ 
                    error: 'Failed to send verification code.',
                    details: emailErr.message,
                    suggestion: 'Please verify your RESEND_API_KEY configuration.'
                });
            }
        } else {
            console.warn(`ℹ️ RESEND_API_KEY not configured. OTP generated for testing: ${generatedOtp}`);
            if (process.env.NODE_ENV === 'production') {
                return res.status(500).json({ error: 'Email service not configured. Please contact administrator.' });
            }
        }

        const responsePayload = { message: 'Verification code dispatched. Check your email.' };
        if (process.env.NODE_ENV !== 'production') {
            responsePayload.otp = generatedOtp; // useful for local/dev testing only
        }

        res.status(200).json(responsePayload);
    } catch (err) {
        console.error('OTP request error:', err);
        res.status(500).json({ error: 'Failed to generate verification code. Please try again.' });
    }
});

// @route   POST /api/contact/verify-otp
// @desc    Verify OTP from user and submit inquiry
router.post('/contact/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // Validate inputs
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required.' });
        }
        
        // Ensure OTP exists in DB
        const validOtpEntry = await Otp.findOne({ email, otp });
        if (!validOtpEntry) {
            return res.status(400).json({ error: 'Invalid or expired OTP code.' });
        }

        // 1. Process local MongoDB storage
        const inquiryData = validOtpEntry.formData;
        const newInquiry = new Inquiry(inquiryData);
        const savedInquiry = await newInquiry.save();

        // 2. Clear OTP explicitly to prevent replay
        await Otp.deleteOne({ _id: validOtpEntry._id });

        // 3. Dispatch official email alert to admin (non-blocking but logged)
        if (process.env.RESEND_API_KEY) {
            resend.emails.send({
                from: 'VoltEdge Leads <onboarding@resend.dev>',
                to: process.env.ADMIN_EMAIL || 'team.voltedge.technologies@gmail.com',
                replyTo: inquiryData.email,
                subject: `VoltEdge Valid Lead: ${inquiryData.subject}`,
                html: `<p>OTP-Verified Lead from the VoltEdge Interface.</p>
<p><strong>Client Name:</strong> ${inquiryData.name}</p>
<p><strong>Client Email:</strong> ${inquiryData.email}</p>
<p><strong>Subject:</strong> ${inquiryData.subject}</p>
<p><strong>Message:</strong></p>
<p>${inquiryData.message}</p>
<p><em>This lead log was fully secured via OTP and stored inside MongoDB.</em></p>`
            })
                .then(() => console.log(`📧 Admin notification sent for lead: ${inquiryData.email}`))
                .catch(emailErr => console.error(`❌ Admin email sending failed: ${emailErr.message}`));
        } else {
            console.warn(`ℹ️ RESEND_API_KEY not configured. Inquiry saved without notification.`);
        }

        res.status(201).json({ message: 'Message verified & submitted successfully!', inquiry: savedInquiry });
    } catch (err) {
        console.error('OTP verification error:', err);
        res.status(500).json({ error: 'Failed to process verification. Please try again.', details: err.message });
    }
});

module.exports = router;
