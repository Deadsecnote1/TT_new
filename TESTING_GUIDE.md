# Testing Guide - Google Drive Integration

## 🚀 Quick Start

### 1. Start the Development Server

```bash
npm start
```

The app will open automatically at `http://localhost:3000`

---

## 📋 Step-by-Step Testing

### Step 1: Prepare a Test PDF in Google Drive

1. **Upload a PDF to Google Drive**
   - Go to [Google Drive](https://drive.google.com)
   - Upload any PDF file (or use a sample PDF)
   - Name it something like: `Test_Textbook_Grade6_Mathematics.pdf`

2. **Make it Publicly Accessible**
   - Right-click the PDF → **Share** or **Get link**
   - Change to: **"Anyone with the link"** → **"Viewer"**
   - Click **Copy link**
   - The link should look like: `https://drive.google.com/file/d/1ABC123xyz.../view`

### Step 2: Access Admin Panel

1. **Open the app** in your browser: `http://localhost:3000`
2. **Navigate to Admin Login**:
   - Click "Admin Login" link in the footer/navbar, OR
   - Go directly to: `http://localhost:3000/admin/login`
3. **Login**:
   - Password: `admin123`
   - Click "Login"

### Step 3: Add a Google Drive Resource

1. **Go to "Manage Resources" tab** (if not already there)
2. **Fill in the form**:
   - **Select Grade**: Choose any grade (e.g., Grade 6)
   - **Select Subject**: Choose a subject (e.g., Mathematics)
   - **Resource Type**: Select "Textbook"
   - **Select Language(s)**: Click on language buttons (e.g., English, Sinhala)
   - **Google Drive Link**: Paste your copied link
   - **Resource Title**: Enter a title (e.g., "Grade 6 Mathematics Textbook - English")
   - **Description** (optional): Add any notes
3. **Click "Add Resource"**
4. **You should see**: Success alert with resource details

### Step 4: Test as a User

1. **Logout** from admin panel (click "Logout" button)
2. **Navigate to the grade page**:
   - Go to Home page
   - Click on the grade you selected (e.g., "Grade 6")
3. **Go to Textbooks**:
   - Click "Textbooks" card or link
4. **Find your resource**:
   - Look for the subject you selected (e.g., Mathematics)
   - Find the language card (e.g., English)
   - You should see your resource listed

### Step 5: Test View Functionality

1. **Click "View" button** on your resource
2. **Expected behavior**:
   - Modal opens with PDF viewer
   - PDF loads in embedded Google Drive viewer
   - You can scroll through the PDF
   - "Download PDF" button visible at top

### Step 6: Test Download Functionality

1. **Click "Download" button** (either in the modal or on the resource card)
2. **Expected behavior**:
   - Opens Google Drive download link in new tab
   - PDF starts downloading
   - Or opens in Google Drive viewer (depending on browser)

---

## ✅ Checklist - What to Verify

### Admin Panel
- [ ] Can login with password `admin123`
- [ ] Google Drive link input accepts valid links
- [ ] Link validation shows success message for valid links
- [ ] Link validation shows warning for invalid links
- [ ] Can select grade, subject, resource type, languages
- [ ] "Add Resource" button works
- [ ] Success message appears after adding resource
- [ ] Resource appears in "File Manager" section

### User Experience
- [ ] Resource appears on the correct grade/subject page
- [ ] Resource appears in correct language section
- [ ] "View" button opens PDF in modal
- [ ] PDF loads and displays correctly in viewer
- [ ] "Download" button works
- [ ] Can close modal by clicking X or outside modal
- [ ] Language filter works (if filtering by language)

### Browser Console
- [ ] No JavaScript errors in console (F12 → Console tab)
- [ ] No CORS errors
- [ ] No 404 errors for resources

---

## 🐛 Troubleshooting

### Issue: "Invalid Google Drive link" error

**Solution:**
- Make sure you copied the full share link
- Link should contain `drive.google.com`
- Try the format: `https://drive.google.com/file/d/FILE_ID/view`

### Issue: PDF won't load in viewer

**Solutions:**
1. Check if file is set to "Anyone with the link can view"
2. Open the Google Drive link directly in a new tab to verify it works
3. Check browser console for errors (F12)
4. Try a different PDF file

### Issue: Download doesn't work

**Solutions:**
1. Verify file sharing permissions in Google Drive
2. Try opening the link directly: `https://drive.google.com/uc?export=download&id=FILE_ID`
3. Check browser download settings

### Issue: Resource doesn't appear on page

**Solutions:**
1. Refresh the page (F5)
2. Check if you selected the correct grade/subject
3. Check browser localStorage (F12 → Application → Local Storage → `teachingTorch_uploadedFiles`)
4. Verify the resource was saved correctly

### Issue: Modal doesn't open

**Solutions:**
1. Check browser console for errors
2. Make sure the Google Drive link is valid
3. Try clicking "View" button again
4. Check if `embedUrl` is generated correctly

---

## 🔍 Debugging Tips

### Check LocalStorage

1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Local Storage** → `http://localhost:3000`
4. Look for `teachingTorch_uploadedFiles`
5. Click it to see stored resources
6. Verify your resource is there with correct `driveLink`

### Test Google Drive Link Directly

1. Copy the `driveLink` from localStorage
2. Open it in a new browser tab
3. Should open in Google Drive viewer
4. If it works here, it should work in the app

### Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click "View" button
4. Look for requests to `drive.google.com`
5. Check if requests are successful (status 200)

---

## 📝 Test Data Example

Here's a sample resource you can add for testing:

```
Grade: Grade 6
Subject: Mathematics
Resource Type: Textbook
Languages: English
Google Drive Link: [Your test PDF link]
Title: Test Grade 6 Mathematics Textbook
Description: This is a test resource for Google Drive integration
```

---

## 🎯 Quick Test Script

1. ✅ Start server: `npm start`
2. ✅ Login to admin: `/admin/login` (password: `admin123`)
3. ✅ Add test resource with Google Drive link
4. ✅ Logout and navigate to grade page
5. ✅ Click on Textbooks
6. ✅ Click "View" - should open PDF in modal
7. ✅ Click "Download" - should download PDF
8. ✅ Test language filtering (if multiple languages)

---

## 💡 Pro Tips

1. **Use a real PDF**: Don't use placeholder/test PDFs - use actual educational content
2. **Test multiple files**: Add resources for different grades/subjects
3. **Test language filtering**: Add same resource in multiple languages
4. **Check mobile view**: Test on mobile browser or resize window
5. **Test dark mode**: Toggle theme and verify PDF viewer works in dark mode

---

## 🆘 Still Having Issues?

1. Check browser console for errors
2. Verify Google Drive file permissions
3. Try a different PDF file
4. Clear browser cache and localStorage
5. Restart the development server

---

**Happy Testing! 🚀**

