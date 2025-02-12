export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    membership: string; // Membership tier
    preferredBarber: string;
    drinkOfChoice: string;
}