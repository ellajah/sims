/* Scenium Entertainment — browser-only functional prototype.
   Edit these named sections to extend the existing project.
   Classic JavaScript: no modules, fetch requests, server or build step. */

// ==================== BROWSER STORAGE ====================

// Storage is optional: local files remain functional if persistent storage is denied.
function makeMemoryStore() {
  const values = new Map();
  return {
    persistent: false,
    getItem: (k) => values.get(k) || null,
    setItem: (k, v) => values.set(k, String(v)),
    removeItem: (k) => values.delete(k),
  };
}
function optionalStorage(name) {
  try {
    const storage = window[name];
    const key = "scenium-storage-check";
    storage.setItem(key, "1");
    storage.removeItem(key);
    return {
      persistent: true,
      getItem: (k) => storage.getItem(k),
      setItem: (k, v) => storage.setItem(k, v),
      removeItem: (k) => storage.removeItem(k),
    };
  } catch {
    return makeMemoryStore();
  }
}
window.AppStorage = optionalStorage("localStorage");
window.SessionStore = optionalStorage("sessionStorage");

// ==================== DATA AND VALIDATION ====================

/* Shared browser-only data model. Replace this layer with an authenticated API for production. */
window.SC = (() => {
  const KEY = "scenium.prototype.v1";
  const roles = [
    "Customer",
    "Owner",
    "Corporate Secretary",
    "Event Staff",
    "Maintenance Staff",
  ];
  const date = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const seed = () => ({
    version: 1,
    users: [
      {
        id: "U1",
        name: "Alex Santos",
        email: "customer@scenium.test",
        password: "Scenium123!",
        role: "Customer",
        phone: "09171234567",
        active: true,
      },
      {
        id: "U2",
        name: "Elfren Uy",
        email: "owner@scenium.test",
        password: "Scenium123!",
        role: "Owner",
        phone: "09170000002",
        active: true,
      },
      {
        id: "U3",
        name: "Mariella Uy",
        email: "secretary@scenium.test",
        password: "Scenium123!",
        role: "Corporate Secretary",
        phone: "09170000003",
        active: true,
      },
      {
        id: "U4",
        name: "Miguel Reyes",
        email: "event@scenium.test",
        password: "Scenium123!",
        role: "Event Staff",
        phone: "09170000004",
        active: true,
      },
      {
        id: "U5",
        name: "Carlo Cruz",
        email: "maintenance@scenium.test",
        password: "Scenium123!",
        role: "Maintenance Staff",
        phone: "09170000005",
        active: true,
      },
      {
        id: "U6",
        name: "Sam Rivera",
        email: "sam@scenium.test",
        password: "Scenium123!",
        role: "Event Staff",
        phone: "09170000006",
        active: true,
      },
    ],
    staff: [
      { userId: "U4", status: "Available" },
      { userId: "U5", status: "Available" },
      { userId: "U6", status: "Available" },
    ],
    equipment: [
      {
        id: "EQ01",
        name: "Digital audio mixer",
        category: "Mixers",
        qty: 4,
        maintenance: 0,
        rate: 1800,
        notes: "Inspect faders and inputs before dispatch.",
      },
      {
        id: "EQ02",
        name: "LED display screen",
        category: "Screens",
        qty: 6,
        maintenance: 1,
        rate: 3500,
        notes: "Panel and cable inspection required.",
      },
      {
        id: "EQ03",
        name: "Wireless microphone",
        category: "Microphones",
        qty: 12,
        maintenance: 0,
        rate: 500,
        notes: "Check batteries before the event.",
      },
      {
        id: "EQ04",
        name: "Moving head light",
        category: "Lights",
        qty: 16,
        maintenance: 2,
        rate: 1200,
        notes: "Inspect safety cables.",
      },
      {
        id: "EQ05",
        name: "Powered speaker",
        category: "Sounds",
        qty: 10,
        maintenance: 0,
        rate: 1500,
        notes: "Check audio and power cables.",
      },
      {
        id: "EQ06",
        name: "Modular stage platform",
        category: "Stages",
        qty: 12,
        maintenance: 0,
        rate: 1000,
        notes: "Inspect locks and support legs.",
      },
    ],
    bookings: [
      {
        id: "BK1001",
        customerId: "U1",
        title: "Santos wedding reception",
        type: "Wedding",
        date: date(14),
        start: "16:00",
        end: "22:00",
        venue: "Quezon City",
        guests: 120,
        notes: "Warm lighting for the reception.",
        items: [
          { id: "EQ01", qty: 1, rate: 1800 },
          { id: "EQ03", qty: 2, rate: 500 },
          { id: "EQ04", qty: 4, rate: 1200 },
          { id: "EQ05", qty: 2, rate: 1500 },
        ],
        total: 10600,
        status: "Approved",
        gear: "Reserved",
        created: date(-4),
        history: [{ text: "Booking approved", date: date(-3) }],
      },
      {
        id: "BK1002",
        customerId: "U1",
        title: "Community awards night",
        type: "Corporate",
        date: date(21),
        start: "17:00",
        end: "21:00",
        venue: "Caloocan City",
        guests: 80,
        notes: "Two wireless microphones for hosts.",
        items: [
          { id: "EQ01", qty: 1, rate: 1800 },
          { id: "EQ03", qty: 2, rate: 500 },
          { id: "EQ05", qty: 2, rate: 1500 },
        ],
        total: 5800,
        status: "Pending",
        gear: "Reserved",
        created: date(-1),
        history: [{ text: "Booking submitted", date: date(-1) }],
      },
      {
        id: "BK1003",
        customerId: "U1",
        title: "Acoustic evening",
        type: "Private event",
        date: date(-10),
        start: "18:00",
        end: "22:00",
        venue: "Quezon City",
        guests: 60,
        notes: "",
        items: [
          { id: "EQ01", qty: 1, rate: 1800 },
          { id: "EQ03", qty: 2, rate: 500 },
          { id: "EQ05", qty: 2, rate: 1500 },
        ],
        total: 5800,
        status: "Completed",
        gear: "Returned",
        created: date(-25),
        history: [
          {
            text: "Event completed; equipment returned",
            date: date(-10),
          },
        ],
      },
      {
        id: "BK1004",
        customerId: "U1",
        title: "Company celebration",
        type: "Corporate",
        date: date(-42),
        start: "15:00",
        end: "21:00",
        venue: "Caloocan City",
        guests: 150,
        notes: "",
        items: [
          { id: "EQ02", qty: 2, rate: 3500 },
          { id: "EQ05", qty: 2, rate: 1500 },
        ],
        total: 10000,
        status: "Completed",
        gear: "Returned",
        created: date(-55),
        history: [{ text: "Event completed", date: date(-42) }],
      },
    ],
    payments: [
      {
        id: "PY1001",
        bookingId: "BK1001",
        amount: 5300,
        method: "GCash",
        reference: "SAMPLE-1001",
        date: date(-3),
        status: "Verified",
        proof: "",
        note: "Seeded demonstration payment.",
      },
      {
        id: "PY1002",
        bookingId: "BK1003",
        amount: 5800,
        method: "Bank transfer",
        reference: "SAMPLE-1002",
        date: date(-10),
        status: "Verified",
        proof: "",
        note: "",
      },
      {
        id: "PY1003",
        bookingId: "BK1004",
        amount: 10000,
        method: "Cash",
        reference: "SAMPLE-1003",
        date: date(-42),
        status: "Verified",
        proof: "",
        note: "",
      },
    ],
    assignments: [
      {
        id: "AS1001",
        bookingId: "BK1001",
        userId: "U4",
        duty: "Sound setup and operation",
      },
    ],
    feedback: [],
    notifications: [
      {
        id: "NT1001",
        to: "U1",
        subject: "Booking approved • BK1001",
        body: "Your wedding reception booking is approved. You can now submit payment information.",
        date: date(-3),
        read: false,
      },
    ],
    logs: [],
  });
  function load() {
    const raw = AppStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      AppStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    const s = JSON.parse(raw);
    if (
      s.version !== 1 ||
      !Array.isArray(s.users) ||
      !Array.isArray(s.bookings)
    )
      throw Error(
        "Saved demo data could not be read. Reset this prototype’s browser data using the instructions supplied with it.",
      );
    return s;
  }
  function save(s) {
    AppStorage.setItem(KEY, JSON.stringify(s));
  }
  const id = (p) =>
    p +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).slice(2, 5).toUpperCase();
  const money = (n) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(n);
  const esc = (x) =>
    String(x ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const active = (b) => ["Pending", "Approved"].includes(b.status);
  const overlap = (a, b) =>
    a.date === b.date && a.start < b.end && a.end > b.start;
  function paid(s, bid) {
    return s.payments
      .filter((p) => p.bookingId === bid && p.status === "Verified")
      .reduce((a, p) => a + p.amount, 0);
  }
  function balance(s, b) {
    return Math.max(0, b.total - paid(s, b.id));
  }
  function paymentStatus(s, b) {
    const n = paid(s, b.id);
    return n >= b.total ? "Paid" : n > 0 ? "Downpayment" : "Unpaid";
  }
  function available(s, e, slot, except) {
    const reserved = s.bookings
      .filter(
        (b) =>
          b.id !== except &&
          b.gear !== "Returned" &&
          active(b) &&
          (!slot || overlap(b, slot)),
      )
      .reduce((n, b) => n + (b.items.find((i) => i.id === e.id)?.qty || 0), 0);
    return Math.max(0, e.qty - e.maintenance - reserved);
  }
  function validateBooking(s, b, except, lead = true) {
    if (
      !b.title.trim() ||
      !b.venue.trim() ||
      !b.date ||
      !b.start ||
      !b.end ||
      !(b.guests > 0)
    )
      throw Error("Complete the event name, venue, schedule and guest count.");
    if (b.start >= b.end)
      throw Error(
        "End time must be later than start time. Split overnight events into separate daytime bookings.",
      );
    if (lead && b.date < date(7))
      throw Error("Please choose an event date at least 7 days from today.");
    if (s.bookings.some((x) => x.id !== except && active(x) && overlap(x, b)))
      throw Error("This time slot is occupied. Choose another date or time.");
    if (!b.items.length) throw Error("Select at least one equipment item.");
    for (const i of b.items) {
      const e = s.equipment.find((e) => e.id === i.id);
      if (
        !e ||
        !Number.isInteger(i.qty) ||
        i.qty < 1 ||
        i.qty > available(s, e, b, except)
      )
        throw Error(
          `${e?.name || "Equipment"} does not have enough available units for this schedule.`,
        );
    }
  }
  function notify(s, to, subject, body) {
    s.notifications.unshift({
      id: id("NT"),
      to,
      subject,
      body,
      date: date(),
      read: false,
    });
  }
  function notifyManagers(s, subject, body) {
    s.users
      .filter(
        (u) => ["Owner", "Corporate Secretary"].includes(u.role) && u.active,
      )
      .forEach((u) => notify(s, u.id, subject, body));
  }
  function history(b, text) {
    b.history.push({ text, date: date() });
  }
  function audit(s, actor, text) {
    s.logs.unshift({
      id: id("LG"),
      actor,
      text,
      date: new Date().toLocaleString(),
    });
  }
  function user(portal) {
    const uid = SessionStore.getItem("scenium.session." + portal);
    return load().users.find((u) => u.id === uid && u.active) || null;
  }
  function login(email, password, portal) {
    const u = load().users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password &&
        u.active,
    );
    if (!u)
      throw Error("Invalid email or password, or this account is inactive.");
    if ((portal === "customer") !== (u.role === "Customer"))
      throw Error(
        "This account belongs to the other website. Please use the correct sign-in page.",
      );
    SessionStore.setItem("scenium.session." + portal, u.id);
    return u;
  }
  function validateUser(s, u, except) {
    if (
      !u.name.trim() ||
      !/^\S+@\S+\.\S+$/.test(u.email) ||
      !/^\+?[\d\s()-]{10,16}$/.test(u.phone)
    )
      throw Error(
        "Enter a name, valid email and a 10–16 character phone number.",
      );
    if (
      s.users.some(
        (x) =>
          x.id !== except && x.email.toLowerCase() === u.email.toLowerCase(),
      )
    )
      throw Error("An account with this email already exists.");
    if (u.password.length < 8)
      throw Error("Use at least 8 characters for the password.");
  }
  function csv(rows, name) {
    const clean = (x) => {
      let v = String(x ?? "");
      if (/^[=+@-]/.test(v)) v = "'" + v;
      return '"' + v.replace(/"/g, '""') + '"';
    };
    download(
      rows.map((r) => r.map(clean).join(",")).join("\r\n"),
      name,
      "text/csv;charset=utf-8",
    );
  }
  function download(content, name, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return {
    KEY,
    roles,
    date,
    seed,
    load,
    save,
    id,
    money,
    esc,
    active,
    overlap,
    paid,
    balance,
    paymentStatus,
    available,
    validateBooking,
    notify,
    notifyManagers,
    history,
    audit,
    user,
    login,
    validateUser,
    csv,
    download,
  };
})();

// ==================== SHARED UI AND AUTHENTICATION ====================

window.UI = (() => {
  const { esc: E } = SC;
  const badge = (t) =>
    `<span class="badge ${E(t.toLowerCase().replaceAll(" ", "-"))}">${E(t)}</span>`;
  const brand = `<span class="mark">s.</span><span>scenium<small>ENTERTAINMENT</small></span>`;
  const money = SC.money;
  function toast(text, error = false) {
    document.querySelector(".toast")?.remove();
    const n = document.createElement("div");
    n.className = "toast" + (error ? " error" : "");
    n.setAttribute("role", "status");
    n.textContent = text;
    document.body.append(n);
    setTimeout(() => n.remove(), 5000);
  }
  function modal(title, html) {
    document.querySelector("dialog")?.remove();
    const d = document.createElement("dialog");
    d.innerHTML = `<div class="dialog-head"><h2>${E(title)}</h2><button class="secondary small" aria-label="Close dialog" data-close>Close</button></div><div class="dialog-body">${html}<p id="modal-error" class="notice error hidden" role="alert"></p></div>`;
    document.body.append(d);
    d.querySelector("[data-close]").onclick = () => d.close();
    d.addEventListener("click", (e) => {
      if (e.target === d) {
        const r = d.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          d.close();
      }
    });
    d.showModal();
    return d;
  }
  function close() {
    document.querySelector("dialog")?.close();
  }
  function error(e) {
    const el =
      document.querySelector("dialog[open] #modal-error") ||
      document.querySelector("#form-error");
    if (el) {
      el.textContent = e.message || String(e);
      el.classList.remove("hidden");
      el.scrollIntoView({ block: "nearest" });
    } else toast(e.message || String(e), true);
  }
  function field(label, name, value = "", type = "text", extra = "") {
    return `<label>${E(label)}<input name="${name}" type="${type}" value="${E(value)}" ${extra}></label>`;
  }
  function select(label, name, options, value = "", extra = "") {
    return `<label>${E(label)}<select name="${name}" ${extra}>${options
      .map((o) => {
        const [v, t] = Array.isArray(o) ? o : [o, o];
        return `<option value="${E(v)}" ${v === value ? "selected" : ""}>${E(t)}</option>`;
      })
      .join("")}</select></label>`;
  }
  function table(heads, rows) {
    return rows.length
      ? `<div class="table-wrap"><table><thead><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
      : `<div class="card empty">No records match this view.</div>`;
  }
  const metric = (label, value, note = "") =>
    `<div class="metric"><span>${E(label)}</span><strong>${E(value)}</strong><small>${E(note)}</small></div>`;
  const formatDate = (d) =>
    new Date(d + "T12:00:00").toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  function details(s, b) {
    const customer = s.users.find((u) => u.id === b.customerId);
    return `<div class="row between"><div><span class="eyebrow">${E(b.id)}</span><h2 style="margin:8px 0">${E(b.title)}</h2><p class="muted">${E(customer?.name)} · ${E(customer?.email)}</p></div>${badge(b.status)}</div><div class="grid"><div><small class="muted">EVENT SCHEDULE</small><p>${formatDate(b.date)}<br>${E(b.start)} – ${E(b.end)}</p></div><div><small class="muted">VENUE / GUESTS</small><p>${E(b.venue)}<br>${b.guests} guests · ${E(b.type)}</p></div></div>${b.notes ? `<p class="notice">${E(b.notes)}</p>` : ""}<h3>Equipment selection</h3>${table(
      ["Equipment", "Quantity", "Amount"],
      b.items.map((i) => [
        E(s.equipment.find((e) => e.id === i.id)?.name),
        i.qty,
        money(i.qty * i.rate),
      ]),
    )}<div class="summary-line"><span>Booking total</span><strong>${money(b.total)}</strong></div><div class="summary-line"><span>Verified payments</span><strong>${money(SC.paid(s, b.id))}</strong></div><div class="summary-line summary-total"><span>Outstanding balance</span><span>${money(SC.balance(s, b))}</span></div><div class="row">${badge(SC.paymentStatus(s, b))}${badge(b.gear)}</div><h3>Activity</h3><div class="timeline">${b.history.map((h) => `<p>${E(h.text)}<small>${formatDate(h.date)}</small></p>`).join("")}</div>`;
  }
  function receipt(s, b) {
    modal(
      "Booking & payment receipt",
      `<div class="brand" style="margin-bottom:25px">${brand}</div><p class="notice">Demonstration receipt · Not proof of an actual payment.</p>${details(s, b)}<h3>Verified payment records</h3>${table(
        ["Reference", "Method", "Received", "Amount"],
        s.payments
          .filter((p) => p.bookingId === b.id && p.status === "Verified")
          .map((p) => [
            E(p.reference),
            E(p.method),
            formatDate(p.date),
            money(p.amount),
          ]),
      )}<button style="margin-top:20px" onclick="window.print()">Print / Save as PDF</button>`,
    );
  }
  function notifications(s, u) {
    const ns = s.notifications.filter((n) => n.to === u.id);
    return `<div class="section-head"><h1>Notifications</h1><p>Booking, payment and assignment updates.</p></div><p class="notice">E-mail delivery is simulated. Open any message to preview the e-mail that would be sent.</p><div class="stack">${ns.length ? ns.map((n) => `<button class="card secondary" style="text-align:left;justify-content:space-between" data-notification="${n.id}"><span><strong>${E(n.subject)}</strong><small style="display:block;margin-top:6px">${formatDate(n.date)} · ${n.read ? "Read" : "Unread"}</small></span><span>View</span></button>`).join("") : '<div class="card empty">You’re all caught up. New activity will appear here.</div>'}</div>`;
  }
  function bindNotifications(render) {
    document.querySelectorAll("[data-notification]").forEach(
      (el) =>
        (el.onclick = () => {
          const s = SC.load(),
            n = s.notifications.find((n) => n.id === el.dataset.notification);
          n.read = true;
          SC.save(s);
          render();
          const u = s.users.find((u) => u.id === n.to);
          modal(
            n.subject,
            `<p class="muted">To: ${E(u?.email)}<br>Delivery: simulated e-mail preview</p><p>${E(n.body)}</p>`,
          );
        }),
    );
  }
  function auth(portal, onSuccess) {
    const staff = portal === "staff";
    document.querySelector("#app").innerHTML =
      `<div class="auth-page"><aside class="auth-art"><a class="brand" href="#customer/home">${brand}</a><div><p class="eyebrow">${staff ? "OPERATIONS & RESOURCE MANAGEMENT" : "SOUND · LIGHT · STAGE"}</p><h1>${staff ? "Every detail.<br>One workspace." : "Your event.<br>Our expertise."}</h1><p>${staff ? "Keep bookings, people and equipment working together." : "Plan the sound, lighting and stage for your next memorable event."}</p></div><div class="auth-quote"><span class="big-index">${staff ? "01—08" : "LET’S GO"}</span><p>${staff ? "From first booking to the final encore." : "Scenium Technical Entertainment Sound and Light Rental"}</p></div></aside><section class="auth-form"><div><p class="eyebrow">${staff ? "TEAM PORTAL" : "CUSTOMER WEBSITE"}</p><h1 id="auth-title">Welcome back.</h1><p class="muted" id="auth-sub">Sign in to ${staff ? "your workspace" : "manage your events"}.</p><div id="auth-fields"></div><p id="form-error" class="notice error hidden" role="alert"></p><p class="auth-foot">${staff ? '<a href="#customer/home">Go to customer website</a>' : '<button id="auth-toggle" class="secondary small">Create a customer account</button>'}</p></div></section></div>`;
    let registering = false;
    const form = () => {
      document.querySelector("#auth-title").textContent = registering
        ? "Create your account."
        : "Welcome back.";
      document.querySelector("#auth-fields").innerHTML =
        `<form id="auth-form">${registering ? field("Full name", "name", "", "text", 'required maxlength="100" autocomplete="name"') + field("Mobile number", "phone", "", "tel", 'required maxlength="16" autocomplete="tel"') : ""}${field("Email address", "email", "", "email", 'required autocomplete="username"')}${field("Password", "password", "", "password", 'required minlength="8" autocomplete="' + (registering ? "new-password" : "current-password") + '"')}${registering ? field("Confirm password", "confirm", "", "password", 'required minlength="8" autocomplete="new-password"') : ""}<button class="lime" type="submit">${registering ? "Create account" : "Sign in"}</button></form>`;
      document.querySelector("#auth-form").onsubmit = (e) => {
        e.preventDefault();
        try {
          const d = Object.fromEntries(new FormData(e.target));
          if (registering) {
            if (d.password !== d.confirm)
              throw Error("Passwords do not match.");
            const s = SC.load(),
              u = {
                id: SC.id("U"),
                name: d.name.trim(),
                email: d.email.trim().toLowerCase(),
                phone: d.phone.trim(),
                password: d.password,
                role: "Customer",
                active: true,
              };
            SC.validateUser(s, u);
            s.users.push(u);
            SC.notify(
              s,
              u.id,
              "Welcome to Scenium",
              "Your customer account has been created. You can now submit a booking request.",
            );
            SC.save(s);
            UI.toast("Account created successfully.");
          }
          SC.login(d.email, d.password, portal);
          onSuccess();
        } catch (e) {
          error(e);
        }
      };
    };
    form();
    document.querySelector("#auth-toggle")?.addEventListener("click", (e) => {
      registering = !registering;
      e.target.textContent = registering
        ? "Already registered? Sign in"
        : "Create a customer account";
      document.querySelector("#form-error").classList.add("hidden");
      form();
    });
  }
  return {
    E,
    badge,
    brand,
    money,
    toast,
    modal,
    close,
    error,
    field,
    select,
    table,
    metric,
    formatDate,
    details,
    receipt,
    notifications,
    bindNotifications,
    auth,
  };
})();

// ==================== CUSTOMER FUNCTIONS ====================

/* Customer-facing website. The staff interface is a separate entry point. */
window.createCustomerApp = () => {
  const { E, badge, money, field, select, table, formatDate } = UI;
  const bundles = {
    essentials: {
      name: "Sound essentials",
      items: { EQ01: 1, EQ03: 2, EQ05: 2 },
    },
    celebration: {
      name: "Celebration",
      items: { EQ01: 1, EQ03: 2, EQ04: 4, EQ05: 2 },
    },
    production: {
      name: "Full production",
      items: { EQ01: 1, EQ02: 2, EQ03: 4, EQ04: 6, EQ05: 4, EQ06: 4 },
    },
  };
  let chosen = "custom";
  function route() {
    return location.hash.split("/")[1] || "home";
  }
  function shell(content, r, u) {
    return `<header class="site-header"><a class="brand" href="#customer/home">${UI.brand}</a><nav aria-label="Customer navigation"><a class="${r === "home" ? "active" : ""}" href="#customer/home">Overview</a><a class="${r === "book" ? "active" : ""}" href="#customer/book">Book an event</a><a class="${r === "bookings" ? "active" : ""}" href="#customer/bookings">My bookings</a>${u ? `<a class="${r === "notifications" ? "active" : ""}" href="#customer/notifications">Notifications ${SC.load().notifications.filter((n) => n.to === u.id && !n.read).length || ""}</a><button class="small ghost" id="logout">Sign out</button>` : '<a href="#customer/login">Sign in</a>'}</nav></header><main class="customer-main">${content}</main><footer class="footer"><span>Scenium Technical Entertainment Sound and Light Rental<br>Blk 6 Lot 12 Dahlia, Barangay 175 Camarin, Caloocan City</span><span>Sound · Lighting · Screens · Staging<br><a href="#staff/dashboard">Staff portal</a></span></footer><button class="chat-toggle" id="chat-toggle">? &nbsp; Ask Scenium</button><section id="chat-box" class="card chat-box hidden" aria-label="Frequently asked questions"><div class="row between"><h3 style="margin:0">How can we help?</h3><button class="small secondary" id="chat-close">Close</button></div><p class="muted" style="font-size:.8rem;margin-top:8px">Quick answers from our FAQ.</p>${["How do I book?", "What equipment is available?", "How do payments work?", "Can I cancel?"].map((q, i) => `<button class="secondary small" data-faq="${i}">${q}</button>`).join("")}<div class="chat-answer" id="chat-answer">Choose a question above.</div></section>`;
  }
  function home(s, u) {
    return `<section class="hero"><div><div class="eyebrow">SCENIUM / EVENT PRODUCTION</div>${u ? `<h1 class="user-welcome">Welcome, <span class="accent">${E(u.name)}</span>.</h1><p>Plan your next event, manage your bookings and follow your updates, all in one place.</p>` : `<h1>Set the stage.<br><span class="accent">Make it memorable.</span></h1><p>Sound, lighting, screens and staging, brought together for your event.</p>`}<div class="row"><a class="btn lime" href="#customer/book">Plan your event</a><a class="btn ghost" href="#customer/bookings">${u ? "View my bookings" : "Manage a booking"}</a></div></div><div class="hero-aside"><p class="eyebrow">YOUR EVENT, COVERED</p><div class="line"><strong>01 / Sound</strong><span>Mixers · Mics · Speakers</span></div><div class="line"><strong>02 / Visuals</strong><span>Lights · LED screens</span></div><div class="line"><strong>03 / Stage</strong><span>Platforms · Event crew</span></div><p style="font-size:.8rem;margin-top:25px">Select a package or build your own equipment list. Request a date at least 7 days ahead.</p></div></section>${u ? `<div class="metrics">${UI.metric("Your bookings", s.bookings.filter((b) => b.customerId === u.id).length, "Linked to your account")}${UI.metric("Active bookings", s.bookings.filter((b) => b.customerId === u.id && SC.active(b)).length, "Pending and approved")}${UI.metric("Outstanding", money(s.bookings.filter((b) => b.customerId === u.id && ["Approved", "Completed"].includes(b.status)).reduce((a, b) => a + SC.balance(s, b), 0)), "Across approved events")}${UI.metric("Completed events", s.bookings.filter((b) => b.customerId === u.id && b.status === "Completed").length, "Share your experience")}</div>` : ""}<section class="content-section"><div class="row between section-head"><div><p class="eyebrow">CHOOSE YOUR STARTING POINT</p><h2>One event. Your kind of setup.</h2></div><span class="badge">Sample package pricing</span></div><div class="grid three">${Object.entries(
      bundles,
    )
      .map(
        ([k, p], i) =>
          `<article class="card package ${i === 1 ? "featured" : ""}"><div class="number">PACKAGE / 0${i + 1}</div><h2>${p.name}</h2><ul>${Object.entries(
            p.items,
          )
            .map(
              ([id, q]) =>
                `<li>${q} × ${E(s.equipment.find((e) => e.id === id).name)}</li>`,
            )
            .join(
              "",
            )}</ul><div class="price">${money(Object.entries(p.items).reduce((n, [id, q]) => n + s.equipment.find((e) => e.id === id).rate * q, 0))}</div><small class="muted">Equipment rental estimate per event</small><button class="${i === 1 ? "lime" : "secondary"}" style="width:100%;margin-top:20px" data-package="${k}">Choose ${p.name.toLowerCase()}</button></article>`,
      )
      .join("")}</div></section>`;
  }
  function bookingForm(s, u) {
    return `<div class="section-head"><p class="eyebrow">LET’S PLAN SOMETHING GREAT</p><h1>Build your event.</h1><p>Choose your schedule and equipment. Our owner will review your request.</p></div><form id="booking-form" class="booking-layout"><div class="stack"><section class="card"><span class="step-label">01 / EVENT DETAILS</span><div class="grid">${field("Event name", "title", "", "text", 'required maxlength="100" placeholder="e.g. Santos wedding reception"')}${select("Event type", "type", ["Wedding", "Birthday", "Corporate", "Concert", "Private event", "Community event"])}${field("Event date", "date", SC.date(8), "date", `required min="${SC.date(7)}"`)}${field("Expected guests", "guests", "100", "number", 'required min="1" max="100000" step="1"')}${field("Start time", "start", "16:00", "time", "required")}${field("End time", "end", "22:00", "time", "required")}<div class="full">${field("Venue / complete address", "venue", "", "text", 'required maxlength="250" placeholder="Venue, street, city"')}</div><label class="full">Event notes<textarea name="notes" maxlength="1000" placeholder="Tell us about setup requirements or special instructions."></textarea></label></div><p id="slot-info" class="notice" style="margin-top:18px"></p></section><section class="card"><span class="step-label">02 / EQUIPMENT</span>${select("Start from a package", "package", [["custom", "Custom selection"], ...Object.entries(bundles).map(([k, v]) => [k, v.name])], chosen)}<div id="equipment-inputs">${s.equipment.map((e) => `<label class="equipment-row"><span>${E(e.name)}<small>${E(e.category)} · ${money(e.rate)} / unit</small><small data-stock="${e.id}"></small></span><input aria-label="${E(e.name)} quantity" type="number" name="eq_${e.id}" value="${bundles[chosen]?.items[e.id] || 0}" min="0" max="${e.qty}" step="1"></label>`).join("")}</div></section></div><aside class="card sticky-card"><span class="step-label">03 / REVIEW REQUEST</span><h2>Your event estimate</h2><div id="booking-summary"></div><p class="notice">Prices are demonstration estimates, not an official quotation. No payment is collected when you submit this request.</p><p class="muted" style="font-size:.85rem">Contact: ${E(u.email)}<br>Minimum advance booking: 7 days.</p><label class="check-label"><input type="checkbox" required> I have reviewed my event details.</label><p id="form-error" class="notice error hidden" role="alert"></p><button class="lime" type="submit" style="width:100%;margin-top:18px">Submit booking request</button></aside></form>`;
  }
  function myBookings(s, u) {
    const bs = s.bookings
      .filter((b) => b.customerId === u.id)
      .sort((a, b) => b.date.localeCompare(a.date));
    return `<div class="row between section-head"><div><p class="eyebrow">YOUR EVENT WORKSPACE</p><h1>My bookings</h1><p>Follow your request, manage payments and review completed events.</p></div><a href="#customer/book" class="btn">New booking</a></div><div class="toolbar"><input id="search-bookings" aria-label="Search bookings" placeholder="Search event or booking number">${select("Status", "status", ["All statuses", "Pending", "Approved", "Completed", "Cancelled", "Rejected"])}</div><div id="booking-table">${bookingTable(s, bs)}</div>`;
  }
  function bookingTable(s, bs) {
    return table(
      ["Event", "Schedule", "Status", "Payment", ""],
      bs.map((b) => [
        `<strong>${E(b.title)}</strong><small>${b.id} · ${E(b.venue)}</small>`,
        `${formatDate(b.date)}<br><small>${b.start} – ${b.end}</small>`,
        badge(b.status),
        `${badge(SC.paymentStatus(s, b))}<small style="display:block;margin-top:5px">${money(SC.balance(s, b))} outstanding</small>`,
        `<button class="secondary small" data-booking="${b.id}">View details</button>`,
      ]),
    );
  }
  function openBooking(id) {
    const s = SC.load(),
      u = SC.user("customer"),
      b = s.bookings.find((b) => b.id === id && b.customerId === u?.id);
    if (!b) return;
    const hasFeedback = s.feedback.some((f) => f.bookingId === id);
    UI.modal(
      "Booking details",
      UI.details(s, b) +
        `<div class="row">${["Approved", "Completed"].includes(b.status) && SC.balance(s, b) > 0 ? `<button data-pay="${b.id}">Submit payment details</button>` : ""}<button class="secondary" data-receipt="${b.id}">View receipt</button>${["Pending", "Approved"].includes(b.status) && b.gear !== "Deployed" ? `<button class="danger" data-cancel="${b.id}">Cancel booking</button>` : ""}${b.status === "Completed" ? `<button class="lime" data-feedback="${b.id}">${hasFeedback ? "View feedback" : "Leave feedback"}</button>` : ""}</div><h3>Payment submissions</h3>${table(
          ["Method / reference", "Amount", "Review"],
          s.payments
            .filter((p) => p.bookingId === b.id)
            .map((p) => [
              `${E(p.method)}<br><small>${E(p.reference)}${p.note ? "<br>" + E(p.note) : ""}</small>`,
              money(p.amount),
              badge(p.status),
            ]),
        )}`,
    );
    document
      .querySelector("[data-pay]")
      ?.addEventListener("click", () => paymentModal(b.id));
    document.querySelector("[data-receipt]").onclick = () =>
      UI.receipt(SC.load(), b);
    document
      .querySelector("[data-cancel]")
      ?.addEventListener("click", () => cancelModal(b.id));
    document
      .querySelector("[data-feedback]")
      ?.addEventListener("click", () => feedbackModal(b.id));
  }
  function cancelModal(id) {
    UI.modal(
      "Cancel this booking?",
      `<p>The event will be removed from the active schedule and its reserved equipment and staff assignments will be released. Any recorded payments remain in the payment history; refunds must be arranged separately.</p><form id="cancel-form"><label>Reason<textarea name="reason" required maxlength="500"></textarea></label><button class="danger">Confirm cancellation</button></form>`,
    );
    document.querySelector("#cancel-form").onsubmit = (e) => {
      e.preventDefault();
      try {
        const s = SC.load(),
          b = s.bookings.find((b) => b.id === id),
          u = SC.user("customer");
        if (b.customerId !== u.id || !SC.active(b) || b.gear === "Deployed")
          throw Error("This booking can no longer be cancelled here.");
        b.status = "Cancelled";
        b.gear = "Released";
        SC.history(
          b,
          "Cancelled by customer: " + new FormData(e.target).get("reason"),
        );
        s.assignments = s.assignments.filter((a) => a.bookingId !== id);
        SC.notifyManagers(
          s,
          "Booking cancelled • " + id,
          b.title + " has been cancelled by the customer.",
        );
        SC.notify(
          s,
          u.id,
          "Cancellation confirmed • " + id,
          "Your booking has been cancelled. Contact the team regarding any recorded payment.",
        );
        SC.save(s);
        UI.close();
        render();
        UI.toast("Booking cancelled.");
      } catch (err) {
        UI.error(err);
      }
    };
  }
  function paymentModal(id) {
    const s = SC.load(),
      b = s.bookings.find((b) => b.id === id);
    UI.modal(
      "Submit payment information",
      `<p class="muted">${E(b.id)} · ${E(b.title)}<br>Verified balance: <strong>${money(SC.balance(s, b))}</strong></p><div class="grid"><form id="payment-form">${select("Payment method", "method", ["GCash", "Bank transfer", "Cash", "Check"])}${field("Amount (PHP)", "amount", SC.balance(s, b), "number", `required min="0.01" max="${SC.balance(s, b)}" step="0.01"`)}${field("Reference / receipt number", "reference", "", "text", 'required maxlength="80"')}${field("Payment date", "date", SC.date(), "date", `required max="${SC.date()}"`)}<label>Optional proof image<input name="proof" type="file" accept="image/png,image/jpeg,image/webp"><small>Use a sample image only. Maximum 500 KB.</small></label><button class="lime">Send for verification</button></form><div class="payment-qr"><strong id="qr-title">GCash</strong><img class="qr" id="qr-image" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMiAtMTIgMTc0IDE3NCI+PHJlY3QgeD0iLTEyIiB5PSItMTIiIHdpZHRoPSIxNzQiIGhlaWdodD0iMTc0IiBmaWxsPSJ3aGl0ZSIvPjxnIGZpbGw9IiMxNDIxMmIiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMiIgeT0iMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNDIiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2MCIgeT0iMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjcyIiB5PSIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iOTAiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMDIiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMzIiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2IiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIiIHk9IjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIzNiIgeT0iNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjQyIiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjYiIHk9IjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI3MiIgeT0iNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijk2IiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTAyIiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTI2IiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTMyIiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIyNCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIzMCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI1NCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2MCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI4NCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5MCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMTQiIHk9IjE4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIwIiB5PSIxOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjI0IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjM2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjU0IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjY2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijk2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjExNCIgeT0iMjQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjYiIHk9IjI0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTQ0IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjAiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMzAiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNDIiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjAiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNzIiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iOTAiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTAyIiB5PSIzMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyMCIgeT0iMzAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMzIiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIzNiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI0MiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2NiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI3MiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5NiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMDIiIHk9IjM2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTI2IiB5PSIzNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEzMiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIwIiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjI0IiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjU0IiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjYwIiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjkwIiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjExNCIgeT0iNDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTQ0IiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjYiIHk9IjU0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9IjU0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMzYiIHk9IjU0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSI1NCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyNiIgeT0iNTQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxNDQiIHk9IjU0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMCIgeT0iNjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMiIgeT0iNjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIzMCIgeT0iNjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI0MiIgeT0iNjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMDIiIHk9IjYwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIwIiB5PSI2MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEzMiIgeT0iNjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2IiB5PSI2NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyIiB5PSI2NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjM2IiB5PSI2NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjQyIiB5PSI2NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEwMiIgeT0iNjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjYiIHk9IjY2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTMyIiB5PSI2NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjAiIHk9Ijc4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9Ijc4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMzAiIHk9Ijc4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSI3OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyMCIgeT0iNzgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxNDQiIHk9Ijc4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNiIgeT0iODQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIyNCIgeT0iODQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIzNiIgeT0iODQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMTQiIHk9Ijg0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTI2IiB5PSI4NCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iODQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIwIiB5PSI5MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyIiB5PSI5MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSI5MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjQyIiB5PSI5MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEwMiIgeT0iOTAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjkwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTMyIiB5PSI5MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjYiIHk9Ijk2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIiIHk9Ijk2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMzYiIHk9Ijk2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNDIiIHk9Ijk2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTAyIiB5PSI5NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyNiIgeT0iOTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMzIiIHk9Ijk2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMCIgeT0iMTA4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9IjEwOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSIxMDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI1NCIgeT0iMTA4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjAiIHk9IjEwOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSIxMDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5MCIgeT0iMTA4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSIxMDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjEwOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iMTA4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNiIgeT0iMTE0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9IjExNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjM2IiB5PSIxMTQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI1NCIgeT0iMTE0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjYiIHk9IjExNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSIxMTQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5NiIgeT0iMTE0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSIxMTQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjYiIHk9IjExNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iMTE0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMCIgeT0iMTIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIiIHk9IjEyMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSIxMjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI0MiIgeT0iMTIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjAiIHk9IjEyMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjcyIiB5PSIxMjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5MCIgeT0iMTIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTAyIiB5PSIxMjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjEyMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEzMiIgeT0iMTIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNiIgeT0iMTI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIiIHk9IjEyNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjM2IiB5PSIxMjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI0MiIgeT0iMTI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjYiIHk9IjEyNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjcyIiB5PSIxMjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5NiIgeT0iMTI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTAyIiB5PSIxMjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjYiIHk9IjEyNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEzMiIgeT0iMTI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMCIgeT0iMTM4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9IjEzOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSIxMzgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI1NCIgeT0iMTM4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjAiIHk9IjEzOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSIxMzgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5MCIgeT0iMTM4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSIxMzgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjEzOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iMTM4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNiIgeT0iMTQ0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9IjE0NCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjM2IiB5PSIxNDQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI1NCIgeT0iMTQ0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjYiIHk9IjE0NCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSIxNDQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5NiIgeT0iMTQ0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSIxNDQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjYiIHk9IjE0NCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iMTQ0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PC9nPjxyZWN0IHg9IjQ2IiB5PSI2MSIgd2lkdGg9IjYwIiBoZWlnaHQ9IjI1IiBmaWxsPSJ3aGl0ZSIvPjx0ZXh0IHg9Ijc1IiB5PSI4MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEzIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzE0MjEyYiI+U0FNUExFPC90ZXh0Pjwvc3ZnPg==" alt="Decorative sample payment QR. Not scannable."><span class="badge">SAMPLE ONLY · NOT SCANNABLE</span><p id="qr-note" style="font-size:.85rem;margin-top:14px">No money is transferred. Enter a sample reference number to demonstrate the payment workflow.</p><small>Only the Corporate Secretary verifies payment records.</small></div></div>`,
    );
    const f = document.querySelector("#payment-form");
    f.elements.method.onchange = () => {
      document.querySelector("#qr-title").textContent = f.elements.method.value;
      document
        .querySelector("#qr-image")
        .classList.toggle(
          "hidden",
          ["Cash", "Check"].includes(f.elements.method.value),
        );
    };
    f.onsubmit = async (e) => {
      e.preventDefault();
      const btn = f.querySelector("button");
      btn.disabled = true;
      try {
        const data = new FormData(f);
        let proof = "";
        const file = data.get("proof");
        if (file?.size) {
          if (
            file.size > 500000 ||
            !["image/png", "image/jpeg", "image/webp"].includes(file.type)
          )
            throw Error(
              "Choose a PNG, JPEG or WebP image smaller than 500 KB.",
            );
          proof = await new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = () => reject(Error("Cannot read the proof image."));
            r.readAsDataURL(file);
          });
        }
        const s = SC.load(),
          b = s.bookings.find((b) => b.id === id),
          amount = Math.round(Number(data.get("amount")) * 100) / 100;
        if (
          !["Approved", "Completed"].includes(b.status) ||
          b.customerId !== SC.user("customer").id
        )
          throw Error("This booking is not eligible for payment.");
        if (!(amount > 0) || amount > SC.balance(s, b))
          throw Error(
            "Amount must be positive and no more than the outstanding balance.",
          );
        const reserved = s.payments
          .filter((p) => p.bookingId === id && p.status === "Pending")
          .reduce((n, p) => n + p.amount, 0);
        if (amount + reserved > SC.balance(s, b))
          throw Error(
            "A payment is already awaiting verification. Wait for review before submitting more than the remaining unsubmitted balance.",
          );
        const ref = String(data.get("reference")).trim();
        if (!ref) throw Error("Enter a payment reference.");
        if (
          s.payments.some(
            (p) =>
              p.reference.toLowerCase() === ref.toLowerCase() &&
              p.status !== "Rejected",
          )
        )
          throw Error("This payment reference has already been used.");
        if (data.get("date") > SC.date())
          throw Error("Payment date cannot be in the future.");
        s.payments.unshift({
          id: SC.id("PY"),
          bookingId: id,
          amount,
          method: data.get("method"),
          reference: ref,
          date: data.get("date"),
          status: "Pending",
          proof,
          note: "",
        });
        SC.notifyManagers(
          s,
          "Payment awaiting verification • " + id,
          "A " + money(amount) + " payment was submitted for " + b.title + ".",
        );
        SC.notify(
          s,
          b.customerId,
          "Payment received for review • " + id,
          "Your payment details are awaiting Corporate Secretary verification.",
        );
        SC.save(s);
        UI.close();
        render();
        UI.toast("Payment information submitted for verification.");
      } catch (err) {
        UI.error(err);
        btn.disabled = false;
      }
    };
  }
  function feedbackModal(id) {
    const s = SC.load(),
      existing = s.feedback.find((f) => f.bookingId === id);
    if (existing) {
      UI.modal(
        "Your feedback",
        `<p>${"★".repeat(existing.rating)}${"☆".repeat(5 - existing.rating)}</p><p>${E(existing.comment)}</p><small>${formatDate(existing.date)}</small>`,
      );
      return;
    }
    UI.modal(
      "How was your event?",
      `<form id="feedback-form">${select("Rating", "rating", [
        [5, "5 — Excellent"],
        [4, "4 — Good"],
        [3, "3 — Average"],
        [2, "2 — Fair"],
        [1, "1 — Poor"],
      ])}<label>Your feedback<textarea name="comment" required minlength="5" maxlength="1000"></textarea></label><button class="lime">Submit feedback</button></form>`,
    );
    document.querySelector("#feedback-form").onsubmit = (e) => {
      e.preventDefault();
      try {
        const s = SC.load(),
          b = s.bookings.find((b) => b.id === id),
          u = SC.user("customer"),
          d = Object.fromEntries(new FormData(e.target));
        if (
          b.customerId !== u.id ||
          b.status !== "Completed" ||
          s.feedback.some((f) => f.bookingId === id)
        )
          throw Error("Feedback is only available once per completed booking.");
        if (d.comment.trim().length < 5)
          throw Error("Please write at least 5 characters.");
        s.feedback.push({
          id: SC.id("FB"),
          bookingId: id,
          customerId: u.id,
          rating: +d.rating,
          comment: d.comment.trim(),
          date: SC.date(),
        });
        SC.notifyManagers(
          s,
          "New event feedback • " + id,
          `${u.name} rated their event ${d.rating}/5.`,
        );
        SC.save(s);
        UI.close();
        render();
        UI.toast("Thank you for your feedback.");
      } catch (err) {
        UI.error(err);
      }
    };
  }
  function bindBookingForm() {
    const f = document.querySelector("#booking-form");
    if (!f) return;
    const summary = () => {
      const s = SC.load(),
        slot = {
          date: f.elements.date.value,
          start: f.elements.start.value,
          end: f.elements.end.value,
        };
      let total = 0;
      const items = s.equipment
        .map((e) => {
          const q = +f.elements["eq_" + e.id].value;
          document.querySelector(`[data-stock="${e.id}"]`).textContent =
            SC.available(s, e, slot) + " available for this schedule";
          total += q * e.rate;
          return q > 0
            ? `<div class="summary-line"><span>${q} × ${E(e.name)}</span><strong>${money(q * e.rate)}</strong></div>`
            : "";
        })
        .join("");
      document.querySelector("#booking-summary").innerHTML =
        (items ||
          '<p class="muted">Select equipment to see your estimate.</p>') +
        `<div class="summary-line summary-total"><span>Estimate</span><span>${money(total)}</span></div>`;
      const conflict = s.bookings.some(
        (b) => SC.active(b) && SC.overlap(b, slot),
      );
      const bad =
        f.elements.start.value >= f.elements.end.value ||
        f.elements.date.value < SC.date(7);
      const n = document.querySelector("#slot-info");
      n.className = "notice " + (conflict || bad ? "error" : "success");
      n.textContent = bad
        ? "Choose a date at least 7 days ahead and an end time after the start time."
        : conflict
          ? "This slot is occupied. Please choose another date or time."
          : "This time slot is currently available. Availability is checked again on submission.";
    };
    f.addEventListener("input", summary);
    f.elements.package.onchange = () => {
      chosen = f.elements.package.value;
      const s = SC.load();
      s.equipment.forEach(
        (e) =>
          (f.elements["eq_" + e.id].value = bundles[chosen]?.items[e.id] || 0),
      );
      summary();
    };
    summary();
    f.onsubmit = (e) => {
      e.preventDefault();
      try {
        const s = SC.load(),
          d = Object.fromEntries(new FormData(f)),
          u = SC.user("customer");
        if (!u) throw Error("Please sign in again.");
        const items = s.equipment
          .map((eq) => ({
            id: eq.id,
            qty: Number(d["eq_" + eq.id]),
            rate: eq.rate,
          }))
          .filter((i) => i.qty > 0);
        const b = {
          id: SC.id("BK"),
          customerId: u.id,
          title: d.title.trim(),
          type: d.type,
          date: d.date,
          start: d.start,
          end: d.end,
          venue: d.venue.trim(),
          guests: +d.guests,
          notes: d.notes.trim(),
          items,
          total: items.reduce((n, i) => n + i.qty * i.rate, 0),
          status: "Pending",
          gear: "Reserved",
          created: SC.date(),
          history: [],
        };
        SC.validateBooking(s, b);
        SC.history(b, "Booking request submitted");
        s.bookings.unshift(b);
        SC.notify(
          s,
          u.id,
          "Booking request received • " + b.id,
          "Your request for " + b.title + " is awaiting Owner approval.",
        );
        SC.notifyManagers(
          s,
          "New booking request • " + b.id,
          b.title + " is ready for review.",
        );
        SC.save(s);
        location.hash = "customer/bookings";
        UI.toast("Request submitted. You’ll receive an approval update.");
      } catch (err) {
        UI.error(err);
      }
    };
  }
  function bind() {
    document.querySelector("#logout")?.addEventListener("click", () => {
      SessionStore.removeItem("scenium.session.customer");
      location.hash = "customer/home";
      render();
    });
    document.querySelectorAll("[data-package]").forEach(
      (btn) =>
        (btn.onclick = () => {
          chosen = btn.dataset.package;
          location.hash = "customer/book";
        }),
    );
    document
      .querySelectorAll("[data-booking]")
      .forEach((btn) => (btn.onclick = () => openBooking(btn.dataset.booking)));
    bindBookingForm();
    UI.bindNotifications(render);
    const filter = () => {
      const s = SC.load(),
        u = SC.user("customer"),
        q = document.querySelector("#search-bookings").value.toLowerCase(),
        status = document.querySelector("[name=status]").value;
      const bs = s.bookings
        .filter(
          (b) =>
            b.customerId === u.id &&
            (status === "All statuses" || b.status === status) &&
            (b.title + " " + b.id).toLowerCase().includes(q),
        )
        .sort((a, b) => b.date.localeCompare(a.date));
      document.querySelector("#booking-table").innerHTML = bookingTable(s, bs);
      document
        .querySelectorAll("[data-booking]")
        .forEach(
          (btn) => (btn.onclick = () => openBooking(btn.dataset.booking)),
        );
    };
    document
      .querySelector("#search-bookings")
      ?.addEventListener("input", filter);
    document.querySelector("[name=status]")?.addEventListener("change", filter);
    document.querySelector("#chat-toggle").onclick = () =>
      document.querySelector("#chat-box").classList.toggle("hidden");
    document.querySelector("#chat-close").onclick = () =>
      document.querySelector("#chat-box").classList.add("hidden");
    const answers = [
      "Create a customer account, choose an event date at least 7 days ahead, select equipment and submit your request. The Owner will approve or reject the request.",
      "We offer mixers, screens, microphones, lights, sound systems and stage platforms. Select a package or choose individual quantities.",
      "After approval, submit payment details for GCash, bank transfer, cash or check. The Corporate Secretary verifies them. The QR shown here is a non-working sample.",
      "Open My bookings, choose View details and select Cancel booking. Cancellation is available before equipment is deployed. Recorded payments remain for manual follow-up.",
    ];
    document
      .querySelectorAll("[data-faq]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            (document.querySelector("#chat-answer").textContent =
              answers[+b.dataset.faq])),
      );
  }
  function render() {
    try {
      const r = route(),
        s = SC.load(),
        u = SC.user("customer");
      if ((r !== "home" && !u) || (r === "login" && !u)) {
        UI.auth("customer", () => {
          location.hash = "customer/" + (r === "login" ? "home" : r);
          render();
        });
        return;
      }
      const content =
        r === "book"
          ? bookingForm(s, u)
          : r === "bookings"
            ? myBookings(s, u)
            : r === "notifications"
              ? UI.notifications(s, u)
              : home(s, u);
      document.querySelector("#app").innerHTML = shell(content, r, u);
      bind();
    } catch (e) {
      document.querySelector("#app").innerHTML =
        `<div id="fatal" class="card"><h1>Unable to load saved data</h1><p>${E(e.message)}</p><p class="muted">Saved data could not be loaded. Follow the reset instructions supplied with this prototype.</p></div>`;
    }
  }
  return render;
};

// ==================== STAFF FUNCTIONS ====================

/* Internal website. Permissions follow the current sprint backlog. */
window.createStaffApp = () => {
  const { E, badge, money, field, select, table, formatDate } = UI;
  const menus = {
    Owner: [
      "dashboard",
      "bookings",
      "calendar",
      "equipmentOverview",
      "users",
      "reports",
      "notifications",
    ],
    "Corporate Secretary": [
      "dashboard",
      "bookings",
      "calendar",
      "payments",
      "customers",
      "staff",
      "notifications",
    ],
    "Event Staff": [
      "dashboard",
      "assignments",
      "availability",
      "notifications",
    ],
    "Maintenance Staff": [
      "dashboard",
      "equipment",
      "reservations",
      "notifications",
    ],
  };
  const names = {
    dashboard: "Overview",
    bookings: "Bookings",
    calendar: "Calendar",
    users: "User accounts",
    reports: "Reports & analytics",
    notifications: "Notifications",
    payments: "Payments",
    customers: "Customer records",
    staff: "Staff & dispatch",
    assignments: "My assignments",
    availability: "My availability",
    equipmentOverview: "Equipment overview",
    equipment: "Equipment inventory",
    reservations: "Equipment reservations",
  };
  const icons = {
    dashboard: "◫",
    bookings: "▤",
    calendar: "▦",
    users: "◎",
    reports: "▥",
    notifications: "◇",
    payments: "₱",
    customers: "◎",
    staff: "⊞",
    assignments: "▤",
    availability: "◷",
    equipmentOverview: "▧",
    equipment: "▧",
    reservations: "▣",
  };
  let month = new Date().getMonth(),
    year = new Date().getFullYear(),
    filters = { q: "", status: "All statuses" },
    reportFrom = SC.date(-90),
    reportTo = SC.date();
  const current = () => SC.user("staff");
  function requireRole(allowed) {
    const u = current();
    if (!u || !allowed.includes(u.role))
      throw Error("Your role cannot perform this action.");
    return u;
  }
  function commit(s, text) {
    const u = current();
    SC.audit(s, u.id, text);
    SC.save(s);
    UI.close();
    render();
    UI.toast(text);
  }
  function shell(content, r, u) {
    return `<div class="app-shell"><aside class="sidebar"><a class="brand" href="#staff/dashboard">${UI.brand}</a><div class="eyebrow">OPERATIONS WORKSPACE</div><nav aria-label="Staff navigation">${menus[u.role].map((m) => `<a href="#staff/${m}" class="${r === m ? "active" : ""}"><span class="nav-icon" aria-hidden="true">${icons[m]}</span>${names[m]}</a>`).join("")}</nav><div class="sidebar-bottom"><small>Scenium Entertainment</small><p style="font-size:.875rem;margin-top:10px">Ready for the next event.</p><a href="#customer/home" style="font-size:.8rem">Open customer website</a></div></aside><div class="app-body"><header class="staff-topbar"><span class="muted" style="font-size:.85rem">Workspace &nbsp; / &nbsp; <strong>${names[r]}</strong></span><div class="row"><span class="avatar">${E(
      u.name
        .split(" ")
        .map((x) => x[0])
        .slice(0, 2)
        .join(""),
    )}</span><span style="font-size:.85rem"><strong>${E(u.name)}</strong><small style="display:block" class="muted">${E(u.role)}</small></span><button id="logout" class="secondary small">Sign out</button></div></header><main class="staff-content">${content}</main></div></div>`;
  }
  function head(title, sub, action = "") {
    return `<div class="row between section-head"><div><p class="eyebrow">SCENIUM / OPERATIONS</p><h1>${title}</h1><p>${sub}</p></div>${action}</div>`;
  }
  function dashboard(s, u) {
    const upcoming = s.bookings
      .filter((b) => SC.active(b) && b.date >= SC.date())
      .sort((a, b) => a.date.localeCompare(b.date));
    let content = head(
      `Good ${new Date().getHours() < 12 ? "morning" : "day"}, ${E(u.name.split(" ")[0])}.`,
      "Here’s what’s happening across your workspace.",
    );
    if (u.role === "Event Staff") {
      const as = s.assignments.filter((a) => a.userId === u.id),
        st = s.staff.find((x) => x.userId === u.id);
      return (
        content +
        `<div class="metrics">${UI.metric("Availability", st.status, "Update your current duty status")}${UI.metric("Assignments", as.length, "Events linked to your account")}</div><div class="card"><h2>Your next assignments</h2>${assignmentTable(s, as)}<a class="btn" style="margin-top:20px" href="#staff/availability">Update availability</a></div>`
      );
    }
    if (u.role === "Maintenance Staff") {
      return (
        content +
        `<div class="metrics">${UI.metric("Equipment types", s.equipment.length, "Across the inventory")}${UI.metric(
          "Total units",
          s.equipment.reduce((n, e) => n + e.qty, 0),
          "Owned stock",
        )}${UI.metric(
          "Under maintenance",
          s.equipment.reduce((n, e) => n + e.maintenance, 0),
          "Unavailable for reservation",
        )}${UI.metric("Active reservations", s.bookings.filter((b) => SC.active(b) && b.gear !== "Returned").length, "Pending and approved events")}</div><div class="grid"><section class="card"><h2>Inspection priorities</h2>${
          s.equipment
            .filter((e) => e.maintenance > 0)
            .map(
              (e) =>
                `<div class="mini-item"><div><strong>${E(e.name)}</strong><small>${E(e.notes)}</small></div>${badge(e.maintenance + " in maintenance")}</div>`,
            )
            .join("") || '<p class="muted">No equipment under maintenance.</p>'
        }<a href="#staff/equipment" class="btn" style="margin-top:15px">Open inventory</a></section><section class="card"><h2>Upcoming equipment dispatch</h2>${upcoming
          .slice(0, 3)
          .map(
            (b) =>
              `<div class="mini-item"><div><strong>${E(b.title)}</strong><small>${formatDate(b.date)} · ${b.items.reduce((n, i) => n + i.qty, 0)} units</small></div>${badge(b.gear)}</div>`,
          )
          .join(
            "",
          )}<a href="#staff/reservations" class="btn secondary" style="margin-top:15px">View reservations</a></section></div>`
      );
    }
    content += `<div class="metrics">${UI.metric("Upcoming events", upcoming.length, "Pending and approved bookings")}${UI.metric("Awaiting approval", s.bookings.filter((b) => b.status === "Pending").length, "Owner review required")}${UI.metric("Verified collections", money(s.payments.filter((p) => p.status === "Verified").reduce((n, p) => n + p.amount, 0)), "All recorded payment dates")}${UI.metric("Available event staff", s.staff.filter((st) => st.status === "Available" && s.users.find((x) => x.id === st.userId)?.role === "Event Staff" && s.users.find((x) => x.id === st.userId)?.active).length, "Current availability status")}</div><div class="grid"><section class="card"><div class="row between"><h2>Coming up</h2><a href="#staff/calendar" style="font-size:.85rem">View calendar</a></div>${
      upcoming
        .slice(0, 4)
        .map(
          (b) =>
            `<div class="mini-item"><div><strong>${E(b.title)}</strong><small>${formatDate(b.date)} · ${b.start} · ${E(b.venue)}</small></div>${badge(b.status)}</div>`,
        )
        .join("") || '<p class="empty">No upcoming events.</p>'
    }</section><section class="card"><p class="eyebrow">ACTION CENTER</p><h2>Keep things moving.</h2><div class="mini-item"><div><strong>${s.bookings.filter((b) => b.status === "Pending").length} booking requests</strong><small>Check event details and equipment.</small></div><a class="btn secondary small" href="#staff/bookings">Review</a></div>${u.role === "Owner" ? `<div class="mini-item"><div><strong>Business performance</strong><small>Review collections and seasonal booking patterns.</small></div><a class="btn secondary small" href="#staff/reports">View</a></div>` : `<div class="mini-item"><div><strong>${s.payments.filter((p) => p.status === "Pending").length} payments to verify</strong><small>Review payment references and proof.</small></div><a class="btn secondary small" href="#staff/payments">Review</a></div><div class="mini-item"><div><strong>Event crew coordination</strong><small>Assign available staff to approved bookings.</small></div><a class="btn secondary small" href="#staff/staff">Assign</a></div>`}</section></div><section class="content-section"><div class="row between section-head"><h2>Recent bookings</h2><a href="#staff/bookings">View all bookings</a></div>${bookingTable(s, s.bookings.slice(0, 5))}</section>`;
    return content;
  }
  function bookingTable(s, bs) {
    return table(
      ["Booking / customer", "Event schedule", "Total", "Status", ""],
      bs.map((b) => [
        `<strong>${E(b.title)}</strong><small>${b.id} · ${E(s.users.find((u) => u.id === b.customerId)?.name)}</small>`,
        `${formatDate(b.date)}<br><small>${b.start} – ${b.end} · ${E(b.venue)}</small>`,
        money(b.total),
        badge(b.status),
        `<button class="secondary small" data-booking="${b.id}">Manage</button>`,
      ]),
    );
  }
  function bookings(s) {
    return (
      head(
        "Bookings",
        "Review event requests and keep booking information up to date.",
      ) +
      `<div class="toolbar"><input id="booking-search" placeholder="Search event, customer or booking ID" aria-label="Search bookings">${select("Status", "filter-status", ["All statuses", "Pending", "Approved", "Completed", "Rejected", "Cancelled"])}</div><div id="booking-table">${bookingTable(s, s.bookings)}</div>`
    );
  }
  function bookingModal(id) {
    requireRole(["Owner", "Corporate Secretary"]);
    const s = SC.load(),
      b = s.bookings.find((x) => x.id === id),
      u = current();
    UI.modal(
      "Manage booking",
      UI.details(s, b) +
        `<div class="row">${b.status === "Pending" && u.role === "Owner" ? `<button class="lime" data-status="Approved">Approve request</button><button class="danger" data-status="Rejected">Reject request</button>` : ""}${SC.active(b) ? `<button class="secondary" id="edit-booking">Edit event / schedule</button>` : ""}${b.status === "Approved" ? `<button id="complete-booking">Complete event</button>` : ""}${SC.active(b) && b.gear !== "Deployed" ? `<button class="danger" data-status="Cancelled">Cancel booking</button>` : ""}<button class="secondary" id="receipt">View receipt</button></div>`,
    );
    document.querySelector("#receipt").onclick = () => UI.receipt(s, b);
    document
      .querySelector("#edit-booking")
      ?.addEventListener("click", () => editBooking(id));
    document
      .querySelectorAll("[data-status]")
      .forEach(
        (btn) => (btn.onclick = () => statusModal(id, btn.dataset.status)),
      );
    document
      .querySelector("#complete-booking")
      ?.addEventListener("click", () => statusModal(id, "Completed"));
  }
  function statusModal(id, status) {
    const s = SC.load(),
      b = s.bookings.find((b) => b.id === id);
    UI.modal(
      `${status === "Approved" ? "Approve" : status === "Rejected" ? "Reject" : status === "Cancelled" ? "Cancel" : "Complete"} booking`,
      `<p>${E(b.title)} · ${id}</p><p class="muted">${status === "Completed" ? "The event must have ended and all equipment must be marked Returned by Maintenance Staff. Any unpaid balance remains visible." : status === "Approved" ? "The selected schedule and equipment availability will be checked again." : "Reserved equipment and staff assignments will be released. Any recorded payments remain for manual follow-up."}</p><form id="status-form"><label>${["Rejected", "Cancelled"].includes(status) ? "Reason (required)" : "Notes (optional)"}<textarea name="reason" maxlength="500" ${["Rejected", "Cancelled"].includes(status) ? "required" : ""}></textarea></label><button class="${status === "Approved" ? "lime" : ""}">Confirm ${status.toLowerCase()}</button></form>`,
    );
    document.querySelector("#status-form").onsubmit = (e) => {
      e.preventDefault();
      try {
        const u = requireRole(
            status === "Approved" || status === "Rejected"
              ? ["Owner"]
              : ["Owner", "Corporate Secretary"],
          ),
          s = SC.load(),
          b = s.bookings.find((x) => x.id === id),
          reason = new FormData(e.target).get("reason").trim();
        if (!SC.active(b)) throw Error("This booking is no longer active.");
        if (["Approved", "Rejected"].includes(status) && b.status !== "Pending")
          throw Error("Only pending requests can be approved or rejected.");
        if (["Rejected", "Cancelled"].includes(status) && !reason)
          throw Error("Enter a reason.");
        if (status === "Approved") SC.validateBooking(s, b, id, false);
        if (status === "Completed") {
          if (b.status !== "Approved" || b.gear !== "Returned")
            throw Error(
              "Maintenance Staff must mark the approved booking’s equipment Returned first.",
            );
          if (new Date(b.date + "T" + b.end) > new Date())
            throw Error("The event has not ended yet.");
        }
        if (status === "Cancelled" && b.gear === "Deployed")
          throw Error(
            "Return deployed equipment before cancelling this booking.",
          );
        b.status = status;
        if (["Rejected", "Cancelled"].includes(status)) {
          b.gear = "Released";
          s.assignments = s.assignments.filter((a) => a.bookingId !== id);
        }
        SC.history(b, status + " by " + u.role + (reason ? ": " + reason : ""));
        SC.notify(
          s,
          b.customerId,
          "Booking " + status.toLowerCase() + " • " + id,
          `${b.title} has been ${status.toLowerCase()}.${reason ? " " + reason : ""}`,
        );
        if (status === "Completed")
          SC.notify(
            s,
            b.customerId,
            "Share your event feedback • " + id,
            "Your event is complete. You can now leave feedback in My bookings.",
          );
        commit(s, "Booking " + status.toLowerCase() + ".");
      } catch (err) {
        UI.error(err);
      }
    };
  }
  function editBooking(id) {
    requireRole(["Owner", "Corporate Secretary"]);
    const s = SC.load(),
      b = s.bookings.find((b) => b.id === id);
    UI.modal(
      "Edit event details",
      `<form id="edit-booking-form"><div class="grid">${field("Event name", "title", b.title, "text", 'required maxlength="100"')}${field("Venue", "venue", b.venue, "text", 'required maxlength="250"')}${field("Event date", "date", b.date, "date", `required min="${SC.date()}"`)}${field("Guest count", "guests", b.guests, "number", 'required min="1" step="1"')}${field("Start time", "start", b.start, "time", "required")}${field("End time", "end", b.end, "time", "required")}<label class="full">Notes<textarea name="notes" maxlength="1000">${E(b.notes)}</textarea></label></div><p class="notice">Schedule changes are checked against bookings, equipment reservations and staff assignments. A simulated e-mail update is created for the customer and assigned crew.</p><button>Save changes</button></form>`,
    );
    document.querySelector("#edit-booking-form").onsubmit = (e) => {
      e.preventDefault();
      try {
        requireRole(["Owner", "Corporate Secretary"]);
        const s = SC.load(),
          b = s.bookings.find((b) => b.id === id),
          data = Object.fromEntries(new FormData(e.target));
        if (!SC.active(b) || b.gear === "Deployed" || b.gear === "Returned")
          throw Error("Schedule edits require an active, un-deployed booking.");
        const updated = { ...b, ...data, guests: +data.guests };
        SC.validateBooking(s, updated, id, false);
        if (updated.date < SC.date())
          throw Error("Cannot reschedule an event into the past.");
        for (const a of s.assignments.filter((a) => a.bookingId === id)) {
          if (
            s.assignments.some(
              (other) =>
                other.userId === a.userId &&
                other.bookingId !== id &&
                SC.overlap(
                  s.bookings.find((b) => b.id === other.bookingId),
                  updated,
                ),
            )
          )
            throw Error("An assigned staff member has a schedule conflict.");
          SC.notify(
            s,
            a.userId,
            "Assignment schedule updated • " + id,
            `${updated.title} is now scheduled for ${updated.date}, ${updated.start}–${updated.end}.`,
          );
        }
        Object.assign(b, updated);
        SC.history(b, "Event details updated by " + current().role);
        SC.notify(
          s,
          b.customerId,
          "Booking updated • " + id,
          `${b.title}: ${b.date}, ${b.start}–${b.end}, ${b.venue}.`,
        );
        commit(s, "Booking updated.");
      } catch (err) {
        UI.error(err);
      }
    };
  }
  function calendar(s) {
    const first = new Date(year, month, 1),
      days = new Date(year, month + 1, 0).getDate(),
      today = SC.date();
    let cells = Array.from(
      { length: first.getDay() },
      () => '<div class="day blank"></div>',
    );
    for (let i = 1; i <= days; i++) {
      const d = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
        bs = s.bookings.filter((b) => b.date === d);
      cells.push(
        `<div class="day ${d === today ? "today" : ""}"><strong>${i}</strong>${bs.map((b) => `<button class="calendar-event ${b.status.toLowerCase()}" data-booking="${b.id}">${b.start} ${E(b.title)}<br>${b.status}</button>`).join("")}</div>`,
      );
    }
    return (
      head(
        "Event calendar",
        "Review schedules and open any event to edit its details.",
      ) +
      `<div class="card"><div class="row between section-head"><h2 style="margin:0">${first.toLocaleString("en-PH", { month: "long", year: "numeric" })}</h2><div class="row"><button class="secondary small" id="prev-month">Previous</button><button class="secondary small" id="this-month">Today</button><button class="secondary small" id="next-month">Next</button></div></div><div class="row" style="margin-bottom:20px">${["Pending", "Approved", "Completed", "Cancelled", "Rejected"].map(badge).join("")}</div><div class="calendar-wrap"><div class="calendar">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<div class="day-name">${d}</div>`).join("")}${cells.join("")}</div></div></div>`
    );
  }
  function payments(s) {
    return (
      head(
        "Payments",
        "Record customer payments, verify submissions and track balances.",
        `<button id="new-payment">Record payment</button>`,
      ) +
      `<div class="metrics">${UI.metric("Verified collections", money(s.payments.filter((p) => p.status === "Verified").reduce((n, p) => n + p.amount, 0)), "Actual verified amounts in this demo")}${UI.metric("Pending review", s.payments.filter((p) => p.status === "Pending").length, "Awaiting your verification")}${UI.metric("Outstanding balances", money(s.bookings.filter((b) => ["Approved", "Completed"].includes(b.status)).reduce((n, b) => n + SC.balance(s, b), 0)), "Approved and completed bookings")}</div><div class="toolbar"><input id="payment-search" placeholder="Search booking ID or reference" aria-label="Search payment records">${select("Review status", "payment-filter", ["All statuses", "Pending", "Verified", "Rejected"])}</div><div id="payment-table">${paymentTable(s, s.payments)}</div><section class="content-section"><h2>Booking balances</h2>${table(
        ["Booking", "Total", "Verified", "Balance", "Payment status"],
        s.bookings
          .filter((b) => ["Approved", "Completed"].includes(b.status))
          .map((b) => [
            E(b.title) + "<br><small>" + b.id + "</small>",
            money(b.total),
            money(SC.paid(s, b.id)),
            money(SC.balance(s, b)),
            badge(SC.paymentStatus(s, b)),
          ]),
      )}</section>`
    );
  }
  function paymentTable(s, ps) {
    return table(
      ["Payment", "Booking", "Amount", "Status", ""],
      ps.map((p) => [
        `${E(p.method)}<br><small>${E(p.reference)}</small>`,
        `<strong>${E(s.bookings.find((b) => b.id === p.bookingId)?.title)}</strong><small>${p.bookingId} · ${formatDate(p.date)}</small>`,
        money(p.amount),
        badge(p.status),
        `<button class="secondary small" data-payment="${p.id}">${p.status === "Pending" ? "Review" : "View"}</button>`,
      ]),
    );
  }
  function reviewPayment(id) {
    requireRole(["Corporate Secretary"]);
    const s = SC.load(),
      p = s.payments.find((p) => p.id === id),
      b = s.bookings.find((b) => b.id === p.bookingId);
    UI.modal(
      "Review payment",
      `<p><strong>${E(b.title)}</strong><br>${b.id} · ${E(p.method)} · ${E(p.reference)}</p><h2>${money(p.amount)} ${badge(p.status)}</h2><p class="muted">Received ${formatDate(p.date)}<br>Remaining verified balance: ${money(SC.balance(s, b))}</p>${p.proof ? `<img class="proof-img" src="${E(p.proof)}" alt="Submitted sample payment proof">` : '<p class="notice">No proof image attached. This record contains a reference only.</p>'}${p.note ? `<p>${E(p.note)}</p>` : ""}${p.status === "Pending" ? `<form id="review-payment"><label>Verification / rejection notes<textarea name="note" maxlength="500"></textarea></label><div class="row"><button class="lime" name="decision" value="Verified">Verify payment</button><button class="danger" name="decision" value="Rejected">Reject payment</button></div></form>` : ""}`,
    );
    document
      .querySelector("#review-payment")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        try {
          requireRole(["Corporate Secretary"]);
          const s = SC.load(),
            p = s.payments.find((p) => p.id === id),
            b = s.bookings.find((b) => b.id === p.bookingId),
            status = e.submitter.value,
            note = new FormData(e.target).get("note").trim();
          if (p.status !== "Pending")
            throw Error("This payment has already been reviewed.");
          if (
            status === "Verified" &&
            (!["Approved", "Completed"].includes(b.status) ||
              p.amount > SC.balance(s, b))
          )
            throw Error(
              "This booking is not eligible, or the payment would exceed its outstanding balance.",
            );
          if (status === "Rejected" && !note)
            throw Error("Add a reason for rejecting the payment.");
          p.status = status;
          p.note = note;
          SC.history(
            b,
            "Payment " + status.toLowerCase() + ": " + money(p.amount),
          );
          SC.notify(
            s,
            b.customerId,
            "Payment " + status.toLowerCase() + " • " + b.id,
            `${p.method} payment of ${money(p.amount)}: ${status.toLowerCase()}.${note ? " " + note : ""}`,
          );
          commit(s, "Payment " + status.toLowerCase() + ".");
        } catch (err) {
          UI.error(err);
        }
      });
  }
  function newPayment() {
    requireRole(["Corporate Secretary"]);
    const s = SC.load(),
      bs = s.bookings.filter(
        (b) =>
          ["Approved", "Completed"].includes(b.status) && SC.balance(s, b) > 0,
      );
    if (!bs.length) {
      UI.toast("There are no bookings with an outstanding balance.");
      return;
    }
    UI.modal(
      "Record customer payment",
      `<form id="new-payment-form">${select(
        "Booking",
        "bookingId",
        bs.map((b) => [
          b.id,
          b.id + " · " + b.title + " · Balance " + money(SC.balance(s, b)),
        ]),
      )}${select("Method", "method", ["Cash", "Check", "GCash", "Bank transfer"])}${field("Amount (PHP)", "amount", "", "number", 'required min="0.01" step="0.01"')}${field("Reference / receipt number", "reference", "", "text", 'required maxlength="80"')}${field("Date received", "date", SC.date(), "date", `required max="${SC.date()}"`)}<p class="notice">This records a verified payment in the demonstration. It does not transfer money. Review any pending customer submission first to avoid double-counting.</p><button>Save verified payment</button></form>`,
    );
    document.querySelector("#new-payment-form").onsubmit = (e) => {
      e.preventDefault();
      try {
        requireRole(["Corporate Secretary"]);
        const s = SC.load(),
          d = Object.fromEntries(new FormData(e.target)),
          b = s.bookings.find((b) => b.id === d.bookingId),
          amount = Math.round(+d.amount * 100) / 100;
        if (
          !["Approved", "Completed"].includes(b.status) ||
          !(amount > 0) ||
          amount > SC.balance(s, b)
        )
          throw Error("Enter a positive amount within the remaining balance.");
        if (
          s.payments.some((p) => p.bookingId === b.id && p.status === "Pending")
        )
          throw Error(
            "Review pending payment submissions for this booking first.",
          );
        if (
          !d.reference.trim() ||
          s.payments.some(
            (p) =>
              p.reference.toLowerCase() === d.reference.trim().toLowerCase() &&
              p.status !== "Rejected",
          )
        )
          throw Error("Enter a unique reference number.");
        if (d.date > SC.date())
          throw Error("Payment date cannot be in the future.");
        s.payments.unshift({
          id: SC.id("PY"),
          bookingId: b.id,
          amount,
          method: d.method,
          reference: d.reference.trim(),
          date: d.date,
          status: "Verified",
          proof: "",
          note: "Recorded by Corporate Secretary",
        });
        SC.history(b, "Verified payment recorded: " + money(amount));
        SC.notify(
          s,
          b.customerId,
          "Payment verified • " + b.id,
          "Your " + money(amount) + " payment has been recorded.",
        );
        commit(s, "Payment recorded.");
      } catch (err) {
        UI.error(err);
      }
    };
  }
  function users(s, customers = false) {
    const us = s.users.filter((u) => !customers || u.role === "Customer");
    return (
      head(
        customers ? "Customer records" : "User accounts",
        customers
          ? "Maintain customer contact details for bookings."
          : "Manage accounts and role-based access.",
        customers ? "" : `<button id="new-user">Create account</button>`,
      ) +
      `<div class="toolbar"><input id="user-search" aria-label="Search accounts" placeholder="Search name, email or role"></div><div id="user-table">${userTable(us, customers)}</div>`
    );
  }
  function userTable(us, customers) {
    return table(
      ["Name", "Contact", "Role", "Status", ""],
      us.map((u) => [
        `<strong>${E(u.name)}</strong><small>${u.id}</small>`,
        `${E(u.email)}<br><small>${E(u.phone)}</small>`,
        E(u.role),
        badge(u.active ? "Active" : "Inactive"),
        `<button class="secondary small" data-user="${u.id}" data-customer="${customers}">Edit</button>`,
      ]),
    );
  }
  function userModal(id, customerOnly = false) {
    const actor = requireRole(
      customerOnly ? ["Corporate Secretary"] : ["Owner"],
    );
    const s = SC.load(),
      u = s.users.find((u) => u.id === id) || {
        name: "",
        email: "",
        phone: "",
        role: "Event Staff",
        password: "",
        active: true,
      };
    if (customerOnly && u.role !== "Customer")
      throw Error("Only customer records may be edited here.");
    UI.modal(
      id ? "Edit account" : "Create account",
      `<form id="user-form"><div class="grid">${field("Full name", "name", u.name, "text", 'required maxlength="100"')}${field("Email", "email", u.email, "email", "required")}${field("Mobile number", "phone", u.phone, "tel", 'required maxlength="16"')}${!customerOnly ? select("Role", "role", SC.roles, u.role, id ? "disabled" : "") : ""}${!customerOnly ? field(id ? "New password (leave blank to keep current)" : "Password", "password", "", "password", `${id ? "" : "required"} minlength="8" autocomplete="new-password"`) : ""}${!customerOnly ? select("Account status", "active", ["Active", "Inactive"], u.active ? "Active" : "Inactive") : ""}</div>${id && !customerOnly ? '<small class="muted">Existing roles stay fixed to preserve linked staff and booking records. Create a new account for a different role.</small>' : ""}<button>Save account</button></form>`,
    );
    document.querySelector("#user-form").onsubmit = (e) => {
      e.preventDefault();
      try {
        const actor = requireRole(
            customerOnly ? ["Corporate Secretary"] : ["Owner"],
          ),
          s = SC.load(),
          old = s.users.find((u) => u.id === id),
          d = Object.fromEntries(new FormData(e.target)),
          nu = {
            ...(old || {}),
            id: old?.id || SC.id("U"),
            name: d.name.trim(),
            email: d.email.trim().toLowerCase(),
            phone: d.phone.trim(),
            password: customerOnly
              ? old.password
              : d.password || old?.password || "",
            role: old?.role || d.role,
            active: customerOnly ? old.active : d.active === "Active",
          };
        SC.validateUser(s, nu, id);
        if (nu.id === actor.id && !nu.active)
          throw Error("You cannot deactivate your own account.");
        if (
          !nu.active &&
          s.assignments.some(
            (a) =>
              a.userId === nu.id &&
              SC.active(s.bookings.find((b) => b.id === a.bookingId)),
          )
        )
          throw Error(
            "Remove this staff member’s active assignments before deactivation.",
          );
        if (old) Object.assign(old, nu);
        else {
          s.users.push(nu);
          if (["Event Staff", "Maintenance Staff"].includes(nu.role))
            s.staff.push({ userId: nu.id, status: "Available" });
        }
        commit(s, "Account saved.");
      } catch (err) {
        UI.error(err);
      }
    };
  }
  function staffPage(s) {
    return (
      head(
        "Staff & dispatch",
        "Coordinate available event crew with approved bookings.",
        `<button id="assign-staff">Assign staff</button>`,
      ) +
      table(
        ["Staff member", "Role", "Current status", "Assignments", ""],
        s.staff.map((st) => {
          const u = s.users.find((u) => u.id === st.userId);
          return [
            `<strong>${E(u.name)}</strong><small>${E(u.email)}</small>`,
            E(u.role),
            badge(st.status) + (u.active ? "" : " " + badge("Inactive")),
            s.assignments.filter(
              (a) =>
                a.userId === u.id &&
                SC.active(s.bookings.find((b) => b.id === a.bookingId)),
            ).length,
            `<button class="secondary small" data-staff="${u.id}">Update status</button>`,
          ];
        }),
      ) +
      `<section class="content-section"><h2>Staff assignments</h2>${assignmentTable(s, s.assignments, true)}</section>`
    );
  }
  function assignmentTable(s, as, manage = false) {
    return table(
      ["Event", "Schedule / venue", "Staff / duty", manage ? "" : "Status"],
      as.map((a) => {
        const b = s.bookings.find((b) => b.id === a.bookingId),
          u = s.users.find((u) => u.id === a.userId);
        return [
          `<strong>${E(b.title)}</strong><small>${b.id}</small>`,
          `${formatDate(b.date)} · ${b.start}–${b.end}<br><small>${E(b.venue)}</small>`,
          `<strong>${E(u.name)}</strong><small>${E(a.duty)}</small>`,
          manage
            ? `<button class="danger small" data-unassign="${a.id}">Remove</button>`
            : badge(b.status),
        ];
      }),
    );
  }
  function assignModal() {
    requireRole(["Corporate Secretary"]);
    const s = SC.load(),
      bs = s.bookings.filter(
        (b) => b.status === "Approved" && b.date >= SC.date(),
      ),
      staff = s.staff.filter(
        (st) =>
          st.status === "Available" &&
          s.users.some(
            (u) => u.id === st.userId && u.role === "Event Staff" && u.active,
          ),
      );
    if (!bs.length || !staff.length) {
      UI.toast(
        "An upcoming approved booking and available event staff are required.",
        true,
      );
      return;
    }
    UI.modal(
      "Assign event staff",
      `<form id="assignment-form">${select(
        "Approved booking",
        "bookingId",
        bs.map((b) => [b.id, b.title + " · " + b.date + " " + b.start]),
      )}${select(
        "Available event staff",
        "userId",
        staff.map((st) => [
          st.userId,
          s.users.find((u) => u.id === st.userId).name,
        ]),
      )}${field("Assignment / duty", "duty", "", "text", 'required maxlength="200" placeholder="e.g. Sound setup and operation"')}<button>Confirm assignment</button></form>`,
    );
    document.querySelector("#assignment-form").onsubmit = (e) => {
      e.preventDefault();
      try {
        requireRole(["Corporate Secretary"]);
        const s = SC.load(),
          d = Object.fromEntries(new FormData(e.target)),
          b = s.bookings.find((b) => b.id === d.bookingId),
          st = s.staff.find((st) => st.userId === d.userId);
        if (
          b.status !== "Approved" ||
          st.status !== "Available" ||
          !s.users.find((u) => u.id === d.userId)?.active
        )
          throw Error("Booking or staff availability has changed.");
        if (!d.duty.trim()) throw Error("Enter an assignment duty.");
        if (
          s.assignments.some(
            (a) =>
              a.userId === d.userId &&
              SC.active(s.bookings.find((b) => b.id === a.bookingId)) &&
              SC.overlap(
                s.bookings.find((b) => b.id === a.bookingId),
                b,
              ),
          )
        )
          throw Error(
            "This staff member is already assigned to this event or has a schedule conflict.",
          );
        s.assignments.push({
          id: SC.id("AS"),
          bookingId: b.id,
          userId: d.userId,
          duty: d.duty.trim(),
        });
        SC.notify(
          s,
          d.userId,
          "New staff assignment • " + b.id,
          `${b.title}: ${b.date}, ${b.start}–${b.end}, ${b.venue}. Duty: ${d.duty}.`,
        );
        commit(s, "Staff assignment saved.");
      } catch (err) {
        UI.error(err);
      }
    };
  }
  function availability(s, u) {
    const st = s.staff.find((st) => st.userId === u.id);
    return (
      head(
        "My availability",
        "Keep the Corporate Secretary informed of your current duty status.",
      ) +
      `<section class="card" style="max-width:600px"><h2>${E(u.name)}</h2><p>Current status: ${badge(st.status)}</p><form id="availability-form" class="stack">${select("Availability status", "status", ["Available", "On Duty", "On Leave"], st.status)}<p class="notice">Changing your status does not remove existing assignments. The Corporate Secretary receives a simulated notification and can coordinate reassignment.</p><button>Save availability</button></form></section>`
    );
  }
  function staffStatusModal(id) {
    requireRole(["Corporate Secretary"]);
    const s = SC.load(),
      st = s.staff.find((st) => st.userId === id);
    UI.modal(
      "Update staff status",
      `<form id="staff-status-form">${select("Status", "status", ["Available", "On Duty", "On Leave"], st.status)}<button>Save status</button></form>`,
    );
    document.querySelector("#staff-status-form").onsubmit = (e) => {
      e.preventDefault();
      try {
        requireRole(["Corporate Secretary"]);
        const s = SC.load(),
          st = s.staff.find((st) => st.userId === id);
        st.status = new FormData(e.target).get("status");
        SC.notify(
          s,
          id,
          "Staff availability updated",
          "Your current status is " +
            st.status +
            ". Existing assignments remain visible.",
        );
        commit(s, "Staff status updated.");
      } catch (err) {
        UI.error(err);
      }
    };
  }
  function equipment(s) {
    return (
      head(
        "Equipment inventory",
        "Track stock, maintenance and equipment readiness.",
        `<button id="new-equipment">Add equipment</button>`,
      ) +
      `<div class="toolbar"><input id="equipment-search" placeholder="Search name, category or equipment ID" aria-label="Search inventory">${select("Category", "equipment-category", ["All categories", "Mixers", "Screens", "Microphones", "Lights", "Sounds", "Stages"])}</div><p class="notice">Stock is tracked in units. Availability at booking time accounts for overlapping reservations. Reserved and deployed totals below cover all active bookings.</p><div id="equipment-table">${equipmentTable(s, s.equipment)}</div>`
    );
  }
  function equipmentTable(s, es) {
    return table(
      [
        "Equipment",
        "Total units",
        "Maintenance",
        "Reserved / deployed",
        "Rate",
        "",
      ],
      es.map((e) => {
        const held = s.bookings
          .filter((b) => SC.active(b) && b.gear !== "Returned")
          .reduce(
            (n, b) => n + (b.items.find((i) => i.id === e.id)?.qty || 0),
            0,
          );
        return [
          `<strong>${E(e.name)}</strong><small>${e.id} · ${E(e.category)}</small>`,
          e.qty,
          e.maintenance,
          `${held}<br><small>${e.qty - e.maintenance <= 2 ? "Low serviceable stock" : e.qty - e.maintenance + " serviceable units"}</small>`,
          money(e.rate),
          `<div class="row"><button class="secondary small" data-equipment="${e.id}">Edit</button><button class="secondary small" data-label="${e.id}">ID label</button></div>`,
        ];
      }),
    );
  }
  function equipmentModal(id) {
    requireRole(["Maintenance Staff"]);
    const s = SC.load(),
      eq = s.equipment.find((e) => e.id === id) || {
        name: "",
        category: "Sounds",
        qty: 1,
        maintenance: 0,
        rate: 1000,
        notes: "",
      };
    UI.modal(
      id ? "Edit equipment" : "Add equipment",
      `<form id="equipment-form"><div class="grid">${field("Equipment name", "name", eq.name, "text", 'required maxlength="100"')}${select("Category", "category", ["Mixers", "Screens", "Microphones", "Lights", "Sounds", "Stages"], eq.category)}${field("Total units", "qty", eq.qty, "number", 'required min="1" step="1"')}${field("Units under maintenance", "maintenance", eq.maintenance, "number", 'required min="0" step="1"')}${field("Sample rental rate / unit (PHP)", "rate", eq.rate, "number", 'required min="0.01" step="0.01"')}<label class="full">Condition / inspection notes<textarea name="notes" maxlength="1000">${E(eq.notes)}</textarea></label></div><p class="notice">Reducing serviceable stock is blocked when it would invalidate an active reservation.</p><button>Save equipment</button></form>`,
    );
    document.querySelector("#equipment-form").onsubmit = (e) => {
      e.preventDefault();
      try {
        requireRole(["Maintenance Staff"]);
        const s = SC.load(),
          d = Object.fromEntries(new FormData(e.target)),
          obj = {
            id: id || SC.id("EQ"),
            name: d.name.trim(),
            category: d.category,
            qty: +d.qty,
            maintenance: +d.maintenance,
            rate: Math.round(+d.rate * 100) / 100,
            notes: d.notes.trim(),
          };
        if (
          !obj.name ||
          !Number.isInteger(obj.qty) ||
          !Number.isInteger(obj.maintenance) ||
          obj.qty < 1 ||
          obj.maintenance < 0 ||
          obj.maintenance > obj.qty ||
          !(obj.rate > 0)
        )
          throw Error("Check equipment name, quantities and rate.");
        const active = s.bookings.filter(
          (b) => SC.active(b) && b.gear !== "Returned",
        );
        for (const b of active) {
          const required = active
            .filter((other) => SC.overlap(other, b))
            .reduce(
              (n, x) => n + (x.items.find((i) => i.id === id)?.qty || 0),
              0,
            );
          if (required > obj.qty - obj.maintenance)
            throw Error(
              "These quantities would leave an active booking without enough equipment. Coordinate the affected bookings with management before reducing serviceable stock.",
            );
        }
        if (id)
          Object.assign(
            s.equipment.find((e) => e.id === id),
            obj,
          );
        else s.equipment.push(obj);
        if (obj.qty - obj.maintenance <= 2 || obj.maintenance > 0)
          SC.notifyManagers(
            s,
            "Inventory attention • " + obj.name,
            `${obj.qty - obj.maintenance} serviceable units; ${obj.maintenance} under maintenance. ${obj.notes}`,
          );
        commit(s, "Equipment saved.");
      } catch (err) {
        UI.error(err);
      }
    };
  }
  function reservations(s) {
    const bs = s.bookings.filter((b) =>
      ["Pending", "Approved", "Completed"].includes(b.status),
    );
    return (
      head(
        "Equipment reservations",
        "Inspect reserved items, record deployment and confirm returns.",
      ) +
      table(
        ["Booking", "Schedule", "Equipment", "Status", ""],
        bs.map((b) => [
          `<strong>${E(b.title)}</strong><small>${b.id} · ${b.status}</small>`,
          formatDate(b.date),
          b.items
            .map(
              (i) =>
                `${i.qty} × ${E(s.equipment.find((e) => e.id === i.id)?.name)}`,
            )
            .join("<br>"),
          badge(b.gear),
          `<button class="secondary small" data-reservation="${b.id}">Manage</button>`,
        ]),
      )
    );
  }
  function reservationModal(id) {
    requireRole(["Maintenance Staff"]);
    const s = SC.load(),
      b = s.bookings.find((b) => b.id === id);
    UI.modal(
      "Equipment reservation",
      `<h3>${E(b.title)} · ${b.id}</h3><p>${formatDate(b.date)} · ${b.start}–${b.end} · ${E(b.venue)}</p>${table(
        ["Equipment", "Reserved units"],
        b.items.map((i) => [
          E(s.equipment.find((e) => e.id === i.id)?.name),
          i.qty,
        ]),
      )}<p style="margin-top:20px">Equipment status: ${badge(b.gear)}</p><div class="row">${b.status === "Approved" && b.gear === "Ready to deploy" ? '<button id="deploy-gear">Mark deployed</button>' : ""}${b.status === "Approved" && ["Reserved", "Ready to deploy", "Deployed"].includes(b.gear) ? '<button class="lime" id="return-gear">Confirm equipment returned</button>' : ""}${b.status === "Approved" && b.gear === "Reserved" ? '<button class="secondary" id="ready-gear">Confirm ready to deploy</button>' : ""}</div><p class="notice" style="margin-top:20px">After return, record damaged or unavailable units under Equipment inventory. Confirm readiness after checking all reserved equipment. Pending requests must be approved before readiness can be confirmed.</p>`,
    );
    document
      .querySelector("#deploy-gear")
      ?.addEventListener("click", () => gearChange(id, "Deployed"));
    document
      .querySelector("#return-gear")
      ?.addEventListener("click", () => gearChange(id, "Returned"));
    document
      .querySelector("#ready-gear")
      ?.addEventListener("click", () => confirmReadiness(id));
  }
  function gearChange(id, state) {
    try {
      requireRole(["Maintenance Staff"]);
      const s = SC.load(),
        b = s.bookings.find((b) => b.id === id);
      if (b.status !== "Approved" || !["Reserved", "Ready to deploy", "Deployed"].includes(b.gear))
        throw Error("This reservation cannot be updated.");
      if (state === "Deployed" && b.gear !== "Ready to deploy")
        throw Error("Confirm equipment is ready to deploy first.");
      if (state === "Deployed" && b.date !== SC.date())
        throw Error("Equipment can be deployed on the scheduled event date.");
      if (state === "Returned" && new Date(b.date + "T" + b.end) > new Date())
        throw Error("Confirm returns after the scheduled event has ended.");
      b.gear = state;
      SC.history(
        b,
        "Equipment " + state.toLowerCase() + " by Maintenance Staff",
      );
      SC.notifyManagers(
        s,
        "Equipment " + state.toLowerCase() + " • " + id,
        b.title + ": all listed equipment marked " + state.toLowerCase() + ".",
      );
      commit(s, "Equipment " + state.toLowerCase() + ".");
    } catch (err) {
      UI.error(err);
    }
  }
  function confirmReadiness(id) {
    requireRole(["Maintenance Staff"]);
    UI.modal("Confirm ready to deploy", `<p>Confirm that every item listed in this reservation has been checked, is in working condition and is prepared for deployment.</p><form id="readiness-form"><label class="check-label"><input type="checkbox" name="inspected" required> All reserved equipment has been inspected and prepared.</label><button class="lime">Confirm ready to deploy</button></form>`);
    document.querySelector("#readiness-form").onsubmit = e => {
      e.preventDefault();
      try {
        const actor = requireRole(["Maintenance Staff"]);
        if(!e.target.elements.inspected.checked) throw Error("Confirm that all equipment has been inspected and prepared.");
        const s = SC.load(), b = s.bookings.find(b => b.id === id);
        if(!b || b.status !== "Approved" || b.gear !== "Reserved") throw Error("Only an approved, reserved booking can be confirmed ready.");
        SC.validateBooking(s, b, id, false);
        b.gear = "Ready to deploy";
        b.readiness = { confirmedBy: actor.id, confirmedAt: new Date().toISOString() };
        SC.history(b, "Equipment confirmed ready to deploy by Maintenance Staff");
        SC.notifyManagers(s, "Equipment ready to deploy • " + id, b.title + ": all reserved equipment has been inspected and prepared for deployment.");
        commit(s, "Equipment confirmed ready to deploy.");
      } catch(err) { UI.error(err); }
    };
  }
  function ownerEquipmentOverview(s) {
    requireRole(["Owner"]);
    const rows = s.equipment.map(eq => {
      const rented = s.bookings.filter(b => b.gear === "Deployed").reduce((n,b) => n + (b.items.find(i => i.id === eq.id)?.qty || 0), 0);
      return { eq, rented, repair: eq.maintenance, available: Math.max(0, eq.qty - eq.maintenance - rented) };
    });
    return head("Equipment overview", "Monitor available, rented and under-repair equipment across the inventory.") +
      `<div class="metrics">${UI.metric("Total equipment units", rows.reduce((n,r)=>n+r.eq.qty,0), "All equipment categories")}${UI.metric("Available", rows.reduce((n,r)=>n+r.available,0), "On hand and serviceable")}${UI.metric("Rented", rows.reduce((n,r)=>n+r.rented,0), "Deployed and not yet returned")}${UI.metric("Under repair", rows.reduce((n,r)=>n+r.repair,0), "Recorded maintenance units")}</div><p class="notice">This overview shows current physical stock. Reserved or ready-to-deploy items remain on hand until marked deployed; booking availability still checks their reservations. An equipment group may have units in more than one status.</p>` +
      table(["Equipment", "Total units", "Available", "Rented", "Under repair"], rows.map(r => [
        `<strong>${E(r.eq.name)}</strong><small>${E(r.eq.id)} · ${E(r.eq.category)}</small>`, r.eq.qty,
        `${badge("Available")} <strong>${r.available}</strong>`,
        `${badge("Rented")} <strong>${r.rented}</strong>`,
        `${badge("Under repair")} <strong>${r.repair}</strong>`
      ]));
  }
  function reportData(s) {
    const bs = s.bookings.filter(
        (b) => b.date >= reportFrom && b.date <= reportTo,
      ),
      ps = s.payments.filter(
        (p) =>
          p.status === "Verified" && p.date >= reportFrom && p.date <= reportTo,
      ),
      live = bs.filter((b) => ["Approved", "Completed"].includes(b.status));
    return {
      bs,
      ps,
      live,
      revenue: ps.reduce((n, p) => n + p.amount, 0),
      outstanding: live.reduce((n, b) => n + SC.balance(s, b), 0),
    };
  }
  function reports(s) {
    const { bs, ps, live, revenue, outstanding } = reportData(s);
    const grouped = {};
    for (const b of bs.filter(
      (b) => !["Rejected", "Cancelled"].includes(b.status),
    )) {
      const k = b.date.slice(0, 7);
      grouped[k] = (grouped[k] || 0) + 1;
    }
    const peak = Object.entries(grouped).sort((a, b) => b[1] - a[1])[0];
    let months = [];
    let d = new Date(reportFrom + "T12:00:00");
    d.setDate(1);
    const end = new Date(reportTo + "T12:00:00");
    while (d <= end && months.length < 36) {
      const key =
        d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
      months.push({
        key,
        label: d.toLocaleString("en-PH", {
          month: "short",
          year: "2-digit",
        }),
        count: grouped[key] || 0,
      });
      d.setMonth(d.getMonth() + 1);
    }
    const max = Math.max(1, ...months.map((m) => m.count));
    return (
      head(
        "Reports & analytics",
        "Review bookings, verified collections and seasonal activity.",
        `<div class="row"><button class="secondary" id="export-report">Export CSV</button><button id="print-report">Print report</button></div>`,
      ) +
      `<form id="report-filter" class="toolbar no-print">${field("Event / payment date from", "from", reportFrom, "date", 'required class="report-period"')}${field("To", "to", reportTo, "date", 'required class="report-period"')}<button style="align-self:end">Generate report</button></form><p class="muted">Reporting period: ${formatDate(reportFrom)} – ${formatDate(reportTo)}</p><div class="metrics">${UI.metric("Booking records", bs.length, "Filtered by event date")}${UI.metric("Verified collections", money(revenue), "Filtered by payment date")}${UI.metric("Outstanding balances", money(outstanding), "Approved / completed events in period")}${UI.metric("Peak month", peak ? new Date(peak[0] + "-01T12:00:00").toLocaleString("en-PH", { month: "short", year: "numeric" }) : "No data", peak ? peak[1] + " active or completed bookings" : "Choose a different period")}</div>${
        !bs.length && !ps.length
          ? '<div class="card empty">No data available for the selected period.</div>'
          : `<div class="grid"><section class="card"><h2>Booking activity by month</h2><p class="muted" style="font-size:.85rem">Pending, approved and completed events; excludes rejected and cancelled requests.</p><div class="bar-chart">${months.map((m) => `<div class="bar-col"><strong>${m.count}</strong><div class="bar" style="height:${(m.count / max) * 125}px" title="${E(m.label)}: ${m.count} bookings"></div><span>${E(m.label)}</span></div>`).join("")}</div><p class="muted" style="font-size:.8rem;margin-top:20px">Historical trends only. Sample data is insufficient for reliable forecasting.</p></section><section class="card"><h2>Event locations</h2>${
              Object.entries(
                bs
                  .filter((b) => !["Rejected", "Cancelled"].includes(b.status))
                  .reduce((a, b) => {
                    a[b.venue] = (a[b.venue] || 0) + 1;
                    return a;
                  }, {}),
              )
                .sort((a, b) => b[1] - a[1])
                .map(
                  ([v, n]) =>
                    `<div class="mini-item"><strong>${E(v)}</strong><span>${n} booking${n !== 1 ? "s" : ""}</span></div>`,
                )
                .join("") ||
              '<p class="empty">No qualifying events in this period.</p>'
            }<div class="notice" style="margin-top:20px">Collections use verified payment amounts, not the total value of booking requests. Cancellation does not automatically refund a recorded payment.</div></section></div><section class="content-section"><h2>Booking summary</h2>${table(
              [
                "Booking",
                "Event date",
                "Status",
                "Booking value",
                "Verified to date",
                "Balance",
              ],
              bs.map((b) => [
                E(b.title),
                formatDate(b.date),
                badge(b.status),
                money(b.total),
                money(SC.paid(s, b.id)),
                money(SC.balance(s, b)),
              ]),
            )}</section><section class="content-section"><h2>Collections in this period</h2>${table(
              ["Booking", "Payment date", "Method", "Reference", "Amount"],
              ps.map((p) => [
                E(p.bookingId),
                formatDate(p.date),
                E(p.method),
                E(p.reference),
                money(p.amount),
              ]),
            )}</section>`
      }<section class="content-section"><h2>Customer feedback</h2>${table(
        ["Event", "Rating", "Feedback", "Submitted"],
        s.feedback
          .filter((f) => bs.some((b) => b.id === f.bookingId))
          .map((f) => [
            E(s.bookings.find((b) => b.id === f.bookingId)?.title),
            f.rating + " / 5",
            E(f.comment),
            formatDate(f.date),
          ]),
      )}</section>`
    );
  }
  function bind() {
    const u = current();
    document.querySelector("#logout").onclick = () => {
      SessionStore.removeItem("scenium.session.staff");
      render();
    };
    document
      .querySelectorAll("[data-booking]")
      .forEach((b) => (b.onclick = () => bookingModal(b.dataset.booking)));
    document.querySelector("#prev-month")?.addEventListener("click", () => {
      month--;
      if (month < 0) {
        month = 11;
        year--;
      }
      render();
    });
    document.querySelector("#next-month")?.addEventListener("click", () => {
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
      render();
    });
    document.querySelector("#this-month")?.addEventListener("click", () => {
      month = new Date().getMonth();
      year = new Date().getFullYear();
      render();
    });
    const bookingFilter = () => {
      const s = SC.load(),
        q = document.querySelector("#booking-search").value.toLowerCase(),
        status = document.querySelector("[name=filter-status]").value;
      document.querySelector("#booking-table").innerHTML = bookingTable(
        s,
        s.bookings.filter(
          (b) =>
            (status === "All statuses" || status === b.status) &&
            (
              b.title +
              " " +
              b.id +
              " " +
              s.users.find((u) => u.id === b.customerId)?.name
            )
              .toLowerCase()
              .includes(q),
        ),
      );
      document
        .querySelectorAll("[data-booking]")
        .forEach((b) => (b.onclick = () => bookingModal(b.dataset.booking)));
    };
    document
      .querySelector("#booking-search")
      ?.addEventListener("input", bookingFilter);
    document
      .querySelector("[name=filter-status]")
      ?.addEventListener("change", bookingFilter);
    const paymentBind = () =>
      document
        .querySelectorAll("[data-payment]")
        .forEach((b) => (b.onclick = () => reviewPayment(b.dataset.payment)));
    paymentBind();
    const paymentFilter = () => {
      const s = SC.load(),
        q = document.querySelector("#payment-search").value.toLowerCase(),
        status = document.querySelector("[name=payment-filter]").value;
      document.querySelector("#payment-table").innerHTML = paymentTable(
        s,
        s.payments.filter(
          (p) =>
            (status === "All statuses" || p.status === status) &&
            (p.reference + " " + p.bookingId).toLowerCase().includes(q),
        ),
      );
      paymentBind();
    };
    document
      .querySelector("#payment-search")
      ?.addEventListener("input", paymentFilter);
    document
      .querySelector("[name=payment-filter]")
      ?.addEventListener("change", paymentFilter);
    document
      .querySelector("#new-payment")
      ?.addEventListener("click", newPayment);
    const userBind = () =>
      document
        .querySelectorAll("[data-user]")
        .forEach(
          (b) =>
            (b.onclick = () =>
              userModal(b.dataset.user, b.dataset.customer === "true")),
        );
    userBind();
    document
      .querySelector("#new-user")
      ?.addEventListener("click", () => userModal(null));
    document.querySelector("#user-search")?.addEventListener("input", (e) => {
      const s = SC.load(),
        customers = location.hash === "#staff/customers",
        q = e.target.value.toLowerCase();
      document.querySelector("#user-table").innerHTML = userTable(
        s.users.filter(
          (u) =>
            (!customers || u.role === "Customer") &&
            (u.name + " " + u.email + " " + u.role).toLowerCase().includes(q),
        ),
        customers,
      );
      userBind();
    });
    document
      .querySelector("#assign-staff")
      ?.addEventListener("click", assignModal);
    document
      .querySelectorAll("[data-staff]")
      .forEach((b) => (b.onclick = () => staffStatusModal(b.dataset.staff)));
    document.querySelectorAll("[data-unassign]").forEach(
      (btn) =>
        (btn.onclick = () => {
          UI.modal(
            "Remove staff assignment?",
            `<p>The staff member will receive a simulated notice that this assignment has been removed.</p><button class="danger" id="confirm-unassign">Remove assignment</button>`,
          );
          document.querySelector("#confirm-unassign").onclick = () => {
            try {
              requireRole(["Corporate Secretary"]);
              const s = SC.load(),
                a = s.assignments.find((a) => a.id === btn.dataset.unassign);
              s.assignments = s.assignments.filter((x) => x.id !== a.id);
              SC.notify(
                s,
                a.userId,
                "Assignment removed • " + a.bookingId,
                "Your assignment for this event has been removed by the Corporate Secretary.",
              );
              commit(s, "Assignment removed.");
            } catch (err) {
              UI.error(err);
            }
          };
        }),
    );
    document
      .querySelector("#availability-form")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        try {
          const u = requireRole(["Event Staff"]),
            s = SC.load(),
            st = s.staff.find((st) => st.userId === u.id);
          st.status = new FormData(e.target).get("status");
          SC.notifyManagers(
            s,
            "Staff availability updated",
            u.name + " is now " + st.status + ".",
          );
          commit(s, "Availability updated.");
        } catch (err) {
          UI.error(err);
        }
      });
    const equipmentBind = () => {
      document
        .querySelectorAll("[data-equipment]")
        .forEach(
          (b) => (b.onclick = () => equipmentModal(b.dataset.equipment)),
        );
      document.querySelectorAll("[data-label]").forEach(
        (b) =>
          (b.onclick = () => {
            const e = SC.load().equipment.find((e) => e.id === b.dataset.label);
            UI.modal(
              "Equipment identification label",
              `<div style="text-align:center"><p class="eyebrow">SCENIUM INVENTORY</p><h2>${E(e.name)}</h2><img class="qr" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMiAtMTIgMTc0IDE3NCI+PHJlY3QgeD0iLTEyIiB5PSItMTIiIHdpZHRoPSIxNzQiIGhlaWdodD0iMTc0IiBmaWxsPSJ3aGl0ZSIvPjxnIGZpbGw9IiMxNDIxMmIiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMiIgeT0iMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNDIiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2MCIgeT0iMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjcyIiB5PSIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iOTAiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMDIiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMzIiIHk9IjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2IiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIiIHk9IjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIzNiIgeT0iNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjQyIiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjYiIHk9IjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI3MiIgeT0iNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijk2IiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTAyIiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTI2IiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTMyIiB5PSI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIyNCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIzMCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI1NCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2MCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI4NCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5MCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMTQiIHk9IjE4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIwIiB5PSIxOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iMTgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjI0IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjM2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjU0IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjY2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijk2IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjExNCIgeT0iMjQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjYiIHk9IjI0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTQ0IiB5PSIyNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjAiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMzAiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNDIiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjAiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNzIiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iOTAiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTAyIiB5PSIzMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyMCIgeT0iMzAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMzIiIHk9IjMwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIzNiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI0MiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2NiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI3MiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5NiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMDIiIHk9IjM2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTI2IiB5PSIzNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEzMiIgeT0iMzYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIwIiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjI0IiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjU0IiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjYwIiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjkwIiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjExNCIgeT0iNDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTQ0IiB5PSI0OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjYiIHk9IjU0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9IjU0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMzYiIHk9IjU0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSI1NCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyNiIgeT0iNTQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxNDQiIHk9IjU0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMCIgeT0iNjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMiIgeT0iNjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIzMCIgeT0iNjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI0MiIgeT0iNjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMDIiIHk9IjYwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIwIiB5PSI2MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEzMiIgeT0iNjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI2IiB5PSI2NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyIiB5PSI2NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjM2IiB5PSI2NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjQyIiB5PSI2NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEwMiIgeT0iNjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjYiIHk9IjY2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTMyIiB5PSI2NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjAiIHk9Ijc4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9Ijc4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMzAiIHk9Ijc4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSI3OCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyMCIgeT0iNzgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxNDQiIHk9Ijc4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNiIgeT0iODQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIyNCIgeT0iODQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIzNiIgeT0iODQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMTQiIHk9Ijg0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTI2IiB5PSI4NCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iODQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIwIiB5PSI5MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyIiB5PSI5MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSI5MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjQyIiB5PSI5MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEwMiIgeT0iOTAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjkwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTMyIiB5PSI5MCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjYiIHk9Ijk2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIiIHk9Ijk2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMzYiIHk9Ijk2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNDIiIHk9Ijk2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTAyIiB5PSI5NiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEyNiIgeT0iOTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMzIiIHk9Ijk2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMCIgeT0iMTA4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9IjEwOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSIxMDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI1NCIgeT0iMTA4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjAiIHk9IjEwOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSIxMDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5MCIgeT0iMTA4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSIxMDgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjEwOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iMTA4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNiIgeT0iMTE0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9IjExNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjM2IiB5PSIxMTQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI1NCIgeT0iMTE0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjYiIHk9IjExNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSIxMTQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5NiIgeT0iMTE0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSIxMTQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjYiIHk9IjExNCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iMTE0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMCIgeT0iMTIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIiIHk9IjEyMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSIxMjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI0MiIgeT0iMTIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjAiIHk9IjEyMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjcyIiB5PSIxMjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5MCIgeT0iMTIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTAyIiB5PSIxMjAiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjEyMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEzMiIgeT0iMTIwIiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNiIgeT0iMTI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTIiIHk9IjEyNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjM2IiB5PSIxMjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI0MiIgeT0iMTI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjYiIHk9IjEyNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjcyIiB5PSIxMjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5NiIgeT0iMTI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTAyIiB5PSIxMjYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjYiIHk9IjEyNiIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjEzMiIgeT0iMTI2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMCIgeT0iMTM4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9IjEzOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjMwIiB5PSIxMzgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI1NCIgeT0iMTM4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjAiIHk9IjEzOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSIxMzgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5MCIgeT0iMTM4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSIxMzgiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjAiIHk9IjEzOCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iMTM4IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNiIgeT0iMTQ0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMjQiIHk9IjE0NCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjM2IiB5PSIxNDQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI1NCIgeT0iMTQ0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iNjYiIHk9IjE0NCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9Ijg0IiB5PSIxNDQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSI5NiIgeT0iMTQ0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PHJlY3QgeD0iMTE0IiB5PSIxNDQiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiLz48cmVjdCB4PSIxMjYiIHk9IjE0NCIgd2lkdGg9IjYiIGhlaWdodD0iNiIvPjxyZWN0IHg9IjE0NCIgeT0iMTQ0IiB3aWR0aD0iNiIgaGVpZ2h0PSI2Ii8+PC9nPjxyZWN0IHg9IjQ2IiB5PSI2MSIgd2lkdGg9IjYwIiBoZWlnaHQ9IjI1IiBmaWxsPSJ3aGl0ZSIvPjx0ZXh0IHg9Ijc1IiB5PSI4MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEzIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzE0MjEyYiI+U0FNUExFPC90ZXh0Pjwvc3ZnPg==" alt="Sample identification pattern, not scannable"><h2>${E(e.id)}</h2><p>${E(e.category)} · ${e.qty} units in this equipment group</p><p class="notice">Sample identification label. Use the equipment ID in inventory search; scanning is not implemented.</p><button onclick="window.print()">Print label</button></div>`,
            );
          }),
      );
    };
    equipmentBind();
    document
      .querySelector("#new-equipment")
      ?.addEventListener("click", () => equipmentModal());
    const equipmentFilter = () => {
      const s = SC.load(),
        q = document.querySelector("#equipment-search").value.toLowerCase(),
        cat = document.querySelector("[name=equipment-category]").value;
      document.querySelector("#equipment-table").innerHTML = equipmentTable(
        s,
        s.equipment.filter(
          (e) =>
            (cat === "All categories" || cat === e.category) &&
            (e.name + " " + e.category + " " + e.id).toLowerCase().includes(q),
        ),
      );
      equipmentBind();
    };
    document
      .querySelector("#equipment-search")
      ?.addEventListener("input", equipmentFilter);
    document
      .querySelector("[name=equipment-category]")
      ?.addEventListener("change", equipmentFilter);
    document
      .querySelectorAll("[data-reservation]")
      .forEach(
        (b) => (b.onclick = () => reservationModal(b.dataset.reservation)),
      );
    document
      .querySelector("#report-filter")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(e.target));
        if (d.from > d.to) {
          UI.toast("Start date must be before the end date.", true);
          return;
        }
        if ((new Date(d.to) - new Date(d.from)) / 86400000 > 1095) {
          UI.toast("Select a reporting period of 3 years or less.", true);
          return;
        }
        reportFrom = d.from;
        reportTo = d.to;
        render();
      });
    document
      .querySelector("#print-report")
      ?.addEventListener("click", () => window.print());
    document.querySelector("#export-report")?.addEventListener("click", () => {
      requireRole(["Owner"]);
      const s = SC.load(),
        r = reportData(s);
      const rows = [
        ["SCENIUM DEMONSTRATION REPORT", reportFrom, reportTo],
        ["Verified collections (payment date)", r.revenue],
        ["Outstanding (approved/completed event dates)", r.outstanding],
        [],
        [
          "Booking ID",
          "Event",
          "Event date",
          "Status",
          "Total",
          "Verified to date",
          "Outstanding",
        ],
        ...r.bs.map((b) => [
          b.id,
          b.title,
          b.date,
          b.status,
          b.total,
          SC.paid(s, b.id),
          SC.balance(s, b),
        ]),
        [],
        ["Verified collections in period"],
        ["Payment ID", "Booking ID", "Date", "Method", "Reference", "Amount"],
        ...r.ps.map((p) => [
          p.id,
          p.bookingId,
          p.date,
          p.method,
          p.reference,
          p.amount,
        ]),
      ];
      SC.csv(rows, "Scenium-report-" + reportFrom + "-to-" + reportTo + ".csv");
      UI.toast("Report downloaded.");
    });
    UI.bindNotifications(render);
  }
  function render() {
    try {
      const u = current();
      if (!u) {
        UI.auth("staff", () => {
          location.hash = "staff/dashboard";
          render();
        });
        return;
      }
      let r = location.hash.split("/")[1] || "dashboard";
      if (!menus[u.role].includes(r)) r = "dashboard";
      const s = SC.load();
      const pages = {
        dashboard: () => dashboard(s, u),
        bookings: () => bookings(s),
        calendar: () => calendar(s),
        payments: () => payments(s),
        users: () => users(s),
        customers: () => users(s, true),
        staff: () => staffPage(s),
        assignments: () =>
          head(
            "My assignments",
            "Your event schedules, locations and assigned duties.",
          ) +
          assignmentTable(
            s,
            s.assignments.filter((a) => a.userId === u.id),
          ),
        availability: () => availability(s, u),
        equipmentOverview: () => ownerEquipmentOverview(s),
        equipment: () => equipment(s),
        reservations: () => reservations(s),
        reports: () => reports(s),
        notifications: () => UI.notifications(s, u),
      };
      document.querySelector("#app").innerHTML = shell(pages[r](), r, u);
      bind();
    } catch (e) {
      document.querySelector("#app").innerHTML =
        `<div id="fatal" class="card"><h1>Unable to load workspace</h1><p>${E(e.message)}</p><p class="muted">Saved data could not be loaded. Follow the reset instructions supplied with this prototype.</p></div>`;
      console.error(e);
    }
  }
  return render;
};

// ==================== APP NAVIGATION ====================
window.addEventListener("DOMContentLoaded", () => {
  const renderers = { customer: createCustomerApp(), staff: createStaffApp() };
  function show() {
    UI.close();
    document.querySelector("dialog")?.remove();
    const area = location.hash.split("/")[0].slice(1) || "customer";
    (renderers[area] || renderers.customer)();
    document.querySelectorAll(".area-switch a").forEach((a) => {
      if (a.hash.startsWith("#" + area + "/"))
        a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", show);
  window.addEventListener("storage", (e) => {
    if (
      e.key === SC.KEY &&
      !document.querySelector("dialog[open]") &&
      !document.querySelector("form")
    )
      show();
  });
  show();
});
