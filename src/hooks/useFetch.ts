import { useEffect, useState } from "react";

export function useFetch<T>(url: string | null) { // null = on fetch psa si url vide
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) return; // --> nada si pas d'url

        const controller = new AbortController();

        async function doFetch() {
            try {
                setIsLoading(true);
                setError(null);
                const res = await fetch(url!, { signal: controller.signal });

                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }

                const json = await res.json();
                setData(json);
            } catch (error) {
                if (error instanceof Error && error.name === "AbortError") return;
                setError(error instanceof Error ? error.message : `Uknown error: ${error}`);
            } finally {
                setIsLoading(false);
            }
        }

        doFetch();

        return () => {
            controller.abort();
        };
    }, [url]);

    return { data, error, isLoading };
}