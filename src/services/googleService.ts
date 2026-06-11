// Requires VITE_GOOGLE_CLIENT_ID in your .env
// OAuth2 scope: gmail.readonly — never requests write access

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
const SEARCH_QUERY = 'from:panerabread.com subject:receipt OR subject:"We\'ve received your Kiosk To Go order, Brittany!"';

// Access tokens are short-lived; keep in memory only (not localStorage)
let accessToken: string | null = null;

// ─── Gmail REST helper ────────────────────────────────────────────────────

interface MessageListResponse {
  messages?: Array<{ id: string; threadId: string }>;
}

interface MessageMetadata {
  id: string;
  internalDate: string; // epoch ms as string
  payload: {
    headers: Array<{ name: string; value: string }>;
  };
}

async function gmailGet<T>(path: string): Promise<T> {
  if (!accessToken) throw new Error("Not signed in. Call googleService.signIn() first.");

  const res = await fetch(`https://gmail.googleapis.com/gmail/v1${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 401) {
    accessToken = null;
    throw new Error("Session expired. Please sign in again.");
  }
  if (!res.ok) throw new Error(`Gmail API ${res.status}: ${res.statusText}`);

  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────

export interface DrinkReceipt {
  receivedAt: Date;
  subject: string;
  from: string;
  messageId: string;
}

// ─── Service ──────────────────────────────────────────────────────────────

export const googleService = {
  signIn(): Promise<void> {
    return new Promise((resolve, reject) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPE,
        callback(response) {
          if ("error" in response) {
            reject(new Error(String(response.error)));
            return;
          }
          accessToken = response.access_token;
          resolve();
        },
      });
      client.requestAccessToken();
    });
  },

  signOut(): void {
    if (accessToken) {
      window.google.accounts.oauth2.revoke(accessToken, () => {});
      accessToken = null;
    }
  },

  isSignedIn(): boolean {
    return accessToken !== null;
  },

  async fetchLatestDrinkReceipt(): Promise<DrinkReceipt | null> {
    const list = await gmailGet<MessageListResponse>(
      `/users/me/messages?q=${encodeURIComponent(SEARCH_QUERY)}&maxResults=1`
    );

    if (!list.messages?.length) return null;

    const msg = await gmailGet<MessageMetadata>(
      `/users/me/messages/${list.messages[0].id}?format=metadata` +
        `&metadataHeaders=Subject&metadataHeaders=From`
    );

    const header = (name: string) =>
      msg.payload.headers.find(
        (h) => h.name.toLowerCase() === name.toLowerCase()
      )?.value ?? "";

    return {
      receivedAt: new Date(Number(msg.internalDate)),
      subject: header("Subject"),
      from: header("From"),
      messageId: msg.id,
    };
  },
};
