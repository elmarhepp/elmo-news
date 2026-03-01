import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const { email, password, name } = await readBody(event);

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "Email und Passwort sind erforderlich" });
  }
  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: "Passwort muss mindestens 6 Zeichen haben" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: "Email bereits vergeben" });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email: normalizedEmail, password: hashed, name: name?.trim() || null },
  });

  // Alle Default-Feeds automatisch aktivieren
  const defaultFeeds = await prisma.feed.findMany({ where: { isDefault: true } });
  if (defaultFeeds.length > 0) {
    await prisma.userFeed.createMany({
      data: defaultFeeds.map((f) => ({ userId: user.id, feedId: f.id, isActive: true })),
    });
  }

  // Direkt einloggen nach Registrierung
  await setUserSession(event, {
    user: { id: user.id, email: user.email, name: user.name ?? undefined },
  });

  return { message: "Konto erstellt" };
});
