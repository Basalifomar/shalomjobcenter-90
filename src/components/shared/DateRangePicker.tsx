
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/language";
import { format } from "date-fns";

interface DateRangePickerProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  className?: string;
}

const DateRangePicker = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  className = "",
}: DateRangePickerProps) => {
  const { t } = useLanguage();
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  // Fonction sécurisée pour formater les dates
  const formatDateSafely = (dateString: string) => {
    try {
      if (!dateString) return "";
      // Vérifier si la date est déjà au format YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Gestion des erreurs pour les dates invalides
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newDate = e.target.value;
      setStartDate(newDate);
      
      // Si la date de fin est antérieure à la nouvelle date de début, mettre à jour la date de fin
      if (endDate && new Date(endDate) < new Date(newDate)) {
        setEndDate(newDate);
      }
    } catch (error) {
      console.error("Error changing start date:", error);
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="grid grid-cols-2 divide-x">
        <div className="p-3">
          <label className="block text-xs text-gray-500 mb-1">{t('ARRIVAL') || 'ARRIVÉE'}</label>
          <input
            type="date"
            className="w-full focus:outline-none text-sm pointer-events-auto"
            value={startDate}
            onChange={handleStartDateChange}
            min={today}
          />
        </div>
        <div className="p-3">
          <label className="block text-xs text-gray-500 mb-1">{t('DEPARTURE') || 'DÉPART'}</label>
          <input
            type="date"
            className="w-full focus:outline-none text-sm pointer-events-auto"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || today}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
