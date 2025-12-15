import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';

@Injectable()
export class AuthService {
  private firebaseApp: admin.app.App;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Initialize Firebase Admin SDK
    const serviceAccount = this.configService.get<string>(
      'FIREBASE_SERVICE_ACCOUNT',
    );

    if (serviceAccount) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
      });
    }
  }

  async authenticateWithFirebase(firebaseAuthDto: FirebaseAuthDto) {
    try {
      // Verify Firebase ID token
      const decodedToken = await admin
        .auth()
        .verifyIdToken(firebaseAuthDto.idToken);

      const { uid, email, name, picture } = decodedToken;

      if (!email) {
        throw new UnauthorizedException('Email not found in Firebase token');
      }

      // Find or create user
      let user = await this.usersService.findByFirebaseUid(uid);

      if (!user) {
        user = await this.usersService.create({
          firebaseUid: uid,
          email,
          name: name || undefined,
          avatar: picture || undefined,
          roles: ['user'],
        });
      }

      // Generate JWT token
      const payload = {
        sub: user['_id'],
        email: user.email,
        firebaseUid: user.firebaseUid,
        roles: user.roles,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        user: {
          id: user['_id'],
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          roles: user.roles,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  async validateUser(userId: string) {
    return this.usersService.findOne(userId);
  }
}
