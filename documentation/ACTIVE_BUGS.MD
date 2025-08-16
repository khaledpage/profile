**the user have to confirm the bug is fixed after testing it**


bug/new feature: upload some article to articles page, expected to see the article appears beside the other article in the page http://localhost:3000/articles, with some indectation icon, that is new uploaded, but i see no new article, fix that and make some e2e test. you can create some test articl and zip it for testing. write another test that delete it.


--

bug: the hight of the row where the article are anmimated to move, is not high enough, which make the article look cut out inside it . and the row animation is too fast.

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
