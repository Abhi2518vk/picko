// Simulated API Client with Retry Logic

interface FetchOptions {
    retries?: number;
    delay?: number;
}

/**
 * Simulates a robust fetch with retry logic
 */
export async function robustFetch<T>(
    dummyData: T,
    shouldFail: boolean = false,
    options: FetchOptions = {}
): Promise<T> {
    const { retries = 3, delay = 1000 } = options;

    return new Promise((resolve, reject) => {
        let attempt = 0;

        const execute = () => {
            attempt++;
            // Simulate network delay
            setTimeout(() => {
                // Simulate random failure (10% chance if shouldFail is true)
                const isFailure = shouldFail && Math.random() < 0.1;

                if (isFailure) {
                    console.warn(`[API] Attempt ${attempt} failed.`);
                    if (attempt < retries) {
                        console.log(`[API] Retrying in ${delay}ms...`);
                        execute(); // Retry
                    } else {
                        reject(new Error("Max retries reached. Service unavailable."));
                    }
                } else {
                    resolve(dummyData);
                }
            }, 800); // 800ms loading time
        };

        execute();
    });
}
