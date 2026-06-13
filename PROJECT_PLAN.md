# Nuclear Taskforce Implementation Tracker

> A beautiful, modern tracker for UK Nuclear Regulatory Taskforce recommendations.
> Built by the **Centre for British Progress** using Next.js, shadcn/ui, and Tailwind CSS.

> **Historical note:** this document records the *original build plan* and may not
> reflect the current codebase. For example, Phase 7 (Data Export) is now shipped
> (`lib/export.ts` + `app/api/export/*`, using ExcelJS, not xlsx), some components in
> the directory tree below were never built (`progress-overview.tsx`,
> `recommendation-detail.tsx`, `nav.tsx`), and the date helpers live in
> `lib/date-utils.ts` (not `lib/utils.ts`). See `README.md` / `CLAUDE.md` for the
> current state.

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Build Plan](#build-plan)
3. [Technical Architecture](#technical-architecture)
4. [Component Library](#component-library)
5. [Page Structure](#page-structure)
6. [Data Schema](#data-schema)

---

## Brand Identity

### Color Palette

| Name          | Hex       | Usage                                      |
|---------------|-----------|-------------------------------------------|
| Beige         | `#FDF9E9` | Background, cards, soft surfaces          |
| Neon Green    | `#81F494` | Success states, "on_track", highlights    |
| Dark Green    | `#0B4938` | Primary text, headers, emphasis           |
| Light Blue    | `#80B7F4` | Info states, links, interactive elements  |
| Dark Blue     | `#093D77` | Secondary text, accents                   |
| Charcoal      | `#283131` | Body text, dark mode backgrounds          |
| Orange        | `#FE9F1C` | Warnings, "progress" state, attention     |
| Light Red     | `#FAC2C2` | Soft warnings, "risk" backgrounds         |
| Deep Red      | `#B3063E` | Errors, "off_track", critical alerts      |

### Status Color Mapping

```
Overall Status:
  - not_started → Charcoal (#283131)
  - on_track    → Neon Green (#81F494)
  - off_track   → Deep Red (#B3063E)
  - completed   → Dark Green (#0B4938)
  - abandoned   → Light Red (#FAC2C2)

Update Status:
  - info        → Light Blue (#80B7F4)
  - progress    → Orange (#FE9F1C)
  - risk        → Light Red (#FAC2C2)
  - on_track    → Dark Green (#0B4938)
  - off_track   → Deep Red (#B3063E)
  - completed   → Neon Green (#81F494)
  - blocked     → Dark Blue (#093D77)
```

### Typography

- **Display Font**: "Bricolage Grotesque" - Bold, characterful headings
- **Body Font**: "DM Sans" - Clean, readable body text
- **Mono Font**: "JetBrains Mono" - Code references, IDs, dates

---

## Build Plan

### Phase 1: Foundation ✅ COMPLETED
- [x] **1.1** Set up custom theme with brand colors in `globals.css`
- [x] **1.2** Configure custom fonts (Bricolage Grotesque, DM Sans, JetBrains Mono)
- [x] **1.3** Create TypeScript types for YAML schema (`lib/types.ts`)
- [x] **1.4** Build YAML parser utility (`lib/yaml.ts`)
- [x] **1.5** Install required shadcn components (Card, Badge, Button, Progress, Tabs, Tooltip)

### Phase 2: Core Components ✅ COMPLETED
- [x] **2.1** `StatusBadge` - Colored badges for overall/update status
- [x] **2.2** `RecommendationCard` - Summary card for each recommendation
- [x] **2.3** `ChapterSection` - Collapsible chapter groupings
- [x] **2.4** `TimelineEvent` - Individual update display
- [x] **2.5** `OwnershipTag` - Department/regulator pills
- [x] **2.6** `ProgressRing` - Circular progress indicator
- [x] **2.7** `DeadlineIndicator` - Visual deadline status

### Phase 3: Dashboard Page ✅ COMPLETED
- [x] **3.1** Hero section with summary statistics
- [x] **3.2** Overall progress visualization (donut chart or bar)
- [x] **3.3** Chapter-based recommendation grid
- [x] **3.4** "Upcoming Deadlines" sidebar/section
- [x] **3.5** Filter controls (by status, chapter, owner)
- [x] **3.6** Search functionality

### Phase 4: Detail Views ✅ COMPLETED
- [x] **4.1** Recommendation detail page (`/recommendation/[id]`)
- [x] **4.2** Full recommendation text display
- [x] **4.3** Update timeline (chronological history)
- [x] **4.4** Dependencies display (as clickable badges/links)
- [x] **4.5** Update detail pages (`/recommendation/[id]/update/[updateId]`)

### Phase 5: Additional Pages ✅ COMPLETED
- [x] **5.1** Chapter overview (integrated into dashboard with filtering)
- [x] **5.2** Timeline page (all updates across recommendations)
- [x] **5.3** Departments page (`/departments`) - Compare progress across organizations
- [x] **5.4** OpenGraph image generation for social sharing

### Phase 6: Polish & Performance ✅ COMPLETED
- [x] **6.1** Loading states and skeletons
- [x] **6.2** Error boundaries (ErrorBoundary component, error.tsx, global-error.tsx)
- [x] **6.3** SEO optimization (meta tags, OpenGraph, sitemap)
- [x] **6.4** Animations and micro-interactions
- [x] **6.5** Mobile responsiveness (responsive layouts, mobile menu, breakpoints)
- [x] **6.6** Basic accessibility (semantic HTML, ARIA labels, keyboard navigation)

### Phase 7: Data Export (In Progress)
- [ ] **7.1** Install Excel/CSV export library (xlsx or exceljs)
- [ ] **7.2** Create export utility functions (`lib/export.ts`)
  - [ ] CSV generation for recommendations
  - [ ] CSV generation for updates timeline
  - [ ] Excel generation with multiple sheets
- [ ] **7.3** Create API routes for export (`/api/export/...`)
  - [ ] `/api/export/recommendations` - Full recommendations list (CSV/Excel)
  - [ ] `/api/export/updates` - Updates timeline (CSV/Excel)
  - [ ] `/api/export/departments` - Department progress (CSV/Excel)
  - [ ] Support query parameters for filtering (status, chapter, owner)
- [ ] **7.4** Add export buttons to UI
  - [ ] Dashboard page - export filtered recommendations
  - [ ] Timeline page - export updates
  - [ ] Departments page - export department progress
  - [ ] Individual recommendation page - export single recommendation data
- [ ] **7.5** Export data structure design
  - [ ] Recommendations export: Code, Title, Chapter, Status, Owner, Deadline, Dependencies, etc.
  - [ ] Updates export: Date, Recommendation, Status, Title, Description, Links, etc.
  - [ ] Departments export: Owner, Total, On Track, Off Track, Completed, etc.

---

## Current Status

✅ **CORE FEATURES COMPLETE** - The tracker is production-ready with:
- 47 recommendations across 7 chapters
- Dashboard with filtering, search, and statistics
- Individual recommendation detail pages with full text and metadata
- Update detail pages with OpenGraph images
- Timeline page for all updates across recommendations
- Departments page for comparing organizational progress
- Chapter overview integrated into dashboard
- Dependencies displayed as clickable links
- Beautiful brand-aligned design with custom typography
- Fully responsive layouts with mobile menu
- Error boundaries and error handling
- SEO optimization with OpenGraph and sitemap
- Loading states and animations
- Status badges support all status types including "on_track" for updates

To run the development server:
```bash
npm run dev
```

Then open http://localhost:3000

---

## Technical Architecture

### Directory Structure

```
nuclear-taskforce-tracker/
├── app/
│   ├── globals.css              # Theme & brand colors
│   ├── layout.tsx               # Root layout with fonts
│   ├── page.tsx                 # Dashboard/home
│   ├── recommendation/
│   │   └── [id]/
│   │       ├── page.tsx         # Recommendation detail
│   │       ├── timeline-section.tsx
│   │       └── update/
│   │           └── [updateId]/
│   │               └── page.tsx # Update detail
│   ├── departments/
│   │   └── page.tsx             # Departments overview
│   ├── timeline/
│   │   └── page.tsx             # All updates view
│   └── api/
│       └── og/                  # OpenGraph image generation
├── components/
│   ├── ui/                      # shadcn components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── hero-stats.tsx
│   │   ├── progress-overview.tsx
│   │   ├── deadline-sidebar.tsx
│   │   └── filter-controls.tsx
│   ├── recommendations/         # Recommendation components
│   │   ├── recommendation-card.tsx
│   │   ├── recommendation-detail.tsx
│   │   └── chapter-section.tsx
│   ├── shared/                  # Reusable components
│   │   ├── status-badge.tsx
│   │   ├── ownership-tag.tsx
│   │   ├── timeline-event.tsx
│   │   ├── progress-ring.tsx
│   │   └── deadline-indicator.tsx
│   └── layout/                  # Layout components
│       ├── header.tsx
│       ├── footer.tsx
│       └── nav.tsx
├── lib/
│   ├── utils.ts                 # Utility functions
│   ├── types.ts                 # TypeScript types
│   ├── yaml.ts                  # YAML parsing
│   ├── data.ts                  # Data fetching/transformation
│   └── constants.ts             # Status colors, mappings
└── public/
    └── taskforce.yaml           # Data source
```

### Data Flow

```
taskforce.yaml → yaml.ts (parse) → types.ts (typed) → data.ts (transform) → Components
```

### Key Utilities

1. **YAML Parser** (`lib/yaml.ts`)
   - Fetch and parse YAML at build time
   - Cache parsed data for performance

2. **Data Transformations** (`lib/data.ts`)
   - `getRecommendationById(id)`
   - `getRecommendationsByChapter(chapterId)`
   - `getRecommendationsByStatus(status)`
   - `getRecommendationsByOwner(owner)`
   - `getUpcomingDeadlines(days)`
   - `getRecentUpdates(count)`
   - `calculateOverallProgress()`

3. **Date Helpers** (`lib/utils.ts`)
   - `formatDate(date)`
   - `daysUntil(date)`
   - `isOverdue(date)`
   - `getDeadlineStatus(date)`

---

## Component Library

### shadcn Components to Install

```bash
npx shadcn@latest add card badge button progress tabs tooltip
npx shadcn@latest add accordion collapsible scroll-area separator
npx shadcn@latest add input select popover command dialog
```

### Custom Components Specification

#### StatusBadge
```typescript
interface StatusBadgeProps {
  status: OverallStatus | UpdateStatus;
  type: 'overall' | 'update';
  size?: 'sm' | 'md' | 'lg';
}
// Renders colored pill with status text and optional icon
```

#### RecommendationCard
```typescript
interface RecommendationCardProps {
  recommendation: Recommendation;
  variant?: 'compact' | 'full';
  showUpdates?: boolean;
}
// Card with title, status, owner, deadline, latest update
```

#### ChapterSection
```typescript
interface ChapterSectionProps {
  chapter: Chapter;
  recommendations: Recommendation[];
  defaultOpen?: boolean;
}
// Collapsible section with chapter header and recommendation list
```

#### TimelineEvent
```typescript
interface TimelineEventProps {
  update: Update;
  recommendation?: Recommendation;
  showRecommendation?: boolean;
}
// Timeline node with date, status, title, description, links
```

#### ProgressRing
```typescript
interface ProgressRingProps {
  completed: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}
// Circular SVG progress indicator
```

---

## Page Structure

### Dashboard (`/`)

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER: Logo, Navigation, Theme Toggle                      │
├─────────────────────────────────────────────────────────────┤
│ HERO                                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ "Nuclear Taskforce Tracker"                             │ │
│ │ "Monitoring government progress on 47 recommendations"  │ │
│ │                                                         │ │
│ │ [Stat] [Stat] [Stat] [Stat]                            │ │
│ │ Total  On Track  Off Track  Completed                   │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ MAIN CONTENT                               │ SIDEBAR        │
│ ┌───────────────────────────────────────┐ │ ┌────────────┐ │
│ │ Filter: [Status▼] [Chapter▼] [Owner▼] │ │ │ Upcoming   │ │
│ │ Search: [________________] 🔍         │ │ │ Deadlines  │ │
│ └───────────────────────────────────────┘ │ │            │ │
│                                           │ │ • R01 Jan  │ │
│ Chapter 5: Simplification                 │ │ • R03 Mar  │ │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │ │ • R04 Mar  │ │
│ │ R01 │ │ R02 │ │ R03 │ │ R04 │         │ │            │ │
│ └─────┘ └─────┘ └─────┘ └─────┘         │ ├────────────┤ │
│                                           │ │ Recent     │ │
│ Chapter 6: Risk Management                │ │ Updates    │ │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐         │ │            │ │
│ │ R06 │ │ R07 │ │ R08 │ │ R09 │         │ │ • Update 1 │ │
│ └─────┘ └─────┘ └─────┘ └─────┘         │ │ • Update 2 │ │
│ ...                                       │ └────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ FOOTER: CBP Branding, Data Source Link, Last Updated       │
└─────────────────────────────────────────────────────────────┘
```

### Recommendation Detail (`/recommendation/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard                                         │
├─────────────────────────────────────────────────────────────┤
│ R01 • Chapter 5: Simplification                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ "Provide HMG Strategic Steer to the Nuclear Sector"     │ │
│ │ [ON TRACK]                                              │ │
│ │                                                         │ │
│ │ Owner: All of Government    Deadline: 31 Jan 2026      │ │
│ └─────────────────────────────────────────────────────────┘ │
├────────────────────────────────────┬────────────────────────┤
│ DESCRIPTION                        │ METADATA               │
│ Full recommendation text...        │ Sectors: Civil, Defence│
│                                    │ Domains: Strategy      │
│                                    │ Dependencies: None     │
├────────────────────────────────────┴────────────────────────┤
│ TIMELINE                                                    │
│ ○───●───○───○                                              │
│     │                                                       │
│ ┌───┴───────────────────────────────────────────────────┐  │
│ │ 15 Nov 2025 • PROGRESS                                │  │
│ │ "PM signals support for taskforce recommendations"    │  │
│ │ Prime Minister speech at NIA conference...            │  │
│ │ [Link: PM speech at NIA conference]                   │  │
│ └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Schema

```yaml
status_scales:
  overall_status:
    - not_started
    - on_track
    - off_track
    - completed
    - abandoned
  update_status:
    - info
    - progress
    - risk
    - on_track
    - off_track
    - completed
    - blocked

chapters:
  - id: 5
    title: "Simplification of Nuclear Regulation"
    description: |
      Structural reforms to make nuclear regulation clearer, faster, and more
      predictable for investors and operators.
  # - id: 6
  #   ...

proposals:
  - id: 1
    title: "Government to provide clearer leadership and direction for the nuclear sector"
    description: "High-level leadership and strategic steer."
    recommendation_ids: [1]
  # - id: 2
  #   ...

recommendations:
  - id: 1                    # numeric ID from the report
    code: "R01"              # optional zero-padded string ID

    chapter_id: 5            # refers to chapters[id], keeps file short

    proposal_ids: [1]        # link back to proposals

    titles:
      short: "Provide HMG strategic steer to the nuclear sector"
      long: "Provide a clear, cross-government strategic steer to the nuclear sector"

    description: >
      Government should issue a clear, cross-departmental strategic steer to
      give investors and regulators confidence about the long-term role of
      nuclear in the energy mix.

    text: |                  # full recommendation text verbatim
      Full text of recommendation 1 goes here...

    scope:
      sectors: ["civil"]     # e.g. ["civil"], ["defence"], or both
      domains:
        - leadership
        - governance

    ownership:
      primary_owner: "DESNZ"
      co_owners:
        - "MOD"
      key_regulators:
        - "ONR"
        - "Environment Agency"

    delivery_timeline:
      original_text: "End of January 2026"
      target_date: "2026-01-31"
      revised_target_date: null
      notes: null

    implementation_type:
      - "strategic_direction"  # e.g. primary_legislation / guidance / etc.

    dependencies:
      depends_on: []
      enables: []

    overall_status:
      status: "not_started"    # from status_scales.overall_status
      last_updated: "2025-12-01"
      confidence: "medium"
      summary: |
        Awaiting formal government response to the recommendation.

    updates:
      - date: "2025-11-15"
        status: "progress"     # from status_scales.update_status
        tags:
          - "statement"
          - "PM"
          - "NIA_conference"
        title: "PM signals support for taskforce recommendations"
        description: >
          Prime Minister speech at the Nuclear Industry Association conference
          welcomed the taskforce report and committed to respond in early 2026.
        links:
          - title: "PM speech at NIA conference"
            url: "https://example.gov.uk/pm-speech"
        source:
          type: "statement"
          reference: "NIA-2025-11-15"
        impact_on_overall:
          changes_overall_status_to: "on_track"
          changes_confidence_to: "high"
          notes: "Strong political signal but not yet a formal strategy."

      - date: "2026-02-10"
        status: "off_track"
        tags:
          - "delay"
          - "implementation"
        title: "Strategic steer delayed"
        description: |
          Government written statement confirms the strategic steer will now be
          published by the end of 2027, not January 2026 as originally envisaged.
        links:
          - title: "Written statement delaying strategic steer"
            url: "https://example.gov.uk/written-statement"
        source:
          type: "written_statement"
          reference: "HCWS123"
        impact_on_overall:
          changes_overall_status_to: "off_track"
          changes_confidence_to: "high"
          notes: "Formal delay relative to taskforce timeline."

    notes: |
      Free-form analyst notes, political context, or cross-links to other
      recommendations.

  # - id: 2
  #   ...repeat structure
```

---

## Export Feature Specification

### Export Formats

The application will support two export formats:
1. **CSV** - Simple, universal format for quick data access
2. **Excel (XLSX)** - Rich format with multiple sheets, formatting, and better data organization

### Export Types

#### 1. Recommendations Export
**Columns:**
- Code (R01, R02, etc.)
- Short Title
- Long Title
- Chapter ID
- Chapter Title
- Overall Status
- Status Last Updated
- Status Confidence
- Status Summary
- Primary Owner
- Co-Owners (comma-separated)
- Key Regulators (comma-separated)
- Target Date
- Revised Target Date
- Days Until Deadline
- Is Overdue (Yes/No)
- Sectors (comma-separated)
- Domains (comma-separated)
- Implementation Types (comma-separated)
- Depends On (comma-separated recommendation codes)
- Enables (comma-separated recommendation codes)
- Update Count
- Latest Update Date
- Latest Update Status
- Full Recommendation Text

**Filtering Support:**
- Filter by status (query param: `?status=on_track`)
- Filter by chapter (query param: `?chapter=5`)
- Filter by owner (query param: `?owner=DESNZ`)
- Filter by tag (query param: `?tag=statement`)

#### 2. Updates Export
**Columns:**
- Date
- Recommendation Code
- Recommendation Title
- Update Status
- Update Title
- Update Description
- Tags (comma-separated)
- Links (semicolon-separated: "Title|URL")
- Source Type
- Source Reference
- Impact on Overall Status
- Impact on Confidence
- Impact Notes

**Sorting:** Chronological (newest first by default)

#### 3. Departments Export
**Columns:**
- Owner/Department Name
- Total Recommendations
- Not Started Count
- On Track Count
- Off Track Count
- Completed Count
- Abandoned Count
- Completion Percentage
- Average Days Until Deadline
- Overdue Count

### API Routes

```
GET /api/export/recommendations?format=csv&status=on_track&chapter=5
GET /api/export/recommendations?format=xlsx&status=on_track&chapter=5
GET /api/export/updates?format=csv
GET /api/export/updates?format=xlsx
GET /api/export/departments?format=csv
GET /api/export/departments?format=xlsx
```

### UI Integration

**Export Buttons Location:**
1. **Dashboard** - Top right of filter section: "Export Filtered Data" dropdown (CSV/Excel)
2. **Timeline Page** - Header: "Export Timeline" button
3. **Departments Page** - Header: "Export Department Data" button
4. **Recommendation Detail Page** - Metadata section: "Export This Recommendation" button

**Button Design:**
- Use Download icon from lucide-react
- Dropdown for format selection (CSV/Excel)
- Loading state during export generation
- File download with descriptive filename: `nuclear-taskforce-recommendations-2025-01-15.csv`

### Implementation Notes

**Library Choice:**
- Use `xlsx` (SheetJS) - lightweight, works in Node.js and browser
- Alternative: `exceljs` for more advanced formatting (heavier)

**File Naming Convention:**
- Recommendations: `nuclear-taskforce-recommendations-{date}.{ext}`
- Updates: `nuclear-taskforce-updates-{date}.{ext}`
- Departments: `nuclear-taskforce-departments-{date}.{ext}`
- Filtered: `nuclear-taskforce-recommendations-{filter}-{date}.{ext}`

**Excel Formatting:**
- Header row: Bold, background color (brand color)
- Date columns: Date format
- Status columns: Color-coded cells (matching badge colors)
- Auto-width columns
- Freeze header row
- Multiple sheets for different data views (if applicable)

**CSV Formatting:**
- UTF-8 encoding with BOM for Excel compatibility
- Comma-separated values
- Quotes around fields containing commas
- Newlines in text fields preserved

---