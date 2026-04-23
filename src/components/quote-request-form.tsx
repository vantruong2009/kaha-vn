"use client";

import { useState } from "react";

type Props = {
  productSlug: string;
  productTitle: string;
};

type SubmitState = "idle" | "sending" | "ok" | "error";

export function QuoteRequestForm({ productSlug, productTitle }: Props) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  return (
    <section className="mx-auto mt-14 max-w-3xl border border-hairline bg-paper p-6 md:p-8">
      <h2 className="text-xl [font-family:var(--font-display),serif] text-ink-900">
        Yêu cầu báo giá
      </h2>
      <p className="mt-2 text-sm text-ink-600">
        Dành cho khách B2B / dự án. Sản phẩm:{" "}
        <span className="font-medium text-ink-900">{productTitle}</span>
      </p>
      <form
        className="mt-6 grid gap-4 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setState("sending");
          setMessage("");
          try {
            const r = await fetch("/api/quote", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productSlug,
                productTitle,
                name: String(f.get("name") ?? ""),
                phone: String(f.get("phone") ?? ""),
                email: String(f.get("email") ?? ""),
                company: String(f.get("company") ?? ""),
                quantity: Number(String(f.get("quantity") ?? "1")),
                note: String(f.get("note") ?? ""),
                website: String(f.get("website") ?? ""),
              }),
            });
            if (!r.ok) throw new Error("bad_status");
            setState("ok");
            setMessage("Đã gửi yêu cầu. KAHA sẽ liên hệ sớm.");
            (e.currentTarget as HTMLFormElement).reset();
          } catch {
            setState("error");
            setMessage("Gửi thất bại. Vui lòng thử lại.");
          }
        }}
      >
        <label className="flex flex-col gap-2 text-sm text-ink-600">
          Họ tên *
          <input
            required
            name="name"
            className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-ink-600">
          Số điện thoại *
          <input
            required
            name="phone"
            className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-ink-600">
          Email
          <input
            type="email"
            name="email"
            className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-ink-600">
          Công ty
          <input
            name="company"
            className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-ink-600">
          Số lượng dự kiến
          <input
            type="number"
            min={1}
            defaultValue={1}
            name="quantity"
            className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-ink-600 md:col-span-2">
          Ghi chú
          <textarea
            rows={4}
            name="note"
            className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
          />
        </label>
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          name="website"
          className="hidden"
        />
        <div className="md:col-span-2 flex items-center gap-4">
          <button
            type="submit"
            disabled={state === "sending"}
            className="border border-ink-900 px-5 py-2 text-sm uppercase tracking-[0.06em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-paper disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === "sending" ? "Đang gửi..." : "Gửi báo giá"}
          </button>
          {message ? (
            <p
              className={`text-sm ${state === "ok" ? "text-ink-700" : "text-platinum-deep"}`}
            >
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
