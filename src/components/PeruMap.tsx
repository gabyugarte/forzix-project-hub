import peruDistributionNetwork from "@/assets/peru_distribution_network.jpg";

/** Imagen de distribución de FORZIX en todo el Perú. */
export function PeruMap() {
  return (
    <div className="rounded-lg border border-border bg-surface p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <img
        src={peruDistributionNetwork}
        alt="Red de distribución de FORZIX en todo el Perú"
        className="mx-auto h-auto w-full max-w-[500px] rounded-md object-contain transition-transform duration-300 hover:scale-[1.02]"
      />
    </div>
  );
}