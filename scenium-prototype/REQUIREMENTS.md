# Source alignment and prototype decisions

Primary authority: the uploaded **MSYADD1 template(SIMS).docx (2)(3).pdf**, Product Backlog section 4.3.3, PDF pages 23–34. Cross-checked with the attached Level 0, Level 1–2 DFD, use case and activity diagrams. Some diagrams are exported as tiled PDF pages; page numbers below are PDF page numbers, not a new process numbering system.

The current Level 1–2 DFD uses five stores: D1 User, D2 Booking, D3 Payment, D4 Staff, D5 Equipment. This prototype represents them as browser objects/arrays, not a database schema. Assignments are part of the staff domain; equipment reservation lines stay linked to bookings. Supporting notifications, feedback and activity histories are local prototype records.

| Sprint / backlog | Role and requirement            | Implemented screen / acceptance behavior                                                                                                                                       |
| ---------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 / 01           | Customer registration           | Customer sign-in > Create account; required fields, valid email/phone, password confirmation, duplicate email prevention, confirmation, customer-only role                     |
| 1 / 02           | Five-role login                 | Separate customer and staff sites; invalid credentials rejected; role-specific navigation and guarded actions; inactive accounts denied                                        |
| 1 / 03           | Owner manages accounts          | User accounts; list, search, contact editing, create user/staff accounts, activate/deactivate; current owner cannot deactivate himself                                         |
| 2 / 04           | Customer booking request        | Event details, date/time, guest count, venue, package/custom equipment, quantity/rate estimate, schedule and stock checks, pending record, simulated notification              |
| 2 / 05           | Secretary maintains customers   | Customer records; search/edit name, email and phone; duplicate email validation                                                                                                |
| 2 / 06           | Owner/Secretary manage bookings | Search/filter, detail and history, edit/reschedule/cancel; Owner-only approve/reject; eligible event completion; customer status/receipt view                                  |
| 3 / 07           | Owner/Secretary calendar        | Month navigation, color-coded booking statuses, details/editing, overlap checks, cancellation reflected automatically                                                          |
| 3 / 08           | Secretary payments              | Customer submission with sample QR and optional proof; Secretary verify/reject, direct payment record, balance and status calculation; printable demonstration receipt         |
| 3 / 09           | Secretary staff coordination    | Staff/status monitoring, approved-event selection, available crew assignment, collision/duplicate prevention, assignment removal and simulated notices                         |
| 3 / 10           | Event Staff availability        | Available / On Duty / On Leave; saved status visible to Secretary; notice to management                                                                                        |
| 3 / 11           | Event Staff assignments         | Only assignments linked to signed-in staff; event, date/time, venue and duty shown                                                                                             |
| 3 / 12           | Maintenance inventory           | Search/category filter, add/edit equipment, total/maintenance quantities, stock constraints, readiness confirmation, dispatch/return workflow and identification label mockup |
| 4 / 13           | Owner reports                   | Date-range generation, booking totals, verified collections, balances, CSV download and print                                                                                  |
| 4 / 14           | Owner trends                    | Monthly booking bars, peak-month identification, venue counts; values calculated from saved records                                                                            |
| 4 / 15           | Customer feedback               | One validated rating/comment per completed event; feedback visible in Owner reports                                                                                            |

## DFD process mapping

| DFD                                     | Workflow                                                                                        |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1.0 / 1.1–1.3 Register                  | Receive details, validate duplicates and fields, create account                                 |
| 2.0 / 2.1–2.2 Log In                    | Check credentials and active account, identify stored role, load permitted workspace            |
| 3.0 / 3.1–3.4 Manage Bookings           | Validate event and stock, queue request, Owner approval/rejection, customer status/cancellation |
| 4.0 / 4.1–4.3 Manage Payments           | Receive details, Secretary review, update payment ledger and booking balance                    |
| 5.0 / 5.1–5.2 Manage Calendar           | Retrieve booking schedule, show availability/status, edit through booking record                |
| 6.0 / 6.1–6.3 Manage Staff Availability | Check staff status, fetch assignments, assign available event staff                             |
| 7.0 / 7.1–7.4 Manage Equipment          | Inventory edit, availability check, reservation readiness confirmation, deployed/returned equipment         |
| 8.0 / 8.1–8.3 Reports and Analytics     | Retrieve booking/payment records, combine and calculate selected-period summaries               |

## Deliberate interpretations and limitations

1. The sprint backlog determines role permissions where older prose or diagram associations differ. There is no Finance or generic Admin account in the current sprint set. Corporate Secretary processes payments. Owner manages accounts, approves/rejects bookings, and generates reports. Owner and Secretary manage calendars/bookings. Event Staff handles personal availability/assignments. Maintenance Staff handles equipment.
2. The activity diagram depicts several actors around registration, while Sprint 1 story 01 specifies customer self-registration. Public self-registration is therefore Customer-only. Owner creates staff accounts and may also create customers or additional owners. Users cannot choose a privileged role during public registration.
3. “Booking” is used throughout, replacing older “job order” wording still present in background prose.
4. Customer and staff areas have separate interfaces and login forms within index.html with separate styles.css and script.js files. Hash navigation switches areas without a reload, so the simplest demonstration runs in one tab. No server, hosting, database or extension is required.
5. No database or backend. Local-file browser storage is used when available; otherwise an in-memory fallback keeps the same-tab workflow functional until refresh/close. Moving the file or using another browser may start a new data store. Session storage is likewise optional. Clearing browser storage removes the demo records. Different computers, browsers, private windows or origins do not share data. No real concurrency, access-control security, password hashing or password recovery service is claimed.
6. New customer requests must be at least seven calendar days ahead, following the paper's advance planning description. One overlapping event slot is allowed across the business in this prototype; pending requests hold slots and stock. Adjacent time slots are allowed. No overnight slots or setup/teardown buffer is modeled. Actual capacity, turnaround times and cutoff policies should be confirmed with the business before production.
7. Equipment quantities and prices, package bundles, customer/event names and staff sample contact details are fictional demonstration values. Existing item prices stay fixed when rates change; newly added reservation items use the current sample rate. Rates exclude taxes, delivery and additional labor because no authoritative pricing rules were supplied.
8. Equipment stock is managed by group and quantity, not individually serialized assets. Maintenance quantities are unavailable to bookings. Deployed/returned status applies to all items on that booking. Partial returns, damage billing and full repair history are not implemented. QR identification uses a labeled, non-scannable mockup, with manual ID search. Scanning hardware integration is outside this prototype.
9. Actual event completion requires the scheduled end to have passed and Maintenance Staff to confirm equipment Returned. Seeded completed bookings support feedback/report demonstrations immediately. The on-site guide and presentation controls have been removed.
10. GCash and bank transfer display an explicitly non-scannable sample QR. Cash and check can also be recorded. No payment provider, bank endpoint or real money transfer exists. Pending submissions do not reduce the balance; only verified payments do. “Unpaid,” “Downpayment,” and “Paid” are calculated. Overpayments and duplicate references are blocked. Cancellation retains financial history; refunds are manual and not implemented.
11. E-mail is an in-app preview/outbox. Booking updates, payment reviews, assignments and inventory alerts create records but do not send messages. There is no unattended event-reminder job. The FAQ helper is rule-based and uses fixed answers, not an LLM or NLP.
12. Reports use event dates for bookings and payment dates for collections. “Verified to date” in booking rows includes all verified payments for that booking, regardless of collection date. Cancelled/rejected bookings are excluded from peak-month analytics and outstanding-balance KPIs; their historical receipts remain in collections. Ties choose the first highest-count month encountered. Date ranges are capped at three years for display readability.
13. Sprint 4 asks for trends and peak periods. The prototype calculates historical summaries; it does not claim predictive machine learning or reliable future revenue forecasts from a handful of sample records. The paper's broader predictive wording requires separate future implementation.
14. No automatic damage detection, GPS tracking, real e-mail sending, online settlement, backend encryption, data synchronization across devices or production hosting is included.
15. HTML, CSS and JavaScript are separate files. The sample QR artwork remains embedded as a data image in script.js. No external service, module loader or network request is needed to run it.


## Requested revision — October 2, 2026

- Maintenance Staff’s reservation dialog no longer changes reserved quantities. For approved reservations, staff inspect the items and confirm Ready to deploy. Quantities and booking totals stay unchanged. Readiness is saved in history, with a confirmation timestamp and staff account, and management receives a simulated notice. Mark deployed is available after readiness confirmation; the existing event-date and return checks remain.
- The Owner has a read-only Equipment overview. Each equipment group shows total, available, rented and under-repair quantities. Rented counts deployed items not yet returned; available is physical serviceable stock less rented units. Future reservations remain on hand until deployment, while booking availability continues to honor reservation holds.
- The interface uses a light violet, pink and blue palette.
