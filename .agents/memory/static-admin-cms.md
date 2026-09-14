---
name: Static admin CMS
description: The portfolio admin editor intentionally uses browser-local persistence instead of a database or server authentication.
---

The `/admin` studio is a static, browser-only CMS: content, login credentials, recovery code, and the admin session are stored in localStorage.

**Why:** The user explicitly requested a WordPress-like editor without a database or auth service, so the simplest dependable implementation is local browser persistence.

**How to apply:** Preserve this constraint for future admin changes unless the user explicitly asks for shared, cross-device publishing. Be clear that edits belong to the browser where they were made and can be lost if browser storage is cleared.