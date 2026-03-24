# GitHub Actions CI/CD

<div align="center">

**CI/CD workflows for the GateFlow project**

_Automated testing, deployment, and releases_

[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Automation-black?style=for-the-badge&logo=github-actions)](https://github.com/features/actions)

</div>

---

## Workflows

| Workflow         | Trigger              | Purpose                        |
| :--------------- | :------------------- | :----------------------------- |
| `ci.yml`         | Push / PR            | Lint + typecheck + test        |
| `deploy.yml`     | Push to master       | Deploy to Vercel               |
| `lighthouse.yml` | PR / daily           | PageSpeed audits               |
| `release.yml`    | `git push origin v*` | Auto GitHub Release            |
| `pr-labels.yml`  | PR                   | Size label + affected packages |

---

## PR Size Labels

| Label     | Lines Changed |
| :-------- | :------------ |
| `size/XS` | < 10          |
| `size/S`  | 10–99         |
| `size/M`  | 100–499       |
| `size/L`  | 500–999       |
| `size/XL` | ≥ 1000        |

---

## Related Documentation

| Document                                                  | Description             |
| :-------------------------------------------------------- | :---------------------- |
| [CI/CD Overview](../../README.md#-cicd--deployment)       | Full deployment guide   |
| [Automation Guide](../../docs/guides/AUTOMATION_GUIDE.md) | Ralph scripts and hooks |
