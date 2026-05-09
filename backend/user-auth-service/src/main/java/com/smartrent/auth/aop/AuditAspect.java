package com.smartrent.auth.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class AuditAspect {

    @AfterReturning("execution(* com.smartrent.auth.service.AuthService.approveLandlord(..))")
    public void auditApproveLandlord(JoinPoint jp) {
        Object[] args = jp.getArgs();
        log.info("[AUDIT] Admin {} approved landlord {}", args[1], args[0]);
    }

    @AfterReturning("execution(* com.smartrent.auth.service.AuthService.rejectLandlord(..))")
    public void auditRejectLandlord(JoinPoint jp) {
        Object[] args = jp.getArgs();
        log.info("[AUDIT] Admin {} rejected landlord {}", args[1], args[0]);
    }

    @AfterReturning("execution(* com.smartrent.auth.service.AuthService.deactivateUser(..))")
    public void auditDeactivate(JoinPoint jp) {
        Object[] args = jp.getArgs();
        log.info("[AUDIT] User {} deactivated", args[0]);
    }
}
