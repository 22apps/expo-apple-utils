/// <reference types="prompts" />
/// <reference types="node-forge" />
/// <reference types="node" />
declare module "network/CSRF" {
    import { AxiosResponse } from 'axios';
    type CSRFTokens = Record<string, string>;
    export function getTokens(): CSRFTokens;
    export function storeCSRFTokens(response: Pick<AxiosResponse<any>, 'headers'>): void;
    export function updateCSRFTokens(key: string, tokens: CSRFTokens | null): void;
    export function ensureCSRFAsync(kind: string, blockAsync: () => Promise<any>): Promise<void>;
    export function clearCachedCSRFTokens(): void;
}
declare module "utils/json-file-cache" {
    import { JSONObject } from '@expo/json-file';
    export function cacheUserDirectory(): string;
    export function usernameCachePath(): string;
    export function cacheAsync(cacheFilePath: string, contents: JSONObject): Promise<void>;
    export function getCacheAsync(filePath: string): Promise<JSONObject | null>;
}
declare module "utils/environment" {
    export function isInteractive(): boolean;
    export const EXPO_APP_STORE_TIMEOUT: number;
    export const EXPO_APP_STORE_SCREENSHOT_UPLOAD_TIMEOUT_MINS: number;
}
declare module "utils/log" {
    function log(...args: any[]): void;
    namespace log {
        var error: (...args: any[]) => void;
        var newLine: () => void;
        var wrapped: (txt: string) => void;
        var addNewLineIfNone: () => void;
    }
    /**
     * When linking isn't available, format the learn more link better.
     *
     * @example [Learn more](https://expo.io)
     * @example Learn more: https://expo.io
     * @param url
     */
    export function learnMore(url: string): string;
    export default log;
}
declare module "utils/prompts" {
    import prompts, { Options, PromptType, PromptObject as Question } from 'prompts';
    export { PromptType, Question };
    type PromptOptions = {
        nonInteractiveHelp?: string;
    } & Options;
    export type NamelessQuestion = Omit<Question<'value'>, 'name' | 'type'>;
    export default function prompt(questions: Question | Question[], { nonInteractiveHelp, ...options }?: PromptOptions): Promise<prompts.Answers<string>>;
    /**
     * Create an auto complete list that can be searched and cancelled.
     *
     * @param questions
     * @param options
     */
    export function autoCompleteAsync(questions: NamelessQuestion, options?: PromptOptions): Promise<string>;
    /**
     * Create a standard yes/no confirmation that can be cancelled.
     *
     * @param questions
     * @param options
     */
    export function confirmAsync(questions: NamelessQuestion, options?: PromptOptions): Promise<boolean>;
    /**
     * Create a more dynamic yes/no confirmation that can be cancelled.
     *
     * @param questions
     * @param options
     */
    export function toggleConfirmAsync(questions: NamelessQuestion, options?: PromptOptions): Promise<boolean>;
}
declare module "utils/validators" {
    export function nonEmptyInput(val: string): boolean;
}
declare module "auth/Keychain" {
    export const EXPO_NO_KEYCHAIN: boolean;
    type Credentials = {
        serviceName: string;
        username: string;
        password: string;
    };
    export function deletePasswordAsync({ username, serviceName, }: Pick<Credentials, 'username' | 'serviceName'>): Promise<boolean>;
    export function getPasswordAsync({ username, serviceName, }: Pick<Credentials, 'serviceName' | 'username'>): Promise<string | null>;
    export function setPasswordAsync({ serviceName, username, password, }: Credentials): Promise<boolean>;
}
declare module "auth/Credentials" {
    import { CookiesJSON } from "network/CookieFileCache";
    export interface UserCredentials {
        username: string;
        password: string;
        cookies?: CookiesJSON;
        providerId?: number;
        teamId?: string;
    }
    export function resolveCredentialsAsync(options: Partial<UserCredentials>): Promise<Partial<UserCredentials>>;
    export function promptUsernameAsync(): Promise<string>;
    export function cacheUsernameAsync(username: string): Promise<void>;
    export function promptPasswordAsync({ username, }: Pick<UserCredentials, 'username'>): Promise<string>;
    export function getCachedUsernameAsync(): Promise<string | null>;
    export function getCachedPasswordAsync({ username, }: Pick<UserCredentials, 'username'>): Promise<string | null>;
}
declare module "utils/files" {
    export function isDirectory(path: string): boolean;
    export function fileExists(path: string): boolean;
}
declare module "connect/Token" {
    import jwt from 'jsonwebtoken';
    /**
     * Used to Sign the .p8 private key that can only be downloaded once from Apple.
     *
     * [Learn more](https://developer.apple.com/documentation/appstoreconnectapi/generating_tokens_for_api_requests).
     */
    export interface TokenProps {
        /**
         * p8 file contents:
         *
         * @example
         * -----BEGIN PRIVATE KEY-----
         * xxxxxxxx/xxxx
         * xxxxxxxxxxxxx
         * xxxxxxxxxxx+x
         * xxxxxxxx
         * -----END PRIVATE KEY-----
         */
        key: jwt.Secret;
        /**
         * Issuer ID from ASC: Users and Access > Keys | https://appstoreconnect.apple.com/access/api
         */
        issuerId: string;
        /**
         * Key ID from ASC: Users and Access > Keys | https://appstoreconnect.apple.com/access/api
         */
        keyId: string;
        /**
         * Duration (seconds) key should last before it needs to be signed again. Max time is 20 minutes (1200).
         */
        duration?: number;
    }
    export class Token {
        options: TokenProps;
        static sign({ key, issuerId, keyId, duration }: TokenProps): string;
        private token;
        expiration: number;
        constructor(options: TokenProps);
        getToken(): string;
        getDurationMilliseconds(): number;
        refresh(): string;
        /**
         * Returns true if the token has expired and needs to be refreshed.
         */
        hasExpired(): boolean;
    }
}
declare module "utils/array" {
    export function uniqueItems<T = any>(items: T[]): T[];
    export function flat(array: any[], depth?: number): any[];
    export function groupBy<T>(arr: T[], block: (v: T) => any): Record<string, T[]>;
}
declare module "portal/Teams" {
    type AppStoreTeamStatus = string | 'active';
    interface AppStoreTeamAgent {
        personId: null | number;
        firstName: null | string;
        lastName: null | string;
        email: null | string;
        developerStatus: null | AppStoreTeamStatus;
        teamMemberId: string;
    }
    interface AppStoreTeamMembership {
        membershipId: string;
        membershipProductId: string;
        status: AppStoreTeamStatus;
        inDeviceResetWindow: boolean;
        inRenewalWindow: boolean;
        dateStart: string;
        dateExpire: string;
        platform: string | 'ios';
        availableDeviceSlots: number;
        name: string;
    }
    interface AppStoreTeamCurrentTeamMember extends AppStoreTeamAgent {
        privileges: Record<string, unknown>;
        roles: string[];
    }
    export interface AppStoreTeam {
        status: AppStoreTeamStatus;
        teamId: string;
        type: 'In-House' | 'Company/Organization' | 'Individual' | string;
        extendedTeamAttributes: Record<string, unknown>;
        teamAgent: AppStoreTeamAgent;
        memberships: AppStoreTeamMembership[];
        currentTeamMember: AppStoreTeamCurrentTeamMember;
        name: string;
    }
    export function getTeamsAsync(): Promise<AppStoreTeam[]>;
    export function selectTeamAsync({ teamId }?: {
        teamId?: string;
    }): Promise<AppStoreTeam>;
}
declare module "auth/utils/validate-session" {
    import { AppStoreTeam } from "portal/Teams";
    import { LoginOptions } from "auth/Auth";
    import { UserCredentials } from "auth/Credentials";
    import { AuthState, SessionProvider } from "auth/Session";
    export function getProviderMatchingTeam(providers: SessionProvider[], team?: AppStoreTeam): SessionProvider | null;
    export function logSelectedProvider(provider: SessionProvider): void;
    /**
     * Check if the global cookies are valid, if so, cache the cookies and return the auth state.
     * Will throw if the cookies are expired.
     */
    export function validateSessionAsync({ providerId, teamId }: Pick<UserCredentials, 'providerId' | 'teamId'>, { autoResolveProvider }: LoginOptions): Promise<AuthState | null>;
}
declare module "utils/fastlane-session" {
    import { CookieJar } from 'tough-cookie';
    /**
     * Transform the tough cookie session into the custom YAML format that Fastlane expects.
     */
    export function getSessionAsYAML(): string;
    export function formatToughCookiesAsYAML(cookies: CookieJar.Serialized): string;
    export function getSessionAsEnvironmentVariable(): string;
}
declare module "auth/Session" {
    import { CookieJar } from 'tough-cookie';
    import { CookiesJSON } from "network/CookieFileCache";
    import { RequestContext } from "network/Request";
    import { AppStoreTeam } from "portal/Teams";
    export type AuthState = {
        username: string;
        password?: string;
        cookies: CookiesJSON;
        session: SessionInfo;
        context: RequestContext;
    };
    export interface SessionProvider {
        /**
         * @example 118573544
         */
        providerId: number;
        /**
         * @example '69a6de82-2c1c-47e3-e053-5b8c7c11a4d1'
         */
        publicProviderId: string;
        /**
         * @example 'Evan Bacon'
         */
        name: string;
        contentTypes: ('SOFTWARE' | string)[];
        subType: 'INDIVIDUAL' | string;
    }
    export interface SessionInfo {
        jar: CookieJar;
        user: {
            /**
             * @example 'Evan Bacon'
             */
            fullName: string;
            /**
             * @example 'Evan'
             */
            firstName: string;
            /**
             * @example 'Bacon'
             */
            lastName: string;
            /**
             * @example 'bacon@expo.io'
             */
            emailAddress: string;
            /**
             * @example '10421985600'
             */
            prsId: string;
        };
        provider: SessionProvider;
        availableProviders: SessionProvider[];
        /**
         * @example '69a4960f-d2f3-5733-e053-5b8c7c1155b0'
         */
        publicUserId: string;
        theme: 'APPSTORE_CONNECT' | string;
        roles: ('ADMIN' | 'LEGAL' | string)[];
        agreeToTerms: boolean;
    }
    export function getAnySessionInfo(): SessionInfo | null;
    /**
     * Get the `itctx` cookies from the API endpoint "olympus"
     */
    export function fetchCurrentSessionInfoAsync(): Promise<SessionInfo | null>;
    export function getSessionForProviderIdAsync(providerId: number): Promise<SessionInfo>;
    export function getAvailableSessionProviders(): SessionProvider[];
    /**
     * Used to specify which team the user should make requests for.
     * After posting successfully, the returned cookies indicate the team to the App Store Connect API.
     * Discovered from swapping teams via ASC website.
     *
     * @param id `SessionProvider` `providerId`
     */
    export function setSessionProviderIdAsync(id: number): Promise<SessionInfo | null>;
    export function selectSessionProviderAsync(): Promise<SessionProvider>;
    export function promptForSessionProviderAsync({ team, }?: {
        team?: AppStoreTeam;
    }): Promise<SessionProvider>;
    export * from "utils/fastlane-session";
}
declare module "utils/error" {
    import assert from 'assert';
    export { assert };
    export class ITunesConnectError extends Error {
    }
    export class GatewayTimeoutError extends Error {
    }
    export class IdmsaServiceError extends Error {
        data: Record<string, any>;
        code: string;
        title: string;
        suppressDismissal: boolean;
        constructor(data: Record<string, any>);
    }
    type NetworkResponse = any;
    export class NetworkError extends Error {
        response: NetworkResponse;
        constructor(message: string, response: NetworkResponse);
    }
    export class InternalServerError extends NetworkError {
        constructor(response: NetworkResponse);
    }
    export class AuthError extends NetworkError {
    }
    export class InvalidUserCredentialsError extends AuthError {
    }
    /**
     * Thrown in 200 responses that return a resultString or userString that indicate the user is not logged in.
     *
     * `Your session has expired.  Please log in.`
     *
     * TODO: Remove double space in default message.
     */
    export class SessionExpiredError extends AuthError {
    }
    export class UnauthorizedAccessError extends AuthError {
        constructor(response: NetworkResponse, message?: string);
    }
    /**
     * 401 that more specifically is related to unauthenticated requests.
     */
    export class UnauthenticatedError extends UnauthorizedAccessError {
        constructor(response: NetworkResponse);
    }
    export class AppleTimeoutError extends NetworkError {
        constructor(response: NetworkResponse);
    }
    export class TimeoutError extends NetworkError {
        constructor(response: NetworkResponse);
    }
    export class BadGatewayError extends NetworkError {
        constructor(response: NetworkResponse);
    }
    export class AccessForbiddenError extends NetworkError {
        constructor(response: NetworkResponse);
    }
    export type ServiceErrorInfo = {
        code: string;
        title: string;
        message: string;
        suppressDismissal: boolean;
    };
    export class ServiceError extends NetworkError {
        info: ServiceErrorInfo;
        constructor(info: ServiceErrorInfo, response: NetworkResponse);
    }
    export class InsufficientPermissions extends Error {
        constructor(message?: string);
    }
    export class UnexpectedResponse extends Error {
        errorInfo: string | Record<string, any>;
        readonly name = "UnexpectedAppleResponse";
        constructor(errorInfo: string | Record<string, any>);
        preferredErrorInfo(): string | null;
    }
    export function sanitizeResultStringErrors(errorInfo: any): null | string;
    export function assertCommonErrors(body: Record<string, any>): void;
}
declare module "portal/PortalAPI" {
    import { AxiosResponse } from 'axios';
    import { ParsingOptions, RequestContext, RequestProps } from "network/Request";
    export type DevPortalAppIDType = 'ios' | 'mac';
    type ParsedResponseResults = string | Record<string, any>;
    export function getPortalUrl(urlComponent?: string): string;
    export function getAccountPlatformPortalUrl({ url, type, }: {
        url: string;
        type?: DevPortalAppIDType;
    }): string;
    export function getValidName(name: string): string;
    export function portalRequestAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, { data, ...rest }: RequestProps, options?: Omit<ParsingOptions, 'supportedAuthType'>): Promise<R>;
    export function parseValidationMessages(data: any): string[];
    export function portalRequestWithParamsAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, { params, ...rest }: RequestProps, options?: Omit<ParsingOptions, 'supportedAuthType'>): Promise<R>;
    export function parseAppStoreResponse<T extends ParsedResponseResults>(response: AxiosResponse<Record<string, any> | string>, targetDataKey?: string): T;
}
declare module "utils/retry" {
    export function waitAsync(duration: number): Promise<void>;
}
declare module "network/AxiosErrors" {
    import { AxiosResponse } from 'axios';
    import { NetworkError } from "utils/error";
    export function isNetworkError(error: any): boolean;
    export function isRetryableError(error: any): boolean;
    export function isIdempotentRequestError(error: any): boolean;
    export function isNetworkOrIdempotentRequestError(error: any): boolean;
    export function isTimeoutError(error: any): boolean;
    export function isAppleTimeoutError(error: Error | null): boolean;
    export function getAppleResponseError<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(response: R): NetworkError | null;
}
declare module "network/AxiosLogger" {
    import { AxiosInstance, AxiosRequestConfig } from 'axios';
    export const isEnabled: boolean;
    export function getURL(config: AxiosRequestConfig): string;
    export function applyLoggingMiddleware({ interceptors }: AxiosInstance): void;
}
declare module "network/Request" {
    import { AxiosRequestConfig, AxiosResponse } from 'axios';
    import { CookieJar } from 'tough-cookie';
    import { Token } from "connect/Token";
    export type RequestContext = {
        /**
         * Indicates which team to use with the iris API
         */
        providerId?: number;
        /**
         * Indicates which team to use with the provisioning API
         */
        teamId?: string;
        /**
         * Signed JWT API token or API key instance used to generate signed tokens automatically.
         */
        token?: string | Token;
    };
    export type RequestHeaders = Record<string, string>;
    export type RequestProps = Pick<AxiosRequestConfig, 'timeout' | 'params' | 'responseType' | 'paramsSerializer' | 'url' | 'data' | 'baseURL'> & {
        jar?: boolean | CookieJar;
        headers?: RequestHeaders;
        method: 'post' | 'get' | 'put' | 'patch' | 'delete';
    };
    export type AuthType = 'token' | 'cookies';
    export interface ParsingOptions {
        /**
         * Used to dictate if an API cannot be used for a certain request.
         */
        supportedAuthType?: AuthType;
        dataKey?: string;
        shouldParseDataForErrors?: boolean;
        retries?: number;
        autoPaginate?: boolean;
        shouldRetryRequest?: (error: any) => boolean;
    }
    const axios: import("axios").AxiosInstance;
    export function getSupportedContext(context: RequestContext, supportedAuthType?: AuthType): RequestContext | null;
    export function setCookieJar(cookieJar?: CookieJar | string): void;
    export function getCookieJar(): CookieJar;
    export function getRetryDelay(): number;
    export function setRetryDelay(nextDelay: number): void;
    export function requestAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>({ method, params, headers, data, ...rest }: RequestProps, options?: ParsingOptions): Promise<R>;
    /**
     * Encode objects in a nested format.
     *
     * @example
     *
     * `{ filter: { bundleId: value } }` => `filter[bundleId]=value`
     *
     * @param params
     */
    export function nestedParamsEncoder(params: any): string;
    /**
     * Encode objects in a repeated format.
     *
     * @example
     *
     * `{ filter: ['foo', 'bar'] }` => `filter=foo&filter=bar`
     *
     * @param params
     */
    export function repeatParamsEncoder(params: any): string;
    export { axios };
}
declare module "network/CookieFileCache" {
    import { CookieJar } from 'tough-cookie';
    import { UserCredentials } from "auth/Credentials";
    export type CookiesJSON = CookieJar.Serialized;
    export function deleteCachedCookiesFileAsync({ username, }: Pick<UserCredentials, 'username'>): Promise<boolean>;
    export function getCookiesJSON(): CookiesJSON;
    export function getCachedCookiePath({ username }: {
        username: string;
    }): string | undefined;
    export function loadCookiesFromFileAsync(filePath: string): Promise<void>;
    export function writeCookiesToFileAsync({ username, cookiePath, }: {
        cookiePath?: string;
        username: string;
    }): Promise<void>;
}
declare module "auth/Auth.types" {
    export type LoginOptions = {
        /**
         * Should attempt to choose a provider that matches the team name.
         *
         * @default false
         */
        autoResolveProvider?: boolean;
    };
}
declare module "auth/ServiceKey" {
    export interface ItunesServiceKey {
        authServiceUrl: string;
        authServiceKey: string;
    }
    export const serviceKeyPath: string;
    export function getItunesConnectServiceKeyAsync(): Promise<ItunesServiceKey>;
}
declare module "auth/TwoFactorAuthTypes" {
    export interface TFAuthResponse {
        trustedPhoneNumbers?: PhoneNumber[];
        phoneNumber?: PhoneNumber;
        securityCode?: SecurityCode;
        trustedDevices?: TrustedDevice[];
        mode?: 'sms' | string;
        type?: 'verification' | string;
        aboutTwoFactorAuthenticationUrl?: string;
        autoVerified?: boolean;
        showAutoVerificationUI?: boolean;
        managedAccount?: boolean;
        hsa2Account?: boolean;
        restrictedAccount?: boolean;
        trustedPhoneNumber?: PhoneNumber;
        supportsRecovery?: boolean;
        authenticationType?: 'hsa2' | string;
        noTrustedDevices?: boolean;
    }
    export type TFACodeType = 'trusteddevice' | 'phone';
    export interface PhoneNumber {
        /**
         * @example `(?????????) ?????????-??????31`
         */
        obfuscatedNumber: string;
        pushMode: string | 'sms';
        /**
         * @example `+1 (?????????) ?????????-??????31`
         */
        numberWithDialCode: string;
        /**
         * @example 1
         */
        id: number;
    }
    export interface TrustedDevice {
        name: string;
        modelName?: string;
        id: string;
    }
    export interface SecurityCode {
        length: number;
        tooManyCodesSent: boolean;
        tooManyCodesValidated: boolean;
        securityCodeLocked: boolean;
        securityCodeCooldown: boolean;
    }
}
declare module "auth/TwoFactorAuthPrompts" {
    import { PhoneNumber, TrustedDevice } from "auth/TwoFactorAuthTypes";
    export function selectTwoStepDeviceAsync({ devices, nonInteractiveHelp, }: {
        devices: TrustedDevice[];
        nonInteractiveHelp?: string;
    }): Promise<TrustedDevice>;
    export function selectPhoneNumberAsync({ numbers, nonInteractiveHelp, }: {
        numbers: PhoneNumber[];
        nonInteractiveHelp?: string;
    }): Promise<PhoneNumber>;
    export function promptForCode({ length, nonInteractiveHelp, message, }: {
        length: number;
        nonInteractiveHelp?: string;
        message?: string;
    }): Promise<string>;
}
declare module "auth/utils/provider-request" {
    import { AxiosResponse } from 'axios';
    import { ParsingOptions, RequestContext, RequestProps } from "network/Request";
    export function providerRequestAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: RequestProps, options?: ParsingOptions): Promise<R>;
}
declare module "itunes/ItunesAPI" {
    import { AxiosResponse } from 'axios';
    import { ParsingOptions, RequestContext, RequestProps } from "network/Request";
    export function itunesRequestAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: RequestProps, options?: ParsingOptions): Promise<R>;
    /**
     * Parses and asserts errors for all of the deeply nested error messages that are returned from the iTunes Connect API.
     *
     * @param raw
     */
    export function parseItunesConnectResponse(raw: any): any;
    /**
     * Extracts arrays from an object of arrays.
     */
    export function extractKeysFromObject({ data, keys, }: {
        data: Record<string, any>;
        keys: string[];
    }): Record<string, any>;
}
declare module "auth/IdmsaAPI" {
    import { AxiosResponse } from 'axios';
    import { ParsingOptions, RequestProps } from "network/Request";
    /**
     * Perform requests for `idmsa.apple.com`, also asserts errors for the standard response object returned from idmsa.
     * This method doesn't retry authentication errors or attempt to login.
     */
    export function idmsaRequestAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(request: RequestProps, { shouldRetryRequest, ...options }?: ParsingOptions): Promise<R>;
    /**
     * Assert known errors from idmsa
     * @param data
     */
    export function assertIdmsaResponse(data: any): void;
}
declare module "auth/TwoFactorAuthRequests" {
    import { AxiosResponse } from 'axios';
    import { RequestHeaders } from "network/Request";
    import { TFAuthResponse, TrustedDevice } from "auth/TwoFactorAuthTypes";
    /**
     * Request the auth session. If this returns with 409, then 2FA is enabled.
     *
     * @param headers secure headers used for making requests
     */
    export function requestAuthAsync({ headers, }: {
        headers: RequestHeaders;
    }): Promise<AxiosResponse<TFAuthResponse>>;
    /**
     * Request a verification code is sent to the phone number.
     *
     * @param phoneId numeric ID for phone number provided by Apple servers
     * @param headers secure headers used for making requests
     */
    export function sendRequestTokenToSMSAsync({ phoneId, headers, }: {
        phoneId: number;
        headers: RequestHeaders;
    }): Promise<boolean>;
    /**
     * Request token to device.
     *
     * @param device.id ID for the trusted device
     * @param headers secure headers used for making requests
     */
    export function sendRequestTokenToDeviceAsync({ device: { id }, headers, }: {
        headers: RequestHeaders;
        device: Pick<TrustedDevice, 'id'>;
    }): Promise<void>;
    /**
     * Send SMS code to the server for verification.
     *
     * @param headers secure headers used for making requests
     */
    export function verifyTwoFactorCodeAsync({ phoneNumberId, code, headers, }: {
        code: string;
        phoneNumberId?: number;
        headers: RequestHeaders;
    }): Promise<boolean>;
    /**
     * Send device code to the server for verification. This may be a legacy solution.
     *
     * @param headers secure headers used for making requests
     */
    export function verifyDeviceCodeAsync({ device, code, headers, }: {
        headers: RequestHeaders;
        device: Pick<TrustedDevice, 'id'>;
        code: string;
    }): Promise<boolean>;
}
declare module "auth/utils/trusted-session" {
    export function storeSessionAsync({ username, headers, }: {
        username: string;
        headers: any;
    }): Promise<void>;
}
declare module "auth/TwoFactorAuth" {
    import { UserCredentials } from "auth/Credentials";
    export function handleTwoFactorAuthentication(scnt: string, sessionId: string, authServiceKey: string, credentials: UserCredentials): Promise<void>;
}
declare module "auth/utils/load-session" {
    import { CookiesJSON } from "network/CookieFileCache";
    export function loadSessionFromEnvironmentAsync(): Promise<boolean>;
    /**
     * Restore the session from `tough-cookie` JSON object.
     *
     * @param json
     */
    export function loadSessionFromCookiesJSONAsync(json: CookiesJSON): Promise<boolean>;
    export function loadSessionFromFileAsync({ username, }: {
        username: string;
    }): Promise<boolean>;
}
declare module "auth/utils/restore-session" {
    import { LoginOptions } from "auth/Auth.types";
    import { UserCredentials } from "auth/Credentials";
    import { AuthState } from "auth/Session";
    export function tryRestoringAuthStateFromCookiesFileAsync({ username, providerId, teamId, }: Partial<Pick<UserCredentials, 'username' | 'providerId' | 'teamId'>>, options: LoginOptions): Promise<AuthState | null>;
    export function tryRestoringAuthStateFromCookiesEnvironmentVariableAsync({ providerId, teamId }: Partial<Pick<UserCredentials, 'username' | 'providerId' | 'teamId'>>, options: LoginOptions): Promise<AuthState | null>;
    export function tryRestoringAuthStateFromCookiesJSONAsync({ cookies, providerId, teamId }: Pick<UserCredentials, 'cookies' | 'providerId' | 'teamId'>, options: LoginOptions): Promise<AuthState | null>;
    export function tryRestoringAuthStateFromUserCredentialsAsync(userCredentials: Partial<Pick<UserCredentials, 'username' | 'cookies' | 'providerId' | 'teamId'>>, options: LoginOptions): Promise<AuthState | null>;
}
declare module "auth/Auth" {
    import { LoginOptions } from "auth/Auth.types";
    import { UserCredentials } from "auth/Credentials";
    import { ItunesServiceKey } from "auth/ServiceKey";
    import { AuthState } from "auth/Session";
    import { tryRestoringAuthStateFromUserCredentialsAsync } from "auth/utils/restore-session";
    interface AppStoreConnectLoginInfo {
        scnt: string;
        sessionId: string;
        isTFAEnabled: boolean;
    }
    export function resetInMemoryData(): void;
    export function logoutAsync(userCredentials?: Partial<Pick<UserCredentials, 'username'>>): Promise<void>;
    export function loginWithCookiesAsync(userCredentials: Pick<UserCredentials, 'cookies'>, options?: LoginOptions): Promise<AuthState | null>;
    export function loginAsync(userCredentials?: Partial<UserCredentials>, options?: LoginOptions): Promise<AuthState>;
    export function loginWithUserCredentialsAsync(userCredentials: UserCredentials, options?: LoginOptions): Promise<AuthState | null>;
    export function attemptLoginRequestAsync(credentials: UserCredentials, serviceKey: ItunesServiceKey): Promise<AppStoreConnectLoginInfo | {
        isTFAEnabled: false;
    }>;
    export { tryRestoringAuthStateFromUserCredentialsAsync, UserCredentials, LoginOptions };
}
declare module "itunes/Agreements" {
    import { SessionProvider } from "auth/Session";
    import { RequestContext } from "network/Request";
    type ITCAgreementStatus = 'ActivePendingUserInfo' | 'Active' | string;
    type ITCAgreementContractContentTypes = 'contractContentTypeDisplay.iOSFreeApps' | 'contractContentTypeDisplay.MacOSXFreeApplications' | string;
    /**
     * A value like AUS, BRA, USA, AUS
     */
    type ITCAgreementISOCode = string;
    export type ITCContractStatus = 'FREE_APP_AGREEMENT_OUTDATED' | 'PAID_APP_AGREEMENT_OUTDATED' | 'FREE_APP_AGREEMENT_ACTIVE' | 'PAID_APP_AGREEMENT_ACTIVE' | 'EXPIRED_MEMBERSHIP';
    export interface ITCAgreement {
        /**
         * @example 'a1234bcd-6767-4c9e-b5d7-35a4a66206f7'
         */
        contractId: string;
        /**
         * @example 'a1234bcd-00d9-4605-bd6b-637bfeb90550'
         */
        configId: string;
        /**
         * @example 5014 | 116
         */
        configVersion: number;
        /**
         * `false` if the contract needs to be updated.
         */
        configIsLatestVersion: boolean;
        /**
         * @example '2020-12-18T12:00:00Z' | ''
         */
        configValidUntilDate: string;
        /**
         * A string ID indicating the new contract agreement. `null` when the contract is up to date.
         *
         * @example 'a1234bcd-00d9-4605-bd6b-637bfeb90550'
         */
        availableNewContractConfigId: string | null;
        /**
         * @example 'MS123098050'
         */
        msNumber: string;
        /**
         * @example 'PurpleSoftware'
         */
        providerType: string;
        contractContentTypes: ITCAgreementContractContentTypes[];
        /**
         * @example 'contractConfigDisplay.FreeApplications' | 'contractConfigDisplay.PaidApplications'
         */
        contractType: string;
        countries: string[];
        contractTerritories: string[];
        status: ITCAgreementStatus;
        legalEntity: {
            /**
             * @example 'Evan Bacon'
             */
            legalEntityName: string;
            isOrganization: null | boolean;
        };
        applicableActions: {
            view: string[];
            edit: string[];
            setup: string[];
            extLink: string[];
        };
        isInEffect: boolean;
        isFreeContract: boolean;
        editLegalEntity: boolean;
        legalEntityErrors: unknown[];
        locale: null | string;
        agreementRequiresLegalEntity: boolean;
        /**
         * @example '2020-08-08T12:00:00Z'
         */
        effectiveDate: string;
        /**
         * @example '2021-02-22T03:59:59Z'
         */
        expirationDate: string;
        /**
         * A map of ISO codes to arrays.
         *
         * @example `{ BRA: [Array], USA: [Array], AUS: [Array] }`
         */
        countryTaxFormMap: Record<ITCAgreementISOCode, unknown[]>;
        selectedTaxCountries: ITCAgreementISOCode[];
        paidBookApplicationRevertable: boolean;
        hideBankSection: boolean;
        hideEditTaxFormSelection: boolean;
        hideTermsSection: boolean;
        isPreGracePeriod: boolean;
        isPostGracePeriod: boolean;
        canShowRoyalties: boolean;
        forAllLegalEntities: boolean;
        /**
         * @example 5014 | 116
         */
        version: number;
        /**
         * @example 1596937920000
         */
        created: number;
        disableTaxBankOperations: boolean;
    }
    export interface ITCContractMessage {
        id: 'contract_message' | 'returned_payment';
        group: string | 'Alert';
        /**
         * @example 'Developer Program Membership Expired'
         */
        subject: string;
        /**
         * @example `<b>Review the updated Paid Applications Schedule.</b><br />In order to update your existing apps, create new in-app purchases, and submit new apps to the App Store, the user with the Legal role (Account Holder) must review and accept the Paid Applications Schedule (Schedule 2 to the Apple Developer Program License Agreement) in the <a href="/agreements/#" target="_self">Agreements, Tax, and Banking</a> module.<br /><br /> To accept this agreement, they must have already accepted the latest version of the Apple Developer Program License Agreement in their <a href="http://developer.apple.com/membercenter/index.action">account on the developer website<a/>.<br />`
         */
        message: string;
        priority: unknown | null;
    }
    /**
     *
     * @param publicProviderId a string indicating the provider like `12a3bc45-1234-12a3-a123-1a2b3c45d6e7`
     */
    export function getAgreementsForPublicProviderAsync(context: RequestContext, { publicProviderId }: Pick<SessionProvider, 'publicProviderId'>): Promise<{
        agreements: ITCAgreement[];
    } | null>;
    /**
     * Query the agreements that are shown in ASC on the [agreements](https://appstoreconnect.apple.com/agreements/) page.
     *
     * @param publicProviderId a string indicating the provider like `12a3bc45-1234-12a3-a123-1a2b3c45d6e7`
     */
    export function getAgreementsAsync(context: Pick<RequestContext, 'providerId'>): Promise<{
        agreements: ITCAgreement[];
    } | null>;
    /**
     * Determine what the ITC user is capable of doing.
     * This is invoked in ASC when the user lands on the [apps](https://appstoreconnect.apple.com/apps) page.
     * The results are then used to warn the user that creating an app is not possible yet.
     */
    export function getCapabilitiesAsync(context: Pick<RequestContext, 'providerId'>): Promise<{
        contractStatus: ITCContractStatus;
    } | null>;
    /**
     * Return the messages provided by Apple for fixing contract issues,
     * This is invoked in ASC on the initial [home page](https://appstoreconnect.apple.com/) after authenticating.
     * The results are used to populate the alert boxes.
     *
     * When a user has admin status, and a contract needs to be renewed, the message will have links in it.
     * Otherwise the same message will be returned without links.
     *
     * Having messages doesn't mean the user cannot create apps, sometimes messages can be related to outages or other Apple developer news.
     *
     * @param context
     */
    export function getContractMessagesAsync(context: RequestContext): Promise<ITCContractMessage[] | null>;
}
declare module "utils/pagination" {
    export enum PaginationSort {
        NAME_ASCENDING = "name=asc",
        CERT_STATUS_CODE_ASCENDING = "certRequestStatusCode=asc"
    }
    /**
     * Handles paging automatically.
     *
     * @param action
     */
    export function paginateAsync<T>(action: (props: {
        pageNumber: number;
        pageSize: number;
    }) => Promise<T[]>, pageSize?: number): Promise<T[]>;
}
declare module "portal/Keys" {
    import { RequestContext } from "network/Request";
    interface AppStoreKeyService {
        name: string;
        id: string;
        configurations: unknown[];
    }
    export interface AppStoreKey {
        /**
         * ID
         * @example A11EE2I4OO
         */
        id: string;
        /**
         * The name of the key
         */
        name: string;
        canDownload: boolean;
        canRevoke: boolean;
        /**
         * List of services. Returned with `getKeyInfoAsync`
         */
        services: AppStoreKeyService[];
    }
    export enum AppStoreKeyServiceConfigID {
        /**
         * Apple Push Notification Service
         */
        APNS = "U27F4V844T",
        DEVICE_CHECK = "DQ8HTZ7739",
        MUSIC_KIT = "6A7HVUVQ3M"
    }
    /**
     * Find all keys available for the currently authenticated account.
     */
    export function getKeysAsync(context: RequestContext): Promise<AppStoreKey[]>;
    /**
     * Get all info for a specific key (including services array).
     *
     * @param id Key ID
     */
    export function getKeyInfoAsync(context: RequestContext, { id }: Pick<AppStoreKey, 'id'>): Promise<AppStoreKey>;
    /**
     * Download the contents of the key as a string.
     *
     * @param id Key ID
     * @returns string contents
     */
    export function downloadKeyAsync(context: RequestContext, { id }: Pick<AppStoreKey, 'id'>): Promise<string>;
    /**
     * Creates a new JWT / Key for making requests to services.
     *
     * @param name the name of the key
     * @param isApns whether the key should be able to make APNs requests
     * @param isDeviceCheck whether the key should be able to make DeviceCheck requests
     * @param musicId the Music Id id (the auto generated id, not the user specified identifier "music.com.etc...")
     *
     * @throws MaxKeysCreatedError -- too many keys have already been created
     */
    export function createKeyAsync(context: RequestContext, { name, isApns, isDeviceCheck, musicId, }: {
        name: string;
        isApns?: boolean;
        isDeviceCheck?: boolean;
        musicId?: string;
    }): Promise<AppStoreKey>;
    /**
     * Revoke a key to prevent further usage.
     *
     * @param id Key ID
     */
    export function revokeKeyAsync(context: RequestContext, { id }: Pick<AppStoreKey, 'id'>): Promise<void>;
    export class MaxKeysCreatedError extends Error {
        constructor(services: string[]);
    }
}
declare module "connect/ClientAPI" {
    import { AxiosResponse } from 'axios';
    import { ParsingOptions, RequestContext, RequestProps } from "network/Request";
    export interface ClientAPI<Response, Props extends RequestProps = RequestProps> {
        getHostname(context: RequestContext): string;
        requestAsync: <T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: Props, options?: ParsingOptions) => Promise<R>;
        requestAndParseAsync: <T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: Props, options?: ParsingOptions) => Promise<Response | null>;
        parseResponse: <T>(context: RequestContext, response: AxiosResponse<T>) => Response | null;
    }
}
declare module "connect/models/ConnectModel" {
    import { RequestContext } from "network/Request";
    type ConnectModelAttributes = Record<string, any>;
    export interface ConnectModelData {
        type: string;
        id: string;
        relationships?: Record<string, any>;
        attributes?: ConnectModelAttributes;
    }
    /**
     * Represents a complex object type returned from the App Store Connect API.
     */
    export class ConnectModel<T extends ConnectModelAttributes = ConnectModelAttributes> {
        context: RequestContext;
        id: string;
        attributes: T;
        constructor(context: RequestContext, id: string, attributes: T);
        updateAttributes(attributes: Partial<T>): void;
    }
    export function pushModel(model: typeof ConnectModel | any): void;
    export function parseModels(context: RequestContext, { data, included, }: {
        data: ConnectModelData | ConnectModelData[];
        included: ConnectModelData[];
    }): ConnectModel[];
}
declare module "connect/ConnectResponse" {
    import { RequestContext } from "network/Request";
    import { ClientAPI } from "connect/ClientAPI";
    export class ConnectResponse {
        private context;
        data: any;
        status: number;
        private getRequestAsync;
        constructor(context: RequestContext, data: any, status: number, getRequestAsync: ClientAPI<ConnectResponse>['requestAndParseAsync']);
        getNextUrl(): string | null;
        fetchNextPageAsync(): Promise<ConnectResponse | null>;
        fetchNextPagesAsync(count?: number): Promise<ConnectResponse[]>;
        fetchAllPagesAsync(): Promise<ConnectResponse[]>;
        inflate(): any[];
    }
}
declare module "connect/ConnectAPI" {
    import { AxiosResponse } from 'axios';
    import { ParsingOptions, RequestContext, RequestProps } from "network/Request";
    import { ClientAPI } from "connect/ClientAPI";
    import { ConnectResponse } from "connect/ConnectResponse";
    import { ConnectModel, ConnectModelData } from "connect/models/ConnectModel";
    export type ConnectQueryFilter<T, K extends keyof T> = Partial<{
        [P in K]: T[P] | T[P][];
    } & {
        id?: string;
    }>;
    export interface ConnectQueryParams<F extends Record<string, any> = Record<string, any>> {
        filter?: F;
        fields?: F;
        includes?: string[];
        limit?: number;
        sort?: string;
        cursor?: string;
    }
    interface AssociatedErrorData {
        id: string;
        status: string;
        code: string;
        title: string;
        detail?: string;
        source?: {
            pointer: string;
        };
    }
    interface AssociatedErrors extends AssociatedErrorData {
        meta: {
            associatedErrors: Record<string, AssociatedErrorData[]>;
        };
    }
    export class ConnectClientAPI implements ClientAPI<ConnectResponse> {
        getHostname(context: RequestContext): string;
        requestFromAPIAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: RequestProps, options?: ParsingOptions): Promise<R>;
        getSupportedContext(context: RequestContext, request: RequestProps, options: ParsingOptions): RequestContext;
        requestAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: RequestProps, options?: ParsingOptions): Promise<R>;
        fetchAllModelsAsync<M extends ConnectModel = ConnectModel, T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: RequestProps, options?: ParsingOptions): Promise<M[]>;
        fetchSingleModelAsync<M extends ConnectModel = ConnectModel, T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: RequestProps, options?: ParsingOptions): Promise<M>;
        patchModelAsync<M extends ConnectModel = ConnectModel>(context: RequestContext, { type, id, data, }: {
            type: string;
            id: string;
            data: ConnectModelData | ConnectModelData[];
        }): Promise<M>;
        requestAndParseAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: RequestProps, options?: ParsingOptions): Promise<ConnectResponse>;
        deleteModelAsync(context: RequestContext, { type, id, }: {
            type: string;
            id: string;
        }): Promise<void>;
        createDeleteMethod(type: string): (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        createInfoMethod<T extends ConnectModel>({ type, defaultQuery, }: {
            type: string;
            defaultQuery?: ConnectQueryParams;
        }): (context: RequestContext, props: {
            id: string;
            query?: ConnectQueryParams;
        }) => Promise<T>;
        createGetMethod<T extends ConnectModel, Filter extends Record<string, any> = Record<string, any>>({ type, defaultQuery, }: {
            type: string;
            defaultQuery?: ConnectQueryParams<Filter>;
        }): (context: RequestContext, props?: {
            query?: ConnectQueryParams<Filter>;
        }) => Promise<T[]>;
        createModelAsync<T>(context: RequestContext, { included, ...data }: Omit<ConnectModelData, 'id'> & {
            included?: ConnectModelData[];
        }, options?: ParsingOptions): Promise<T>;
        parseResponse<T>(context: RequestContext, response: AxiosResponse<T>): ConnectResponse;
    }
    export const client: ConnectClientAPI;
    export function filterQueryParamsWithDefaults(query?: ConnectQueryParams, defaultQuery?: ConnectQueryParams): Record<string, any>;
    export function filterQueryParams({ fields, filter, includes, limit, sort, cursor, }?: ConnectQueryParams): Record<string, any>;
    export function parseConnectErrors(errors: AssociatedErrors[]): string;
}
declare module "connect/IrisAPI" {
    import { AxiosResponse } from 'axios';
    import { ParsingOptions, RequestContext, RequestProps } from "network/Request";
    import { ConnectClientAPI } from "connect/ConnectAPI";
    class IrisClientAPI extends ConnectClientAPI {
        getHostname(context: RequestContext): string;
        requestFromAPIAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: RequestProps, options?: ParsingOptions): Promise<R>;
    }
    export const irisClient: IrisClientAPI;
}
declare module "connect/models/AgeRatingDeclaration" {
    import { ConnectModel } from "connect/models/ConnectModel";
    export enum Rating {
        NONE = "NONE",
        INFREQUENT_OR_MILD = "INFREQUENT_OR_MILD",
        FREQUENT_OR_INTENSE = "FREQUENT_OR_INTENSE"
    }
    export enum KidsAge {
        FIVE_AND_UNDER = "FIVE_AND_UNDER",
        SIX_TO_EIGHT = "SIX_TO_EIGHT",
        NINE_TO_ELEVEN = "NINE_TO_ELEVEN"
    }
    export interface AgeRatingDeclarationProps {
        alcoholTobaccoOrDrugUseOrReferences: Rating | null;
        gamblingSimulated: Rating | null;
        gambling: boolean | null;
        contests: Rating | null;
        medicalOrTreatmentInformation: Rating | null;
        profanityOrCrudeHumor: Rating | null;
        sexualContentGraphicAndNudity: Rating | null;
        sexualContentOrNudity: Rating | null;
        horrorOrFearThemes: Rating | null;
        matureOrSuggestiveThemes: Rating | null;
        violenceCartoonOrFantasy: Rating | null;
        violenceRealisticProlongedGraphicOrSadistic: Rating | null;
        violenceRealistic: Rating | null;
        gamblingAndContests: boolean | null;
        unrestrictedWebAccess: boolean | null;
        seventeenPlus: boolean | null;
        kidsAgeBand: KidsAge | null;
    }
    /**
     * Used for updating basic metadata.
     */
    export class AgeRatingDeclaration extends ConnectModel<AgeRatingDeclarationProps> {
        static type: string;
        updateAsync(options: Partial<AgeRatingDeclarationProps>): Promise<AgeRatingDeclaration>;
    }
}
declare module "connect/models/ContentProvider" {
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface ContentProviderProps {
        /**
         * @example "Evan Bacon"
         */
        name: string;
        /**
         * @example "PURPLESOFTWARE"
         */
        contentType: string;
        /**
         * @example "ACTIVE"
         */
        status: string;
        autoRenew: boolean;
        /**
         * @example "QQ57RJ5UTD" (Team ID)
         */
        organizationId: string;
    }
    export class ContentProvider extends ConnectModel<ContentProviderProps> {
        static type: string;
        static getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        } | undefined) => Promise<ContentProvider[]>;
    }
}
declare module "connect/models/Territory" {
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface TerritoryProps {
        /**
         * @example 'USD'
         */
        currency: string;
    }
    export class Territory extends ConnectModel<TerritoryProps> {
        static type: string;
        static getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        } | undefined) => Promise<Territory[]>;
    }
}
declare module "connect/models/User" {
    import { ConnectQueryFilter } from "connect/ConnectAPI";
    import { ConnectModel } from "connect/models/ConnectModel";
    import { Territory } from "connect/models/Territory";
    export enum UserRole {
        ADMIN = "ADMIN",
        FINANCE = "FINANCE",
        TECHNICAL = "TECHNICAL",
        ACCOUNT_HOLDER = "ACCOUNT_HOLDER",
        READ_ONLY = "READ_ONLY",
        SALES = "SALES",
        MARKETING = "MARKETING",
        APP_MANAGER = "APP_MANAGER",
        DEVELOPER = "DEVELOPER",
        ACCESS_TO_REPORTS = "ACCESS_TO_REPORTS",
        CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
        CREATE_APPS = "CREATE_APPS",
        CLOUD_MANAGED_DEVELOPER_ID = "CLOUD_MANAGED_DEVELOPER_ID",
        CLOUD_MANAGED_APP_DISTRIBUTION = "CLOUD_MANAGED_APP_DISTRIBUTION"
    }
    export interface UserProps {
        username: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        preferredCurrencyTerritory: Territory | null;
        agreedToTerms: boolean | null;
        roles: UserRole | null;
        allAppsVisible: boolean;
        provisioningAllowed: boolean;
        emailVettingRequired: boolean;
        notifications: unknown | null;
    }
    export type UserQueryFilter = ConnectQueryFilter<UserProps & {
        /**
         * `App` id
         */
        visibleApps: string;
    }, 'roles' | 'username' | 'visibleApps'>;
    export class User extends ConnectModel<UserProps> {
        static type: string;
        static getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                username: string | (string | null)[] | null;
                roles: UserRole | (UserRole | null)[] | null;
                visibleApps: string | string[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<User[]>;
        /**
         *
         * @param id `User` id (ex: UNHB5PT4MA)
         */
        static infoAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<User>;
        static deleteAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
        }) => Promise<void>;
        updateAsync(attributes: Partial<UserProps>): Promise<User>;
    }
}
declare module "connect/models/ApiKey" {
    import { RequestContext } from "network/Request";
    import { ConnectModel } from "connect/models/ConnectModel";
    import { ContentProvider } from "connect/models/ContentProvider";
    import { User, UserRole } from "connect/models/User";
    export enum ApiKeyType {
        /**
         * App Store Connect Token
         */
        PUBLIC_API = "PUBLIC_API"
    }
    export interface ApiKeyProps {
        /**
         * If the token has been revoked or not.
         */
        isActive: boolean;
        /**
         * @example  "ejb-apple-utils-admin"
         */
        nickname: string;
        /**
         * @example "2021-06-28T12:30:41-07:00"
         */
        lastUsed: string;
        /**
         * @example "2021-06-28T14:48:51.403-07:00"
         */
        revokingDate: null | string;
        /**
         * A key can only be downloaded once, right after it's created.
         */
        canDownload: boolean;
        /**
         * The contents of a private key, this can only be downloaded once.
         * @default "XXX="
         */
        privateKey: null | string;
        /**
         * @example ["ADMIN"]
         */
        roles: UserRole[];
        /**
         * If the key has access to all apps.
         */
        allAppsVisible: boolean;
        /**
         * Unknown
         */
        keyType: ApiKeyType;
        createdBy?: User;
        revokedBy?: User;
        provider?: ContentProvider;
    }
    export class ApiKey extends ConnectModel<ApiKeyProps> {
        static type: string;
        static DEFAULT_INCLUDES: string[];
        static getAsync: (context: RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        } | undefined) => Promise<ApiKey[]>;
        static infoAsync: (context: RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<ApiKey>;
        static createAsync(context: RequestContext, attributes: Pick<ApiKeyProps, 'nickname' | 'roles' | 'allAppsVisible' | 'keyType'>): Promise<ApiKey>;
        /**
         * Download the private key as a PEM string
         */
        downloadAsync(): Promise<string | null>;
        /**
         * Make the token unusable forever.
         */
        revokeAsync(): Promise<ApiKey>;
    }
}
declare module "connect/models/AppDataUsageGrouping" {
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppDataUsageGroupingProps {
        deleted: boolean;
    }
    export class AppDataUsageGrouping extends ConnectModel<AppDataUsageGroupingProps> {
        static type: string;
        static deleteAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
        }) => Promise<void>;
        deleteAsync(): Promise<void>;
    }
}
declare module "connect/models/AppDataUsageCategory" {
    import { AppDataUsageGrouping } from "connect/models/AppDataUsageGrouping";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppDataUsageCategoryProps {
        deleted: boolean;
        grouping: AppDataUsageGrouping;
    }
    export enum AppDataUsageCategoryId {
        PAYMENT_INFORMATION = "PAYMENT_INFORMATION",
        CREDIT_AND_FRAUD = "CREDIT_AND_FRAUD",
        OTHER_FINANCIAL_INFO = "OTHER_FINANCIAL_INFO",
        PRECISE_LOCATION = "PRECISE_LOCATION",
        SENSITIVE_INFO = "SENSITIVE_INFO",
        PHYSICAL_ADDRESS = "PHYSICAL_ADDRESS",
        EMAIL_ADDRESS = "EMAIL_ADDRESS",
        NAME = "NAME",
        PHONE_NUMBER = "PHONE_NUMBER",
        OTHER_CONTACT_INFO = "OTHER_CONTACT_INFO",
        CONTACTS = "CONTACTS",
        EMAILS_OR_TEXT_MESSAGES = "EMAILS_OR_TEXT_MESSAGES",
        PHOTOS_OR_VIDEOS = "PHOTOS_OR_VIDEOS",
        AUDIO = "AUDIO",
        GAMEPLAY_CONTENT = "GAMEPLAY_CONTENT",
        CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
        OTHER_USER_CONTENT = "OTHER_USER_CONTENT",
        BROWSING_HISTORY = "BROWSING_HISTORY",
        SEARCH_HISTORY = "SEARCH_HISTORY",
        USER_ID = "USER_ID",
        DEVICE_ID = "DEVICE_ID",
        PURCHASE_HISTORY = "PURCHASE_HISTORY",
        PRODUCT_INTERACTION = "PRODUCT_INTERACTION",
        ADVERTISING_DATA = "ADVERTISING_DATA",
        OTHER_USAGE_DATA = "OTHER_USAGE_DATA",
        CRASH_DATA = "CRASH_DATA",
        PERFORMANCE_DATA = "PERFORMANCE_DATA",
        OTHER_DIAGNOSTIC_DATA = "OTHER_DIAGNOSTIC_DATA",
        OTHER_DATA = "OTHER_DATA",
        HEALTH = "HEALTH",
        FITNESS = "FITNESS",
        COARSE_LOCATION = "COARSE_LOCATION"
    }
    export class AppDataUsageCategory extends ConnectModel<AppDataUsageCategoryProps> {
        static type: string;
        static getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        } | undefined) => Promise<AppDataUsageCategory[]>;
        static deleteAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
        }) => Promise<void>;
        deleteAsync(): Promise<void>;
    }
}
declare module "connect/models/AppDataUsageDataProtection" {
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppDataUsageDataProtectionProps {
        deleted: boolean;
    }
    export enum AppDataUsageDataProtectionId {
        DATA_USED_TO_TRACK_YOU = "DATA_USED_TO_TRACK_YOU",
        DATA_LINKED_TO_YOU = "DATA_LINKED_TO_YOU",
        DATA_NOT_LINKED_TO_YOU = "DATA_NOT_LINKED_TO_YOU",
        DATA_NOT_COLLECTED = "DATA_NOT_COLLECTED"
    }
    export class AppDataUsageDataProtection extends ConnectModel<AppDataUsageDataProtectionProps> {
        static type: string;
        static getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        } | undefined) => Promise<AppDataUsageDataProtection[]>;
        static deleteAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
        }) => Promise<void>;
        deleteAsync(): Promise<void>;
    }
}
declare module "connect/models/AppDataUsagePurpose" {
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppDataUsagePurposeProps {
        deleted: boolean;
    }
    export enum AppDataUsagePurposeId {
        THIRD_PARTY_ADVERTISING = "THIRD_PARTY_ADVERTISING",
        DEVELOPERS_ADVERTISING = "DEVELOPERS_ADVERTISING",
        ANALYTICS = "ANALYTICS",
        PRODUCT_PERSONALIZATION = "PRODUCT_PERSONALIZATION",
        APP_FUNCTIONALITY = "APP_FUNCTIONALITY",
        OTHER_PURPOSES = "OTHER_PURPOSES"
    }
    export class AppDataUsagePurpose extends ConnectModel<AppDataUsagePurposeProps> {
        static type: string;
        static getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        } | undefined) => Promise<AppDataUsagePurpose[]>;
        static deleteAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
        }) => Promise<void>;
        deleteAsync(): Promise<void>;
    }
}
declare module "connect/models/AppDataUsage" {
    import { RequestContext } from "network/Request";
    import { AppDataUsageCategory } from "connect/models/AppDataUsageCategory";
    import { AppDataUsageDataProtection } from "connect/models/AppDataUsageDataProtection";
    import { AppDataUsageGrouping } from "connect/models/AppDataUsageGrouping";
    import { AppDataUsagePurpose } from "connect/models/AppDataUsagePurpose";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppDataUsageProps {
        category?: AppDataUsageCategory;
        grouping?: AppDataUsageGrouping;
        purpose?: AppDataUsagePurpose;
        dataProtection?: AppDataUsageDataProtection;
    }
    export class AppDataUsage extends ConnectModel<AppDataUsageProps> {
        static type: string;
        static DEFAULT_INCLUDES: string[];
        /**
         *
         * @param id `App` id
         * @param appDataUsageCategory `AppDataUsageCategory` id (`AppDataUsageCategoryId`)
         * @param appDataUsageProtection `AppDataUsageProtection` id (`AppDataUsageProtectionId`)
         * @param appDataUsagePurpose `AppDataUsagePurpose` id (`AppDataUsagePurposeId`)
         */
        static createAsync(context: RequestContext, { id, appDataUsageCategory, appDataUsageProtection, appDataUsagePurpose, }: {
            id: string;
            appDataUsageCategory?: string;
            appDataUsageProtection?: string;
            appDataUsagePurpose?: string;
        }): Promise<AppDataUsage>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        deleteAsync(): Promise<void>;
    }
}
declare module "connect/models/AppDataUsagesPublishState" {
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppDataUsagesPublishStateProps {
        published: boolean;
        /**
         * @example "2021-06-26T14:31:32.201-07:00"
         */
        lastPublished: string;
        /**
         * @example "Evan Bacon"
         */
        lastPublishedBy: string;
    }
    export class AppDataUsagesPublishState extends ConnectModel<AppDataUsagesPublishStateProps> {
        static type: string;
        updateAsync(options: Pick<AppDataUsagesPublishStateProps, 'published'>): Promise<AppDataUsagesPublishState>;
    }
}
declare module "connect/ProvisioningAPI" {
    import { AxiosResponse } from 'axios';
    import { ParsingOptions, RequestContext, RequestProps } from "network/Request";
    import { ConnectClientAPI } from "connect/ConnectAPI";
    class ProvisioningClientAPI extends ConnectClientAPI {
        getHostname(context: RequestContext): string;
        requestAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: RequestProps, options?: ParsingOptions): Promise<R>;
        /**
         * Used for web session requests (username/password auth).
         *
         * @param request
         * @param options
         */
        proxyRequestAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: RequestProps, options?: ParsingOptions): Promise<R>;
    }
    export const provisioningClient: ProvisioningClientAPI;
}
declare module "connect/models/CapabilityConnectModel" {
    import { RequestContext } from "network/Request";
    import { ConnectQueryFilter } from "connect/ConnectAPI";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface CapabilityConnectModelProps {
        /**
         * A string that's always prefixed with a set value like `merchant.`, `group.`, or `iCloud.`.
         *
         * @example 'merchant.com.example.development'
         */
        identifier: string;
        /**
         * Apple Team ID.
         *
         * @example 'QQ57RJ5UTD'
         */
        prefix: string;
        /**
         * @example "Example Development ID"
         */
        name: string;
        canEdit?: boolean;
        canDelete?: boolean;
    }
    export type CapabilityConnectQueryFilter<Props extends CapabilityConnectModelProps = CapabilityConnectModelProps> = ConnectQueryFilter<Props, 'identifier' | 'name'>;
    export function createCapabilityConnectModel<Props extends CapabilityConnectModelProps = CapabilityConnectModelProps>({ type, prefix }: {
        type: string;
        prefix: string;
    }): {
        new (context: RequestContext, id: string, attributes: Props): {
            deleteAsync(): Promise<void>;
            context: RequestContext;
            id: string;
            attributes: Props;
            updateAttributes(attributes: Partial<Props>): void;
        };
        type: string;
        getAsync: (context: RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                name: Props["name"] | Props["name"][];
                identifier: Props["identifier"] | Props["identifier"][];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<(ConnectModel<Props> & {
            deleteAsync(): Promise<void>;
            context: RequestContext;
            id: string;
            attributes: Props;
            updateAttributes(attributes: Partial<Props>): void;
        })[]>;
        /**
         *
         * @param id `CapabilityConnectModel` id (ex: UNHB5PT4MA)
         */
        infoAsync: (context: RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<ConnectModel<Props> & {
            deleteAsync(): Promise<void>;
            context: RequestContext;
            id: string;
            attributes: Props;
            updateAttributes(attributes: Partial<Props>): void;
        }>;
        /**
         * Create a new Capability Connect ID.
         * @param context
         * @param props.identifier The ID value. This must be prefixed with a set value like `merchant.`, `group.`, or `iCloud.`.
         * @param props.name If the name is undefined, a default value emulating Xcode's default will be used.
         * @returns
         */
        createAsync(context: RequestContext, { name, identifier, }: {
            name?: string | undefined;
            identifier: CapabilityConnectModelProps['identifier'];
        }): Promise<ConnectModel<Props> & {
            deleteAsync(): Promise<void>;
            context: RequestContext;
            id: string;
            attributes: Props;
            updateAttributes(attributes: Partial<Props>): void;
        }>;
        deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
    };
    export function createValidCapabilityName({ name, identifier, prefix, }: {
        name?: string;
        identifier: string;
        prefix: string;
    }): string;
}
declare module "connect/models/AppGroup" {
    import { CapabilityConnectModelProps, CapabilityConnectQueryFilter } from "connect/models/CapabilityConnectModel";
    export type AppGroupProps = CapabilityConnectModelProps;
    export type AppGroupQueryFilter = CapabilityConnectQueryFilter;
    const AppGroup_base: {
        new (context: import("AppStoreConnect").RequestContext, id: string, attributes: CapabilityConnectModelProps): {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        };
        type: string;
        getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                name: string | string[];
                identifier: string | string[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<(import("connect/models/ConnectModel").ConnectModel<CapabilityConnectModelProps> & {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        })[]>;
        infoAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<import("connect/models/ConnectModel").ConnectModel<CapabilityConnectModelProps> & {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        }>;
        createAsync(context: import("AppStoreConnect").RequestContext, { name, identifier, }: {
            name?: string | undefined;
            identifier: string;
        }): Promise<import("connect/models/ConnectModel").ConnectModel<CapabilityConnectModelProps> & {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        }>;
        deleteAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
        }) => Promise<void>;
    };
    export class AppGroup extends AppGroup_base {
    }
}
declare module "connect/models/CloudContainer" {
    import { CapabilityConnectModelProps, CapabilityConnectQueryFilter } from "connect/models/CapabilityConnectModel";
    export type CloudContainerProps = CapabilityConnectModelProps;
    export type CloudContainerQueryFilter = CapabilityConnectQueryFilter;
    const CloudContainer_base: {
        new (context: import("AppStoreConnect").RequestContext, id: string, attributes: CapabilityConnectModelProps): {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        };
        type: string;
        getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                name: string | string[];
                identifier: string | string[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<(import("connect/models/ConnectModel").ConnectModel<CapabilityConnectModelProps> & {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        })[]>;
        infoAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<import("connect/models/ConnectModel").ConnectModel<CapabilityConnectModelProps> & {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        }>;
        createAsync(context: import("AppStoreConnect").RequestContext, { name, identifier, }: {
            name?: string | undefined;
            identifier: string;
        }): Promise<import("connect/models/ConnectModel").ConnectModel<CapabilityConnectModelProps> & {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        }>;
        deleteAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
        }) => Promise<void>;
    };
    export class CloudContainer extends CloudContainer_base {
    }
}
declare module "connect/models/MerchantId" {
    import { CapabilityConnectModelProps, CapabilityConnectQueryFilter } from "connect/models/CapabilityConnectModel";
    export type MerchantIdProps = CapabilityConnectModelProps;
    export type MerchantIdQueryFilter = CapabilityConnectQueryFilter;
    const MerchantId_base: {
        new (context: import("AppStoreConnect").RequestContext, id: string, attributes: CapabilityConnectModelProps): {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        };
        type: string;
        getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                name: string | string[];
                identifier: string | string[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<(import("connect/models/ConnectModel").ConnectModel<CapabilityConnectModelProps> & {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        })[]>;
        infoAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<import("connect/models/ConnectModel").ConnectModel<CapabilityConnectModelProps> & {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        }>;
        createAsync(context: import("AppStoreConnect").RequestContext, { name, identifier, }: {
            name?: string | undefined;
            identifier: string;
        }): Promise<import("connect/models/ConnectModel").ConnectModel<CapabilityConnectModelProps> & {
            deleteAsync(): Promise<void>;
            context: import("AppStoreConnect").RequestContext;
            id: string;
            attributes: CapabilityConnectModelProps;
            updateAttributes(attributes: Partial<CapabilityConnectModelProps>): void;
        }>;
        deleteAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
        }) => Promise<void>;
    };
    export class MerchantId extends MerchantId_base {
    }
}
declare module "connect/models/BundleIdCapability" {
    import { AppGroup } from "connect/models/AppGroup";
    import { CloudContainer } from "connect/models/CloudContainer";
    import { ConnectModel, ConnectModelData } from "connect/models/ConnectModel";
    import { MerchantId } from "connect/models/MerchantId";
    export enum CapabilityType {
        ACCESS_WIFI = "ACCESS_WIFI_INFORMATION",
        APP_ATTEST = "APP_ATTEST",
        APP_GROUP = "APP_GROUPS",
        APPLE_PAY = "APPLE_PAY",
        ASSOCIATED_DOMAINS = "ASSOCIATED_DOMAINS",
        CLASS_KIT = "CLASSKIT",
        AUTO_FILL_CREDENTIAL = "AUTOFILL_CREDENTIAL_PROVIDER",
        DATA_PROTECTION = "DATA_PROTECTION",
        FAMILY_CONTROLS = "FAMILY_CONTROLS",
        GAME_CENTER = "GAME_CENTER",
        GROUP_ACTIVITIES = "GROUP_ACTIVITIES",
        HEALTH_KIT = "HEALTHKIT",
        HEALTH_KIT_RECALIBRATE_ESTIMATES = "HEALTHKIT_RECALIBRATE_ESTIMATES",
        HOME_KIT = "HOMEKIT",
        HOT_SPOT = "HOT_SPOT",
        ICLOUD = "ICLOUD",
        IN_APP_PURCHASE = "IN_APP_PURCHASE",
        INTER_APP_AUDIO = "INTER_APP_AUDIO",
        MULTIPATH = "MULTIPATH",
        NETWORK_EXTENSIONS = "NETWORK_EXTENSIONS",
        USER_MANAGEMENT = "USER_MANAGEMENT",
        NETWORK_CUSTOM_PROTOCOL = "NETWORK_CUSTOM_PROTOCOL",
        FILE_PROVIDER_TESTING_MODE = "FILEPROVIDER_TESTINGMODE",
        SYSTEM_EXTENSION_INSTALL = "SYSTEM_EXTENSION_INSTALL",
        MDM_MANAGED_ASSOCIATED_DOMAINS = "MDM_MANAGED_ASSOCIATED_DOMAINS",
        HLS_LOW_LATENCY = "COREMEDIA_HLS_LOW_LATENCY",
        HLS_INTERSTITIAL_PREVIEW = "HLS_INTERSTITIAL_PREVIEW",
        NFC_TAG_READING = "NFC_TAG_READING",
        PERSONAL_VPN = "PERSONAL_VPN",
        PUSH_NOTIFICATIONS = "PUSH_NOTIFICATIONS",
        USER_NOTIFICATIONS_TIME_SENSITIVE = "USERNOTIFICATIONS_TIMESENSITIVE",
        USER_NOTIFICATIONS_COMMUNICATION = "USERNOTIFICATIONS_COMMUNICATION",
        SIRI_KIT = "SIRIKIT",
        WALLET = "WALLET",
        WIRELESS_ACCESSORY = "WIRELESS_ACCESSORY_CONFIGURATION",
        MAPS = "MAPS",
        APPLE_ID_AUTH = "APPLE_ID_AUTH",
        FONT_INSTALLATION = "FONT_INSTALLATION",
        EXTENDED_VIRTUAL_ADDRESSING = "EXTENDED_VIRTUAL_ADDRESSING",
        ENABLED_FOR_MAC = "ENABLED_FOR_MAC",
        MARZIPAN = "MARZIPAN"
    }
    export enum CapabilityTypeOption {
        ON = "ON",
        OFF = "OFF"
    }
    export enum CapabilityTypeDataProtectionOption {
        COMPLETE_PROTECTION = "COMPLETE_PROTECTION",
        PROTECTED_UNLESS_OPEN = "PROTECTED_UNLESS_OPEN",
        PROTECTED_UNTIL_FIRST_USER_AUTH = "PROTECTED_UNTIL_FIRST_USER_AUTH"
    }
    export enum CapabilityTypeAppleAuthOption {
        PRIMARY_APP_CONSENT = "PRIMARY_APP_CONSENT"
    }
    export enum CapabilityTypeICloudOption {
        XCODE_5 = "XCODE_5",
        XCODE_6 = "XCODE_6"
    }
    export interface UpdateCapabilityRelationshipProps {
        /**
         * A list of opaque IDs for MerchantIds.
         */
        merchantIds?: string[];
        /**
         * A list of opaque IDs for AppGroups.
         */
        appGroups?: string[];
        /**
         * A list of opaque IDs for CloudContainers.
         */
        cloudContainers?: string[];
    }
    export interface CapabilityOptionMap {
        [CapabilityType.ACCESS_WIFI]: CapabilityTypeOption;
        [CapabilityType.APP_ATTEST]: CapabilityTypeOption;
        [CapabilityType.APP_GROUP]: CapabilityTypeOption;
        [CapabilityType.APPLE_ID_AUTH]: CapabilityTypeOption | CapabilityTypeAppleAuthOption;
        [CapabilityType.APPLE_PAY]: CapabilityTypeOption;
        [CapabilityType.ASSOCIATED_DOMAINS]: CapabilityTypeOption;
        [CapabilityType.AUTO_FILL_CREDENTIAL]: CapabilityTypeOption;
        [CapabilityType.CLASS_KIT]: CapabilityTypeOption;
        [CapabilityType.DATA_PROTECTION]: CapabilityTypeOption | CapabilityTypeDataProtectionOption;
        [CapabilityType.ENABLED_FOR_MAC]: CapabilityTypeOption;
        [CapabilityType.EXTENDED_VIRTUAL_ADDRESSING]: CapabilityTypeOption;
        [CapabilityType.FAMILY_CONTROLS]: CapabilityTypeOption;
        [CapabilityType.FILE_PROVIDER_TESTING_MODE]: CapabilityTypeOption;
        [CapabilityType.FONT_INSTALLATION]: CapabilityTypeOption;
        [CapabilityType.GAME_CENTER]: CapabilityTypeOption;
        [CapabilityType.GROUP_ACTIVITIES]: CapabilityTypeOption;
        [CapabilityType.HEALTH_KIT]: CapabilityTypeOption;
        [CapabilityType.HEALTH_KIT_RECALIBRATE_ESTIMATES]: CapabilityTypeOption;
        [CapabilityType.HLS_INTERSTITIAL_PREVIEW]: CapabilityTypeOption;
        [CapabilityType.HLS_LOW_LATENCY]: CapabilityTypeOption;
        [CapabilityType.HOME_KIT]: CapabilityTypeOption;
        [CapabilityType.HOT_SPOT]: CapabilityTypeOption;
        [CapabilityType.ICLOUD]: CapabilityTypeOption | CapabilityTypeICloudOption;
        [CapabilityType.IN_APP_PURCHASE]: CapabilityTypeOption;
        [CapabilityType.INTER_APP_AUDIO]: CapabilityTypeOption;
        [CapabilityType.MDM_MANAGED_ASSOCIATED_DOMAINS]: CapabilityTypeOption;
        [CapabilityType.MULTIPATH]: CapabilityTypeOption;
        [CapabilityType.NETWORK_CUSTOM_PROTOCOL]: CapabilityTypeOption;
        [CapabilityType.NETWORK_EXTENSIONS]: CapabilityTypeOption;
        [CapabilityType.NFC_TAG_READING]: CapabilityTypeOption;
        [CapabilityType.PERSONAL_VPN]: CapabilityTypeOption;
        [CapabilityType.PUSH_NOTIFICATIONS]: CapabilityTypeOption;
        [CapabilityType.SIRI_KIT]: CapabilityTypeOption;
        [CapabilityType.SYSTEM_EXTENSION_INSTALL]: CapabilityTypeOption;
        [CapabilityType.USER_NOTIFICATIONS_COMMUNICATION]: CapabilityTypeOption;
        [CapabilityType.USER_NOTIFICATIONS_TIME_SENSITIVE]: CapabilityTypeOption;
        [CapabilityType.WALLET]: CapabilityTypeOption;
        [CapabilityType.WIRELESS_ACCESSORY]: CapabilityTypeOption;
        [CapabilityType.MAPS]: CapabilityTypeOption;
        [CapabilityType.MARZIPAN]: CapabilityTypeOption;
        [CapabilityType.USER_MANAGEMENT]: CapabilityTypeOption;
    }
    enum CapabilitySettingKey {
        ICLOUD_VERSION = "ICLOUD_VERSION",
        DATA_PROTECTION_PERMISSION_LEVEL = "DATA_PROTECTION_PERMISSION_LEVEL",
        APPLE_ID_AUTH_APP_CONSENT = "TIBURON_APP_CONSENT"
    }
    interface CapabilitySetting {
        key: CapabilitySettingKey;
        options: CapabilityOption[];
        name?: string;
        description?: string;
        enabledByDefault?: boolean;
        visible?: boolean;
        allowedInstances?: 'ENTRY' | 'SINGLE' | 'MULTIPLE';
        minInstances?: number;
    }
    interface CapabilityOption {
        key: CapabilityTypeOption | CapabilityTypeDataProtectionOption | CapabilityTypeICloudOption | CapabilityTypeAppleAuthOption;
        enabled: boolean;
        name?: string;
        description?: string;
        enabledByDefault?: boolean;
        supportsWildcard?: boolean;
    }
    interface BundleIdCapabilityProps {
        capabilityType?: CapabilityType;
        settings: CapabilitySetting[] | null;
        appGroups?: AppGroup[];
        cloudContainers?: CloudContainer[];
        merchantIds?: MerchantId[];
        certificates?: unknown[];
        relatedAppConsentBundleIds?: unknown[];
    }
    export function createCapabilityRelationship<T extends CapabilityType>({ capabilityType, option, relationships, }: {
        capabilityType: T;
        option: CapabilityOptionMap[T];
        relationships?: UpdateCapabilityRelationshipProps;
    }): Partial<ConnectModelData>;
    export class BundleIdCapability extends ConnectModel<BundleIdCapabilityProps> {
        static type: string;
        /**
         *
         * @param id `BundleIdCapability` id (formatted like bundleIdId_BundleIdCapabilityType)
         */
        static deleteAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
        }) => Promise<void>;
        isType(type: CapabilityType): boolean;
    }
}
declare module "portal/Profiles" {
    import { RequestContext } from "network/Request";
    import { DevPortalAppIDType } from "portal/PortalAPI";
    export enum AppStoreProvisioningProfileKind {
        DEVELOPMENT = "limited",
        APP_STORE = "store",
        AD_HOC = "adhoc",
        IN_HOUSE = "inhouse",
        /**
         * Mac-only
         */
        DIRECT = "direct"
    }
    type AppStoreProvisioningProfileType = 'iOS Distribution' | 'iOS Development';
    type AppStoreProvisioningProfilePlatform = 'ios' | 'mac' | string;
    type AppStoreProvisioningProfileSubPlatform = 'tvOS';
    type AppStoreProvisioningProfileStatus = 'Active' | 'Expired' | 'Invalid';
    export interface AppStoreProvisioningProfile {
        provisioningProfileId: string;
        name: string;
        status: AppStoreProvisioningProfileStatus;
        type: AppStoreProvisioningProfileType;
        distributionMethod: 'limited' | 'store' | 'adhoc' | 'inhouse' | 'direct';
        proProPlatform: AppStoreProvisioningProfilePlatform;
        proProSubPlatform: AppStoreProvisioningProfileSubPlatform | null;
        version: '2';
        dateExpire: string;
        managingApp: null | string;
        appIdId: string;
        deviceCount: number;
        certificates: unknown[];
        devices: unknown[];
        deviceIds: string[];
        certificateIds: string[];
        certificateCount: number;
        UUID: string;
        appId: unknown;
    }
    export function getProvisioningProfilesAsync(context: RequestContext, { platformType, provisioningProfileKind, allowManagedByXcode, }: {
        allowManagedByXcode?: boolean;
        provisioningProfileKind?: AppStoreProvisioningProfileKind;
        platformType?: DevPortalAppIDType;
    }): Promise<AppStoreProvisioningProfile[]>;
    export function repairProvisioningProfileAsync(context: RequestContext, { provisioningProfileId, name, distributionMethod, appId, certificateIds, deviceIds, subPlatform, templateName, platformType, }: {
        provisioningProfileId: string;
        name: string;
        distributionMethod: string;
        appId: string;
        certificateIds: string[];
        deviceIds: string[];
        subPlatform?: string;
        templateName?: string;
        platformType?: DevPortalAppIDType;
    }): Promise<AppStoreProvisioningProfile>;
}
declare module "connect/models/Certificate" {
    import forge from 'node-forge';
    import { RequestContext } from "network/Request";
    import { BundleIdPlatform } from "connect/models/BundleId";
    import { ConnectModel } from "connect/models/ConnectModel";
    export enum CertificateType {
        /**
         * A development code signing certificate used for development environment.
         *
         * @id 5QPB9NHCEI
         */
        IOS_DEVELOPMENT = "IOS_DEVELOPMENT",
        /**
         * A production code signing certificate used for distribution environment. Can also be used for generating in-house certificates.
         *
         * @id R58UK2EWSO, 9RQEK7MSXA
         */
        IOS_DISTRIBUTION = "IOS_DISTRIBUTION",
        MAC_APP_DEVELOPMENT = "MAC_APP_DEVELOPMENT",
        MAC_APP_DISTRIBUTION = "MAC_APP_DISTRIBUTION",
        MAC_INSTALLER_DISTRIBUTION = "MAC_INSTALLER_DISTRIBUTION",
        DEVELOPER_ID_KEXT = "DEVELOPER_ID_KEXT",
        DEVELOPER_ID_APPLICATION = "DEVELOPER_ID_APPLICATION",
        /**
         * An Apple development code signing certificate used for development environment.
         *
         * @id 83Q87W3TGH
         */
        DEVELOPMENT = "DEVELOPMENT",
        /**
         * An Apple distribution code signing certificate used for distribution environment.
         *
         * @id WXV89964HE
         */
        DISTRIBUTION = "DISTRIBUTION",
        /**
         * A push notification certificate for production environment.
         *
         * @id UPV3DW712I
         */
        APPLE_PUSH_SERVICES = "APPLE_PUSH_SERVICES"
    }
    interface CertificateProps {
        /**
         * Base 64 encoded DER representation of the certificate.
         */
        certificateContent: string;
        /**
         * @example 'Evan Bacon'
         */
        displayName: string;
        /**
         * @example '2021-10-27T19:21:49.000+0000'
         */
        expirationDate: string;
        /**
         * @example 'iOS Distribution: Evan Bacon'
         */
        name: string;
        /**
         * @example 'IOS'
         */
        platform: BundleIdPlatform;
        /**
         * @example '77D4ADE748A86417'
         */
        serialNumber: string;
        /**
         * @example 'IOS_DISTRIBUTION'
         */
        certificateType: CertificateType;
        /**
         * @example 'myemail@gmail.com'
         */
        requesterEmail: string;
        /**
         * @example 'Evan'
         */
        requesterFirstName: string;
        /**
         * @example 'Bacon'
         */
        requesterLastName: string;
        /**
         * @example 'Issued'
         */
        status: 'Issued' | string;
        /**
         * @example 'Evan Bacon'
         */
        ownerName: string;
        /**
         * @example 'R58UK2EWSO'
         */
        certificateTypeId: string;
        /**
         * Often the portal team id.
         *
         * @example 'QQ57RJ5UTD'
         */
        ownerId: string;
        /**
         * @example `Evan???s MacBook Pro`
         */
        machineName: string | null;
        /**
         * @example '8634717594444129300'
         */
        serialNumDecimal: string;
        /**
         * @example 'iOS Distribution'
         */
        certificateTypeName: string;
        /**
         * @example '6666666A-E3BC-5555-9FC6-FA1111A1F99A'
         */
        machineId: string | null;
        /**
         * @example '2020-10-27T19:31:49.000+0000'
         */
        requestedDate: string;
        /**
         * @example 'iOS'
         */
        platformName: 'iOS' | string;
        csrContent: string | null;
    }
    export class Certificate extends ConnectModel<CertificateProps> {
        static type: string;
        static getAsync: (context: RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                certificateType: CertificateType | CertificateType[];
                displayName: string | string[];
                serialNumber: string | string[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<Certificate[]>;
        static infoAsync: (context: RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<Certificate>;
        static createAsync(context: RequestContext, { csrContent, certificateType, }: {
            csrContent: string;
            certificateType: CertificateType;
        }): Promise<Certificate>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        /**
         * Create a csr for the Apple dev portal.
         */
        static createCertificateSigningRequestAsync(): Promise<{
            pem: string;
            csr: forge.pki.Certificate;
            keyPair: forge.pki.rsa.KeyPair;
        }>;
    }
    /**
     * Create a certificate signing request, post it to apple dev portal, and download the contents.
     *
     * @returns
     * - `certificate` Generated certificate
     * - `certificateP12` p12 representation of the Apple-signed certificate. This will generate without new lines.
     * - `password` secure random password used to sign the certificate
     * - `privateSigningKey` forge generated key used to generate the certificate signing request in PEM format`
     */
    export function createCertificateAndP12Async(context: RequestContext, { certificateType, }: {
        certificateType: CertificateType;
    }): Promise<{
        certificate: Certificate;
        certificateP12: string;
        password: string;
        privateSigningKey: string;
    }>;
}
declare module "connect/models/Device" {
    import { RequestContext } from "network/Request";
    import { BundleIdPlatform } from "connect/models/BundleId";
    import { ConnectModel } from "connect/models/ConnectModel";
    export enum DeviceClass {
        APPLE_WATCH = "APPLE_WATCH",
        IPAD = "IPAD",
        IPHONE = "IPHONE",
        IPOD = "IPOD",
        APPLE_TV = "APPLE_TV",
        MAC = "MAC"
    }
    export enum DeviceStatus {
        ENABLED = "ENABLED",
        DISABLED = "DISABLED"
    }
    interface DeviceProps {
        deviceClass: DeviceClass;
        model: string;
        name: string;
        platform: BundleIdPlatform;
        status: DeviceStatus;
        udid: string;
        addedDate: string;
    }
    export class Device extends ConnectModel<DeviceProps> {
        static type: string;
        static getAsync: (context: RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                status: DeviceStatus | DeviceStatus[];
                name: string | string[];
                platform: BundleIdPlatform | BundleIdPlatform[];
                udid: string | string[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<Device[]>;
        static infoAsync: (context: RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<Device>;
        static createAsync(context: RequestContext, { name, udid, platform, }: {
            name: DeviceProps['name'];
            udid: DeviceProps['udid'];
            platform?: DeviceProps['platform'];
        }): Promise<Device>;
        /**
         *  Returns all devices that can be used for iOS profiles (all devices except TVs)
         */
        static getAllIOSProfileDevicesAsync(context: RequestContext): Promise<Device[]>;
        updateAsync(options: Pick<Partial<DeviceProps>, 'status' | 'name'>): Promise<Device>;
    }
}
declare module "connect/models/Profile" {
    import { RequestContext } from "network/Request";
    import { ConnectQueryParams } from "connect/ConnectAPI";
    import { BundleId, BundleIdPlatform } from "connect/models/BundleId";
    import { Certificate } from "connect/models/Certificate";
    import { ConnectModel } from "connect/models/ConnectModel";
    import { Device } from "connect/models/Device";
    export enum ProfileState {
        ACTIVE = "ACTIVE",
        EXPIRED = "EXPIRED",
        INVALID = "INVALID"
    }
    export enum ProfileType {
        IOS_APP_DEVELOPMENT = "IOS_APP_DEVELOPMENT",
        IOS_APP_STORE = "IOS_APP_STORE",
        IOS_APP_ADHOC = "IOS_APP_ADHOC",
        IOS_APP_INHOUSE = "IOS_APP_INHOUSE",
        MAC_APP_DEVELOPMENT = "MAC_APP_DEVELOPMENT",
        MAC_APP_STORE = "MAC_APP_STORE",
        MAC_APP_DIRECT = "MAC_APP_DIRECT",
        TVOS_APP_DEVELOPMENT = "TVOS_APP_DEVELOPMENT",
        TVOS_APP_STORE = "TVOS_APP_STORE",
        TVOS_APP_ADHOC = "TVOS_APP_ADHOC",
        TVOS_APP_INHOUSE = "TVOS_APP_INHOUSE",
        MAC_CATALYST_APP_DEVELOPMENT = "MAC_CATALYST_APP_DEVELOPMENT",
        MAC_CATALYST_APP_STORE = "MAC_CATALYST_APP_STORE",
        MAC_CATALYST_APP_DIRECT = "MAC_CATALYST_APP_DIRECT"
    }
    interface ProfileProps {
        /**
         * @example 'N/A'
         */
        configuration: string | null;
        /**
         * @example 'UNIVERSAL'
         */
        bundlePlatform: BundleIdPlatform;
        /**
         * @example '*[expo] com.bacon.avocado AppStore 2020-08-24T05:21:07.826Z'
         */
        name: string;
        platform: BundleIdPlatform;
        /**
         * @example 'App Store' 'Universal Distribution'
         */
        profileTypeLabel: string;
        /**
         * Base 64 encoded buffer. `null` when `profileState` is `.EXPIRED`.
         */
        profileContent: string | null;
        /**
         * @example '4d6f795d-734b-4988-85a8-ab9c2b7b02ba'
         */
        uuid: string;
        /**
         * @example '2020-08-24T05:21:09.000+0000'
         */
        createdDate: string;
        /**
         * @example 'INVALID'
         */
        profileState: ProfileState;
        /**
         * @example 'IOS_APP_STORE'
         */
        profileType: ProfileType;
        /**
         * @example '2020-12-08T19:26:53.000+0000'
         */
        expirationDate: string;
        templateName: string | null;
        bundleId?: BundleId;
        certificates?: Certificate[];
        devices?: Device[];
    }
    export class Profile extends ConnectModel<ProfileProps> {
        static type: string;
        static DEFAULT_INCLUDES: string[];
        static getAsync: (context: RequestContext, props?: {
            query?: ConnectQueryParams<Partial<{
                name: string | string[];
                profileState: ProfileState | ProfileState[];
                profileType: ProfileType | ProfileType[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<Profile[]>;
        static infoAsync: (context: RequestContext, props: {
            id: string;
            query?: ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<Profile>;
        /**
         *
         * @param bundleId `BundleId` id (Opaque ID)
         * @param certificates `Certificate` id array (Opaque ID)
         * @param devices `Device` id array (Opaque ID)
         */
        static createAsync(context: RequestContext, { bundleId, certificates, devices, name, profileType, templateName, }: {
            bundleId: string;
            certificates: string[];
            devices: string[];
            name: string;
            profileType: ProfileType;
            templateName?: string;
        }): Promise<Profile>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        isValid(): boolean;
        getDevicesAsync({ query, }?: {
            query?: Pick<ConnectQueryParams<object>, 'limit'>;
        }): Promise<Device[]>;
        getCertificatesAsync({ query, }?: {
            query?: Pick<ConnectQueryParams<object>, 'limit'>;
        }): Promise<Certificate[]>;
        getBundleIdAsync({ query, }?: {
            query?: Pick<ConnectQueryParams<object>, 'limit'>;
        }): Promise<BundleId>;
        /**
         * A super dangerous method that uses the old API to repair a provisioning profile.
         */
        regenerateAsync(): Promise<Profile>;
    }
}
declare module "connect/models/BundleId" {
    import { RequestContext } from "network/Request";
    import { ConnectQueryFilter, ConnectQueryParams } from "connect/ConnectAPI";
    import { BundleIdCapability, CapabilityOptionMap, CapabilityType, UpdateCapabilityRelationshipProps } from "connect/models/BundleIdCapability";
    import { ConnectModel } from "connect/models/ConnectModel";
    import { Profile } from "connect/models/Profile";
    export enum BundleIdPlatform {
        IOS = "IOS",
        MAC_OS = "MAC_OS",
        UNIVERSAL = "UNIVERSAL"
    }
    interface BundleIdProps {
        identifier: string;
        name: string;
        seedId: string;
        dateModified: string;
        platform: BundleIdPlatform;
        bundleIdCapabilities?: BundleIdCapability[];
        /**
         * Seems to always be `bundle`.
         */
        wildcard?: boolean;
        bundleType?: 'bundle' | 'onDemandInstallCapable' | string;
    }
    export type BundleIdQueryFilter = ConnectQueryFilter<BundleIdProps, 'identifier' | 'name' | 'platform' | 'seedId'>;
    interface UpdateCapabilityProps<T extends CapabilityType> {
        capabilityType: T;
        option: CapabilityOptionMap[T];
        relationships?: UpdateCapabilityRelationshipProps;
    }
    export class BundleId extends ConnectModel<BundleIdProps> {
        static type: string;
        static DEFAULT_INCLUDES: string[];
        static getAsync: (context: RequestContext, props?: {
            query?: ConnectQueryParams<Partial<{
                name: string | string[];
                identifier: string | string[];
                platform: BundleIdPlatform | BundleIdPlatform[];
                seedId: string | string[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<BundleId[]>;
        /**
         *
         * @param id `BundleId` id (ex: UNHB5PT4MA)
         */
        static infoAsync: (context: RequestContext, props: {
            id: string;
            query?: ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<BundleId>;
        static findAsync(context: RequestContext, { identifier, }: {
            identifier: string;
        }): Promise<BundleId | null>;
        static createAsync(context: RequestContext, { name, platform, identifier, }: {
            name: string;
            platform?: BundleIdProps['platform'];
            identifier: string;
        }): Promise<BundleId>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        deleteAsync({ id }: {
            id: string;
        }): Promise<void>;
        updateBundleIdCapabilityAsync<T extends CapabilityType>(options: UpdateCapabilityProps<T> | UpdateCapabilityProps<T>[]): Promise<BundleId>;
        deleteBundleIdCapabilityAsync({ capabilityType, }: {
            capabilityType: CapabilityType;
        }): Promise<void>;
        getBundleIdCapabilitiesAsync({ query, }?: {
            query?: Pick<ConnectQueryParams<object>, 'limit'>;
        }): Promise<BundleIdCapability[]>;
        updateAsync(options: Partial<Omit<BundleIdProps, 'bundleIdCapabilities'>>): Promise<BundleId>;
        getProfilesAsync({ query, }?: {
            query?: Pick<ConnectQueryParams<object>, 'limit'>;
        }): Promise<Profile[]>;
        supportsCatalyst(): boolean;
        getCapabilityId(capabilityType: CapabilityType): string;
        private getOrFetchBundleIdCapabilitiesAsync;
        hasCapabilityAsync(capability: CapabilityType): Promise<BundleIdCapability | null>;
    }
}
declare module "connect/models/AppCategory" {
    import { ConnectQueryFilter } from "connect/ConnectAPI";
    import { BundleIdPlatform } from "connect/models/BundleId";
    import { ConnectModel } from "connect/models/ConnectModel";
    export enum AppCategoryId {
        FOOD_AND_DRINK = "FOOD_AND_DRINK",
        BUSINESS = "BUSINESS",
        EDUCATION = "EDUCATION",
        SOCIAL_NETWORKING = "SOCIAL_NETWORKING",
        BOOKS = "BOOKS",
        SPORTS = "SPORTS",
        FINANCE = "FINANCE",
        REFERENCE = "REFERENCE",
        GRAPHICS_AND_DESIGN = "GRAPHICS_AND_DESIGN",
        DEVELOPER_TOOLS = "DEVELOPER_TOOLS",
        HEALTH_AND_FITNESS = "HEALTH_AND_FITNESS",
        MUSIC = "MUSIC",
        WEATHER = "WEATHER",
        TRAVEL = "TRAVEL",
        ENTERTAINMENT = "ENTERTAINMENT",
        STICKERS = "STICKERS",
        GAMES = "GAMES",
        LIFESTYLE = "LIFESTYLE",
        MEDICAL = "MEDICAL",
        MAGAZINES_AND_NEWSPAPERS = "MAGAZINES_AND_NEWSPAPERS",
        UTILITIES = "UTILITIES",
        SHOPPING = "SHOPPING",
        PRODUCTIVITY = "PRODUCTIVITY",
        NEWS = "NEWS",
        PHOTO_AND_VIDEO = "PHOTO_AND_VIDEO",
        NAVIGATION = "NAVIGATION"
    }
    export enum AppSubcategoryId {
        STICKERS_PLACES_AND_OBJECTS = "STICKERS_PLACES_AND_OBJECTS",
        STICKERS_EMOJI_AND_EXPRESSIONS = "STICKERS_EMOJI_AND_EXPRESSIONS",
        STICKERS_CELEBRATIONS = "STICKERS_CELEBRATIONS",
        STICKERS_CELEBRITIES = "STICKERS_CELEBRITIES",
        STICKERS_MOVIES_AND_TV = "STICKERS_MOVIES_AND_TV",
        STICKERS_SPORTS_AND_ACTIVITIES = "STICKERS_SPORTS_AND_ACTIVITIES",
        STICKERS_EATING_AND_DRINKING = "STICKERS_EATING_AND_DRINKING",
        STICKERS_CHARACTERS = "STICKERS_CHARACTERS",
        STICKERS_ANIMALS = "STICKERS_ANIMALS",
        STICKERS_FASHION = "STICKERS_FASHION",
        STICKERS_ART = "STICKERS_ART",
        STICKERS_GAMING = "STICKERS_GAMING",
        STICKERS_KIDS_AND_FAMILY = "STICKERS_KIDS_AND_FAMILY",
        STICKERS_PEOPLE = "STICKERS_PEOPLE",
        STICKERS_MUSIC = "STICKERS_MUSIC",
        GAMES_SPORTS = "GAMES_SPORTS",
        GAMES_WORD = "GAMES_WORD",
        GAMES_MUSIC = "GAMES_MUSIC",
        GAMES_ADVENTURE = "GAMES_ADVENTURE",
        GAMES_ACTION = "GAMES_ACTION",
        GAMES_ROLE_PLAYING = "GAMES_ROLE_PLAYING",
        GAMES_CASUAL = "GAMES_CASUAL",
        GAMES_BOARD = "GAMES_BOARD",
        GAMES_TRIVIA = "GAMES_TRIVIA",
        GAMES_CARD = "GAMES_CARD",
        GAMES_PUZZLE = "GAMES_PUZZLE",
        GAMES_CASINO = "GAMES_CASINO",
        GAMES_STRATEGY = "GAMES_STRATEGY",
        GAMES_SIMULATION = "GAMES_SIMULATION",
        GAMES_RACING = "GAMES_RACING",
        GAMES_FAMILY = "GAMES_FAMILY"
    }
    interface AppCategoryProps {
        platforms: BundleIdPlatform[];
    }
    export type AppCategoryQueryFilter = ConnectQueryFilter<AppCategoryProps, 'platforms'>;
    export class AppCategory extends ConnectModel<AppCategoryProps> {
        static type: string;
        static getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                platforms: BundleIdPlatform[] | BundleIdPlatform[][];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<AppCategory[]>;
    }
}
declare module "connect/AssetAPI" {
    import { AxiosResponse } from 'axios';
    import { ParsingOptions, RequestContext, RequestProps } from "network/Request";
    import { ConnectClientAPI } from "connect/ConnectAPI";
    export interface UploadOperationHeader {
        name: string;
        value: string;
    }
    export interface UploadOperation {
        method: string;
        url: string;
        length: number;
        offset: number;
        requestHeaders: UploadOperationHeader[];
    }
    export enum AppMediaAssetStateState {
        AWAITING_UPLOAD = "AWAITING_UPLOAD",
        UPLOAD_COMPLETE = "UPLOAD_COMPLETE",
        COMPLETE = "COMPLETE",
        FAILED = "FAILED"
    }
    export interface AppMediaStateError {
        code: string;
        description: string;
    }
    export interface AppMediaAssetState {
        errors: AppMediaStateError[];
        warnings: AppMediaStateError[];
        state: AppMediaAssetStateState;
    }
    export interface ImageAsset {
        /**
         * @example 'https://is3-ssl.mzstatic.com/image/thumb/Purple118/v4/0c/26/16/0c261675-72c5-7e10-3fdc-c8a20ccebd77/AppIcon-1x_U007emarketing-85-220-0-6.png/{w}x{h}bb.{f}'
         */
        templateUrl: string;
        /**
         * @example 1024
         */
        width: number;
        /**
         * @example 1024
         */
        height: number;
    }
    class AssetAPI extends ConnectClientAPI {
        get hostname(): string;
        requestAsync<T = any, R extends AxiosResponse<T> = AxiosResponse<T>>(context: RequestContext, request: RequestProps, options?: ParsingOptions): Promise<R>;
        uploadAsync(context: RequestContext, { uploadOperations, bytes, }: {
            uploadOperations: UploadOperation[];
            bytes: Buffer;
        }): Promise<void>;
    }
    export const assetClient: AssetAPI;
}
declare module "utils/crypto" {
    import * as crypto from 'crypto';
    export function getChecksum(value: crypto.BinaryLike): string;
    export function getChecksumForFilePath(value: string): string;
}
declare module "connect/models/AppStoreReviewAttachment" {
    import { RequestContext } from "network/Request";
    import { AppMediaAssetState, UploadOperation } from "connect/AssetAPI";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppStoreReviewAttachmentProps {
        fileName: string;
        fileSize: number;
        sourceFileChecksum: string;
        uploadOperations: UploadOperation[];
        assetDeliveryState: AppMediaAssetState;
        uploaded: boolean | null;
    }
    /**
     * Used for updating basic metadata.
     */
    export class AppStoreReviewAttachment extends ConnectModel<AppStoreReviewAttachmentProps> {
        static type: string;
        /**
         *
         * @param id `AppStoreReviewDetail` id
         */
        static createAsync(context: RequestContext, { id, attributes, }: {
            id: string;
            attributes: Pick<AppStoreReviewAttachmentProps, 'fileName' | 'fileSize'>;
        }): Promise<AppStoreReviewAttachment>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        deleteAsync(): Promise<void>;
        /**
         *
         * @param id `AppStoreReviewDetail` id
         */
        static uploadAsync(context: RequestContext, { id, filePath, }: {
            id: string;
            filePath: string;
        }): Promise<AppStoreReviewAttachment>;
        updateAsync(attributes: Pick<AppStoreReviewAttachmentProps, 'uploaded' | 'sourceFileChecksum'>): Promise<AppStoreReviewAttachment>;
    }
}
declare module "connect/models/AppStoreReviewDetail" {
    import { RequestContext } from "network/Request";
    import { AppStoreReviewAttachment } from "connect/models/AppStoreReviewAttachment";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppStoreReviewDetailProps {
        contactFirstName: string | null;
        contactLastName: string | null;
        contactPhone: string | null;
        contactEmail: string | null;
        demoAccountName: string | null;
        demoAccountPassword: string | null;
        demoAccountRequired: boolean | null;
        notes: string | null;
        appStoreReviewAttachments?: AppStoreReviewAttachment[] | null;
    }
    /**
     * Used for updating basic metadata.
     */
    export class AppStoreReviewDetail extends ConnectModel<AppStoreReviewDetailProps> {
        static type: string;
        static createAsync(context: RequestContext, { id, attributes, }: {
            id: string;
            attributes: Partial<AppStoreReviewDetailProps>;
        }): Promise<AppStoreReviewDetail>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        updateAsync(options: Partial<AppStoreReviewDetailProps>): Promise<AppStoreReviewDetail>;
        uploadAttachmentAsync(filePath: string): Promise<AppStoreReviewAttachment>;
    }
}
declare module "connect/models/AppScreenshot" {
    import { RequestContext } from "network/Request";
    import { AppMediaAssetState, ImageAsset, UploadOperation } from "connect/AssetAPI";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppScreenshotProps {
        fileSize: number;
        fileName: string;
        sourceFileChecksum: string;
        imageAsset: ImageAsset;
        assetToken: string;
        assetType: string;
        uploadOperations: UploadOperation[];
        assetDeliveryState: AppMediaAssetState;
    }
    export class AppScreenshot extends ConnectModel<AppScreenshotProps> {
        static type: string;
        static infoAsync: (context: RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<AppScreenshot>;
        static createAsync(context: RequestContext, { id, attributes, }: {
            id: string;
            attributes: Pick<AppScreenshotProps, 'fileName' | 'fileSize'>;
        }): Promise<AppScreenshot>;
        /**
         *
         * @param id `AppScreenshotSet` id
         */
        static uploadAsync(context: RequestContext, { id, filePath, waitForProcessing, }: {
            id: string;
            filePath: string;
            waitForProcessing?: boolean;
        }): Promise<AppScreenshot>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        deleteAsync(): Promise<void>;
        updateAsync(options: Partial<AppScreenshotProps>): Promise<AppScreenshot>;
        isAwaitingUpload(): boolean;
        isComplete(): boolean;
        isFailed(): boolean;
        getErrorMessages(): string[];
        getImageAssetUrl({ width, height, type, }: {
            width?: number;
            height?: number;
            type?: string | 'png';
        }): string | null;
    }
}
declare module "connect/models/AppScreenshotSet" {
    import { RequestContext } from "network/Request";
    import { ConnectQueryParams } from "connect/ConnectAPI";
    import { AppScreenshot } from "connect/models/AppScreenshot";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppScreenshotSetProps {
        screenshotDisplayType: ScreenshotDisplayType;
        appScreenshots: AppScreenshot[];
    }
    export enum ScreenshotDisplayType {
        APP_IPHONE_35 = "APP_IPHONE_35",
        APP_IPHONE_40 = "APP_IPHONE_40",
        APP_IPHONE_47 = "APP_IPHONE_47",
        APP_IPHONE_55 = "APP_IPHONE_55",
        APP_IPHONE_58 = "APP_IPHONE_58",
        APP_IPHONE_65 = "APP_IPHONE_65",
        APP_IPAD_97 = "APP_IPAD_97",
        APP_IPAD_105 = "APP_IPAD_105",
        APP_IPAD_PRO_3GEN_11 = "APP_IPAD_PRO_3GEN_11",
        APP_IPAD_PRO_129 = "APP_IPAD_PRO_129",
        APP_IPAD_PRO_3GEN_129 = "APP_IPAD_PRO_3GEN_129",
        IMESSAGE_APP_IPHONE_40 = "IMESSAGE_APP_IPHONE_40",
        IMESSAGE_APP_IPHONE_47 = "IMESSAGE_APP_IPHONE_47",
        IMESSAGE_APP_IPHONE_55 = "IMESSAGE_APP_IPHONE_55",
        IMESSAGE_APP_IPHONE_58 = "IMESSAGE_APP_IPHONE_58",
        IMESSAGE_APP_IPHONE_65 = "IMESSAGE_APP_IPHONE_65",
        IMESSAGE_APP_IPAD_97 = "IMESSAGE_APP_IPAD_97",
        IMESSAGE_APP_IPAD_105 = "IMESSAGE_APP_IPAD_105",
        IMESSAGE_APP_IPAD_PRO_129 = "IMESSAGE_APP_IPAD_PRO_129",
        IMESSAGE_APP_IPAD_PRO_3GEN_11 = "IMESSAGE_APP_IPAD_PRO_3GEN_11",
        IMESSAGE_APP_IPAD_PRO_3GEN_129 = "IMESSAGE_APP_IPAD_PRO_3GEN_129",
        APP_WATCH_SERIES_3 = "APP_WATCH_SERIES_3",
        APP_WATCH_SERIES_4 = "APP_WATCH_SERIES_4",
        APP_APPLE_TV = "APP_APPLE_TV",
        APP_DESKTOP = "APP_DESKTOP"
    }
    export const ALL: ScreenshotDisplayType[];
    export class AppScreenshotSet extends ConnectModel<AppScreenshotSetProps> {
        static type: string;
        /**
         *
         * @param id `AppScreenshotSet` id (ex: UNHB5PT4MA)
         */
        static infoAsync: (context: RequestContext, props: {
            id: string;
            query?: ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<AppScreenshotSet>;
        /**
         *
         * @param id `AppStoreVersionLocalization` id
         */
        static createAsync(context: RequestContext, { id, attributes, }: {
            id: string;
            attributes: Partial<AppScreenshotSetProps>;
        }): Promise<AppScreenshotSet>;
        updateAsync({ appScreenshots, }: {
            appScreenshots: string[];
        }): Promise<AppScreenshotSet>;
        isImessage(): boolean;
        isAppleTv(): boolean;
        uploadScreenshot({ filePath, waitForProcessing, position, }: {
            filePath: string;
            waitForProcessing?: boolean;
            position?: number;
        }): Promise<AppScreenshot>;
        reorderScreenshotsAsync({ appScreenshots, query, }: {
            appScreenshots: string[];
            query?: ConnectQueryParams;
        }): Promise<AppScreenshotSet[]>;
    }
}
declare module "connect/models/AppStoreVersionLocalization" {
    import { RequestContext } from "network/Request";
    import { ConnectQueryFilter, ConnectQueryParams } from "connect/ConnectAPI";
    import { AppScreenshotSet, AppScreenshotSetProps } from "connect/models/AppScreenshotSet";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppStoreVersionLocalizationProps {
        description: string | null;
        /**
         * @example 'en-US'
         */
        locale: string;
        /**
         * @example 'Dating, Food, Books,'
         */
        keywords: string | null;
        marketingUrl: string | null;
        promotionalText: string | null;
        supportUrl: string | null;
        whatsNew: string | null;
        appScreenshotSets?: AppScreenshotSet[];
    }
    /**
     * Used for updating basic metadata.
     */
    export class AppStoreVersionLocalization extends ConnectModel<AppStoreVersionLocalizationProps> {
        static type: string;
        static createAsync(context: RequestContext, { id, locale, }: {
            id: string;
            locale: string;
        }): Promise<AppStoreVersionLocalization>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        updateAsync(options: Partial<Omit<AppStoreVersionLocalizationProps, 'locale' | 'appScreenshotSets' | 'appPreviewSets'>>): Promise<AppStoreVersionLocalization>;
        getAppScreenshotSetsAsync({ query, }?: {
            query?: ConnectQueryParams<ConnectQueryFilter<AppScreenshotSetProps, 'screenshotDisplayType'>>;
        }): Promise<AppScreenshotSet[]>;
        createAppScreenshotSetAsync(attributes: Pick<AppScreenshotSetProps, 'screenshotDisplayType'>): Promise<AppScreenshotSet>;
    }
}
declare module "connect/models/AppStoreVersionPhasedRelease" {
    import { RequestContext } from "network/Request";
    import { ConnectModel } from "connect/models/ConnectModel";
    export enum PhasedReleaseState {
        INACTIVE = "INACTIVE",
        ACTIVE = "ACTIVE",
        PAUSED = "PAUSED",
        COMPLETE = "COMPLETE"
    }
    export interface AppStoreVersionPhasedReleaseProps {
        phasedReleaseState: PhasedReleaseState | null;
        startDate: string | null;
        totalPauseDuration: number | null;
        currentDayNumber: number | null;
    }
    /**
     * Used for updating basic metadata.
     */
    export class AppStoreVersionPhasedRelease extends ConnectModel<AppStoreVersionPhasedReleaseProps> {
        static type: string;
        /**
         *
         * @param id `AppStoreVersion` id
         */
        static createAsync(context: RequestContext, { id, phasedReleaseState, }: {
            id: string;
            phasedReleaseState: AppStoreVersionPhasedReleaseProps['phasedReleaseState'];
        }): Promise<AppStoreVersionPhasedRelease>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        deleteAsync(): Promise<void>;
        pauseAsync(): Promise<AppStoreVersionPhasedRelease>;
        resumeAsync(): Promise<AppStoreVersionPhasedRelease>;
        completeAsync(): Promise<AppStoreVersionPhasedRelease>;
        updateAsync({ phasedReleaseState, }: Pick<AppStoreVersionPhasedReleaseProps, 'phasedReleaseState'>): Promise<AppStoreVersionPhasedRelease>;
    }
}
declare module "connect/models/AppStoreVersionReleaseRequest" {
    import { RequestContext } from "network/Request";
    import { ConnectModel } from "connect/models/ConnectModel";
    export class AppStoreVersionReleaseRequest extends ConnectModel<object> {
        static type: string;
        /**
         *
         * @param id `AppStoreVersion` id
         */
        static createAsync(context: RequestContext, { id, }: {
            id: string;
        }): Promise<AppStoreVersionReleaseRequest>;
    }
}
declare module "connect/models/AppStoreVersionSubmission" {
    import { RequestContext } from "network/Request";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppStoreVersionSubmissionProps {
        canReject: boolean;
    }
    export class AppStoreVersionSubmission extends ConnectModel<AppStoreVersionSubmissionProps> {
        static type: string;
        /**
         *
         * @param id `AppStoreVersion` id
         */
        static createAsync(context: RequestContext, { id, attributes, }: {
            id: string;
            attributes?: Partial<AppStoreVersionSubmissionProps>;
        }): Promise<AppStoreVersionSubmission>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
    }
}
declare module "connect/models/BetaAppReviewSubmission" {
    import { RequestContext } from "network/Request";
    import { ConnectQueryFilter } from "connect/ConnectAPI";
    import { ConnectModel } from "connect/models/ConnectModel";
    export enum BetaReviewState {
        WAITING_FOR_REVIEW = "WAITING_FOR_REVIEW",
        IN_REVIEW = "IN_REVIEW",
        REJECTED = "REJECTED",
        APPROVED = "APPROVED"
    }
    interface BetaAppReviewSubmissionProps {
        betaReviewState: BetaReviewState;
    }
    export type BetaAppReviewSubmissionQueryFilter = ConnectQueryFilter<BetaAppReviewSubmissionProps, 'betaReviewState'>;
    export class BetaAppReviewSubmission extends ConnectModel<BetaAppReviewSubmissionProps> {
        static type: string;
        static getAsync: (context: RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                betaReviewState: BetaReviewState | BetaReviewState[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<BetaAppReviewSubmission[]>;
        /**
         *
         * @param id `Build` id
         */
        static createAsync(context: RequestContext, { id, }: {
            id: string;
        }): Promise<BetaAppReviewSubmission>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
    }
}
declare module "connect/models/BetaBuildLocalization" {
    import { RequestContext } from "network/Request";
    import { ConnectQueryFilter } from "connect/ConnectAPI";
    import { ConnectModel } from "connect/models/ConnectModel";
    interface BetaBuildLocalizationProps {
        whatsNew: string | null;
        locale: string | null;
    }
    export type BetaBuildLocalizationQueryFilter = ConnectQueryFilter<BetaBuildLocalizationProps & {
        /**
         * `Build` id
         */
        build: string;
    }, 'build' | 'locale'>;
    export class BetaBuildLocalization extends ConnectModel<BetaBuildLocalizationProps> {
        static type: string;
        static getAsync: (context: RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                locale: string | (string | null)[] | null;
                build: string | string[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<BetaBuildLocalization[]>;
        /**
         *
         * @param id `Build` id
         */
        static createAsync(context: RequestContext, { id, locale, }: {
            id: string;
            locale: string;
        }): Promise<BetaBuildLocalization>;
        updateAsync(attributes: Partial<BetaBuildLocalizationProps>): Promise<BetaBuildLocalization>;
    }
}
declare module "connect/models/BetaBuildMetric" {
    import { ConnectModel } from "connect/models/ConnectModel";
    interface BetaBuildMetricProps {
        installCount: number;
        crashCount: number;
        inviteCount: number;
        sevenDayTesterCount: number;
    }
    export class BetaBuildMetric extends ConnectModel<BetaBuildMetricProps> {
        static type: string;
    }
}
declare module "connect/models/BetaGroup" {
    import { RequestContext } from "network/Request";
    import { ConnectModel } from "connect/models/ConnectModel";
    interface BetaGroupProps {
        /**
         * @example 'App Store Connect Users'
         */
        name: string;
        /**
         * @example '2017-08-07T18:06:37.632Z'
         */
        createdDate: string;
        isInternalGroup: boolean;
        publicLinkEnabled: boolean;
        publicLinkId: string;
        publicLinkLimitEnabled: boolean;
        publicLinkLimit: number;
        publicLink: string | null;
        feedbackEnabled: boolean;
    }
    export class BetaGroup extends ConnectModel<BetaGroupProps> {
        static type: string;
        static getAsync: (context: RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        } | undefined) => Promise<BetaGroup[]>;
        /**
         *
         * @param id `App` id
         */
        static createAsync(context: RequestContext, { id, name, publicLinkEnabled, publicLinkLimit, publicLinkLimitEnabled, }: {
            id: string;
        } & Pick<BetaGroupProps, 'name' | 'publicLinkEnabled' | 'publicLinkLimit' | 'publicLinkLimitEnabled'>): Promise<BetaGroup>;
        createBulkBetaTesterAssignmentsAsync(betaTesters: {
            email: string;
            firstName: string;
            lastName: string;
        }[]): Promise<unknown>;
    }
}
declare module "connect/models/BuildBetaDetail" {
    import { ConnectQueryFilter } from "connect/ConnectAPI";
    import { ConnectModel } from "connect/models/ConnectModel";
    export enum InternalBuildState {
        PROCESSING = "PROCESSING",
        PROCESSING_EXCEPTION = "PROCESSING_EXCEPTION",
        MISSING_EXPORT_COMPLIANCE = "MISSING_EXPORT_COMPLIANCE",
        READY_FOR_BETA_TESTING = "READY_FOR_BETA_TESTING",
        IN_BETA_TESTING = "IN_BETA_TESTING",
        EXPIRED = "EXPIRED",
        IN_EXPORT_COMPLIANCE_REVIEW = "IN_EXPORT_COMPLIANCE_REVIEW"
    }
    export enum ExternalBuildState {
        PROCESSING = "PROCESSING",
        PROCESSING_EXCEPTION = "PROCESSING_EXCEPTION",
        MISSING_EXPORT_COMPLIANCE = "MISSING_EXPORT_COMPLIANCE",
        READY_FOR_BETA_TESTING = "READY_FOR_BETA_TESTING",
        IN_BETA_TESTING = "IN_BETA_TESTING",
        EXPIRED = "EXPIRED",
        READY_FOR_BETA_SUBMISSION = "READY_FOR_BETA_SUBMISSION",
        IN_EXPORT_COMPLIANCE_REVIEW = "IN_EXPORT_COMPLIANCE_REVIEW",
        WAITING_FOR_BETA_REVIEW = "WAITING_FOR_BETA_REVIEW",
        IN_BETA_REVIEW = "IN_BETA_REVIEW",
        BETA_REJECTED = "BETA_REJECTED",
        BETA_APPROVED = "BETA_APPROVED"
    }
    interface BuildBetaDetailProps {
        autoNotifyEnabled: boolean;
        didNotify: boolean;
        internalBuildState: InternalBuildState;
        externalBuildState: ExternalBuildState;
    }
    export type BuildBetaDetailQueryFilter = ConnectQueryFilter<{
        /**
         * `Build` id
         */
        build: string;
    }, 'build'>;
    export class BuildBetaDetail extends ConnectModel<BuildBetaDetailProps> {
        static type: string;
        static getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                build: string | string[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<BuildBetaDetail[]>;
        /**
         *
         * @param id `BuildBetaDetail` id (ex: UNHB5PT4MA)
         */
        static infoAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<BuildBetaDetail>;
        updateAsync(attributes: Partial<BuildBetaDetailProps>): Promise<BuildBetaDetail>;
        isReadyForInternalTesting(): boolean;
        isReadyForBetaSubmission(): boolean;
    }
}
declare module "connect/models/PreReleaseVersion" {
    import { ConnectQueryFilter } from "connect/ConnectAPI";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface PreReleaseVersionProps {
        /**
         * @example '1.0.1'
         */
        version: string;
        /**
         * @example 'IOS'
         */
        platform: Platform;
    }
    export enum Platform {
        IOS = "IOS",
        MAC_OS = "MAC_OS",
        TV_OS = "TV_OS"
    }
    export type PreReleaseVersionQueryFilter = ConnectQueryFilter<PreReleaseVersionProps, 'platform' | 'version'>;
    export class PreReleaseVersion extends ConnectModel<PreReleaseVersionProps> {
        static type: string;
        static getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                platform: Platform | Platform[];
                version: string | string[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<PreReleaseVersion[]>;
        /**
         *
         * @param id `PreReleaseVersion` id (ex: UNHB5PT4MA)
         */
        static infoAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<PreReleaseVersion>;
    }
}
declare module "connect/models/Build" {
    import { RequestContext } from "network/Request";
    import { ImageAsset } from "connect/AssetAPI";
    import { ConnectQueryFilter, ConnectQueryParams } from "connect/ConnectAPI";
    import { App } from "connect/models/App";
    import { BetaAppReviewSubmission } from "connect/models/BetaAppReviewSubmission";
    import { BetaBuildLocalization } from "connect/models/BetaBuildLocalization";
    import { BetaBuildMetric } from "connect/models/BetaBuildMetric";
    import { BuildBetaDetail } from "connect/models/BuildBetaDetail";
    import { ConnectModel } from "connect/models/ConnectModel";
    import { Platform, PreReleaseVersion } from "connect/models/PreReleaseVersion";
    export interface BuildProps {
        /**
         * @example '1'
         */
        version: string;
        /**
         * @example '2017-08-08T15:21:52-07:00'
         */
        uploadedDate: string;
        /**
         * @example '2017-11-06T15:21:52-08:00'
         */
        expirationDate: string;
        expired: boolean;
        /**
         * @example '9.0'
         */
        minOsVersion: string;
        iconAssetToken: ImageAsset;
        /**
         * @example 'VALID'
         */
        processingState: ProcessingState;
        usesNonExemptEncryption: boolean;
        isWatchOnly: boolean;
        hasMessagesExtension: boolean;
        hasStickers: boolean;
        isLaunchProhibited: boolean;
        app?: App;
        betaAppReviewSubmission?: BetaAppReviewSubmission;
        betaBuildMetrics?: BetaBuildMetric;
        buildBetaDetail?: BuildBetaDetail;
        preReleaseVersion?: PreReleaseVersion;
    }
    export enum ProcessingState {
        PROCESSING = "PROCESSING",
        FAILED = "FAILED",
        INVALID = "INVALID",
        VALID = "VALID"
    }
    export type BuildQueryFilter = ConnectQueryFilter<Omit<BuildProps, 'app'> & {
        /**
         * `App` id
         */
        app: string;
        'preReleaseVersion.version': string;
    }, 'app' | 'version' | 'preReleaseVersion.version' | 'processingState'>;
    export class Build extends ConnectModel<BuildProps> {
        static type: string;
        static DEFAULT_INCLUDES: string[];
        static getAsync(context: RequestContext, { query, }?: {
            query?: ConnectQueryParams<BuildQueryFilter>;
        }): Promise<Build[]>;
        /**
         *
         * @param id `Build` id (ex: UNHB5PT4MA)
         */
        static infoAsync: (context: RequestContext, props: {
            id: string;
            query?: ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<Build>;
        /**
         *
         * @param id `Build` id
         */
        static createAsync(context: RequestContext, { id, locale, }: {
            id: string;
            locale: string;
        }): Promise<Build>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        updateAsync(attributes: Partial<BuildProps>): Promise<Build>;
        addBetaGroupsAsync({ betaGroups }: {
            betaGroups: string[];
        }): Promise<void>;
        getBetaBuildLocalizationsAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<BetaBuildLocalization[]>;
        getBuildBetaDetailsAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<BuildBetaDetail[]>;
        /**
         * Submit for beta app review.
         */
        createBetaAppReviewSubmissionAsync(): Promise<BetaAppReviewSubmission>;
        /**
         * Expire the build to prevent further usage or submit a new build.
         */
        expireAsync(): Promise<Build>;
        getAppVersion(): string;
        getPlatform(): Platform;
        getAppId(): string;
        getBundleId(): string;
        isReadyForBetaSubmission(): boolean;
        isProcessed(): boolean;
        isReadyForInternalTesting(): boolean;
    }
}
declare module "connect/models/IdfaDeclaration" {
    import { RequestContext } from "network/Request";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface IdfaDeclarationProps {
        servesAds: boolean;
        attributesAppInstallationToPreviousAd: boolean;
        attributesActionWithPreviousAd: boolean;
        honorsLimitedAdTracking: boolean;
    }
    export class IdfaDeclaration extends ConnectModel<IdfaDeclarationProps> {
        static type: string;
        /**
         *
         * @param id `AppStoreVersion` id
         */
        static createAsync(context: RequestContext, { id, attributes, }: {
            id: string;
            attributes: Partial<IdfaDeclarationProps>;
        }): Promise<IdfaDeclaration>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        deleteAsync(): Promise<void>;
        updateAsync(options: Partial<IdfaDeclarationProps>): Promise<IdfaDeclaration>;
    }
}
declare module "connect/models/ResetRatingsRequest" {
    import { RequestContext } from "network/Request";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface ResetRatingsRequestProps {
        resetDate: string | null;
    }
    export class ResetRatingsRequest extends ConnectModel<ResetRatingsRequestProps> {
        static type: string;
        /**
         *
         * @param id `AppStoreVersion` id
         */
        static createAsync(context: RequestContext, { id, }: {
            id: string;
        }): Promise<ResetRatingsRequest>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        deleteAsync(): Promise<void>;
    }
}
declare module "connect/models/AppStoreVersion" {
    import { RequestContext } from "network/Request";
    import { ImageAsset } from "connect/AssetAPI";
    import { ConnectQueryParams } from "connect/ConnectAPI";
    import { AgeRatingDeclaration } from "connect/models/AgeRatingDeclaration";
    import { AppStoreState } from "connect/models/AppInfo";
    import { AppStoreReviewDetail, AppStoreReviewDetailProps } from "connect/models/AppStoreReviewDetail";
    import { AppStoreVersionLocalization, AppStoreVersionLocalizationProps } from "connect/models/AppStoreVersionLocalization";
    import { AppStoreVersionPhasedRelease, AppStoreVersionPhasedReleaseProps } from "connect/models/AppStoreVersionPhasedRelease";
    import { AppStoreVersionReleaseRequest } from "connect/models/AppStoreVersionReleaseRequest";
    import { AppStoreVersionSubmission } from "connect/models/AppStoreVersionSubmission";
    import { Build } from "connect/models/Build";
    import { ConnectModel } from "connect/models/ConnectModel";
    import { IdfaDeclaration, IdfaDeclarationProps } from "connect/models/IdfaDeclaration";
    import { Platform } from "connect/models/PreReleaseVersion";
    import { ResetRatingsRequest } from "connect/models/ResetRatingsRequest";
    export enum ReleaseType {
        AFTER_APPROVAL = "AFTER_APPROVAL",
        MANUAL = "MANUAL",
        SCHEDULED = "SCHEDULED"
    }
    export interface AppStoreVersionProps {
        /**
         * @example 'IOS'
         */
        platform: Platform;
        /**
         * @example '1.0'
         */
        versionString: string;
        /**
         * @example 'PREPARE_FOR_SUBMISSION'
         */
        appStoreState: AppStoreState;
        storeIcon: ImageAsset | null;
        watchStoreIcon: ImageAsset | null;
        /**
         * @example '2020 Expo'
         */
        copyright: string | null;
        /**
         * @example 'AFTER_APPROVAL'
         */
        releaseType: ReleaseType | null;
        earliestReleaseDate: string | null;
        usesIdfa: boolean | null;
        isWatchOnly: boolean;
        downloadable: boolean;
        /**
         * @example '2020-10-29T09:03:06-07:00'
         */
        createdDate: string;
        appStoreVersionSubmission?: AppStoreVersionSubmission;
    }
    export class AppStoreVersion extends ConnectModel<AppStoreVersionProps> {
        static type: string;
        static DEFAULT_INCLUDES: string[];
        static createAsync(context: RequestContext, { id, versionString, platform, }: {
            id: string;
            versionString: string;
            platform: Platform;
        }): Promise<AppStoreVersion>;
        getBuildAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<Build | null>;
        updateBuildAsync({ buildId }?: {
            buildId?: string;
        }): Promise<AppStoreVersion>;
        updateAsync(options: Partial<Omit<AppStoreVersionProps, 'watchStoreIcon' | 'platform' | 'isWatchOnly' | 'storeIcon' | 'createdDate' | 'build' | 'appStoreVersionSubmission' | 'appStoreState'>>): Promise<AppStoreVersion>;
        getAgeRatingDeclarationAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<AgeRatingDeclaration | null>;
        createResetRatingsRequestAsync(): Promise<ResetRatingsRequest>;
        createPhasedReleaseAsync({ state, }?: {
            state?: AppStoreVersionPhasedReleaseProps['phasedReleaseState'];
        }): Promise<AppStoreVersionPhasedRelease>;
        getPhasedReleaseAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<AppStoreVersionPhasedRelease | null>;
        getAppStoreReviewDetailAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<AppStoreReviewDetail | null>;
        createSubmissionAsync(): Promise<AppStoreVersionSubmission>;
        getSubmissionAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<AppStoreVersionSubmission | null>;
        getIdfaDeclarationAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<IdfaDeclaration | null>;
        createIdfaDeclarationAsync(attributes: Partial<IdfaDeclarationProps>): Promise<IdfaDeclaration>;
        createLocalizationAsync({ locale, }: Pick<AppStoreVersionLocalizationProps, 'locale'>): Promise<AppStoreVersionLocalization>;
        createReviewDetailAsync(attributes: Partial<Omit<AppStoreReviewDetailProps, 'demoAccountRequired'>>): Promise<AppStoreReviewDetail>;
        createReleaseRequestAsync(): Promise<AppStoreVersionReleaseRequest>;
        getResetRatingsRequestAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<ResetRatingsRequest | null>;
        getLocalizationsAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<AppStoreVersionLocalization[]>;
        canReject(): boolean;
        rejectAsync(): Promise<boolean>;
    }
}
declare module "connect/models/AppInfoLocalization" {
    import { RequestContext } from "network/Request";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppInfoLocalizationProps {
        locale: string;
        name: string | null;
        subtitle: string | null;
        privacyPolicyUrl: string | null;
        privacyChoicesUrl: string | null;
        privacyPolicyText: string | null;
    }
    /**
     * Used for updating basic metadata.
     */
    export class AppInfoLocalization extends ConnectModel<AppInfoLocalizationProps> {
        static type: string;
        /**
         *
         * @param id `AppInfo` id
         */
        static createAsync(context: RequestContext, { id, locale, }: {
            id: string;
            locale: string;
        }): Promise<AppInfoLocalization>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        updateAsync(attributes: Partial<AppInfoLocalizationProps>): Promise<AppInfoLocalization>;
    }
}
declare module "connect/models/AppInfo" {
    import { RequestContext } from "network/Request";
    import { ConnectQueryParams } from "connect/ConnectAPI";
    import { AppCategory, AppCategoryId, AppSubcategoryId } from "connect/models/AppCategory";
    import { AppInfoLocalization, AppInfoLocalizationProps } from "connect/models/AppInfoLocalization";
    import { BundleIdPlatform } from "connect/models/BundleId";
    import { ConnectModel } from "connect/models/ConnectModel";
    export enum AppStoreState {
        READY_FOR_SALE = "READY_FOR_SALE",
        PROCESSING_FOR_APP_STORE = "PROCESSING_FOR_APP_STORE",
        PENDING_DEVELOPER_RELEASE = "PENDING_DEVELOPER_RELEASE",
        PENDING_APPLE_RELEASE = "PENDING_APPLE_RELEASE",
        IN_REVIEW = "IN_REVIEW",
        WAITING_FOR_REVIEW = "WAITING_FOR_REVIEW",
        DEVELOPER_REJECTED = "DEVELOPER_REJECTED",
        REJECTED = "REJECTED",
        PREPARE_FOR_SUBMISSION = "PREPARE_FOR_SUBMISSION",
        METADATA_REJECTED = "METADATA_REJECTED",
        INVALID_BINARY = "INVALID_BINARY"
    }
    export enum BrazilAgeRating {
        L = "L",
        TEN = "TEN",
        TWELVE = "TWELVE",
        FOURTEEN = "FOURTEEN",
        SIXTEEN = "SIXTEEN",
        EIGHTEEN = "EIGHTEEN"
    }
    export enum AppStoreAgeRating {
        FOUR_PLUS = "FOUR_PLUS"
    }
    export enum KidsAgeBand {
        FIVE_AND_UNDER = "FIVE_AND_UNDER",
        SIX_TO_EIGHT = "SIX_TO_EIGHT",
        NINE_TO_ELEVEN = "NINE_TO_ELEVEN"
    }
    export interface AppInfoProps {
        appStoreState: AppStoreState;
        appStoreAgeRating: null | AppStoreAgeRating;
        brazilAgeRating: null | BrazilAgeRating;
        kidsAgeBand: null | KidsAgeBand;
        primaryCategory?: AppCategory;
        primarySubcategoryOne?: AppCategory;
        primarySubcategoryTwo?: AppCategory;
        secondaryCategory?: AppCategory;
        secondarySubcategoryOne?: AppCategory;
        secondarySubcategoryTwo?: AppCategory;
    }
    export interface CategoryIds {
        primaryCategory?: AppCategoryId;
        primarySubcategoryOne?: AppSubcategoryId;
        primarySubcategoryTwo?: AppSubcategoryId;
        secondaryCategory?: AppCategoryId;
        secondarySubcategoryOne?: AppSubcategoryId;
        secondarySubcategoryTwo?: AppSubcategoryId;
    }
    export class AppInfo extends ConnectModel<AppInfoProps> {
        static type: string;
        static DEFAULT_INCLUDES: string[];
        static createAsync(context: RequestContext, { id, versionString, platform, }: {
            id: string;
            versionString: string;
            platform: BundleIdPlatform;
        }): Promise<AppInfo>;
        static infoAsync: (context: RequestContext, props: {
            id: string;
            query?: ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<AppInfo>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        updateCategoriesAsync(categories?: CategoryIds): Promise<AppInfo>;
        getLocalizationsAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<AppInfoLocalization[]>;
        createLocalizationAsync({ locale, }: Pick<AppInfoLocalizationProps, 'locale'>): Promise<AppInfoLocalization>;
    }
}
declare module "connect/models/AppPriceTier" {
    import { ConnectModel } from "connect/models/ConnectModel";
    export class AppPriceTier extends ConnectModel<object> {
        static type: string;
    }
}
declare module "connect/models/AppPrice" {
    import { AppPriceTier } from "connect/models/AppPriceTier";
    import { ConnectModel } from "connect/models/ConnectModel";
    export interface AppPriceProps {
        startDate: string;
        priceTier: AppPriceTier;
    }
    export class AppPrice extends ConnectModel<AppPriceProps> {
        static type: string;
        static getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        } | undefined) => Promise<AppPrice[]>;
        static infoAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<AppPrice>;
    }
}
declare module "connect/models/InAppPurchase" {
    import { RequestContext } from "network/Request";
    import { ConnectQueryFilter, ConnectQueryParams } from "connect/ConnectAPI";
    import { ConnectModel } from "connect/models/ConnectModel";
    export enum InAppPurchaseType {
        AUTOMATICALLY_RENEWABLE_SUBSCRIPTION = "AUTOMATICALLY_RENEWABLE_SUBSCRIPTION",
        NON_CONSUMABLE = "NON_CONSUMABLE",
        CONSUMABLE = "CONSUMABLE",
        NON_RENEWING_SUBSCRIPTION = "NON_RENEWING_SUBSCRIPTION",
        FREE_SUBSCRIPTION = "FREE_SUBSCRIPTION"
    }
    export enum InAppPurchaseState {
        CREATED = "CREATED",
        DEVELOPER_SIGNED_OFF = "DEVELOPER_SIGNED_OFF",
        DEVELOPER_ACTION_NEEDED = "DEVELOPER_ACTION_NEEDED",
        DELETION_IN_PROGRESS = "DELETION_IN_PROGRESS",
        APPROVED = "APPROVED",
        DELETED = "DELETED",
        REMOVED_FROM_SALE = "REMOVED_FROM_SALE",
        DEVELOPER_REMOVED_FROM_SALE = "DEVELOPER_REMOVED_FROM_SALE",
        WAITING_FOR_UPLOAD = "WAITING_FOR_UPLOAD",
        PROCESSING_CONTENT = "PROCESSING_CONTENT",
        REPLACED = "REPLACED",
        REJECTED = "REJECTED",
        WAITING_FOR_SCREENSHOT = "WAITING_FOR_SCREENSHOT",
        PREPARE_FOR_SUBMISSION = "PREPARE_FOR_SUBMISSION",
        MISSING_METADATA = "MISSING_METADATA",
        READY_TO_SUBMIT = "READY_TO_SUBMIT",
        WAITING_FOR_REVIEW = "WAITING_FOR_REVIEW",
        IN_REVIEW = "IN_REVIEW",
        PENDING_DEVELOPER_RELEASE = "PENDING_DEVELOPER_RELEASE"
    }
    interface InAppPurchaseProps {
        referenceName: string;
        productId: string;
        inAppPurchaseType: InAppPurchaseType;
        state: InAppPurchaseState;
    }
    export type InAppPurchaseQueryFilter = ConnectQueryFilter<InAppPurchaseProps & {
        canBeSubmitted: string;
    }, 'inAppPurchaseType' | 'canBeSubmitted'>;
    export class InAppPurchase extends ConnectModel<InAppPurchaseProps> {
        static type: string;
        static getAsync(context: RequestContext, { id, query, }: {
            id: string;
            query?: ConnectQueryParams<InAppPurchaseQueryFilter>;
        }): Promise<InAppPurchase[]>;
        /**
         *
         * @param id `InAppPurchase` id (ex: UNHB5PT4MA)
         */
        static infoAsync: (context: RequestContext, props: {
            id: string;
            query?: ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<InAppPurchase>;
    }
}
declare module "connect/models/App" {
    import { RequestContext } from "network/Request";
    import { ConnectQueryFilter, ConnectQueryParams } from "connect/ConnectAPI";
    import { AppDataUsage } from "connect/models/AppDataUsage";
    import { AppDataUsageCategoryId } from "connect/models/AppDataUsageCategory";
    import { AppDataUsageDataProtectionId } from "connect/models/AppDataUsageDataProtection";
    import { AppDataUsagePurposeId } from "connect/models/AppDataUsagePurpose";
    import { AppDataUsagesPublishState } from "connect/models/AppDataUsagesPublishState";
    import { AppInfo, AppStoreState } from "connect/models/AppInfo";
    import { AppPrice } from "connect/models/AppPrice";
    import { AppStoreVersion, AppStoreVersionProps } from "connect/models/AppStoreVersion";
    import { BetaGroup } from "connect/models/BetaGroup";
    import { Build } from "connect/models/Build";
    import { BundleId } from "connect/models/BundleId";
    import { ConnectModel } from "connect/models/ConnectModel";
    import { InAppPurchase, InAppPurchaseQueryFilter } from "connect/models/InAppPurchase";
    import { Platform, PreReleaseVersion } from "connect/models/PreReleaseVersion";
    import { Territory } from "connect/models/Territory";
    export enum ContentRightsDeclaration {
        USES_THIRD_PARTY_CONTENT = "USES_THIRD_PARTY_CONTENT",
        DOES_NOT_USE_THIRD_PARTY_CONTENT = "DOES_NOT_USE_THIRD_PARTY_CONTENT"
    }
    export interface AppProps {
        sku: string;
        primaryLocale: string;
        bundleId: string;
        versionString: string;
        companyName: string;
        name: string;
        isOptedInToDistributeIosAppOnMacAppStore: boolean;
        removed: boolean;
        isAAG: boolean;
        availableInNewTerritories: boolean;
        contentRightsDeclaration: null | ContentRightsDeclaration;
        prices?: AppPrice[];
        appInfos?: AppInfo[];
        appStoreVersions?: AppStoreVersion[];
        preReleaseVersions?: PreReleaseVersion[];
        availableTerritories?: Territory[];
    }
    export type AppQueryFilter = ConnectQueryFilter<Pick<AppProps, 'sku' | 'name' | 'bundleId'> & {
        appStoreVersions: string;
        'appStoreVersions.platform': Platform;
        'appStoreVersions.appStoreState': AppStoreState;
    }, 'appStoreVersions' | 'sku' | 'name' | 'bundleId' | 'appStoreVersions.platform' | 'appStoreVersions.appStoreState'>;
    export class App extends ConnectModel<AppProps> {
        static type: string;
        static DEFAULT_INCLUDES: string[];
        static getAsync: (context: RequestContext, props?: {
            query?: ConnectQueryParams<Partial<{
                name: string | string[];
                bundleId: string | string[];
                appStoreVersions: string | string[];
                sku: string | string[];
                'appStoreVersions.platform': Platform | Platform[];
                'appStoreVersions.appStoreState': AppStoreState | AppStoreState[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<App[]>;
        static infoAsync: (context: RequestContext, props: {
            id: string;
            query?: ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<App>;
        /**
         *
         * @param bundleId bundle id string (ex. com.bacon.expo)
         */
        static findAsync(context: RequestContext, { bundleId, query, }: {
            bundleId: string;
            query?: Pick<ConnectQueryParams, 'includes'>;
        }): Promise<App | null>;
        /**
         *
         * @param id `App` id
         */
        static updateAsync(context: RequestContext, { id, attributes, appPriceTier, territories, }: {
            id: string;
            attributes?: Partial<AppProps>;
            appPriceTier?: string;
            territories?: string[];
        }): Promise<App>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
        updateAsync({ attributes, appPriceTier, territories, }: {
            attributes?: Partial<AppProps>;
            appPriceTier?: string;
            territories?: string[];
        }): Promise<App>;
        getAppDataUsagesAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<AppDataUsage[]>;
        getAppStoreVersionsAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<AppStoreVersion[]>;
        getAppInfoAsync({ query }?: {
            query?: ConnectQueryParams;
        }): Promise<AppInfo[]>;
        static ensureBundleIdExistsAsync(context: RequestContext, { bundleId, name, }: {
            bundleId: string;
            name: string;
        }): Promise<BundleId>;
        /**
         * Creates an app entry in App Store Connect. The bundle identifier must be registered ahead of time.
         *
         * @param context
         * @param props
         * @throws APP_CREATE_INSUFFICIENT_ROLE -- User does not allow for app creation, must have "App Manager" role enabled with the selected provider.
         * @throws APP_CREATE_BUNDLE_ID_NOT_REGISTERED -- Bundle identifier is not registered to the selected provider.
         * @throws APP_CREATE_NAME_INVALID Name contains invalid characters.
         * @throws APP_CREATE_NAME_UNAVAILABLE Name is already used.
         */
        static createAsync(context: RequestContext, props: {
            name: string;
            versionString?: string;
            primaryLocale?: string;
            sku?: string;
            bundleId: string;
            platforms?: Platform[];
            companyName?: string;
        }): Promise<App>;
        private getAppInfoMatchingStatesAsync;
        getLiveAppInfoAsync({ includes, }?: {
            includes?: string[];
        }): Promise<AppInfo | null>;
        getEditAppInfoAsync({ includes, }?: {
            includes?: string[];
        }): Promise<AppInfo | null>;
        getRejectableAppStoreVersionAsync({ platform, }?: {
            platform?: Platform;
        }): Promise<AppStoreVersion | null>;
        getLiveAppStoreVersionAsync({ platform, includes, }?: {
            platform?: Platform;
            includes?: string[];
        }): Promise<AppStoreVersion | null>;
        getInReviewAppStoreVersionAsync({ platform, includes, }?: {
            platform?: Platform;
            includes?: string[];
        }): Promise<AppStoreVersion | null>;
        getPendingReleaseAppStoreVersionAsync({ platform, includes, }?: {
            platform?: Platform;
            includes?: string[];
        }): Promise<AppStoreVersion | null>;
        getEditAppStoreVersionAsync({ platform, includes, }?: {
            platform?: Platform;
            includes?: string[];
        }): Promise<AppStoreVersion | null>;
        /**
         * Will make sure the current AppStoreVersion matches the given version string.
         * This could either create a new version or change the version number from an existing version.
         *
         * @param versionString
         * @param platform
         */
        ensureVersionAsync(versionString: string, platform: Platform): Promise<AppStoreVersion | null>;
        getAvailableTerritoriesAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<Territory[]>;
        getInAppPurchasesAsync({ query, }?: {
            query?: ConnectQueryParams<InAppPurchaseQueryFilter>;
        }): Promise<InAppPurchase[]>;
        getBuildsAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<Build[]>;
        getBetaGroupsAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<BetaGroup[]>;
        getAppDataUsagesPublishStateAsync({ query, }?: {
            query?: ConnectQueryParams;
        }): Promise<AppDataUsagesPublishState[]>;
        createBetaGroupAsync({ name, publicLinkEnabled, publicLinkLimit, publicLinkLimitEnabled, }: {
            name: string;
            publicLinkEnabled?: boolean;
            publicLinkLimit?: number;
            publicLinkLimitEnabled?: boolean;
        }): Promise<BetaGroup>;
        createAppDataUsageAsync({ appDataUsageCategory, appDataUsageProtection, appDataUsagePurpose, }: {
            appDataUsageCategory?: AppDataUsageCategoryId;
            appDataUsageProtection?: AppDataUsageDataProtectionId;
            appDataUsagePurpose?: AppDataUsagePurposeId;
        }): Promise<AppDataUsage>;
        createVersionAsync({ versionString, platform, }: Pick<AppStoreVersionProps, 'versionString' | 'platform'>): Promise<AppStoreVersion>;
    }
}
declare module "connect/models/AppPricePoint" {
    import { ConnectQueryFilter } from "connect/ConnectAPI";
    import { AppPriceTier } from "connect/models/AppPriceTier";
    import { ConnectModel } from "connect/models/ConnectModel";
    import { Territory } from "connect/models/Territory";
    export interface AppPricePointProps {
        customerPrice: string;
        proceeds: string;
        priceTier?: AppPriceTier;
        territory?: Territory;
    }
    export type AppPricePointQueryFilter = ConnectQueryFilter<{
        territory: string;
        priceTier: string;
    }, 'territory' | 'priceTier'>;
    export class AppPricePoint extends ConnectModel<AppPricePointProps> {
        static type: string;
        static getAsync: (context: import("AppStoreConnect").RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Partial<{
                priceTier: string | string[];
                territory: string | string[];
            } & {
                id?: string | undefined;
            }>> | undefined;
        } | undefined) => Promise<AppPricePoint[]>;
        /**
         *
         * @param id `AppPricePoint` id (ex: UNHB5PT4MA)
         */
        static infoAsync: (context: import("AppStoreConnect").RequestContext, props: {
            id: string;
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        }) => Promise<AppPricePoint>;
    }
}
declare module "connect/models/SandboxTester" {
    import { RequestContext } from "network/Request";
    import { ConnectModel } from "connect/models/ConnectModel";
    import { Territory } from "connect/models/Territory";
    export interface SandboxTesterProps {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        secretQuestion: string;
        secretAnswer: string;
        birthDate: string;
        appStoreTerritory?: Territory;
        applePayCompatible: boolean;
    }
    export class SandboxTester extends ConnectModel<SandboxTesterProps> {
        static type: string;
        static getAsync: (context: RequestContext, props?: {
            query?: import("connect/ConnectAPI").ConnectQueryParams<Record<string, any>> | undefined;
        } | undefined) => Promise<SandboxTester[]>;
        static createAsync(context: RequestContext, { attributes, }?: {
            attributes?: Partial<SandboxTesterProps>;
        }): Promise<SandboxTester>;
        static deleteAsync: (context: RequestContext, props: {
            id: string;
        }) => Promise<void>;
    }
}
declare module "connect/index" {
    export * from "connect/models/AgeRatingDeclaration";
    export * from "connect/models/ApiKey";
    export * from "connect/models/App";
    export * from "connect/models/AppDataUsage";
    export * from "connect/models/AppDataUsageCategory";
    export * from "connect/models/AppDataUsageDataProtection";
    export * from "connect/models/AppDataUsageGrouping";
    export * from "connect/models/AppDataUsagePurpose";
    export * from "connect/models/AppDataUsagesPublishState";
    export * from "connect/models/AppCategory";
    export * from "connect/models/AppGroup";
    export * from "connect/models/AppInfo";
    export * from "connect/models/AppInfoLocalization";
    export * from "connect/models/AppPrice";
    export * from "connect/models/AppPricePoint";
    export * from "connect/models/AppPriceTier";
    export * from "connect/models/AppScreenshot";
    export * from "connect/models/AppScreenshotSet";
    export * from "connect/models/AppStoreReviewAttachment";
    export * from "connect/models/AppStoreReviewDetail";
    export * from "connect/models/AppStoreVersion";
    export * from "connect/models/AppStoreVersionLocalization";
    export * from "connect/models/AppStoreVersionPhasedRelease";
    export * from "connect/models/AppStoreVersionReleaseRequest";
    export * from "connect/models/AppStoreVersionSubmission";
    export * from "connect/models/BetaAppReviewSubmission";
    export * from "connect/models/BetaBuildLocalization";
    export * from "connect/models/BetaBuildMetric";
    export * from "connect/models/BetaGroup";
    export * from "connect/models/Build";
    export * from "connect/models/BuildBetaDetail";
    export * from "connect/models/IdfaDeclaration";
    export * from "connect/models/PreReleaseVersion";
    export * from "connect/models/ResetRatingsRequest";
    export * from "connect/models/SandboxTester";
    export * from "connect/models/Territory";
    export * from "connect/models/MerchantId";
    export * from "connect/models/BundleId";
    export * from "connect/models/BundleIdCapability";
    export * from "connect/models/ContentProvider";
    export * from "connect/models/Certificate";
    export * from "connect/models/Device";
    export * from "connect/models/Profile";
    export * from "connect/models/InAppPurchase";
    export * from "connect/models/User";
    export * from "connect/models/CloudContainer";
    export { ConnectModel } from "connect/models/ConnectModel";
}
declare module "AppStoreConnect" {
    import * as Auth from "auth/Auth";
    import * as Session from "auth/Session";
    import * as ITCAgreements from "itunes/Agreements";
    import * as CookieFileCache from "network/CookieFileCache";
    import * as Keys from "portal/Keys";
    import * as Teams from "portal/Teams";
    import * as JsonFileCache from "utils/json-file-cache";
    export { ITunesConnectError, GatewayTimeoutError, IdmsaServiceError, NetworkError, InternalServerError, AuthError, InvalidUserCredentialsError, SessionExpiredError, ServiceError, UnauthorizedAccessError, AppleTimeoutError, TimeoutError, BadGatewayError, AccessForbiddenError, InsufficientPermissions, UnexpectedResponse, } from "utils/error";
    export { getValidName } from "portal/PortalAPI";
    export { RequestContext } from "network/Request";
    export { Token, TokenProps } from "connect/Token";
    export { Auth, ITCAgreements, CookieFileCache, JsonFileCache, Keys, Teams, Session };
    export * from "connect/index";
}
