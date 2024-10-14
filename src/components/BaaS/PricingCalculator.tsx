import React, { useState, useMemo } from "react";
import type { CollectionEntry } from "astro:content";
import { getResourceUnit } from "~/lib/utils";
import { cn } from "~/lib/cn";

type Props = {
  baasProviders: Array<CollectionEntry<"baasProvider">>;
};

type Scenario = {
  name: string;
  description: string;
  "Auth users": number;
  "DB storage": number;
  "DB bandwidth": number;
  "File storage": number;
  "File bandwidth": number;
  "Function calls": number;
};

const defaultScenarios: Scenario[] = [
  {
    name: "Hobby/Starter",
    description: "For very small projects or prototypes",
    "Auth users": 500,
    "DB storage": 0.5,
    "DB bandwidth": 1,
    "File storage": 1,
    "File bandwidth": 1,
    "Function calls": 50000,
  },
  {
    name: "Small Business",
    description: "For small businesses or growing projects",
    "Auth users": 10000,
    "DB storage": 5,
    "DB bandwidth": 25,
    "File storage": 10,
    "File bandwidth": 50,
    "Function calls": 500000,
  },
  {
    name: "Mid-tier",
    description: "For growing applications with moderate to high usage",
    "Auth users": 150000,
    "DB storage": 100,
    "DB bandwidth": 500,
    "File storage": 250,
    "File bandwidth": 1000,
    "Function calls": 5000000,
  },
  {
    name: "High-tier",
    description: "For large-scale applications with high demand",
    "Auth users": 500000,
    "DB storage": 500,
    "DB bandwidth": 2000,
    "File storage": 1000,
    "File bandwidth": 5000,
    "Function calls": 50000000,
  },
];

const maxValues: Record<keyof Omit<Scenario, "name" | "description">, number> =
  {
    "Auth users": 1000000, // 1 million
    "DB storage": 1000, // 1TB
    "DB bandwidth": 5000, // 5TB
    "File storage": 2000, // 2TB
    "File bandwidth": 10000, // 10TB
    "Function calls": 100000000, // 100 million
  };

const unitRate: Record<keyof Omit<Scenario, "name" | "description">, number> = {
  "Auth users": 1,
  "DB storage": 1,
  "DB bandwidth": 1,
  "File storage": 1,
  "File bandwidth": 1,
  "Function calls": 1_000_000,
};

const formatPrice = (price: number) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    maximumSignificantDigits: 2,
  }).format(price);
};

const calculatePrice = (
  provider: CollectionEntry<"baasProvider">,
  scenario: Scenario,
) => {
  const pricing = provider.data.pricing;
  if (!pricing) return null;

  let totalPrice = 0;
  const freeTierLimits = pricing.freeTierLimits;
  const pricedTier = pricing.pricedTier;
  const overagePricing = pricing.overagePricing;
  let hasPricedTier = false;
  const breakdown: Record<string, number> = {};

  // Calculate price for each resource
  Object.keys(scenario).forEach((key) => {
    if (key === "name" || key === "description") return;

    const resourceKey = key as keyof Omit<Scenario, "name" | "description">;
    const usage = scenario[resourceKey] as number;
    const freeLimit = freeTierLimits && freeTierLimits[resourceKey];
    const pricedLimit = pricedTier[resourceKey];
    const overageRate = overagePricing[resourceKey];
    const overageEvery = unitRate[resourceKey];

    // Skip if any value is "unlimited"
    if (
      freeLimit === "unlimited" ||
      pricedLimit === "unlimited" ||
      overageRate === "unlimited"
    ) {
      return;
    }

    let billableUsage = 0;
    if (usage > (freeLimit || 0)) {
      if (!hasPricedTier && pricedTier.Price) {
        // Subscribe to priced tier if not already subscribed
        totalPrice += pricedTier.Price;
        breakdown["Subscription"] = pricedTier.Price;
        hasPricedTier = true;
      }

      if (hasPricedTier && usage > (pricedLimit || 0)) {
        billableUsage = usage - (pricedLimit || 0);
      } else if (!hasPricedTier) {
        billableUsage = usage - (freeLimit || 0);
      }
    }

    if (billableUsage > 0 && overageRate !== null) {
      const overageUnits = Math.ceil(billableUsage / overageEvery);
      const overagePrice = overageUnits * overageRate;
      totalPrice += overagePrice;
      breakdown[resourceKey] = overagePrice;
    }
  });

  return { totalPrice, breakdown };
};

const PricingCalculator: React.FC<Props> = ({ baasProviders }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(
    defaultScenarios[0],
  );
  const [customScenario, setCustomScenario] = useState<Scenario>(
    defaultScenarios[0],
  );

  const providerPrices = useMemo(() => {
    return baasProviders.map((provider) => {
      const result = calculatePrice(provider, customScenario);
      return {
        name: provider.data.name,
        price: result?.totalPrice || 0,
        breakdown: result?.breakdown || {},
        img: provider.data.logo,
      };
    });
  }, [baasProviders, customScenario]);

  const handleSliderChange = (key: keyof Scenario, value: number) => {
    setCustomScenario((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-12">
        <h3 className="mb-6 text-2xl font-semibold text-gray-800">
          Select a scenario:
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {defaultScenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => {
                setSelectedScenario(scenario);
                setCustomScenario(scenario);
              }}
              className={cn(
                "group flex h-full transform flex-col rounded-lg border-2 p-4 shadow-md transition duration-300 hover:scale-105",
                selectedScenario.name === scenario.name
                  ? "border-purple-500 bg-purple-100"
                  : "border-purple-300 bg-purple-100 hover:border-purple-500",
              )}
            >
              <h4 className="text-left text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-purple-600">
                {scenario.name}
              </h4>
              <p className="mt-4 text-left text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">
                {scenario.description}
              </p>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-grow flex-col gap-12 lg:flex-row">
        <div className="h-full w-full overflow-y-auto rounded-lg border border-purple-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md">
          <h3 className="mb-6 text-2xl font-semibold text-gray-800">
            Customize Scenario
          </h3>
          <p className="mb-8 text-gray-600">Adjust the values to your needs</p>
          <h4 className="mb-6 text-xl font-semibold text-purple-700">
            Resource Sliders
          </h4>
          <div className="flex flex-col gap-y-8">
            {Object.entries(customScenario).map(([key, value]) => {
              if (key === "name" || key === "description") return null;
              const max = maxValues[key as keyof typeof maxValues];
              return (
                <div key={key} className="mb-6">
                  <div className="mb-4 flex items-center justify-between">
                    <label
                      htmlFor={key}
                      className="text-lg font-semibold text-gray-800"
                    >
                      {key}
                    </label>
                    <div className="text-right">
                      <span className="text-xl font-bold text-purple-600">
                        {value.toLocaleString()}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        {getResourceUnit(key)}
                      </span>
                    </div>
                  </div>
                  <div className="relative pt-2">
                    <input
                      type="range"
                      id={key}
                      name={key}
                      min={0}
                      max={max}
                      value={value}
                      onChange={(e) =>
                        handleSliderChange(
                          key as keyof Scenario,
                          Number(e.target.value),
                        )
                      }
                      className={cn(
                        "h-3 w-full cursor-pointer appearance-none rounded-lg bg-purple-200 accent-purple-600",
                        "focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50",
                      )}
                    />
                    <div className="mt-3 flex justify-between text-xs text-gray-600">
                      <span>0</span>
                      <span>{max.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full space-y-6">
          {providerPrices.map(({ name, price, breakdown, img }) => (
            <div
              key={name}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={img.src}
                    alt={`${name} logo`}
                    className="h-10 w-10 object-contain"
                  />
                  <h4 className="text-xl font-semibold text-gray-800">
                    {name}
                  </h4>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatPrice(price)}/month
                </p>
              </div>
              <div>
                <h5 className="mb-3 font-semibold text-gray-700">
                  Price Breakdown:
                </h5>
                <ul className="space-y-2 text-sm">
                  {Object.entries(breakdown).map(([key, value]) => (
                    <li
                      key={key}
                      className={cn(
                        "flex items-center justify-between border-b border-gray-100 py-2",
                        "last:border-b-0",
                      )}
                    >
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium text-gray-800">
                        {formatPrice(value)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;