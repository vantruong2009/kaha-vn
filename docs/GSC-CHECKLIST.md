# Google Search Console Checklist (KAHA.VN)

## 1) Xac minh property

- Mo Google Search Console va them property `https://kaha.vn`.
- Lay verification token dang `google-site-verification=...`.
- Dat token vao `.env.local`:
  - `NEXT_PUBLIC_GSC_VERIFICATION=<token>`
- Rebuild app:
  - `docker compose --env-file .env.local up -d --build`
- Kiem tra source trang chu co meta:
  - `<meta name="google-site-verification" ...>`

## 2) Submit sitemap

- Gui `https://kaha.vn/sitemap.xml` trong GSC.
- Xac nhan `https://kaha.vn/robots.txt` khai bao dung sitemap.

## 3) Kiem tra index co ban

- URL Inspection voi cac URL chinh:
  - `/`
  - `/shop`
  - `/journal`
  - `/showroom`
- Dam bao canonical URL tro ve domain `https://kaha.vn`.

## 4) Theo doi 7 ngay dau

- Bao cao Indexing: khong co loi 404 hang loat.
- Bao cao Page Experience/Core Web Vitals: khong co regression nghiêm trong.
- Neu co URL cu tu WordPress bi 404, bo sung vao `docs/redirects/redirects.json`.
