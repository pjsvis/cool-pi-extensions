#!/usr/bin/env python3
"""eval-digest — read interface for the append-only eval JSONL sources.

Ground truth: data/eval_log.json (one JSON object per line, per-test results)
+ data/eval_runs.jsonl (run metadata). This script never edits them.

The list → drill-down interface (no UI, no interface messing about):

    python3 scripts/eval-digest.py                    # per-model table
    python3 scripts/eval-digest.py --md               # markdown table
    python3 scripts/eval-digest.py <modelId>          # latest-run per-test breakdown
    python3 scripts/eval-digest.py run <runIdPrefix>  # full detail: grades, evidence, preview

Maintenance:

    python3 scripts/eval-digest.py --update docs/eval-canonical-record.md
        # rewrites the generated table between the BEGIN/END DIGEST markers

Env: DIGEST_FULL=1 shows full response text in run mode (default: 300-char preview).
Referenced by: docs/eval-canonical-record.md, justfile (`just results`)
"""
import json
import os
import sys
from collections import defaultdict
from datetime import datetime, timezone

LOG = "data/eval_log.json"
RUNS = "data/eval_runs.jsonl"
BEGIN = "<!-- BEGIN DIGEST -->"
END = "<!-- END DIGEST -->"
PREVIEW = 300


def load_entries():
    out = []
    with open(LOG) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                out.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return out


def load_runs():
    runs = {}
    try:
        with open(RUNS) as f:
            for line in f:
                line = line.strip()
                if line:
                    r = json.loads(line)
                    runs[r.get("runId")] = r
    except FileNotFoundError:
        pass
    return runs


def table(res, md=False):
    rows = sorted(res.items(), key=lambda kv: -kv[1]["last"])
    lines = []
    if md:
        lines.append("| Model | Results | Pass | Rate | Latest run | Last date (UTC) |")
        lines.append("|---|---|---|---|---|---|")
    for m, e in rows:
        rate = f"{100 * e['passed'] / e['tests']:.0f}%" if e["tests"] else "—"
        when = (
            datetime.fromtimestamp(e["last"] / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
            if e["last"]
            else "?"
        )
        rid = (e["lastRun"] or "?")[:8]
        if md:
            lines.append(f"| `{m}` | {e['tests']} | {e['passed']} | {rate} | `{rid}` | {when} |")
        else:
            lines.append(f"{m:45s} {e['tests']:>4}  {e['passed']:>4}  {rate:>4}  {rid}  {when}")
    if md:
        lines.append("")
        lines.append(f"*{len(res)} models, {sum(e['tests'] for e in res.values())} logged test results.*")
    return lines


def aggregate(entries):
    res = defaultdict(lambda: {"tests": 0, "passed": 0, "last": 0, "lastRun": None})
    for r in entries:
        m = r.get("modelId")
        if not m:
            continue
        e = res[m]
        e["tests"] += 1
        if r.get("passed"):
            e["passed"] += 1
        ts = r.get("timestamp") or 0
        if ts > e["last"]:
            e["last"] = ts
            e["lastRun"] = r.get("runId")
    return res


def fmt_ts(ms):
    return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).strftime("%Y-%m-%d %H:%M") if ms else "?"


def verdict_sym(b):
    return "✓" if b else "✗"


def model_breakdown(entries, model):
    rows = [r for r in entries if r.get("modelId") == model]
    if not rows:
        near = sorted({r.get("modelId") for r in entries if model.split("/")[-1].split(":")[0] in (r.get("modelId") or "")})
        print(f"no results for '{model}'", file=sys.stderr)
        if near:
            print("did you mean: " + ", ".join(near[:5]), file=sys.stderr)
        sys.exit(1)
    latest_ts = max(r.get("timestamp") or 0 for r in rows)
    run = next(r.get("runId") for r in rows if r.get("timestamp") == latest_ts)
    run_rows = [r for r in rows if r.get("runId") == run]
    passed = sum(1 for r in run_rows if r.get("passed"))
    print(f"{model} — latest run {run[:8]} ({fmt_ts(latest_ts)} UTC, suite {run_rows[0].get('evalSuiteVersion', '?')})")
    print()
    for r in sorted(run_rows, key=lambda r: r.get("testId", "")):
        name = r.get("testName") or ""
        traj = r.get("trajectory") or {}
        chars = traj.get("responseLength") or "?"
        ms = traj.get("turnDurationMs") or "?"
        print(f"  {verdict_sym(r.get('passed'))} {r.get('testId', '?'):24s} {name}  ({chars}c, {ms}ms)")
    print()
    print(f"{passed}/{len(run_rows)} passed")
    print(f"drill down: python3 scripts/eval-digest.py run {run[:8]}")


def clip(s, n):
    s = (s or "").replace("\n", " ⏎ ")
    return s if len(s) <= n else s[: n - 1] + "…"


def run_detail(entries, runs, prefix):
    rows = [r for r in entries if (r.get("runId") or "").startswith(prefix)]
    if not rows:
        print(f"no run matches '{prefix}'", file=sys.stderr)
        sys.exit(1)
    meta = runs.get(rows[0].get("runId"), {})
    print(f"run {rows[0].get('runId')}")
    if meta:
        print(f"  started {fmt_ts(meta.get('timestamp'))} UTC · fixture {meta.get('fixture', '?')} · "
              f"{meta.get('passedTests', '?')}/{meta.get('totalTests', '?')} passed · {meta.get('durationMs', '?')}ms")
    print()
    full = os.environ.get("DIGEST_FULL") == "1"
    for r in sorted(rows, key=lambda r: r.get("testId", "")):
        g = r.get("geminiGrade") or {}
        traj = r.get("trajectory") or {}
        print(f"── {r.get('testId', '?')} · {r.get('testName', '?')} ──")
        print(f"  verdict: {'PASS' if r.get('passed') else 'FAIL'} · grading {r.get('gradingStatus', '?')} "
              f"({r.get('gradingModel', '?')}) · trait: {r.get('traitTested', '?')}")
        if g:
            if g.get("confidence") is not None:
                print(f"  grader confidence: {g.get('confidence')}")
            dims = [k for k in g if isinstance(g[k], dict) and "pass" in g[k]]
            if dims:
                syms = " ".join(f"{k}={verdict_sym(g[k]['pass'])}" for k in sorted(dims))
                print(f"  dimensions: {syms}")
                for k in sorted(dims):
                    ev = g[k].get("evidence")
                    if ev and not g[k]["pass"]:
                        print(f"  evidence ({k}): \"{clip(ev, 400)}\"")
        resp = r.get("responseText") or ""
        if resp:
            body = resp if full else clip(resp, PREVIEW)
            print(f"  response ({len(resp)}c{' , FULL' if full else ', preview'}): {body}")
        print()


def update_file(path, lines):
    with open(path) as f:
        doc = f.read()
    if BEGIN not in doc or END not in doc:
        print(f"markers missing in {path} — insert {BEGIN} / {END} around the generated table", file=sys.stderr)
        sys.exit(1)
    head, rest = doc.split(BEGIN, 1)
    _, tail = rest.split(END, 1)
    with open(path, "w") as f:
        f.write(head + BEGIN + "\n" + "\n".join(lines) + "\n" + END + tail)
    print(f"updated {path}")


def main():
    argv = sys.argv[1:]
    entries = load_entries()
    if "--update" in argv:
        i = argv.index("--update")
        path = argv[i + 1] if len(argv) > i + 1 else "docs/eval-canonical-record.md"
        update_file(path, table(aggregate(entries), md=True))
        return
    md = "--md" in argv
    args = [a for a in argv if a != "--md"]
    if not args:
        print("\n".join(table(aggregate(entries), md=md)))
    elif args[0] == "run":
        if len(args) < 2:
            print("usage: eval-digest.py run <runIdPrefix>", file=sys.stderr)
            sys.exit(1)
        run_detail(entries, load_runs(), args[1])
    else:
        model_breakdown(entries, args[0])


if __name__ == "__main__":
    main()
