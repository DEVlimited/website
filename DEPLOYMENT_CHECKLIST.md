# Firebase Deployment Checklist

## Pre-Deployment Steps

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Verify Project
```bash
firebase projects:list
# Should show: devltd-website
```

### 4. Install Function Dependencies
```bash
cd functions
npm install
cd ..
```

### 5. Set Up Gmail App Password
1. Go to Google Account > Security > 2-Step Verification
2. Go to Security > App passwords
3. Create new app password for "Mail"
4. Copy the 16-character password

### 6. Configure Firebase Functions
```bash
firebase functions:config:set gmail.email="YOUR_EMAIL@gmail.com" gmail.password="YOUR_16_CHAR_APP_PASSWORD"
```

Verify:
```bash
firebase functions:config:get
```

## Deploy Commands

### Full Deployment (First Time)
```bash
firebase deploy
```

This deploys:
- ✅ Cloud Functions (submitContactForm, submitNewsletter)
- ✅ Firestore Rules (security rules)
- ✅ Firestore Indexes (query optimization)
- ✅ Hosting (all website files)

### Individual Deployments

Deploy only functions:
```bash
firebase deploy --only functions
```

Deploy only hosting:
```bash
firebase deploy --only hosting
```

Deploy only Firestore:
```bash
firebase deploy --only firestore
```

## Post-Deployment Testing

### 1. Test Contact Form
- [ ] Visit: https://devltd-website.web.app/contact.html
- [ ] Fill out form with test data
- [ ] Submit form
- [ ] Verify success message appears
- [ ] Check bobby@devlimited.org for email
- [ ] Check kyle@devlimited.org for email
- [ ] Verify submission in Firestore Console

### 2. Test Newsletter Form
- [ ] Visit: https://devltd-website.web.app
- [ ] Scroll to newsletter section
- [ ] Enter test email
- [ ] Submit
- [ ] Verify success message
- [ ] Check both email addresses for notification

### 3. Test Input Validation
- [ ] Try submitting contact form with invalid email
- [ ] Try submitting with name less than 2 characters
- [ ] Try submitting with message less than 10 characters
- [ ] Verify appropriate error messages appear

### 4. Test Security
- [ ] Try submitting form with `<script>alert('test')</script>` in message
- [ ] Verify it's blocked or sanitized
- [ ] Check Firestore to ensure HTML is escaped

### 5. Check Firestore Data
- [ ] Go to Firebase Console > Firestore Database
- [ ] Check `contact_submissions` collection
- [ ] Check `newsletter_subscribers` collection
- [ ] Verify all fields are populated correctly
- [ ] Verify timestamps are set

## Monitoring

### View Function Logs
```bash
firebase functions:log
```

### View Specific Function Logs
```bash
firebase functions:log --only submitContactForm
```

### Real-time Log Streaming
```bash
firebase functions:log --follow
```

## Troubleshooting

### If emails aren't sending:
1. Check function logs: `firebase functions:log`
2. Verify Gmail config: `firebase functions:config:get`
3. Test Gmail App Password manually
4. Check spam folder

### If forms aren't submitting:
1. Open browser DevTools Console
2. Check for JavaScript errors
3. Check Network tab for failed requests
4. Verify Firebase SDK is loading

### If functions are failing:
1. Check Node.js version in functions/package.json
2. Ensure dependencies are installed
3. Check function logs for specific errors
4. Verify Firestore is enabled

## Custom Domain Setup (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Enter: devlimited.org
4. Follow DNS instructions
5. Wait for SSL provisioning (can take 24 hours)

## Success Indicators

When deployment is successful:
- ✅ All files uploaded to Firebase Hosting
- ✅ Functions deployed and callable
- ✅ Firestore rules active
- ✅ Contact form sends emails to both recipients
- ✅ Newsletter form sends notifications
- ✅ All submissions stored in Firestore
- ✅ No console errors in browser
- ✅ Input validation working properly

## Quick Commands Reference

```bash
# Deploy everything
firebase deploy

# Deploy only hosting (fast)
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# View logs
firebase functions:log

# Open Firebase Console
firebase open

# Test locally
firebase emulators:start
```

## Next Steps After Deployment

1. Test all forms thoroughly
2. Update DNS if using custom domain
3. Set up Google Analytics (already configured)
4. Monitor function usage in Firebase Console
5. Set up alerts for function errors (optional)
6. Consider adding reCAPTCHA for additional spam protection

## Support

- Firebase Documentation: https://firebase.google.com/docs
- Setup Guide: See FIREBASE_SETUP.md
- Issues: Check function logs first, then Firebase Console
