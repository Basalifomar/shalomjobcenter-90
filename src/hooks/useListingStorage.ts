
import { Listing } from "@/types/listing";
import { LOME_NEIGHBORHOODS } from '@/constants/locations';
import { normalizeListing } from '@/utils/listingUtils';
import { MOCK_LISTINGS } from "@/data/mockData";

// Fonction pour charger les listings depuis le localStorage ou utiliser les données mock par défaut
export const loadListings = (): Listing[] => {
  try {
    // Essayer de charger depuis différentes sauvegardes
    const savedListings = localStorage.getItem('listings');
    const backupListings = localStorage.getItem('listings_last_backup');
    
    if (savedListings) {
      console.log("Chargement des listings depuis localStorage");
      
      try {
        const parsedListings = JSON.parse(savedListings);
        
        // Vérification que les données sont valides
        if (!Array.isArray(parsedListings)) {
          console.error("Les données chargées ne sont pas un tableau");
          throw new Error("Les données chargées ne sont pas un tableau");
        }
        
        console.log(`Chargement des listings: ${parsedListings.length}`);
        
        // Récupérer les listings en préservant les images d'origine
        return parsedListings.map((listing: any) => {
          if (!listing || typeof listing !== 'object') {
            console.warn("Listing invalide détecté, création d'un objet vide");
            return {
              id: `fallback-${Math.random().toString(36).substring(2, 9)}`,
              title: "Listing récupéré",
              description: "",
              price: 0,
              location: "",
              images: [],
              image: ""
            };
          }
          
          console.log(`Chargement du listing ${listing.id || 'nouveau'}`);
          
          // S'assurer que chaque listing a un tableau d'images, même vide
          if (!listing.images) {
            listing.images = [];
          }
          
          // S'assurer que le listing a une image principale
          if (!listing.image && listing.images && listing.images.length > 0) {
            listing.image = listing.images[0];
          }
          
          // Création d'une copie sécurisée du listing
          return {
            ...listing,
            images: Array.isArray(listing.images) ? [...listing.images] : [],
            image: listing.image || ''
          };
        });
      } catch (parseError) {
        console.error("Erreur lors de l'analyse des listings:", parseError);
        
        // Essayer d'utiliser la sauvegarde
        if (backupListings) {
          try {
            console.log("Tentative de restauration depuis la sauvegarde");
            const parsedBackup = JSON.parse(backupListings);
            if (Array.isArray(parsedBackup)) {
              return parsedBackup;
            }
            throw new Error("Sauvegarde invalide");
          } catch (backupError) {
            console.error("Erreur avec la sauvegarde:", backupError);
          }
        }
        
        // Retomber sur les données par défaut
        return createDefaultListings();
      }
    }
    
    // Si aucune donnée n'existe, utiliser les données mock
    return createDefaultListings();
  } catch (error) {
    console.error("Erreur lors du chargement des listings:", error);
    return createDefaultListings();
  }
};

// Fonction pour créer des listings par défaut
const createDefaultListings = (): Listing[] => {
  console.log("Création de listings par défaut");
  const loméListings = MOCK_LISTINGS.map(listing => {
    // Prix adapté au marché de Lomé
    const price = Math.round((listing.price / 2) * 655.957) / 655.957;
    
    const baseListing = {
      ...listing,
      location: `${LOME_NEIGHBORHOODS[Math.floor(Math.random() * LOME_NEIGHBORHOODS.length)]}, Lomé, Togo`,
      price
    };
    
    return normalizeListing(baseListing);
  });
  
  // Sauvegarder les données mock
  try {
    localStorage.setItem('listings', JSON.stringify(loméListings));
    localStorage.setItem('listings_last_backup', JSON.stringify(loméListings));
  } catch (storageError) {
    console.error("Erreur lors de la sauvegarde des listings par défaut:", storageError);
  }
  
  return loméListings;
};

// Fonction pour sauvegarder les listings dans le localStorage
export const saveListings = (listings: Listing[]) => {
  try {
    if (!Array.isArray(listings)) {
      console.error("Tentative de sauvegarde d'un objet non-tableau");
      return false;
    }
    
    console.log(`Sauvegarde de ${listings.length} listings dans localStorage`);
    
    // Vérifier que les listings ont des images bien définies
    const verifiedListings = listings.map(listing => {
      if (!listing) {
        console.warn("Listing null détecté, ignoré");
        return null;
      }
      
      if (!listing.images) {
        console.warn(`Listing ${listing.id} sans tableau d'images, correction...`);
        listing.images = [];
      }
      
      return {
        ...listing,
        images: Array.isArray(listing.images) ? [...listing.images] : [],
        image: listing.image || (listing.images && listing.images.length > 0 ? listing.images[0] : '')
      };
    }).filter(Boolean) as Listing[];
    
    // Sauvegarder les listings
    localStorage.setItem('listings', JSON.stringify(verifiedListings));
    localStorage.setItem('listings_last_backup', JSON.stringify(verifiedListings));
    
    // Sauvegarde individuelle des images
    const timestamp = Date.now();
    verifiedListings.forEach(listing => {
      if (listing.id && listing.images && listing.images.length > 0) {
        try {
          localStorage.setItem(`listing_images_${listing.id}_${timestamp}`, JSON.stringify(listing.images));
        } catch (error) {
          console.error(`Erreur lors de la sauvegarde des images pour le listing ${listing.id}:`, error);
        }
      }
    });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des listings:", error);
    return false;
  }
};

// Fonction pour charger les réservations
export const loadReservations = () => {
  try {
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
      return JSON.parse(savedReservations);
    }
    return [];
  } catch (error) {
    console.error("Erreur lors du chargement des réservations:", error);
    return [];
  }
};

// Fonction pour sauvegarder les réservations
export const saveReservations = (reservations: any[]) => {
  try {
    if (!Array.isArray(reservations)) {
      console.error("Tentative de sauvegarde d'un objet non-tableau pour les réservations");
      return false;
    }
    
    localStorage.setItem('reservations', JSON.stringify(reservations));
    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des réservations:", error);
    return false;
  }
};
