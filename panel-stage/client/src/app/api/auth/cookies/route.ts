import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type SlimUser = {
  id?: string;
  email?: string;
  username?: string;
  fullName?: string;
  role?: string;
  tenantId?: string | null;
  permissions?: string[];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accessToken,
      refreshToken,
      tenantId,
      user: rawUser,
    } = body as {
      accessToken?: string;
      refreshToken?: string;
      tenantId?: string;
      user?: SlimUser;
    };
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 hafta
    };

    /** SSR menü + RootLayout hydrate — iç içe tenant objesi koyma (4KB sınırı) */
    const userOptions = { ...options };

    if (accessToken) {
      cookieStore.set("accessToken", accessToken, options);
    }

    if (refreshToken) {
      cookieStore.set("refreshToken", refreshToken, options);
    }

    if (tenantId) {
      cookieStore.set("tenantId", tenantId, options);
    }

    if (rawUser && typeof rawUser === "object") {
      const slim: SlimUser = {
        id: rawUser.id,
        email: rawUser.email,
        username: rawUser.username,
        fullName: rawUser.fullName,
        role: rawUser.role != null ? String(rawUser.role) : undefined,
        tenantId: rawUser.tenantId ?? null,
        permissions: Array.isArray(rawUser.permissions)
          ? rawUser.permissions.filter(
              (permission) => typeof permission === "string",
            )
          : [],
      };
      cookieStore.set(
        "user",
        encodeURIComponent(JSON.stringify(slim)),
        userOptions,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API Auth Cookies] Error:", error);
    return NextResponse.json(
      { error: "Failed to set cookies" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("tenantId");
    cookieStore.delete("user");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clear cookies" },
      { status: 500 },
    );
  }
}
