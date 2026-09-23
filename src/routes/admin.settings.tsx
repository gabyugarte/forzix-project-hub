import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const navigate = useNavigate();

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate({ to: "/admin/login" });
        return;
      }

      const { data, error } = await supabase
        .from("site_settings")
        .select("id, whatsapp_number, whatsapp_message")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error cargando configuración:", error);
        setError("No se pudo cargar la configuración.");
        setLoading(false);
        return;
      }

      if (data) {
        setWhatsappNumber(data.whatsapp_number ?? "");
        setWhatsappMessage(data.whatsapp_message ?? "");
      }

      setLoading(false);
    }

    loadSettings();
  }, [navigate]);

  async function handleSave() {
    setError("");
    setSuccess("");
    setSaving(true);

    const { data: existingSettings, error: fetchError } = await supabase
      .from("site_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("Error buscando configuración:", fetchError);
      setError("No se pudo guardar la configuración.");
      setSaving(false);
      return;
    }

    let saveError = null;

    if (existingSettings) {
      const { error } = await supabase
        .from("site_settings")
        .update({
          whatsapp_number: whatsappNumber.trim(),
          whatsapp_message: whatsappMessage.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSettings.id);

      saveError = error;
    } else {
      const { error } = await supabase
        .from("site_settings")
        .insert({
          whatsapp_number: whatsappNumber.trim(),
          whatsapp_message: whatsappMessage.trim(),
        });

      saveError = error;
    }

    if (saveError) {
      console.error("Error guardando configuración:", saveError);
      setError("No se pudo guardar la configuración.");
      setSaving(false);
      return;
    }

    setSuccess("Configuración guardada correctamente.");
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground">
          Cargando configuración...
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate({ to: "/admin" })}
          className="mb-4 text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Volver al panel
        </button>

        <h1 className="text-3xl font-bold tracking-tight">
          Configuración
        </h1>

        <p className="mt-2 text-muted-foreground">
          Gestiona los datos de contacto que utiliza el catálogo de FORZIX.
        </p>
      </div>

      <section className="max-w-2xl rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          WhatsApp de contacto
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Este número recibirá las consultas enviadas desde los productos
          del catálogo.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="whatsapp-number"
              className="mb-2 block text-sm font-medium"
            >
              Número de WhatsApp
            </label>

            <input
              id="whatsapp-number"
              type="text"
              value={whatsappNumber}
              onChange={(event) =>
                setWhatsappNumber(event.target.value)
              }
              placeholder="+51 999 999 999"
              className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />

            <p className="mt-2 text-xs text-muted-foreground">
              Introduce el número con código de país.
            </p>
          </div>

          <div>
            <label
              htmlFor="whatsapp-message"
              className="mb-2 block text-sm font-medium"
            >
              Mensaje inicial de WhatsApp
            </label>

            <textarea
              id="whatsapp-message"
              value={whatsappMessage}
              onChange={(event) =>
                setWhatsappMessage(event.target.value)
              }
              rows={4}
              placeholder="Hola, quisiera información sobre este producto de FORZIX."
              className="w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar configuración"}
          </button>
        </div>
      </section>
    </main>
  );
}