Your idea of dropping a plain `IDENT.md` (or a 5-line static header) into the repo root is the cleanest, lowest-entropy way to solve this. When the agent is initialized, the harness reads that text and injects it alongside the protocol.

It completely avoids vector databases and orchestrators while giving the agent a concrete boundary to anchor against.

Here is the amended [edinburgh-protocol](2026-08-15-edinburgh-protocol-1p2.md) bumped to **v1.2.0**, incorporating the **Surface Ident**, the **Justify Engine pre-flight**, and the **Diagnostic Abort (One-Turn Pivot)**.


### Operational Opinion on the `ident-text` Mechanic

The brilliance of grabbing an `ident-text` at initialization is that **it acts as a static constraint, not a dynamic discovery loop.**

1. **Keep `IDENT.md` tiny:** It shouldn't be an architectural thesis. Just 5–8 lines:
   ```markdown
   # IDENT
   - Repo: billing-engine
   - Domain: Invoicing, Payment Processing, Ledger Records
   - External Boundaries: Auth handled by `identity-service`, Orders handled by `order-router`

```

2. **Cost per call:** ~50 input tokens.
3. **Execution benefit:** When an operator accidentally types `update JWT expiration logic in auth_jwt.go`, the model reads `IDENT.md`, runs the Justify check, and spits out:
```text
[DIAGNOSTIC_ABORT]
- Requested: auth_jwt.go / JWT expiration
- Local Domain: billing-engine
- Reason: Target symbol not found in local boundary. Expected in 'identity-service'.

```



No multi-agent routing layer, no vector lookups, no conversational fluff—just a clean, one-turn stop.