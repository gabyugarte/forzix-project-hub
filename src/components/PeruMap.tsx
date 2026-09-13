import peruDistributionNetwork from "@/assets/peru_distribution_network.jpg";

/** Imagen de distribución de FORZIX en todo el Perú. */
export function PeruMap() {
  return (
    <div className="rounded-lg border border-border bg-surface p-8">
      <img
        src={peruDistributionNetwork}
        alt="Red de distribución de FORZIX en todo el Perú"
        className="mx-auto h-auto w-full max-w-[500px] rounded-md object-contain"
      />
    </div>
  );
}