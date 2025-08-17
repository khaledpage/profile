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

bug: the height of the row where the article are animated to move, is not high enough, which make the article look cut out inside it . and the row animation is too fast.

--

Bug: the let talks btn in navigation is not Animated.


---

bug: i cant edit articles in real time or i dont know how

---

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