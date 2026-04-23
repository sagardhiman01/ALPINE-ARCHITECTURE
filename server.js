const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const auth = require('./middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoSanitize = require('express-mongo-sanitize');
const { body, validationResult } = require('express-validator');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

const fs = require('fs');

// Path to data files
const CONTENT_PATH = path.join(__dirname, 'content.json');
const DATABASE_PATH = path.join(__dirname, 'database.json');

// Helper to Load data
const getSiteContent = () => {
  try { return JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8')); }
  catch (e) { return { hero: {}, about: {}, services: [], pricing: { plans: [] } }; }
};

const getDatabase = () => {
  try { return JSON.parse(fs.readFileSync(DATABASE_PATH, 'utf-8')); }
  catch (e) { return { projects: [], contacts: [] }; }
};

let database = getDatabase();
let memoryProjects = database.projects.map(p => ({
  ...p,
  _id: p._id || p.id || Math.random().toString()
}));
let memoryContacts = database.contacts || [];

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://images.unsplash.com"],
    },
  },
})); // Security layer
app.use(morgan('dev')); // Monitoring layer
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Rate limiting (Security layer)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' }
});
app.use('/api', apiLimiter);

// --- Auth Routes ---
// Admin login
app.post('/api/login', async (req, res) => {
  const { username, email, password } = req.body;
  const adminUser = process.env.ADMIN_EMAIL || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD_HASH || '123456';

  // Check if both username/email match and password matches
  const inputUser = username || email;

  if (inputUser === adminUser && password === adminPass) {
    const payload = { user: { id: 'admin_id' } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// --- API Routes ---

// Get all projects (Public)
app.get('/api/projects', async (req, res) => {
  try {
    const sortedProjects = [...memoryProjects].sort((a, b) => b.createdAt - a.createdAt);
    res.json(sortedProjects);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new project (Protected - Security layer)
app.post('/api/projects', auth, [
  body('title').trim().escape().notEmpty(),
  body('category').trim().escape().notEmpty(),
  body('location').trim().escape().notEmpty(),
  body('fullLocation').optional().trim().escape(),
  body('image').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newProject = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    memoryProjects.unshift(newProject);
    
    // Persist to file
    const fs = require('fs');
    fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify({
      projects: memoryProjects,
      contacts: memoryContacts
    }, null, 2));

    res.status(201).json(newProject);
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a project (Protected)
app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    memoryProjects = memoryProjects.filter(p => p._id !== id);
    
    // Persist to file
    const fs = require('fs');
    fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify({
      projects: memoryProjects,
      contacts: memoryContacts
    }, null, 2));

    res.json({ success: true, message: 'Project deleted' });
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a project (Protected)
app.put('/api/projects/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const index = memoryProjects.findIndex(p => p._id === id);
    if (index === -1) return res.status(404).json({ error: 'Project not found' });
    
    memoryProjects[index] = { ...memoryProjects[index], ...req.body, updatedAt: new Date() };
    
    // Persist to file
    const fs = require('fs');
    fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify({
      projects: memoryProjects,
      contacts: memoryContacts
    }, null, 2));

    res.json(memoryProjects[index]);
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit contact form (Public)
app.post('/api/contact', [
  body('name').trim().escape().notEmpty(),
  body('email').isEmail().normalizeEmail().notEmpty(),
  body('message').trim().escape().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newContact = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    memoryContacts.unshift(newContact);

    // Persist to file
    const fs = require('fs');
    fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify({
      projects: memoryProjects, 
      contacts: memoryContacts
    }, null, 2));

    // Send Email notification for Contact Form
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = require('nodemailer').createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'Mayuroffficial@gmail.com',
        subject: `New Project Inquiry: ${req.body.firstName || req.body.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #DAA520;">
            <h2 style="color: #DAA520;">Alpine Studios - Contact Inquiry</h2>
            <hr/>
            <p><strong>Name:</strong> ${req.body.firstName} ${req.body.lastName || ''}</p>
            <p><strong>Email:</strong> ${req.body.email}</p>
            <p><strong>Message:</strong> ${req.body.message}</p>
          </div>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log('Contact Mail error:', error);
        else console.log('Contact Email sent:', info.response);
      });
    }

    res.status(201).json({ success: true, message: 'Message sent' });
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit consultation request (Public)
app.post('/api/consultation', async (req, res) => {
  const formData = req.body;
  
  try {
    // 1. Save to in-memory contacts (optional, for admin panel)
    const newRecord = {
      _id: Date.now().toString(),
      type: 'Consultation',
      ...formData,
      createdAt: new Date()
    };
    memoryContacts.unshift(newRecord);

    // Persist to file
    const fs = require('fs');
    fs.writeFileSync(path.join(__dirname, 'database.json'), JSON.stringify({
      projects: memoryProjects, 
      contacts: memoryContacts
    }, null, 2));

    // 2. Send Email via Nodemailer
    // NOTE: USER MUST PROVIDE EMAIL_USER and EMAIL_PASS in .env
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'placeholder@gmail.com',
        pass: process.env.EMAIL_PASS || 'password'
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'Mayuroffficial@gmail.com',
      subject: `New Consultation Request: ${formData.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #DAA520;">
          <h2 style="color: #DAA520;">Alpine Studios - Consultation Request</h2>
          <hr/>
          <p><strong>Name:</strong> ${formData.fullName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone}</p>
          <p><strong>Location:</strong> ${formData.location}</p>
          <p><strong>Property Size:</strong> ${formData.propertySize}</p>
          <p><strong>Project Type:</strong> ${formData.projectType}</p>
          <p><strong>Scope:</strong> ${formData.scope}</p>
          <p><strong>Categories:</strong> ${formData.categories.join(', ')}</p>
          <p><strong>Requirements:</strong> ${formData.requirements}</p>
          <p><strong>Budget:</strong> ${formData.budget}</p>
          <p><strong>Timeline:</strong> ${formData.timeline}</p>
          <p><strong>Preferred Date:</strong> ${formData.preferredDate}</p>
          <p><strong>Time Slot:</strong> ${formData.preferredTime}</p>
          <p><strong>Referral:</strong> ${formData.referral}</p>
        </div>
      `
    };

    // Attempt to send email but don't block if credentials missing
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log('Mail error:', error);
        else console.log('Email sent:', info.response);
      });
    } else {
      console.log('Skipping email send - EMAIL_USER/PASS missing in .env');
    }

    res.status(201).json({ success: true, message: 'Consultation request received' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get contacts (Protected - Security layer)
app.get('/api/contact', auth, async (req, res) => {
  try {
    const sortedContacts = [...memoryContacts].sort((a, b) => b.createdAt - a.createdAt);
    res.json(sortedContacts);
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Content Routes ---
app.get('/api/content', (req, res) => {
  res.json(getSiteContent());
});

app.post('/api/content', auth, (req, res) => {
  try {
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// --- Static File Serving (PRODUCTION) ---
// Serve frontend as static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback to React app for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'), (err) => {
    if (err) {
      console.error("Frontend sendFile Error:", err);
      res.status(500).send(`Production Error: React build not found. Make sure to run npm run build in frontend.`);
    }
  });
});

// Final Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).send(`Global Error: ${err.message}. Stack: ${err.stack}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
