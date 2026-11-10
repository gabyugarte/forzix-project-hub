
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  generateQuotePdf,
  type QuotePdfData,
} from "@/lib/generateQuotePdf";

export const Route = createFileRoute("/admin/cotizador")({
  component: CotizadorPage,
});

interface Product {
  id: string;
  name: string;
  product_code: string | null;
  description: string | null;
  price: number | null;
  currency: string;
  available: boolean;
}

interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  name: string;
  description: string | null;
  price: number | null;
  currency: string;
  available: boolean;
}

interface Customer {
  id: string;
  name: string;
  document_number: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  address: string | null;
}

interface QuoteItem {
  id: string;
  product_id: string;
  name: string;
  variant_name: string;
  code: string;
  price: number;
  currency: string;
  quantity: number;
  discount_type: "none" | "percentage" | "fixed";
  discount_value: number;
}

function CotizadorPage() {
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sellerName, setSellerName] = useState("");
  const [observations, setObservations] = useState("");
  const [selectedObservationTemplates, setSelectedObservationTemplates] =
  useState<Array<"general" | "delivery">>([]);
  const observationTemplates = {
  general:
    "Los precios están expresados en soles (S/) e incluyen IGV.\nLa disponibilidad de los productos está sujeta a confirmación.\nLos gastos de envío no están incluidos en este presupuesto.\nLas condiciones de entrega se coordinarán con el cliente.",

  delivery:
    "La disponibilidad de los productos y el plazo de entrega están sujetos a confirmación.\nLa entrega se coordinará previamente con el cliente.\nLos gastos de envío no están incluidos.",

  custom: "",
};
  const [authorized, setAuthorized] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState<number | "">(1);

  const [items, setItems] = useState<QuoteItem[]>([]);
  const [quantityDrafts, setQuantityDrafts] = useState<Record<string, string>>({});
  const [generalDiscountType, setGeneralDiscountType] = useState<
  "none" | "percentage" | "fixed"
>("none");

const [generalDiscountValue, setGeneralDiscountValue] = useState(0);
  // Clientes registrados
const [customers, setCustomers] = useState<Customer[]>([]);
const [customerSearch, setCustomerSearch] = useState("");
const [selectedCustomerId, setSelectedCustomerId] = useState("");

const [showCustomerForm, setShowCustomerForm] = useState(false);
const [savingCustomer, setSavingCustomer] = useState(false);
const [customerError, setCustomerError] = useState("");

const [customerForm, setCustomerForm] = useState({
  name: "",
  document_number: "",
  phone: "",
  email: "",
  city: "",
  address: "",
});

const [savingQuote, setSavingQuote] = useState(false);
const [quoteError, setQuoteError] = useState("");
const [savedQuoteNumber, setSavedQuoteNumber] = useState("");
const [savedQuotePdfData, setSavedQuotePdfData] =
  useState<QuotePdfData | null>(null);
const [companySettings, setCompanySettings] = useState({
  trade_name: "",
  legal_name: "",
  ruc: "",
  fiscal_address: "",
  phone: "",
  logo_url: "",
});

useEffect(() => {
  async function loadCompanySettings() {
    const { data, error } = await supabase
      .from("company_settings")
      .select("*")
      .eq("singleton", true)
      .maybeSingle();

    if (error) {
      console.error("Error cargando datos de empresa:", error);
      return;
    }

    if (data) {
      console.log("Datos de empresa cargados:", data);
      setCompanySettings({
        
        trade_name: data.trade_name ?? "",
        legal_name: data.legal_name ?? "",
        ruc: data.ruc ?? "",
        fiscal_address: data.fiscal_address ?? "",
        phone: data.phone ?? "",
        logo_url: data.logo_url ?? "",
      });
    }
  }

  void loadCompanySettings();
}, []);

  // Comprobar que el usuario sea administrador.
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

const defaultSellerName =
  session.user.user_metadata?.["full_name"] ||
  session.user.user_metadata?.["name"] ||
  session.user.email ||
  "";

setSellerName(defaultSellerName);

      const { data, error } = await supabase.rpc("is_admin");

      if (!active) return;

      if (error || data !== true) {
        setAuthorized(false);
        setCheckingAuth(false);
        return;
      }

      setAuthorized(true);
      setCheckingAuth(false);
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, [navigate]);

  // Cargar el catálogo real de Supabase.
  useEffect(() => {
    if (!authorized) return;

    let active = true;

    async function loadCatalog() {
      setLoadingProducts(true);
      setLoadError("");

      const [productsResult, variantsResult] = await Promise.all([
        supabase
          .from("products")
          .select(
            "id, name, product_code, description, price, currency, available",
          )
          .eq("available", true)
          .order("name", { ascending: true }),

        supabase
          .from("product_variants")
          .select(
            "id, product_id, sku, name, description, price, currency, available",
          )
          .eq("available", true)
          .order("display_order", { ascending: true }),
      ]);

      if (!active) return;

      if (productsResult.error) {
        setLoadError(
          "No se pudieron cargar los productos: " +
            productsResult.error.message,
        );
        setLoadingProducts(false);
        return;
      }

      if (variantsResult.error) {
        setLoadError(
          "No se pudieron cargar las variantes: " +
            variantsResult.error.message,
        );
        setLoadingProducts(false);
        return;
      }

      setProducts((productsResult.data ?? []) as Product[]);
      setVariants((variantsResult.data ?? []) as ProductVariant[]);
      setLoadingProducts(false);
    }

    loadCatalog();

    return () => {
      active = false;
    };
  }, [authorized]);

  // Cargar clientes registrados en Supabase
useEffect(() => {
  if (!authorized) return;

  async function loadCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      setCustomerError("No se pudieron cargar los clientes: " + error.message);
      return;
    }

    setCustomers((data ?? []) as Customer[]);
  }

  loadCustomers();
}, [authorized]);

  const filteredProducts = products.filter((product) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return true;

    return (
      product.name.toLowerCase().includes(searchText) ||
      (product.product_code ?? "").toLowerCase().includes(searchText)
    );
  });

  const filteredCustomers = customers.filter((customer) => {
  const searchText = customerSearch.trim().toLowerCase();

  if (!searchText) return true;

  return (
    customer.name.toLowerCase().includes(searchText) ||
    (customer.document_number ?? "").toLowerCase().includes(searchText) ||
    (customer.phone ?? "").toLowerCase().includes(searchText)
  );
});

const selectedCustomer = customers.find(
  (customer) => customer.id === selectedCustomerId,
);

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  const selectedProductVariants = variants.filter(
    (variant) => variant.product_id === selectedProductId,
  );

  const selectedVariant = selectedProductVariants.find(
    (variant) => variant.id === selectedVariantId,
  );

  const unitPrice =
    selectedVariant?.price ?? selectedProduct?.price ?? null;

  const currency =
    selectedVariant?.price !== null && selectedVariant?.price !== undefined
      ? selectedVariant.currency
      : selectedProduct?.currency ?? "S/";

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateDiscount(
  amount: number,
  type: "none" | "percentage" | "fixed",
  value: number,
) {
  if (type === "none" || amount <= 0 || value <= 0) return 0;

  if (type === "percentage") {
    return roundMoney(amount * (Math.min(value, 100) / 100));
  }

  return roundMoney(Math.min(value, amount));
}

const subtotal = roundMoney(
  items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  ),
);

const itemDiscountTotal = roundMoney(
  items.reduce((total, item) => {
    const lineSubtotal = item.price * item.quantity;

    return (
      total +
      calculateDiscount(
        lineSubtotal,
        item.discount_type,
        item.discount_value,
      )
    );
  }, 0),
);

const subtotalAfterItemDiscounts = roundMoney(
  subtotal - itemDiscountTotal,
);

const generalDiscountAmount = calculateDiscount(
  subtotalAfterItemDiscounts,
  generalDiscountType,
  generalDiscountValue,
);

const total = roundMoney(
  subtotalAfterItemDiscounts - generalDiscountAmount,
);

// Los precios del catálogo ya incluyen IGV.
const taxableBase = roundMoney(total / 1.18);
const igvAmount = roundMoney(total - taxableBase);

async function saveCustomer() {
  if (!customerForm.name.trim()) {
    setCustomerError("El nombre del cliente es obligatorio.");
    return;
  }

  setSavingCustomer(true);
  setCustomerError("");

  const { data, error } = await supabase
    .from("customers")
    .insert({
      name: customerForm.name.trim(),
      document_number: customerForm.document_number.trim() || null,
      phone: customerForm.phone.trim() || null,
      email: customerForm.email.trim() || null,
      city: customerForm.city.trim() || null,
      address: customerForm.address.trim() || null,
    })
    .select()
    .single();

  setSavingCustomer(false);

  if (error) {
    setCustomerError("No se pudo guardar el cliente: " + error.message);
    return;
  }

  const newCustomer = data as Customer;

  setCustomers((current) =>
    [...current, newCustomer].sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  );

  setSelectedCustomerId(newCustomer.id);
  setCustomerSearch(newCustomer.name);
  setCustomerForm({
    name: "",
    document_number: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });
  setShowCustomerForm(false);
}

  function formatPrice(value: number, currencyValue = "S/") {
    return `${currencyValue} ${value.toFixed(2)}`;
  }

  function selectProduct(product: Product) {
    setSelectedProductId(product.id);

    const firstVariant = variants.find(
      (variant) => variant.product_id === product.id,
    );

    setSelectedVariantId(firstVariant?.id ?? "");
    setQuantity(1);
  }

  function addItem() {
    if (!selectedProduct || unitPrice === null) return;

    const variant = selectedVariant;
    const itemId = variant?.id ?? selectedProduct.id;

const newItem: QuoteItem = {
  id: itemId,
  product_id: selectedProduct.id,
  name: selectedProduct.name,
  variant_name: variant?.name ?? "",
  code: variant?.sku ?? selectedProduct.product_code ?? "",
  price: Number(unitPrice),
  currency,
  quantity: Math.max(1, Number(quantity) || 1),
  discount_type: "none",
  discount_value: 0,
};

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === itemId);

      if (existing) {
        return currentItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item,
        );
      }

      return [...currentItems, newItem];
    });

    setSearch("");
    setSelectedProductId("");
    setSelectedVariantId("");
    setQuantity(1);
  }

  function updateQuantity(id: string, newQuantity: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item,
      ),
    );
  }

  function updateItemDiscount(
  id: string,
  type: "none" | "percentage" | "fixed",
  value: number,
) {
  setItems((currentItems) =>
    currentItems.map((item) =>
      item.id === id
        ? {
            ...item,
            discount_type: type,
            discount_value: Math.max(0, value),
          }
        : item,
    ),
  );
}

  function removeItem(id: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  }

async function saveQuote() {
  setQuoteError("");
  setSavedQuoteNumber("");

  // Validaciones
  if (!selectedCustomerId) {
    setQuoteError("Selecciona un cliente antes de guardar.");
    return;
  }

  if (!sellerName.trim()) {
    setQuoteError("Introduce el nombre del vendedor.");
    return;
  }

  if (items.length === 0) {
    setQuoteError("Añade al menos un producto al presupuesto.");
    return;
  }

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId,
  );

  if (!selectedCustomer) {
    setQuoteError("No se ha encontrado el cliente seleccionado.");
    return;
  }

  setSavingQuote(true);

  try {
    // 1. Guardar los datos generales del presupuesto
    const { data: quote, error: quoteInsertError } = await supabase
      .from("quotes")
      .insert({
        customer_id: selectedCustomer.id,
        customer_name: selectedCustomer.name,
        customer_document_number: selectedCustomer.document_number,
        customer_phone: selectedCustomer.phone,
        customer_email: selectedCustomer.email,
        customer_city: selectedCustomer.city,
        customer_address: selectedCustomer.address,
        seller_name: sellerName.trim(),

        company_trade_name: companySettings.trade_name,
        company_legal_name: companySettings.legal_name,
        company_ruc: companySettings.ruc,
        company_fiscal_address: companySettings.fiscal_address,
        company_phone: companySettings.phone,
        company_logo_url: companySettings.logo_url,

        currency: "S/",
        subtotal,
        item_discount_total: itemDiscountTotal,
        general_discount_type: generalDiscountType,
        general_discount_value: generalDiscountValue,
        general_discount_amount: generalDiscountAmount,
        taxable_base: taxableBase,
        igv_rate: 0.18,
        igv_amount: igvAmount,
        total,
        observations: observations.trim() || null,
      })
      .select("id, quote_number")
      .single();

    if (quoteInsertError) {
      throw quoteInsertError;
    }

    // 2. Preparar los productos con sus datos históricos
    const quoteItems = items.map((item) => {
      const lineSubtotal = roundMoney(item.price * item.quantity);

      const discountAmount = calculateDiscount(
        lineSubtotal,
        item.discount_type,
        item.discount_value,
      );

      const selectedVariant = variants.find(
        (variant) => variant.id === item.id,
      );

      return {
        quote_id: quote.id,
        product_id: item.product_id,
        variant_id: selectedVariant?.id ?? null,
        product_name: item.name,
        variant_name: item.variant_name || null,
        product_code: item.code || null,
        quantity: item.quantity,
        unit_price: item.price,
        currency: item.currency,
        discount_type: item.discount_type,
        discount_value: item.discount_value,
        discount_amount: discountAmount,
        line_subtotal: lineSubtotal,
        line_total: roundMoney(lineSubtotal - discountAmount),
      };
    });

    // 3. Guardar las líneas del presupuesto
    const { error: itemsInsertError } = await supabase
      .from("quote_items")
      .insert(quoteItems);

    if (itemsInsertError) {
      // Si fallan los productos, intentamos eliminar el presupuesto incompleto
      await supabase.from("quotes").delete().eq("id", quote.id);

      throw itemsInsertError;
    }

    // 4. Mostrar el número generado automáticamente
    const today = new Date();

const issueDate = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0"),
].join("-");

const pdfItems = items.map((item) => {
  const lineSubtotal = roundMoney(item.price * item.quantity);

  const discountAmount = calculateDiscount(
    lineSubtotal,
    item.discount_type,
    item.discount_value,
  );

  return {
    code: item.code,
    name: item.name,
    variant_name: item.variant_name,
    quantity: item.quantity,
    price: item.price,
    currency: item.currency,
    discount_amount: discountAmount,
    line_total: roundMoney(lineSubtotal - discountAmount),
  };
});

setSavedQuotePdfData({
  quoteNumber: quote.quote_number,
  issueDate,
  sellerName: sellerName.trim(),

  company: {
    trade_name: companySettings.trade_name,
    legal_name: companySettings.legal_name,
    ruc: companySettings.ruc,
    fiscal_address: companySettings.fiscal_address,
    phone: companySettings.phone,
    logo_url: companySettings.logo_url,
  },

  customer: {
    name: selectedCustomer.name,
    document_number: selectedCustomer.document_number ?? "",
    phone: selectedCustomer.phone ?? "",
    email: selectedCustomer.email ?? "",
    city: selectedCustomer.city ?? "",
    address: selectedCustomer.address ?? "",
  },

  items: pdfItems,

  subtotal,
  itemDiscountTotal,
  generalDiscountAmount,
  taxableBase,
  igvAmount,
  total,
  observations: observations.trim(),
});
    setSavedQuoteNumber(quote.quote_number);
  } catch (error) {
    console.error("Error al guardar el presupuesto:", error);

    setQuoteError(
      error instanceof Error
        ? error.message
        : "Ha ocurrido un error al guardar el presupuesto.",
    );
  } finally {
    setSavingQuote(false);
  }
}

async function downloadSavedQuotePdf() {
  if (!savedQuotePdfData) return;

  try {
    await generateQuotePdf(savedQuotePdfData);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    setQuoteError("No se pudo generar el PDF. Inténtalo nuevamente.");
  }
}

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
          Necesitas una cuenta administradora para acceder al cotizador.
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
      <div className="mx-auto max-w-5xl">
        <Link
          to="/admin"
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Volver al panel de administración
        </Link>

        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
          <p className="section-eyebrow">FORZIX · Administración</p>

          <h1 className="mt-3 text-3xl font-extrabold">Cotizador</h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Crea presupuestos para tus clientes utilizando el catálogo
            de productos y precios registrados en FORZIX.
          </p>

          
<div className="mt-8 border-t border-border pt-6">
  <h2 className="text-xl font-bold">1. Datos del cliente</h2>

  <div className="mt-8 border-t border-border pt-6">
  <h2 className="text-xl font-bold">Datos del vendedor</h2>

  <p className="mt-2 text-sm text-muted-foreground">
    Persona responsable de preparar este presupuesto.
  </p>

  <label className="mt-4 block text-sm font-semibold">
    Nombre del vendedor
  </label>

  <input
    type="text"
    value={sellerName}
    onChange={(event) => setSellerName(event.target.value)}
    placeholder="Nombre del vendedor"
    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
  />
</div>

  <p className="mt-2 text-sm text-muted-foreground">
    Busca un cliente registrado o añade uno nuevo.
  </p>

  <label className="mt-5 block text-sm font-semibold">
    Buscar cliente
  </label>

  <input
    type="text"
    value={customerSearch}
    onChange={(event) => {
      setCustomerSearch(event.target.value);
      setSelectedCustomerId("");
    }}
    placeholder="Nombre, DNI/RUC o teléfono..."
    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
  />

  {customerSearch.trim() && !selectedCustomerId && (
    <div className="mt-2 max-h-48 space-y-2 overflow-y-auto">
      {filteredCustomers.map((customer) => (
        <button
          key={customer.id}
          type="button"
          onClick={() => {
            setSelectedCustomerId(customer.id);
            setCustomerSearch(customer.name);
          }}
          className="w-full rounded-lg border border-border p-3 text-left hover:border-primary"
        >
          <span className="block font-semibold">{customer.name}</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            {customer.document_number || "Sin documento"} ·{" "}
            {customer.phone || "Sin teléfono"}
          </span>
        </button>
      ))}

      {filteredCustomers.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
          No se encontraron clientes.
        </p>
      )}
    </div>
  )}

  {selectedCustomer && (
    <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">{selectedCustomer.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedCustomer.document_number || "Sin documento"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedCustomerId("");
            setCustomerSearch("");
          }}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Cambiar
        </button>
      </div>

      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        {selectedCustomer.phone && <p>Teléfono: {selectedCustomer.phone}</p>}
        {selectedCustomer.email && <p>Correo: {selectedCustomer.email}</p>}
        {selectedCustomer.city && <p>Ciudad: {selectedCustomer.city}</p>}
        {selectedCustomer.address && (
          <p>Dirección: {selectedCustomer.address}</p>
        )}
      </div>
    </div>
  )}

  <button
    type="button"
    onClick={() => {
      setCustomerError("");
      setShowCustomerForm(!showCustomerForm);
    }}
    className="mt-4 rounded-lg border border-primary px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
  >
    {showCustomerForm ? "Cancelar registro" : "+ Registrar nuevo cliente"}
  </button>

  {customerError && (
    <p className="mt-3 text-sm text-red-600">{customerError}</p>
  )}

  {showCustomerForm && (
    <div className="mt-5 rounded-lg border border-border bg-background p-4">
      <h3 className="font-bold">Nuevo cliente</h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold">
            Nombre o razón social *
          </label>
          <input
            type="text"
            value={customerForm.name}
            onChange={(event) =>
              setCustomerForm({ ...customerForm, name: event.target.value })
            }
            placeholder="Nombre del cliente"
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">DNI / RUC</label>
          <input
            type="text"
            value={customerForm.document_number}
            onChange={(event) =>
              setCustomerForm({
                ...customerForm,
                document_number: event.target.value,
              })
            }
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Teléfono / WhatsApp</label>
          <input
            type="tel"
            value={customerForm.phone}
            onChange={(event) =>
              setCustomerForm({ ...customerForm, phone: event.target.value })
            }
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Correo electrónico</label>
          <input
            type="email"
            value={customerForm.email}
            onChange={(event) =>
              setCustomerForm({ ...customerForm, email: event.target.value })
            }
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Ciudad</label>
          <input
            type="text"
            value={customerForm.city}
            onChange={(event) =>
              setCustomerForm({ ...customerForm, city: event.target.value })
            }
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-semibold">Dirección</label>
          <input
            type="text"
            value={customerForm.address}
            onChange={(event) =>
              setCustomerForm({ ...customerForm, address: event.target.value })
            }
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3 text-sm"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={saveCustomer}
        disabled={savingCustomer || !customerForm.name.trim()}
        className="mt-5 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50"
      >
        {savingCustomer ? "Guardando..." : "Guardar cliente"}
      </button>
    </div>
  )}
</div>


          <div className="mt-8">
            <h2 className="text-xl font-bold">2. Añadir productos</h2>

            <label className="mt-5 block text-sm font-semibold">
              Buscar producto por nombre o código
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedProductId("");
                setSelectedVariantId("");
              }}
              placeholder="Ej. bisagra, corredera, FZ-BIS-001..."
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />

            {loadingProducts && (
              <p className="mt-3 text-sm text-muted-foreground">
                Cargando catálogo...
              </p>
            )}

            {loadError && (
              <p className="mt-3 text-sm text-red-600">{loadError}</p>
            )}

            {!loadingProducts && !loadError && (
              <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => selectProduct(product)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      selectedProductId === product.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <span className="block font-semibold">
                      {product.name}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {product.product_code || "Sin código"} ·{" "}
                      {product.price !== null
                        ? formatPrice(Number(product.price), product.currency)
                        : "Precio por confirmar"}
                    </span>
                  </button>
                ))}

                {filteredProducts.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    No se encontraron productos.
                  </p>
                )}
              </div>
            )}

            {selectedProduct && (
              <div className="mt-5 rounded-lg border border-border bg-background p-4">
                <h3 className="font-bold">{selectedProduct.name}</h3>

                {selectedProductVariants.length > 0 && (
                  <>
                    <label className="mt-4 block text-sm font-semibold">
                      Seleccionar variante
                    </label>
                    <select
                      value={selectedVariantId}
                      onChange={(event) =>
                        setSelectedVariantId(event.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3 text-sm"
                    >
                      {selectedProductVariants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.name}
                          {variant.sku ? ` · ${variant.sku}` : ""}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {selectedVariant?.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedVariant.description}
                  </p>
                )}

                <p className="mt-4 text-sm">
                  Precio unitario:{" "}
                  <strong>
                    {unitPrice !== null
                      ? formatPrice(Number(unitPrice), currency)
                      : "Por confirmar"}
                  </strong>
                </p>

                <label className="mt-4 block text-sm font-semibold">
                  Cantidad
                </label>
<input
  type="number"
  min="1"
  step="1"
  value={quantity}
  onChange={(event) => {
    const value = event.target.value;
    setQuantity(value === "" ? "" : Number.parseInt(value, 10));
  }}
  onBlur={() => {
    setQuantity((current) =>
      current === "" || current < 1 ? 1 : current,
    );
  }}
  className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3 text-sm"
/>

                <button
                  type="button"
                  onClick={addItem}
                  disabled={unitPrice === null}
                  className="mt-4 w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Añadir al presupuesto
                </button>

                {unitPrice === null && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Este producto no tiene un precio registrado. Debes
                    actualizar su precio en el catálogo antes de añadirlo.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <h2 className="text-xl font-bold">3. Productos del presupuesto</h2>

            {items.length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
                Todavía no has añadido productos.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        {item.variant_name && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.variant_name}
                          </p>
                        )}
                        {item.code && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Código: {item.code}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-semibold text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>

<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
  <div>
    <label className="text-xs text-muted-foreground">
      Precio unitario
    </label>
    <p className="mt-1 text-sm font-semibold">
      {formatPrice(item.price, item.currency)}
    </p>
  </div>

  <div>
    <label className="text-xs text-muted-foreground">
      Cantidad
    </label>
<input
  type="number"
  min="1"
  step="1"
  value={quantityDrafts[item.id] ?? String(item.quantity)}
  onChange={(event) =>
    setQuantityDrafts((current) => ({
      ...current,
      [item.id]: event.target.value,
    }))
  }
  onBlur={() => {
    const draft = quantityDrafts[item.id];
    const parsed = Number.parseInt(draft ?? "", 10);

    if (Number.isInteger(parsed) && parsed >= 1) {
      updateQuantity(item.id, parsed);
    }

    setQuantityDrafts((current) => {
      const next = { ...current };
      delete next[item.id];
      return next;
    });
  }}
  className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
/>
  </div>

  <div>
    <label className="text-xs text-muted-foreground">
      Importe original
    </label>
    <p className="mt-1 text-sm font-bold">
      {formatPrice(item.price * item.quantity, item.currency)}
    </p>
  </div>

  <div>
    <label className="text-xs text-muted-foreground">
      Tipo de descuento
    </label>
    <select
      value={item.discount_type}
      onChange={(event) =>
        updateItemDiscount(
          item.id,
          event.target.value as "none" | "percentage" | "fixed",
          item.discount_value,
        )
      }
      className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
    >
      <option value="none">Sin descuento</option>
      <option value="percentage">Porcentaje (%)</option>
      <option value="fixed">Importe fijo (S/)</option>
    </select>
  </div>

  {item.discount_type !== "none" && (
    <div>
      <label className="text-xs text-muted-foreground">
        {item.discount_type === "percentage"
          ? "Descuento (%)"
          : "Descuento (S/)"}
      </label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={item.discount_value}
        onChange={(event) =>
          updateItemDiscount(
            item.id,
            item.discount_type,
            Number(event.target.value) || 0,
          )
        }
        className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
      />
    </div>
  )}

  <div>
    <label className="text-xs text-muted-foreground">
      Total con descuento
    </label>
    <p className="mt-1 text-sm font-bold text-primary">
      {formatPrice(
        item.price * item.quantity -
          calculateDiscount(
            item.price * item.quantity,
            item.discount_type,
            item.discount_value,
          ),
        item.currency,
      )}
    </p>
  </div>
</div>
                  </div>
                ))}
              </div>
            )}

<div className="mt-6 rounded-lg bg-primary/5 p-5">
  <h3 className="text-lg font-bold">Resumen del presupuesto</h3>

  <div className="mt-4 space-y-3 text-sm">
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">Subtotal original</span>
      <strong>{formatPrice(subtotal)}</strong>
    </div>

    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">
        Descuentos por producto
      </span>
      <strong className="text-red-600">
        - {formatPrice(itemDiscountTotal)}
      </strong>
    </div>

    <div className="flex justify-between gap-3 border-t border-border pt-3">
      <span className="text-muted-foreground">
        Subtotal después de descuentos
      </span>
      <strong>{formatPrice(subtotalAfterItemDiscounts)}</strong>
    </div>
  </div>

  <div className="mt-5 border-t border-border pt-5">
    <h4 className="font-semibold">Descuento general</h4>

    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label className="text-xs text-muted-foreground">
          Tipo de descuento
        </label>
        <select
          value={generalDiscountType}
          onChange={(event) =>
            setGeneralDiscountType(
              event.target.value as "none" | "percentage" | "fixed",
            )
          }
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="none">Sin descuento</option>
          <option value="percentage">Porcentaje (%)</option>
          <option value="fixed">Importe fijo (S/)</option>
        </select>
      </div>

      {generalDiscountType !== "none" && (
        <div>
          <label className="text-xs text-muted-foreground">
            {generalDiscountType === "percentage"
              ? "Descuento (%)"
              : "Descuento (S/)"}
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={generalDiscountValue}
            onChange={(event) =>
              setGeneralDiscountValue(Number(event.target.value) || 0)
            }
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      )}
    </div>

    <div className="mt-3 flex justify-between gap-3 text-sm">
      <span className="text-muted-foreground">
        Importe del descuento general
      </span>
      <strong className="text-red-600">
        - {formatPrice(generalDiscountAmount)}
      </strong>
    </div>
  </div>

  <div className="mt-5 border-t border-border pt-5">
    <div className="flex justify-between gap-3">
      <span className="font-semibold">Base imponible</span>
      <strong>{formatPrice(taxableBase)}</strong>
    </div>

    <div className="mt-2 flex justify-between gap-3">
      <span className="text-muted-foreground">IGV incluido (18 %)</span>
      <strong>{formatPrice(igvAmount)}</strong>
    </div>

    <div className="mt-4 border-t border-border pt-4">
      <p className="text-sm font-semibold text-muted-foreground">
        TOTAL DEL PRESUPUESTO (IGV incluido)
      </p>
      <p className="mt-1 text-3xl font-extrabold">
        {formatPrice(total)}
      </p>
    </div>
  </div>

  <p className="mt-4 text-xs text-muted-foreground">
    Los precios incluyen IGV. El cálculo considera una tasa del 18 % para
    productos gravados. No incluye gastos de envío.
  </p>

</div>
<div className="mt-6 border-t border-border pt-6">
  <h3 className="text-lg font-bold">Observaciones y condiciones</h3>
  <div className="mt-4">

<div className="mt-4">
  <label className="block text-sm font-semibold">
    Plantillas de observaciones
  </label>

  <p className="mt-1 text-xs text-muted-foreground">
    Puedes seleccionar varias plantillas. Sus textos se combinarán en el cuadro inferior.
  </p>

  <div className="mt-3 space-y-3">
    {(
      [
        ["general", "Condiciones generales"],
        ["delivery", "Entrega"],
      ] as const
    ).map(([key, label]) => (
      <label key={key} className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={selectedObservationTemplates.includes(key)}
          onChange={(event) => {
            const nextTemplates = event.target.checked
              ? [...selectedObservationTemplates, key]
              : selectedObservationTemplates.filter(
                  (template) => template !== key,
                );

            setSelectedObservationTemplates(nextTemplates);

setObservations(
  nextTemplates
    .map((template) => {
      const titles = {
        general: "CONDICIONES GENERALES",
        delivery: "ENTREGA",
      };

      return `${titles[template]}\n${observationTemplates[template]}`;
    })
    .filter(Boolean)
    .join("\n\n"),
);
          }}
          className="h-4 w-4 rounded"
        />
        {label}
      </label>
    ))}
  </div>
</div>
</div>

  <p className="mt-2 text-sm text-muted-foreground">
    Añade información adicional para este presupuesto.
  </p>

  <textarea
    value={observations}
    onChange={(event) => setObservations(event.target.value)}
    rows={4}
    placeholder="Ej. Presupuesto válido por 15 días. Consultar disponibilidad y condiciones de entrega..."
    className="mt-3 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
  />
</div>

<div className="mt-8 border-t border-border pt-6">
  {quoteError && (
    <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
      {quoteError}
    </p>
  )}

{savedQuoteNumber && (
  <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4">
    <p className="font-bold text-green-800">
      ¡Presupuesto guardado correctamente!
    </p>

    <p className="mt-1 text-sm text-green-700">
      Número de presupuesto: {savedQuoteNumber}
    </p>

    <button
      type="button"
      onClick={downloadSavedQuotePdf}
      disabled={!savedQuotePdfData}
      className="mt-4 rounded-lg bg-[#0E1AC6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b159f] disabled:cursor-not-allowed disabled:opacity-50"
    >
      Descargar PDF
    </button>
  </div>
)}

  <button
    type="button"
    onClick={saveQuote}
    disabled={
      savingQuote ||
      !selectedCustomerId ||
      !sellerName.trim() ||
      items.length === 0
    }
    className="w-full rounded-lg bg-primary px-5 py-4 font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {savingQuote ? "Guardando presupuesto..." : "Guardar presupuesto"}
  </button>



  <p className="mt-3 text-center text-xs text-muted-foreground">
    El presupuesto se guardará con su numeración automática y los precios actuales.
  </p>
</div>
          </div>
        </div>
      </div>
    </main>
  );
}
