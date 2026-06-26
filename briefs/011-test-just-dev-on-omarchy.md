# Brief: 011 — Test just dev on Omarchy

**Created:** 2026-06-12
**TD:** td-72048c
**Status:** pending

## What

Test the full `just dev` provisioning flow on Omarchy. Verify that all dependencies (bun, just, glow, rtk, skate, pi, herdr, Fresh) are correctly installed and working. Test the pi configuration sync. Test model provisioning.

## Why

Omarchy was set up from scratch. We need to verify:
1. The `just install-deps` script works correctly
2. The `just dev` script sets up everything (symlinks, extensions, config)
3. The pi config (settings.json, models.json, auth.json) synced correctly
4. Models are available and pi can list them
5. The coordination system (msgs/, claims) is functioning

## Test steps

### 1. Provision check
```bash
cd ~/cool-pi-extensions
just install-deps
```
Verify all required tools are found.

### 2. Dev setup
```bash
just dev
```
Verify symlinks created, extensions linked, config populated.

### 3. Pi config
```bash
pi --list-models
```
Verify models from synced models.json are available.

### 4. Skate secrets
```bash
source ~/.skate_env
echo $openai_api_key
```
Verify skate secrets loaded.

### 5. Coordination test
```bash
just msgs-mode multi
just msgs-inbox
just msgs-claim BRIEF=011
just msgs-report BRIEF=011 --status test --summary "Omarchy testing in progress"
git push
```

### 6. Cleanup
After successful test:
```bash
just msgs-report BRIEF=011 --status complete --summary "All tests passed. just dev works on Omarchy."
git push
```

## Success criteria

- `just install-deps` shows all required tools
- `just dev` completes without errors
- `pi --list-models` shows models
- Skate secrets accessible via `source ~/.skate_env`
- Coordination messages sent and received

## Notes

- SSH key trust established with Mac (authorized_keys updated)
- Omarchy has Fresh installed (cargo build)
- Rust and Go installed
- Flox deprecated — using just install-deps instead