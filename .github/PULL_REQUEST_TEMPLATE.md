## Summary
- What this PR changes and why.

## Scope
- Module(s): Java API / ds-service / dashboard / infra
- Primary areas: security/auth, churn domain, infra/devops

## Checklist
- [ ] Diff summary provided (files/modules touched)
- [ ] Java tests run: `./mvnw -q -DskipITs=false test` (attach failures if any)
- [ ] DS service health checked: `curl http://localhost:8000/health`
- [ ] API health checked (with JWT): `curl -H "Authorization: Bearer <token>" http://localhost:8080/actuator/health`
- [ ] CSV batch sample tested against `/api/churn/predict/batch/csv`
- [ ] Dashboard/frontend smoke tested (CSV upload, stats rendering)
- [ ] Environment vars documented/updated if needed (`api.security.secret`, `churn.ds.url`, etc.)
- [ ] Labels set: `sequential merge step N`, `churn`/`security`/`infra` as applicable

## Notes
- Known risks and mitigations.
- Follow-up tasks if any.
