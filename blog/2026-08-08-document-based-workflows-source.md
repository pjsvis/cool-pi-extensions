
Sidebar menu
Search
Write
Notifications

pjstarifa
Home
Library
Profile
Stories
Stats
Following
Coding Nexus
Coding Nexus
Civil Learning
Civil Learning
Joe Njenga
Joe Njenga
Towards AI
Towards AI
Jaroslaw Wasowski
Jaroslaw Wasowski
Zack Liu
Zack Liu
Victor Savkin
Victor Savkin
Alvis Ng
Alvis Ng
Realworld AI Use Cases
Realworld AI Use Cases
Chris Dunlop
Chris Dunlop

More
The Leading Indicator

AI
AI Agent
LLM
Three Shifts Coming to AI in the Next 12 Months
Lucas McGregor
Lucas McGregor

Follow
7 min read
·
3 days ago
232


8

2





Press enter or click to view image in full size

My articles usually come out of testing and research, using data to explain what has already happened. Today I’m looking forward to where the data is leading.

Everyone loves to say how fast AI is changing, but most commentary mistakes noise for signal. The shifts below are tectonic: slow to surface, but moving everything sitting on top of them. Over a trillion dollars has been raised and spent to get us here. In the next twelve months, three core shifts will decide where that money actually pays off.

Shift One: The value isn’t the model. It’s the harness.
For two years, the industry has been obsessed with a single question: whose model is smartest? That was the wrong question. You don’t need a smarter model, you need a better system.

Prediction 1: The Rise of the Harness
Developers are developing loyalties to harnesses, not models (think vim vs. emacs).

LLMs process language. They are non-deterministic, probability-based prediction engines. The harness is the deterministic program that wraps your interactions with the model. It holds the application logic, eval loops, context, and security rails.

More advanced harnesses add safety features, use-case-specific logic, and even complex workflows. Developers are adopting coding-specific harnesses like Claude Code or OpenCode, where they can swap out the model based on taste and price but keep a consistently high-quality workflow. Task-specific harnesses are on the rise for building presentations, writing code, editing documents, and scraping data.

LLMs are like untrained employees: they don’t need to be exceptionally smart if they are guided through a well-designed process.

Prediction 2: Build Your Own Harness
We can stop pretending “prompt engineering” is a long-term discipline. Enterprise AI development is what software engineering has always been: translating processes into deterministic code.

Non-deterministic models let us scale up heuristics and handle the messy edge cases that are the real source of tech debt and complexity. An LLM that’s right 90% of the time on an edge case is amazing. To capitalize on that, enterprises will build custom harnesses tailored to their proprietary business logic, using frameworks like LangGraph, CrewAI, or AutoGen.

Anthropic’s and Google’s general harnesses are great for casual knowledge work, but for the next “industrial revolution” scale of change, enterprises will build enterprise harnesses. This is where the work is heading.

Prediction 3: The Massive Adoption of Document-Based Workflows
Single-task agents are quick and easy to roll out, but you climb the evolutionary ladder, in both power and complexity, with multi-agent workflows. Just like in real life, enterprises aren’t individual workers doing tasks in isolation; they’re teams, departments, and whole organizations, each doing individual tasks but all coordinating and contributing to multi-person processes.

Like humans, agents are at their best doing one task at a time. Each agent is a specialist, and you scale by chaining them together. There are plenty of complex frameworks to do this, just like there are plenty of task-management systems for people. But over and over again, companies settle on document-based workflows.

From wikis to network folders, most companies already run on a set of documents, folders, and forms. Each form is a human API feeding into a process. Each updated document is an event that moves some process to its next step.

Document-based processes are ubiquitous for a reason. They’re simple to implement and iterate on. They scale. They provide tracing and observability. They handle security and roles. They’re easy to integrate between teams, and even across organizations.

There are, and will continue to be, plenty of powerful agent-to-agent orchestration systems and workflow managers. But simple document-based workflows will be the workhorse. They let agents collaborate with their humans. They’re the fastest on-ramp to augmenting existing workflows, because most companies already have the infrastructure.

It’s what agents are built for. Agents are built for text, for documentation, for reading and filling out forms. All the things humans hate about documents, agents thrive on. Bringing agents into the grunt work of knowledge work is where we’ll see the real work happening.

Shift Two: So the model becomes a commodity.
Once value moves to the harness, the underlying model becomes an interchangeable engine component, and components get cheap.

Prediction 4: The Fall of the Cutting-Edge LLM Arms Race
The last couple of years have been driven by the frontier-model arms race, with each of the major providers releasing ever more powerful models — except where the US has blocked them.

Now that race is hitting economic reality. Trillions of dollars in subsidies are giving way to real API bills, and we’re already seeing prices lurch toward their true cost, along with a wave of schadenfreude stories about AI bills shocking CEOs and companies hiring humans back for cost control.

The more interesting thing we’re seeing is that while the models are getting better, the utility isn’t. Smaller, cheaper models deliver well enough on most tasks. As with the rest of the world, not every car has to be the top model and not every CPU has to be the fastest. The majority of the world runs on cheap parts, and the future will mostly run on cheap LLMs.

Prediction 5: The Triumph of the Open-Source LLM
Cheap parts you don’t control aren’t cheap for long. That’s the second half of the commodity story.

Cheap parts you don’t control aren’t cheap for long, not once vendor lock-in takes effect. That’s the second half of the commodity story.

Companies building custom harnesses gain a massive structural advantage: model independence. Hosted models are heavily subsidized, keeping token costs well below their true price. Providers are betting that the cost of running LLMs will fall fast enough to keep the market viable, with enough runway for everyone to migrate their workloads to hosted solutions. Inevitably, after lock-in, the price will go up. Many tasks we’d happily push to AI today will no longer be cost-effective on those platforms.

In keeping with the truth that tech only scales when it becomes a commodity, the real AI players will lean on open-source models for most of their day-to-day needs. You don’t need frontier models for mundane tasks. Big players like Netflix have already moved to their own LLM servers running open models, for more direct control over cost. In-house harnesses become the key: companies rely on them for deterministic guardrails — and one of those guardrails is cost control.

Shift Three: And the LLM is just one part of a plural, networked system.
If the model is a commodity part, then the real system is an assembly of parts — many kinds of AI, coordinating with each other, increasingly across organizational lines.

Prediction 6: The LLM Will Not Be a Silver Bullet
When relational databases came on the market, people used them for everything: message queues, file systems, you name it.

Generative AI is not a silver bullet. I’ve watched teams use them for prediction systems, recommenders, machine learning, knowledge systems, search engines, and data parsers. Like a general-purpose database, LLMs are enormously adaptable. The are also expensive and inefficient.

Generative AI is built on a wide range of existing AI techniques, from deep learning and machine learning to NLP and predictive models. Those foundational technologies still exist, and they still outperform a general LLM on many tasks.

As companies deploy their own harnesses, they’ll deploy multi-modal agents that use the full spectrum of AI. LLMs will handle the fast, flexible gluing of complex processes, but they’ll sit alongside other AIs, not replace them. The LLM will not be the silver bullet.

Prediction 7: Today’s Protocols Are Not the Destination
MCP is a dead protocol for the internet. I’m not sure the replacement will be A2A, but agents will run beyond the boundaries of their own organizations, and they’ll need to collaborate securely.

The history of the internet is a story of walking back from a naively open system and bolting on security, authentication, and observability as an afterthought. MCP continues that trend. Given the scale of the opportunity and the lessons already learned, internet-level agent-to-agent coordination will start from a protocol that has security and scale by design.

Where this leaves us
Put the three shifts together and the picture is clear. The value moves off the model and onto the harness. The model, no longer the prize, becomes a commodity you should run rather than rent. And what you build with it is not one all-powerful AI but a plural, networked system of specialists, modular intelligence, coordinated through the most boring, durable infrastructure we have: documents.

Every technology stack eventually commoditizes at the bottom and differentiates at the top. CPUs became commodities. Linux became a commodity. Cloud compute became a commodity. The business value moved into applications, workflows, and data. LLMs are following the same path.

None of this is the AI the hype promised. It’s better, because it’s the AI that actually ships. The teams that internalize these shifts, that invest in harnesses, cost-managing models, and put agents to work on the grunt work of real processes — these are the ones that win. The teams still waiting for the next frontier model to save them are the ones getting left waiting.

AI
AI Agent
LLM
232


8

2




The Leading Indicator
Published in The Leading Indicator
14 followers
·
Last published 3 days ago
Tech moves fast. Most of the noise is wrong. These are the signals that matter — written by an engineer with the experience to tell the difference between a leading indicator and a lagging excuse.


Follow
Lucas McGregor
Written by Lucas McGregor
164 followers
·
14 following
VP of Engineering at Trainline. I write about AI, power, politics, and occasionally haggis — without the algorithm deciding what matters. lucasmcgregor.com


Follow
Responses (8)
pjstarifa
pjstarifa
﻿

Cancel
Respond
Sebastian Buzdugan
Sebastian Buzdugan

2 days ago


the harness is not the moat either. orchestration code gets copied fast, and every vendor is rebuilding the same tool loop with different names. the real value sits in proprietary workflow data, evals, and the boring feedback systems that keep models useful after the demo ends
2


1 reply

Reply

Balthasar
Balthasar

1 day ago


Can't wait for codex 3.0
1

Reply

Micheal Bee
Micheal Bee

2 hours ago


It won't just be the harness. It will be a whole operating system with the LLM as the CPU. LLMOS.
Reply

See all responses
Help

Status

About

Careers

Press

Blog

Store

Privacy

Rules

Terms

Text to speech

