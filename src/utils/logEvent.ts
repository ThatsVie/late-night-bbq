export async function logFirebaseEvent(eventName: string, eventParams?: Record<string, unknown>) {
    if (typeof window !== 'undefined') {
        const { getAnalytics, isSupported, logEvent } = await import ('firebase/analytics')
        const { app } = await import('@/firebase/config')
        if (await isSupported()) {
            const analytics = getAnalytics(app)
            logEvent(analytics, eventName, eventParams)
        }
    }
}