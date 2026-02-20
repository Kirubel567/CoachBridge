import bcrypt from "bcrypt";

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

export const hashPassword = async (plainPassword: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
};
