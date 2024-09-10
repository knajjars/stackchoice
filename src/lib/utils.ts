export const formatValue = (value: any, isPrice: boolean = false) => {
  if (value === null || typeof value === "undefined") return "-";
  if (value === "unlimited") return "Unlimited";
  if (isPrice)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    }).format(value);
  if (typeof value === "number")
    return new Intl.NumberFormat("en-US").format(value);
  return value;
};

export const getOveragePricingUnit = (key: string) => {
  switch (key) {
    case "Team members":
      return "per member";
    case "Projects":
      return "per project";
    case "Auth users":
      return "per user";
    case "DB storage":
    case "DB bandwidth":
    case "File storage":
    case "File bandwidth":
      return "per GB";
    case "Function calls":
      return "per million";
    default:
      return "";
  }
};

export const getResourceUnit = (key: string) => {
  switch (key) {
    case "DB storage":
    case "DB bandwidth":
    case "File storage":
    case "File bandwidth":
      return "GB";
    default:
      return "";
  }
};
