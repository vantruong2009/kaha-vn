#!/usr/bin/env bash
# Dùng Node 20+ khi SSH không có Cursor trên PATH (tránh /usr/bin/node v16).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NODE20=""
if [[ -n "${KAHA_NODE20:-}" && -x "${KAHA_NODE20}" ]]; then
  NODE20="${KAHA_NODE20}"
else
  for n in /home/opc/.cursor-server/bin/linux-arm64/*/node; do
    if [[ -x "$n" ]] &&
      "$n" -e 'process.exit(Number(process.version.slice(1).split(".")[0]) >= 20 ? 0 : 1)' 2>/dev/null; then
      NODE20="$n"
      break
    fi
  done
fi

node20_ok() {
  [[ -x "${1}" ]] || return 1
  "${1}" -e 'process.exit(Number(process.version.slice(1).split(".")[0]) >= 20 ? 0 : 1)' 2>/dev/null
}

if [[ -z "${NODE20}" ]]; then
  for n in /usr/local/bin/node /opt/nodejs/bin/node; do
    if node20_ok "$n"; then NODE20="$n"; break; fi
  done
fi

if [[ -z "${NODE20}" && -d "${HOME}/.nvm/versions/node" ]]; then
  shopt -s nullglob
  for d in "${HOME}/.nvm/versions/node"/v{20,21,22,23,24}.*; do
    n="${d}/bin/node"
    if node20_ok "$n"; then NODE20="$n"; break; fi
  done
  shopt -u nullglob
fi

if [[ -z "${NODE20}" ]] && command -v node >/dev/null 2>&1; then
  n="$(command -v node)"
  if node20_ok "$n"; then NODE20="$n"; fi
fi

if [[ -z "${NODE20}" ]]; then
  echo "kaha-vn: Không tìm thấy Node >= 20." >&2
  echo "  Gợi ý: export KAHA_NODE20=/đường/dẫn/tới/node20" >&2
  echo "  Hoặc cài Node 20 (dnf module, fnm, nvm) và đặt trước PATH." >&2
  exit 1
fi

# Cho script kiểu: bash with-node20.sh node scripts/foo.mjs
if [[ "${1:-}" == "node" ]]; then
  shift
  exec "$NODE20" "$@"
fi

exec "$NODE20" "$@"
