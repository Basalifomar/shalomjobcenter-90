
import React from 'react';
import { Reservation } from '@/hooks/reservations';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ReservationDetailsProps {
  reservation: Reservation;
}

export const ReservationDetails = ({ reservation }: ReservationDetailsProps) => {
  // Formater le prix en FCFA avec gestion des erreurs
  const formatPriceFCFA = (price: number) => {
    try {
      if (typeof price !== 'number' || isNaN(price)) {
        return "0 FCFA";
      }
      return Math.round(price * 655.957).toLocaleString('fr-FR');
    } catch (error) {
      console.error("Error formatting price:", error);
      return "0 FCFA";
    }
  };

  // Fonction sécurisée pour formater les dates
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) {
        return "Date non disponible";
      }
      
      // Vérifier si la date est déjà au format DD/MM/YYYY
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        return dateString;
      }
      
      const date = parseISO(dateString);
      
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Date invalide";
      }
      
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Date non disponible";
    }
  };

  // Récupérer en toute sécurité le prix formaté
  const priceFCFA = formatPriceFCFA(reservation.totalPrice);

  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-500">Arrivée:</span>
        </div>
        <span className="font-medium">{formatDate(reservation.checkIn)}</span>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-500">Départ:</span>
        </div>
        <span className="font-medium">{formatDate(reservation.checkOut)}</span>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-500">Voyageurs:</span>
        </div>
        <span className="font-medium">{reservation.guests || 0}</span>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-gray-500">Réservé le:</span>
        </div>
        <span className="font-medium">{formatDate(reservation.createdAt)}</span>
      </div>
      <div className="flex justify-between pt-2 border-t">
        <span className="font-semibold">Total</span>
        <span className="font-bold">{priceFCFA} FCFA</span>
      </div>
    </div>
  );
};
