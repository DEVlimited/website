# Firebase Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Gmail account with App Password (for sending emails)

## Initial Setup

### 1. Install Dependencies
```bash
cd functions
npm install
```

### 2. Configure Gmail for Email Sending

You need to set up a Gmail App Password to send emails via Nodemailer:

1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification (enable if not already)
3. Go to Security > App passwords
4. Create a new app password for "Mail"
5. Save the generated 16-character password

### 3. Set Firebase Function Configuration

Set your Gmail credentials (required for sending emails):

```bash
firebase functions:config:set gmail.email="your-email@gmail.com" gmail.password="your-16-char-app-password"
```

Verify the configuration:
```bash
firebase functions:config:get
```

### 4. Initialize Firestore

Make sure Firestore is enabled in your Firebase project:
1. Go to Firebase Console > Firestore Database
2. Click "Create database"
3. Start in production mode
4. Choose a location

## Deployment

### Deploy Everything (First Time)
```bash
firebase deploy
```

### Deploy Only Functions
```bash
firebase deploy --only functions
```

### Deploy Only Hosting
```bash
firebase deploy --only hosting
```

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## Testing Forms

### Test Contact Form

Once deployed, you can test the contact form by:
1. Visit your site: https://devltd-website.web.app (or your custom domain)
2. Go to the Contact page
3. Fill out the form with test data
4. Submit the form
5. Check bobby@devlimited.org and kyle@devlimited.org for the email

### Test Newsletter Form

1. Find the newsletter subscription section on any page
2. Enter a test email address
3. Submit
4. Check bobby@devlimited.org and kyle@devlimited.org for the notification

### View Submissions in Firestore

You can view all form submissions in the Firebase Console:
1. Go to Firestore Database
2. Collections: `contact_submissions` and `newsletter_subscribers`

## Security Features Implemented

### Input Validation
- ✅ Name: 2-100 chars, letters/spaces/hyphens only
- ✅ Email: Valid format, max 254 chars
- ✅ Phone: Optional, basic format validation
- ✅ Message: 10-5000 chars required
- ✅ XSS protection: HTML entities escaped
- ✅ SQL injection protection: Firestore handles this
- ✅ Spam pattern detection (scripts, iframes, etc.)

### Rate Limiting
- Logs IP addresses for potential rate limiting
- Can be extended with Firebase Extensions or custom logic

### Data Storage
- All submissions stored in Firestore with timestamps
- IP addresses logged for abuse monitoring
- Firestore rules prevent unauthorized access

## Troubleshooting

### Functions Not Deploying
- Check Node.js version: `node --version` (should be 18+)
- Verify you're in the correct project: `firebase projects:list`
- Check function logs: `firebase functions:log`

### Emails Not Sending
- Verify Gmail configuration: `firebase functions:config:get`
- Check function logs for errors: `firebase functions:log`
- Ensure 2FA and App Password are set up correctly
- Test SMTP connection locally

### CORS Errors
- Firebase Functions handle CORS automatically for callable functions
- If issues persist, check browser console for specific errors

### Form Not Submitting
- Open browser DevTools console
- Check for JavaScript errors
- Verify Firebase SDK is loading correctly
- Check Network tab for failed requests

## Local Testing

### Run Functions Emulator
```bash
cd functions
npm run serve
```

This will start the Firebase emulator suite. Update `firebase-config.js` to point to the emulator:

```javascript
// For local testing, uncomment this line:
// connectFunctionsEmulator(functions, "localhost", 5001);
```

### Test Locally
1. Start emulator: `firebase emulators:start`
2. Open your site locally
3. Submit forms - emails won't send but you'll see logs in console

## Monitoring

### View Function Logs
```bash
firebase functions:log
```

### View Real-time Logs (Streaming)
```bash
firebase functions:log --only submitContactForm
```

## Environment Variables (Alternative to Config)

If you prefer using environment variables instead of Firebase config:

1. Create `.env` file in functions directory:
```
GMAIL_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
```

2. The functions/index.js already supports both methods

## Cost Estimates

Firebase Free Tier (Spark Plan):
- ✅ Firestore: 20K writes/day, 50K reads/day
- ✅ Cloud Functions: 125K invocations/month, 40K GB-seconds
- ✅ Hosting: 10GB storage, 360MB/day transfer

For a small business website, the free tier should be more than sufficient. Typical monthly usage:
- ~100 contact form submissions = 100 function calls + 100 Firestore writes
- ~500 newsletter signups = 500 function calls + 500 Firestore writes
- Well within free limits!

## Custom Domain Setup

1. In Firebase Console, go to Hosting
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. SSL certificate will be provisioned automatically

## Support

For issues with:
- Firebase: https://firebase.google.com/support
- This implementation: Check function logs and browser console
- Email delivery: Verify Gmail App Password and SMTP settings
