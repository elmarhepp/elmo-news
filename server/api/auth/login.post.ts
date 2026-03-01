import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "Email und Passwort sind erforderlich" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Email oder Passwort falsch" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: "Email oder Passwort falsch" });
  }

  await setUserSession(event, {
    user: { id: user.id, email: user.email, name: user.name ?? undefined },
  });

  return { ok: true };
});
