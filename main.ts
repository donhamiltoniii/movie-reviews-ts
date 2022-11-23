import { PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from "express";
import { engine } from "express-handlebars";
import path from "path";

const port = 3000;

const prisma: PrismaClient = new PrismaClient();
const app: Express = express();

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "")));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src", "views"));

async function getUsers() {
  return await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
}

app.get("/", async (_req: Request, res: Response) => {
  const users = await getUsers();
  await prisma.$disconnect();
  res.render("home", { users });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
