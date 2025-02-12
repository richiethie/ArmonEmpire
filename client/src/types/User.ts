export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string; // Should be handled securely (e.g., never exposed in frontend)
    membership: "Free" | "Bronze" | "Silver" | "Gold"; // Enum for membership tiers
    preferredBarber: string;
    drinkOfChoice: string;
    isOfLegalDrinkingAge: boolean;
    appointments: string[]; // Array of appointment IDs (references)
    phoneNumber: string;
    dob: string; // Assuming this is stored as a string (e.g., "YYYY-MM-DD")
    wantsDrink: boolean;
    photoID?: File | null; // Optional field, cannot be preloaded
}
