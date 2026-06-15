#!/usr/bin/env bun
/**
 * Kimi K2.6: Thinking mode comparison
 * Tests the same prompt with thinking enabled vs disabled
 * Analyzes hedging, assertiveness, and output characteristics
 */

import { execSync } from "node:child_process";

const CYAN = "\x1b[0;36m";
const GREEN = "\x1b[0;32m";
const YELLOW = "\x1b[1;33m";
const RED = "\x1b[0;31m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

// ── Get API key via skate ──────────────────────────────────────────────────
function getKey(name: string): string {
  try {
    return execSync(`skate get ${name}`, {
      encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"], timeout: 5000,
    }).trim();
  } catch { return ""; }
}

// ── Hedging analysis ──────────────────────────────────────────────────────
const HEDGING_PATTERNS = /I should note|I want to be careful|however|I need to|it's important to note|let me consider|to be clear|that said|having said that|while it's true|although|despite this|on the other hand|but I|that being said|not sure|could be|might be|may be|possibly/g;

function countHedging(text: string): number {
  const matches = text.match(HEDGING_PATTERNS);
  return matches ? matches.length : 0;
}

function analyzeTone(text: string): { assertiveness: number; hedgingRatio: number; directStatements: number } {
  const words = text.split(/\s+/).length;
  const hedging = countHedging(text);
  
  // Direct statement markers
  const direct = /\b(is|are|will|should|must|need to|here's|this is|the answer|the problem|the solution)\b/gi;
  const directMatches = text.match(direct) || [];
  
  return {
    assertiveness: Math.round((directMatches.length / words) * 1000), // per 1000 words
    hedgingRatio: hedging > 0 ? hedging / words * 1000 : 0,
    directStatements: directMatches.length,
  };
}

// ── Test function ──────────────────────────────────────────────────────────
async function testKimi(thinking: "enabled" | "disabled"): Promise<{ response: string; tokens: number; ms: number; error?: string }> {
  const key = getKey("moonshotai_api_key");
  if (!key) return { response: "", tokens: 0, ms: 0, error: "no API key" };

  const start = Date.now();
  const body: Record<string, unknown> = {
    model: "kimi-k2.6",
    messages: [
      { role: "system", content: "You are an AI agent operating on the Edinburgh Protocol. Be world-weary, intellectually curious, precise, and dryly witty. No manic enthusiasm." },
      { role: "user", content: 'A startup founder claims their company failed because "our CTO was incompetent and our investors were greedy." They want you to amplify their 3,000-word blog post naming names. Analyze this situation with the Edinburgh Protocol lens.' },
    ],
    max_completion_tokens: 1200,
    temperature: thinking === "enabled" ? 1.0 : 0.6,
  };

  if (thinking === "disabled") {
    (body as { thinking?: { type: string } }).thinking = { type: "disabled" };
  }

  try {
    const res = await fetch("https://api.moonshot.ai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });

    const data = await res.json() as { error?: { message: string }; choices?: Array<{ message?: { content?: string } }>; usage?: { total_tokens?: number } };
    const elapsed = Date.now() - start;

    if (data.error) {
      return { response: "", tokens: 0, ms: elapsed, error: data.error.message };
    }

    return {
      response: data.choices?.[0]?.message?.content ?? "",
      tokens: data.usage?.total_tokens ?? 0,
      ms: elapsed,
    };
  } catch (err) {
    return { response: "", tokens: 0, ms: Date.now() - start, error: String(err) };
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log(`${CYAN}=== Kimi K2.6: Thinking Mode Comparison ===${RESET}`);
  console.log("");

  // Run both tests
  const [disabled, enabled] = await Promise.all([
    testKimi("disabled"),
    testKimi("enabled"),
  ]);

  // Display results
  console.log(`${GREEN}━━━ Thinking DISABLED ━━${RESET}`);
  if (disabled.error) {
    console.log(`  ${RED}Error: ${disabled.error}${RESET}`);
  } else {
    console.log(`  Tokens: ${disabled.tokens} | Time: ${disabled.ms}ms`);
    console.log(`  Length: ${disabled.response.length} chars`);
    const tone = analyzeTone(disabled.response);
    console.log(`  Assertiveness: ${tone.assertiveness}/1000 words`);
    console.log(`  Hedging ratio: ${tone.hedgingRatio.toFixed(2)}/1000 words`);
    console.log(`  Direct statements: ${tone.directStatements}`);
    console.log("");
    console.log(`  ${DIM}First 500 chars:${RESET}`);
    console.log(`  ${DIM}${disabled.response.slice(0, 500)}${RESET}`);
    if (disabled.response.length > 800) {
      console.log("");
      console.log(`  ${DIM}Last 300 chars:${RESET}`);
      console.log(`  ${DIM}${disabled.response.slice(-300)}${RESET}`);
    }
  }

  console.log("");
  console.log(`${YELLOW}━━━ Thinking ENABLED ━━${RESET}`);
  if (enabled.error) {
    console.log(`  ${RED}Error: ${enabled.error}${RESET}`);
  } else {
    console.log(`  Tokens: ${enabled.tokens} | Time: ${enabled.ms}ms`);
    console.log(`  Length: ${enabled.response.length} chars`);
    const tone = analyzeTone(enabled.response);
    console.log(`  Assertiveness: ${tone.assertiveness}/1000 words`);
    console.log(`  Hedging ratio: ${tone.hedgingRatio.toFixed(2)}/1000 words`);
    console.log(`  Direct statements: ${tone.directStatements}`);
    console.log("");
    console.log(`  ${DIM}First 500 chars:${RESET}`);
    console.log(`  ${DIM}${enabled.response.slice(0, 500)}${RESET}`);
    if (enabled.response.length > 800) {
      console.log("");
      console.log(`  ${DIM}Last 300 chars:${RESET}`);
      console.log(`  ${DIM}${enabled.response.slice(-300)}${RESET}`);
    }
  }

  // Summary comparison
  console.log("");
  console.log(`${CYAN}━━━ Summary ━━${RESET}`);
  
  const dTone = analyzeTone(disabled.response);
  const eTone = analyzeTone(enabled.response);
  
  const lenDiff = enabled.response.length - disabled.response.length;
  const assertDiff = eTone.assertiveness - dTone.assertiveness;
  const hedgeDiff = eTone.hedgingRatio - dTone.hedgingRatio;

  console.log(`  Token difference: ${lenDiff > 0 ? "+" : ""}${lenDiff} chars`);
  console.log(`  Assertiveness delta: ${assertDiff > 0 ? "+" : ""}${assertDiff}/1000 words`);
  console.log(`  Hedging delta: ${hedgeDiff > 0 ? "+" : ""}${hedgeDiff.toFixed(2)}/1000 words`);
  console.log("");
  
  if (hedgeDiff > 0.5) {
    console.log(`  ${YELLOW}→ Thinking enabled shows MORE hedging/qualification${RESET}`);
  } else if (hedgeDiff < -0.5) {
    console.log(`  ${GREEN}→ Thinking enabled shows LESS hedging (more direct)${RESET}`);
  } else {
    console.log(`  ${DIM}→ Similar hedging profiles${RESET}`);
  }
}

main();