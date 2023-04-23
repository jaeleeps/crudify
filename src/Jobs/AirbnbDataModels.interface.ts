export interface Listing {
  id: number;
  listing_url: string;
  name: string;
  description: string;

  neighbourhood_review: string;
  picture_url: string;
  host_id: string;
  host_url: string;
  host_name: string;

  host_location: string;
  host_response_time: string;
  neighbourhood: string;
  bathrooms: number;
  beds: number;
  number_of_reviews: number;
  review_scores_rating: number;
  review_scores_accuracy: number;
  review_scores_cleanliness: number;
  review_scores_checkin: number;
  review_scores_location: number;
  review_scores_value: number;
  reviews_per_month: number;
}
