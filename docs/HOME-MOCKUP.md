# Trang mockup homepage (`/home-mockup`)

## Nếu chỉ thấy chữ “MIGRATION” + `/home-mockup`

Trình phục vụ Next **không** chứa route `src/app/home-mockup/page.tsx` (bản cũ trước commit `40d870b`). Request rơi vào `[...slug]` → placeholder migration.

**Chạy trên đúng máy đang mở `http://localhost:3102`** (repo `kaha-vn`):

```bash
cd /home/opc/cursor-workspace/projects/kaha-vn
git pull origin main
git log -1 --oneline   # kỳ vọng: feat(ui): home-mockup … hoặc mới hơn
```

- **`npm run dev`:** dừng process cũ (Ctrl+C), chạy lại `npm run dev`.
- **Docker:** `docker compose --env-file .env.local up -d --build` (cần quyền `docker`).

Sau đó mở lại: `http://127.0.0.1:3102/home-mockup`

## Link trong header (tùy chọn)

Trong `.env.local`:

```bash
NEXT_PUBLIC_SHOW_HOME_MOCKUP_LINK=1
```

Rồi **restart** dev/build — menu thêm mục **Mockup** → `/home-mockup`. Tắt flag trước production nếu không muốn hiện.
