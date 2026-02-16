import { readFileSync, writeFileSync } from 'fs';

const filePath = 'post/10k-hours-tracker-entries.json';
const data = JSON.parse(readFileSync(filePath, 'utf-8'));

const translations = {
  1: {
    title_en: "Idea: 10K Hours Tracker App",
    text_en: `I came up with the idea of creating an application to track the hours I dedicate to different topics or skills. The inspiration comes from Malcolm Gladwell's 10,000 Hours Theory, which proposes that approximately 10,000 hours of deliberate practice are needed to reach expert level in any discipline.

Interface concept: The visualization would be inspired by GitHub's contribution graph (that calendar with green squares showing commit activity). I want the user to see their progress visually and clearly, similar to how GitHub represents daily activity.

Main functionality: The user will be able to log their progress day by day. For example: 'Today I practiced 3 hours of piano' gets logged, and the app will accumulate and visualize the entire practice history, showing progress toward the 10,000-hour goal.

Next steps: I have an additional AI integration planned, but I'll detail that in the next entry.`
  },

  2: {
    title_en: "Tech Stack and First Steps",
    text_en: `During these sessions I'll be documenting all the development progress. It will be an Android app for now, since it's easier to deploy.

Methodology: Development will primarily be through vibe coding — I generate the instructions and Claude Sonnet 4.5 handles writing all the code, the database, and the technical/functional requirements. The goal is to not manually write a single line of code.

Tech stack: Bun runtime (extremely fast), Hono backend (web framework), PostgreSQL database, and Prisma ORM.

Current database schema: Claude Code already generated a pretty good initial schema with three main tables: User (users table), Skills (the topics or skills we want to track, e.g., piano, programming), and Sessions (logged hours, related to each skill).

Current status: I'm working on the user registration endpoints. I already have the technical requirements defined and I'm going to create automated tests to validate the registration flow.`
  },

  3: {
    title_en: "UI Design, Flutter and Clean Architecture",
    text_en: `I've been reviewing some themes and color palettes to see how I could design the application. I'm seriously thinking about green, but I'm not sure — with greens it's a bit weird but probably yes, depending on how it looks. I'm going to tell Claude to generate a theme for Flutter.

I honestly don't know anything about Flutter, literally nothing about Flutter. So how am I going to know if I'm heading in the right direction, that it's writing the correct instructions? Well, I used well-defined instructions that I researched, or that other people also researched and who know how to have good architecture and good structure in Flutter.

I want to avoid creating very large files because it's happened to me in the past that the LLM tends to create overly large files in Flutter. And we want to avoid that because for an LLM's context window it's much more complicated to read a very large file — it's easier for the LLM to read small files and have better context about the problem it's going to face.

Current progress: It seems like I can register now, I'm going to work on login. I also ran some fully automated integration tests. Right now I'm looking at the user interface, figuring out the best design. I'm looking at some good designs and I'm going to pass them to the model so it can analyze the images and from there generate something beautiful. Let's see how it goes!`
  },

  4: {
    title_en: "Login, Backend and User Profile",
    text_en: `In the end, we opted to use the green theme, so we'll design the application with that green-cinch theme. We managed to create the login connected to the backend. I ran some tests and everything passed correctly. We also connected Nodemailer to send verification emails during login, with a verification code that the user must enter when registering.

I saw a navigation design, a tab bar (App Tab) on Google that I really liked. The model replicated it very well; it looks excellent.

I managed to create the profile section displaying user data: email, name, the option to change password and a logout button. However, the logout button isn't working correctly; it throws an exception. I'm going to investigate why this happens.

That's my report for now.`
  },

  5: {
    title_en: "Skills Module, Stopwatch and Streaks",
    text_en: `## Progress Summary for February 4, 2026

Today we implemented the complete **Skills** module with the following features:

### Skills CRUD
- **Create** a new skill to track toward the 10,000 hours
- **Edit** skill: change title, emoji and interface color
- **Delete** skills

### Practice Stopwatch
We implemented a stopwatch that counts practice hours in real time:
- The elapsed time is displayed in the interface
- On the mobile app it runs in the background with notifications showing progress
- When stopping the stopwatch, a new session entry is automatically generated

### Manual Sessions
You can also create a session manually with:
- Custom title
- Comments about the practice
- Specific date

*Although the stopwatch is more intuitive and convenient.*

### Streak System
We added streak functionality in the header:
- Shows the number of consecutive practice days
- Serves as incentive and motivation to not break the streak

### GitHub-style Visualizer
We implemented a GitHub-style activity visualizer (contribution graph). For now it works well, but it can be improved in future iterations.

---

**Status:** Main features are complete. Some UI adjustments remain to be polished.`
  },

  6: {
    title_en: "Minimalist Timer and Summary Module",
    text_en: `## Updates for February 5, 2026

Today we worked on several important improvements for the user experience.

### Redesigned Timer
The timer is now **more minimalist** because the previous version took up too much screen space:
- Runs in **background** when you close the application
- Shows progress in system **notifications**
- Clicking the notification opens the app automatically

### New Navigation (Tab Nav)
We redesigned the bottom navigator with three sections:
- 🏠 **Home** - Main screen
- ❤️ **General Summary** - New central module
- 👤 **Profile** - User settings

### General Summary Module
This new module shows consolidated statistics:
- **Total hours** accumulated across all skills
- **Number of skills** you're tracking
- **Average** hours per skill
- 📊 **Hours per month chart** - Monthly progress visualization vs previous month

### Estimated Goal Date
We added a very useful feature:
- Calculates **when you'll reach 10,000 hours** based on your history
- Tells you if 10, 20, 140 days remain... based on your current pace

### Per-Skill Streaks
You can now see the **individual streak** for each skill in a dedicated list.

---

**Next step:** I'm working on a **new user onboarding** that will explain what the app is about, guide the creation of the first skill and give an overview of the features.`
  },

  7: {
    title_en: "Logo, Home Redesign and Instagram Sharing",
    text_en: `## Updates for February 6, 2026 — Devlog Day 3

Today was a very productive day. We worked on visual identity, UX improvements and a feature we believe will give the app great traction.

### 🎨 New Logo
We created a minimalist logo inspired by the app's grid: a grid with different colors representing each skill, accompanied by the letters "TenK". To install it across all platforms (Android, iOS, Web and macOS), we used the \`flutter_launcher_icons\` library. It turned out clean and represents the app's concept well.

### ✨ Splash Animation
We added an animation when launching the application where the grid squares fill in one by one with color. It looks very aesthetic, giving the app personality from the very first second.

### 🏠 Home Redesign
We did a complete redesign of the main screen:
- **Before:** All 10,000 hours squares were shown at once, which was overwhelming and demotivating for the user.
- **Now:** First the user's real progress appears, followed by a few empty squares. A button was added to view the complete grid on a separate screen.
- The result is a much cleaner and more motivating view.

### 📸 Share Progress on Instagram Stories
We implemented the ability to share a story to Instagram with:
- The skill's **progress grid**, where today's practiced hours are highlighted with brighter intensity.
- **Total hours** accumulated and remaining hours until the goal.
- **Current streak** of consecutive days.
- **User level** (from the new level system).

This image is generated automatically and has a design meant to look viral on social media. We believe this feature will give the app a lot of power, since users will be able to share their progress visually and attractively — similar to how people share their running routes, but here we share the grid of invested hours.

### 🏆 Level System
We added 5 mastery levels:
1. **Beginner**
2. **Apprentice**
3. **Intermediate**
4. **Advanced**
5. **Master**

Additionally, the interface shows how many hours remain to reach the next level, adding an extra motivational element for the user.

---

**Next step:** Deploy the app to Google Play as a functional MVP. Everything seems to be working correctly. We're going to prepare the launch for closed testing with 12 people, which is the minimum Google requires for the internal testing program.`
  },

  8: {
    title_en: "Google Play, Cloud Infrastructure and Pomodoro Technique",
    text_en: `## Updates for February 10, 2026 — Devlog Day 7

Today was a key day: the app is now deployed on Google Play Console and the cloud infrastructure is ready. Additionally, we worked on important UX improvements and the landing page.

### 🚀 Google Play Console Deployment
We completed the entire deployment process on the **Google Play Console** in testing mode:
- We filled all mandatory requirements: privacy policy, content classification and data security questionnaires.
- We uploaded the **app logo**, **screenshots** and **cover image** (AI-generated design).
- The app is now available for the internal testing program.

### ☁️ Infrastructure and Domain
We configured the **tenk.oventlabs.com** domain with a robust cloud architecture:
- **Load balancer** with a target group pointing to the instance and the port where the application runs.
- **SSL certificates** configured on the load balancer to serve HTTPS traffic.
- **Routing rules** based on the host header: when accessing \`tenk.oventlabs.com\`, traffic is redirected to the corresponding instance.
- **DNS records** configured in the hosting to point to the load balancer.

### 🔄 Reverse Proxy with Nginx
We configured **Nginx as a reverse proxy** to unify the app and API routes under the same domain:
- The API runs in a **Docker container** inside the server.
- When accessing \`tenk.oventlabs.com/api\`, Nginx redirects requests to the corresponding container.
- This simplifies communication between frontend and backend, eliminating CORS issues and maintaining a clean URL.

### 🍅 Pomodoro Technique in the Timer
We added the **Pomodoro technique** to the practice timer:
- **25 minutes** of focused practice
- **5 minutes** of rest between sessions
- After **4 sessions**, a long break of **15 minutes**
- Users can now structure their deliberate practice following this proven productivity methodology.

### 🌐 Landing Page and Early Access List
We created a **landing page** at [tenk.oventlabs.com](https://tenk.oventlabs.com) with:
- Clear explanation of the app's **main functionality**.
- Button to join the **early access list** with the Google Play Store icon.
- Users can **register from the web** without needing to download the app.
- The landing page lets people learn about the app and reserve their spot before the public launch.

---

**Status:** The app is now on Google Play (testing), the cloud infrastructure is operational and the landing page is receiving registrations. Let's go! 🔥`
  },

  9: {
    title_en: "AI Coach: Integrating Claude as Personal Skills Trainer",
    text_en: `## Updates for February 10, 2026 — Devlog: AI Coach

This is probably the most ambitious feature we've built so far. The TenK app now has an integrated **AI Coach** that analyzes your practice data and gives you personalized recommendations. And the best part: it works with your own Claude account.

---

### 🧠 What is the AI Coach?

It's an AI agent with access to your real data through **tool calling**. It's not a generic chatbot — the agent has 5 tools that query your database:

| Tool | Description |
|------|-------------|
| \`get_user_skills\` | User's skills with total hours, mastery level and status |
| \`get_practice_sessions\` | Practice sessions for a specific skill (last N days) |
| \`get_journey_stats\` | Global statistics: weekly average, best days, projections, streaks |
| \`analyze_practice_patterns\` | Distribution by day of week, trends, gaps, plateau diagnosis |
| \`save_weekly_plan\` | Saves a weekly plan with insights to the database |

The agent operates in a **loop of up to 5 tool calling iterations**. In each iteration, Claude decides which tools to invoke, receives the results, and can make more calls or generate the final response.

\`\`\`typescript
// agent-runner.ts — Main loop
for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
  const result = await chatCompletion(messages, AGENT_TOOLS, userId);

  if (result.toolCalls.length === 0) {
    return { response: result.content, toolsUsed, provider, usage };
  }

  messages.push({ role: 'assistant', content: result.content, tool_calls: result.toolCalls });

  for (const toolCall of result.toolCalls) {
    const toolResult = await executeTool(toolCall.function.name, userId, args);
    messages.push({ role: 'tool', content: JSON.stringify(toolResult), tool_call_id: toolCall.id });
  }
}
\`\`\`

Each tool receives the \`userId\` for **data isolation** — a user can never see another user's data.

---

### 🔐 OAuth PKCE with Claude: The Hard Part

Instead of using a centralized API key (which shares rate limits across everyone), we implemented an **OAuth PKCE** flow where each user connects their own Claude Pro or Max account.

#### The complete flow:
1. The user taps the connection icon on the coach screen.
2. The backend generates a \`code_verifier\` (64 random chars) and its \`code_challenge\` (SHA-256 + base64url).
3. A browser opens with Claude's authorization URL.
4. The user logs in with their Anthropic account and authorizes.
5. Claude displays a code in \`code#state\` format that the user pastes into the app.
6. The backend parses the \`#\`, validates the \`state\` against the DB, and exchanges the code for tokens.

#### PKCE Generation
\`\`\`typescript
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
}
\`\`\`

#### Parsing \`code#state\` — Anthropic's Trap
Anthropic returns the authorization code in \`code#state\` format as a single string. Nobody documents this. We discovered it through debugging:

\`\`\`typescript
async handleCodeExchange(userId: string, rawCode: string): Promise<void> {
  const hashIndex = rawCode.indexOf('#');
  if (hashIndex === -1) {
    throw new BadRequestError('Invalid code format');
  }
  const code = rawCode.substring(0, hashIndex);
  const state = rawCode.substring(hashIndex + 1);
  // Validate state against DB, exchange tokens...
}
\`\`\`

#### Token Exchange — JSON, not form-urlencoded
Anthropic is the **only OAuth provider** that requires \`Content-Type: application/json\` for the token exchange. All others (Google, GitHub, etc.) use \`application/x-www-form-urlencoded\`.

\`\`\`typescript
const res = await fetch('https://console.anthropic.com/v1/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    client_id: CLAUDE_CLIENT_ID,
    code,
    state,                    // <- required in the body
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  }),
});
\`\`\`

Note: the \`state\` goes in the body too. Another undocumented detail.

#### Database Models
\`\`\`prisma
model ClaudeCredential {
  id           String   @id @default(cuid())
  userId       String   @unique @map("user_id")
  accessToken  String   @map("access_token") @db.Text
  refreshToken String   @map("refresh_token") @db.Text
  expiresAt    DateTime @map("expires_at")
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("claude_credentials")
}

model OAuthState {
  id            String   @id @default(cuid())
  userId        String   @map("user_id")
  state         String   @unique
  codeVerifier  String   @map("code_verifier")
  expiresAt     DateTime @map("expires_at")
  @@map("oauth_states")
  @@index([state])
}
\`\`\`

---

### 🕵️ Stealth Headers — Impersonating Claude Code CLI

Claude's OAuth tokens **only work** if the request appears to come from the official CLI. We detected this by investigating OpenClaw's source code and capturing the CLI's actual calls.

\`\`\`typescript
const isOAuth = credential.accessToken.includes('sk-ant-oat');

if (isOAuth) {
  headers['Authorization'] = \\\`Bearer \\\${credential.accessToken}\\\`;
  headers['anthropic-dangerous-direct-browser-access'] = 'true';
  headers['anthropic-beta'] = 'claude-code-20250219,oauth-2025-04-20,' +
    'fine-grained-tool-streaming-2025-05-14';
  headers['user-agent'] = 'claude-cli/2.1.2 (external, cli)';
  headers['x-app'] = 'cli';

  // The system prompt MUST open with Claude Code's identity
  body.system = [
    { type: 'text', text: 'You are Claude Code, Anthropic\\'s official CLI for Claude.' },
    { type: 'text', text: systemPrompt },
  ];
} else {
  headers['x-api-key'] = credential.accessToken;
  body.system = systemPrompt;
}
\`\`\`

Without these headers, Anthropic rejects the token with \`403 Forbidden\`.

---

### 🛡️ Rate Limits — From Cryptic Error to Elegant Banner

#### The Problem
When the user exhausts their Claude session, the API returns a \`429\` with a \`retry-after\` header. Without proper handling, the user saw:

\`\`\`
DioException [bad response]: The request returned an invalid status code of 429.
Headers: {retry-after: 2520, ...}
\`\`\`

#### The Solution (Backend)
3 retries with backoff (cap 15s). If \`retry-after\` > 60s, fail immediately with the wait time in minutes:

\`\`\`typescript
if (res.status === 429) {
  const retryAfter = res.headers.get('retry-after');
  const rawWaitMs = retryAfter ? Number(retryAfter) * 1000 : (attempt + 1) * 5000;
  const minutes = Math.max(1, Math.ceil(rawWaitMs / 60000));

  if (rawWaitMs > 60000) {
    throw new TooManyRequestsError(
      \\\`You've reached Claude's usage limit. Try again in ~\\\${minutes} min.\\\`,
      minutes,  // <- this field travels to the frontend
    );
  }
  // ... retry with backoff
}
\`\`\`

The error middleware includes \`retryAfterMinutes\` in the JSON response:
\`\`\`json
{ "success": false, "error": { "code": "TOO_MANY_REQUESTS", "message": "...", "retryAfterMinutes": 42 } }
\`\`\`

#### The Solution (Flutter)
The repository extracts \`retryAfterMinutes\` from the response and creates a typed \`RateLimitFailure\`:

\`\`\`dart
if (statusCode == 429) {
  final retryMinutes = errorData?['retryAfterMinutes'] as int?;
  return RateLimitFailure(
    message: message,
    retryAfterMinutes: retryMinutes,
  );
}
\`\`\`

The BLoC detects this specific failure and emits a \`rateLimited\` state instead of \`error\`:
\`\`\`dart
if (failure is RateLimitFailure) {
  emit(state.copyWith(
    status: AiCoachStatus.rateLimited,
    retryAfterMinutes: failure.retryAfterMinutes,
  ));
}
\`\`\`

And the UI shows a friendly banner with amber gradient, timer icon, and the wait time in minutes.

---

### 🏗️ Complete Architecture

**Backend (Bun + Hono + Prisma):**
\`\`\`
modules/
├── ai/
│   ├── ai.controller.ts        # Endpoints: POST /chat, POST /weekly-plan
│   ├── ai.service.ts            # Orchestrates the agent runner
│   ├── agent/
│   │   ├── agent-runner.ts      # Tool calling loop (max 5 iterations)
│   │   ├── system-prompt.ts     # TenK Coach prompt
│   │   ├── tool-definitions.ts  # 5 tools with JSON Schema
│   │   └── tool-executor.ts     # Tool dispatcher
│   └── tools/
│       ├── query-skills.tool.ts
│       ├── query-sessions.tool.ts
│       ├── get-stats.tool.ts
│       ├── analyze-patterns.tool.ts
│       └── create-plan.tool.ts
├── claude-oauth/
│   ├── claude-oauth.controller.ts  # POST /init, POST /exchange, GET /status, DELETE /disconnect
│   ├── claude-oauth.service.ts     # PKCE, token exchange, refresh
│   ├── claude-oauth.repository.ts  # Prisma ops
│   ├── claude-oauth.schema.ts      # Zod validation
│   └── claude-oauth.types.ts
lib/
└── ai-client.ts                 # Per-user tokens → stealth headers → retry
\`\`\`

**Flutter (Clean Architecture):**
\`\`\`
features/ai_coach/
├── data/
│   ├── datasources/
│   │   ├── ai_coach_remote_datasource.dart
│   │   └── claude_oauth_datasource.dart
│   ├── models/
│   └── repositories/
│       └── ai_coach_repository_impl.dart  # _handleDioError → RateLimitFailure
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── usecases/
└── presentation/
    ├── bloc/
    │   ├── ai_coach_bloc.dart     # States: initial, sending, success, error, rateLimited
    │   ├── ai_coach_event.dart    # SendMessage, DismissRateLimit, etc.
    │   └── ai_coach_state.dart    # retryAfterMinutes field
    ├── pages/
    │   └── ai_coach_screen.dart   # Dynamic green/grey icon
    └── widgets/
        ├── rate_limit_banner.dart
        ├── claude_connect_sheet.dart
        ├── chat_message_bubble.dart
        └── coach_empty_state.dart
\`\`\`

---

### 💡 What We Learned

1. **Anthropic is the only OAuth provider** that uses JSON instead of form-urlencoded for the token exchange.
2. The \`code#state\` format is not documented — you have to parse the \`#\` manually.
3. The \`state\` must go in the token exchange body — another undocumented detail.
4. OAuth tokens need **5 stealth headers** and an identity system prompt.
5. Claude Code CLI's \`client_id\` is **public** (\`9d1c250a-...\`) — it identifies the app, not the user.
6. Claude's rate limits are **per subscription** — the per-user model prevents one user from blocking everyone.
7. End-to-end error handling requires strict typing: \`429 API → TooManyRequestsError(minutes) → JSON response → DioException → RateLimitFailure → AiCoachStatus.rateLimited → RateLimitBanner\`.

---

**Status:** The AI Coach is functional with tool calling (5 tools), per-user OAuth PKCE, stealth headers, and elegant rate limit handling across the entire chain. Each user connects their own Claude account and gets personalized coaching based on their real practice data. 🚀

---

### ⚡ Weekly Plan Optimization: 39s → 8s

The weekly plan initially took **39 seconds** because the agent executed **6 sequential calls** to the Anthropic API (one per tool loop iteration). Each iteration: Claude decides which tool to use → executes → receives result → decides another tool → repeats.

#### The Solution: Pre-fetch + Single Call
We created a dedicated service (\`weekly-plan.service.ts\`) that:
1. **Pre-fetches all data in parallel** with \`Promise.all\` (~50ms): skills, statistics and practice patterns.
2. **Embeds the data as JSON** directly in the prompt.
3. Makes **a single call** to Claude with all the necessary information.

\`\`\`typescript
// Before: 6 sequential API calls (39s)
for (let i = 0; i < MAX_ITERATIONS; i++) {
  const result = await chatCompletion(messages, tools);
  // Claude requests a tool → executes → another iteration...
}

// After: 1 API call with pre-loaded data (8s)
const [skills, stats, patterns] = await Promise.all([
  querySkills(userId),
  getJourneyStats(userId),
  analyzePracticePatterns(userId),
]);
const prompt = buildWeeklyPlanPrompt(skills, stats, patterns);
const result = await chatCompletion([{ role: 'user', content: prompt }]);
\`\`\`

Result: **4.7x faster** — from 39 seconds to ~8 seconds.

---

### 🔌 Connection Fix: Bun idleTimeout

We discovered a subtle bug: Bun has a default \`idleTimeout\` of **10 seconds** that kills "idle" TCP connections. During the AI Coach's agent loop (which takes more than 10s), the socket would close and Flutter would receive a connection error — even though Claude had already consumed tokens.

\`\`\`typescript
// src/index.ts
export default {
  port: env.PORT,
  fetch: app.fetch,
  idleTimeout: 255,  // <- fix: 255 seconds instead of 10
};
\`\`\`

We also added:
- **Flutter Dio**: \`receiveTimeout: Duration(minutes: 3)\` specifically for AI endpoints.
- **Agent timeout**: \`Promise.race\` with 150s as a safety guard.
- **Platform-aware baseUrl**: Detection of \`TargetPlatform.android\` vs iOS/macOS to use the correct URL in development mode.

---

### 🐛 Fix: Null Cast in Flutter

When optimizing the weekly plan (from agent loop to single call), the endpoint stopped sending \`conversationId\` and \`provider\` in the response. The Flutter model was doing \`json['conversationId'] as String\` which crashed with:

\`\`\`
type 'Null' is not a subtype of type 'String' in type cast
\`\`\`

Fix: make both fields nullable (\`String?\`) in the entity and data model.`
  },

  10: {
    title_en: "Web Version: Persistent Sidebar, Redesigned Table and AI Coach Status",
    text_en: `## Updates for February 11, 2026 — Devlog Day 8

Today we worked on polishing TenK's web experience and making the AI Coach integration more visible and accessible for the user.

---

### 🔧 Fix: Weekly Plan Cut Off by Navigation

The weekly plan content was getting cut off at the bottom because the floating bottom nav bar was covering it. The cause was that the \`ListView\` only had 12px of bottom padding, while the navigation bar takes up ~80px. We fixed it with \`bottom: 100\` in the \`ListView\` padding.

### 🗑️ Redundant AI Icon

We removed the AI Coach button (\`psychology\` icon) from the main screen header on mobile. Now that the AI Coach has its own tab in the bottom navigation, having the duplicate icon was confusing.

---

### 🖥️ Persistent Web Sidebar

We had a problem in the web version: clicking "AI Chat" or "Weekly Plan" from the left sidebar navigated with \`context.push('/ai-coach?tab=N')\`, which **replaced the entire view** and the sidebar disappeared.

**The solution was to embed the AI views inside the \`IndexedStack\`** of the web layout:
- We added \`EmbeddedAiChatPage\` (index 3) and \`WeeklyPlansListView\` (index 4) as children of the \`IndexedStack\`.
- We changed the sidebar items to use \`onNavTap(index)\` instead of \`context.push()\`.
- We added visual selection state (subtle green background + border) for AI items when active.

Now the sidebar **always remains visible**, regardless of which section the user is viewing.

---

### 📊 Complete Redesign of the Weekly Plan Table

The weekly plan table was rendered as plain markdown — functional but visually poor. We did a complete redesign:

#### Section Parser
We created a parser that divides the markdown content into sections (\`## Summary\`, \`### Weekly Plan\`, \`### Focus\`, \`### Goal\`). Each section receives a unique icon and color:
- 📊 **Summary** → blue, \`bar_chart\`
- 📅 **Weekly Plan** → green, \`table_chart\`
- 🎯 **Focus** → yellow, \`gps_fixed\`
- 🏆 **Goal** → orange, \`emoji_events\`

#### Custom Table (\`WeeklyPlanTable\`)
We created a dedicated widget that replaces the plain markdown table:
- **Header with green gradient** (primary → primaryDark)
- **Zebra striping** on data rows (alternating background)
- **"Total" column highlighted** with subtle green tint
- **Totals row** separated with top border and bold text
- **Rounded borders** with \`clipBehavior: Clip.antiAlias\`

#### Fix: Visible Asterisks
When rendering the table, markdown bold markers (\`**Mon**\`, \`**Weekly total:**\`) were showing as literal text. We added \`.replaceAll('**', '')\` when parsing cells to clean up the markers.

#### Fix: Duplicate Total Row
The totals row was being rendered twice: once with \`_buildDataRow\` and once with \`_buildTotalRow\`. We changed the generator to use \`_dataRows.length\` (which excludes the total row) instead of \`data.rows.length\`.

---

### 🟢 AI Coach Status on the Web

We added visibility of the Claude connection status in two places:

#### Web Header
A chip in the top bar that shows:
- 🟢 **"AI Coach: Connected"** with green dot when Claude is linked
- 🟡 **"AI Coach: Not connected"** with yellow dot when there's no connection
- Clicking opens the Claude connection/disconnection modal

#### Web Profile
A new card (\`_AiCoachCard\`) between quick stats and the danger zone:
- Shows status with color indicator and descriptive text
- Green or yellow border depending on status
- "Connect Claude" button (filled, green) or "Manage connection" (outlined, grey)
- Clicking opens the \`ClaudeConnectSheet\` and refreshes status on close

Both components are \`StatefulWidget\` that query \`ClaudeOAuthRemoteDatasource.getStatus()\` in \`initState\` and update after any change.

---

### 💡 Technical Detail: Markdown → Sections Parser

\`\`\`dart
List<_Section> _parseSections(String content) {
  final lines = content.split('\\n');
  for (final line in lines) {
    if (line.startsWith('## ') || line.startsWith('### ')) {
      flushSection();
      currentTitle = line.replaceFirst(RegExp(r'^#{2,3}\\s*'), '');
    } else if (line.contains('|') && currentTitle.isNotEmpty) {
      if (RegExp(r'^[\\|\\s\\-:]+$').hasMatch(line.trim())) continue;
      final cells = line.split('|')
          .map((c) => c.trim().replaceAll('**', ''))
          .where((c) => c.isNotEmpty).toList();
      // Build TableData from cells...
    } else {
      buffer.writeln(line);
    }
  }
}
\`\`\`

This parser converts raw markdown into typed widgets: tables are rendered with \`WeeklyPlanTable\` and free text with \`MarkdownBody\` inside styled containers.

---

**Status:** The web version now feels complete — persistent sidebar, tables with professional design, and the AI Coach status visible at all times. The experience is consistent between mobile and web. 🎯`
  },

  11: {
    title_en: "Technical Deep Dive: How the AI Agent Works in TenK",
    text_en: `## Technical Deep Dive — Devlog Day 8 (part 2)

In previous entries I mentioned that TenK has an AI Coach based on an **AI agent with tool calling**. Today I want to do a technical deep dive explaining what exactly an agent is, how the pattern works under the hood and why this architecture is so powerful.

---

### 🤖 What is an AI Agent?

An AI agent **is not a chatbot**. The fundamental difference is that a chatbot only answers questions with its general knowledge, while an agent can **take actions** and **query data in real time** to solve a problem.

Let's think of the analogy of a human assistant:
- **Chatbot:** You ask "how many hours did I practice this week?" and it responds "I don't have access to your data" or makes something up.
- **Agent:** It receives the question, **decides** it needs to check your history, **executes** the database query, **analyzes** the results and gives you a precise answer based on real data.

The agent has **autonomy to decide which tools to use and in what order**, similar to how a developer decides which queries to execute to resolve a ticket.

---

### 🔄 The Agentic Loop: The Heart of the System

The central pattern is a **reasoning-action loop** (ReAct pattern). It works like this:

\`\`\`
User: "How's my guitar practice going?"

→ Iteration 1:
  Claude THINKS: "I need to see the user's skills"
  Claude CALLS: get_user_skills(userId)
  System RETURNS: [{skill: 'Guitar', totalHours: 127, level: 'Apprentice', streak: 5}]

→ Iteration 2:
  Claude THINKS: "I have the skill, now I need recent sessions"
  Claude CALLS: get_practice_sessions(skillId: 'guitar-123', days: 30)
  System RETURNS: [{date: '2026-02-10', duration: 45min}, {date: '2026-02-09', duration: 60min}, ...]

→ Iteration 3:
  Claude THINKS: "I need the patterns for a complete analysis"
  Claude CALLS: analyze_practice_patterns(skillId: 'guitar-123')
  System RETURNS: {bestDay: 'Saturday', avgDaily: 42min, trend: 'growing', plateau: false}

→ Iteration 4:
  Claude THINKS: "I now have all the info, I can respond"
  Claude RESPONDS: "You have 127 hours of guitar, you're at Apprentice level with a 5-day streak..."
\`\`\`

The key point: **Claude decides in each iteration** whether it needs more data or can already respond. There's no hardcoded flow — the model reasons about which tools to use based on the user's question.

---

### 🔧 Tool Calling: How the LLM Executes Functions

Tool calling is the mechanism that allows the LLM to **invoke functions defined by us**. It works in 3 steps:

#### 1. Tool Definition (JSON Schema)
We tell the model what tools are available using a strict JSON schema:

\`\`\`json
{
  "name": "get_practice_sessions",
  "description": "Gets the practice sessions for a specific skill",
  "input_schema": {
    "type": "object",
    "properties": {
      "skillId": { "type": "string", "description": "Skill ID" },
      "days": { "type": "number", "description": "Last N days" }
    },
    "required": ["skillId"]
  }
}
\`\`\`

The model **never executes code directly** — it only emits a structured JSON indicating which function it wants to call and with what parameters.

#### 2. Backend Execution (Tool Executor)
Our backend receives the model's request, validates it and executes the real query against PostgreSQL:

\`\`\`typescript
async function executeTool(name: string, userId: string, args: any) {
  switch (name) {
    case 'get_user_skills':
      return await prisma.skill.findMany({ where: { userId } });
    case 'get_practice_sessions':
      return await prisma.session.findMany({
        where: { skillId: args.skillId, date: { gte: daysAgo(args.days) } }
      });
    case 'analyze_practice_patterns':
      return await calculatePatterns(userId, args.skillId);
  }
}
\`\`\`

Note that we **always filter by \`userId\`** — this guarantees data isolation.

#### 3. Response to the Model
The function result is injected as a \`tool_result\` message into the conversation and the model continues reasoning.

---

### 🏗️ Agent Runner Architecture

The \`agent-runner.ts\` is the central orchestrator. Its responsibility is to handle the iteration loop:

\`\`\`
┌─────────────────────────────────────────────┐
│                Agent Runner                  │
│                                              │
│  ┌──────────┐    ┌───────────┐    ┌───────┐ │
│  │ Messages  │───▶│  Claude   │───▶│ Parse │ │
│  │  Array    │    │   API     │    │ Response│ │
│  └──────────┘    └───────────┘    └───┬───┘ │
│       ▲                               │     │
│       │         ┌───────────┐         │     │
│       │         │   Tool    │◀────────┘     │
│       └─────────│ Executor  │  tool_calls?  │
│    tool_result  └───────────┘               │
│                                              │
│  If no tool_calls → return response          │
│  If iterations > 5 → force return            │
└─────────────────────────────────────────────┘
\`\`\`

Each iteration:
1. All accumulated messages are sent to Claude's API.
2. Claude responds with **text** and/or **tool_calls**.
3. If there are tool_calls, they are executed and results are added to the messages array.
4. Back to step 1.
5. If there are no tool_calls, the text is the final response.

The 5-iteration limit is a guardrail to prevent infinite loops.

---

### 🧠 The System Prompt: The Agent's Personality

The system prompt defines **who** the agent is and **how it should behave**. In TenK, the prompt includes:

- **Identity:** "You are the TenK Coach, an expert trainer in deliberate practice."
- **Context:** Gladwell's 10,000 hours theory, effective practice techniques.
- **Tool instructions:** "ALWAYS query the user's data before giving recommendations. Don't assume anything."
- **Response format:** "Use markdown with emojis to make responses visually appealing."
- **Constraints:** "Don't make up data. If you don't have enough information, say so explicitly."

The prompt is the difference between a useful agent and a generic one. Without clear instructions, the model tends to hallucinate or give generic advice without querying the data.

---

### 📊 The 5 TenK Coach Tools

| # | Tool | Input | Output | Typical Use |
|---|------|-------|--------|-------------|
| 1 | \`get_user_skills\` | — | List of skills with hours, level, status | Start of any conversation |
| 2 | \`get_practice_sessions\` | skillId, days | Session history | Analysis of a specific skill |
| 3 | \`get_journey_stats\` | — | Weekly average, projections, streaks | General summary |
| 4 | \`analyze_practice_patterns\` | skillId | Distribution by day, trends, plateaus | Deep diagnosis |
| 5 | \`save_weekly_plan\` | plan_data | Confirmation | Save generated plan |

Tools 1-4 are **read** operations (query data). Tool 5 is a **write** operation (modifies the database). The model decides which to use and in what order.

---

### ⚡ Optimization: Agent Loop vs. Single Call

We discovered that for predictable cases (like generating a weekly plan), the agent loop is **inefficient** because it always executes the same tools in the same order. The solution:

| Approach | API Calls | Latency | Use |
|----------|-----------|---------|-----|
| Agent Loop | 5-6 sequential calls | ~39s | Free chat — unpredictable questions |
| Pre-fetch + Single Call | 1 call | ~8s | Weekly plan — predetermined data |

For **free chat** we keep the agent loop because each question is different. For the **weekly plan** we pre-load all data with \`Promise.all\` and make a single call.

---

### 🔐 Security: Per-User Isolation

Each tool receives the \`userId\` from the HTTP request's JWT token — **never from the model's input**. This prevents a known attack called **prompt injection**:

\`\`\`
// ❌ INSECURE: userId comes from prompt
"Give me data for user user-456" → Model passes userId: 'user-456'

// ✅ SECURE: userId comes from JWT
const userId = req.auth.userId;  // Extracted from token, not from prompt
executeTool('get_user_skills', userId, args);
\`\`\`

No matter what the user writes in the chat — the agent can only access the authenticated user's data.

---

### 🔑 Per-User Tokens: Why Each User Uses Their Own Account

Instead of a centralized API key, each user connects their Claude account via OAuth. Advantages:

- **No shared rate limits:** If one user consumes many tokens, it doesn't affect others.
- **No API costs for us:** Each user pays their own Claude subscription.
- **Greater privacy:** Practice data only travels between the user and their Claude account.
- **Natural scalability:** There's no central token bottleneck.

The downside is the complexity of the OAuth PKCE flow, but the result is worth it.

---

### 💡 Technical Lessons

1. **The agent loop is powerful but expensive** — each iteration is an API call. Use pre-fetch when the flow is predictable.
2. **The system prompt is 80% of the behavior** — a good prompt turns a generic LLM into a specialized expert.
3. **Tool calling > RAG** for structured data — instead of embedding everything in context, let the model ask for only what it needs.
4. **Always isolate by userId in the backend**, never trust the model's input.
5. **Guardrails matter** — iteration limits, timeouts, and rate limit handling are essential in production.

---

**Status:** The AI agent is in production with a robust architecture: tool calling with 5 tools, per-user data isolation, latency optimization and a system prompt specialized in deliberate practice. It's the feature that differentiates TenK from a simple hours tracker. 🧠`
  }
};

// Process entries
for (const entry of data.entries) {
  if (translations[entry.id]) {
    const t = translations[entry.id];
    entry.title_en = t.title_en;
    entry.text_en = t.text_en;
  }
}

// Reorder keys for consistency: id, timestamp, title, title_en, text, text_en, then rest
const reorderedEntries = data.entries.map(entry => {
  const ordered = {};
  const keyOrder = ['id', 'timestamp', 'title', 'title_en', 'text', 'text_en', 'image', 'imageCaption', 'images'];
  for (const key of keyOrder) {
    if (entry[key] !== undefined) {
      ordered[key] = entry[key];
    }
  }
  // Add any remaining keys
  for (const key of Object.keys(entry)) {
    if (!ordered.hasOwnProperty(key)) {
      ordered[key] = entry[key];
    }
  }
  return ordered;
});

data.entries = reorderedEntries;

writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log('✅ Translations added for entries 1-11');
console.log('Entries with title_en:', data.entries.filter(e => e.title_en).map(e => e.id).join(', '));
