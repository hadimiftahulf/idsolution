import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: String;
      phone: String;
      employee: { name: string; photo: string };
      roleId: number;
      role: {
        id: 1;
        name: String;
        description: String;
        permission: {
          map: any;
          access: String;
          modul: [name: String, description: String];
        };
      };
      accessToken: string;
    };
  }
}
