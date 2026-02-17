# BumbleFlow
Bumble Flow – Vibe Coded Prototype (Iteration 2)

Overview
Bumble Flow is a scheduling-aware matching layer designed to reduce friction between intent and action. Instead of passive matching, Flow activates during time windows when users are actively available to meet.

This prototype explores how availability logic, match quality, and interaction states can be modeled behaviorally — not just visually.

The current build is an early iteration focused on system structure, interaction logic, and state modeling rather than visual polish.

## Current Progress
1. System Architecture Setup
The Figma file has been reorganized using a structured naming convention: 
- Platform / Plan / Screen / State (e.g., Mobile / Free Plan / Initial Screen / Default)

This structure supports:
- Predictable scaling
- AI-assisted iteration
- Reduced ambiguity between similar states

Clear separation between Free and Premium logic

2. Component System
Core components are structured and state-driven:
- Buttons: Default / Selected / Disabled
- Toggles: On / Off
- Conditional Premium UI
- Editable time-slot states

Variants are explicitly defined to prevent duplication and unintended overrides during iteration.

3. Prototype Implementation
The prototype is connected and functional at a foundational level.

Currently implemented:
- Initial screen rendering
- Free vs Premium conditional logic
- Selected / non-selected button states
- Basic Flow activation modeling

The initial coded screen exists, but does not yet fully align with the wireframe hierarchy or spacing logic. Ongoing iteration is required to refine layout structure and match UX intent.

This milestone focuses on structural alignment and behavioral modeling rather than pixel precision.

## Design–Code Co-Evolution
This prototype is being developed in parallel with Figma.

Workflow:
- Refine structure in Figma
- Translate into coded states
- Identify logic mismatches
- Adjust layout + interaction logic
- Re-test behavior

This back-and-forth process is intentionally surfacing edge cases early (e.g., state mutations, time-slot removal logic, premium gating).

## Interaction Logic Being Modeled
- Flow activation windows (Manual vs Scheduled)
- Time-slot mutation after confirmation
- Conditional rendering for Free vs Premium users
- Contextual meet-up requests (non-disruptive feed insertion)

## Future iterations will refine:
- Time overlap detection
- Push vs contextual notification modeling
- Sunset Summary match logic
- Calendar sync behavior

## Known Gaps
- Layout hierarchy does not yet fully match wireframes
- Spacing and visual alignment require refinement
- Edge-case handling for time-slot conflicts needs expansion
- Premium scheduling logic is partially implemented

## Next Steps
- Continue iterative alignment between Figma and code
- Refine component spacing and structural hierarchy
- Expand overlap detection logic
- Improve state transition smoothness
- Model additional edge cases for availability mutation