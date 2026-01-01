import { TokenService } from '@/lib/token-service';
import { CreateTokenRequest } from '@/types/token';

// Mock Redis
jest.mock('@/lib/redis', () => ({
  getRedisClient: jest.fn().mockResolvedValue({
    set: jest.fn().mockResolvedValue('OK'),
    sAdd: jest.fn().mockResolvedValue(1),
    sMembers: jest.fn().mockResolvedValue([]),
    get: jest.fn().mockResolvedValue(null),
    sRem: jest.fn().mockResolvedValue(1),
  }),
}));

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = new TokenService();
  });

  describe('createToken', () => {
    it('should create a token with correct structure', async () => {
      const request: CreateTokenRequest = {
        userId: '123',
        scopes: ['read', 'write'],
        expiresInMinutes: 60,
      };

      const token = await tokenService.createToken(request);

      expect(token.userId).toBe('123');
      expect(token.scopes).toEqual(['read', 'write']);
      expect(token.id).toMatch(/^token_[a-f0-9]{16}$/);
      expect(token.token).toMatch(/^[a-f0-9]{64}$/);
      expect(new Date(token.createdAt)).toBeInstanceOf(Date);
      expect(new Date(token.expiresAt)).toBeInstanceOf(Date);
    });

    it('should set correct expiration time', async () => {
      const request: CreateTokenRequest = {
        userId: '123',
        scopes: ['read'],
        expiresInMinutes: 60,
      };

      const token = await tokenService.createToken(request);

      const createdAt = new Date(token.createdAt);
      const expiresAt = new Date(token.expiresAt);
      const diffInMinutes = (expiresAt.getTime() - createdAt.getTime()) / (1000 * 60);

      expect(diffInMinutes).toBe(60);
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired tokens', () => {
      const pastDate = new Date(Date.now() - 1000).toISOString();
      expect(tokenService.isTokenExpired(pastDate)).toBe(true);
    });

    it('should return false for non-expired tokens', () => {
      const futureDate = new Date(Date.now() + 60000).toISOString();
      expect(tokenService.isTokenExpired(futureDate)).toBe(false);
    });
  });
});