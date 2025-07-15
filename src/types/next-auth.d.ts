import 'next-auth'
import { boolean, string } from 'zod';


declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
        messages?: [];
        accessToken?: string;
        ratings?: number[];
        averageRating?: number;
  
    }
    interface Session {
        accessToken?: string;
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
            messages?: [];
            ratings?: number[];             // ✅ changed from number to number[]
    averageRating?: number;  
            
        } & DefaultSession['user']
    }
}


declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
        messages?: [];        
        accessToken?: string;
        ratings?: number[];             // ✅ changed from number to number[]
    averageRating?: number;  
    }
}
