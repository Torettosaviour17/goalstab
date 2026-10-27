import api from "@/services/api";

type JsonOptions = Record<string, any>;

const encodeBase64Url = (value: ArrayBuffer | ArrayBufferView) => {
  const bytes =
    value instanceof ArrayBuffer
      ? new Uint8Array(value)
      : new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/g, "");
};

const decodeBase64Url = (value: string): ArrayBuffer => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return bytes.buffer;
};

const toCreationOptions = (options: JsonOptions): PublicKeyCredentialCreationOptions => ({
  ...options,
  challenge: decodeBase64Url(options.challenge),
  user: {
    ...options.user,
    id: decodeBase64Url(options.user.id),
  },
  excludeCredentials: (options.excludeCredentials || []).map((item: JsonOptions) => ({
    ...item,
    id: decodeBase64Url(item.id),
  })),
}) as PublicKeyCredentialCreationOptions;

const toRequestOptions = (options: JsonOptions): PublicKeyCredentialRequestOptions => ({
  ...options,
  challenge: decodeBase64Url(options.challenge),
  allowCredentials: (options.allowCredentials || []).map((item: JsonOptions) => ({
    ...item,
    id: decodeBase64Url(item.id),
  })),
}) as PublicKeyCredentialRequestOptions;

const serializeRegistration = (credential: PublicKeyCredential) => {
  const response = credential.response as AuthenticatorAttestationResponse;
  return {
    id: credential.id,
    rawId: encodeBase64Url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: encodeBase64Url(response.clientDataJSON),
      attestationObject: encodeBase64Url(response.attestationObject),
      transports: typeof response.getTransports === "function" ? response.getTransports() : [],
    },
    clientExtensionResults: credential.getClientExtensionResults(),
    authenticatorAttachment: credential.authenticatorAttachment,
  };
};

const serializeAuthentication = (credential: PublicKeyCredential) => {
  const response = credential.response as AuthenticatorAssertionResponse;
  return {
    id: credential.id,
    rawId: encodeBase64Url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: encodeBase64Url(response.clientDataJSON),
      authenticatorData: encodeBase64Url(response.authenticatorData),
      signature: encodeBase64Url(response.signature),
      userHandle: response.userHandle ? encodeBase64Url(response.userHandle) : null,
    },
    clientExtensionResults: credential.getClientExtensionResults(),
    authenticatorAttachment: credential.authenticatorAttachment,
  };
};

export const isDeviceAuthenticationSupported = () =>
  typeof window !== "undefined" &&
  window.isSecureContext &&
  Boolean(window.PublicKeyCredential) &&
  Boolean(navigator.credentials);

export const getBiometricStatus = async (): Promise<boolean> => {
  const response = await api.get("/auth/webauthn/status");
  return Boolean(response.data?.enabled);
};

export const registerBiometricDevice = async () => {
  if (!isDeviceAuthenticationSupported()) {
    throw new Error("This installed browser does not support secure device authentication.");
  }

  const { data: options } = await api.post("/auth/webauthn/register/options");
  const credential = (await navigator.credentials.create({
    publicKey: toCreationOptions(options),
  })) as PublicKeyCredential | null;

  if (!credential) throw new Error("Device authentication setup was cancelled.");

  await api.post("/auth/webauthn/register/verify", serializeRegistration(credential));
};

export const verifyBiometricDevice = async () => {
  if (!isDeviceAuthenticationSupported()) {
    throw new Error("Secure device authentication is not available on this device.");
  }

  const { data: options } = await api.post("/auth/webauthn/auth/options");
  const credential = (await navigator.credentials.get({
    publicKey: toRequestOptions(options),
  })) as PublicKeyCredential | null;

  if (!credential) throw new Error("Device verification was cancelled.");

  await api.post("/auth/webauthn/auth/verify", serializeAuthentication(credential));
};

export const removeBiometricDevice = async () => {
  await api.delete("/auth/webauthn/credentials");
};
