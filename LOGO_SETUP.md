# Logo Setup Instructions

## Required Action

You need to save your logo image to the project. Based on the AlarmPI logo you showed me, save it as:

**Location**: `/Users/nick/Documents/Repositories/projects/xnet_landing/public/logo.png`

### Steps:

1. Save your logo image (the AlarmPI one or your custom logo)
2. Place it in the `public` folder as `logo.png`
3. Recommended size: 512x512px or similar square dimensions
4. Format: PNG with transparent background works best

### Current Implementation

The logo is now used in:
- Main landing page header ([app/page.tsx](app/page.tsx:16-22))
- Admin dashboard header ([app/admin/page.tsx](app/admin/page.tsx:81-87))

The image is rendered at 40x40 pixels and rounded.

### Application Tile Styling

I've updated the application tiles to match the AlarmPI card style you showed:
- Dark gradient background (dark-800 to dark-900)
- Icon on the left side (larger 56x56px)
- App name and description on the right
- Arrow appears on hover (top right)
- Smooth hover effects with color transitions

The tiles now have that sleek, modern look with:
- Darker backgrounds
- Border highlights on hover
- Right-pointing arrow indicator
- Better visual hierarchy

Once you save the logo image, the site will be complete!
