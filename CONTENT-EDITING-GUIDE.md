# Content Editing Guide

This guide will help you edit the content on your website without needing to know how to code. All the text, news items, and other content are stored in simple JSON files in the `content/` folder.

## 📁 Where to Find Content Files

All content files are located in the **`content/`** folder in your project:

```
content/
├── home.json          # Home page content
├── profile.json       # Profile page content
├── teaching.json      # Teaching page content
├── research.json      # Research page content
├── awards.json        # Awards and grants
└── publications/      # Individual publication files (auto-generated)
```

## 🛠️ How to Edit JSON Files

### Important Rules:
1. **Always keep the quotation marks** around text (`"like this"`)
2. **Don't remove commas** between items
3. **Don't remove curly braces** `{}` or square brackets `[]`
4. **Save the file after editing** (Ctrl+S or Cmd+S)
5. **Use a text editor** like VS Code, Notepad++, or even Notepad

---

## 📄 Editing Each Page

### 1. Home Page (`content/home.json`)

This controls the main landing page content.

**What you can edit:**

```json
{
  "pageTitle": "Human‑Robot Interaction",  ← Change the main page title
  "heroText": "I'm Tuğçe Nur...",          ← Change the introduction text
  "news": [                                 ← Add/edit news items below
    {
      "date": "Aug 2025",                   ← News item date
      "text": "Best PhD Thesis Award..."    ← News item text
    }
  ]
}
```

**To add a new news item:**
1. Copy an existing news block (from `{` to `}`)
2. Paste it after the last news item
3. Add a comma after the previous item
4. Update the date and text

**Example:**
```json
{
  "date": "Oct 2025",
  "text": "New research published in Nature Robotics."
},
```

---

### 2. Profile Page (`content/profile.json`)

This controls your profile information.

**What you can edit:**

```json
{
  "name": "Tuğçe Nur Pekçetin",           ← Your name
  "title": "Cognitive Science Ph.D...",   ← Your job title
  "bio": "I'm Tuğçe Pekçetin...",         ← Your biography
  "profileImage": "/path/to/image.jpg",   ← Path to your profile photo
  "location": "Wisconsin, USA",           ← Your location
  "email": "your.email@example.com",      ← Your email address
  "socialLinks": {
    "linkedin": "https://...",             ← Your LinkedIn URL
    "linkedinUsername": "yourname",        ← Your LinkedIn username
    "github": "https://github.com/...",   ← Your GitHub URL
    "twitter": "https://x.com/...",       ← Your Twitter/X URL
    "googleScholar": "https://scholar..." ← Your Google Scholar URL
  }
}
```

---

### 3. Teaching Page (`content/teaching.json`)

**What you can edit:**

```json
{
  "pageTitle": "Teaching",                 ← Page title
  "roles": [                               ← List of teaching positions
    {
      "title": "Instructor (Part-time)",   ← Job title
      "department": "Department of...",    ← Department name
      "institution": "Başkent University", ← University/Institution
      "location": "Ankara, Turkey",        ← Location
      "period": "Sept. 2021 – June 2022",  ← Time period
      "details": "Taught first-year...",   ← Description
      "courses": [                         ← List of courses
        "English Grammar",
        "Reading and Writing Skills..."
      ]
    }
  ]
}
```

**To add a new teaching role:** Copy an entire role block, paste after the last one, add a comma, and update fields.

---

### 4. Research Page (`content/research.json`)

**What you can edit:**

```json
{
  "pageTitle": "Research",
  "projects": [
    {
      "id": "mind-perception",             ← Unique ID
      "title": "Mind Perception",          ← Project title
      "image": "https://images...",        ← Image URL
      "description": "This line of...",    ← Description
      "href": "/research/mind-perception"  ← Link to detail page
    }
  ]
}
```

---

### 5. Awards Page (`content/awards.json`)

**What you can edit:**

```json
{
  "pageTitle": "Awards & Recognition",
  "awards": [
    {
      "category": "grants",                ← "grants" or "recognition"
      "sortKey": "2025-08",                ← YYYY-MM for sorting
      "text": "Title — Description"        ← Award text
    }
  ]
}
```

**Categories:**
- `"grants"` - Scholarships, fellowships, grants
- `"recognition"` - Awards, honors, recognitions

**To add a new award:**
1. Copy an existing award block
2. Paste it after the last award (add a comma before it)
3. Update `sortKey`, `category`, and `text`

---

### 6. Publications (`lib/publications-data.ts`)

**⚠️ Note:** Publications require editing a TypeScript file (slightly more technical).

**Location:** `lib/publications-data.ts`

**Structure:**
```typescript
{
  "id": "unique-publication-id-2025",
  "title": "Your Publication Title",
  "authors": "Author 1, Author 2, ...",
  "venue": "Conference/Journal Name",
  "year": 2025,                            ← Number (no quotes!)
  "tags": ["Conference"],                  ← Type: Conference, Journal, etc.
  "pdf": null,                             ← PDF path or null
  "link": "https://doi.org/..."
}
```

**To add a new publication:**
1. Copy an entire publication block (from `{` to `},`)
2. Paste it at the appropriate position
3. Update all fields
4. Ensure `year` is a number without quotes
5. Save

---

### 7. Research Detail Pages

Each research project has its own detail page with content in JSON files:

**Files:**
- `content/research-mind-perception.json` - Mind Perception detail page
- `content/research-action-perception.json` - Action Perception detail page

**Structure:**
```json
{
  "title": "Mind Perception",              ← Page main title
  "pageTitle": "Mind Perception — ...",    ← Browser tab title
  "image": "https://images...",            ← Hero image URL
  "imageAlt": "Mind Perception Research",  ← Image description
  "overviewParagraphs": [                  ← Overview text (array of paragraphs)
    "First paragraph...",
    "Second paragraph..."
  ],
  "keyQuestions": [                        ← Research questions list
    "Question 1?",
    "Question 2?"
  ],
  "videoUrl": "https://www.youtube.com/embed/...",  ← YouTube embed URL
  "videoTitle": "Video Title",             ← Video title
  "relatedPublications": [                 ← List of publications
    {
      "title": "Publication Title",
      "authors": "Author 1, Author 2",     ← Use "T. N. Pekçetin" for bold
      "venue": "Conference Name, 2024",
      "link": "https://doi.org/..."
    }
  ]
}
```

**To edit a research page:**
1. Open the corresponding JSON file in `content/`
2. Edit text in quotes
3. Add/remove items from arrays
4. Save the file

**To add a new publication to a research page:**
1. Copy an existing publication block
2. Paste it in the `relatedPublications` array
3. Add a comma before it
4. Update title, authors, venue, and link

---

## ✅ Testing Your Changes

After editing:
1. **Save the file** (Ctrl+S)
2. **Refresh your website** in the browser
3. **Check if everything looks correct**

---

## 🆘 Common Mistakes

### ❌ Wrong:
```json
{
  "name": Tuğçe,              // Missing quotes
  "location": "Wisconsin"     // Missing comma
  "email": "test@example.com"
}
```

### ✅ Correct:
```json
{
  "name": "Tuğçe",            // Has quotes
  "location": "Wisconsin",    // Has comma
  "email": "test@example.com"
}
```

---

## 📞 Need Help?

1. Check for missing quotes `"`, commas `,`, or brackets `{}`
2. Use a JSON validator website (Google "JSON validator")
3. Compare your file with the examples above

---

## 🎉 You're All Set!

You can now edit all the content on your website. Just edit the JSON files, save, and refresh!
