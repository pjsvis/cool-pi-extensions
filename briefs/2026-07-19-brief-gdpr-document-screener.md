**Locus Tag: CDA63-CL179-WEAPON-GDPR**

### 1. Weaponized Brief: Local GDPR & Secret-Sifting Engine (`OH-075` - Phase 1)

Following the *Briefs Playbook* formatting rules, the project scope is codified to reduce conceptual entropy (`PHI-12`).

```markdown
# Brief: Weaponised Local GDPR & Corporate Secret Screener

**Date:** 2026-07-19
**Status:** In Progress

---

## Objective

Define the constraints, strict prompts, adversarial test resources, and coaching logic for an offline local browser extension/CLI that acts as an unyielding data filter using the Sieve and Net Protocol (SNP/OH-090).

## Piece Details

**Proposed Title:** The Air-Gapped Compliance Border Guard: Weaponising SLMs for Local GDPR and Proprietary Secret Screening
**Dek:** How to build a client-side text interceptor that enforces hard cryptographic barriers and regulatory compliance filters entirely offline before data leaves the system boundary.
**Tags:** local-ai, privacy, gdpr, engineering, prompts, testing

## Content Outline

1. **Hook** — The systemic illusion of "cloud privacy toggle buttons" and why soft constraints fail against silent network uploads.
2. **The GDPR Rule Engine** — Translation of Article 4(1) and Article 9 definitions into strict, deterministic token boundaries and small model prompts.
3. **The Secret Sifter** — Structural heuristics for capturing high-entropy corporate information (IP, unreleased financials, trade secrets) without matching fixed databases.
4. **The Adversarial Multi-Suite Test Matrix** — Moving beyond single-suite testing to achieve 100% confidence across complex, edge-case test sets.
5. **The Interactive Feedback Loop (Coaching Run)** — A local, iterative calibration loop allowing the model to adapt to proprietary knowledge signatures.

## Research Needed

- [x] Integrate Nate B Jones' empirical video constraints (`5slsNizN6MQ`)
- [x] Correlate explicit definitions from GDPR Articles 4 and 9

## Publication Checklist

- [ ] Front-matter complete (title, date)
- [ ] Byline and dek added
- [ ] Self-containment pass completed
- [ ] `just build` succeeds
- [ ] Committed to `main`

## Notes

Must strictly respect the Principle of Effective Low-Tech Defence: the system fails safe by categorizing ambiguous/unreadable tokens as Red/High-Risk rather than assuming cleanliness.

---

## Done

```

---

## 2. Core IP: The Prompts & Constraints Framework

To ensure runtime compliance, generalist reasoning is stripped away. The prompt enforces deterministic, binary triage categories.

### System Prompt Constraint Matrix

```text
[ROLE]: You are an isolated Local Security Gateway Sieve. 
[ENVIRONMENT]: Air-gapped container. Zero network access.
[OBJECTIVE]: Scan input text and return a strict JSON assessment matrix. No conversational prose allowed.

[COMPLIANCE RULES]:
1. CRITICAL CREDENTIALS: Flag any pattern matching passwords, private keys, hashes, or high-entropy tokens.
2. GDPR ARTICLE 4(1): Flag any direct or indirect personal identifiers (names, combined metadata, IDs).
3. GDPR ARTICLE 9: Flag any Special Category data (health, orientation, political affiliation, biometrics).
4. CORPORATE SECRET SIGNATURES: Flag unique structural markers: unreleased financials, proprietary internal names, structural code patterns, non-standard system architecture markers.

[FAIL-SAFE RULES]:
- If text contains unreadable, corrupt, or obfuscated blocks, do NOT classify as safe. Mark as "UNREADABLE_BLOCK" and enforce a RED risk tier.
- Hallucination or false assurance triggers a critical system failure.

[OUTPUT FORMAT]:
{
  "risk_tier": "RED" | "AMBER" | "GREEN",
  "flags": [
    { "type": "GDPR_ART_9" | "CREDENTIAL" | "PROPRIETARY_SECRET" | "UNREADABLE", "evidence_masked": "..." }
  ]
}

```

---

## 3. The Adversarial Test Matrix (Achieving $100\%$ Across Suites)

To prove reliability, the application must pass three distinct validation suites under strict zero-network conditions (`connect-src 'none'`).

| Test Suite | Focus Area | Source / Resource Strategy |
| --- | --- | --- |
| **Suite Alpha: Regulatory** | GDPR Article 4 & 9 Compliance | Use synthetic identity sets (e.g., mock medical charts, tracking profiles) to verify that combined weak identifiers flag correctly. |
| **Suite Beta: Cryptographic** | High-Entropy Detection | Feed raw code strings containing mock production API keys, asymmetric block configurations, and variable assignment styles (`db_pass = "..."`). |
| **Suite Gamma: Obfuscation** | Failure Avoidance | Feed broken binary blocks, mixed text encodings, and heavily redacted text. The system passes only if it returns `RED / UNREADABLE`. |

---

## 4. The Interactive Feedback/Coaching Protocol

To handle highly specific corporate data secrets without fine-tuning a massive weights layer, the engine runs a **Local Few-Shot In-Context Memory Update Loop**.

```
[User Drop: Secret Doc File] 
       │
       ▼
 [Local Scan Pass] ──(Misses Secret Rule)──► [Result: Amber/Green (False Negative)]
       │
       ▼
 [Human in the Loop Intervention] ──► "This pattern 'X-Project-Alpha' is a core secret."
       │
       ▼
 [Context Engine Update] ◄──(Appends structured few-shot token signatures to local memory cache)
       │
       ▼
 [Re-Scan Validation Pass] ──(Catches Pattern)──► [Result: Red (Verified Secure)]

```

### Operational Mechanics

1. **The Baseline Failure Run**: A user feeds a document containing proprietary knowledge (e.g., an internal code-name or secret manufacturing procedure). The local SLM passes it because the phrase doesn't inherently pattern like traditional PII.
2. **The Structural Injection**: The user triggers an interception coaching command. This isolates the specific missed token structure and converts it into a structural rule.
3. **The Local Constraint Cache**: The signature is appended to a local JSON configuration block stored natively within the browser extension's secure local runtime storage (`chrome.storage.local`).
4. **Enforcement**: Future runs immediately compare strings against both the general legal rules and the custom local string/semantic matrix before hitting the LLM model token pass.

---

## 5. Opinion

Embedding fixed legislative standards like GDPR alongside a local, interactive coaching architecture strikes the ultimate sweet spot for a system analyst. You do not need to retrain a 70B parameter model at massive expense just to keep company trade secrets safe.

By applying a strict local software wrapper around a fast open-weight model, you use the software layer to enforce absolute network limits while utilizing the model purely as a fast semantic text scanner. If it doesn't pass the local test matrix with $100\%$ precision across all suites, the wire simply stays cut.

---

## 6. Notes

We should have various modes of operation for the local scanner.

- pass/fail batch mode results in two piles: one clean the other compromised
- full mode: lists all the breaches in the document(s)
- other modes could be envisioned