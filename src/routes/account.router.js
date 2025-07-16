const express = require("express");
const AccountController = require("../controllers/account.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const accountRouter = express.Router();

accountRouter.get("/all-accounts", authenticate, AccountController.getAllAccounts);
accountRouter.post("/create", authenticate, AccountController.createAccount);
accountRouter.get("/:accountId", authenticate, AccountController.getAccount);
accountRouter.put("/:accountId", authenticate, AccountController.editAccount);
accountRouter.get("/type", authenticate, AccountController.getAcountByType);
accountRouter.get("/name", authenticate, AccountController.getAccountByName);

module.exports = accountRouter;
