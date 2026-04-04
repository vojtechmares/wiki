export const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-900 text-red-300 border-red-700",
  major: "bg-orange-900 text-orange-300 border-orange-700",
  minor: "bg-yellow-900 text-yellow-300 border-yellow-700",
};

export const STATUS_COLORS: Record<string, string> = {
  draft: "bg-zinc-800 text-zinc-300 border-zinc-600",
  proposed: "bg-blue-900 text-blue-300 border-blue-700",
  accepted: "bg-green-900 text-green-300 border-green-700",
  deprecated: "bg-yellow-900 text-yellow-300 border-yellow-700",
  superseded: "bg-zinc-800 text-zinc-400 border-zinc-600",
};
