  # ──────────────────────────────────────────────────────────────
   # Brief playbook – single‑brief workflow
   # ──────────────────────────────────────────────────────────────
   brief:
      # 1️⃣  Spawn the Implementer agent (if not already running)
      @td new "implementer‑the‑muppet-filter" -p P1 -l implementation \
        -d "Render blog‑posts/canon/the-muppet-filter-draft.md → _drafts/2026-06-13-the-muppet-filter.md" \
        --format json > /tmp/brief_impl_uid.txt

      IMP_UID=$(cat /tmp/brief_impl_uid.txt | tr -d '\n')
      @echo "Implementation task UID=$IMP_UID"

      # 2️⃣  When the Implementer finishes, fire a notification to the Reviewer
      @while ! td status $IMP_UID | grep -q Done; do sleep 2; done
      @echo "Implementer completed – notifying reviewer"

      # 3️⃣  Create the Reviewer task and depend on the implementation UID
      @td new "reviewer‑the‑muppet-filter" \
        -p P1 -l review \
        -d "Load rendered markdown and audit for footnote, closing line, Edinburgh tone." \
        --depends $IMP_UID > /tmp/brief_rev_uid.txt
      @REV_UID=$(cat /tmp/brief_rev_uid.txt | tr -d '\n')
      @echo "Reviewer task UID=$REV_UID"

      # 4️                                                                                                                                                        # 4️⃣  Hook the inter‑agent message (reviewer will automatically start when its UID is scheduled)
      @./scripts/notify.sh $IMP_UID ask '{"message":"Rendered markdown ready – please load and audit."}'

      # 5️                                                                                                                                                        # 5️⃣  Wait for reviewer to finish and then publish
      @while ! td status $REV_UID | grep -q Done; do sleep 2; done
      @echo "Reviewer completed – publishing"
      @td Done $REV_UID
      @td new "publish‑the‑muppet-filter" \
        -p P0 -l publish \
        -d "Run export script and push to Medium/Substack" \
        --depends $REV_UID
      @bun run scripts/export-all.ts

      # 6️⃣  Clean up temporary UID files
      @rm -f /tmp/brief_impl_uid.txt /tmp/brief_rev_uid.txt