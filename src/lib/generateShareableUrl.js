import { NATURE_OF_BUSINESS } from "../data/bacCodes";
import { CONSTITUTION_OPTIONS } from "../data/newTaxAct";

const BASE_URL = "https://carohitai.github.io/compliancepro/";

/**
 * Builds a shareable URL that, when opened, skips the form and shows
 * the personalised "What Changes For Me" report directly.
 *
 * Format: https://carohitai.github.io/compliancepro/?wcm=1&n=Name&nat=nature&c=constitution
 */
export function generateShareableReportUrl(clientInfo) {
  const params = new URLSearchParams();
  params.set("wcm", "1");
  if (clientInfo?.name && clientInfo.name !== "Taxpayer") {
    params.set("n", clientInfo.name);
  }
  if (clientInfo?.nature?.value) {
    params.set("nat", clientInfo.nature.value);
  }
  if (clientInfo?.constitution?.value) {
    params.set("c", clientInfo.constitution.value);
  }
  return `${BASE_URL}?${params.toString()}`;
}

/**
 * Reads URL params on page load and returns pre-populated clientInfo
 * if this is a shared report link, otherwise null.
 */
export function parseShareableReportUrl() {
  try {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("wcm") !== "1") return null;

    const natureValue      = sp.get("nat");
    const constitutionValue = sp.get("c");

    const nature = natureValue
      ? (NATURE_OF_BUSINESS.find((n) => n.value === natureValue) || null)
      : null;
    const constitution = constitutionValue
      ? (CONSTITUTION_OPTIONS.find((c) => c.value === constitutionValue) || null)
      : null;

    return {
      name:         sp.get("n") || "Taxpayer",
      nature,
      constitution,
      whatsapp:     null,
    };
  } catch {
    return null;
  }
}
