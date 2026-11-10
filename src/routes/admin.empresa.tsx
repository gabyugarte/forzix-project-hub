import { supabase } from "@/integrations/supabase/client";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/empresa")({
  component: EmpresaPage,
});

function EmpresaPage() {
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [companyId, setCompanyId] = useState("");

  const [tradeName, setTradeName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [ruc, setRuc] = useState("");
  const [fiscalAddress, setFiscalAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  
  async function loadCompanySettings() {
    setLoading(true);
    setError("");

    const { data, error: loadError } = await supabase
      .from("company_settings")
      .select("*")
      .eq("singleton", true)
      .maybeSingle();

    if (loadError) {
      console.error("Error cargando datos de empresa:", loadError);
      setError("No se pudieron cargar los datos de FORZIX.");
      setLoading(false);
      return;
    }

    if (data) {
      setCompanyId(data.id);
      setTradeName(data.trade_name ?? "");
      setLegalName(data.legal_name ?? "");
      setRuc(data.ruc ?? "");
      setFiscalAddress(data.fiscal_address ?? "");
      setPhone(data.phone ?? "");
      setLogoUrl(data.logo_url ?? "");
      setLogoPreview(data.logo_url ?? "");
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadCompanySettings();
  }, []);

function handleLogoChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  if (file.type !== "image/png") {
    setError("Selecciona un archivo PNG.");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    setError("El logotipo no puede superar los 2 MB.");
    return;
  }

  setError("");
  setSuccess("");
  setLogoFile(file);
  setLogoPreview(URL.createObjectURL(file));
}

async function uploadCompanyLogo(): Promise<string | null> {
  if (!logoFile) return logoUrl || null;

  const filePath = `company/logo-${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, logoFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error subiendo logotipo:", uploadError);
    throw new Error("No se pudo subir el logotipo.");
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

  async function saveCompanySettings() {
  setSaving(true);
  setError("");
  setSuccess("");

      let uploadedLogoUrl: string | null = null;

    try {
      uploadedLogoUrl = await uploadCompanyLogo();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Error al subir el logotipo."
      );
      setSaving(false);
      return;
    }

  const { error: saveError } = await supabase
    .from("company_settings")
    .update({
      trade_name: tradeName.trim(),
      legal_name: legalName.trim(),
      ruc: ruc.trim(),
      fiscal_address: fiscalAddress.trim(),
      phone: phone.trim(),
      logo_url: uploadedLogoUrl ?? logoUrl ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", companyId);

  if (saveError) {
    console.error("Error guardando datos de empresa:", saveError);
    setError("No se pudieron guardar los datos de FORZIX.");
    setSaving(false);
    return;
  }

  setSuccess("Los datos de empresa se guardaron correctamente.");
  setSaving(false);
}

  return (
    <main className="min-h-screen bg-surface px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
  to="/admin"
  className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
>
  ← Volver al panel de administración
</Link>
        <h1 className="font-display text-3xl font-extrabold">
          Configuración de empresa
        </h1>

        <p className="mt-4 text-muted-foreground">
          Aquí gestionaremos los datos corporativos de FORZIX.
        </p>
        {loading ? (
  <p className="mt-8 text-muted-foreground">
    Cargando datos de empresa...
  </p>
) : (
  <div className="mt-8 space-y-6">

    {error && (
      <div className="rounded-lg bg-red-100 p-4 text-red-700">
        {error}
      </div>
    )}

    {success && (
      <div className="rounded-lg bg-green-100 p-4 text-green-700">
        {success}
      </div>
    )}

<div className="rounded-xl border border-border bg-card p-6 space-y-5">
  <h2 className="text-xl font-bold">
    Logotipo de empresa
  </h2>

  <p className="text-sm text-muted-foreground">
    Selecciona el logotipo oficial de FORZIX en formato PNG.
  </p>

  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

    <div className="flex h-36 w-56 items-center justify-center rounded-lg border border-dashed border-border bg-background p-4">
      {logoPreview ? (
        <img
          src={logoPreview}
          alt="Logotipo de FORZIX"
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <span className="text-sm text-muted-foreground">
          Sin logotipo seleccionado
        </span>
      )}
    </div>

    <div className="space-y-3">
<label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
  <input
    type="file"
    accept="image/png"
    onChange={handleLogoChange}
    className="hidden"
  />

  <span>Seleccionar logotipo</span>
</label>

      <p className="text-xs text-muted-foreground">
        Formato PNG · Máximo 2 MB.
      </p>
    </div>

  </div>
</div>

    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <h2 className="text-xl font-bold">
        Datos corporativos
      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Nombre comercial
          </label>
          <input
            type="text"
            value={tradeName}
            onChange={(e) => setTradeName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-3"
            placeholder="FORZIX Herrajes y Accesorios"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Razón social
          </label>
          <input
            type="text"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-3"
            placeholder="Razón social de la empresa"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            RUC
          </label>
          <input
            type="text"
            value={ruc}
            onChange={(e) => setRuc(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-3"
            placeholder="Número de RUC"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Teléfono
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-3"
            placeholder="Teléfono de contacto"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Domicilio fiscal
          </label>
          <input
            type="text"
            value={fiscalAddress}
            onChange={(e) => setFiscalAddress(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-3"
            placeholder="Dirección fiscal de la empresa"
          />
        </div>

      </div>
    </div>

    <div className="flex justify-end">
      <button
        type="button"
        onClick={saveCompanySettings}
        disabled={saving || !companyId}
        className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>

  </div>
)}
      </div>
    </main>
  );
}
