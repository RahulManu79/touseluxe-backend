export interface JwtPayload {
  sub: string;
  email: string;
  firebaseUid: string;
  roles: string[];
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  firebaseUid: string;
  roles: string[];
}
