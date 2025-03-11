
import React from "react";
import { Navbar } from "@/components/Navbar";
import { useListingDetail } from "@/components/listing-detail/hooks/useListingDetail";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

// Imported components
import ListingNotFound from "@/components/listing-detail/ListingNotFound";
import ListingDetailContainer from "@/components/listing-detail/ListingDetailContainer";
import LoadingSkeleton from "@/components/listing-detail/LoadingSkeleton";

const ListingDetail = () => {
  const {
    listing,
    processedImages,
    listings,
    isLoading,
    averageRating,
    listingReviews,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    guestCount,
    setGuestCount,
    handleReservation,
    isFavorite,
    toggleFavorite,
    primaryColor,
    reviewText,
    setReviewText,
    reviewRating,
    setReviewRating,
    isAuthenticated,
    handleSubmitReview,
    formatPriceFCFA,
  } = useListingDetail();

  // Gérer le cas où les données sont encore en chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // Gérer le cas où l'annonce n'a pas été trouvée
  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ListingNotFound />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollAnimation direction="up" duration={0.7} once={true}>
        <ListingDetailContainer
          listing={listing}
          processedImages={processedImages}
          listings={listings}
          averageRating={averageRating}
          listingReviews={listingReviews}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          guestCount={guestCount}
          setGuestCount={setGuestCount}
          handleReservation={handleReservation}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          primaryColor={primaryColor}
          reviewText={reviewText}
          setReviewText={setReviewText}
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
          isAuthenticated={isAuthenticated}
          handleSubmitReview={handleSubmitReview}
          formatPriceFCFA={formatPriceFCFA}
        />
      </ScrollAnimation>
    </div>
  );
};

export default ListingDetail;
