import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — CoachBridge",
  description: "How CoachBridge collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 2026">
      <p>
        CoachBridge (&quot;we&quot;, &quot;us&quot;) is committed to protecting
        your personal data. This policy explains what we collect, why, and the
        rights you have over your information.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> name, email, password (hashed), and
          role (trainee or trainer).
        </li>
        <li>
          <strong>Profile data:</strong> fitness goals, body stats, progress
          photos, certifications, and pricing.
        </li>
        <li>
          <strong>Usage data:</strong> bookings, messages, reviews, and
          transaction history.
        </li>
      </ul>

      <h2>How we use your data</h2>
      <p>
        To operate the platform — matching trainees with trainers, processing
        bookings and payments, enabling messaging, and improving the service.
      </p>

      <h2>Payments</h2>
      <p>
        Payment information is handled exclusively by our PCI-DSS compliant
        payment partner (Chapa). CoachBridge does not store card or mobile-money
        credentials on its servers.
      </p>

      <h2>Your rights</h2>
      <p>
        You may access, correct, or request deletion of your data at any time.
        See our <a href="/data-rights">Data Rights</a> page for how to exercise
        the right to erasure.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Reach us via the{" "}
        <a href="/contact">Contact</a> page.
      </p>
    </LegalPage>
  );
}
