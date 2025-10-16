const {onCall, HttpsError} = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin
admin.initializeApp();

// Email configuration - using environment variables (.env file)
const gmailEmail = process.env.GMAIL_EMAIL;
const gmailPassword = process.env.GMAIL_PASSWORD;

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

// Input validation and sanitization
function validateAndSanitize(data) {
  const errors = [];

  // Name validation (2-100 chars, letters, spaces, hyphens only)
  const name = (data.name || '').trim();
  if (!name || name.length < 2 || name.length > 100) {
    errors.push('Name must be between 2 and 100 characters');
  }
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    errors.push('Name contains invalid characters');
  }

  // Email validation
  const email = (data.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Invalid email address');
  }
  if (email.length > 254) {
    errors.push('Email address too long');
  }

  // Company validation (optional, max 100 chars)
  const company = (data.company || '').trim();
  if (company.length > 100) {
    errors.push('Company name too long');
  }

  // Phone validation (optional, basic format check)
  const phone = (data.phone || '').trim();
  if (phone && !/^[\d\s\-\+\(\)\.]+$/.test(phone)) {
    errors.push('Invalid phone number format');
  }
  if (phone.length > 20) {
    errors.push('Phone number too long');
  }

  // Service validation
  const validServices = ['vr', 'ar', 'custom', 'consulting', 'other', ''];
  const service = (data.service || '').trim();
  if (!validServices.includes(service)) {
    errors.push('Invalid service selection');
  }

  // Message validation (10-5000 chars)
  const message = (data.message || '').trim();
  if (!message || message.length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  if (message.length > 5000) {
    errors.push('Message too long (max 5000 characters)');
  }

  // Check for potential spam indicators
  const spamPatterns = [
    /<script/i,
    /javascript:/i,
    /<iframe/i,
    /onclick/i,
    /onerror/i,
    /(viagra|cialis|lottery|winner)/i
  ];

  const allText = `${name} ${email} ${company} ${message}`;
  for (const pattern of spamPatterns) {
    if (pattern.test(allText)) {
      errors.push('Content contains prohibited patterns');
      break;
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: name.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      email: email,
      company: company.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      phone: phone.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      service: service,
      message: message.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: null // Will be set from request
    }
  };
}

// Contact form submission handler
exports.submitContactForm = onCall({
  cors: true,
  invoker: 'public',
}, async (request) => {
  try {
    const data = request.data;
    // Rate limiting check (optional but recommended)
    const ip = request.rawRequest?.ip || 'unknown';

    // Validate and sanitize input
    const validation = validateAndSanitize(data);
    if (!validation.valid) {
      throw new HttpsError(
        'invalid-argument',
        validation.errors.join(', ')
      );
    }

    const sanitizedData = validation.data;
    sanitizedData.ip = ip;

    // Store in Firestore
    const docRef = await admin.firestore()
      .collection('contact_submissions')
      .add(sanitizedData);

    // Prepare email content
    const serviceLabels = {
      'vr': 'Virtual Reality Development',
      'ar': 'Augmented Reality Solutions',
      'custom': 'Custom Development',
      'consulting': 'Consulting',
      'other': 'Other'
    };

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Submission ID:</strong> ${docRef.id}</p>
      <hr>
      <p><strong>Name:</strong> ${sanitizedData.name}</p>
      <p><strong>Email:</strong> ${sanitizedData.email}</p>
      ${sanitizedData.company ? `<p><strong>Company:</strong> ${sanitizedData.company}</p>` : ''}
      ${sanitizedData.phone ? `<p><strong>Phone:</strong> ${sanitizedData.phone}</p>` : ''}
      ${sanitizedData.service ? `<p><strong>Service Interest:</strong> ${serviceLabels[sanitizedData.service] || sanitizedData.service}</p>` : ''}
      <hr>
      <p><strong>Message:</strong></p>
      <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted from IP: ${ip}</small></p>
    `;

    const emailText = `
New Contact Form Submission

Submission ID: ${docRef.id}
---
Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
${sanitizedData.company ? `Company: ${sanitizedData.company}\n` : ''}
${sanitizedData.phone ? `Phone: ${sanitizedData.phone}\n` : ''}
${sanitizedData.service ? `Service Interest: ${serviceLabels[sanitizedData.service] || sanitizedData.service}\n` : ''}
---
Message:
${sanitizedData.message}
---
Submitted from IP: ${ip}
    `;

    // Send email to both recipients
    const mailOptions = {
      from: `DEV Limited Website <${gmailEmail}>`,
      to: ['bobby@devlimited.org', 'kyle@devlimited.org'],
      replyTo: sanitizedData.email,
      subject: `New Contact Form: ${sanitizedData.name} - ${serviceLabels[sanitizedData.service] || 'General Inquiry'}`,
      text: emailText,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);

    // Return success
    return {
      success: true,
      message: 'Your message has been sent successfully!',
      submissionId: docRef.id
    };

  } catch (error) {
    console.error('Error processing contact form:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError(
      'internal',
      'An error occurred while processing your request. Please try again later.'
    );
  }
});

// Newsletter subscription handler
exports.submitNewsletter = onCall({
  cors: true,
  invoker: 'public',
}, async (request) => {
  try {
    const data = request.data;
    const ip = request.rawRequest?.ip || 'unknown';

    // Validate email
    const email = (data.email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid email address'
      );
    }

    if (email.length > 254) {
      throw new HttpsError(
        'invalid-argument',
        'Email address too long'
      );
    }

    // Check if already subscribed
    const existingDoc = await admin.firestore()
      .collection('newsletter_subscribers')
      .where('email', '==', email)
      .get();

    if (!existingDoc.empty) {
      return {
        success: true,
        message: 'You are already subscribed!',
        alreadySubscribed: true
      };
    }

    // Store in Firestore
    const docRef = await admin.firestore()
      .collection('newsletter_subscribers')
      .add({
        email: email,
        subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
        ip: ip,
        active: true
      });

    // Send notification email to team
    const mailOptions = {
      from: `DEV Limited Website <${gmailEmail}>`,
      to: ['bobby@devlimited.org', 'kyle@devlimited.org'],
      subject: 'New Newsletter Subscription',
      text: `New newsletter subscription:\n\nEmail: ${email}\nSubscription ID: ${docRef.id}\nIP: ${ip}`,
      html: `<h2>New Newsletter Subscription</h2><p><strong>Email:</strong> ${email}</p><p><strong>Subscription ID:</strong> ${docRef.id}</p><p><small>IP: ${ip}</small></p>`
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: 'Thank you for subscribing!',
      subscriptionId: docRef.id
    };

  } catch (error) {
    console.error('Error processing newsletter subscription:', error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError(
      'internal',
      'An error occurred while processing your subscription. Please try again later.'
    );
  }
});
