# Design System Strategy: Tonal Architecture & The Secure Monolith

## 1. Overview & Creative North Star
In the world of Identity Provision (IdP) and Administrative Dashboards, security often defaults to "cluttered" or "industrial." This design system rejects that. Our Creative North Star is **"The Secure Monolith"**—a design philosophy rooted in architectural stability, editorial clarity, and tonal depth.

We move away from the "web-app-in-a-box" look by eliminating traditional borders and rigid grids. Instead, we use **Tonal Layering** to define space. The interface should feel like a series of high-end, weighted slabs. By using intentional asymmetry in our dashboard layouts and high-contrast typography scales, we create an environment that feels both impenetrable and effortless. This is not just a tool; it is a sovereign digital space.

## 2. Colors: Depth Over Definition
Our palette is anchored in deep blacks and tech-focused blues, providing an immediate sense of authority.

*   **The "No-Line" Rule:** Under no circumstances should a 1px solid border be used to separate sections. Boundaries are created through background shifts. A sidebar uses `surface_container_low`, the main content area uses `surface`, and nested widgets use `surface_container_highest`. 
*   **Surface Hierarchy & Nesting:** Treat the UI as a physical stack.
    *   **Base:** `surface` (#f7f9fb)
    *   **Sectioning:** `surface_container_low` (#f2f4f6)
    *   **Interactive Cards:** `surface_container_lowest` (#ffffff)
    *   **Elevated Overlays:** `surface_container_high` (#e6e8ea)
*   **The Glass & Gradient Rule:** For floating authentication cards or high-level admin notifications, use **Glassmorphism**. Apply `surface_container_lowest` with 80% opacity and a `24px` backdrop blur. 
*   **Signature Textures:** For primary CTAs or "Secure Login" buttons, use a subtle linear gradient from `primary` (#000000) to `primary_container` (#001b3d). This adds a "weighted" feel that a flat color cannot replicate.

## 3. Typography: The Editorial Authority
We pair the geometric precision of **Manrope** for headers with the Swiss-style functionalism of **Inter** for data.

*   **Display & Headlines (Manrope):** These are our "Monolith" elements. Use `display-md` for landing authentication headers. The tight kerning and geometric "O"s convey modern security.
*   **Body & Labels (Inter):** All functional data, table cells, and form labels use Inter. 
*   **The Editorial Twist:** To elevate the "Admin" experience, use `label-sm` with 0.05em letter-spacing and `uppercase` transform for table headers. This mimics high-end financial reports and improves scannability.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "muddy." We use light and tone to imply height.

*   **The Layering Principle:** Instead of a shadow, place a `surface_container_lowest` card on a `surface_container` background. The subtle shift from #ffffff to #eceef0 creates a natural edge.
*   **Ambient Shadows:** If a floating element (like a User Profile popover) requires a shadow, it must use a 12% opacity of the `on_surface` color (#191c1e) with a blur of `32px` and a `12px` Y-offset. It should feel like a soft glow, not a hard drop.
*   **The "Ghost Border" Fallback:** In high-density data tables where separation is critical, use the `outline_variant` (#c6c6cd) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Use this for "Global Search" overlays. Use `surface_container_lowest` at 70% opacity with a `16px` blur to keep the dashboard context visible behind the search.

## 5. Components: The Primitive Set

### Buttons
*   **Primary:** Solid `primary` background with `on_primary` text. Use `lg` (0.5rem) roundedness for a modern, approachable feel.
*   **Secondary:** `secondary_container` background. No border.
*   **States:** On `:hover`, transition the background to `primary_container`. On `:active`, scale the button to 98% to provide tactile feedback.

### Inputs & Forms
*   **The "Ghost" Input:** Input fields should not have a 4-sided border. Use a `surface_container_high` background with a `2px` bottom-only border in `outline_variant`. On focus, the bottom border transitions to `surface_tint` (#005db5).
*   **Validation:** Error states use `error` (#ba1a1a) for the bottom border and `error_container` as a faint (10% opacity) background fill.

### Tables & Data Lists
*   **No Dividers:** Forbid the use of horizontal lines between rows. Use vertical white space (`16px` padding) and a subtle `surface_container_low` background on `:hover` to highlight the active row.
*   **Status Badges:** Use `full` roundedness. A "Success" state should use `on_tertiary_container` text on a background of `tertiary_fixed` at 30% opacity. This creates a "soft jewel" effect.

### Navigation
*   **The Sidebar:** Use a vertical "Asymmetric Rail." Icons should be `outline` color, shifting to `primary` with a small `surface_tint` vertical pill on the left to indicate the active state.

### Administrative Cards
*   Use `surface_container_lowest` with a `xl` (0.75rem) roundedness. These cards should "float" on a `surface` background using the Ambient Shadow rule.

## 6. Do's and Don'ts

### Do:
*   **Do** use white space as a structural element. If a section feels crowded, increase the padding rather than adding a line.
*   **Do** use `headline-sm` for widget titles to maintain an authoritative editorial feel.
*   **Do** ensure all "Success" actions use the `on_tertiary_container` blue-hued tokens to keep the "trustworthy blue" theme consistent even in success states.

### Don't:
*   **Don't** use pure gray (#808080) for anything. Always use our tinted neutrals (`on_surface_variant` or `outline`) to keep the palette "expensive."
*   **Don't** use 100% opaque borders. They break the "Secure Monolith" illusion and make the UI look like a legacy bootstrap template.
*   **Don't** use `display` type scales for long-form body text. Keep Manrope for headings and Inter for reading.