let created: unknown | null = null

async function getAPI(): Promise<unknown | null> {
    if (created) return created
    // Try ESM import first
    try {
        const mod: unknown = await import('blendy')
        const m = mod as { createBlendy?: () => unknown; default?: { createBlendy?: () => unknown } }
        const api = (m.createBlendy || m.default?.createBlendy)?.()
        if (api) {
            created = api
            return created
        }
    } catch {
        // ignore, will try global
    }
    // Try global from CDN
    if (typeof window !== 'undefined') {
        const g = (window as unknown as { Blendy?: { createBlendy?: () => unknown } }).Blendy
        if (g?.createBlendy) {
            created = g.createBlendy?.()
            return created
        }
    }
    return null
}

export async function blendyAnimate(
    el: Element | null | undefined,
    keyframes: Keyframe[],
    options: number | KeyframeAnimationOptions
) {
    if (!el) return
    const api = await getAPI()
    if (api && typeof (api as { animate?: (e: Element, k: Keyframe[], o: number | KeyframeAnimationOptions) => void }).animate === 'function') {
        try {
            ; (api as { animate: (e: Element, k: Keyframe[], o: number | KeyframeAnimationOptions) => void }).animate(el, keyframes, options)
            return
        } catch {
            // fall through to native
        }
    }
    // Fallback to Web Animations API
    if ((el as HTMLElement).animate) {
        ; (el as HTMLElement).animate(keyframes, options)
    }
}
