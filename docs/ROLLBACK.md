# KAHA.VN — rollback nhanh (cutover)

Tài liệu ngắn theo master plan: DNS + container đủ để quay về WordPress nếu cần.

1. **DNS Cloudflare:** trỏ `@` và `www` về origin WordPress / Oracle (record cũ đã lưu trước cutover).
2. **TTL:** đã hạ 60s trước cutover — chờ propagate sau khi đổi record.
3. **Vultr (Next):** `docker compose stop` (hoặc tương đương) cho service KAHA trên port 3102 nếu muốn dừng app mới hoàn toàn.
4. **Oracle WordPress:** không xóa — chỉ bật lại nếu đã tắt; giữ 14 ngày sau cutover theo kế hoạch.
5. **Postgres `kaha_vn`:** rollback nội dung không bắt buộc cho traffic; chỉ khi cần dữ liệu sạch — dùng backup snapshot trước cutover (không đụng DB site khác).

Chi tiết đầy đủ: `docs/KAHA-VN-MASTER-PLAN.md` mục 7.
