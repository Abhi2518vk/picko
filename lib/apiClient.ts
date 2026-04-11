// Robust API Client with Exponential Backoff Retry Logic

interface FetchOptions {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    timeout?: number;
}

/**
 * Robust fetch with exponential backoff retry logic
 */
export async function robustFetch<T>(
    dummyData: T,
    shouldFail: boolean = false,
    options: FetchOptions = {}
): Promise<T> {
    const { 
        maxRetries = 3, 
        baseDelay = 1000, 
        maxDelay = 10000,
        timeout = 30000 
    } = options;

    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt <= maxRetries) {
        attempt++;
        try {
            // Only simulate delay when failure testing is enabled.
            if (shouldFail) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }

            // Simulate random failure (10% chance if shouldFail is true)
            const isFailure = shouldFail && Math.random() < 0.1;

            if (isFailure) {
                throw new Error(`API request failed on attempt ${attempt}`);
            }

            // Success - return data
            return dummyData;
        } catch (error) {
            lastError = error as Error;
            console.warn(`[API] Attempt ${attempt} failed:`, error);

            if (attempt >= maxRetries) {
                break;
            }

            // Calculate exponential backoff delay with jitter
            const delay = Math.min(
                baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
                maxDelay
            );
            
            console.log(`[API] Retrying in ${Math.round(delay)}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error(`Max retries (${maxRetries}) reached. Last error: ${lastError?.message}`);
}

/**
 * Safe fetch wrapper with timeout
 */
export async function safeFetch<T>(
    url: string,
    options: RequestInit = {},
    fetchOptions: FetchOptions = {}
): Promise<T> {
    const { timeout = 10000 } = fetchOptions;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}
