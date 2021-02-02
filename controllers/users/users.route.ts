import { Router } from "express";
import * as api from "./users.api";


const router: Router = Router();

router.post("/", api.addUser);
router.put("/", api.updateUser);
router.get("/", api.getUsers);
router.get("/:id", api.getUser);
router.delete("/:id", api.deleteUser);



export const usersRoutes: Router = router;
