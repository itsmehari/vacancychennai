# SEO and AI-search checklist

Website items from the 21 Oct 2026 plan. Checked items are in the app. Unchecked items need a Google, social, or partner account that this repo cannot create.

## Pages and answers

- [x] 1. Role hubs for titles Chennai searches
- [x] 2. Neighbourhood index
- [x] 3. Internship, contract, and temporary hubs
- [x] 4. Salary page from live listing ranges
- [x] 5. How to get a job in Chennai
- [x] 6. OMR, GST Road, and Porur guide
- [x] 7. Walk-in guide
- [x] 8. Fresher guide (pay filter, not an experience badge)
- [x] 9. Employer writing guide
- [x] 10. Extra role pages only when listings exist — electrician, beautician, pharmacist, and security hubs stay off until those words appear on published jobs
- [x] 11. Guides index and ideas block
- [x] 12. FAQ page
- [x] 13. Glossary
- [x] 14. Candidate how-to steps
- [x] 15. Employer how-to steps
- [x] 16. Fake-job guide
- [x] 17. Phone-only apply guide
- [x] 18. Interview questions guide
- [x] 19. Posted-this-week page with live counts — `/jobs-this-week`
- [x] 20. Tamil short version on each of the ten guides

## Workflows

- [x] 21. Home strip for roles, areas, pay, and guides
- [x] 22. Apply path written on `/how-to-apply`
- [x] 23. Employer path written on `/hire-in-chennai`
- [x] 24. Category link from role hubs into the main board
- [x] 25. Saved area opens that neighbourhood hub from the profile page and candidate dashboard
- [x] 26. Alert signup can name an area and a role (migration `015_subscription_interests.sql`)
- [x] 27. Employer checklist on the paste form and the dashboard post form
- [x] 28. After apply, the confirmation shows the job URL and the no-fee rule

## Trust and schema

- [x] 29. Safety page
- [x] 30. Salary language stays indicative
- [x] 31. Author and updated date on guides
- [x] 32. FAQ text matches FAQ structured data
- [x] 33. About page says the editorial desk reviews listings
- [x] 34. Visible employer name and `hiringOrganization` use the same resolved name

## Google for Jobs and crawling

- [x] 35. Job pages keep `JobPosting` structured data
- [x] 36. Hubs expose ItemList, breadcrumbs, and FAQ or HowTo where the words are on the page
- [x] 37. Sitemap includes the public hubs
- [x] 38. `/llms.txt` lists the hubs and the citation rule
- [ ] 39. Request indexing in Google Search Console after deploy — needs your Search Console login
- [ ] 40. Google Indexing API on publish and close — needs a Search Console property and a Cloud service account
- [x] 41. Employer can mark a live job filled; it leaves the public board the same day and `expires_at` is set to now

## Off the website

- [ ] 42. Google Business Profile with the same name, city, and support email
- [x] 43. Organization `sameAs` reads real profile URLs from `NEXT_PUBLIC_SOCIAL_*` / `NEXT_PUBLIC_ORG_SAME_AS` when those are set
- [x] 44. Share desk — `/share-areas` and each area hub open WhatsApp or Telegram with the post filled in (English and Tamil). You pick the group.
- [x] 45. Same desk opens a ready email for a college or association. You add their address and send.
- [x] 46. Copy job link on the listing and on the employer dashboard
- [x] 47. Partner jobs feed linked from About and the weekly page (`/jobs.xml`)

## Measurement

- [ ] 48. Watch Search Console impressions for area, telecaller, part-time, and internship queries
- [x] 49. Applications store a source tag when someone opens a job from a role hub (`role-telecaller` and similar)
- [x] 50. Salary snapshot states the date and the number of listings it counted
