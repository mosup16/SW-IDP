package com.iam.oauth.Exception;

import org.springframework.http.HttpStatus;

public class OAuthException extends RuntimeException {

    private final String error;
    private final String errorDescription;
    private final HttpStatus status;

    private OAuthException(String error, String errorDescription, HttpStatus status) {
        super(errorDescription);
        this.error = error;
        this.errorDescription = errorDescription;
        this.status = status;
    }

    public String getError() { return error; }
    public String getErrorDescription() { return errorDescription; }
    public HttpStatus getStatus() { return status; }

    public static OAuthException invalidClient(String msg) {
        return new OAuthException("invalid_client", msg, HttpStatus.UNAUTHORIZED);
    }

    public static OAuthException invalidGrant(String msg) {
        return new OAuthException("invalid_grant", msg, HttpStatus.BAD_REQUEST);
    }

    public static OAuthException invalidRedirectUri() {
        return new OAuthException("invalid_redirect_uri", "redirect_uri mismatch", HttpStatus.BAD_REQUEST);
    }

    public static OAuthException unsupportedResponseType() {
        return new OAuthException("unsupported_response_type", "only 'code' is supported", HttpStatus.BAD_REQUEST);
    }

    public static OAuthException unsupportedGrantType() {
        return new OAuthException("unsupported_grant_type",
                "only authorization_code and refresh_token are supported", HttpStatus.BAD_REQUEST);
    }
}
