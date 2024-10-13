import React, { useState, useMemo } from "react";
import type { CollectionEntry } from "astro:content";
import { getResourceUnit } from "~/lib/utils";

type Props = {
  baasProviders: Array<CollectionEntry<"baasProvider">>;
};

type Scenario = {
  name: string;
  description: string;
  mau: number;
  "DB storage": number;
  "DB bandwidth": number;
  "File storage": number;
  "File bandwidth": number;
  "Function invocations": number;
};

const scenarios: Scenario[] = [
  {
    name: "Hobby/Starter",
    description: "For small projects or MVPs",
    mau: 200,
    "DB storage": 0.5,
    "DB bandwidth": 1,
    "File storage": 1,
    "File bandwidth": 1,
    "Function invocations": 1000000,
  },
  {
    name: "Mid-tier",
    description: "For growing applications with moderate usage",
    mau: 10000,
    "DB storage": 10,
    "DB bandwidth": 100,
    "File storage": 50,
    "File bandwidth": 100,
    "Function invocations": 10000000,
  },
  {
    name: "High-tier",
    description: "For large-scale applications with high demand",
    mau: 100000,
    "DB storage": 100,
    "DB bandwidth": 1000,
    "File storage": 500,
    "File bandwidth": 1000,
    "Function invocations": 100000000,
  },
];

const formatPrice = (price: number = 0) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 1,
    maximumSignificantDigits: 1,
  }).format(price);
};

const PricingCalculator: React.FC<Props> = ({ baasProviders }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(
    scenarios[0],
  );

  const calculatePrice = (
    provider: CollectionEntry<"baasProvider">,
    scenario: Scenario,
  ) => {
    const pricing = provider.data.pricing;
    if (!pricing) return null;

    let totalPrice = 0;
    const freeTierLimits = pricing.freeTierLimits || {};
    const pricedTier = pricing.pricedTier || {};
    const overagePricing = pricing.overagePricing || {};

    let isPricedTierApplied = false;

    const calculateResourcePrice = (key: keyof Scenario, usage: number) => {
      let remainingUsage = usage;
      let resourcePrice = 0;

      // Consume free tier
      const freeTierLimit = freeTierLimits[key as keyof typeof freeTierLimits];
      const freeTierValue =
        typeof freeTierLimit === "string" &&
        freeTierLimit.toLowerCase() === "unlimited"
          ? Infinity
          : (freeTierLimit as number) || 0;

      remainingUsage = Math.max(0, remainingUsage - freeTierValue);

      // Consume priced tier
      if (remainingUsage > 0 && pricedTier[key as keyof typeof pricedTier]) {
        if (!isPricedTierApplied) {
          resourcePrice += pricedTier.Price || 0;
          isPricedTierApplied = true;
        }
        const pricedTierLimit = pricedTier[key as keyof typeof pricedTier];
        const pricedTierValue =
          typeof pricedTierLimit === "string" &&
          pricedTierLimit.toLowerCase() === "unlimited"
            ? Infinity
            : (pricedTierLimit as number) || 0;
        remainingUsage = Math.max(0, remainingUsage - pricedTierValue);
      }

      // Apply overage pricing
      if (
        remainingUsage > 0 &&
        overagePricing[key as keyof typeof overagePricing]
      ) {
        const overagePrice = overagePricing[key as keyof typeof overagePricing];
        const overagePriceValue =
          typeof overagePrice === "string" &&
          overagePrice.toLowerCase() === "unlimited"
            ? Infinity
            : (overagePrice as number) || 0;
        resourcePrice += remainingUsage * overagePriceValue;
      }

      return resourcePrice;
    };

    totalPrice += calculateResourcePrice("DB storage", scenario["DB storage"]);
    totalPrice += calculateResourcePrice(
      "DB bandwidth",
      scenario["DB bandwidth"],
    );
    totalPrice += calculateResourcePrice(
      "File storage",
      scenario["File storage"],
    );
    totalPrice += calculateResourcePrice(
      "File bandwidth",
      scenario["File bandwidth"],
    );
    totalPrice += calculateResourcePrice(
      "Function invocations",
      scenario["Function invocations"],
    );

    return totalPrice;
  };

  const providerPrices = useMemo(() => {
    return baasProviders.map((provider) => ({
      name: provider.data.name,
      price: calculatePrice(provider, selectedScenario),
    }));
  }, [baasProviders, selectedScenario]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold">BaaS Pricing Calculator</h2>
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold">Select a scenario:</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {scenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => setSelectedScenario(scenario)}
              className={`group block h-full transform rounded-lg border-2 p-4 shadow-md transition duration-300 hover:scale-105 ${
                selectedScenario.name === scenario.name
                  ? "border-purple-500 bg-purple-100"
                  : "border-purple-300 bg-purple-100 hover:border-purple-500"
              }`}
            >
              <h4 className="mb-2 text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-purple-600">
                {scenario.name}
              </h4>
              <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-800">
                {scenario.description}
              </p>
            </button>
          ))}
        </div>
      </div>
      <div className="block h-full rounded-lg border border-purple-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <h3 className="mb-3 text-xl font-semibold text-gray-800">
          {selectedScenario.name} Scenario
        </h3>
        <p className="mb-4 text-gray-600">{selectedScenario.description}</p>
        <ul className="space-y-2 text-gray-600">
          <li>
            <span className="font-medium">Monthly Active Users:</span>{" "}
            {selectedScenario.mau.toLocaleString()}
          </li>
          <li>
            <span className="font-medium">Database Storage:</span>{" "}
            {selectedScenario["DB storage"]} {getResourceUnit("DB storage")}
          </li>
          <li>
            <span className="font-medium">Database Bandwidth:</span>{" "}
            {selectedScenario["DB bandwidth"]} {getResourceUnit("DB bandwidth")}
          </li>
          <li>
            <span className="font-medium">File Storage:</span>{" "}
            {selectedScenario["File storage"]} {getResourceUnit("File storage")}
          </li>
          <li>
            <span className="font-medium">File Bandwidth:</span>{" "}
            {selectedScenario["File bandwidth"]}{" "}
            {getResourceUnit("File bandwidth")}
          </li>
          <li>
            <span className="font-medium">Function Invocations:</span>{" "}
            {selectedScenario["Function invocations"].toLocaleString()}
          </li>
        </ul>
      </div>
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold">
          Estimated Prices per Provider
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {providerPrices.map(({ name, price }) => (
            <div
              key={name}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <h4 className="mb-2 text-lg font-semibold">{name}</h4>
              <p className="text-2xl font-bold text-purple-600">
                {formatPrice(price || 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
