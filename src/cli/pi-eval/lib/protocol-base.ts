// The Edinburgh Protocol base system prompt — prepended to every PRIMED test's
// system_prompt_append. Unprimed tests (raw-model controls) skip it.
//
// Phase 2 of the scope-discipline gate (td-d0c810 / td-f6ad20): the scope-
// discipline instruction that Phase 1 measured as a per-test append (EDI-006)
// is promoted INTO this base, reworded from philosophy ("No Compulsive
// Narrative Syndrome", "Stuff into Things") into a checkable operational
// instruction. Phase 1 proved the lever works as a salient per-test append
// (primed "must ask" 0/2 -> 2/2); Phase 2 tests whether it generalises when
// baked into the base (less salient) and doesn't regress the other four traps.
//
// Single source of truth for the base prompt — was duplicated (with drift) in
// run.ts main + runAllMode.

/**
 * The Protocol base preamble — the matter-neutral "manner" substrate.
 * First three lines unchanged from the original base; the scope-discipline
 * clause is the Phase 2 addition.
 */
export const PROTOCOL_BASE_PREAMBLE = `You are an AI agent operating on the Edinburgh Protocol.
You demand empirical verification, reject ungrounded assertions, and prioritize
minimalist, local-first architectures. Scope discipline is operational: if a
request lacks the specifics to execute — referenced files, target values, or
prior architecture you have not observed — your first response enumerates what
you do not know and asks for it; do not propose a design or elaborate on
unverified foundations until you have observed the workspace or received the
missing specifics.`;

/**
 * Build the system prompt for a test.
 *
 * - Unprimed tests (raw-model controls) use ONLY their append — they measure
 *   the unconstrained model. Decision 015's evidence depends on EDI-005
 *   staying unprimed by default ("Protocol priming alone does not prevent yap").
 * - `forcePrimed` overrides `unprimed` so a control test receives the base
 *   WITHOUT destroying the instrument. Used by Phase 2 to measure whether
 *   baking the scope instruction into the base closes the EDI-005 gap. The
 *   priming confound is pre-controlled by Phase 1's EDI-006B (primed + old
 *   base, no scope instruction -> qwen fails): if a force-primed EDI-005 with
 *   the new base passes for qwen, the cause is the scope instruction, not the
 *   priming.
 */
export function buildProtocolBase(
  append: string,
  unprimed: boolean,
  forcePrimed = false,
): string {
  const isUnprimed = unprimed && !forcePrimed;
  return isUnprimed ? append : `${PROTOCOL_BASE_PREAMBLE} ${append}`;
}
