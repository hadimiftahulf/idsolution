// pages/api/users/index.ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { handleAccess } from "@/middlewares/accessMiddleware";
import argon2 from "argon2";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const session: any = req.query.session as string | undefined;
    const user = await prisma.user.findUnique({
      where: {
        id: Number(session?.user?.id),
      },
    });
    if (
      !handleAccess(session?.user?.role?.permission, "Employee", "r") &&
      !user
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    const search = req.query.search as string;
    let where: any = {
      OR: [
        { email: { contains: search } },
        { phone: { contains: search } },
        { employee: { name: { contains: search } } },
      ],
    };
    if (!handleAccess(session?.user?.role?.permission, "Employee", "r")) {
      where = {
        id: Number(session?.user?.id),
        OR: [
          { email: { contains: search } },
          { phone: { contains: search } },
          { employee: { name: { contains: search } } },
        ],
      };
    }
    const users = await prisma.user.findMany({
      where: where,
      include: { employee: true, role: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const total = await prisma.user.findMany({
      where: where,
      include: { employee: true }, // Include employee
    });

    res.status(200).json({
      users: users,
      total: total.length,
    });
  } else if (req.method === "POST") {
    const session: any = req.query.session as string | undefined;
    if (!handleAccess(session?.user?.role?.permission, "Employee", "c")) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { email, password, name, photo, phone, roleId } = req.body;

    const hashedPassword = await argon2.hash(password);
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        roleId: Number(roleId),
      },
    });
    if (user) {
      await prisma.employee.create({
        data: {
          userId: user.id,
          name,
          photo,
        },
      });
    }
    res.status(200).json({ user });
  } else if (req.method === "PUT") {
    const { email, password, name, photo, phone, roleId, id } = req.body;
    const session: any = req.query.session as string | undefined;
    if (
      !handleAccess(session?.user?.role?.permission, "Employee", "u") &&
      Number(id) !== Number(session?.user?.id)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      let hashedPassword = password;
      if (password !== user.password) {
        hashedPassword = await argon2.hash(password);
      }
      const updateUser = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          email,
          phone,
          password: hashedPassword,
          roleId: Number(roleId),
        },
      });
      const updateEmployee = await prisma.employee.update({
        where: {
          userId: Number(id),
        },
        data: {
          name,
          photo,
        },
      });

      const users = await prisma.user.findFirst({
        where: {
          id: Number(id),
        },
        include: {
          employee: true,
          role: {
            include: {
              permission: {
                include: {
                  modul: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        user: users,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    const session: any = req.query.session as string | undefined;
    if (!handleAccess(session?.user?.role?.permission, "Employee", "d")) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { id } = req.query;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const employee = await prisma.employee.delete({
        where: {
          userId: Number(id),
        },
      });
      const userDelete = await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });
      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default authMiddleware(handler); // Gunakan middleware di sini
