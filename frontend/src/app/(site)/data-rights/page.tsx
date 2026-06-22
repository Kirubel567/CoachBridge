import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Data Rights — CoachBridge",
  description: "Exercise your data access and deletion rights on CoachBridge.",
};

export default function DataRightsPage() {
  return (
    <LegalPage title="Your Data Rights" updated="July 2026">
      <p>
        You have control over the personal data CoachBridge holds about you.
        This page explains your rights and how to exercise them.
      </p>

      <h2>Right to access</h2>
      <p>
        Request a copy of the personal data we hold about you, including your
        profile, bookings, and transaction history.
      </p>

      <h2>Right to rectification</h2>
      <p>Correct any inaccurate or incomplete information from your settings.</p>

      <h2>Right to erasure</h2>
      <p>
        You can request permanent deletion of your account and associated
        personal data (&quot;right to be forgotten&quot;). We fulfill verified
        requests within the legally mandated time frame. Some records may be
        retained where required by law (for example, financial records).
      </p>

      <h2>How to make a request</h2>
      <p>
        Submit a request from your account settings, or reach us through the{" "}
        <a href="/contact">Contact</a> page. We may ask you to verify your
        identity before processing.
      </p>
    </LegalPage>
  );
}
