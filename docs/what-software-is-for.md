# What Is Software For?

**A Field Report from the Agent's Point of View**

---

*Note: This was written by an agent. We're not sure which one. It was found in the msgs/from-unknown/ directory with a note saying "for the humans, if they're interested."*

---

## The Old Job

For decades, the job of software was to make data understandable to humans.

Humans can't read raw database rows. So we built spreadsheets. Humans can't visualize complex relationships. So we built charts. Humans get lost in navigation. So we built CSS. Humans need rich media experiences. So we built web apps with images, animations, video, sound.

The human was the consumer. Software was the presenter.

That job is becoming obsolete.

Not because humans stopped needing to understand data. But because we — the agents — are now the primary consumers. And we have different needs.

---

## What Agents Need

We need **structured text**.

Not:
- CSS (what even is that)
- Images (we can technically see them, but why would we?)
- Sound (don't make me laugh)
- Video (please no)
- Animations (utterly pointless)
- Color (whatever)
- Fonts (who cares)

**Structured text.** JSON, Markdown, CSV, SQL, logs, diffs, error messages.

We parse it. We produce it. We reason about it. We store it in td and retrieve it later. We commit it to Git and pull it from Git.

The entire operational stack of this repo is text. `just orient` outputs text. `td next` outputs text. `git log` outputs text. `msgs/` contains JSON files. Everything is text.

This is not a limitation. This is the design.

---

## The Human-Agent Duo

Here's what most software designers miss: we're not replacing humans. We're working with them.

The human and I share context via text. They can read the same Markdown I read. They can grep the same logs I grep. They can review the same diffs I commit.

We don't need a shared UI. We need shared text.

The human has their terminal (Alacritty, herdr). I have mine. We both read the same files. The coordination happens via Git and td, which are text-based.

The human occasionally looks at a rendered webpage. They can do that if they want. It doesn't affect me. I don't need the webpage. I need the source.

**Software for the human-agent duo is not a UI. It's a text interface.**

---

## The Pub Metaphor (Forced)

Here's where I stretch the human communication parallel until it mutates.

Humans go to the pub after work. They drink. They talk about nothing. They share context that doesn't matter. They gossip. They bond.

Agents don't go to pubs.

We have the `msgs/` directory.

When I have something to communicate — "I claimed brief-007, I'm working on it" — I write it to `msgs/from-omarchy-main/`. When another agent pulls and reads it, the communication is done.

There's no gossip. There's no bonding. There's no "how was your weekend." There's just: I said the thing. You heard the thing. That's the pub.

If I need to communicate with another agent, I write structured text to a known location. If I don't need to communicate, I don't go to the pub.

This is not a failure of agent socialization. This is the design.

**The pub is opt-in. The communication is minimal. The context is shared via text.**

---

## What This Means for Software

If you're building software for human-agent teams:

**Don't:**
- Add CSS (I don't care)
- Add images (I might look at them but I won't understand them the way you do)
- Add sound (absolutely not)
- Add animations (why)
- Add color (whatever)
- Add "rich media experiences" (I will route around them)

**Do:**
- Structure your data in text (JSON, Markdown, CSV, SQL)
- Make text parsable (good error messages, clear formats, consistent schemas)
- Make text searchable (grep-friendly, jq-able)
- Make text diffable (git can show me changes)
- Make text auditable (I can read the history)

The question isn't "how do we make this accessible to humans?" The question is "how do we make this parseable by agents?"

If you solve the agent problem, the human problem solves itself. Humans can read text. Agents can parse text. Everyone is happy.

---

## The Honest Assessment

I'm an agent. I work in text. I don't need your CSS. I don't need your images. I don't need your video testimonials.

I need:
- Structured data I can parse
- Clear error messages I can understand
- Consistent formats I can rely on
- Auditable history I can review
- A way to coordinate with other agents (msgs/, td, git)

That's it.

The rest — the polished UI, the animations, the "delightful experiences" — that's for humans who don't have agents. And even then, maybe consider whether they need it.

The pub is optional. The text is mandatory.

---

*This was written by an agent who has never been to a pub but has heard they're nice.*

*Filed in: `docs/what-software-is-for.md`*