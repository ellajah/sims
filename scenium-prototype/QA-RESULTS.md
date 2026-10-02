# Separated-file revision checks

The actual index.html was opened through file:// in JSDOM with local resource loading enabled. No server was used.

Passed checks:
- External styles.css and script.js load from the same folder.
- New customer registration saves the entered full name.
- The welcome heading displays the full registered name immediately and after later sign-in.
- A new customer sees their own records only.
- A new booking flows from the registered customer to Owner approval.
- Customer payment submission flows to Corporate Secretary verification.
- All 21 role-specific staff routes render.
- The website contains no guide links, guide markup, guide scripts or demonstration login-details panel.

The underlying role, inventory, booking and payment logic is retained from the previous checked revision. No server, module loader, external font or network asset is required.

Limitations: these are DOM and data-flow checks. Pixel layout and native print/file-picker behavior have not been visually verified in a full browser. File-based persistent storage depends on browser support; an in-memory fallback supports the same-tab workflow when persistence is unavailable. Payments and e-mails remain simulations.


## October 2 requested changes

JavaScript syntax and targeted execution checks passed: readiness requires inspection and approval, preserves reserved quantities and totals, records history/notifications, and enables deployment. The Owner equipment overview renders all three statuses and denies other roles. These targeted checks used a Node execution harness with UI stubs; visual browser verification was not available.
