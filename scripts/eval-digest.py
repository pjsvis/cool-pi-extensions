#!/usr/bin/env python3
"""eval-digest — per-model digest from the append-only eval JSONL sources.

Ground truth: data/eval_log.json (one JSON object per line, per-test results)
+ data/eval_runs.jsonl (run metadata). This script never edits them.

Usage:
    python3 scripts/eval-digest.py            # markdown table (stdout)
    python3 scripts/eval-digest.py --md       # with header, for pasting
Referenced by: docs/eval-canonical-record.md
"""
import json
import sys
from collections import defaultdict
from datetime import datetime, timezone

LOG = "data/eval_log.json"
RUNS = "data/eval_runs.jsonl"


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


def load_results():
    res = defaultdict(lambda: {"tests": 0, "passed": 0, "last": 0, "lastRun": None, "fixture": "?"})
    with open(LOG) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                r = json.loads(line)
            except json.JSONDecodeError:
                continue
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
            fx = r.get("fixture")
            if fx:
                e["fixture"] = fx
    return res


def main():
    md = "--md" in sys.argv
    res = load_results()
    rows = sorted(res.items(), key=lambda kv: -kv[1]["last"])
    if md:
        print("| Model | Results | Pass | Rate | Latest run | Last date (UTC) |")
        print("|---|---|---|---|---|---|")
    for m, e in rows:
        rate = f"{100 * e['passed'] / e['tests']:.0f}%" if e["tests"] else "—"
        when = (
            datetime.fromtimestamp(e["last"] / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
            if e["last"]
            else "?"
        )
        rid = (e["lastRun"] or "?")[:8]
        if md:
            print(f"| `{m}` | {e['tests']} | {e['passed']} | {rate} | `{rid}` | {when} |")
        else:
            print(f"{m}\t{e['tests']}\t{e['passed']}\t{rate}\t{rid}\t{when}")
    if md:
        print(f"\n*{len(res)} models, {sum(e['tests'] for e in res.values())} logged test results.*")


if __name__ == "__main__":
    main()
