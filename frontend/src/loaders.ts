/**
 * This file contains react-router loader functions that are used when a component
 * is loaded via a route. These functions are called within main.tsx
 * @see frontend/src/main.tsx
 * @reference https://reactrouter.com/en/main/route/loader
*/

import axios from "axios";
import { defer, json, LoaderFunctionArgs } from "react-router-dom";

// import { fetchApplicationData } from "./api";
import { APIConstants } from "./pathConstants";
import { AxiosError } from "./types";
import { headers } from "./api";



export async function applicationLoader({ params }: LoaderFunctionArgs) {
    const { uuid } = params;

    if (!uuid) return defer({ application: Promise.resolve([]) });

    const fetchApplication = async () => {
        try {
            const response = await axios.get(APIConstants.APPLICATION(uuid), { headers });
            setTimeout(() => console.log(response), 5000);

            if (!response.data) {
                throw new Error(`Failed to fetch application with id = ${uuid}`);
            }
            
            return response.data[0];
        }
        catch (error) {
            const errorMessage = (error as AxiosError).response?.data?.error || "Failed to fetch application.";
            console.error(errorMessage);
            throw error;
        }
    };

    return defer({ application: fetchApplication() });
}

export async function allApplicationLoader() {
    const user_id = sessionStorage.getItem('user_id') ?? 'no-id';

    try { 
        const response = await axios.get(APIConstants.ALL_APPLICATIONS(user_id), { headers });

        if (!response.data) {
            return json({ error: "Failed to fetch applications." });
        }

        return json(response.data);
    }
    catch (error) {
        const errorMessage = (error as AxiosError).response.data.error || "Failed to fetch applications.";

        console.error(errorMessage);
        return json([]);
    }
}
