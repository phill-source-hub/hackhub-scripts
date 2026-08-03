# HackHub Sandbox Restrictions

**Rules confirmed through actual testing in HackHub.**

This document grows as we discover what works and what doesn't. Only add restrictions when confirmed by real-world errors.

---

## ✅ Confirmed Working

- Synchronous JavaScript code
- Standard objects, arrays, functions
- Math operations
- String manipulation

---

## ❌ Confirmed NOT Allowed

### setTimeout / setInterval
- **Error:** "disallowed code snippet"
- **Tested:** Yes
- **Date Confirmed:** 2026-08-03
- **Alternative:** Write synchronous logic only

---

## 🧪 To Be Tested

- [ ] Promises / async-await
- [ ] fetch() / HTTP requests
- [ ] File system access
- [ ] Node.js built-in modules (fs, path, etc.)
- [ ] eval() / Function()
- [ ] Classes
- [ ] try-catch error handling
- [ ] Regular expressions
- [ ] JSON operations
- [ ] Array methods (map, filter, reduce, etc.)

---

## Official Documentation

- **HackHub SDK:** https://docs.hotbunny.dev/
- **Community Docs:** https://docs.hackhub.tools/

---

## How to Add to This List

When you hit a compilation error in HackHub:

1. Note the **exact error message**
2. Note the **code snippet** that caused it
3. Add it to this document with:
   - ❌ or ✅ status
   - Error message (if applicable)
   - Tested date
   - Any workarounds found

---

Last Updated: 2026-08-03