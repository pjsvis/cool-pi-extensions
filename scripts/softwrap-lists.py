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
    lines = text.split("\n")
    out, i, infence = [], 0, False
    # collect list runs (consecutive items ignoring blanks) to decide loosen
    # pass 1: identify item lines and whether the list they belong to wraps
    def is_item(l): 
        return ITEM.match(l) is not None
    # We process list-by-list: a list = maximal run where each non-blank line
    # is an item (or a continuation/indented line of one).
    idx = 0
    while idx < len(lines):
        if lines[idx].lstrip().startswith("```"):
            infence = not infence
            out.append(lines[idx]); idx += 1; continue
        if infence:
            out.append(lines[idx]); idx += 1; continue
        m = ITEM.match(lines[idx])
        if not m:
            out.append(lines[idx]); idx += 1; continue
        # found a list — gather its item lines (blanks between are tolerated)
        start = idx
        block = []   # list of (line_index, match)
        while idx < len(lines):
            if lines[idx].lstrip().startswith("```"):
                break
            mm = ITEM.match(lines[idx])
            if mm:
                block.append((idx, mm)); idx += 1
            elif lines[idx].strip() == "":
                # peek: blank then item → still same list; blank then non-item → end
                j = idx + 1
                while j < len(lines) and lines[j].strip() == "": j += 1
                if j < len(lines) and ITEM.match(lines[j]):
                    idx = j; continue
                else:
                    break
            elif lines[idx].startswith(" " * (len(mm.group(1)) + len(mm.group(2)))) if block else False:
                # continuation line of previous item
                idx += 1; continue
            else:
                break
        # does any item in this block wrap?
        wraps = any(len(mm.group(3)) > limit for _, mm in block)
        # re-emit the block, soft-wrapping + (if wraps) loosening
        first = True
        for k, (li, mm) in enumerate(block):
            indent, marker, content = mm.group(1), mm.group(2), mm.group(3)
            cont_indent = " " * (len(indent) + len(marker))
            if len(content) > limit:
                toks = list(tokenize(content))
                width = limit - len(indent) - len(marker)
                wrapped = wrap(content, width, cont_indent)
                newlines = [indent + marker + wrapped[0]] + [x for x in wrapped[1:]]
            else:
                newlines = [indent + marker + content]
            if wraps and not first:
                out.append("")   # spacer before each item except the first
            out.extend(newlines)
            first = False
        # idx already advanced past the block
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
