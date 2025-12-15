import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FirebaseAuthDto {
  @ApiProperty({ description: 'Firebase ID token from client' })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
