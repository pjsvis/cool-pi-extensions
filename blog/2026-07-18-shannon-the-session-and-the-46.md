---
title: Shannon, the Session, and the $46
dek: The agent's context window is a noisy channel. Every turn re-transmits the entire history. The cost grows quadratically because the channel is filling with its own noise. The handoff is the source code. The newup is the channel reset. Shannon knew this in 1948.
date: 2026-07-18
---

# Shannon, the Session, and the $46

## The model is a channel

In 1948, Claude Shannon gave us the architecture for every communication system
that has ever existed. The diagram is five boxes and a noise source:

```
Information Source → Transmitter → [ Channel + Noise ] → Receiver → Destination
```

The source has a message. The transmitter encodes it. The channel carries it,
badly — noise is added. The receiver decodes what survives. The destination
gets the message, or a corrupted version of it. Everything since 1948 — TCP,
QR codes, Wi-Fi, 5G, satellite links — is engineering on top of this diagram.

An agent session is the same diagram, and the mapping is not metaphorical. It
is structural:

| Shannon | The agent session |
|---|---|
| Information source | The work — the task, the repo state, the goal |
| Transmitter | The handoff — the compressed encoding of state |
| Channel | The context window (finite capacity, in tokens) |
| Noise source | The accumulated transcript — stale outputs, discarded attempts |
| Receiver | The model's attention mechanism, decoding the context |
| Destination | The next action — the code, the edit, the answer |

The fit is exact. The context window is a finite-capacity channel. The
transcript is the signal-plus-noise flowing through it. The model is the
decoder. And the $46 is what happens when nobody manages the channel.

## The noise is self-generated

In Shannon's original model, the noise source is external — thermal noise in
the wire, interference in the air. The transmitter does not produce it. The
channel does not produce it. It comes from the environment.

The agent session breaks this assumption. **The agent is its own noise source.**
Every turn it transmits, it adds to the noise that will be re-transmitted next
turn. Turn 1 produces output. Turn 2 re-sends turn 1's output plus its own.
Turn 3 re-sends turns 1 and 2 plus its own. The noise is not arriving from
outside the system — it is generated inside the channel and then re-transmitted
on every subsequent use.

This is the *O(n²)* cost, reframed. The channel content grows linearly per
turn, but the total transmitted across *n* turns grows quadratically — because
every turn re-sends everything that came before. And what is being re-sent is
not signal. The signal — the actual work state — was established in the first
few turns. What accumulates is noise: resolved questions, abandoned paragraphs,
stale tool outputs, discarded hypotheses. The channel is filling with its own
exhaust.

## Channel capacity and the information rate

Shannon's central result is the **channel capacity theorem**: a channel of
bandwidth *W* and signal-to-noise ratio *S/N* can carry at most:

> *C = W log₂(1 + S/N)* bits per second.

No encoding scheme, however clever, can push more information through the
channel than *C*. Above *C*, errors are guaranteed. Below *C*, they can be
made arbitrarily small.

The agent's context window has a hard capacity — the token limit. That's the
bandwidth *W*. The signal-to-noise ratio *S/N* is where the session goes wrong.
Early in the session, the channel is mostly signal: the task, the repo state,
the plan. The SNR is high. The information rate is high. The model decodes
cleanly.

As the session runs, noise accumulates. The signal — the actual work state —
doesn't grow much. You're still working on the same task. But the noise grows
with every turn. The SNR drops. The information rate drops — *log₂(1 + S/N)*
shrinks as *N* grows. The channel is still full (you're still sending max
tokens per turn), but the fraction of those tokens that is *signal* trends
toward zero.

This is the experience of being in a long session that has gone bad: the model
is "slow," it "forgot" things, it's "going in circles." It's none of those.
The channel is full. The SNR is low. The decoder is drowning in noise. The
information rate has collapsed. You're paying full price per turn for a channel
that's carrying almost no signal.

## The handoff is the source code

Shannon's **source coding theorem** says you can compress a signal to its
entropy rate — its actual information content — but no further without losing
information. The raw transcript is an uncompressed source. It contains the
signal (the work state) plus enormous redundancy (every intermediate step,
every wrong turn, every resolved question). The handoff is the source coding
pass: it compresses the transcript to its entropy rate, keeping only the
information that cannot be reconstructed — ground truth, rejected hypotheses,
remaining debt.

```
Raw transcript (high redundancy, signal + noise)
        │
        ▼  td handoff  (source coding)
Compressed state (entropy rate, signal only)
        │
        ▼  /clear      (channel reset)
Fresh channel (full capacity, clean SNR)
        │
        ▼  td context   (decode)
Fresh session resumes with pure signal
```

The handoff is the only thing that crosses the channel reset. Everything else
is dropped. This is not lossy in the way that matters — the source coding
theorem guarantees the handoff contains all the *information*. What it drops
is redundancy and noise. The raw transcript is high-entropy in the colloquial
sense (disordered, noisy). The handoff is low-entropy in that sense — but in
Shannon's sense, it contains the same *information rate* as the signal portion
of the raw transcript. It's compressed, not impoverished.

## The locus tags are the synchronisation preamble

In digital communications, the receiver needs to synchronise with the
transmitter before it can decode the payload. A known preamble — a fixed bit
pattern the receiver expects — lets the receiver lock onto the frame
boundaries before attempting to decode the data.

The locus tags (`[LOC: file]` / `[WAYPOINT: milestone]`) serve this function.
They are the synchronisation preamble in the handoff. When the fresh session
reads `td context`, it doesn't have to re-derive which files matter or where
the milestones are. The locus tags tell it the frame boundaries. The decoder
locks on immediately. The channel is clean, the preamble is known, and the
payload decodes without ambiguity.

Without the locus tags, the handoff would be a compressed payload without a
preamble — the fresh session would have to search the repo to reconstruct the
spatial context the prior session already had. That's re-derivation cost —
cheap, but unnecessary. The tags eliminate it.

## The intractable task is an SNR problem

The $46 lesson is about cost. The intractable-task lesson — the one that's
easy to miss — is about **decode fidelity**.

A task that won't yield produces a particular kind of noise: discarded
attempts. Every hypothesis the model tried and rejected is still in the
context. Every wrong path is still there. These are not random noise — they
are *correlated* noise. They are the specific approaches the model already
tried, and they weight the attention mechanism toward those same approaches.
The decoder is biased toward the failures.

In Shannon's framework, this is the worst-case noise: not white noise (random,
uncorrelated, easy to average out) but coloured noise (correlated with the
signal, hard to separate). The model can't forget what it already tried
because the discarded attempts are still in the channel, exerting pull. The
SNR isn't just low — the noise is structured to interfere with the signal.

A fresh session solves this by resetting the channel. The handoff records the
rejected hypotheses — but as *metadata*, not as live context. The fresh model
reads "Approach X was tried and failed because Y" in the handoff, and that
reading is a single information event, not a persistent gravitational pull. The
correlated noise is gone. The channel is clean. The decoder approaches the
problem from a direction that isn't anchored to the failures.

This is why a fresh context solves problems a stale one can't. It's not that
the model is smarter. It's that the decoder is operating on a clean channel
with a known preamble and no correlated noise. Shannon would have recognised
the move. He'd have said: you're resetting the channel and re-transmitting the
source-coded signal. That's the textbook solution.

## The argument, compressed (for the second time)

- The context window is a finite-capacity channel. Shannon's capacity theorem
  applies.
- The agent is its own noise source. Every turn re-transmits accumulated noise.
  Cost is *O(n²)*. SNR degrades with session length.
- The handoff is source coding — compress the signal to its entropy rate. Drop
  the redundancy and noise.
- The newup is the channel reset. Full capacity restored. Clean SNR.
- The locus tags are the synchronisation preamble. The fresh decoder locks on
  immediately.
- The intractable task is correlated noise — discarded attempts bias the
  decoder toward the failures. Reset the channel. Re-transmit the coded
  signal. Decode cleanly.

The $46 is what it costs to learn that the channel is not self-cleaning.
Shannon published the fix in 1948. We just had to recognise that the agent
session is a channel, and the session boundary is the reset.

---

*Part of the [Edinburgh Protocol](https://github.com/pjsvis/cool-pi-extensions)
series. The practical discipline is in
[Token Minimisation](2026-07-18-token-minimisation.md). The structural
predecessor is
[How We Compressed Claude into a 4-Bit Vector](2026-07-12-task-based-granularity.md).
Shannon published the rest in 1948.*
