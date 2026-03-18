# Data Visualization Slide Prompt Library for Claude Code
## 50 Prompts for Product Development & Data Team Presentations

Use each prompt with Claude Code to generate a single responsive HTML/CSS slide wireframe in greyscale. Each prompt is self-contained. Use IBM Plex Sans/Serif/Mono fonts and a greyscale palette (#0d0d0d, #222, #555, #888, #bbb, #ddd, #efefef, #fff).

---

## Metrics (Slides 1–4)

### Slide 1 — Hero Metric
Create a responsive HTML/CSS slide wireframe for a single hero metric. White background. Section label "METRICS" in small spaced uppercase. Serif title "Monthly Active Users." Centered layout with an enormous monospace bold number "2.4M" (80px+ using clamp), a muted label "as of March 2026" below, and two inline pill tags: one dark pill "+18.2% MoM" and one light pill "+142% YoY." Slide number bottom-right. Use IBM Plex Mono for the number, IBM Plex Serif for the title.

### Slide 2 — Hero Metric + Sparkline
Create a responsive HTML/CSS slide wireframe for a hero metric with an accompanying trend line. White background. Section label, serif title "Revenue Run Rate." Side-by-side layout (stacks on mobile): left has large mono bold "$18.4M" with "ARR" label and a dark pill "+24% YoY." Right is a chart area (light gray background, bordered) containing an inline SVG sparkline — a single polyline trending upward over ~10 data points with a subtle area fill below. Use clamp() for responsive height.

### Slide 3 — KPI Grid (4-up)
Create a responsive HTML/CSS slide wireframe for a 4-metric KPI grid. White background. Section label, serif title "Key Performance Indicators." 4-column responsive grid (stacks to 2x2, then 1 column on mobile). Each cell is a card with centered stat: large mono bold value (2.4M, $18.4M, 4.2%, 68) and a small muted label below (MAU, ARR, Churn, NPS). Cards have subtle border and shadow.

### Slide 4 — KPI Grid + Trend Arrows
Create a responsive HTML/CSS slide wireframe for a 4-metric KPI grid with inline sparklines and directional indicators. White background. Section label, serif title "Weekly Snapshot." 4-column grid (stacks on mobile). Each card contains: large mono bold value, muted label, a row showing "↑ 12%" in bold dark text + "vs prior week" in muted text, and a small chart area (32px tall) with an inline SVG sparkline (8 data points). Different cards show upward and downward trends. Use different stroke colors (dark for good trends, muted/light for concerning ones).

## Bar Charts (Slides 5–10)

### Slide 5 — Vertical Bar Chart
Create a responsive HTML/CSS slide wireframe for a vertical bar chart showing monthly revenue. White background. Section label, serif title "Monthly Revenue." Chart area (light gray bg, bordered) containing 12 vertical bars (Jan–Dec) built with CSS flexbox. Each bar has: a small mono value label above, a colored fill div (height as percentage, using gradient from lightest gray for earliest months to darkest for latest), and a month label below. Bars flex to fill width responsively. Use clamp() for chart height (160–240px).

### Slide 6 — Horizontal Bar Chart
Create a responsive HTML/CSS slide wireframe for a horizontal bar chart showing users by channel. White background. Section label, serif title "Users by Acquisition Channel." 6 horizontal bar rows. Each row: right-aligned label (80–100px wide using clamp), a track div (full width, light gray bg), a fill div inside (positioned absolute, width as percentage, varying greyscale from darkest to lightest by rank), and a mono value at the end. Labels: Organic Search (78K), Referral (62K), Paid Social (45K), Direct (38K), Email (24K), Partnerships (15K). Responsive gap using clamp().

### Slide 7 — Grouped Bar Chart
Create a responsive HTML/CSS slide wireframe for a grouped bar chart comparing Q3 vs Q4 revenue by product. White background. Section label, serif title "Revenue by Product — Q3 vs Q4." Chart area with 4 groups (Core, Enterprise, Platform, Other). Each group contains two side-by-side bars — one medium gray (Q3) and one dark (Q4) — with different heights. Value label above each group. Month labels below. Legend centered underneath with colored squares and text (Q3, Q4). Built with CSS flexbox, responsive.

### Slide 8 — Stacked Bar Chart
Create a responsive HTML/CSS slide wireframe for a stacked bar chart showing support tickets by category over 6 months. White background. Section label, serif title "Support Tickets by Category." Chart area with 6 vertical bars (Jan–Jun). Each bar is a CSS flex column containing 4 stacked segments in different greyscale shades (dark=Billing, medium=Technical, light=Account, lightest=Other). Bars vary in total height. Month labels below. Legend row centered underneath with 4 items.

### Slide 9 — 100% Stacked Bar
Create a responsive HTML/CSS slide wireframe for a 100% stacked horizontal bar chart showing traffic source mix over time. White background. Section label, serif title "Traffic Source Mix Over Time." 4 horizontal rows (Q1–Q4), each with a label and a full-width bar divided into 4 segments using CSS flexbox (different percentages per quarter). Segments use 4 greyscale shades. Legend row underneath. Each bar has consistent total width (100%) with segment proportions shifting across quarters to show trend.

### Slide 10 — Waterfall Chart
Create a responsive HTML/CSS slide wireframe for a waterfall chart showing a revenue bridge from Q3 to Q4. White background. Section label, serif title "Revenue Bridge — Q3 to Q4." Chart area with 6 columns: Q3 Revenue (dark, tall, starting from bottom), New Customers (+$1.4M, floating segment above Q3), Expansion (+$0.8M, floating), Churn (-$0.6M, lighter color), Downgrade (-$0.3M, lighter), Q4 Revenue (dark, taller than Q3). Positive additions in medium gray, negative in light gray. Values above each column.

## Line & Area Charts (Slides 11–14)

### Slide 11 — Single Line Chart
Create a responsive HTML/CSS slide wireframe for a single line chart. White background. Section label, serif title "Daily Active Users — 30 Day Trend." Chart area (light gray bg, bordered, 120–180px height using clamp). Contains an inline SVG with: left Y-axis labels (600K, 400K, 200K) in small text, a bottom X-axis line, a polyline with ~30 data points trending upward (stroke dark, width 2), and a filled polygon underneath the line with light opacity. SVG uses viewBox and preserveAspectRatio="none" for full responsive fill.

### Slide 12 — Multi-Line Chart
Create a responsive HTML/CSS slide wireframe for a multi-line chart comparing 3 cohort retention curves. White background. Section label, serif title "Retention by Cohort." Chart area with inline SVG containing: a bottom axis line, a dashed horizontal midpoint line at 50%, and 3 polylines — one dark (Jan cohort, best retention), one medium gray (Feb, middle), one light dashed (Mar, worst). Lines start together at 100% on the left and diverge as they move right. Legend row below with line style samples and cohort labels.

### Slide 13 — Area Chart
Create a responsive HTML/CSS slide wireframe for an area chart on a dark background (#0d0d0d). Section label, serif title "Cumulative Revenue" in white. Chart area (very dark bg, dark border) with inline SVG: a filled polygon with medium gray fill at 30% opacity rising from bottom-left to upper-right, and a polyline stroke on top (medium gray, 2px). X-axis labels below the chart (Jan, Mar, Jun, Sep, Dec) in muted text.

### Slide 14 — Sparkline Grid
Create a responsive HTML/CSS slide wireframe for a 2x2 grid of metric cards with inline sparklines. White background. Section label, serif title "Metric Trends — Last 12 Weeks." 2-column grid (stacks on mobile). Each card is a horizontal flex layout: left side has metric name (bold), value (muted), and a change pill; right side is a small chart area (flex:1, 40px height) with an SVG sparkline (12 data points). 4 cards: MAU (+18%, upward line, dark stroke), Revenue (+24%, upward, dark), NPS (+4pts, upward, medium stroke), Churn (-0.8pp, downward line, light stroke — this one trends worse).

## Part-to-Whole (Slides 15–17)

### Slide 15 — Donut Chart
Create a responsive HTML/CSS slide wireframe for a donut chart with legend. White background. Section label, serif title "Revenue by Region." Side-by-side layout (stacks on mobile): left is a donut chart built with SVG circles using stroke-dasharray technique — 4 segments in different greyscale shades (dark 44%, medium 26%, light 20%, lightest 10%) on a circle with r=38, stroke-width=14. Center has total value "$18.4M" in mono bold and "Total" label absolutely positioned. Right side has "BREAKDOWN" label and 4 legend entries, each with: colored square, bold name + percentage, and muted dollar amount on second line.

### Slide 16 — Treemap
Create a responsive HTML/CSS slide wireframe for a treemap showing feature usage distribution. White background. Section label, serif title "Feature Usage Distribution." CSS Grid layout (3 columns, 2 rows) with cells of different sizes to represent proportions. Largest cell (Send Money 42%) spans 2 rows in the first column, dark background with white text. Medium cells: Check Balance 24% (medium gray), History 12% (medium-light). Small cells: Settings 8%, Other 14% (lightest grays). Each cell has centered feature name and percentage. Gap of 3px. Use aspect ratios and responsive height with clamp().

### Slide 17 — Funnel Chart
Create a responsive HTML/CSS slide wireframe for a conversion funnel. White background. Section label, serif title "Conversion Funnel." 5 centered horizontal bars, each progressively narrower, stacked vertically with small gaps. Widths: Visit 100%, Sign Up 82%, Activate 58%, Convert 36%, Retain D30 20%. Colors darken from top (darkest) to bottom (lightest). Each bar has centered white text showing stage name, count, and percentage. Below the funnel: a left-bordered card with analysis text about the biggest drop-off point.

## Heatmaps & Distributions (Slides 18–22)

### Slide 18 — Cohort Retention Heatmap
Create a responsive HTML/CSS slide wireframe for a cohort retention heatmap table. White background. Section label, serif title "Cohort Retention Heatmap." Table with header row: Cohort, M0, M1, M2, M3, M4, M5, M6. 5 data rows (Jan–May). M0 column is always 100% with darkest background. Values decrease left-to-right (68%, 52%, 44%, etc.) with progressively lighter cell backgrounds — darker cells for higher retention, lighter for lower. Later cohorts have empty cells (data not yet available). Muted annotation below noting improving M1 trend. Horizontally scrollable on mobile.

### Slide 19 — Scatter Plot
Create a responsive HTML/CSS slide wireframe for a scatter plot. White background. Section label, serif title "Feature Engagement vs. Retention Impact." Chart area (light gray bg) with inline SVG: X and Y axis lines, dashed midpoint lines creating quadrants, ~8 circles of varying sizes (6–10px radius) and greyscale shades positioned across the quadrant space. Top-right quadrant has the darkest/largest dots. Axis labels: "Feature Engagement →" (bottom), "Retention Impact →" (left, rotated). Muted annotation below explaining that bubble size = user volume.

### Slide 20 — Bubble Chart
Create a responsive HTML/CSS slide wireframe for a bubble chart showing market opportunities. Light gray background. Section label, serif title "Market Opportunity Map." Chart area (white bg) with inline SVG: X and Y axes, 5 circles of different sizes representing markets (US largest ~r=28, MX ~r=20, BR ~r=16, UK ~r=14, CO ~r=10). Circles have light fills with opacity and greyscale strokes. Each circle has a centered text label (country code). Axis labels for Market Size and Growth Rate. Muted annotation below.

### Slide 21 — Histogram
Create a responsive HTML/CSS slide wireframe for a histogram showing transaction value distribution. White background. Section label, serif title "Transaction Value Distribution." Chart area with 8 vertical bars built with CSS flexbox, representing value buckets ($0-50 through $2K+). Heights form a bell-curve-ish shape — short, taller, peak around $200-300, then tapering. Fills use greyscale gradient (lightest at tails, darkest at peak). Bucket labels below. Footer row showing Median, Mean, and sample size in muted mono text.

### Slide 22 — Distribution / Box Plot
Create a responsive HTML/CSS slide wireframe for box plots comparing response time across 3 tiers. White background. Section label, serif title "Response Time Distribution by Tier." 3 horizontal box plot rows (Free, Pro, Enterprise). Each row has: right-aligned tier label, a box plot built with CSS (horizontal line for whiskers, a filled rectangle for IQR box, a vertical line for median), and a mono value showing the median. Enterprise has the tightest/fastest distribution (darkest fill, leftmost), Free has the widest/slowest (lightest fill, rightmost). Muted annotation explaining IQR and whiskers.

## Tables & Ranked Lists (Slides 23–24)

### Slide 23 — Data Table with Conditional Formatting
Create a responsive HTML/CSS slide wireframe for a data table with cell-level conditional formatting. White background. Section label, serif title "Feature Performance Scorecard." Table with header: Feature, DAU, Retention, Revenue, Satisfaction, Score. 5 feature rows. Each numeric cell has a background color based on relative value — darkest for highest values, lightest for lowest — creating a heatmap effect within the table. Score column (A+, B+, B, A, C) in bold with no shading. Muted annotation below explaining that darker = higher performance. Horizontally scrollable on mobile.

### Slide 24 — Ranked List with Bars
Create a responsive HTML/CSS slide wireframe for a ranked list with horizontal bars. White background. Section label, serif title "Top 10 Error Codes by Frequency." 8 horizontal bar rows (truncated for layout). Each row: monospace label (ERR_XXXX format, right-aligned), a track with a proportional fill bar (darkest for #1, progressively lighter), and a mono value count. Bars descend from ~12,847 to ~1,028. No chart area wrapper needed — clean list layout.

## Comparisons (Slides 25–33)

### Slide 25 — Bullet Chart / Benchmark
Create a responsive HTML/CSS slide wireframe for bullet charts showing KPI performance vs targets. White background. Section label, serif title "KPI Performance vs. Target." 4 horizontal bullet chart rows (Revenue, Users, NPS, Churn). Each row: right-aligned label, a layered bar visualization built with CSS (background light gray track, a medium gray "acceptable" range zone at ~75% width, a dark "actual" bar at specific width, and a thin vertical black target marker line positioned absolutely), and a mono percentage value. Legend row below with 3 items (Actual, Target line, Acceptable range).

### Slide 26 — Progress Toward Goal
Create a responsive HTML/CSS slide wireframe for progress-toward-goal visualizations. White background. Section label, serif title "Progress Toward Annual Goals." 3-column card grid (stacks on mobile). Each card has: bold metric name, muted "current / target" text, a thick progress bar (clamp 12–16px height) with dark fill at varying widths (84%, 70%, 67%), and a footer row with "% complete" on left and "remaining" in mono on right.

### Slide 27 — Before / After Comparison
Create a responsive HTML/CSS slide wireframe for a before/after metric comparison. White background. Section label, serif title "Before / After — Key Metrics." 4-column card grid (stacks on mobile). Each card centered with: uppercase label (Onboarding Time, Activation Rate, Support Tickets, CSAT), a struck-through old value in muted/light text (smaller font), a large bold dark new value below, and a dark pill showing the percentage change (e.g., "-71%", "+82%"). Clear visual hierarchy: old value faded, new value prominent.

### Slide 28 — Annotated Time Series
Create a responsive HTML/CSS slide wireframe for a time series chart with event annotations. White background. Section label, serif title "Revenue with Event Annotations." Chart area with inline SVG: an ascending polyline (dark, 2.5px stroke) over ~13 data points with two vertical dashed annotation lines at specific x-positions. Each annotation line has a small text label at the top ("Launch v2.0", "Price Change"). Clean and minimal — the annotations are the focal point.

### Slide 29 — Small Multiples
Create a responsive HTML/CSS slide wireframe for a small multiples chart grid. White background. Section label, serif title "Engagement by Feature — Small Multiples." 3x2 responsive card grid (stacks on mobile). Each card: bold feature name, a mini chart area (48px tall) with a 7-point SVG sparkline, and a mono change indicator (+32% ↑, +12% ↑, -8% ↓, +48% ↑, +1% →, -18% ↓). Upward trends get dark strokes, flat gets medium, downward gets light. Consistent card sizing.

### Slide 30 — Slope Chart
Create a responsive HTML/CSS slide wireframe for a slope chart showing Q3→Q4 metric shifts. White background. Section label, serif title "Slope Chart — Metric Shift Q3 → Q4." Chart area with inline SVG. Two vertical axis lines (Q3 on left, Q4 on right) with column headers. 4 connecting lines between axes, each representing a metric: Revenue ($8.2M → $9.5M, dark, sloping up), Users (1.8M → 2.1M, medium, up), Churn (3.8% → 4.2%, light, sloping down = bad), NPS (62 → 68, dark, up). Value labels at both endpoints. Lines at different vertical positions to avoid overlap.

### Slide 31 — Lollipop Chart
Create a responsive HTML/CSS slide wireframe for a lollipop chart showing feature adoption rates. White background. Section label, serif title "Feature Adoption Rate." 4 horizontal lollipop rows. Each row: right-aligned feature label, a horizontal line from left edge with a circle (dot) at the end positioned at the percentage point (78%, 65%, 42%, 18%), and a mono value. The vertical start line and the horizontal line + dot create the "lollipop" shape. Darkest for highest adoption, lightest for lowest. No chart area wrapper needed — clean layout.

### Slide 32 — Diverging Bar Chart
Create a responsive HTML/CSS slide wireframe for a diverging horizontal bar chart showing sentiment by feature. White background. Section label, serif title "Sentiment by Feature." 4 horizontal rows. Each row: right-aligned feature label, and a full-width bar divided into 3 segments (Positive=dark, Neutral=medium, Negative=light) using CSS flexbox. Segment proportions vary per feature (e.g., Quick Send: 72/12/16, Scheduling: 30/25/45). All bars same height. Legend row below with 3 items. Bars have border-radius and overflow:hidden.

### Slide 33 — Gauge / Speedometer
Create a responsive HTML/CSS slide wireframe for gauge charts showing SLA compliance. White background. Section label, serif title "SLA Compliance." 3-column card grid (stacks on mobile). Each card centered with: an SVG semi-circle gauge (arc path — light gray full track, dark partial fill arc showing percentage), a large mono bold percentage positioned at the bottom center of the gauge, a muted metric name, and a muted target value. Three gauges: API Uptime 92% (target 99.9%), P95 Latency 87% (target <200ms), Error Rate 98% (target <0.1%). SVG uses path elements with arc commands.

## Flow & Spatial (Slides 34–37)

### Slide 34 — Sankey / Flow Diagram
Create a responsive HTML/CSS slide wireframe for a Sankey-style flow diagram. White background. Section label, serif title "User Flow — Sankey Style." Chart area with inline SVG containing: 3 columns of nodes (Entry, Decision, Outcome). Entry node: dark rectangle "100K." Decision nodes: "Convert" (dark) and "Drop" (medium). Outcome nodes: "Retain" (dark) and "Churn" (light). Curved SVG path elements connecting nodes with varying thickness and opacity to show flow volume. Column headers above: Entry, Decision, Outcome. Fully contained in SVG for responsiveness.

### Slide 35 — Activity Calendar Heatmap
Create a responsive HTML/CSS slide wireframe for a GitHub-style activity calendar heatmap. White background. Section label, serif title "Activity Calendar." Top row: month labels (Jan–Dec) in muted text. Below: a CSS grid with 52 columns and 7 rows, filled with ~364 small square cells. Each cell has a random greyscale background (from lightest to darkest) to simulate activity intensity. Use a small JavaScript snippet to generate the cells. Legend at bottom-right: "Less" → 5 colored squares light-to-dark → "More." Cells use aspect-ratio:1 and tiny gap (2px).

### Slide 36 — Correlation Matrix
Create a responsive HTML/CSS slide wireframe for a feature correlation matrix. White background. Section label, serif title "Feature Correlation Matrix." 6x6 table (header + 5 features). Diagonal cells are darkest (1.00). Off-diagonal cells have background shading proportional to correlation value — darker = stronger correlation (0.72, 0.68, 0.65 get dark fills; 0.22, 0.18 get light fills). Values displayed as decimal correlation coefficients in each cell. High-correlation cells have white text, low have dark text. Muted annotation: "Pearson correlation. Darker = stronger." Horizontally scrollable on mobile.

### Slide 37 — Geographic / Map View
Create a responsive HTML/CSS slide wireframe for a geographic data view. Light gray background. Section label, serif title "Users by Region." Side-by-side layout (stacks on mobile): left is a large placeholder area (white bg, "Map visualization placeholder" text) representing where a map would go. Right sidebar has "Top Markets" label and 4 market entries (United States, Mexico, Brazil, Other), each with: bold name, muted user count + percentage, and a progress bar showing relative size. Different greyscale fills per bar.

## Dashboards (Slides 38–40)

### Slide 38 — Dashboard — 4 Panel
Create a responsive HTML/CSS slide wireframe for a 4-panel product dashboard. White background. Section label, serif title "Product Health Dashboard." 2x2 card grid (stacks on mobile). Panel 1 (DAU): stat value + SVG sparkline (upward). Panel 2 (Revenue): stat value + mini vertical bar chart (6 bars in CSS flexbox). Panel 3 (Conversion Funnel): 3 small centered bars decreasing in width (mini funnel). Panel 4 (Error Rate): stat value + SVG sparkline (downward = improving). Each panel has a label, large mono value, and its visualization below.

### Slide 39 — Dashboard — 6 Panel
Create a responsive HTML/CSS slide wireframe for a 6-panel executive dashboard on dark background (#0d0d0d). Section label, serif title "Executive Dashboard" in white. 3x2 card grid with dark card backgrounds (#161616, border #2a2a2a). Each card centered with: uppercase label in muted text, large mono bold value in white, and muted MoM/QoQ change indicator. Metrics: MRR $1.54M (+12%), Customers 4,218 (+8%), ARPU $365 (+3%), Churn 2.1% (-0.4pp), NPS 72 (+6pts), CAC Payback 8.2mo (-1.1mo). Stacks on mobile.

### Slide 40 — Metric + Chart + Table Combo
Create a responsive HTML/CSS slide wireframe combining all 3 data display modes. White background. Section label, serif title "Weekly Product Review." Top row: 4-column stat cards (WAU 584K, Revenue $342K, Conv Rate 4.2%, P50 Latency 12ms). Middle: chart area with single SVG line chart (13 points, trending up). Bottom: data table with 3 rows (Send Money, Balance, Alerts) and 4 columns (Feature, DAU, Sessions, Conv %, Rev). Table has dark header and alternating row backgrounds. All sections stack vertically with consistent gaps.

## Analysis (Slides 41–50)

### Slide 41 — Segment Comparison Table
Create a responsive HTML/CSS slide wireframe for a segment comparison table. White background. Section label, serif title "Segment Performance Comparison." Table with header: Metric, New Users, Power Users, Dormant, Reactivated. 5 metric rows (MAU, ARPU, D30 Retention, Sessions/Week, Support Rate). Best value per row in bold. Table uses alternating row backgrounds. Horizontally scrollable on mobile. Power Users column dominates as highest on most metrics.

### Slide 42 — Variance Analysis
Create a responsive HTML/CSS slide wireframe for a budget vs actual variance analysis. White background. Section label, serif title "Variance Analysis — Budget vs. Actual." Table: Line Item, Budget, Actual, Variance, Var %. 5 rows (Revenue, COGS, Gross Profit, OpEx, EBITDA). All numbers right-aligned. Positive variances styled in dark bold, negative in muted. Revenue and EBITDA rows should be visually emphasized (bold values). Horizontally scrollable on mobile.

### Slide 43 — YoY Comparison
Create a responsive HTML/CSS slide wireframe for a year-over-year grouped bar comparison. White background. Section label, serif title "Year-over-Year Comparison." Chart area with 4 quarter groups (Q1–Q4). Each group has two side-by-side bars: light (FY2025) and dark (FY2026). FY2026 bars are consistently taller, showing growth. Quarter labels below. Legend row with two items (FY2025, FY2026). Built with CSS flexbox, responsive.

### Slide 44 — Cumulative Growth
Create a responsive HTML/CSS slide wireframe for a cumulative growth curve. White background. Section label, serif title "Cumulative User Growth." Chart area with inline SVG: a filled area polygon (light gray fill, 60% opacity) with a dark line on top, curving upward from bottom-left to upper-right (S-curve shape). A vertical dashed annotation line marks the "1M milestone" point. X-axis labels below (Jan 2024 through Jan 2026). Line uses ~10 data points.

### Slide 45 — Pareto Chart (80/20)
Create a responsive HTML/CSS slide wireframe for a Pareto chart. White background. Section label, serif title "Pareto — Top Issues (80/20)." Chart area with 7 vertical bars in descending order of height (KYC Fail tallest/darkest → Other shortest/lightest). Bars use graduated greyscale. Below the chart: a left-bordered card with analysis text noting that "Top 3 issues account for 82% of all error volume."

### Slide 46 — Rate / Ratio Comparison
Create a responsive HTML/CSS slide wireframe comparing a rate metric across platforms. White background. Section label, serif title "Conversion Rate by Platform." 3-column card grid (stacks on mobile). Each card centered with: uppercase label (iOS, Android, Web), large mono bold percentage (5.8%, 4.2%, 3.1%), muted "Conv Rate" label, and a progress bar below with fill proportional to the value. Bars darken by rank (iOS darkest, Web lightest). Muted annotation below recommending Android optimization.

### Slide 47 — Data Quality Scorecard
Create a responsive HTML/CSS slide wireframe for a data quality scorecard. White background. Section label, serif title "Data Quality Scorecard." Table: Data Source, Completeness, Freshness, Accuracy, Overall. 4 rows (User Events, Transactions, Support Tickets, Marketing Attribution). Numeric cells use conditional background shading — darkest for highest quality, lightest for lowest. Overall column uses letter grades (A, A+, B, C) in bold without shading. Below: left-bordered card with recommendation about the lowest-scoring source.

### Slide 48 — A/B Test Results
Create a responsive HTML/CSS slide wireframe for A/B test results. White background. Section label, serif title "A/B Test Results." 2-column layout: Control card (A) with dark top accent showing "3.2%" conversion rate and sample size "n=42,186"; Variant card (B) with heavier dark top accent showing "5.1%" in bold dark, sample size, and a dark pill "+59% lift." Below: a single card with 3-column stats (Statistical Significance p<0.01, Confidence 99.4%, Projected Impact +$1.2M ARR). Below that: a left-bordered card with ship recommendation. Stacks on mobile.

### Slide 49 — Forecast vs. Actual
Create a responsive HTML/CSS slide wireframe for a forecast vs actual chart. White background. Section label, serif title "Forecast vs. Actual." Chart area with inline SVG containing: a solid dark polyline (Plan), a solid medium polyline (Actual) tracking slightly above plan for the first half, then a dashed medium polyline (Projected) extending from midpoint to end. A vertical dashed line marks "Today" at the midpoint. Legend below with 3 items: Plan (solid dark line), Actual (solid medium), Projected (dashed medium). Below: left-bordered card with commentary on tracking vs plan.

### Slide 50 — Executive Data Summary
Create a responsive HTML/CSS slide wireframe for an executive data summary. Dark background (#0d0d0d). Section label, serif title "Executive Data Summary" in white. 4-column stat card grid with dark card backgrounds: ARR $18.4M (+24%), MAU 2.4M (+18%), Churn 4.2% (-0.8pp), NPS 68 (+6). White mono values, muted labels. Below a divider: 3-column text grid (Key Insight, Risk, Recommendation), each with uppercase label in dark muted text and paragraph in lighter muted text. Stacks on mobile.
