export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT" ;

export const authRoutes = ["/login", "/register","/forget-password","/reset-password","/verify-email"]

 export const isAuthRoute = (pathname: string)=>{
    return authRoutes.some((router:string)=>router===pathname);
 }

 export type RouteConfig = {
    exact : string[],
    pattern : RegExp[]
 }

 export const commonProtectedRoute : RouteConfig = {
    exact: ["/my-profile", "/change-password"],
    pattern : []
 }
 
 export const doctorProtectedRoute : RouteConfig = {
    pattern : [/^\/doctor\/dashboard/],
    exact : []
 }
 export const adminProtectedRoute : RouteConfig = {
    pattern : [/^\/admin\/dashboard/],
    exact : []
 }
//  export const superAdminProtectedRoute : RouteConfig = {
//     pattern : [/^\/admin\/dashboard/],
//     exact : []
//  }
 export const patientProtectedRoute : RouteConfig = {
    pattern : [/^\/dashboard/],
    exact : ["/payment/success"]
 }



 export const isRouteMatched = (pathname : string , routes : RouteConfig) =>{
    if(routes.exact.includes(pathname)){
        return true
    }

    return routes.pattern.some((pattern : RegExp)=>pattern.test(pathname))
 }


 export const getRouteOwner = (pathname : string) : "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null =>{
    if(isRouteMatched(pathname , doctorProtectedRoute )){
        return "DOCTOR"
    }
    // if(isRouteMatched(pathname , superAdminProtectedRoute )){
    //     return "SUPER_ADMIN"
    // }
    if(isRouteMatched(pathname , adminProtectedRoute )){
        return "ADMIN"
    }
    if(isRouteMatched(pathname , patientProtectedRoute )){
        return "PATIENT"
    }
    if(isRouteMatched(pathname , commonProtectedRoute )){
        return "COMMON"
    }
    return null ; 
 }



 export const getDefaultDashboardRoute = (role :UserRole) =>{
    if(role === "ADMIN" || role === "SUPER_ADMIN"){
        return "/admin/dashboard"
    }
    if(role === "DOCTOR" ){
        return "/doctor/dashboard"
    }
    if(role === "PATIENT" ){
        return "/dashboard"
    }
    return "/"
 }