**the user have to confirm the bug is fixed after testing it**

**FIXED - BUG-001: Article Upload Not Showing in Articles List**
- **Description**: Upload some article to articles page, expected to see the article appears beside the other article in the page http://localhost:3000/articles, with some indication icon that is new uploaded, but no new article appears.
- **Root Cause**: Missing POST endpoint in `/api/articles` route and incomplete `uploadFromZip` implementation in ArticleService.
- **Fix Applied**:
  - ✅ Implemented POST endpoint in `/src/app/api/articles/route.ts` with proper authentication and file processing
  - ✅ Completed `uploadFromZip` method in `/src/services/articleService.ts` with ZIP extraction, file creation, and index updates
  - ✅ Updated `useArticleUpload` hook to use real API instead of placeholder simulation
  - ✅ Fixed JSZip TypeScript integration with proper type definitions
  - ✅ Ensured uploaded articles include `published: true` field for proper visibility
- **Test Coverage**: 
  - ✅ E2E test FILE-002 passing: ZIP upload functionality with file processing validation
  - ✅ Manual test: ZIP upload creates articles in both `/src/content/articles/` and `/public/data/articles/`
  - ✅ API test: Uploaded articles appear immediately in `/api/articles` response
- **Status**: fix confirmed
- **Date Fixed**: August 17, 2025

--

**FIXED - BUG-002: Article Animation Row Height and Speed Issues**
- **Description**: The height of the row where the articles are animated to move is not high enough, which makes the articles look cut out inside it. And the row animation is too fast.
- **Root Cause**: Container height too small (400px) and unbounded article card heights causing overflow; animation speed too fast for comfortable reading.
- **Fix Applied**:
  - ✅ Increased container min-height from 400px to 500px
  - ✅ Slowed animation speed from 60s base + 15s per article to 90s base + 20s per article  
  - ✅ Added height constraints to article cards: `h-full max-h-[450px] flex flex-col`
  - ✅ Made content section flexible: `flex-1 flex flex-col justify-between` for proper content distribution
  - ✅ Maintained scroll track styling with `items-stretch h-full` for consistent sizing
- **Files Changed**:
  - `/src/components/sections/ArticlesSection.tsx` (container height and animation timing)
  - `/src/components/ui/ArticleCard.tsx` (card height constraints and flex layout)
- **Test Coverage**: Visual testing confirmed articles no longer cut off, animation speed comfortable
- **Status**: Waiting for user confirmation
- **Date Fixed**: January 16, 2025

--

**FIXED - BUG-003: Let's Talk Button Not Animated**
- **Description**: The "Let's Talk" button in navigation is not animated.
- **Root Cause**: Button had random heartbeat animation triggers (8-15 seconds) but no continuous visible animation.
- **Fix Applied**:
  - ✅ Added `pulse-glow` class to both desktop and mobile CTA buttons
  - ✅ Provides continuous subtle glow animation (2.5s infinite) that's always visible
  - ✅ Kept existing random heartbeat triggers for additional attention-grabbing effects
  - ✅ Animation uses CSS custom properties with accent colors for theme consistency
- **Files Changed**:
  - `/src/components/layout/Header.tsx` (added pulse-glow class to both CTA buttons)
- **Test Coverage**: Visual testing shows continuous glow animation on both desktop and mobile buttons
- **Status**: Waiting for user confirmation
- **Date Fixed**: January 16, 2025

--

**FIXED - BUG-004: User Education - How to Edit Articles in Real Time**
- **Description**: User reports "i cant edit articles in real time or i dont know how" indicating lack of awareness about existing editing functionality.
- **Root Cause**: User education issue - comprehensive editing system exists but users don't understand how to access and use it.
- **Fix Applied**:
  - ✅ Created comprehensive `AdminHelpPanel` component with step-by-step editing guide
  - ✅ Added help button to articles page admin controls with "How to edit articles" functionality
  - ✅ Implemented automatic first-time user onboarding that shows help panel on first visit
  - ✅ Enhanced edit button styling with icons, better colors, and helpful tooltips ("Edit this article in real-time")
  - ✅ Added hover effects and visual improvements to make editing features more discoverable
  - ✅ Created 8-step interactive guide covering navigation, edit buttons, modal usage, auto-save, and bulk operations
- **Files Changed**:
  - `/src/components/admin/AdminHelpPanel.tsx` (new comprehensive help system)
  - `/src/components/articles/ArticlesExplorer.tsx` (added help button and auto-onboarding)
  - `/src/components/ui/ArticleCard.tsx` (enhanced edit button styling and discoverability)
- **User Education Content**:
  - How to navigate to articles page
  - Where to find edit buttons on article cards
  - How to use the editing modal with metadata and content editing
  - Auto-save functionality and manual save options
  - Bulk operations and ZIP upload/download features
- **Test Coverage**: Interactive guide covers complete editing workflow from discovery to completion
- **Status**: Waiting for user confirmation
- **Date Fixed**: January 16, 2025

--

bug: the "Filter by Category:" should have own row and never move to fill empty space, if some tags in the row above are becomed less, because of filtering. 

---

bug: editing article is not activiting the save btn after changing the text in Content Editor. but it do get active after changeing some field from "Article Metadata" but after clicking it, error is caused. fix it and run e2e test that cover everthing.

---

bug: the show review btn in editing article does not render markdown 


---

CR: change the defualt mode to none admin


- bug: the selector page.waitForSelector('#admin-dashboard') sometimes you changed it to page.waitForSelector('#admin-dashboard-container') and sometime you chnage it back, you need to finde another solutaion and add comments to explain the changes to the code in the test, so you dont do that again.


--

bug: in the test you have to accept that some styling (color, opacity) can change depending on theme, dont be harsh in such test cases and avoid them.


---

bug: the back btn in http://localhost:3000/articles is not positioned correctly as other back buttons in other places, check all button in all place and make sure they are consistent and write tests to cover all cases specifically for postion and class styling name.