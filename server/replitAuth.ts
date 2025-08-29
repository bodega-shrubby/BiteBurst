import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    console.log("Initializing OIDC config with REPL_ID:", process.env.REPL_ID);
    
    try {
      // Try discovery without client ID first
      const issuerUrl = new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc");
      console.log("Attempting discovery from:", issuerUrl.href);
      
      const config = await client.discovery(issuerUrl, process.env.REPL_ID!);
      console.log("OIDC discovery successful");
      console.log("Token endpoint:", config.token_endpoint);
      console.log("Authorization endpoint:", config.authorization_endpoint);
      console.log("Issuer:", config.issuer);
      return config;
    } catch (error) {
      console.error("OIDC discovery failed:", error);
      throw error;
    }
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: true, // Enable session resaving for OAuth state
    saveUninitialized: true, // Enable for OAuth state storage
    rolling: true, // Reset session expiry on each request
    cookie: {
      httpOnly: true,
      secure: false, // Disable secure for development
      maxAge: sessionTtl,
      sameSite: 'lax', // Allow cross-site requests for OAuth
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    replitId: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    try {
      console.log("OAuth verify callback - tokens received");
      const user = {};
      updateUserSession(user, tokens);
      const claims = tokens.claims();
      if (claims) {
        await upsertUser(claims);
        console.log("User upserted successfully:", claims.sub);
      }
      verified(null, user);
    } catch (error) {
      console.error("Error in verify callback:", error);
      verified(error, null);
    }
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    console.log("Setting up strategy for domain:", domain);
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
        passReqToCallback: false, // Ensure consistent callback signature
      },
      verify,
    );
    passport.use(strategy);
    console.log("Strategy registered:", `replitauth:${domain}`);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    // Use the actual Replit domain, not localhost
    const domain = process.env.REPLIT_DOMAINS!.split(",")[0];
    console.log("Login attempt - hostname:", req.hostname, "using domain:", domain);
    passport.authenticate(`replitauth:${domain}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    // Use the actual Replit domain, not localhost
    const domain = process.env.REPLIT_DOMAINS!.split(",")[0];
    console.log("Callback attempt - hostname:", req.hostname, "using domain:", domain);
    console.log("Callback query params:", req.query);
    
    passport.authenticate(`replitauth:${domain}`, (err: any, user: any, info: any) => {
      if (err) {
        console.error("OAuth callback error:", err);
        console.error("Error details:", JSON.stringify(err, null, 2));
        return res.redirect("/api/login?error=oauth_failed");
      }
      
      if (!user) {
        console.error("OAuth callback - no user returned:", info);
        return res.redirect("/api/login?error=no_user");
      }
      
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Login error:", loginErr);
          return res.redirect("/api/login?error=login_failed");
        }
        
        console.log("OAuth login successful");
        return res.redirect("/");
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};