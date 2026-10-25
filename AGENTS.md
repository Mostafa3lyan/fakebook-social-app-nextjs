# Fakebook Frontend — Development Rules

## 1. Project Principles

- Follow the existing project's architecture, coding conventions, and installed Next.js version.
- Use the Exam App project as a reference for folder structure and coding style where appropriate, but do not blindly copy outdated patterns.
- Inspect existing code and documentation before making changes.
- Preserve working functionality and avoid unnecessary rewrites, dependencies, or unrelated modifications.
- Follow the backend integration guide and the latest backend update report. Never invent API endpoints, request fields, response properties, or business logic.
- Prioritize maintainability, readability, reusability, accessibility, and production-quality code.

## 2. Mandatory Workflow: Plan Before Implementation

- Before substantial changes, inspect the relevant files, components, dependencies, and existing patterns.
- Present an implementation plan before coding.
- For page refactoring, provide a route-by-route plan with proposed file changes, component boundaries, Server/Client Component decisions, dependencies, risks, and acceptance criteria.
- Identify existing components that can be reused before proposing new ones.
- Wait for my approval before implementing the proposed plan.
- Implement incrementally, feature by feature, and verify each phase.
- Do not perform broad folder restructuring or rewrite unrelated code without approval.
- Report the files changed, checks actually run, their results, and any remaining issues. Never claim that a test or build passed unless you ran it.

## 3. Mandatory Server Components for Every Page and Layout

**Every `page.tsx` and `layout.tsx` must be a Server Component. Never put `"use client"` in these files.**

Apply this rule to every route in the App Router, including authentication pages, feeds, profiles, settings, nested layouts, and future routes.

### Responsibilities of `page.tsx` and `layout.tsx`

- Keep route files focused on server-side responsibilities and composing components.
- Fetch initial data on the server using `async`/`await` where appropriate.
- Read, validate, and use `params` and `searchParams` according to the installed Next.js version.
- Handle authentication and authorization on the server when appropriate.
- Use `redirect()` and `notFound()` when required.
- Export `metadata` or `generateMetadata` when appropriate.
- Pass server-fetched data to child components through clearly defined, strongly typed props.
- Keep server-only logic and secrets on the server.
- Avoid putting large amounts of UI markup, business logic, and unrelated responsibilities directly into route files.

### Extract existing page UI into separate components

- Move substantial page UI and logic out of `page.tsx` into appropriately named component files.
- Do not automatically make extracted components Client Components.
- Extracted components should remain Server Components by default unless they genuinely require client-side functionality.
- A separate component file does not need `"use client"` simply because it is rendered by a page.
- Keep server-side data fetching and authentication in the route or appropriate server-side module when that is the cleanest design.
- Preserve existing behavior while refactoring. Do not simply delete `"use client"` from an existing page without relocating the client-only functionality it supports.

## 4. Small, Focused Components — No Monolithic Files

**Do not replace a large page with one enormous wrapper component or move all the page's UI into a single oversized file.**

Split complex pages into smaller components with clear responsibilities.

For example, a social feed may be composed of:

- `FeedHeader`
- `PostComposer`
- `PostList`
- `PostCard`
- `PostActions`
- `CommentsSection`
- `CommentForm`

These are examples, not a requirement to create every file for every page. Choose the breakdown that fits the actual UI and existing architecture.

### Component design rules

- Each component should have one clear primary responsibility.
- Split components when they contain multiple distinct UI sections, unrelated responsibilities, complex conditional rendering, or substantial independent interaction logic.
- Keep components small enough to understand and maintain without navigating a huge file.
- Separate presentation, data access, and business logic when doing so improves readability, testing, or reuse.
- Avoid arbitrary line-count limits. Use good judgment based on complexity and responsibility.
- Do not create a separate file for every trivial element, one-line expression, or unnecessary wrapper.
- Avoid both extremes: monolithic files and excessive fragmentation.
- Keep component names descriptive and consistent with the project's conventions.
- Keep component props small, explicit, and strongly typed. Pass only the data a component needs rather than large unrelated objects.
- Keep interactive state close to the component responsible for the interaction.
- Extract custom hooks and utilities when they represent meaningful reusable behavior.
- Do not introduce abstractions that make the code harder to understand without providing a real benefit.

## 5. Reusable Components and Folder Organization

- Inspect existing shared components before creating new ones.
- Reuse existing components whenever they already meet the requirement.
- Extract shared components when a UI pattern or behavior is used across multiple features or has a clear independent purpose.
- Keep feature-specific components close to the feature that owns them.
- Keep genuinely reusable UI components in the project's shared UI/components directory, following its existing structure.
- Separate shared UI primitives from feature-specific components.
- Avoid duplicated implementations of buttons, dialogs, avatars, inputs, dropdowns, cards, and similar patterns.
- Do not put unrelated components into a giant `components.tsx` file.
- Do not put all components into a single generic folder if the existing project uses feature-based organization.
- Avoid creating a new folder structure when the current structure already supports the feature well.
- Prefer clear, cohesive modules over unnecessary abstraction layers.

## 6. Keep Client Components as Small as Possible

Add `"use client"` only to files that actually require client-side functionality, such as:

- `useState`, `useEffect`, `useReducer`, or other client React hooks.
- Context providers and consumers that require client context.
- Event handlers such as `onClick`, `onChange`, and `onSubmit`.
- Browser APIs such as `window`, `document`, or `localStorage`.
- Client-only libraries that require a browser environment.

Do not add `"use client"` simply because a component contains JSX, receives props, or is imported by another component.

### Split interactive UI from server-rendered UI

- Keep static markup, server-rendered content, and server-side data fetching in Server Components.
- Isolate interactive forms, filters, dropdowns, modals, tabs, post composers, reaction controls, and other interactive elements in focused Client Components.
- Do not turn an entire page into a Client Component because one section requires interaction.
- Do not create one giant client wrapper containing all page sections, data, state, and event handlers.
- Keep client boundaries as low and narrow in the component tree as practical.
- Reuse a small Client Component inside a Server Component when appropriate.
- Ensure that moving interaction into a child component does not break existing behavior.

### Server and Client Component composition

- Server Components may render Client Components and pass them serializable props.
- When a Client Component needs to contain server-rendered content, pass that content through `children` or another appropriate composition slot from a Server Component.
- Do not import a Server Component into a Client Component and expect it to remain server-rendered.
- Do not pass non-serializable values across the Server/Client Component boundary unless the framework explicitly supports that use case.
- Keep interactive state inside the smallest component that needs it instead of lifting all state into a page-level wrapper.

## 7. Data Fetching, Authentication, and Caching

- Fetch initial page data on the server when appropriate.
- Keep server-only data access and secrets out of client bundles.
- Follow the existing authentication architecture and backend contracts.
- Enforce authorization on the server or backend; hiding a button in the UI is not authorization.
- Handle loading, empty, success, and error states appropriately.
- Use caching and revalidation deliberately, especially for private or user-specific data.
- Never allow private data to leak between users through shared caching.
- Use Client Components for client-side interactions and mutations when required by the existing architecture.
- Do not introduce a new state-management or data-fetching library without a clear reason and approval where the change is significant.

## 8. TypeScript and Code Quality

- Use TypeScript consistently.
- Define accurate, strongly typed component props, API responses, and form values.
- Avoid `any` unless there is a clear, justified reason.
- Avoid unnecessary type assertions and suppressions.
- Keep components and functions readable, focused, and easy to test.
- Remove duplicated logic when a shared implementation is genuinely appropriate.
- Follow the existing linting, formatting, naming, and error-handling conventions.
- Do not silence errors simply to make the build pass.

## 9. UI Design and Responsiveness

- Use a Facebook-inspired light theme: white surfaces, light-gray backgrounds, blue accents, and a familiar social feed layout.
- Use an X/Twitter-inspired dark theme: near-black surfaces, subtle borders, readable text, and restrained accent colors.
- Keep both themes visually consistent and distinguishable.
- Use a mobile-first responsive approach for phones, tablets, and desktops.
- Prefer reusable design tokens and shared styling conventions.
- Avoid unnecessary visual effects or inconsistent styles between features.
- Preserve the existing design direction when refactoring components.

## 10. Accessibility

- Use semantic HTML and a logical heading structure.
- Provide accessible names for icon-only buttons and controls.
- Ensure keyboard accessibility and visible focus indicators.
- Use accessible labels and validation messages for forms.
- Handle dialog focus and keyboard interactions appropriately.
- Provide meaningful image alternative text where needed.
- Maintain sufficient contrast and do not communicate important information through color alone.
- Aim for WCAG 2.2 AA accessibility where practical.

## 11. Required Refactoring Process

When refactoring an existing page:

1. Inspect the route file and every component, hook, and utility it depends on.
2. Identify server responsibilities, static UI, interactive UI, and existing reusable components.
3. Propose the new file structure and component responsibilities.
4. Identify which components remain Server Components and which require `"use client"`.
5. Explain how data and props will flow between components.
6. Identify potential behavior changes, authentication concerns, and API dependencies.
7. Wait for my approval.
8. Implement the refactor incrementally.
9. Run relevant checks and inspect the result for regressions.
10. Summarize the changes and any remaining issues.

Do not mechanically move code between files without understanding its dependencies.

## 12. Definition of Done

A task is complete only when:

- Every `page.tsx` and `layout.tsx` remains a Server Component without `"use client"`.
- Server-side data fetching, authentication, redirects, and metadata are handled appropriately.
- Page UI is separated into focused, appropriately named component files.
- No page has been replaced with a single oversized client wrapper.
- Interactive behavior is isolated in small Client Components.
- Components are reusable where it makes sense, without excessive fragmentation.
- Existing shared components are reused where appropriate.
- TypeScript props and Server/Client Component boundaries are correct.
- Backend API contracts and existing functionality are preserved.
- Responsive design and accessibility have been considered.
- Relevant checks have actually been run and their results reported accurately.
- The final response lists changed files, important decisions, verification results, and unresolved issues.