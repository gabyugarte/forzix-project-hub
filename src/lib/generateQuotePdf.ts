import jsPDF from "jspdf";

export interface QuotePdfData {
  quoteNumber: string;
  issueDate: string;
  sellerName: string;

  company: {
    trade_name: string;
    legal_name: string;
    ruc: string;
    fiscal_address: string;
    phone: string;
    logo_url: string;
  };

  customer: {
    name: string;
    document_number: string;
    phone: string;
    email: string;
    city: string;
    address: string;
  };

  items: {
    code: string;
    name: string;
    variant_name: string;
    quantity: number;
    price: number;
    currency: string;
    discount_amount: number;
    line_total: number;
  }[];

  subtotal: number;
  itemDiscountTotal: number;
  generalDiscountAmount: number;
  taxableBase: number;
  igvAmount: number;
  total: number;
  observations: string;
}

export async function generateQuotePdf(data: QuotePdfData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

 // ENCABEZADO DE FORZIX

// Logotipo
if (data.company.logo_url) {
  try {
    const response = await fetch(data.company.logo_url);

    if (!response.ok) {
      throw new Error("No se pudo cargar el logotipo.");
    }

    const logoBlob = await response.blob();

    const logoDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;

      reader.readAsDataURL(logoBlob);
    });

    doc.addImage(logoDataUrl, "PNG", 15, 10, 22, 22);
  } catch (error) {
    console.error("Error cargando el logotipo de FORZIX:", error);
  }
}

// Nombre comercial
doc.setFont("helvetica", "bold");
doc.setFontSize(17);
doc.text(data.company.trade_name || "FORZIX", 55, 19);

// Datos de la empresa
let companyY = 33;

doc.setFont("helvetica", "normal");
doc.setFontSize(8);

if (data.company.legal_name) {
  doc.text(`Razón social: ${data.company.legal_name}`, 55, companyY);
  companyY += 5;
}

if (data.company.ruc) {
  doc.text(`RUC: ${data.company.ruc}`, 55, companyY);
  companyY += 5;
}

if (data.company.fiscal_address) {
  const addressLines = doc.splitTextToSize(
    `Domicilio fiscal: ${data.company.fiscal_address}`,
    85,
  );

  doc.text(addressLines, 55, companyY);
  companyY += addressLines.length * 4;
}

if (data.company.phone) {
  doc.text(`Teléfono: ${data.company.phone}`, 55, companyY);
}

// Datos del presupuesto
doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.text("PRESUPUESTO", 195, 18, { align: "right" });

doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.text(`N.º: ${data.quoteNumber}`, 195, 25, { align: "right" });
doc.text(`Fecha: ${data.issueDate}`, 195, 32, { align: "right" });

const issueDate = new Date(`${data.issueDate}T00:00:00`);
const expirationDate = new Date(issueDate);

expirationDate.setDate(expirationDate.getDate() + 15);

const formattedExpirationDate = expirationDate.toLocaleDateString("es-PE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

doc.text(`Válido hasta: ${formattedExpirationDate}`, 195, 39, {
  align: "right",
});
 // Datos del cliente
doc.setFont("helvetica", "bold");
doc.setFontSize(11);
doc.text("DATOS DEL CLIENTE", 20, 65);

doc.setFont("helvetica", "normal");
doc.setFontSize(9);

let customerY = 72;

doc.text(`Cliente: ${data.customer.name}`, 20, customerY);
customerY += 5;

if (data.customer.document_number) {
  doc.text(`Documento: ${data.customer.document_number}`, 20, customerY);
  customerY += 5;
}

if (data.customer.phone) {
  doc.text(`Teléfono: ${data.customer.phone}`, 20, customerY);
  customerY += 5;
}

if (data.customer.email) {
  doc.text(`Correo: ${data.customer.email}`, 20, customerY);
  customerY += 5;
}

if (data.customer.city) {
  doc.text(`Ciudad: ${data.customer.city}`, 20, customerY);
  customerY += 5;
}

if (data.customer.address) {
  doc.text(`Dirección: ${data.customer.address}`, 20, customerY);
  customerY += 5;
}

doc.text(`Vendedor: ${data.sellerName}`, 20, customerY);
// Tabla de productos
let tableY = Math.max(customerY + 15, 105);

function drawTableHeader() {
  doc.setFillColor(14, 26, 198);
  doc.rect(15, tableY, 180, 9, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text("CÓDIGO", 18, tableY + 6);
  doc.text("PRODUCTO", 42, tableY + 6);
  doc.text("CANT.", 112, tableY + 6);
  doc.text("P. UNIT.", 128, tableY + 6);
  doc.text("DTO.", 151, tableY + 6);
  doc.text("TOTAL", 174, tableY + 6);

  tableY += 9;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
}

drawTableHeader();

data.items.forEach((item) => {
  const productLines = doc.splitTextToSize(
    `${item.name}${item.variant_name ? ` - ${item.variant_name}` : ""}`,
    65,
  );

  const rowHeight = Math.max(10, productLines.length * 4 + 4);

if (tableY + rowHeight > 275) {
  doc.addPage();
  tableY = 20;
  drawTableHeader();
}

  doc.setFontSize(8);

  doc.text(item.code || "-", 18, tableY + 6);
  doc.text(productLines, 42, tableY + 5);

  doc.text(String(item.quantity), 114, tableY + 6);

  doc.text(
    `${item.currency} ${item.price.toFixed(2)}`,
    128,
    tableY + 6,
  );

  doc.text(
    item.discount_amount > 0
      ? `${item.currency} ${item.discount_amount.toFixed(2)}`
      : "-",
    151,
    tableY + 6,
  );

  doc.text(
    `${item.currency} ${item.line_total.toFixed(2)}`,
    174,
    tableY + 6,
  );

  doc.setDrawColor(220, 220, 220);
  doc.line(15, tableY + rowHeight, 195, tableY + rowHeight);

  tableY += rowHeight;
});


// RESUMEN ECONÓMICO

// Comprobar espacio disponible
if (tableY + 75 > 275) {
  doc.addPage();
  tableY = 25;
} else {
  tableY += 10;
}

doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.text("RESUMEN DEL PRESUPUESTO", 115, tableY);

tableY += 9;

doc.setFont("helvetica", "normal");
doc.setFontSize(9);

doc.text("Subtotal:", 120, tableY);
doc.text(`S/ ${data.subtotal.toFixed(2)}`, 190, tableY, {
  align: "right",
});

tableY += 6;

doc.text("Descuentos por productos:", 120, tableY);
doc.text(`- S/ ${data.itemDiscountTotal.toFixed(2)}`, 190, tableY, {
  align: "right",
});

tableY += 6;

doc.text("Descuento general:", 120, tableY);
doc.text(`- S/ ${data.generalDiscountAmount.toFixed(2)}`, 190, tableY, {
  align: "right",
});

tableY += 6;

doc.text("Base imponible:", 120, tableY);
doc.text(`S/ ${data.taxableBase.toFixed(2)}`, 190, tableY, {
  align: "right",
});

tableY += 6;

doc.text("IGV (18% incluido):", 120, tableY);
doc.text(`S/ ${data.igvAmount.toFixed(2)}`, 190, tableY, {
  align: "right",
});

tableY += 9;

doc.setFillColor(14, 26, 198);
doc.roundedRect(115, tableY - 5, 80, 12, 2, 2, "F");

doc.setTextColor(255, 255, 255);
doc.setFont("helvetica", "bold");
doc.setFontSize(11);

doc.text("TOTAL:", 120, tableY + 3);
doc.text(`S/ ${data.total.toFixed(2)}`, 190, tableY + 3, {
  align: "right",
});

doc.setTextColor(0, 0, 0);

// OBSERVACIONES
if (data.observations) {
  const observationLines = doc.splitTextToSize(data.observations, 170);

  const observationHeight = 10 + 7 + observationLines.length * 4;
  const commercialConditionsHeight = 24;

  if (tableY + observationHeight + commercialConditionsHeight > 275) {
    doc.addPage();
    tableY = 25;
  } else {
    tableY += 10;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("OBSERVACIONES", 20, tableY);

  tableY += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(observationLines, 20, tableY);

  tableY += observationLines.length * 4;
}

// CONDICIONES COMERCIALES
tableY += 12;

if (tableY > 270) {
  doc.addPage();
  tableY = 25;
}

doc.setFont("helvetica", "bold");
doc.setFontSize(9);
doc.text("CONDICIONES COMERCIALES", 20, tableY);

tableY += 6;

doc.setFont("helvetica", "normal");
doc.setFontSize(8);

doc.text(
  "Presupuesto válido durante 15 días desde su fecha de emisión.",
  20,
  tableY,
);
// Numeración de páginas
const pageCount = doc.getNumberOfPages();

for (let i = 1; i <= pageCount; i++) {
  doc.setPage(i);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);

  doc.text(
    `FORZIX | Presupuesto ${data.quoteNumber} | Página ${i} de ${pageCount}`,
    105,
    287,
    { align: "center" },
  );
}
  doc.save(`Presupuesto-${data.quoteNumber}.pdf`);
}