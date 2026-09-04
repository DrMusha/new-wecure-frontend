import { getApiBaseUrl } from "@/lib/config";
import type { AuthUser } from "@/lib/session";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: { code?: string; message?: string } | string;
};

async function request<T>(
  path: string,
  init?: RequestInit & { token?: string | null },
): Promise<T> {
  const { token, headers, ...rest } = init ?? {};
  const hasBody = rest.body !== undefined && rest.body !== null;
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text) as unknown;
    } catch {
      payload = null;
    }
  }

  const envelope = normalizeEnvelope<T>(payload);

  if (!response.ok) {
    const message =
      envelope.message ||
      (typeof envelope.error === "string"
        ? envelope.error
        : envelope.error?.message) ||
      `Request failed with ${response.status}`;
    throw new Error(message);
  }

  if (envelope.data !== undefined && envelope.data !== null) {
    return envelope.data as T;
  }
  if (envelope.message) {
    return { message: envelope.message } as T;
  }

  return payload as T;
}

type NormalizedEnvelope<T> = {
  data?: T;
  message?: string;
  error?: { code?: string; message?: string } | string;
};

function normalizeEnvelope<T>(payload: unknown): NormalizedEnvelope<T> {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const record = payload as Record<string, unknown>;
  const data = readField(record, "data", "Data");
  const message = stringValue(readField(record, "message", "Message"));
  const error = readField(record, "error", "Error");

  return {
    data: data as T | undefined,
    message: message || undefined,
    error: error as { code?: string; message?: string } | string | undefined,
  };
}

function readField(record: Record<string, unknown>, ...names: string[]) {
  for (const name of names) {
    if (name in record) {
      return record[name];
    }
  }
  const lowerNames = names.map((name) => name.toLowerCase());
  for (const key of Object.keys(record)) {
    if (lowerNames.includes(key.toLowerCase())) {
      return record[key];
    }
  }
  return undefined;
}

export type Category = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResult = {
  user: AuthUser & {
    emailVerified?: string | null;
  };
  accessToken: string;
  refreshToken: string;
};

type RawAuthUser = Partial<Record<string, unknown>>;
type RawAuthResult = Partial<Record<string, unknown>> & {
  user?: RawAuthUser;
  User?: RawAuthUser;
  accessToken?: unknown;
  AccessToken?: unknown;
  refreshToken?: unknown;
  RefreshToken?: unknown;
  data?: unknown;
  Data?: unknown;
};

export type DeliveryDetails = {
  id?: string;
  userId?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type PaymentSummary = {
  id?: string;
  referenceId?: string;
  provider?: string;
  status?: string;
};

export type Payment = {
  id: string;
  orderId?: string;
  referenceId?: string;
  provider?: string;
  channel?: "card" | "mobile_money" | string;
  status?: string;
  amount?: number;
  currency?: string;
  accountNumber?: string;
  narration?: string;
  backUrl?: string;
  referenceData?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerFirstName?: string;
  customerLastName?: string;
  customerCity?: string;
  customerCountry?: string;
  customerAddress?: string;
  customerZip?: string;
  providerTransactionId?: string;
  providerStatus?: string;
  providerPayload?: string;
  failureMessage?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Order = {
  id: string;
  orderNumber?: string;
  userId?: string;
  status?: string;
  amount?: number;
  productIds?: string[];
  items?: OrderItem[];
  prescription?: string;
  payment?: PaymentSummary | null;
  createdAt?: string;
  updatedAt?: string;
};

export type MedicalCard = {
  id?: string;
  userId?: string;
  currentMedication?: string;
  hasDiabetes?: boolean;
  hasHypertension?: boolean;
  notes?: string;
  birthDate?: string;
  gender?: string;
  occupation?: string;
  allergies?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
  disclosureConsent?: boolean;
  privacyConsent?: boolean;
  treatmentConsent?: boolean;
  name?: string;
  email?: string;
  contactInfo?: {
    phoneNumber?: string;
    emergencyContact?: string;
    emergencyContactName?: string;
    address?: string;
  };
  sugarLevelLogs?: Array<{
    id: string;
    glucoseLevel: number;
    timeOfDay?: string;
    date?: string;
    time?: string;
    notes?: string;
    colorCode?: string;
    recordedAt?: string;
  }>;
  bloodPressureLogs?: Array<{
    id: string;
    systolic: number;
    diastolic: number;
    pulse?: number;
    date?: string;
    time?: string;
    colorCode?: string;
    recordedAt?: string;
  }>;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  images?: string[];
  description?: string;
  packSize?: string;
  isFeatured?: boolean;
  isPrescription?: boolean;
  categoryId?: string;
  status?: "draft" | "published" | "archived" | string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductSuggestion = {
  id: string;
  name: string;
  images?: string[];
  isFeatured?: boolean;
};
export type ProductPage = {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function listCategories() {
  return request<unknown[]>("/api/v1/categories").then(normalizeCategories);
}

export function listProducts(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const query = searchParams.toString();
  return request<unknown[]>(`/api/v1/products${query ? `?${query}` : ""}`).then(normalizeProducts);
}

export function listProductsPage(params?: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const query = searchParams.toString();
  return request<unknown>(`/api/v1/products${query ? `?${query}` : ""}`).then(normalizeProductPage);
}

export function getProductSuggestions(query: string, limit = 6) {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  return request<ProductSuggestion[]>(`/api/v1/products/suggestions?${params}`).then((items) =>
    arrayValue(items).map((item) => {
      const record = rawRecord(item);
      return {
        id: stringValue(readField(record, "id", "ID")),
        name: stringValue(readField(record, "name", "Name")),
        images: arrayValue(readField(record, "images", "Images")).map(stringValue).filter(Boolean),
        isFeatured: booleanValue(readField(record, "isFeatured", "IsFeatured")),
      };
    }).filter((item) => item.id && item.name),
  );
}

export function getCategory(id: string) {
  return request<unknown>(`/api/v1/categories/${id}`).then(normalizeCategory);
}

export function getProduct(id: string) {
  return request<unknown>(`/api/v1/products/${id}`).then(normalizeProduct);
}

export function login(email: string, password: string) {
  return request<RawAuthResult>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then(normalizeAuthResult);
}

export function register(payload: { name: string; email: string; password: string }) {
  return request<RawRegisterResult>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then(normalizeRegisterResult);
}

export function requestPasswordReset(email: string) {
  return request<{ message: string }>("/api/v1/auth/reset", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyPasswordResetOtp(email: string, otp: string) {
  return request<{ token: string }>("/api/v1/auth/reset/verify", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export function submitNewPassword(token: string, password: string) {
  return request<{ message: string }>("/api/v1/auth/new-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export function submitVerification(token: string) {
  return request<{ message: string }>("/api/v1/auth/new-verification", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export function getDeliveryDetails(token: string) {
  return request<DeliveryDetails>("/api/v1/delivery-details", { token });
}

export function saveDeliveryDetails(
  token: string,
  payload: Omit<DeliveryDetails, "id" | "userId">,
) {
  return request<DeliveryDetails>("/api/v1/delivery-details", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function createOrder(
  token: string,
  payload: {
    items: Array<{ productId: string; quantity: number }>;
    prescription?: string;
  },
) {
  return request<Order>("/api/v1/orders", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getOrders(token: string) {
  return request<Order[]>("/api/v1/orders", { token });
}

export function getOrder(token: string, orderId: string) {
  return request<Order>(`/api/v1/orders/${orderId}`, { token });
}

export function createPayment(
  token: string,
  payload: {
    orderId: string;
    channel: "card" | "mobile_money" | string;
    currency?: string;
    accountNumber?: string;
    email?: string;
    backUrl?: string;
    narration?: string;
    referenceData?: string;
    customer: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      city: string;
      country: string;
      address: string;
      zip: string;
      email: string;
    };
  },
) {
  return request<Payment>("/api/v1/payments", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getPaymentsForOrder(token: string, orderId: string) {
  return request<Payment[]>(`/api/v1/payments/order/${orderId}`, { token });
}

export function getPayment(token: string, paymentId: string) {
  return request<Payment>(`/api/v1/payments/${paymentId}`, { token });
}

export function reconcilePayment(
  token: string,
  payload: { paymentId?: string; referenceId?: string; orderId?: string },
) {
  return request<{ queued: boolean }>("/api/v1/admin/payments/reconcile", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getMedicalCard(token: string) {
  return request<MedicalCard>("/api/v1/medical-cards", { token });
}

export function createMedicalCard(
  token: string,
  payload: Record<string, unknown>,
) {
  return request<MedicalCard>("/api/v1/medical-cards", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function logSugarLevel(
  token: string,
  payload: { glucoseLevel: number; timeOfDay: string; date: string; time: string; notes?: string },
) {
  return request("/api/v1/medical-cards/sugar", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function logBloodPressure(
  token: string,
  payload: { systolic: number; diastolic: number; pulse: number; date: string; time: string },
) {
  return request("/api/v1/medical-cards/blood-pressure", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

function normalizeAuthResult(payload: RawAuthResult): AuthResult {
  const rawUser = (payload.user || payload.User || {}) as RawAuthUser;

  return {
    accessToken: stringValue(payload.accessToken ?? payload.AccessToken),
    refreshToken: stringValue(payload.refreshToken ?? payload.RefreshToken),
    user: {
      id: stringValue(rawUser.id ?? rawUser.ID ?? rawUser.userID ?? rawUser.UserID),
      name: stringValue(rawUser.name ?? rawUser.Name) || undefined,
      email: stringValue(rawUser.email ?? rawUser.Email) || undefined,
      role: stringValue(rawUser.role ?? rawUser.Role) || undefined,
      emailVerified: stringValue(rawUser.emailVerified ?? rawUser.EmailVerified) || null,
    },
  };
}

type RawRegisterResult = Partial<Record<string, unknown>> & {
  user?: RawAuthUser;
  User?: RawAuthUser;
  data?: RawAuthUser;
  Data?: RawAuthUser;
};

function normalizeRegisterResult(payload: RawRegisterResult) {
  const rawUser = (payload.user || payload.User || payload.data || payload.Data || {}) as RawAuthUser;
  return {
    user: {
      id: stringValue(rawUser.id ?? rawUser.ID ?? rawUser.userID ?? rawUser.UserID),
      name: stringValue(rawUser.name ?? rawUser.Name) || undefined,
      email: stringValue(rawUser.email ?? rawUser.Email) || undefined,
      role: stringValue(rawUser.role ?? rawUser.Role) || undefined,
    },
  };
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function booleanValue(value: unknown) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function arrayValue(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function rawRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function normalizeCategories(payload: unknown): Category[] {
  return arrayValue(payload).map((item) => normalizeCategory(item));
}

function normalizeCategory(payload: unknown): Category {
  const record = rawRecord(payload);
  return {
    id: stringValue(readField(record, "id", "ID", "categoryId", "CategoryID")),
    name: stringValue(readField(record, "name", "Name")) || "Untitled category",
    description: stringValue(readField(record, "description", "Description")) || undefined,
    imageUrl:
      stringValue(
        readField(record, "imageUrl", "ImageUrl", "imageURL", "ImageURL", "image"),
      ) || undefined,
    createdAt: stringValue(readField(record, "createdAt", "CreatedAt")) || undefined,
    updatedAt: stringValue(readField(record, "updatedAt", "UpdatedAt")) || undefined,
  };
}

function normalizeProducts(payload: unknown): Product[] {
  const record = rawRecord(payload);
  const items = readField(record, "items", "Items");
  if (Array.isArray(items)) {
    return items.map((item) => normalizeProduct(item));
  }
  return arrayValue(payload).map((item) => normalizeProduct(item));
}

function normalizeProductPage(payload: unknown): ProductPage {
  const record = rawRecord(payload);
  const items = readField(record, "items", "Items");

  return {
    items: Array.isArray(items) ? items.map((item) => normalizeProduct(item)) : [],
    page: numberValue(readField(record, "page", "Page")) || 1,
    pageSize: numberValue(readField(record, "pageSize", "PageSize")) || 12,
    total: numberValue(readField(record, "total", "Total")),
    totalPages: numberValue(readField(record, "totalPages", "TotalPages")) || 1,
  };
}

function normalizeProduct(payload: unknown): Product {
  const record = rawRecord(payload);
  return {
    id: stringValue(readField(record, "id", "ID", "productId", "ProductID")),
    name: stringValue(readField(record, "name", "Name")) || "Untitled product",
    price: numberValue(readField(record, "price", "Price")),
    images: arrayValue(readField(record, "images", "Images")).map((image) => stringValue(image)).filter(Boolean),
    description: stringValue(readField(record, "description", "Description")) || undefined,
    packSize: stringValue(readField(record, "packSize", "PackSize")) || undefined,
    isFeatured: booleanValue(readField(record, "isFeatured", "IsFeatured")),
    isPrescription: booleanValue(readField(record, "isPrescription", "IsPrescription")),
    categoryId: stringValue(
      readField(record, "categoryId", "CategoryID", "categoryID", "CategoryId"),
    ) || undefined,
    status: stringValue(readField(record, "status", "Status")) || undefined,
    createdAt: stringValue(readField(record, "createdAt", "CreatedAt")) || undefined,
    updatedAt: stringValue(readField(record, "updatedAt", "UpdatedAt")) || undefined,
  };
}

export function subscribeToPaymentStatus(
  token: string,
  paymentId: string,
  onPayment: (payment: Payment) => void,
  onError: (error: Error) => void,
) {
  const controller = new AbortController();

  void (async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/v1/payments/${paymentId}/events`, {
        headers: { Accept: "text/event-stream", Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        throw new Error(`Could not connect to payment status updates (${response.status}).`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let receivedTerminalStatus = false;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const event of events) {
          const data = event.split("\n").find((line) => line.startsWith("data: "));
          if (!data) continue;
          try {
            const payment = JSON.parse(data.slice(6)) as Payment;
            receivedTerminalStatus = payment.status === "successful" || payment.status === "failed";
            onPayment(payment);
          } catch {
            // Ignore malformed events and continue waiting for the next status.
          }
        }
      }
      if (!controller.signal.aborted && !receivedTerminalStatus) {
        throw new Error("Payment status connection closed. Refresh the status and try again.");
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        onError(error instanceof Error ? error : new Error("Payment status stream disconnected."));
      }
    }
  })();

  return () => controller.abort();
}
