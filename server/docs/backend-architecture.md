# Backend Architecture Guidelines

## 1. Controllers

Controllers are responsible for:

- Receiving Express requests.
- Reading `req.body`, `req.params`, `req.query`, and `req.user`.
- Calling services.
- Sending HTTP responses.

Controllers must not contain business logic.

---

## 2. Services

Services contain business logic.

Services must:

- Be independent from Express.
- Never receive `req` or `res`.
- Accept a single object parameter.
- Return data or throw errors.
- Delegate specialized responsibilities to other services.

Example:

```javascript
await someService({
    productId,
    quantity,
    user,
});