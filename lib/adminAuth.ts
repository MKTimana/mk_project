import { cookies } from "next/headers";

type AdminRole = "admin" | "editor";

export type AdminUser = {
  email: string;
  role: AdminRole;
};

type AdminCredential = AdminUser & {
  password: string;
};

const fallbackUsers: AdminCredential[] = [
  {
    email: "admin@mktech.co.mz",
    password: "mkTECH0103",
    role: "admin"
  }
];

const SESSION_COOKIE = "mktech_admin";

function getAdminUsers() {
  if (!process.env.ADMIN_USERS) {
    return fallbackUsers;
  }

  try {
    const users = JSON.parse(process.env.ADMIN_USERS) as AdminCredential[];
    return users.length ? users : fallbackUsers;
  } catch {
    return fallbackUsers;
  }
}

function encodeSession(user: AdminUser) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

function decodeSession(value?: string) {
  if (!value) {
    return null;
  }

  try {
    const user = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as AdminUser;

    if (!user.email || (user.role !== "admin" && user.role !== "editor")) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export function validateAdminLogin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getAdminUsers().find(
    (adminUser) => adminUser.email.trim().toLowerCase() === normalizedEmail && adminUser.password === password
  );

  if (!user) {
    return null;
  }

  return {
    email: user.email,
    role: user.role
  };
}

export function isValidAdminLogin(email: string, password: string) {
  return Boolean(validateAdminLogin(email, password));
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession());
}

export async function requireAdminSession() {
  return getAdminSession();
}

export async function canDeleteContent() {
  return (await getAdminSession())?.role === "admin";
}

export async function setAdminSession(user: AdminUser) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/"
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
