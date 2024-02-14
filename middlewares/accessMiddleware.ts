export const handleAccess = (
  permission: any,
  modul: string,
  access: string
) => {
  const dataAccess = permission.filter(
    (item: any) => item.modul.name === modul
  );
  if (dataAccess.length > 0) {
    if (dataAccess[0].access.split(",").includes(access)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
