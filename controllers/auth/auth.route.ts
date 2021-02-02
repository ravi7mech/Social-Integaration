import { Router } from "express";
import * as api from "./auth.api";

const router: Router = Router();

router.get("/getOAuthRequestToken", api.getOAuthRequestToken);


router.get("/handleOAuthResponse", api.handleOAuthResponse);


router.get("/getAllAuthenicatedUsers", api.getAllAuthenicatedUsers); 


router.get("/getUserDetails/:id", api.getUserDetails); 


router.post("/updateStatus", api.updateStatus); 



export const authRoutes: Router = router;