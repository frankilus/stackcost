import { NextRequest, NextResponse } from "next/server";

const SEGMENT_ID =
  process.env.RESEND_SEGMENT_ID || "eaa2c6d9-e343-4531-b457-19079938cf0b";

/**
 * Newsletter signup → Resend Contacts API (Audiences/Segments).
 *
 * Env:
 *   RESEND_API_KEY     — required for live storage (Resend free tier)
 *   RESEND_SEGMENT_ID  — optional; defaults to StackCost Fee Alerts segment
 *
 * If RESEND_API_KEY is missing, we accept the email, log a stub line, and return
 * ok so the UI does not crash. TODO: set RESEND_API_KEY in Vercel project env.
 */
export async function POST(req: NextRequest) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: string };
    email = (body.email || "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Stub path: do not crash; ready for Resend once key is set.
    console.info("[subscribe:stub] would add contact", { email, segmentId: SEGMENT_ID });
    return NextResponse.json({
      ok: true,
      message: "Thanks — you're on the list (dev stub; Resend key not configured yet).",
      stubbed: true,
    });
  }

  try {
    const res = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
        segments: [{ id: SEGMENT_ID }],
      }),
    });

    if (res.status === 409) {
      return NextResponse.json({
        ok: true,
        message: "You're already subscribed. We'll keep you posted on fee changes.",
      });
    }

    if (!res.ok) {
      const text = await res.text();
      console.error("[subscribe] Resend error", res.status, text);
      // Fallback: try alternate payload shape (segmentIds)
      const retry = await fetch("https://api.resend.com/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          segmentIds: [SEGMENT_ID],
        }),
      });
      if (!retry.ok && retry.status !== 409) {
        const retryText = await retry.text();
        console.error("[subscribe] Resend retry error", retry.status, retryText);
        return NextResponse.json(
          { ok: false, error: "Could not save subscription. Try again later." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      message: "You're on the list. We'll email when fees move.",
    });
  } catch (err) {
    console.error("[subscribe] exception", err);
    return NextResponse.json(
      { ok: false, error: "Could not save subscription. Try again later." },
      { status: 500 }
    );
  }
}
