package com.IAM.gateway.Auth;

import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;

import java.util.List;
import java.util.Set;

@Component
public class AuthorityRules {

    private static final PathPatternParser PARSER = new PathPatternParser();

    private static final Set<HttpMethod> ALL = Set.of(
            HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT,
            HttpMethod.PATCH, HttpMethod.DELETE, HttpMethod.OPTIONS);
    private static final Set<HttpMethod> GET    = Set.of(HttpMethod.GET);
    private static final Set<HttpMethod> POST   = Set.of(HttpMethod.POST);
    private static final Set<HttpMethod> PUT    = Set.of(HttpMethod.PUT);
    private static final Set<HttpMethod> PATCH  = Set.of(HttpMethod.PATCH);
    private static final Set<HttpMethod> DELETE = Set.of(HttpMethod.DELETE);
    private static final Set<HttpMethod> WRITE  = Set.of(HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE);
    private static final Set<HttpMethod> PUTDEL = Set.of(HttpMethod.PUT, HttpMethod.DELETE);

    private final List<Rule> publicRules = List.of(
            rule("/oauth/**",                       ALL),
            rule("/userinfo",                       ALL),
            rule("/.well-known/**",                 ALL),
            rule("/api/identity/login",             POST),
            rule("/api/identity/register",          POST)
    );

    private final List<Rule> rules = List.of(
            // Authenticated-only (authority == null)
            rule("/api/identity/api/v1/sessions/me",         GET,   null),
            rule("/api/identity/api/v1/sessions/*/revoke",   POST,  null),
            rule("/api/identity/api/v1/sessions/revoke-all", POST,  null),
            rule("/api/identity/api/v1/me/password",         PATCH, null),
            rule("/api/identity/api/v1/me/claims",           GET,   null),

            // Identities
            rule("/api/identity/api/v1/identities",          GET,    "users.read"),
            rule("/api/identity/api/v1/identities/*",        GET,    "users.read"),
            rule("/api/identity/api/v1/identities",          POST,   "users.write"),
            rule("/api/identity/api/v1/identities/*",        PUTDEL, "users.write"),

            // Identity-Roles
            rule("/api/identity/api/v1/identity-roles/*/roles", GET,    "users.read"),
            rule("/api/identity/api/v1/identity-roles/assign",  POST,   "users.write"),
            rule("/api/identity/api/v1/identity-roles/remove",  DELETE, "users.write"),

            // Roles
            rule("/api/identity/roles",       GET,    "roles.read"),
            rule("/api/identity/roles/*",     GET,    "roles.read"),
            rule("/api/identity/roles",       POST,   "roles.write"),
            rule("/api/identity/roles/*",     PUTDEL, "roles.write"),

            // Permissions
            rule("/api/identity/permissions",   GET,    "roles.read"),
            rule("/api/identity/permissions/*", GET,    "roles.read"),
            rule("/api/identity/permissions",   POST,   "roles.write"),
            rule("/api/identity/permissions/*", PUTDEL, "roles.write"),

            // Role-Permissions
            rule("/api/identity/role-permissions/*/permissions",   GET,    "roles.read"),
            rule("/api/identity/role-permissions",                 POST,   "roles.write"),
            rule("/api/identity/role-permissions/*/permissions/*", DELETE, "roles.write"),

            // OAuth clients
            rule("/api/oauth/clients",      GET,    "clients.read"),
            rule("/api/oauth/clients/*",    GET,    "clients.read"),
            rule("/api/oauth/clients",      POST,   "clients.write"),
            rule("/api/oauth/clients/*",    PUTDEL, "clients.write"),
            rule("/api/oauth/clients/*/**", WRITE,  "clients.write"),

            // Audit logs
            rule("/api/admin/audit-logs", GET, "logs.view"),

            // Settings
            rule("/api/admin/settings",   GET, "settings.read"),
            rule("/api/admin/settings/*", GET, "settings.read"),
            rule("/api/admin/settings/*", PUT, "settings.write")
    );

    public boolean isInternal(String path) {
        return path.contains("/internal/");
    }

    public boolean isPublic(String path, HttpMethod method) {
        return matches(publicRules, path, method);
    }

    /**
     * Returns:
     *   - Decision.publicAccess  if the path is public (no auth needed)
     *   - Decision.deny          if the path matches no rule (default deny)
     *   - Decision.authenticated if the path requires authentication only
     *   - Decision.authority(x)  if the path requires a specific authority
     */
    public Decision decide(String path, HttpMethod method) {
        if (isInternal(path))                  return Decision.deny();
        if (isPublic(path, method))            return Decision.publicAccess();
        for (Rule r : rules) {
            if (r.matches(path, method)) {
                return r.authority == null ? Decision.authenticated() : Decision.authority(r.authority);
            }
        }
        return Decision.deny();
    }

    private static Rule rule(String pattern, Set<HttpMethod> methods) {
        return new Rule(PARSER.parse(pattern), methods, null);
    }

    private static Rule rule(String pattern, Set<HttpMethod> methods, String authority) {
        return new Rule(PARSER.parse(pattern), methods, authority);
    }

    private static boolean matches(List<Rule> list, String path, HttpMethod method) {
        for (Rule r : list) {
            if (r.matches(path, method)) return true;
        }
        return false;
    }

    private record Rule(PathPattern pattern, Set<HttpMethod> methods, String authority) {
        boolean matches(String path, HttpMethod method) {
            return methods.contains(method)
                    && pattern.matches(org.springframework.http.server.PathContainer.parsePath(path));
        }
    }

    public record Decision(Kind kind, String authority) {
        public enum Kind { PUBLIC, AUTHENTICATED, AUTHORITY, DENY }
        public static Decision publicAccess() { return new Decision(Kind.PUBLIC, null); }
        public static Decision authenticated() { return new Decision(Kind.AUTHENTICATED, null); }
        public static Decision authority(String a) { return new Decision(Kind.AUTHORITY, a); }
        public static Decision deny() { return new Decision(Kind.DENY, null); }
    }
}
