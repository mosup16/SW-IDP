package com.iam.oauth.Controller;

import com.iam.oauth.Client.IdentityClient;
import com.iam.oauth.DTO.Internal.SessionPrincipal;
import com.iam.oauth.Entity.ClientApplication;
import com.iam.oauth.Entity.RedirectUri;
import com.iam.oauth.Enum.Status;
import com.iam.oauth.Exception.OAuthException;
import com.iam.oauth.Repository.ClientAppRepository;
import com.iam.oauth.Service.Interface.AuthorizationCodeService;
import feign.FeignException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;

@RestController
@RequiredArgsConstructor
public class AuthorizationController {

    private final ClientAppRepository clientRepo;
    private final AuthorizationCodeService codeService;
    private final IdentityClient identityClient;

    @GetMapping("/oauth/authorize")
    public void authorize(@RequestParam("client_id") String clientId,
                          @RequestParam("redirect_uri") String redirectUri,
                          @RequestParam(value = "response_type", defaultValue = "code") String responseType,
                          @RequestParam(value = "state", required = false, defaultValue = "") String state,
                          HttpServletRequest req,
                          HttpServletResponse resp) throws IOException {

        if (!"code".equals(responseType)) {
            throw OAuthException.unsupportedResponseType();
        }

        ClientApplication client = clientRepo.findById(clientId)
                .orElseThrow(() -> OAuthException.invalidClient("unknown client_id"));

        if (client.getStatus() != Status.ACTIVE) {
            throw OAuthException.invalidClient("client is disabled");
        }

        boolean redirectValid = client.getRedirectUris().stream()
                .map(RedirectUri::getUri)
                .anyMatch(u -> u.equals(redirectUri));
        if (!redirectValid) {
            throw OAuthException.invalidRedirectUri();
        }

        String sessionToken = extractSessionCookie(req);
        if (sessionToken != null) {
            try {
                SessionPrincipal principal = identityClient.verifySession("SESSION=" + sessionToken);
                String code = codeService.mint(clientId, principal.identityId(), redirectUri);
                String location = redirectUri + "?code=" + code
                        + (state.isBlank() ? "" : "&state=" + state);
                resp.sendRedirect(location);
                return;
            } catch (FeignException ignored) {
            }
        }

        String loginUrl = "/login?client_id=" + clientId
                + "&redirect_uri=" + java.net.URLEncoder.encode(redirectUri, java.nio.charset.StandardCharsets.UTF_8)
                + "&response_type=code"
                + (state.isBlank() ? "" : "&state=" + state);
        resp.sendRedirect(loginUrl);
    }

    private String extractSessionCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> "SESSION".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
