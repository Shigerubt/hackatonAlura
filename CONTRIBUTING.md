# Contributing

## Branching & Commits
- Branch names: `feature/<topic>`, `fix/<topic>`, `chore/<topic>`
- Prefer squash merges; keep a linear history on `main`.
- Commit messages: concise imperative, e.g., "Add churn batch CSV mapping".

## Pull Requests
- Use the PR template and complete the checklist.
- Run Java tests: `./mvnw -q -DskipITs=false test` and attach failures if any.
- Smoke test ds-service (`/health`) and dashboard (CSV upload / stats).
- Label PRs: `sequential merge step N`, plus scope labels: `churn` / `security` / `infra`.
- Auto-merge: enable `--auto --squash` only when CI is green and reviewed.

## Environments & Secrets
- Local `.env` aligning with `api.security.secret`, `churn.ds.url`, DB creds.
- Do not commit secrets; use repo/environment secrets in CI.

## CI & Required Checks
- CI jobs: `maven-tests`, `python-ds`, `python-dashboard` must pass.
- Broken tests or checks block merges; fix or disable only with justification.

## Code Style & Tests
- Follow existing project conventions; avoid unrelated refactors in feature PRs.
- Add/adjust tests when you change behavior or contracts.
