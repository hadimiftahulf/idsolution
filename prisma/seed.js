const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");

const prisma = new PrismaClient();

async function seed() {
  const createRoleSuperAdmin = await prisma.role.create({
    data: {
      name: "Super Admin",
      description: "SuperAdmin",
    },
  });

  const createRoleAdminHR = await prisma.role.create({
    data: {
      name: "Admin HR",
      description: "Admin HR",
    },
  });

  const createRoleKaryawan = await prisma.role.create({
    data: {
      name: "Karyawan",
      description: "Karyawan",
    },
  });

  const createModulDashboard = await prisma.modul.create({
    data: {
      name: "Dashboard",
      description: "Dashboard",
      feature: "r",
    },
  });

  const createModulEmployee = await prisma.modul.create({
    data: {
      name: "Employee",
      description: "Employee",
      feature: "c,r,u,d",
    },
  });

  const createModulRole = await prisma.modul.create({
    data: {
      name: "Role",
      description: "Role",
      feature: "c,r,u,d",
    },
  });

  const createPermissionSuperAdminDashboard = await prisma.permission.create({
    data: {
      modulId: createModulDashboard.id,
      roleId: createRoleSuperAdmin.id,
      access: "r",
    },
  });

  const createPermissionSuperAdminEmployee = await prisma.permission.create({
    data: {
      access: "c,r,u,d",
      modulId: createModulEmployee.id,
      roleId: createRoleSuperAdmin.id,
    },
  });

  const createPermissionSuperAdminRole = await prisma.permission.create({
    data: {
      access: "c,r,u,d",
      modulId: createModulRole.id,
      roleId: createRoleSuperAdmin.id,
    },
  });

  const createPermissionAdminHRDashboard = await prisma.permission.create({
    data: {
      access: "r",
      modulId: createModulDashboard.id,
      roleId: createRoleAdminHR.id,
    },
  });

  const createPermissionAdminHREmployee = await prisma.permission.create({
    data: {
      access: "c,r,u",
      modulId: createModulEmployee.id,
      roleId: createRoleAdminHR.id,
    },
  });

  const createPermissionKaryawanDashboard = await prisma.permission.create({
    data: {
      access: "r",
      modulId: createModulDashboard.id,
      roleId: createRoleKaryawan.id,
    },
  });

  const createPermissionKaryawanEmployee = await prisma.permission.create({
    data: {
      access: "r,u",
      modulId: createModulEmployee.id,
      roleId: createRoleKaryawan.id,
    },
  });

  const hashedPasswordSuperAdmin = await argon2.hash("superadmin");
  const newUserSuperAdmin = await prisma.user.create({
    data: {
      email: "superadmin@gmail.com",
      password: hashedPasswordSuperAdmin,
      phone: "00000",
      roleId: createRoleSuperAdmin.id,
    },
  });
  if (newUserSuperAdmin) {
    await prisma.employee.create({
      data: {
        userId: newUserSuperAdmin.id,
        name: "Super Admin",
        photo: "/avatar.png",
      },
    });
  }

  const hashedPasswordAdminHr = await argon2.hash("adminhr");
  const newUserAdminHR = await prisma.user.create({
    data: {
      email: "adminhr@gmail.com",
      password: hashedPasswordAdminHr,
      phone: "11111",
      roleId: createRoleAdminHR.id,
    },
  });
  if (newUserAdminHR) {
    await prisma.employee.create({
      data: {
        userId: newUserAdminHR.id,
        name: "Admin HR",
        photo: "/avatar.png",
      },
    });
  }

  await prisma.$disconnect();
}

seed().catch((error) => {
  throw error;
});
