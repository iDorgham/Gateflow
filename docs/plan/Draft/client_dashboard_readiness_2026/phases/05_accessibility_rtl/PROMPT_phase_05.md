# Phase 05 — Accessibility, RTL, and page readiness

Act as the single primary writer. Test the nine pilot-critical/P0 surfaces in
English and Arabic at representative mobile and desktop widths.

Verify keyboard sequence, visible focus, names/labels, heading structure,
status/error announcements, contrast, zoom, touch targets, loading, empty,
error, denied, offline, and success states. Replace unsafe physical direction
utilities with logical equivalents and verify QR values, identifiers, codes,
dates, and numbers are bidi-isolated. Do not perform a blind repository-wide
replacement.

Capture route-specific screenshots and browser evidence. Refresh the page-score
JSON using observed behavior and security evidence; explain each score and do
not reuse the static-review-only cap after browser validation.

Run focused lint/typecheck/test/build and applicable browser/accessibility
checks. Update TASKS, SESSION_MEMORY, and the phase log.

Mutation boundary: focused UI and justified shared design-system fixes only; no
deployment or production mutation.

Exit: Phase 06 prompt.
