// pages/api/users/index.ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { handleAccess } from "@/middlewares/accessMiddleware";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const session: any = req.query.session as string | undefined;
    // console.log(session?.user?.role?.permission);
    if (!handleAccess(session?.user?.role?.permission, "Role", "r")) {
      return res.status(403).json({ message: "Access denied" });
    }
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    const search = (req.query.search as string) || "";
    let where: any = {
      OR: [{ name: { contains: search } }],
    };
    const roles = await prisma.role.findMany({
      where: where,
      include: { permission: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const total = await prisma.role.findMany({
      where: where,
      include: { permission: true },
    });

    res.status(200).json({
      roles: roles,
      total: total.length,
    });
  } else if (req.method === "POST") {
    const session: any = req.query.session as string | undefined;

    if (!handleAccess(session?.user?.role?.permission, "Role", "c")) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { description, name } = req.body;
    const permissions = req.body.permission;
    const permissionss =
      permissions === undefined ? extractPermissions(req.body) : permissions;
    try {
      const role = await prisma.role.create({
        data: {
          name,
          description,
        },
        include: { permission: true },
      });
      if (role) {
        permissionss.map(async (item: any) => {
          await prisma.permission.create({
            data: {
              roleId: role.id,
              modulId: Number(item.modulId),
              access: item.access,
            },
          });
        });
      }
      res.status(200).json({
        role: role,
        message: "success",
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === "PUT") {
    const session: any = req.query.session as string | undefined;
    if (!handleAccess(session?.user?.role?.permission, "Role", "u")) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { description, name, id } = req.body;
    const permissions = req.body.permission;
    const permissionss =
      permissions === undefined ? extractPermissions(req.body) : permissions;
    try {
      const role = await prisma.role.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          description,
        },
        include: { permission: true },
      });
      if (role) {
        const datapermission = await prisma.permission.findMany({
          where: {
            roleId: Number(id),
          },
        });
        if (datapermission.length > 0) {
          await prisma.permission.deleteMany({
            where: {
              roleId: Number(id),
            },
          });
        }
        permissionss.map(async (item: any) => {
          await prisma.permission.create({
            data: {
              roleId: role.id,
              modulId: Number(item.modulId),
              access: item.access,
            },
          });
        });
      }
      res.status(200).json({
        role: role,
        message: "success",
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === "DELETE") {
    const session: any = req.query.session as string | undefined;
    if (!handleAccess(session?.user?.role?.permission, "Role", "d")) {
      return res.status(403).json({ message: "Access denied" });
    }
    const { id } = req.query;
    try {
      const datapermission = await prisma.permission.findMany({
        where: {
          roleId: Number(id),
        },
      });
      if (datapermission.length > 0) {
        await prisma.permission.deleteMany({
          where: {
            roleId: Number(id),
          },
        });
      }

      const role = await prisma.role.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(200).json({
        role: role,
        message: "success",
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
// Function to extract permissions from the input data
const extractPermissions = (inputData: any) => {
  const permissions: any = [];

  // Iterate over the keys of the object
  for (const key in inputData) {
    // Check if the key matches the pattern for permissions
    const match = key.match(/^permission\[(\d+)\]\[modulId\]$/);

    if (match) {
      // Extract the index from the matched key
      const index = match[1];

      // Get modulId and access values based on the index
      const modulIds = inputData[`permission[${index}][modulId]`];
      const accesses = inputData[`permission[${index}][access]`];

      // Iterate over the modulIds to create individual permissions
      if (Array.isArray(modulIds)) {
        modulIds.forEach((modulId: any, i: any) => {
          permissions.push({ modulId, access: accesses[i] });
        });
      } else {
        permissions.push({ modulId: modulIds, access: accesses });
      }
    }
  }

  return permissions;
};

export default authMiddleware(handler); // Gunakan middleware di sini
