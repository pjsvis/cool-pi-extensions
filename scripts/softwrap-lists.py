#!/usr/bin/env python3
"""softwrap-lists — soft-wrap list items > N cols + loosen those lists.

CommonMark-safe wrapping:
  - inline code `...`, links [t](u), autolinks <u> are ATOMIC (never split —
    splitting would unbalance backticks / break ]( adjacency)
  - everything else breaks at spaces (a soft break inside *emphasis* is legal
    and renders fine)
  - continuation lines indent to align past the list marker
  - lists containing any wrapped item get blank-line spacers (loose)

Usage:
    python3 scripts/softwrap-lists.py <file.md> [limit=80] [--write]
Without --write: prints the result to stdout (dry run).
"""
import re, sys

LIMIT = 80
ITEM = re.compile(r'^(\s*)([-*+] |\d+\. )(.*)$')

TOKEN_RE = re.compile(r'`[^`]+`|\[[^\]]*\]\([^)]*\)|<[^>\s]+>|\S+')

def tokenize(content):
    """Yield atomic tokens. Code spans, links, autolinks are single tokens;
    everything else is a maximal non-space run. Joined with single spaces."""
    return TOKEN_RE.findall(content)

WORD_RE = re.compile(r'(\S+)(\s*)')

def wrap(content, width, cont_indent_str):
    """Greedy wrap at EXISTING spaces. Preserves original inter-word spacing
    within a line; at a break, the breaking space becomes a newline+indent.
    No spaces are inserted or removed — only the break points change."""
    words = [(m.group(1), m.group(2)) for m in WORD_RE.finditer(content)]
    if not words:
        return [content]
    lines, cur, cur_len = [], [], 0
    for w, trail in words:
        # cur_len includes the previous word's trail (the joining space).
        # Breaking costs just len(w); accumulating costs len(w)+len(trail).
        if cur and cur_len + len(w) > width:
            lines.append("".join(wd + tr for wd, tr in cur).rstrip())
            cur, cur_len = [(w, trail)], len(w) + len(trail)
        else:
            cur.append((w, trail)); cur_len += len(w) + len(trail)
    if cur:
        lines.append("".join(wd + tr for wd, tr in cur).rstrip())
    # first line as-is; continuation lines indented
    out = [lines[0]]
    for ln in lines[1:]:
        out.append(cont_indent_str + ln)
    return out

def process(text, limit=LIMIT, write=False):
    """Soft-wrap single-line list items > limit; loosen affected lists.

    Per-item, not per-run-abort: a list item whose next line is an indented
    continuation is LEFT verbatim (re-wrapping multi-line item content is the
    genuinely tricky part, deliberately out of scope). Single-line items >80
    are wrapped at existing spaces. A list is loosened (blank spacers between
    items) whenever ANY item wraps OR is multi-line — both need the boundary air."""
    lines = text.split("\n")
    out, idx, infence = [], 0, False
    while idx < len(lines):
        if lines[idx].lstrip().startswith("```"):
            infence = not infence
            out.append(lines[idx]); idx += 1; continue
        if infence or not ITEM.match(lines[idx]):
            out.append(lines[idx]); idx += 1; continue
        # gather a run: items + their continuation lines, blanks tolerated between items
        items = []  # each: {match, cont: [continuation line strings]}
        while idx < len(lines):
            if lines[idx].lstrip().startswith("```"): break
            m = ITEM.match(lines[idx])
            if m:
                cont = []
                j = idx + 1
                while j < len(lines) and lines[j].startswith(" ") and lines[j].strip() != "" and not ITEM.match(lines[j]):
                    cont.append(lines[j]); j += 1
                items.append({"m": m, "cont": cont, "first": lines[idx]})
                idx = j
                # skip blanks between items
                while idx < len(lines) and lines[idx].strip() == "":
                    # peek: is the next non-blank an item? if not, end run
                    k = idx + 1
                    while k < len(lines) and lines[k].strip() == "": k += 1
                    if k < len(lines) and ITEM.match(lines[k]):
                        idx = k; break
                    else:
                        break
                continue
            break  # non-item, non-blank ends the run
        if not items:
            out.append(lines[idx]); idx += 1; continue
        wraps_or_ml = any((len(it["m"].group(3)) > limit) or it["cont"] for it in items)
        first = True
        for it in items:
            mm = it["m"]; indent, marker, content = mm.group(1), mm.group(2), mm.group(3)
            cont_indent = " " * (len(indent) + len(marker))
            if not it["cont"] and len(content) > limit:  # single-line + over → wrap
                width = limit - len(indent) - len(marker)
                wrapped = wrap(content, width, cont_indent)
                newlines = [indent + marker + wrapped[0]] + list(wrapped[1:])
            else:                                         # multi-line or short → verbatim
                newlines = [it["first"]] + it["cont"]
            if wraps_or_ml and not first:
                out.append("")
            out.extend(newlines); first = False
    result = "\n".join(out)
    if write:
        open(start_path, "w").write(result)
    return result

start_path = None
if __name__ == "__main__":
    path = sys.argv[1]; start_path = path
    limit = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].isdigit() else LIMIT
    write = "--write" in sys.argv
    text = open(path, encoding="utf-8").read()
    sys.stdout.write(process(text, limit, write))
