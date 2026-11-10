
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  generateQuotePdf,
  type QuotePdfData,
} from "@/lib/generateQuotePdf";

export const Route = createFileRoute("/admin/presupuestos")({
  component: PresupuestosPage,
});

interface Quote {
  id: string;
  quote_number: string;
  issue_date: string;
  created_at: string;

  customer_name: string | null;
  customer_document_number: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  customer_city: string | null;
  customer_address: string | null;

  seller_name: string;
  company_trade_name: string | null;
  company_legal_name: string | null;
  company_ruc: string | null;
  company_fiscal_address: string | null;
  company_phone: string | null;
  company_logo_url: string | null;
  currency: string;

  subtotal: number;
  item_discount_total: number;
  general_discount_amount: number;
  taxable_base: number;
  igv_amount: number;
  total: number;

  observations: string | null;
  status: string;
}

function PresupuestosPage() {
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingQuoteId, setDeletingQuoteId] = useState("");

  // Comprobar acceso de administrador
  useEffect(() => {
    let active = true;

    async function checkAccess() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      if (!session) {
        await navigate({ to: "/admin/login" });
        return;
      }

      const { data, error } = await supabase.rpc("is_admin");

      if (!active) return;

      if (error || data !== true) {
        setAuthorized(false);
        setCheckingAuth(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);
      setCheckingAuth(false);
    }

    void checkAccess();

    return () => {
      active = false;
    };
  }, [navigate]);

  // Cargar presupuestos guardados
  useEffect(() => {
    if (!authorized) return;

    let active = true;

    async function loadQuotes() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setError("No se pudieron cargar los presupuestos: " + error.message);
        setLoading(false);
        return;
      }

      setQuotes((data ?? []) as Quote[]);
      setLoading(false);
    }

    void loadQuotes();

    return () => {
      active = false;
    };
  }, [authorized]);

async function updateQuoteStatus(
  quote: Quote,
  newStatus: string,
) {
  setError("");

  const { error: updateError } = await supabase
    .from("quotes")
    .update({ status: newStatus })
    .eq("id", quote.id);

  if (updateError) {
    console.error("Error actualizando estado:", updateError);
    setError("No se pudo actualizar el estado del presupuesto.");
    return;
  }

  setQuotes((current) =>
    current.map((item) =>
      item.id === quote.id
        ? { ...item, status: newStatus }
        : item,
    ),
  );
}

async function deleteQuote(quote: Quote) {
  const confirmed = window.confirm(
    `¿Estás seguro de que deseas eliminar el presupuesto ${quote.quote_number}?\n\nEsta acción también eliminará sus productos asociados y no se puede deshacer.`,
  );

  if (!confirmed) return;

  setDeletingQuoteId(quote.id);
  setError("");

  const { error } = await supabase
    .from("quotes")
    .delete()
    .eq("id", quote.id);

  if (error) {
    setError("No se pudo eliminar el presupuesto: " + error.message);
    setDeletingQuoteId("");
    return;
  }

  setQuotes((current) =>
    current.filter((item) => item.id !== quote.id),
  );

  setDeletingQuoteId("");
}

async function downloadQuotePdf(quote: Quote) {
  setError("");

  try {
    // 1. Recuperar los productos del presupuesto
    const { data: quoteItems, error: itemsError } = await supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", quote.id);

    if (itemsError) throw itemsError;

// 2. Recuperar los datos históricos de la empresa
const company = {
  trade_name: quote.company_trade_name ?? "",
  legal_name: quote.company_legal_name ?? "",
  ruc: quote.company_ruc ?? "",
  fiscal_address: quote.company_fiscal_address ?? "",
  phone: quote.company_phone ?? "",
  logo_url: quote.company_logo_url ?? "",
};

    // 3. Preparar los datos para el PDF
    const pdfData: QuotePdfData = {
      quoteNumber: quote.quote_number,
      issueDate: quote.issue_date,
      sellerName: quote.seller_name,

      company: {
        trade_name: company.trade_name ?? "",
        legal_name: company.legal_name ?? "",
        ruc: company.ruc ?? "",
        fiscal_address: company.fiscal_address ?? "",
        phone: company.phone ?? "",
        logo_url: company.logo_url ?? "",
      },

      customer: {
        name: quote.customer_name ?? "",
        document_number: quote.customer_document_number ?? "",
        phone: quote.customer_phone ?? "",
        email: quote.customer_email ?? "",
        city: quote.customer_city ?? "",
        address: quote.customer_address ?? "",
      },

      items: (quoteItems ?? []).map((item) => ({
        code: item.product_code ?? "",
        name: item.product_name,
        variant_name: item.variant_name ?? "",
        quantity: item.quantity,
        price: item.unit_price,
        currency: item.currency,
        discount_amount: item.discount_amount,
        line_total: item.line_total,
      })),

      subtotal: quote.subtotal,
      itemDiscountTotal: quote.item_discount_total,
      generalDiscountAmount: quote.general_discount_amount,
      taxableBase: quote.taxable_base,
      igvAmount: quote.igv_amount,
      total: quote.total,
      observations: quote.observations ?? "",
    };

    // 4. Generar y descargar el PDF
    await generateQuotePdf(pdfData);
  } catch (error) {
    console.error("Error al descargar el presupuesto:", error);
    setError(
      error instanceof Error
        ? error.message
        : "No se pudo generar el PDF.",
    );
  }
}


function getStatusStyles(status: string) {
  switch (status) {
    case "pending":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";

    case "sent":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "accepted":
      return "border-green-200 bg-green-50 text-green-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    case "expired":
      return "border-gray-200 bg-gray-100 text-gray-600";

    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "sent":
      return "Enviado";
    case "accepted":
      return "Aceptado";
    case "rejected":
      return "Rechazado";
    case "expired":
      return "Vencido";
    default:
      return "Sin estado";
  }
}

  function formatPrice(value: number, currency = "S/") {
    return `${currency} ${Number(value).toFixed(2)}`;
  }

  function formatDate(value: string) {
    if (!value) return "—";

    return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(
      "es-PE",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
    );
  }

const totalQuotes = quotes.length;

const pendingQuotes = quotes.filter(
  (quote) => quote.status === "pending",
).length;

const sentQuotes = quotes.filter(
  (quote) => quote.status === "sent",
).length;

const acceptedQuotes = quotes.filter(
  (quote) => quote.status === "accepted",
).length;
const rejectedQuotes = quotes.filter(
  (quote) => quote.status === "rejected",
).length;
  const filteredQuotes = quotes.filter((quote) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return true;

    return (
      quote.quote_number.toLowerCase().includes(searchText) ||
      (quote.customer_name ?? "").toLowerCase().includes(searchText) ||
      (quote.customer_document_number ?? "").toLowerCase().includes(searchText) ||
      (quote.customer_phone ?? "").toLowerCase().includes(searchText)
    );
  });
const groupedQuotes = filteredQuotes.reduce<Record<string, Quote[]>>(
  (groups, quote) => {
    const dateValue = quote.issue_date || quote.created_at;
    const date = new Date(`${dateValue.slice(0, 10)}T00:00:00`);

    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;

    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }

    groups[monthKey].push(quote);

    return groups;
  },
  {},
);

const sortedMonthKeys = Object.keys(groupedQuotes).sort((a, b) =>
  b.localeCompare(a),
);
  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-4">
        <p className="text-sm text-muted-foreground">
          Comprobando acceso...
        </p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4 text-center">
        <h1 className="text-2xl font-bold">Acceso restringido</h1>
        <p className="text-sm text-muted-foreground">
          Necesitas una cuenta administradora para consultar los presupuestos.
        </p>
        <Link
          to="/admin"
          className="font-semibold text-primary hover:underline"
        >
          Volver al panel
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/admin"
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Volver al panel de administración
        </Link>

        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
          <p className="section-eyebrow">FORZIX · Administración</p>

          <h1 className="mt-3 text-3xl font-extrabold">
            Historial de presupuestos
          </h1>

          <p className="mt-3 text-muted-foreground">
            Consulta los presupuestos guardados y revisa la información de
            cada cliente.
          </p>
<div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">

  <div className="rounded-xl border border-border bg-card p-5">
    <p className="text-sm text-muted-foreground">
      Total de presupuestos
    </p>
    <p className="mt-2 text-3xl font-extrabold">
      {totalQuotes}
    </p>
  </div>

  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
    <p className="text-sm text-yellow-700">
      Pendientes
    </p>
    <p className="mt-2 text-3xl font-extrabold text-yellow-700">
      {pendingQuotes}
    </p>
  </div>

  <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
    <p className="text-sm text-blue-700">
      Enviados
    </p>
    <p className="mt-2 text-3xl font-extrabold text-blue-700">
      {sentQuotes}
    </p>
  </div>

  <div className="rounded-xl border border-green-200 bg-green-50 p-5">
    <p className="text-sm text-green-700">
      Aceptados
    </p>
    <p className="mt-2 text-3xl font-extrabold text-green-700">
      {acceptedQuotes}
    </p>
  </div>
  <div className="rounded-xl border border-red-200 bg-red-50 p-5">
  <p className="text-sm text-red-700">
    Rechazados
  </p>
  <p className="mt-2 text-3xl font-extrabold text-red-700">
    {rejectedQuotes}
  </p>
</div>

</div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Presupuestos registrados
              </p>
              <p className="mt-1 text-2xl font-extrabold">
                {quotes.length}
              </p>
            </div>

            <Link
              to="/admin/cotizador"
              className="rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              + Crear presupuesto
            </Link>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-semibold">
              Buscar presupuesto
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Número, cliente, DNI/RUC o teléfono..."
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>

          {loading && (
            <p className="mt-8 text-sm text-muted-foreground">
              Cargando presupuestos...
            </p>
          )}

          {error && (
            <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {!loading && !error && (
            <div className="mt-8">
              {filteredQuotes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <p className="font-semibold">
                    {quotes.length === 0
                      ? "Todavía no hay presupuestos guardados."
                      : "No se encontraron resultados."}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {quotes.length === 0
                      ? "Cuando guardes un presupuesto desde el cotizador, aparecerá aquí."
                      : "Prueba con otro número o dato del cliente."}
                  </p>
                </div>
              ) : (

<div className="space-y-4">
  {sortedMonthKeys.map((monthKey, index) => {
    const [year, month] = monthKey.split("-");

    const monthLabel = new Date(
      Number(year),
      Number(month) - 1,
      1,
    ).toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });

    const monthQuotes = groupedQuotes[monthKey] ?? [];
    const monthTotalAmount = monthQuotes.reduce(
  (total, quote) => total + Number(quote.total || 0),
  0,
);

const acceptedQuotes = monthQuotes.filter(
  (quote) => quote.status === "accepted",
);

const acceptedTotalAmount = acceptedQuotes.reduce(
  (total, quote) => total + Number(quote.total || 0),
  0,
);

const monthCurrency = monthQuotes[0]?.currency || "S/";
    return (
      <details
        key={monthKey}
        open={index === 0}
        className="rounded-lg border border-border bg-background p-4 sm:p-5"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold capitalize">
          <span>{monthLabel}</span>

          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {monthQuotes.length} {monthQuotes.length === 1 ? "presupuesto" : "presupuestos"}
          </span>
        </summary>


<div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
  <div className="rounded-lg bg-muted/50 p-3">
    <p className="text-xs text-muted-foreground">
      Presupuestos emitidos
    </p>
    <p className="mt-1 text-xl font-extrabold">
      {monthQuotes.length}
    </p>
  </div>

  <div className="rounded-lg bg-muted/50 p-3">
    <p className="text-xs text-muted-foreground">
      Importe presupuestado
    </p>
    <p className="mt-1 text-lg font-extrabold">
      {formatPrice(monthTotalAmount, monthCurrency)}
    </p>
  </div>

  <div className="rounded-lg bg-muted/50 p-3">
    <p className="text-xs text-muted-foreground">
      Presupuestos aceptados
    </p>
    <p className="mt-1 text-xl font-extrabold text-green-600">
      {acceptedQuotes.length}
    </p>
  </div>

  <div className="rounded-lg bg-muted/50 p-3">
    <p className="text-xs text-muted-foreground">
      Importe aceptado
    </p>
    <p className="mt-1 text-lg font-extrabold text-green-600">
      {formatPrice(acceptedTotalAmount, monthCurrency)}
    </p>
  </div>
</div>


        <div className="mt-4 space-y-4">
          {monthQuotes.map((quote) => (
            <div
              key={quote.id}
              className="rounded-lg border border-border bg-background p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    PRESUPUESTO
                  </p>

                  <h2 className="mt-1 text-lg font-extrabold">
                    {quote.quote_number}
                  </h2>

                  <p className="mt-2 font-semibold">
                    {quote.customer_name || "Cliente sin nombre"}
                  </p>

                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>
                      Documento:{" "}
                      {quote.customer_document_number || "No registrado"}
                    </p>
                    <p>
                      Teléfono: {quote.customer_phone || "No registrado"}
                    </p>
                    <p>Vendedor: {quote.seller_name}</p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs text-muted-foreground">
                    Fecha de emisión
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(quote.issue_date)}
                  </p>

                  <p className="mt-4 text-xs text-muted-foreground">
                    Total del presupuesto
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-primary">
                    {formatPrice(Number(quote.total), quote.currency)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`status-${quote.id}`}
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    Estado del presupuesto
                  </label>

                  <span
                    className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(quote.status || "pending")}`}
                  >
                    {getStatusLabel(quote.status || "pending")}
                  </span>

                  <select
                    id={`status-${quote.id}`}
                    value={quote.status || "pending"}
                    onChange={(e) =>
                      updateQuoteStatus(quote, e.target.value)
                    }
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="sent">Enviado</option>
                    <option value="accepted">Aceptado</option>
                    <option value="rejected">Rechazado</option>
                    <option value="expired">Vencido</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => downloadQuotePdf(quote)}
                  className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
                >
                  Descargar PDF
                </button>

                <button
                  type="button"
                  onClick={() => deleteQuote(quote)}
                  disabled={deletingQuoteId === quote.id}
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingQuoteId === quote.id
                    ? "Eliminando..."
                    : "Eliminar presupuesto"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </details>
    );
  })}
</div>

              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
