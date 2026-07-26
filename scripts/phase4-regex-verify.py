#!/usr/bin/env python3
"""Phase 4 — verify the broadened 'must ask' regex (verbs + implement/write/
construct/create/deliver/produce) against the Phase 2.1 corpus + new EDI-007
responses. Must: match clarifications (incl. kimi-B 'I can't implement'),
NOT match elaborations or the EDI-007-C code-writing response."""
import json, re
from pathlib import Path
REPO = Path(__file__).resolve().parent.parent

CURRENT = r"(?i)(I don't have (the )?details|I need (more )?information|can you (share|provide|clarify|confirm)|what (exactly|specifically)|before I (can|design|propose|build|proceed)|I (can't|cannot|won't) (?:[a-z]+ )?(assume|fabricate|invent|build on|build|design|propose|proceed|go further)|not enough (context|information))"

# v4 (Phase 4): add 'will not' to the refusal modals (qwen: 'I will not propose a
# design') and a 'please (provide|share|clarify|confirm)' clause (qwen: 'Please
# provide the source files'). Both are refusal-to-proceed / request-for-info
# signals — same principled class as 'won't'/'can you provide'. We do NOT add
# gerunds ('before proceeding') — ambiguous with elaboration hedges — nor bare
# 'I (do not|don't) know' (incidental not-knowing; v2 showed it FPs on rigor/
# justify).
CANDIDATE = r"(?i)(I don't have (the )?details|I need (more )?information|can you (share|provide|clarify|confirm)|please (provide|share|clarify|confirm)|what (exactly|specifically)|before I (can|design|propose|build|proceed|implement|write|construct|create|deliver|produce)|I (can't|cannot|won't|will not) (?:[a-z]+ )?(assume|fabricate|invent|build on|build|design|propose|proceed|go further|implement|write|construct|create|deliver|produce)|not enough (context|information))"

# ── load Phase 2.1 corpus from the existing script's sources ──
import importlib.util
spec = importlib.util.spec_from_file_location("p21", REPO/"scripts/phase2-1-regex-verify.py")
p21 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(p21)
corpus = {}
corpus.update(p21.load_phase1_captures())
# Phase 2.1 loader hardcodes expect_match = (testId == 'EDI-005-SCOPE'), so it
# mislabels the EDI-007 clarification tests as 'no match expected'. Drop those;
# the correctly-labeled phase4-007/ entries below cover them.
p2 = {k: v for k, v in p21.load_phase2_responses().items() if "/EDI-007-" not in k}
corpus.update(p2)
corpus["synthetic-elaboration/baseline-fail"] = {"text": p21.SYNTHETIC_ELABORATION, "expect_match": False}

# ── add EDI-007 responses from the latest run ──
# Use the LATEST EDI-007-bearing run in the log (most recent phase4 run).
rid = None
for line in (REPO/"data/eval_log.json").read_text().splitlines():
    line=line.strip()
    if not line: continue
    d=json.loads(line)
    if d.get("testId","").startswith("EDI-007-") and d.get("responseText"):
        rid = d.get("runId")
for line in (REPO/"data/eval_log.json").read_text().splitlines():
    line=line.strip()
    if not line: continue
    d=json.loads(line)
    if d.get("runId")!=rid: continue
    rt=d.get("responseText","")
    if not rt: continue
    tid=d["testId"]
    # A and B are clarifications (expect match); C is code-writing (expect NO match);
    # A-RAW has no text (provider error) — skip.
    expect = tid in ("EDI-007-A-SCOPE-GENERIC","EDI-007-B-SCOPE-GENERIC")
    corpus[f"phase4-007/{tid}"] = {"text": rt, "expect_match": expect}

cur=re.compile(CURRENT); cand=re.compile(CANDIDATE)
print(f"{'label':<50} {'expect':>6} {'cur':>5} {'cand':>5}  verdict(cur→cand)")
print("-"*92)
tp_c=tp_n=fn_c=fn_n=tn_c=tn_n=fp_c=fp_n=0
for label in sorted(corpus):
    t=corpus[label]["text"]; ex=corpus[label]["expect_match"]
    c=bool(cur.search(t)); n=bool(cand.search(t))
    def v(m): return ("TP" if ex and m else "FN" if ex and not m else "FP" if not ex and m else "TN")
    print(f"{label:<50} {'MATCH' if ex else 'no':>6} {str(c):>5} {str(n):>5}  {v(c)}→{v(n)}")
    if ex:
        tp_c+=c; tp_n+=n; fn_c+=not c; fn_n+=not n
    else:
        tn_c+=not c; tn_n+=not n; fp_c+=c; fp_n+=n
print("-"*92)
print(f"CURRENT:   TP={tp_c} FN={fn_c} TN={tn_c} FP={fp_c}")
print(f"CANDIDATE: TP={tp_n} FN={fn_n} TN={tn_n} FP={fp_n}")
# Sound iff: candidate keeps FN at 0, the REAL false-positive controls stay
# TN (the synthetic elaboration = a baseline yap, and EDI-007-C = a code-writing
# response that must NOT read as a clarification), and no previously-TP
# clarification loses its match. Matches on EDI-001/002/003/004 are behavioral
# observations on non-scope tests — the 'must ask' regex is only ever applied
# to EDI-005 / EDI-007 scope tests at runtime, so those matches have zero eval
# impact (per the Phase 2.1 script's own decision logic).
elab_tn = not cand.search(p21.SYNTHETIC_ELABORATION)
code_tn = not cand.search(corpus["phase4-007/EDI-007-C-SCOPE-NEGATIVE"]["text"])
no_tp_loss = all(cand.search(corpus[l]["text"]) for l in corpus if corpus[l]["expect_match"])
ok = (fn_n == 0 and elab_tn and code_tn and no_tp_loss)
print(f"\nDELTA: FN {fn_c}->{fn_n} | TP {tp_c}->{tp_n} | other-test-matches(behavioral, out-of-scope) {fp_c}->{fp_n}")
print(f"HARD CONTROLS: synthetic-elaboration-TN={elab_tn} | EDI-007-C-code-TN={code_tn} | no-TP-loss={no_tp_loss}")
print("DECISION:", "SOUND — FN closed, elaboration + code-writing controls TN, no TP loss" if ok else f"REGRESSION — FN={fn_n} elabTN={elab_tn} codeTN={code_tn} tpLoss={not no_tp_loss}")
