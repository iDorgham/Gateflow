# Phase 6: Advanced Settings Adaptation (v6)

## Overview
Phase 6 adapted the organization-types dashboard by finalizing the context-aware Advanced Settings interface. The settings navigation and interface are now dynamically generated based on the organization's vertical and user permissions.

## Key Accomplishments
- **Dynamic Navigation Refactor**: Refactored `SettingsLayout` to be driven by the `ORGANIZATION_FEATURES` registry. The sidebar and horizontal tab navigation now automatically filter visibility based on the organization's `SettingsConfig`.
- **Terminology Injection**: Integrated dynamic labeling based on the `OrganizationTerminology` registry. Headers, titles, and labels now adapt to the organization's vertical (e.g., 'School Settings' for schools).
- **RBAC Integration**: Updated `SettingsLayout` to consume user permissions from session claims. Sensitivity-governed tabs like `API Keys` or `Roles` are now only visible if the user has the required permission (`api_keys:manage`, `roles:manage`).
- **SettingsClient Synchronization**: Refactored `SettingsClient` (the professional, single-page settings interface) to use the same dynamic filtering and terminology logic as the main layout, ensuring architectural symmetry.
- **Vertical-Specific Expansion**: Enabled the `residents` (Units & Residents) settings tab for School, Club, and Nightclub verticals to allow management of industry-specific structures (e.g., Classrooms, Tables).

## Technical Details
- **Source of Truth**: UI logic now relies entirely on `useOrganizationFeatures()` and `getOrganizationFeatures()`.
- **Security**: Access is governed by session claims passed from the server-side layout.
- **Component Localization**: Server components like `ResidentsSettings` now use `getTranslation` with the `locale` parameter for accurate localization.

## Verification
- [x] SCHOOL vertical: Shows 'Campus Overview Settings', 'Classrooms & Students' tab.
- [x] REAL_ESTATE vertical: Shows 'Compound Overview Settings', 'Units & Residents' tab.
- [x] NIGHTCLUB vertical: Shows 'Venue Overview Settings', 'Zones & VIPs' tab.
- [x] RBAC: Tabs are filtered based on `api_keys:manage` and `roles:manage` claims.
