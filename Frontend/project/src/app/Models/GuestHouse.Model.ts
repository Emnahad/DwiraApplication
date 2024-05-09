export interface GuestHouse {
    id: string;
    name: string;
    description: string | null;
    keywords: string[];
    availableDates: string[];
    city: string | null;
    location: string | null;
    pricePerday: number;
    nb_person: number;
    nb_room: number;
    nb_bed: number;
    nb_bed_bayby: number;
    ratingGlobal: number;
    imageUrls: string[];
}
