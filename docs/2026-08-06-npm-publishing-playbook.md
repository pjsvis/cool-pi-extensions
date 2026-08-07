---
title: "The secure way to release an npm package in 2026—Martian Chronicles, Evil Martians’ team blog"
author: "Andrey Sitnik, Travis Turner"
site: "Evil Martians"
published: 2026-07-28
source: "https://evilmartians.com/chronicles/the-secure-way-to-release-an-npm-package"
domain: "evilmartians.com"
language: "en"
description: "How to protect your npm package from being stolen in a supply chain attack and improve its position in security ratings"
word_count: 4367
---

Here’s why you should care about how you release your npm package:

1. Supply chain attacks that steal npm packages are now a real threat, with new attacks every month. If the [TanStack](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem), [Axios](https://github.com/axios/axios/issues/10636), or [ESLint](https://eslint.org/blog/2018/07/postmortem-for-malicious-package-publishes/) teams were hacked, you can be hacked. These days, attackers steal packages automatically with LLMs, using previously stolen dependencies to reach the next ones.
2. Taking care of ecosystem security is also a marketing tool. The right publishing method gives you a nice green check icon on [npmjs.com](https://www.npmjs.com/package/nanoid) and a better security score. You can use this as an advantage over competitors.
3. In the future, when coding skill can be replaced by LLMs, safeguards and security will become new core responsibilities. That means it’s time to go deeper into security now.

At Evil Martians, we have [more than 100](https://evilmartians.com/opensource) open source projects. That creates a risk: somebody could use one open project to steal an npm token, then steal all the others. So for us, supply chain security has been an everyday practice since 2024.

[

![Book a call](https://imgproxy.evilmartians.com/2MTpStA0xGWkFdi0RdM1J3I4KzDhig-ROoEkdSH10mg/width:192/quality:80/format:avif/aHR0cHM6Ly9ldmlsbWFydGlhbnMuY29tL2ltYWdlcy9jb25zdWx0YXRpb24taXJhLndlYnA_dj1mM2JiYTI2Zg)

**Irina Nazarova** CEO at Evil Martians

Book a call

](https://cal.com/team/evilmartians/exploration)

## The extremely short version

Here are the essentials. See below for extra tricks that need more context beyond copy-paste instructions.

1. Open the `Settings` tab of your npm package on [npmjs.com](https://www.npmjs.com/).
	1. Create a **Trusted Publisher**: select GitHub, enter your repository organization and name, and set `publish.yaml` as the `Workflow filename`. Enable only `Allow npm stage publish`.
		2. Enable **… and disallow tokens** in **Publishing access**.
2. Enable **2FA** for everyone: on GitHub, go to organization settings → **Authentication security**.
3. Allow **only admins to create tags**: on GitHub, go to repository settings → Rules → Rulesets, press *New ruleset* → *New tag ruleset*. Put `Tags only by admins` in *Ruleset Name*; `Active` in *Enforcement status*; add `Repository admins` to the *Bypass list* and `Include all tags` to *Target tags*. Enable **Restrict creations** in *Tag rules*.
4. Pin third-party CI actions by SHA commit with [actions-up](https://github.com/azat-io/actions-up):
	```bash
	npx actions-up
	```
5. Add CI security linting with `.github/workflows/check-workflows.yaml`:
	```yaml
	name: Lint CI workflows
	on:
	  push:
	    branches: ["main"]
	  pull_request:
	    branches: ["**"]
	jobs:
	  zizmor:
	    runs-on: ubuntu-latest
	    permissions:
	      contents: read
	      actions: read
	    steps:
	    - name: Checkout the repository
	      uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
	      with:
	        persist-credentials: false
	    - name: Run zizmor
	      uses: zizmorcore/zizmor-action@6599ee8b7a49aef6a770f63d261d214911a7ce02 # v0.6.0
	      with:
	        advanced-security: false
	```
6. Set a 3-day cooldown before using new versions:
	```bash
	npm config set --location=project min-release-age 3
	# pnpm config set --location=project minimumReleaseAge 4320
	# yarn config set npmMinimalAgeGate 3d
	# printf '\n[install]\nminimumReleaseAge = 259200\n' >> bunfig.toml
	```
7. Migrate to npm 12, pnpm 10, yarn 4.14, or bun so that the `postinstall` scripts of your npm dependencies aren’t called during install.
8. Create `.github/workflows/publish.yaml`
```yaml
name: Release
on:
  push:
    tags:
      - 'v*'
jobs:

  test: # Standard tests to make sure we don't publish a broken package
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
    - name: Checkout the repository
      uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
      with:
        persist-credentials: false
    - name: Install Node.js
      uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
      with:
        node-version: 26
        cache: npm
    - name: Install dependencies
      run: npm ci --ignore-scripts
    - name: Run tests
      run: npm test

  build: # Build in a separate job to reduce risks
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
    - name: Checkout the repository
      uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
      with:
        persist-credentials: false
    - name: Install Node.js
      uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
      with:
        node-version: 26
        package-manager-cache: false # Slower, but without cache poisoning risk
    - name: Install dependencies
      run: npm ci --ignore-scripts
      # For monorepo put your build tools to production dependencies
      # run: npm ci --ignore-scripts --omit=dev
    - name: Build package
      run: npm run build
    - name: Upload build artifacts
      uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
      with:
        name: build-artifacts
        path: dist/
        retention-days: 1

  publish: # The critical job, without installing any dependencies
    runs-on: ubuntu-latest
    needs:
      - test
      - build
    permissions:
      contents: read
      id-token: write
    steps:
      - name: Checkout the repository
        uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
        with:
          persist-credentials: false
      - name: Download build artifacts
        uses: actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c # v8.0.1
        with:
          name: build-artifacts
          path: dist/
      - name: Install Node.js
        uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version: 26
          package-manager-cache: false
      - name: Publish npm package
        run: npm stage publish --ignore-scripts
```

*The most secure way is to avoid the build step entirely. See [the workflow](https://github.com/nanostores/nanostores/blob/main/.github/workflows/release.yml) without a build step. If you need build only for changesets, consider using [`pnpm version -r`](https://pnpm.io/versioning). [Monorepo example](https://github.com/ai/size-limit/blob/main/.github/workflows/release.yml).*

Then you can publish a new release by creating and pushing a tag:

```sh
# Bump version in package.json and write CHANGELOG.md.
git add .
git commit -m 'Release 1.0.1 version'
git tag v1.0.1
# \`git tag -s v1.0.1\` is better, but you need to add key for tag/commit signing
git push origin v1.0.1
```

Wait a few seconds for CI to run, open *Staged Packages* from the [npm](https://www.npmjs.com/) user menu, and click **Approve** new release.

You can use [drydock](https://drydock.org/) to check the npm package diff before approving the staged package.

![Staged Packages page with card of new Nano Stores release with Approve / Reject / Inspect buttons](https://imgproxy.evilmartians.com/nXOAxd-YZW46rxyTofp4_bot7lHOGW7I2kp-LdoQVPE/width:1162/quality:80/format:avif/aHR0cHM6Ly9ldmlsbWFydGlhbnMuY29tL3N0YXRpYy8wMWVmMDFmYjM4M2I1NGZmNjRmMDNmNWYwMjIwYTAxZi9zdGFnZWQtYXBwcm92ZS5wbmc)

Nano Stores release in Staged Packages

**Want your agent to apply all of this?** We’ve packaged the rules below into a skill.

## How your npm package can be stolen

In terms of security, it’s always important to protect yourself from [security theater](https://en.wikipedia.org/wiki/Security_theater). I recommend against adding tools just because “it’s safer.” That motivation makes processes slower and often creates a false sense of security without actually reducing risks.

Instead, I suggest thinking about real attacks (and potential attacks, if you enjoy this topic) and building a solution against those specific points.

Right now, the main risks for an npm package maintainer are as follows:

- You or an LLM run `npm install …` for some dependency needed by your current task. But, as it turns out, **this dependency was hacked** and contains malware. The malware now has full access to your laptop or CI. It steals your npm tokens, and the attacker’s LLM quickly injects malware into your package, releasing it to reach even more people. For instance, [OpenAI was compromised](https://openai.com/index/our-response-to-the-tanstack-npm-supply-chain-attack/) through a compromised TanStack package during the [Mini Shai-Hulud campaign](https://socket.dev/blog/tanstack-npm-packages-compromised-mini-shai-hulud-supply-chain-attack).
- A **third-party CI action was hacked**. The attacker injects malware and re-releases old tags like `v3`. On your next publish job, this action has full access to your CI and injects malware into your package before release. Read more about the [tj-actions/changed-files case](https://safeguard.sh/resources/blog/tj-actions-changed-files-compromise-march-2025).
- Your **CI pipeline was hacked** because of some mistake (like misusing `pull_request_target` or having a shell injection). Through cache poisoning, the attacker infects other CI workflows and, with access to the publish workflow, releases your package with malware. This is how [TanStack](https://snyk.io/blog/tanstack-npm-packages-compromised/) was hacked.
- A maintainer is invited to a **fake job interview**, then attackers use the high-stress situation to pressure them into installing **fake Zoom plugins** that steal every token from their machine. [Axios’s maintainer](https://github.com/axios/axios/issues/10636#issuecomment-4180237789) was hacked this way.

So, the main sources of risk during `npm publish` are:

1. Packages in `node_modules`.
2. Third-party actions in `.github/workflows`.
3. All the tools on your laptop.
4. Security issues in complex CI workflows.

## Security misconceptions

### Nobody will hack our small package.

These days, to be hacked, you don’t need an attacker who *specifically* wants to hack your package.

Modern npm package hacks happen *semi-automatically*. For instance, during the [Shai-Hulud v2](https://socket.dev/blog/shai-hulud-strikes-again-v2) campaign, more than **500 different packages were hacked in a single day**. It works like a worm: one package is used to hack the next, maximizing the number of companies it can reach.

With more advanced LLMs, we expect even more autonomous agents hacking whatever package they can reach.

### Everyone can be hacked! We can ignore this.

It’s true that there’s no 100% protection against a supply chain attack, or against any other way to steal your package. But real risk management is more nuanced:

> The cost of the attack should exceed the value of the information.

Of course, LLMs deflate the cost of a personal attack a lot. But your task still isn’t to reach impossible, perfect protection. It’s to **increase the price of an attack**.

### I’m not a security specialist, so this isn’t my concern, right?

There are advanced security topics for specialists, but *basic security* should be expected of every developer.

1. It’s simply impossible to have good security if every worker (except the security specialist) tries to work around the protections. A chain is only as strong as its weakest link. A company can have good security only if *every* worker helps.
2. The industry is changing very rapidly right now, and people expect more *fullstack* developers. Basic security is part of that expectation, at least until a package grows big enough to have dedicated specialists.
3. Since coding is shifting to LLMs, the human work of every developer is shifting toward security and safeguards.

## Breaking down each security step

### npm Provenance

**npm Provenance** mostly protects your *users*, not you. (That said, it also gives you a nice “check” badge on the [package’s npmjs.com page](https://www.npmjs.com/package/nanostores).) It solves cases where an npm package can’t easily be connected to its GitHub sources. The GitHub sources can look safe on review, while the npm package content is something very different.

![Big table with details that npm-provenance was generated by GitHub CI on project’s npmjs.com page](https://imgproxy.evilmartians.com/4_IkQayly4u_1YzP-KFzmsobZmcVnSd6fbUHnS80dFk/width:1566/quality:80/format:avif/aHR0cHM6Ly9ldmlsbWFydGlhbnMuY29tL3N0YXRpYy9jODE5MDU3ZGUxMzE1MzE3YmQwM2E3NTA2ZGY5MGVjOC9ucG0tcHJvdmVuYW5jZS1ib3R0b20ucG5n)

npm Provenance source block at the bottom of the Nano Stores page

With npm Provenance, the package is published from CI, and the CI provider (like GitHub itself) signs the package to confirm it was generated by this workflow on a specific commit.

Unfortunately, in practice, it [can’t 100% guarantee](https://appsecsanta.com/newsletter/2026-w20) that the npm package has no extra injections.

> Provenance guarantees the origin of an npm package. It answers *“did this come from the right pipeline.”* It **does not** answer *“was the pipeline honest”*, and it doesn’t tell you the package is safe.

But as we said above, we’re trying to reduce risks, not find a 100% perfect solution. At least we can show where the npm package came from. And *if CI wasn’t hacked*, we can assume the package is connected to its source code and workflow.

### Staged Publishing

Initially, I personally disliked npm Provenance, because a CI release is less secure than a manual release when I use a hardware 2FA key like a YubiKey and protect my laptop with a Dev Container.

CI can always be hacked and release an npm package while you’re sleeping.

But **Staged Publishing** brought us the best of both worlds: CI publishing with good DX and npm Provenance, *and* a manual check with a hardware 2FA token.

1. In the first step, CI releases the package using `npm stage publish` instead of `npm publish`.
2. In the second step, you manually approve the publish with your hardware 2FA token.
```
steps:
      …
      - name: Publish npm package
-       run: npm publish
+       run: npm stage publish
```

To approve the package, open *Staged Packages* from the [npm](https://www.npmjs.com/) user menu and click **Approve new release**. Or you can use `npm stage approve` CLI.

![Staged Packages page with card of new Nano Stores release with Approve / Reject / Inspect buttons](https://imgproxy.evilmartians.com/fR4ej7qrCLjOFGqB0upxeE2WUHPaeAoOYZAyH4KV4J0/width:1434/quality:80/format:avif/aHR0cHM6Ly9ldmlsbWFydGlhbnMuY29tL3N0YXRpYy85MDJjYTFjNjdjY2ExNmY5MTA1NzhlY2RkMDgwMjAzNC9zdGFnZWQtcHVibGlzaGluZy5wbmc)

Nano Stores release in Staged Packages

Unfortunately, npmjs.com doesn’t show the package diff in the *Staged Packages* UI, so you risk missing code that the build step injected.

We recommend creating an account at [drydock](https://drydock.org/) with a read-only npm token. It will email you about every new staged package and let you review the diff, then send you to npmjs.com to approve the package manually with your 2FA.

It’s a good idea to configure Trusted Publishing (see below) to allow *only* `npm stage publish`. That way, even if your CI is hacked, the attacker can’t release the npm package right now without your approval (though they can still quietly wait for your own release).

### Make your CI secure

If we move the release process to CI (to get the npm Provenance check mark, or for better DX in big teams), we need to take CI security seriously. Everyone who has access to CI or the workflow files can release anything to our npm package.

Many recent supply chain attacks started from a mistake in a popular CI workflow.

> This is why having a CI workflow linter is critical for npm package security.

I know 2 good CI linters, but both have a small issue:

- **[CodeQL](https://codeql.github.com/)** is a security linter for many languages, including GitHub workflows. It’s built into GitHub. Enable it in repository settings → *Advanced Security* → *Code scanning* → *CodeQL analysis*, press `Set up`, and select `Default`. The problem is DX: to check warnings, you have to manually open the *Security and quality* tab and go to the *Code scanning* page.
- **[zizmor](https://github.com/zizmorcore/zizmor)** is a linter only for GitHub Actions. It has more rules, but since it’s a Rust tool, it’s a little harder to install into an npm project. Still, you can use an action to lint workflows on CI.
```yaml
name: Lint CI workflows
on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["**"]
jobs:
  zizmor:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      actions: read
    steps:
      - name: Checkout the repository
        uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0 # v7.0.0
        with:
          persist-credentials: false
      - name: Run zizmor
        uses: zizmorcore/zizmor-action@6599ee8b7a49aef6a770f63d261d214911a7ce02 # v0.6.0
        with:
          advanced-security: false
```

But even if you fix all the security issues in your workflows, an **attacker can still hack you “ *in the past*.”** For instance, the Nx team fixed a `pull_request_target` issue in their CI but still had an old branch with the old workflow. [The attacker opened a PR against this old branch](https://nx.dev/blog/s1ngularity-postmortem) instead of the `main` branch, exploiting the old version of the workflow.

> Remove all old branches after fixing a security issue in your CI workflows.

**What are these long `@9c091bb2…` hashes** in our workflow examples? Why don’t we just use `@v7` tags?

We can’t just use those because someone can steal the CI actions you use (many open source maintainers are burned out, so it’s cheap to compromise their accounts). Tags like `@v7` aren’t immutable by default, and an attacker can update all previous tags, forcing you to use an infected third-party action on your next CI run.

This means it’s better to use a SHA commit hash like `@9c091bb2…` instead of a tag like `@v7`. It’s like a lockfile for CI.

There are 3 tools to manage these commit hashes: [Dependabot](https://docs.github.com/en/code-security/dependabot), [pinact](https://github.com/suzuki-shunsuke/pinact), and [actions-up](https://github.com/azat-io/actions-up). We recommend `actions-up`, because it has a [default cooldown](https://github.com/azat-io/actions-up#skipping-updates) and integrates more cleanly into an npm project.

```bash
npx actions-up
```

### Trusted Publishing

If you keep a secret like `NPM_TOKEN` on CI, that token can be stolen and used later. It’s a popular technique, used, for instance, during the Shai-Hulud supply chain attack campaigns.

> The best token is no token.

And there’s a solution for releasing from CI without any token: **Trusted Publishing**.

GitHub and other CI providers tell npm that `npm publish` is coming from a specific repository and workflow. So instead of using a token, you can tell npm to allow packages only from a specific workflow in your repository. You can find this option on the *package’s page on npmjs.com* → *Settings* tab.

![Package's settings on npmjs.com with the block of Trusted Publishing enabled](https://imgproxy.evilmartians.com/5yEnN-TdxyeJKNwyt-ZfNo-deUpdtxHPmZekvFMl8sY/width:2388/quality:80/format:avif/aHR0cHM6Ly9ldmlsbWFydGlhbnMuY29tL3N0YXRpYy85N2UzOGUwYWZmNjU3MDJiZTI5NjY3NjAwZGY0YjY3MS90cnVzdGVkLXB1Ymxpc2hpbmcucG5n)

Settings with Trusted Publishing enabled

We recommend allowing only `npm stage publish` and denying `npm publish`. This will make it so there’s a manual step with a 2FA token before releasing an npm package (see the [Staged Publishing](#staged-publishing) section above).

To send this signed package, your CI job needs the `id-token: write` permission:

```
publish:
  runs-on: ubuntu-latest
  needs:
    - test
    - build
  permissions:
    contents: read
+   id-token: write
  steps:
```

> Remember that **any** third-party action in this job, or any installed npm dependency, could also **release your npm package**. It’s important to use as few third-party actions as possible and to avoid installing npm packages in this job.

### Minimal dependencies in the publish job

Everything you install or use in a CI job with `id-token: write` can release the npm package instead of you.

Installed npm dependencies, third-party CI actions, the Docker image, *even a cache*: every third-party tool is a supply chain risk in this critical step.

**The best approach is to not use any build tool or third-party CI action at all** (see [our Nano ID workflow](https://github.com/ai/nanoid/blob/main/.github/workflows/release.yml)). It may sound radical, but think again. For instance, the [Svelte team moved](https://news.ycombinator.com/item?id=35892250) from `.ts` sources to `.js` files with TSDoc type comments, and they kept the same type checking.

If you are using `build` step only for `changeset` (`ChangeLog.md` generator) you can [replace it with pnpm](https://pnpm.io/versioning).

```bash
pnpm change # Generate .changeset/x.md
pnpm version -r # Bump version and generate ChangeLog.md changes
```

If you still need a build step, **separate the build and publish steps** into different jobs that pass artifacts between them (see [our Multiocular workflow](https://github.com/ai/multiocular/blob/main/.github/workflows/publish.yml) as an example). Give the `id-token` permission only to the `publish` job, so malware in the `build` step can’t publish the package. An attacker can still inject something into your build files, but that requires a more complex attack.

```yaml
build:
  permissions:
    contents: read
  steps:
  …
  - name: Install dependencies
    run: npm ci --ignore-scripts

  - name: Build packages
    run: npm run build

  - name: Upload build artifacts
    uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
    with:
      name: build-artifacts
      path: dist/
      retention-days: 1

publish:
  needs:
    - build
  permissions:
    contents: read
    id-token: write
  steps:
    …
    - name: Download build artifacts
      uses: actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c # v8.0.1
      with:
        name: build-artifacts
        path: dist/

    - name: Publish npm package
      run: npm stage publish --ignore-scripts
```

Another way to make the build step more secure is to install only a limited set of dependencies (install the TS compiler, but not linters and test tools). For instance, in a monorepo you can keep build tools in `dependencies` and test tools in `devDependencies` in the root `package.json`. Then you can use the `--omit=dev` argument to skip test tools:

```
- name: Install dependencies
-   run: npm ci --ignore-scripts
+   run: npm ci --omit=dev --ignore-scripts

  - name: Build packages
    run: npm run build
```

It’s also better to **avoid any caches in critical steps** like publishing or deploying. Through a cache, an attacker [can infect](https://snyk.io/blog/tanstack-npm-packages-compromised/) a CI workflow from another, less secure workflow.

```
- name: Install Node.js
    uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
    with:
      node-version: 26
+     package-manager-cache: false
```

It’s also better to move changelog or GitHub Releases generators into a separate step.

### GitHub protection rules

With CI publishing, everyone with write access to the GitHub repository can publish a new version. In our example, creating a tag starts the publish, and tag creation is enabled by default for everyone.

Staged Publishing helps a little, but it’s better to **set rules for who can create tags**.

Here’s how to create a ruleset that blocks everyone except repo admins from creating tags: GitHub repository settings → Rules → Rulesets, press *New ruleset* → *New tag ruleset*. Put `Tags only by admins` in *Ruleset Name*; `Active` in *Enforcement status*; add `Repository admins` to the *Bypass list* and `Include all tags` to *Target tags*. Enable **Restrict creations** in *Tag rules*.

We also recommend enabling [GitHub Immutable Releases](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases) at main GitHub repository’s settings.

### Dependency cooldown

Another way to hack your package is through another npm package that you use as a dependency.

Malware code from an npm package can execute:

1. In `postinstall` / `preinstall` /etc. scripts in that package’s `package.json`.
2. When you `import` the package in your app, your ESLint config, etc.
3. When you or an IDE extension call the package’s CLI.

Again, there’s no way to protect yourself from this 100%. But there are ways to reduce the risks:

- **Disable `postinstall`** and similar scripts. [npm 12](https://github.blog/changelog/2026-06-09-upcoming-breaking-changes-for-npm-v12/), [pnpm 10](https://github.com/pnpm/pnpm/releases/tag/v10.0.0), [yarn 4.14](https://github.com/yarnpkg/berry/releases#release-@yarnpkg/cli/4.14.0), and bun disable them by default, so update to the latest version.
- **Cooldown:** wait 1-3 days before using a new version. *The median takedown time was [14 hours](https://hextrap.com/blog/soak-time-defense-depth/), and a 3-day cooldown would have blocked about 94% of malicious packages.* [pnpm 11](https://pnpm.io/blog/releases/11.0) and [yarn 4.15](https://github.com/yarnpkg/berry/releases#release-@yarnpkg/cli/4.15.0) moved to a default 1-day cooldown. Now every package manager has cooldown options:
	```bash
	npm config set --location=project min-release-age 3
	pnpm config set --location=project minimumReleaseAge 4320
	yarn config set npmMinimalAgeGate 3d
	```
	For bun add to `bunfig.toml`:
	```toml
	[install]
	minimumReleaseAge = 259200
	```
- Add a **“firewall”** that scans dependency contents before using them. For instance, [Socket Firewall](https://socket.dev/blog/introducing-socket-firewall) or [SafeDep PMG](https://docs.safedep.io/package-security/pmg/quickstart). It’s a good defense against typosquatting, when you or an LLM makes a mistake in a package name.

## Extra steps

The steps above are quick wins that can be added in a day. The ones below take more planning, and the right solution depends on your case. We split them out so you could start with the quick ones above, but don’t skip these next ones either.

### Reducing dependencies

I know that changing habits is hard. But we have these huge supply chain attacks because of a culture that solves every problem by adding hundreds of dependencies. Thus, it’s important to minimize the attack surface by reducing the number of dependencies.

**Nested dependencies** (the dependencies of your dependencies) are often the biggest part of this. The good news: this can often be fixed quickly by moving to an alternative tool with fewer dependencies.

- The [e18e community](https://e18e.dev/) does a lot to make the JS ecosystem faster, smaller, and safer. They have a [manual list](https://e18e.dev/docs/replacements/), a [CLI tool](https://e18e.dev/docs/cli/), and a [CI action](https://github.com/e18e/action-dependency-diff) to help you find and replace dependencies that pull in a lot of nested dependencies.
	```bash
	npx @e18e/cli analyze
	```
- Check your dependencies with [npmgraph](https://npmgraph.js.org/) to see the number of nested dependencies, and use [npmx.dev](https://npmx.dev/package/fast-glob) to find alternatives.
- Small helpers that don’t need updates are better rewritten with an LLM and stored as local JS files in the project. **Many third-party CI actions can be rewritten as a short shell script by an LLM.**

Where to focus your effort, by priority:

1. Your direct `dependencies` and their nested dependencies. Your clients can be hacked not only by malware in your package, but by malware in any of your dependencies. Check your package on [npmgraph](https://npmgraph.js.org/) and start thinking about replacements for the bigger branches.
2. Then move to your `devDependencies`. Every nested dependency can be hacked and try to steal your CI tokens. Ask maintainers to move to the smallest alternatives or native modules in their direct dependencies. If you have a huge, powerful tool but use only a single feature, rewrite it with an LLM.
3. Then check third-party actions. Ask an LLM to rewrite the smallest ones.

### Dev Container

If you run your dev projects without any isolation, *any dependency or IDE extension* can read almost any file on your laptop. There are many ways to steal all the cookies from your browser, and with a GitHub cookie, an attacker can change files via the web UI.

A **Dev Container** reduces this risk a lot. It runs the shell, debugger, LLM, and most *IDE extensions* of your project inside a container, so they have very limited access to your system. **VS Code / Cursor, JetBrains IDEs, Zed, Emacs, and Neovim** all have very good Dev Container support.

> Ask your LLM to create a `.devcontainer/` folder based on your project’s unique needs.

If you use VS Code, we also recommend disabling the Docker socket for better security.

With a Dev Container, you get more than just better security:

1. Your LLM runs inside the container too, so it can’t break your system because of a hallucination.
2. You get an almost one-line onboarding process for new developers. No need to install databases and tools on the system manually; everything is set up for you.
3. Your whole team runs the project in the same environment.
4. The project can be started in web IDEs like GitHub Codespaces.

### Harden Runner

[Harden Runner](https://docs.stepsecurity.io/github-actions/harden-runner) is free for public GitHub repositories and has a few nice features to improve CI security. My favorite one is an allow-list of domains for network requests:

```yaml
- name: Harden the runner
  uses: step-security/harden-runner@bf7454d06d71f1098171f2acdf0cd4708d7b5920 # v2.20.0
  with:
    egress-policy: block
    allowed-endpoints: >
      registry.npmjs.org:443
      api.github.com:443
      github.com:443
      nodejs.org:443
```

Start with `egress-policy: audit`, collect the domains your CI normally calls, then move to `egress-policy: block`. It can prevent some malware from sending your tokens to their servers (though other malware creates a public GitHub repository instead of making a network request, which is harder to prevent).

### Review all your environments

This supply chain attack crisis isn’t because of npm or JS (pnpm has a lot of security features; many other package managers have fewer). Rather, the problem is developer culture:

> We started adding dependencies without thinking about risk management, only because “what everyone is doing should be safe.”

To stop this, we need to start managing the risk. And that applies not only to npm/JS, but to any environment:

- Docker base images (including Dev Container images and features).
- IDE extensions.
- Other package managers, like those used for backends or [Python for AI tools](https://snyk.io/blog/lightning-pypi-compromise-bun-based-credential-stealer/).
- Third-party CI actions.
- Skills for LLMs.
- And so on.

For each of your environments, think about these points:

- **How to reduce the number of dependencies or the attack surface.** Don’t grab an unknown thing from a viral social post. Try to use a minimal solution instead of a big “everything together” one.
- **How to isolate or limit access.** Wrap more things in a container, limit API access to only what’s necessary, and so on.
- **Do you have control over updates?** A lockfile, an update cooldown ([cooldowns.dev](https://cooldowns.dev/) has instructions for different environments).
- **How can you review them when adding or updating?** Define how to check the quality of a new tool (don’t use popularity or star count for that). Consider getting diffs for updates (like in our [Multiocular](https://github.com/ai/multiocular)). Maybe add a service with LLMs reviewing changes (just don’t treat it as the only option; there are ways [to blind LLMs](https://socket.dev/blog/mini-shai-hulud-miasma-and-hades-worms-target-bioinformatics-and-mcp-developers-via-malicious#LLM-Scanner-Anti-Analysis)).

For instance, IDE extensions are one of the least protected areas right now. There’s no cooldown, no lockfile, and no user-controlled update process. GitHub itself was hacked by a [poisoned VS Code extension](https://x.com/github/status/2056949168208552080).

Security and supply chain risks are very hot topics right now, for a reason. We’re starting to see a huge hack every month. There will be no silver bullet. We all need to start making the ecosystem more secure and to think more about security and risks *(especially because of the LLM revolution)*. The quickest steps from this article can be applied to your project in less than 24 hours. Make sure to set aside time for it on your next working day.

Finally, let’s note that at Evil Martians, we’ve spent years building the OSS that powers devtools behind the scenes: PostCSS, Lefthook, Nano Stores, plus dozens more. So, if you’re in need, contact us to make your devtools more secure!
