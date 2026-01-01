import { randomBytes } from 'crypto';
import { getRedisClient } from './redis';
import { Token, CreateTokenRequest } from '@/types/token';

const TOKEN_KEY_PREFIX = 'token:';
const USER_TOKENS_KEY_PREFIX = 'user_tokens:';

export class TokenService {
  private generateTokenId(): string {
    return `token_${randomBytes(8).toString('hex')}`;
  }

  private generateTokenString(): string {
    return randomBytes(32).toString('hex');
  }

  private getTokenKey(tokenId: string): string {
    return `${TOKEN_KEY_PREFIX}${tokenId}`;
  }

  private getUserTokensKey(userId: string): string {
    return `${USER_TOKENS_KEY_PREFIX}${userId}`;
  }

  async createToken(request: CreateTokenRequest): Promise<Token> {
    const redis = await getRedisClient();
    
    const tokenId = this.generateTokenId();
    const tokenString = this.generateTokenString();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + request.expiresInMinutes * 60 * 1000);

    const token: Token = {
      id: tokenId,
      userId: request.userId,
      scopes: request.scopes,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      token: tokenString,
    };

    const tokenKey = this.getTokenKey(tokenId);
    const userTokensKey = this.getUserTokensKey(request.userId);

    // Store token data
    await redis.set(tokenKey, JSON.stringify(token), {
      EXAT: Math.floor(expiresAt.getTime() / 1000),
    });

    // Add token ID to user's token set
    await redis.sAdd(userTokensKey, tokenId);

    return token;
  }

  async listNonExpiredTokens(userId: string): Promise<Token[]> {
    const redis = await getRedisClient();
    const userTokensKey = this.getUserTokensKey(userId);

    // Get all token IDs for the user
    const tokenIds = await redis.sMembers(userTokensKey);

    if (tokenIds.length === 0) {
      return [];
    }

    const tokens: Token[] = [];
    const now = new Date();

    for (const tokenId of tokenIds) {
      const tokenKey = this.getTokenKey(tokenId);
      const tokenData = await redis.get(tokenKey);

      if (tokenData) {
        const token: Token = JSON.parse(tokenData);
        const expiresAt = new Date(token.expiresAt);

        if (expiresAt > now) {
          tokens.push(token);
        }
      } else {
        // Token expired and was removed by Redis, clean up the set
        await redis.sRem(userTokensKey, tokenId);
      }
    }

    return tokens;
  }

  isTokenExpired(expiresAt: string): boolean {
    return new Date(expiresAt) <= new Date();
  }
}

export const tokenService = new TokenService();