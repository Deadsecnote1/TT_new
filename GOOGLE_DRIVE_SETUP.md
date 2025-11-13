# Google Drive Integration Guide

This project uses **Google Drive** as a free, simple file storage solution. No backend server needed!

## 🎯 How It Works

1. **Upload PDFs to Google Drive** - You manage files in your Google Drive
2. **Share files publicly** - Set files to "Anyone with the link can view"
3. **Add links to the admin panel** - Paste Google Drive share links
4. **Users view/download** - PDFs are embedded or downloaded directly from Google Drive

## 📋 Step-by-Step Setup

### 1. Upload Your PDF to Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Upload your PDF file (or create a folder structure like `Grade 6/Mathematics/Textbooks/`)
3. Organize files by grade/subject for easy management

### 2. Make Files Publicly Accessible

**Important:** Files must be set to "Anyone with the link can view" for users to access them.

1. Right-click on the PDF file in Google Drive
2. Click **Share** or **Get link**
3. Change sharing settings to:
   - **"Anyone with the link"** 
   - Permission: **"Viewer"**
4. Click **Copy link**
5. The link will look like: `https://drive.google.com/file/d/FILE_ID/view`

### 3. Add Resource to Admin Panel

1. Log in to the admin panel (`/admin/login` - default password: `admin123`)
2. Go to **Manage Resources** tab
3. Select:
   - **Grade** (e.g., Grade 6)
   - **Subject** (e.g., Mathematics)
   - **Resource Type** (Textbook, Notes, Papers, Videos)
   - **Language(s)** (Sinhala, Tamil, English)
4. Paste the Google Drive link
5. Enter a **Title** (e.g., "Grade 6 Mathematics Textbook - Sinhala")
6. Add optional description
7. Click **Add Resource**

### 4. Users Can Now Access

- **View PDF**: Click "View" button to see PDF in embedded viewer
- **Download PDF**: Click "Download" button to download directly from Google Drive

## 🔗 Google Drive Link Formats Supported

The system automatically detects and converts these formats:

- `https://drive.google.com/file/d/FILE_ID/view`
- `https://drive.google.com/file/d/FILE_ID/edit`
- `https://drive.google.com/open?id=FILE_ID`
- `https://drive.google.com/uc?id=FILE_ID`
- Just the `FILE_ID` (if you paste only the ID)

## ✅ Best Practices

### File Organization

Organize your Google Drive like this:
```
Teaching Torch Resources/
├── Grade 6/
│   ├── Mathematics/
│   │   ├── Textbooks/
│   │   ├── Papers/
│   │   └── Notes/
│   └── Science/
├── Grade 7/
└── Advanced Level/
    ├── Science Stream/
    └── Commerce Stream/
```

### Naming Conventions

Use clear, descriptive names:
- ✅ `Grade_6_Mathematics_Textbook_Sinhala.pdf`
- ✅ `Grade_10_Science_Term1_Paper_English.pdf`
- ❌ `doc1.pdf` or `untitled.pdf`

### File Sharing Settings

- ✅ **"Anyone with the link can view"** - Recommended
- ❌ **"Restricted"** - Won't work for public access
- ❌ **"Anyone with the link can edit"** - Not recommended (security risk)

## 🛠️ Troubleshooting

### PDF Won't Load

**Problem:** "Failed to load PDF" error

**Solutions:**
1. Check if file is set to "Anyone with the link can view"
2. Verify the Google Drive link is correct
3. Try opening the link directly in a new tab
4. Make sure the file is a PDF (not DOCX or other format)

### Download Not Working

**Problem:** Download button doesn't work

**Solutions:**
1. Check file sharing permissions
2. Try the direct download link: `https://drive.google.com/uc?export=download&id=FILE_ID`
3. Make sure browser allows downloads

### Link Not Recognized

**Problem:** "Invalid Google Drive link" error

**Solutions:**
1. Make sure you copied the full share link
2. Link should contain `drive.google.com`
3. Try extracting just the FILE_ID and pasting that

## 📊 Storage Limits

- **Free Google Account**: 15 GB total storage
- **Google Workspace**: Varies by plan
- **Recommendation**: Use a dedicated Google account for Teaching Torch resources

## 🔒 Security Notes

1. **Public Access**: Files are publicly accessible via link
2. **No Authentication**: Anyone with the link can view/download
3. **Best Practice**: Only upload educational content, no sensitive data
4. **Backup**: Keep local copies of important files

## 💡 Tips

1. **Batch Upload**: Upload multiple files to Google Drive first, then add links in bulk
2. **Test Links**: Always test the Google Drive link before adding to admin panel
3. **Organize First**: Set up your folder structure before adding resources
4. **Regular Backups**: Export data from admin panel regularly (Export All Data button)

## 🚀 Alternative: Google Drive API (Advanced)

For advanced users, you can integrate Google Drive API for:
- Automatic file listing
- Direct uploads from admin panel
- Better file management

But the current link-based approach works perfectly for most use cases!

---

**Need Help?** Check the admin panel info section or contact support.

