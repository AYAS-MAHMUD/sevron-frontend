
import jwt , { JwtPayload, SignOptions} from "jsonwebtoken"





// For verify Token

export const verifyToken = (token : string , secret : string) => {
    try {
        
        const decoded =  jwt.verify(token,secret) as JwtPayload
        return {
            success : true,
            data : decoded
        }
    } catch (error : any) {
        return {
            success : false,
            message : error.message,
            error

        }
    }
}


// For decode Token

export const decodeToken = (token : string) => {
    return jwt.decode(token) as JwtPayload
}

