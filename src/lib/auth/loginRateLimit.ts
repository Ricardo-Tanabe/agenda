const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function canAttemptLogin(ip: string) {
    const now = Date.now();
    const entry = loginAttempts.get(ip);

    if (!entry) {
        loginAttempts.set(ip, { count: 1, lastAttempt: now });
        return true;
    }

    // Limpa tentativas após 15 min
    if (now - entry.lastAttempt > 15 * 60 * 1000) {
        loginAttempts.set(ip, { count: 1, lastAttempt: now });
        return true;
    }

    // Bloquea após 5 tentativas
    if (entry.count >= 5) {
        return false;
    }

    entry.count++;
    entry.lastAttempt = now;
    return true;
}