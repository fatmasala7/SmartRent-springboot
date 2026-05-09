package com.smartrent.property.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("execution(* com.smartrent.property.controller..*(..)) || execution(* com.smartrent.property.service..*(..))")
    public Object logExecution(ProceedingJoinPoint jp) throws Throwable {
        String method = jp.getSignature().toShortString();
        long start = System.currentTimeMillis();
        log.debug(">>> {}", method);
        try {
            Object result = jp.proceed();
            log.debug("<<< {} | {}ms", method, System.currentTimeMillis() - start);
            return result;
        } catch (Throwable t) {
            log.warn("!!! {}: {}", method, t.getMessage());
            throw t;
        }
    }

    @AfterReturning("execution(* com.smartrent.property.service.PropertyService.approveProperty(..))")
    public void auditApproveProperty(JoinPoint jp) {
        Object[] args = jp.getArgs();
        log.info("[AUDIT] Admin {} approved property {}", args[1], args[0]);
    }

    @AfterReturning("execution(* com.smartrent.property.service.PropertyService.rejectProperty(..))")
    public void auditRejectProperty(JoinPoint jp) {
        Object[] args = jp.getArgs();
        log.info("[AUDIT] Admin {} rejected property {}", args[1], args[0]);
    }
}
