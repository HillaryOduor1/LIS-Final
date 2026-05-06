import * as React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import SettingsPanel from "./SettingsPanel";

export default function SettingsPage() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb / Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Settings</h1>
            <p className="mt-2 text-[var(--muted)]">
              Manage your preferences and application configuration.
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-[var(--text)] bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all shadow-sm"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* The Panel (Page Variant) */}
        <div className="rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
          <SettingsPanel
            variant="page"
            activeTab={tab || "dashboard"}
            onTabChange={(id) => navigate(`/admin/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}
