"use strict";

// code.ts
var W = 390;
var CONTENT_W = 342;
var COL = {
  turquoise: { r: 0.169, g: 0.949, b: 0.945 },
  slate: { r: 0.031, g: 0.141, b: 0.133 },
  linen: { r: 0.992, g: 0.973, b: 0.957 },
  stone: { r: 0.937, g: 0.922, b: 0.906 },
  mocha: { r: 0.529, g: 0.471, b: 0.404 },
  concrete: { r: 0.812, g: 0.792, b: 0.749 },
  blueberry: { r: 0.376, g: 0.376, b: 0.749 },
  white: { r: 1, g: 1, b: 1 },
  black: { r: 0, g: 0, b: 0 },
  stripePurple: { r: 0.388, g: 0.357, b: 1 },
  stripeGreen: { r: 0, g: 0.839, b: 0.435 },
  whatsapp: { r: 0.133, g: 0.773, b: 0.369 }
};
var solid = (c) => ({ type: "SOLID", color: c });
var hFont = { family: "Inter", style: "Bold" };
var bFont = { family: "Inter", style: "Regular" };
var mFont = { family: "Inter", style: "Medium" };
var sFont = { family: "Inter", style: "Semi Bold" };
async function loadFonts() {
  const tryLoad = async (fam, sty, fb, fbs) => {
    try {
      const f = { family: fam, style: sty };
      await figma.loadFontAsync(f);
      return f;
    } catch (_e) {
      const f = { family: fb, style: fbs };
      await figma.loadFontAsync(f);
      return f;
    }
  };
  hFont = await tryLoad("Plain", "ExtraBold", "Inter", "Bold");
  bFont = await tryLoad("Saans", "Regular", "Inter", "Regular");
  mFont = await tryLoad("Saans", "Medium", "Inter", "Medium");
  sFont = await tryLoad("Saans", "SemiBold", "Inter", "Semi Bold");
}
function txt(s, sz, font, col, w, align) {
  const t = figma.createText();
  t.fontName = font;
  t.characters = s;
  t.fontSize = sz;
  t.fills = [solid(col)];
  if (w) {
    t.resize(w, t.height);
    t.textAutoResize = "HEIGHT";
  }
  if (align) t.textAlignHorizontal = align;
  return t;
}
function box(name, w, h, fill, r) {
  const b = figma.createRectangle();
  b.name = name;
  b.resize(w, h);
  b.fills = [solid(fill)];
  if (r) b.cornerRadius = r;
  return b;
}
function fr(name, dir, gap, w) {
  const f = figma.createFrame();
  f.name = name;
  f.fills = [];
  f.layoutMode = dir;
  f.itemSpacing = gap;
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  if (w) {
    f.resize(w, 1);
    f.counterAxisSizingMode = "FIXED";
  }
  return f;
}
function add(parent, child, fill) {
  parent.appendChild(child);
  if (fill && "layoutSizingHorizontal" in child) {
    child.layoutSizingHorizontal = "FILL";
  }
  return child;
}
function mkStatusBar() {
  const bar = fr("Status Bar", "HORIZONTAL", 0, W);
  bar.fills = [solid(COL.linen)];
  bar.paddingLeft = 24;
  bar.paddingRight = 24;
  bar.paddingTop = 8;
  bar.paddingBottom = 8;
  bar.primaryAxisAlignItems = "SPACE_BETWEEN";
  bar.counterAxisAlignItems = "CENTER";
  bar.appendChild(txt("9:41", 14, sFont, COL.slate));
  const icons = fr("Icons", "HORIZONTAL", 6);
  icons.appendChild(txt("\u25CF\u25CF\u25CF\u25CF", 10, bFont, COL.slate));
  icons.appendChild(txt("\u26A1", 10, bFont, COL.slate));
  bar.appendChild(icons);
  return bar;
}
function mkProgress(pct) {
  const track = fr("Progress", "HORIZONTAL", 0, W);
  track.resize(W, 3);
  track.counterAxisSizingMode = "FIXED";
  track.fills = [solid(COL.stone)];
  track.appendChild(box("Fill", Math.max(Math.round(W * pct), 1), 3, COL.turquoise));
  return track;
}
function mkHeader() {
  const h = fr("Header", "VERTICAL", 8, CONTENT_W);
  h.counterAxisAlignItems = "CENTER";
  h.paddingTop = 16;
  h.paddingBottom = 16;
  h.appendChild(txt("F\xE9lix", 28, hFont, COL.slate, void 0, "CENTER"));
  const badge = fr("Badge", "HORIZONTAL", 0);
  badge.fills = [solid(COL.turquoise)];
  badge.cornerRadius = 100;
  badge.paddingLeft = 12;
  badge.paddingRight = 12;
  badge.paddingTop = 6;
  badge.paddingBottom = 6;
  badge.appendChild(txt("Authorized UniTeller Agent", 12, sFont, COL.slate));
  h.appendChild(badge);
  return h;
}
function mkBtn(label, variant = "fill") {
  const b = fr("Btn: " + label, "HORIZONTAL", 0, CONTENT_W);
  b.primaryAxisAlignItems = "CENTER";
  b.counterAxisAlignItems = "CENTER";
  b.paddingTop = 14;
  b.paddingBottom = 14;
  b.cornerRadius = 100;
  if (variant === "fill") {
    b.fills = [solid(COL.turquoise)];
  } else {
    b.strokes = [solid(COL.slate)];
    b.strokeWeight = 2;
  }
  b.appendChild(txt(label, 16, sFont, COL.slate));
  return b;
}
function mkField(label, w = CONTENT_W) {
  const f = fr("Field: " + label, "VERTICAL", 0, w);
  f.fills = [solid(COL.white)];
  f.cornerRadius = 16;
  f.strokes = [solid(COL.concrete)];
  f.strokeWeight = 1;
  f.paddingLeft = 16;
  f.paddingRight = 16;
  f.paddingTop = 14;
  f.paddingBottom = 14;
  f.appendChild(txt(label, 14, bFont, COL.mocha));
  return f;
}
function mkPill(label) {
  const p = fr("Pill: " + label, "HORIZONTAL", 0);
  p.strokes = [solid(COL.mocha)];
  p.strokeWeight = 1;
  p.cornerRadius = 100;
  p.paddingLeft = 10;
  p.paddingRight = 10;
  p.paddingTop = 4;
  p.paddingBottom = 4;
  p.appendChild(txt(label, 11, mFont, COL.mocha));
  return p;
}
function mkDivText(label) {
  const row = fr("Divider", "HORIZONTAL", 12, CONTENT_W);
  row.counterAxisAlignItems = "CENTER";
  row.appendChild(box("Line", 110, 1, COL.concrete));
  row.appendChild(txt(label.toUpperCase(), 11, sFont, COL.concrete, void 0, "CENTER"));
  row.appendChild(box("Line", 110, 1, COL.concrete));
  return row;
}
function mkPayCard(title, desc, badges, selected) {
  const c = fr("Card: " + title, "VERTICAL", 8, CONTENT_W);
  c.fills = [solid(COL.white)];
  c.cornerRadius = 16;
  c.strokes = [solid(selected ? COL.turquoise : COL.concrete)];
  c.strokeWeight = selected ? 2 : 1;
  c.paddingLeft = 16;
  c.paddingRight = 16;
  c.paddingTop = 16;
  c.paddingBottom = 16;
  const tr = fr("Title", "HORIZONTAL", 8, CONTENT_W - 32);
  tr.primaryAxisAlignItems = "SPACE_BETWEEN";
  tr.counterAxisAlignItems = "CENTER";
  tr.appendChild(txt(title, 18, hFont, COL.slate));
  if (selected) {
    const sel = fr("Sel", "HORIZONTAL", 0);
    sel.fills = [solid(COL.turquoise)];
    sel.cornerRadius = 100;
    sel.paddingLeft = 10;
    sel.paddingRight = 10;
    sel.paddingTop = 4;
    sel.paddingBottom = 4;
    sel.appendChild(txt("Selected", 11, sFont, COL.slate));
    tr.appendChild(sel);
  }
  c.appendChild(tr);
  c.appendChild(txt(desc, 14, bFont, COL.mocha, CONTENT_W - 32));
  const br = fr("Badges", "HORIZONTAL", 8);
  for (const b of badges) br.appendChild(mkPill(b));
  c.appendChild(br);
  return c;
}
function mkSummaryRow(label, value) {
  const r = fr("Row: " + label, "HORIZONTAL", 0, CONTENT_W);
  r.primaryAxisAlignItems = "SPACE_BETWEEN";
  r.counterAxisAlignItems = "CENTER";
  r.paddingLeft = 16;
  r.paddingRight = 16;
  r.paddingTop = 12;
  r.paddingBottom = 12;
  r.appendChild(txt(label, 14, bFont, COL.mocha));
  r.appendChild(txt(value, 14, sFont, COL.slate));
  return r;
}
function mkCallout(title, body) {
  const c = fr("Callout", "VERTICAL", 4, CONTENT_W);
  c.fills = [solid({ r: 0.93, g: 0.93, b: 0.96 })];
  c.cornerRadius = 12;
  c.paddingLeft = 16;
  c.paddingRight = 16;
  c.paddingTop = 14;
  c.paddingBottom = 14;
  c.appendChild(txt("\u{1F512} " + title, 13, sFont, COL.blueberry));
  c.appendChild(txt(body, 12, bFont, COL.blueberry, CONTENT_W - 32));
  return c;
}
function mkPhone(name, pct, content) {
  const phone = fr(name, "VERTICAL", 0, W);
  phone.resize(W, 844);
  phone.counterAxisSizingMode = "FIXED";
  phone.primaryAxisSizingMode = "FIXED";
  phone.fills = [solid(COL.linen)];
  phone.cornerRadius = 52;
  phone.clipsContent = true;
  phone.appendChild(mkStatusBar());
  phone.appendChild(mkProgress(pct));
  add(phone, content, true);
  if ("layoutSizingVertical" in content) content.layoutSizingVertical = "FILL";
  const home = fr("Home", "HORIZONTAL", 0, W);
  home.primaryAxisAlignItems = "CENTER";
  home.counterAxisAlignItems = "CENTER";
  home.paddingTop = 8;
  home.paddingBottom = 8;
  home.appendChild(box("Bar", 134, 5, COL.slate, 100));
  phone.appendChild(home);
  return phone;
}
function s01_PaymentMethod() {
  const c = fr("Content", "VERTICAL", 16, W);
  c.fills = [solid(COL.linen)];
  c.paddingLeft = 24;
  c.paddingRight = 24;
  c.paddingBottom = 24;
  c.appendChild(mkHeader());
  c.appendChild(txt("How do you want to pay?", 26, hFont, COL.slate, CONTENT_W));
  c.appendChild(mkDivText("Express Pay"));
  const ap = fr("Apple Pay", "HORIZONTAL", 0, CONTENT_W);
  ap.fills = [solid(COL.black)];
  ap.cornerRadius = 12;
  ap.paddingTop = 16;
  ap.paddingBottom = 16;
  ap.primaryAxisAlignItems = "CENTER";
  ap.counterAxisAlignItems = "CENTER";
  ap.appendChild(txt(" Pay", 20, sFont, COL.white));
  c.appendChild(ap);
  c.appendChild(mkDivText("or pay another way"));
  c.appendChild(mkPayCard("Credit/debit card", "Credit cards may carry extra fees.", ["No fee for debit", "Instant"], true));
  c.appendChild(mkPayCard("Bank account", "Checking or savings account.", ["No fee", "1\u20133 business days"], false));
  c.appendChild(mkPayCard("Cash at a store", "Pay cash at a store near you.", ["$3.95", "Same day"], false));
  c.appendChild(mkBtn("Continue"));
  return mkPhone("01 \xB7 Payment Method", 0.1, c);
}
function s02_Address() {
  const c = fr("Content", "VERTICAL", 12, W);
  c.fills = [solid(COL.linen)];
  c.paddingLeft = 24;
  c.paddingRight = 24;
  c.paddingBottom = 24;
  c.appendChild(mkHeader());
  c.appendChild(txt("What's the billing address on your card?", 26, hFont, COL.slate, CONTENT_W));
  c.appendChild(mkField("Address *"));
  c.appendChild(mkField("Apt, suite, or floor"));
  c.appendChild(mkField("ZIP Code *"));
  c.appendChild(mkField("City *"));
  c.appendChild(mkField("State *"));
  c.appendChild(mkBtn("Continue"));
  c.appendChild(mkBtn("Previous", "outline"));
  return mkPhone("02 \xB7 Address", 0.3, c);
}
function s03_CardDetails() {
  const c = fr("Content", "VERTICAL", 12, W);
  c.fills = [solid(COL.linen)];
  c.paddingLeft = 24;
  c.paddingRight = 24;
  c.paddingBottom = 24;
  c.appendChild(mkHeader());
  c.appendChild(txt("Enter your card details", 26, hFont, COL.slate, CONTENT_W));
  c.appendChild(mkField("Full name on card *"));
  c.appendChild(txt("If your card shows a bank name, enter the account holder's name.", 12, bFont, COL.mocha, CONTENT_W));
  c.appendChild(mkField("Card number *"));
  const row = fr("Row", "HORIZONTAL", 12, CONTENT_W);
  row.appendChild(mkField("Expiry date *", 165));
  row.appendChild(mkField("CVV *", 165));
  c.appendChild(row);
  c.appendChild(txt("By tapping Continue, you agree to our terms and conditions and privacy policy.", 11, bFont, COL.mocha, CONTENT_W));
  c.appendChild(mkCallout("Your payment is safe with us", "Encrypted with 256-bit SSL \u2014 your info stays private."));
  c.appendChild(mkBtn("Continue"));
  c.appendChild(mkBtn("Previous", "outline"));
  return mkPhone("03 \xB7 Card Details", 0.5, c);
}
function s04_Review() {
  const c = fr("Content", "VERTICAL", 16, W);
  c.fills = [solid(COL.linen)];
  c.paddingLeft = 24;
  c.paddingRight = 24;
  c.paddingBottom = 24;
  c.appendChild(mkHeader());
  c.appendChild(txt("Review your transfer to Patricia Caballero", 26, hFont, COL.slate, CONTENT_W));
  const card = fr("Summary", "VERTICAL", 0, CONTENT_W);
  card.fills = [solid(COL.white)];
  card.cornerRadius = 16;
  card.strokes = [solid(COL.concrete)];
  card.strokeWeight = 1;
  card.appendChild(mkSummaryRow("You send", "\u{1F1FA}\u{1F1F8} USD $10.00"));
  card.appendChild(box("Div", CONTENT_W, 1, COL.stone));
  card.appendChild(mkSummaryRow("Recipient gets", "\u{1F1F2}\u{1F1FD} MXN $174.20"));
  card.appendChild(box("Div", CONTENT_W, 1, COL.stone));
  card.appendChild(mkSummaryRow("Payment method", "**** 5164"));
  card.appendChild(box("Div", CONTENT_W, 1, COL.stone));
  card.appendChild(mkSummaryRow("Amount + fees", "USD $10.00"));
  c.appendChild(card);
  c.appendChild(mkBtn("Send now"));
  c.appendChild(mkBtn("Previous", "outline"));
  c.appendChild(txt("For questions or complaints about Zero Hash LLC, contact your state's regulatory agency. Learn more.", 11, bFont, COL.mocha, CONTENT_W));
  return mkPhone("04 \xB7 Review", 0.75, c);
}
function s05_Success() {
  const c = fr("Content", "VERTICAL", 16, W);
  c.fills = [solid(COL.linen)];
  c.paddingLeft = 24;
  c.paddingRight = 24;
  c.paddingBottom = 24;
  c.counterAxisAlignItems = "CENTER";
  c.appendChild(mkHeader());
  c.appendChild(box("Illo", 120, 120, COL.stone, 60));
  c.appendChild(txt("Your payment went through!", 26, hFont, COL.slate, CONTENT_W, "CENTER"));
  c.appendChild(txt("\u{1F4B8} Patricia Caballero will receive 52.26 MXN for your $3 USD transfer.", 14, bFont, COL.mocha, 300, "CENTER"));
  const ref = fr("Referral", "VERTICAL", 8, CONTENT_W);
  ref.fills = [solid(COL.slate)];
  ref.cornerRadius = 16;
  ref.paddingLeft = 20;
  ref.paddingRight = 20;
  ref.paddingTop = 20;
  ref.paddingBottom = 20;
  ref.appendChild(txt("Earn up to $1,000 USD", 20, hFont, COL.white, CONTENT_W - 40));
  ref.appendChild(txt("Earn $20 USD for each friend who makes their first transfer", 13, bFont, { r: 0.7, g: 0.7, b: 0.7 }, CONTENT_W - 40));
  const wa = fr("WA", "HORIZONTAL", 0, CONTENT_W - 40);
  wa.fills = [solid(COL.whatsapp)];
  wa.cornerRadius = 100;
  wa.paddingTop = 12;
  wa.paddingBottom = 12;
  wa.primaryAxisAlignItems = "CENTER";
  wa.counterAxisAlignItems = "CENTER";
  wa.appendChild(txt("Share on WhatsApp", 14, sFont, COL.white));
  ref.appendChild(wa);
  c.appendChild(ref);
  c.appendChild(mkBtn("Back to WhatsApp", "outline"));
  return mkPhone("05 \xB7 Success", 1, c);
}
function s06_BankConsent() {
  const c = fr("Content", "VERTICAL", 16, W);
  c.fills = [solid(COL.linen)];
  c.paddingLeft = 24;
  c.paddingRight = 24;
  c.paddingBottom = 24;
  c.appendChild(mkHeader());
  c.appendChild(txt("Consent for bank charges", 26, hFont, COL.slate, CONTENT_W));
  c.appendChild(txt("By clicking I agree, you authorize F\xE9lix Pago to charge the previously specified bank account for any amount owed for expenses derived from the use of F\xE9lix Pago services and/or the purchase of F\xE9lix Pago products, in accordance with the website and the terms of F\xE9lix Pago, until this authorization is revoked. You may modify or cancel this authorization at any time by notifying F\xE9lix Pago.", 14, bFont, COL.mocha, CONTENT_W));
  c.appendChild(mkBtn("I agree"));
  c.appendChild(mkBtn("Previous", "outline"));
  return mkPhone("06 \xB7 Bank Consent", 0.3, c);
}
function s07_BankConnect() {
  const c = fr("Content", "VERTICAL", 12, W);
  c.fills = [solid(COL.linen)];
  c.paddingLeft = 24;
  c.paddingRight = 24;
  c.paddingBottom = 24;
  c.appendChild(mkHeader());
  c.appendChild(txt("Connect your account", 26, hFont, COL.slate, CONTENT_W));
  c.appendChild(txt("Enter the account holder's information", 14, bFont, COL.mocha, CONTENT_W));
  c.appendChild(mkField("First name *"));
  c.appendChild(mkField("Middle name"));
  c.appendChild(mkField("Last name *"));
  c.appendChild(mkBtn("Link account"));
  c.appendChild(mkBtn("Previous", "outline"));
  return mkPhone("07 \xB7 Bank Connect", 0.4, c);
}
function s08_StripeBankSelect() {
  const c = fr("Content", "VERTICAL", 0, W);
  c.fills = [solid(COL.white)];
  const hdr = fr("Stripe Hdr", "HORIZONTAL", 0, W);
  hdr.fills = [solid(COL.stripePurple)];
  hdr.paddingLeft = 20;
  hdr.paddingRight = 20;
  hdr.paddingTop = 16;
  hdr.paddingBottom = 16;
  hdr.primaryAxisAlignItems = "SPACE_BETWEEN";
  hdr.counterAxisAlignItems = "CENTER";
  hdr.appendChild(txt("stripe", 18, hFont, COL.white));
  hdr.appendChild(txt("\u2715", 16, bFont, COL.white));
  c.appendChild(hdr);
  const body = fr("Body", "VERTICAL", 12, W);
  body.paddingLeft = 20;
  body.paddingRight = 20;
  body.paddingTop = 16;
  body.appendChild(txt("Select your bank", 22, hFont, COL.slate, W - 40));
  body.appendChild(mkField("Search", W - 40));
  for (const bank of ["Chase", "Bank of America", "Wells Fargo", "Citi", "US Bank", "Capital One"]) {
    const row = fr(bank, "HORIZONTAL", 12, W - 40);
    row.counterAxisAlignItems = "CENTER";
    row.paddingTop = 12;
    row.paddingBottom = 12;
    row.appendChild(box("Icon", 32, 32, COL.stone, 8));
    const col = fr("Info", "VERTICAL", 2);
    col.appendChild(txt(bank, 14, sFont, COL.slate));
    col.appendChild(txt(bank.toLowerCase().replace(/ /g, "") + ".com", 11, bFont, COL.mocha));
    row.appendChild(col);
    body.appendChild(row);
  }
  c.appendChild(body);
  return mkPhone("08 \xB7 Stripe Bank Select", 0.5, c);
}
function s09_StripeIntro() {
  const c = fr("Content", "VERTICAL", 0, W);
  c.fills = [solid(COL.white)];
  const hdr = fr("Stripe Hdr", "HORIZONTAL", 0, W);
  hdr.fills = [solid(COL.stripePurple)];
  hdr.paddingLeft = 20;
  hdr.paddingRight = 20;
  hdr.paddingTop = 16;
  hdr.paddingBottom = 16;
  hdr.primaryAxisAlignItems = "SPACE_BETWEEN";
  hdr.counterAxisAlignItems = "CENTER";
  hdr.appendChild(txt("stripe", 18, hFont, COL.white));
  hdr.appendChild(txt("\u2715", 16, bFont, COL.white));
  c.appendChild(hdr);
  const body = fr("Body", "VERTICAL", 20, W);
  body.paddingLeft = 20;
  body.paddingRight = 20;
  body.paddingTop = 24;
  body.counterAxisAlignItems = "CENTER";
  body.appendChild(txt("F\xE9lix uses Stripe to connect your accounts", 20, hFont, COL.slate, W - 60, "CENTER"));
  for (const [t, d] of [["\u26A1 Fast and simple", "Connect your account in seconds."], ["\u{1F512} Your data is encrypted", "F\xE9lix can access your data. You can disconnect at any time."]]) {
    const feat = fr("Feat", "VERTICAL", 4);
    feat.counterAxisAlignItems = "CENTER";
    feat.appendChild(txt(t, 14, sFont, COL.slate, void 0, "CENTER"));
    feat.appendChild(txt(d, 12, bFont, COL.mocha, 280, "CENTER"));
    body.appendChild(feat);
  }
  body.appendChild(txt("By continuing, you accept Stripe's Terms and Privacy Policy.", 11, bFont, COL.mocha, 300, "CENTER"));
  const btn = fr("Accept", "HORIZONTAL", 0, CONTENT_W);
  btn.fills = [solid(COL.stripePurple)];
  btn.cornerRadius = 100;
  btn.paddingTop = 14;
  btn.paddingBottom = 14;
  btn.primaryAxisAlignItems = "CENTER";
  btn.counterAxisAlignItems = "CENTER";
  btn.appendChild(txt("Accept and continue", 16, sFont, COL.white));
  body.appendChild(btn);
  body.appendChild(txt("Or verify manually (may take 1\u20132 business days)", 12, bFont, COL.blueberry, void 0, "CENTER"));
  c.appendChild(body);
  return mkPhone("09 \xB7 Stripe Intro", 0.55, c);
}
function s10_StripeCompleted() {
  const c = fr("Content", "VERTICAL", 0, W);
  c.fills = [solid(COL.white)];
  const hdr = fr("Stripe Hdr", "HORIZONTAL", 0, W);
  hdr.fills = [solid(COL.stripePurple)];
  hdr.paddingLeft = 20;
  hdr.paddingRight = 20;
  hdr.paddingTop = 16;
  hdr.paddingBottom = 16;
  hdr.primaryAxisAlignItems = "CENTER";
  hdr.counterAxisAlignItems = "CENTER";
  hdr.appendChild(txt("stripe", 18, hFont, COL.white));
  c.appendChild(hdr);
  const body = fr("Body", "VERTICAL", 16, W);
  body.paddingTop = 80;
  body.counterAxisAlignItems = "CENTER";
  body.appendChild(box("Check", 64, 64, COL.stripeGreen, 32));
  body.appendChild(txt("Completed successfully", 22, hFont, COL.slate, void 0, "CENTER"));
  body.appendChild(txt("Your account has been connected.", 14, bFont, COL.mocha, void 0, "CENTER"));
  const btn = fr("Done", "HORIZONTAL", 0, CONTENT_W);
  btn.fills = [solid(COL.stripePurple)];
  btn.cornerRadius = 100;
  btn.paddingTop = 14;
  btn.paddingBottom = 14;
  btn.primaryAxisAlignItems = "CENTER";
  btn.counterAxisAlignItems = "CENTER";
  btn.appendChild(txt("Done", 16, sFont, COL.white));
  body.appendChild(btn);
  c.appendChild(body);
  return mkPhone("10 \xB7 Stripe Completed", 0.65, c);
}
function s11_StoreSelection() {
  const c = fr("Content", "VERTICAL", 12, W);
  c.fills = [solid(COL.linen)];
  c.paddingLeft = 24;
  c.paddingRight = 24;
  c.paddingBottom = 24;
  c.appendChild(mkHeader());
  c.appendChild(txt("Where do you want to pay?", 26, hFont, COL.slate, CONTENT_W));
  c.appendChild(mkField("8040 Brothers Walk Lane, Jacksonville"));
  c.appendChild(box("Map", CONTENT_W, 200, COL.stone, 16));
  for (const store of ["Walgreens", "CVS Pharmacy", "7-Eleven"]) {
    const card = fr(store, "HORIZONTAL", 10, CONTENT_W);
    card.fills = [solid(COL.white)];
    card.cornerRadius = 12;
    card.strokes = [solid(COL.concrete)];
    card.strokeWeight = 1;
    card.paddingLeft = 12;
    card.paddingRight = 12;
    card.paddingTop = 12;
    card.paddingBottom = 12;
    card.counterAxisAlignItems = "CENTER";
    card.appendChild(box("Logo", 36, 36, COL.stone, 8));
    const info = fr("Info", "VERTICAL", 2);
    info.appendChild(txt(store, 14, sFont, COL.slate));
    info.appendChild(txt("$3.95 store fee", 11, bFont, COL.mocha));
    card.appendChild(info);
    c.appendChild(card);
  }
  c.appendChild(txt("Service provided by Green Dot\xAE", 10, bFont, COL.mocha, CONTENT_W));
  c.appendChild(mkBtn("Previous", "outline"));
  return mkPhone("11 \xB7 Store Selection", 0.4, c);
}
async function main() {
  await loadFonts();
  const screens = [
    s01_PaymentMethod(),
    s02_Address(),
    s03_CardDetails(),
    s04_Review(),
    s05_Success(),
    s06_BankConsent(),
    s07_BankConnect(),
    s08_StripeBankSelect(),
    s09_StripeIntro(),
    s10_StripeCompleted(),
    s11_StoreSelection()
  ];
  let x = 0;
  for (const s of screens) {
    s.x = x;
    s.y = 40;
    figma.currentPage.appendChild(s);
    const lbl = txt(s.name, 14, sFont, COL.mocha);
    lbl.x = x;
    lbl.y = 10;
    figma.currentPage.appendChild(lbl);
    x += W + 80;
  }
  figma.viewport.scrollAndZoomIntoView(screens);
  figma.notify("\u2705 Generated " + screens.length + " screens");
  figma.closePlugin();
}
main();
