
/**
 * Calendar utility functions for creating iCal files from reservation data
 */
import { Reservation } from '@/hooks/reservations';
import { format, parseISO } from 'date-fns';

/**
 * Format a date to the iCal date format (YYYYMMDD) with error handling
 */
export const formatICalDate = (date: string): string => {
  try {
    const d = parseISO(date);
    if (isNaN(d.getTime())) {
      throw new Error("Invalid date");
    }
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  } catch (error) {
    console.error("Error formatting iCal date:", error, date);
    // Fallback to current date if there's an error
    const current = new Date();
    const year = current.getFullYear();
    const month = (current.getMonth() + 1).toString().padStart(2, '0');
    const day = current.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  }
};

/**
 * Create an iCal file content from reservation data
 */
export const createICalEvent = (reservation: Reservation): string => {
  try {
    const checkInDate = formatICalDate(reservation.checkIn);
    const checkOutDate = formatICalDate(reservation.checkOut);
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sholom//Reservation Calendar//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Séjour à ${reservation.listingTitle}
DTSTART;VALUE=DATE:${checkInDate}
DTEND;VALUE=DATE:${checkOutDate}
DESCRIPTION:Réservation #${reservation.id} pour ${reservation.guests} voyageur(s)\\nAdresse: ${reservation.listingLocation}
LOCATION:${reservation.listingLocation}
STATUS:CONFIRMED
SEQUENCE:0
DTSTAMP:${now}
UID:${reservation.id}@sholom.com
END:VEVENT
END:VCALENDAR`;
  } catch (error) {
    console.error("Error creating iCal event:", error);
    return ""; // Return empty string in case of error
  }
};

/**
 * Download an iCal file
 */
export const downloadICalFile = (reservation: Reservation): void => {
  try {
    const icalContent = createICalEvent(reservation);
    if (!icalContent) {
      throw new Error("Failed to create iCal content");
    }
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `reservation-${reservation.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading iCal file:", error);
    alert("Une erreur s'est produite lors du téléchargement du fichier iCal.");
  }
};

/**
 * Add to Google Calendar
 */
export const addToGoogleCalendar = (reservation: Reservation): void => {
  try {
    const checkIn = parseISO(reservation.checkIn);
    const checkOut = parseISO(reservation.checkOut);
    
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      throw new Error("Invalid dates");
    }
    
    // Format dates for Google Calendar
    const startDate = checkIn.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = checkOut.toISOString().replace(/-|:|\.\d+/g, '');
    
    const title = encodeURIComponent(`Séjour à ${reservation.listingTitle}`);
    const details = encodeURIComponent(`Réservation #${reservation.id} pour ${reservation.guests} voyageur(s)`);
    const location = encodeURIComponent(reservation.listingLocation);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    
    window.open(googleCalendarUrl, '_blank');
  } catch (error) {
    console.error("Error adding to Google Calendar:", error);
    alert("Une erreur s'est produite lors de l'ajout à Google Calendar.");
  }
};
