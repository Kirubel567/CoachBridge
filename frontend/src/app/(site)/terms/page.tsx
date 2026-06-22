import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — CoachBridge",
  description: "The terms governing your use of CoachBridge.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 2026">
      <p>
        By creating an account or using CoachBridge, you agree to these terms.
        Please read them carefully.
      </p>

      <h2>Accounts</h2>
      <p>
        You are responsible for keeping your login credentials secure and for
        all activity under your account. Trainers must provide accurate
        certification details for verification.
      </p>

      <h2>Bookings & payments</h2>
      <ul>
        <li>All payments must be made through the integrated payment gateway.</li>
        <li>
          Funds for a session are held until the session is completed, then
          released to the trainer minus the platform commission.
        </li>
        <li>Cancellations are subject to the stated cancellation window.</li>
      </ul>

      <h2>Conduct</h2>
      <p>
        Arranging payments or contact outside the platform to avoid fees is
        prohibited. Reviews may only be submitted after a completed session.
      </p>

      <h2>Liability</h2>
      <p>
        CoachBridge is a connection platform. Training is delivered by
        independent trainers; you engage them at your own discretion.
      </p>

      <h2>Termination</h2>
      <p>
        We may suspend or terminate accounts that violate these terms or
        platform rules.
      </p>
    </LegalPage>
  );
}
