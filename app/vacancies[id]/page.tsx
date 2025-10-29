// app/vacancies/[id]/page.tsx (yoki pages/vacancies/[id].tsx agar Pages Router bo'lsa)

"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { getAPIClient } from "@/components/types/apiClient";
import type { Vacancy } from "@/components/types/apiTypes";

const VacancyDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const apiClient = getAPIClient();
  
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVacancyDetails();
  }, [params.id]);

  const loadVacancyDetails = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getVacancy(Number(params.id));
      setVacancy(data);
    } catch (err) {
      console.error("Ошибка загрузки вакансии:", err);
      setError("Не удалось загрузить вакансию");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Вакансия не найдена"}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Назад
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {vacancy.title}
          </h1>

          {vacancy.images && (
            <img
              src={vacancy.images}
              alt={vacancy.title}
              className="w-full max-h-96 object-cover rounded-lg mb-6"
            />
          )}

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Описание
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {vacancy.description}
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-2xl font-bold text-green-600">
                {vacancy.price.toLocaleString()} сум
              </p>
            </div>

            <div className="border-t pt-4">
              <span className={`inline-block px-3 py-1 rounded text-sm ${
                vacancy.moderation === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : vacancy.moderation === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {vacancy.moderation_display || vacancy.moderation}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacancyDetailPage;