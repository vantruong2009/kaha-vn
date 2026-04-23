import Link from "next/link";
import { SITE_NAV_LINK_CLASS } from "@/lib/site-nav-link-class";

type Props = {
  /** Footer hiển thị thêm Trang chủ */
  showHome?: boolean;
  /** Link RSS (chủ yếu footer) */
  showRss?: boolean;
};

export function SiteNavLinks({ showHome = false, showRss = false }: Props) {
  return (
    <>
      <Link href="/shop" className={SITE_NAV_LINK_CLASS}>
        Shop
      </Link>
      <Link href="/journal" className={SITE_NAV_LINK_CLASS}>
        Journal
      </Link>
      <Link href="/showroom" className={SITE_NAV_LINK_CLASS}>
        Showroom
      </Link>
      <Link href="/lookbook" className={SITE_NAV_LINK_CLASS}>
        Lookbook
      </Link>
      <Link href="/moodboard" className={SITE_NAV_LINK_CLASS}>
        Moodboard
      </Link>
      {showHome ? (
        <Link href="/" className={SITE_NAV_LINK_CLASS}>
          Trang chủ
        </Link>
      ) : null}
      {showRss ? (
        <Link href="/feed.xml" className={SITE_NAV_LINK_CLASS}>
          RSS
        </Link>
      ) : null}
    </>
  );
}
