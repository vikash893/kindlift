# Contributing to KindLift

Thank you for considering contributing to **KindLift**! We welcome all kinds of contributions — bug reports, feature suggestions, documentation improvements, and code contributions.

## 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/kindlift.git
   cd kindlift
   ```
3. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies** for both frontend and backend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
5. **Set up environment variables** — copy `backend/.env.example` to `backend/.env` and fill in your values

## 📁 Project Layout

| Directory | Description |
|-----------|-------------|
| `backend/` | Express.js API server with MongoDB |
| `backend/routes/` | API route handlers |
| `backend/models/` | Mongoose schema definitions |
| `backend/middleware/` | Express middleware (auth, etc.) |
| `frontend/` | React application |
| `frontend/src/pages/` | Page-level components |
| `frontend/src/components/` | Reusable UI components |
| `frontend/src/context/` | React Context providers |
| `frontend/src/lib/` | Shared utilities (API client, socket) |

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear, readable history:

```
feat: add ride rating summary to dashboard
fix: correct distance calculation for edge cases
docs: update API documentation with rating endpoints
style: format routes with consistent error handling
refactor: extract OTP logic into separate utility
test: add unit tests for Haversine distance formula
chore: update express-rate-limit to v8
```

## 🔄 Pull Request Process

1. **Ensure your code works** — test locally before submitting
2. **Write clear PR descriptions** explaining what and why
3. **Keep PRs focused** — one feature or fix per PR
4. **Update documentation** if your change affects the API or setup process
5. **Follow existing code style** — match indentation, naming patterns, etc.

## 🐛 Reporting Bugs

When filing a bug report, please include:

- **Steps to reproduce** the issue
- **Expected behavior** vs. **actual behavior**
- **Screenshots** if applicable
- **Environment** (OS, Node.js version, browser)

## 💡 Suggesting Features

Feature suggestions are welcome! Please include:

- **Use case** — What problem does this solve?
- **Proposed solution** — How would you implement it?
- **Alternatives considered** — Any other approaches?

## 📜 Code of Conduct

- Be respectful and inclusive in all interactions
- Provide constructive feedback
- Focus on the code, not the person

---

Thank you for helping make KindLift better! 🚗💚
