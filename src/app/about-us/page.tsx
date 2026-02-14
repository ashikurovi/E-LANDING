"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiAward,
  FiCheckCircle,
  FiCreditCard,
  FiHeadphones,
  FiHeart,
  FiPackage,
  FiPhoneCall,
  FiRefreshCw,
  FiShield,
  FiTruck,
} from "react-icons/fi";

export default function AboutUsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary/5">
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="mx-auto w-full md:w-[900px] rounded-2xl bg-white shadow-none border border-gray-200 overflow-hidden">
          <div className="px-8 pt-8 text-center">
            <span className="text-xs font-bold tracking-widest text-white px-4 py-2 rounded-full bg-primary inline-block mb-3">
              আমাদের সম্পর্কে
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-primary">
              আমরা কারা এবং কী করি
            </h1>
            <p className="text-gray-600 mt-3">
              দ্রুত ডেলিভারি, নিরাপদ পেমেন্ট এবং সত্যিকারের পণ্যের প্রতিশ্রুতি
              নিয়ে আমরা আপনার অনলাইন কেনাকাটাকে সহজ করি।
            </p>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100">
            <div className="rounded-xl border border-gray-200 p-6">
              <div className="text-primary text-2xl mb-3">
                <FiHeart />
              </div>
              <h3 className="text-lg font-semibold">আমাদের মিশন</h3>
              <p className="text-sm text-gray-600 mt-2">
                সেরা পণ্য সুলভ মূল্যে পৌঁছে দেওয়া এবং গ্রাহকের সন্তুষ্টিকে
                সর্বোচ্চ অগ্রাধিকার দেওয়া।
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6">
              <div className="text-primary text-2xl mb-3">
                <FiAward />
              </div>
              <h3 className="text-lg font-semibold">আমাদের ভিশন</h3>
              <p className="text-sm text-gray-600 mt-2">
                দেশের শীর্ষস্থানীয় বিশ্বস্ত ই-কমার্স প্ল্যাটফর্ম হিসেবে
                প্রতিষ্ঠিত হওয়া।
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6">
              <div className="text-primary text-2xl mb-3">
                <FiShield />
              </div>
              <h3 className="text-lg font-semibold">মূল্যবোধ</h3>
              <p className="text-sm text-gray-600 mt-2">
                স্বচ্ছতা, মান, প্রতিশ্রুতি এবং গ্রাহক সহায়তা আমাদের প্রতিটি
                কাজের কেন্দ্রে।
              </p>
            </div>
          </div>
          <div className="px-8 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 text-center">
                <p className="text-3xl font-black text-primary">5+</p>
                <p className="text-sm text-gray-600">বছরের অভিজ্ঞতা</p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 text-center">
                <p className="text-3xl font-black text-primary">10k+</p>
                <p className="text-sm text-gray-600">পণ্য</p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 text-center">
                <p className="text-3xl font-black text-primary">500+</p>
                <p className="text-sm text-gray-600">পার্টনার</p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-6 text-center">
                <p className="text-3xl font-black text-primary">100k+</p>
                <p className="text-sm text-gray-600">গ্রাহক</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
                <div className="text-primary text-2xl mb-2">
                  <FiTruck />
                </div>
                <h4 className="font-semibold">দ্রুত ডেলিভারি</h4>
                <p className="text-sm text-gray-600 mt-1">
                  সারা দেশে নির্ভরযোগ্য শিপিং নেটওয়ার্ক।
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
                <div className="text-primary text-2xl mb-2">
                  <FiPackage />
                </div>
                <h4 className="font-semibold">অথেনটিক পণ্য</h4>
                <p className="text-sm text-gray-600 mt-1">
                  সোর্সড ও যাচাইকৃত ব্র্যান্ডেড আইটেম।
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
                <div className="text-primary text-2xl mb-2">
                  <FiPhoneCall />
                </div>
                <h4 className="font-semibold">সহায়তা</h4>
                <p className="text-sm text-gray-600 mt-1">
                  বন্ধুসুলভ সাপোর্ট টিম সর্বদা প্রস্তুত।
                </p>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-primary">
                  কেন আমাদের বেছে নেবেন
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-primary" /> ১০০% অথেনটিক পণ্য
                  </li>
                  <li className="flex items-center gap-2">
                    <FiTruck className="text-primary" /> দ্রুত ডেলিভারি
                  </li>
                  <li className="flex items-center gap-2">
                    <FiRefreshCw className="text-primary" /> সহজ রিটার্ন
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCreditCard className="text-primary" /> নিরাপদ পেমেন্ট
                  </li>
                  <li className="flex items-center gap-2">
                    <FiHeadphones className="text-primary" /> ২৪/৭ গ্রাহক সহায়তা
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-primary">
                  প্রায়শই জিজ্ঞাসিত প্রশ্ন
                </h3>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      q: "ডেলিভারি কতদিনে?",
                      a: "সাধারণত ১-৩ কর্মদিবসের মধ্যে পৌঁছে যায়।",
                    },
                    {
                      q: "পণ্য অরিজিনাল কি?",
                      a: "সব পণ্য যাচাইকৃত ও গ্যারান্টিযুক্ত।",
                    },
                    {
                      q: "রিটার্ন কীভাবে করবো?",
                      a: "রিটার্ন নীতিমালা অনুসারে অনুরোধ করলে নির্দেশনা দেওয়া হবে।",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-gray-200"
                    >
                      <button
                        type="button"
                        className="w-full text-left px-4 py-3 font-medium"
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      >
                        {item.q}
                      </button>
                      {openFaq === idx && (
                        <div className="px-4 pb-3 text-sm text-gray-700">
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-700">
                আপনার যেকোন প্রশ্ন বা সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করুন।
              </p>
              <div className="flex gap-3">
                <Link
                  href="/contact-us"
                  className="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90"
                >
                  যোগাযোগ করুন
                </Link>
                <a
                  href="https://wa.me/8801XXXXXXXXX"
                  target="_blank"
                  className="px-5 py-2.5 rounded-lg border border-primary text-primary hover:bg-primary/10"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
