package com.smartrent.engagement.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect @Component @Slf4j
public class LoggingAspect {
    @Around("execution(* com.smartrent.engagement.controller..*(..)) || execution(* com.smartrent.engagement.service..*(..))")
    public Object log(ProceedingJoinPoint jp) throws Throwable {
        String m = jp.getSignature().toShortString();
        long t = System.currentTimeMillis();
        log.debug(">>> {}", m);
        try {
            Object r = jp.proceed();
            log.debug("<<< {} | {}ms", m, System.currentTimeMillis() - t);
            return r;
        } catch (Throwable ex) { log.warn("!!! {}: {}", m, ex.getMessage()); throw ex; }
    }
}
