export interface Token {
    id: string;
    userId: string;
    scopes: string[];
    createdAt: string;
    expiresAt: string;
    token: string;
  }
  
  export interface CreateTokenRequest {
    userId: string;
    scopes: string[];
    expiresInMinutes: number;
  }
  
  export interface CreateTokenResponse extends Token {}
  
  export interface ListTokensResponse extends Array<Token> {}