# Quick Start Guide for Content Editors 👋

Welcome! This website is now super easy to edit. You don't need to know how to code!

## 🎯 What You Need to Know

All the text on the website lives in simple files in the **`content/`** folder:

- **`content/home.json`** → Home page text and news
- **`content/profile.json`** → Your profile information  
- **`content/teaching.json`** → Teaching experience
- **`content/research.json`** → Research projects
- **`content/awards.json`** → Awards and grants
- **`content/publications/`** → Individual publication files
- **`lib/publications-data.ts`** → Publications list (requires more care)

## 📝 How to Edit Content

### Step 1: Open the File
- Find the file you want to edit in the `content/` folder
- Open it with any text editor (VS Code, Notepad, etc.)

### Step 2: Make Your Changes
- Change the text between the quotation marks `"like this"`
- **Don't delete** commas (`,`), brackets (`[]`), or braces (`{}`)

### Step 3: Save & Check
- Save the file (Ctrl+S or Cmd+S)
- Refresh your website in the browser
- That's it! Your changes should appear

## 📖 Need More Help?

Read the **[CONTENT-EDITING-GUIDE.md](./CONTENT-EDITING-GUIDE.md)** file for:
- Detailed instructions for each page
- How to add/remove news items
- How to add new teaching roles or awards
- How to add research projects
- How to manage publications
- Common mistakes to avoid

## 🆘 Something Broke?

1. Check if you forgot a comma or quotation mark
2. Compare your file with the examples in CONTENT-EDITING-GUIDE.md
3. Use a JSON validator online (Google "JSON validator")

## 🎉 That's It!

You're all set. Just edit the JSON files and save. No coding needed!

---

**Developer Info:** If you need to make deeper changes beyond content (like layout, styling, or functionality), you'll need to edit the TypeScript/React files in the `app/` folder.
