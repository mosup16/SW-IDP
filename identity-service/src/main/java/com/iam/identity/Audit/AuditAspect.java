package com.iam.identity.Audit;

import com.iam.identity.Client.AuditClient;
import com.iam.identity.DTO.Audit.AuditEventDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditClient auditClient;
    private final ExpressionParser parser = new SpelExpressionParser();

    @Around("@annotation(com.iam.identity.Audit.Audited)")
    public Object audit(ProceedingJoinPoint pjp) throws Throwable {
        Audited audited = audited(pjp);
        Object result = null;
        Throwable thrown = null;
        try {
            result = pjp.proceed();
            return result;
        } catch (Throwable t) {
            thrown = t;
            throw t;
        } finally {
            boolean success = thrown == null;
            if (success || audited.captureFailure()) {
                emit(pjp, audited, result, thrown);
            }
        }
    }

    private Audited audited(ProceedingJoinPoint pjp) {
        MethodSignature sig = (MethodSignature) pjp.getSignature();
        Method method = sig.getMethod();
        return method.getAnnotation(Audited.class);
    }

    private void emit(ProceedingJoinPoint pjp, Audited a, Object result, Throwable thrown) {
        try {
            StandardEvaluationContext ctx = new StandardEvaluationContext();
            ctx.setVariable("args", pjp.getArgs());
            ctx.setVariable("result", result);

            String targetId = thrown == null ? evalString(a.targetIdExpr(), ctx) : null;
            UUID actorId = evalUuid(a.actorIdExpr(), ctx);

            Map<String, Object> metadata = new HashMap<>();
            if (thrown != null) {
                metadata.put("error", thrown.getClass().getSimpleName());
                if (thrown.getMessage() != null) {
                    metadata.put("errorMessage", thrown.getMessage());
                }
                Object firstArg = pjp.getArgs().length > 0 ? pjp.getArgs()[0] : null;
                if (firstArg != null && firstArg.getClass().getName().endsWith("Logindto")) {
                    try {
                        Object email = firstArg.getClass().getMethod("email").invoke(firstArg);
                        if (email != null) metadata.put("email", email.toString());
                    } catch (Exception ignored) {}
                }
            }

            String ip = currentIp();
            String status = thrown == null ? "SUCCESS" : "FAILURE";
            String targetType = a.targetType().isBlank() ? null : a.targetType();

            auditClient.ingest(new AuditEventDto(
                    Instant.now(), actorId, a.action(), targetType, targetId, status, ip,
                    metadata.isEmpty() ? null : metadata));
        } catch (Exception e) {
            log.warn("Audit emission failed for {}: {}", a.action(), e.getMessage());
        }
    }

    private String evalString(String expr, StandardEvaluationContext ctx) {
        if (expr == null || expr.isBlank()) return null;
        try {
            Expression parsed = parser.parseExpression(expr);
            Object value = parsed.getValue(ctx);
            return value == null ? null : value.toString();
        } catch (Exception e) {
            log.debug("Audit SpEL evaluation failed for [{}]: {}", expr, e.getMessage());
            return null;
        }
    }

    private UUID evalUuid(String expr, StandardEvaluationContext ctx) {
        String value = evalString(expr, ctx);
        if (value == null) return null;
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private String currentIp() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            return attrs == null ? null : attrs.getRequest().getRemoteAddr();
        } catch (Exception e) {
            return null;
        }
    }
}
