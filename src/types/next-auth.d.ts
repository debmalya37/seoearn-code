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
    }
    interface Session {
        accessToken?: string;
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
            messages?: [];
            
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
    }
}
