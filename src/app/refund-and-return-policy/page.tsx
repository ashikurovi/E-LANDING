"use client";

import { useEffect, useState } from "react";
import { API_CONFIG } from "@/lib/api-config";
import { getRefundPolicies } from "@/lib/api-services";
import { ReturnPolicy } from "@/types/return-policy";

const RefundPolicyPage = () => {
  const [items, setItems] = useState<ReturnPolicy[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getRefundPolicies(API_CONFIG.companyId);
      setItems(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  const content = items.length ? items.map((t) => t.content).join("\n\n") : "কোনো রিফান্ড এবং রিটার্ন পলিসি পাওয়া যায়নি।";

  return (
    <main className="max-w-5xl mx-auto px-5 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">রিফান্ড এবং রিটার্ন পলিসি</h1>
      <article className="prose max-w-none whitespace-pre-line leading-relaxed text-slate-800">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </main>
  );
};

export default RefundPolicyPage;

