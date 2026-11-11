# Contributing Guidelines
## St. Philomena's College (Autonomous) Web Portal

Thank you for contributing to the St. Philomena's College digital portal and administrative system.

---

## 1. Branching Strategy

- `main`: Production-ready branch. All commits must pass CI verification.
- Feature branches: `feat/<feature-name>`, `fix/<issue-name>`, `chore/<task-name>`.

---

## 2. Institutional Data Integrity

- The official website [https://stphilos.ac.in](https://stphilos.ac.in) remains the primary source of truth.
- Do not fabricate, modify, or invent faculty names, designations, dates, or governance structures.
- All historical documents, notifications, and media files must reflect verified college records.

---

## 3. Commit Convention

Use semantic commit messages:
- `feat(module): description`
- `fix(module): description`
- `perf(module): description`
- `chore(module): description`

---

## 4. Pre-Commit Checklist

Before pushing any changes:
1. Run `npm run build` to verify frontend bundling.
2. Run `php -l` on modified backend PHP files.
3. Verify that no `.env` or sensitive credentials are staged.
4. Verify all tests pass.
