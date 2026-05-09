package com.smartrent.booking.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Aspect @Component @Slf4j
public class LoggingAspect {

    @Around("execution(* com.smartrent.booking.controller..*(..)) || execution(* com.smartrent.booking.service..*(..))")
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

    @AfterReturning("execution(* com.smartrent.booking.service.BookingService.acceptApplication(..))")
    public void auditAcceptApp(JoinPoint jp) {
        Object[] args = jp.getArgs();
        log.info("[AUDIT] Landlord {} accepted application {}", args[1], args[0]);
    }

    @AfterReturning("execution(* com.smartrent.booking.service.BookingService.rejectApplication(..))")
    public void auditRejectApp(JoinPoint jp) {
        Object[] args = jp.getArgs();
        log.info("[AUDIT] Landlord {} rejected application {}", args[1], args[0]);
    }

    @AfterReturning("execution(* com.smartrent.booking.service.BookingService.createApplication(..))")
    public void auditCreateApp(JoinPoint jp) {
        Object[] args = jp.getArgs();
        log.info("[AUDIT] Tenant {} submitted rental application", args[0]);
    }
}
