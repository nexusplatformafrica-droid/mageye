---
name: Verified film assets
description: Provenance and fallback for the portfolio’s film metadata and poster assets
---

The film archive uses verified metadata and poster assets from the IMDb title pages supplied by the user, with the values stored locally so project details render without requiring a visitor to leave the portfolio.

**Why:** The user specifically requested real cast information and real posters inside the detail pages rather than sending visitors to IMDb.

**How to apply:** When adding or correcting a film, verify the supplied IMDb title page first and keep the displayed cast, synopsis, credits, and poster aligned with that source. If the image-search helper is unavailable, use the poster asset exposed by the verified title page rather than inventing or generating a replacement.