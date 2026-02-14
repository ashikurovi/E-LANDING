"use client";

import { useEffect, useState } from "react";
import { API_CONFIG } from "../../lib/api-config";
import { getPrivacyPolicies } from "../../lib/api-services";
import { PolicyPage } from "@/types/policy";

const PrivacyPolicyPage = () => {
  const [items, setItems] = useState<PolicyPage[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getPrivacyPolicies(API_CONFIG.companyId);
      setItems(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  const content = items.length ? items.map((t) => t.content).join("\n\n") : "কোনো প্রাইভেসি পলিসি পাওয়া যায়নি।";

  return (
    <main className="max-w-5xl mx-auto px-5 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">প্রাইভেসি পলিসি</h1>
      <article className="prose max-w-none whitespace-pre-line leading-relaxed text-slate-800"><div dangerouslySetInnerHTML={{ __html: content }} /></article>
    </main >
  );
};

export default PrivacyPolicyPage;

