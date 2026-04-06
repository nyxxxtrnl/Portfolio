# Portfolio System Documentation

## Overview
Your portfolio system has been fully updated to support unlimited dynamic projects with persistent storage and screenshot management.

## How It Works

### 1. **Main Portfolio Page (Index.html)**
- Displays your profile and a projects section
- Shows Project 1 and Project 2 by default
- Has an "Add Project" button to create new projects

### 2. **Adding New Projects**
1. Click the "Add Project" button on the portfolio home page
2. Enter the project details:
   - **Project Title** - Name of your project
   - **Project Description** - Brief description
   - **Live System URL** - Link to your live application
   - **Demo Video URL** - YouTube embed link (optional)
   - **Documentation Path** - Link to documentation (optional)
3. Click "Save" to create the project
4. The project is automatically saved in your browser's localStorage

### 3. **Project Pages (project1.html, project2.html, projectTemplate.html)**
Every project has 4 tabs:
- **LIVE SYSTEM** - Link to your live application
- **DEMO** - Embedded demo video
- **SCREENSHOTS** - Image gallery with upload capability
- **DOCUMENTATION** - Link to project documentation

### 4. **Screenshot Management**
- Click "Upload Image" to add project screenshots
- Select multiple images at once
- Click "Save Changes" to permanently save all screenshots
- The page automatically refreshes after saving
- Only saved images persist when you reload the page
- Delete button (🗑️) appears on each screenshot for removal

### 5. **Data Storage**
All data is stored in your browser's localStorage:
- **Portfolio Projects** - Stored in `portfolioProjects` (title, description, links)
- **Project Screenshots** - Each project stores images separately using its unique ID
- **Data Persistence** - All data survives page refreshes and browser restarts

## File Structure

```
├── Index.html                 # Main portfolio page
├── project1.html              # Project 1 page
├── project1.js                # Project 1 functionality
├── project2.html              # Project 2 page
├── project2.js                # Project 2 functionality
├── projectTemplate.html       # Template for new projects
├── projectTemplate.js         # Template functionality
├── style.css                  # Portfolio styling
├── project.css                # Project pages styling
├── script.js                  # Portfolio management logic
└── Me.jpg                     # Profile image
```

## Key Features Implemented

✅ **Dynamic Project Creation** - Add unlimited projects
✅ **Unlimited Screenshots** - No fixed image limit per project
✅ **Persistent Storage** - Data saved in localStorage
✅ **Separate Project Pages** - Each project has its own dedicated page
✅ **Tab-based Navigation** - Organized content in four tabs
✅ **Auto-refresh** - Page automatically updates after saving
✅ **Better Delete UI** - Trash icon (🗑️) with hover effects
✅ **Edit/Delete Projects** - Modify or remove projects from portfolio
✅ **Back Navigation** - Easy navigation from projects back to portfolio

## How New Projects Are Generated

When you add a new project:
1. A unique ID is generated (timestamp-based)
2. Project details are saved to localStorage
3. A project card appears on the portfolio with "View" link
4. The "View" link points to `projectTemplate.html?id=[unique-id]`
5. When you open the template, it loads that specific project's data
6. All screenshots for that project are stored separately using the project ID

## Important Notes

- **LocalStorage Limit**: Most browsers allow ~5-10MB of storage per domain
- **Multiple Browsers**: Data stored in one browser won't appear in another
- **Clearing Data**: Clearing browser cache will delete all saved projects and screenshots
- **Backup**: Consider exporting your data periodically
- **File Size**: Keep image files reasonably sized for better performance

## Troubleshooting

**Projects not showing after refresh?**
- Check browser console (F12) for any errors
- Ensure localStorage is enabled in browser settings

**Images not saving?**
- Check file size (very large files may fail)
- Ensure browser has localStorage enabled
- Try with a smaller image file

**Links not working?**
- Enter complete URLs with `https://` prefix
- For YouTube videos, use embed URLs (not regular watch links)

## Next Steps

1. Fill in your project details with real data
2. Add screenshots for each project
3. Update the demo video links (YouTube embed URLs)
4. Share your portfolio!

---

**System created with vanilla HTML, CSS, and JavaScript - No frameworks required!**
