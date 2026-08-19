# Playbook 015 — Probe Before You Patch

> **Probe before you patch.** The obvious fault is usually the wrong fault. Evidence is cheaper than a rollback.

## When

A provider / config / model "doesn't work" and you already have a theory about why. That theory is the thing to distrust.

## The move

Resist the theory. Prod the system and make it answer *before* you change a byte.

## Procedure

1. **Orient.** Name every place the suspect touches — config file, code path,
   runtime, key store. You can't debug what you haven't located.

2. **List the hypotheses.** Write them down, obvious one included. The obvious
   one is the trap; writing it disarms it.

3. **Probe.** Send the smallest possible *real* request through the *real* path. Read the actual return code and body — not your model of them.
   ```bash
   KEY=$(skate get <provider>_api_key)        # into a var, never echoed
   curl -sS -m 40 -o /tmp/body -w "%{http_code}" "$URL" \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d "$PAYLOAD"
   ```
   Vary one thing at a time: the endpoint, the auth scheme, the field name.

4. **Hume's Razor.** Don't assert what you haven't observed. A **200 that does
   nothing is not success** — check the body, not just the code. A 429 is data,
   not noise. An empty `content` with `finish_reason:"length"` is a bug wearing
   a success code.

5. **Patch the proven fault.** Only the one the probes named. Record what you
   *disproved* — the dead leads are the artefact's most valuable half. They stop
   the next person retracing them.

## Anti-pattern

`hypothesis → edit → "still broken?" → edit again.`

This is guessing with a commit history. It feels like progress because the hands are moving. It isn't. Every unprobed edit adds a new variable to a system you already didn't understand.

## Worked example — z.ai (2026-08-04)

- **Suspicion:** baseUrl is wrong. (It's been wrong before; there's a literal
  "zai baseUrl fix" commit in the log. The story writes itself.)

- **Probe:** pinged both endpoints live with the real key.

- **Result:** coding → **200**, general → **429 "insufficient balance."** The
  baseUrl was *correct* for this key. The obvious story was false.

- **What the probes actually named:** a **silent** reasoning-control mismatch —
  z.ai ignores `reasoning_effort`, speaks `thinking.type`; every "successful"
  call at low effort was a 200 that did nothing. Invisible until the transport
  was proven good.

- **Counterfactual:** patching the baseUrl to the general endpoint (the "obvious
  fix") would have converted a working 200 into a 429. The probe saved a
  regression.

## The line

> The one move that mattered was refusing to assume the baseUrl was broken. Everything true fell out of that refusal; everything false would have sent us editing a correct line into a fault.

---
*Operationalised from the z.ai debugging session (brief `2026-08-04-brief-zai-provider-config-gaps.md`, td-b2041b). Edinburgh Protocol — Hume's Razor applied to infra.*
