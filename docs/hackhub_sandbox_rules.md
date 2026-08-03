# HackHub Sandbox Restrictions

**Rules confirmed through actual testing in HackHub.**

---

## ✅ Confirmed WORKING

Tested 2026-08-03 via sandboxTest script:

- try-catch error handling
- Classes and class syntax
- Regular Expressions (/regex/g syntax)
- JSON.stringify() and JSON.parse()
- Array methods (map, filter, reduce)
- Arrow functions
- Object destructuring
- Spread operator (...)
- for...of loops
- async/await syntax

---

## ❌ Confirmed NOT ALLOWED

### setTimeout / setInterval
- **Error:** "disallowed code snippet"
- **Tested:** 2026-08-03
- **Workaround:** Use synchronous logic only

### console.log()
- **Error:** "Cannot find name 'console'"
- **Tested:** 2026-08-03
- **Workaround:** Use `println(string)` instead

### require.main / module
- **Error:** "Cannot find name 'require'" / "Cannot find name 'module'"
- **Tested:** 2026-08-03
- **Workaround:** Remove module detection code

### Complex template literals
- **Error:** "disallowed code snippet" (when using expressions in templates)
- **Tested:** 2026-08-03
- **Workaround:** Use string concatenation with `+` operator

---

## HackHub-Specific APIs

- **println(message: string)**: Output text to game console
- **sleep(ms: number)**: Async delay (works with await)
- HackHub SDK methods from `@hotbunny/hackhub-content-sdk`

---

## Best Practices

1. Use `println()` not `console.log()` for output
2. Declare external functions with `declare function name(...)`
3. Write synchronous code where possible
4. Use string concatenation instead of complex template literals
5. Test in-game frequently - TypeScript compilation passes doesn't mean HackHub will accept it

---

Last Updated: 2026-08-03