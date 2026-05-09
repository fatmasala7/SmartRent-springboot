package com.smartrent.auth.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("execution(* com.smartrent.auth.controller..*(..))" +
            " || execution(* com.smartrent.auth.service..*(..))")
    public Object logExecution(ProceedingJoinPoint jp) throws Throwable {
        String method = jp.getSignature().toShortString();
        long start = System.currentTimeMillis();
        log.debug(">>> Entering: {}", method);
        try {
            Object result = jp.proceed();
            long elapsed = System.currentTimeMillis() - start;
            log.debug("<<< Exiting: {} | took {}ms", method, elapsed);
            return result;
        } catch (Throwable t) {
            log.warn("!!! Exception in {}: {}", method, t.getMessage());
            throw t;
        }
    }
}
