/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/automations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List automations */
        get: {
            parameters: {
                query?: {
                    /** @description Enable pagination. Supplied value used as page number */
                    page?: components["parameters"]["page"];
                    /** @description Number of records to be returned. */
                    limit?: components["parameters"]["limit"];
                    /** @description  You can sort by any property in the objects (strings or numbers) */
                    sort?: components["parameters"]["sort"];
                    /** @description You can order by either ascending or descending order */
                    order?: components["parameters"]["order"];
                    /** @description To search an array, you can use the search query parameter. Search is a special kind of filter that will look for a partial match in any values (with nesting) in the array */
                    search?: components["parameters"]["search"];
                    /** @description """
                     *     To filter an array, you can use query parameters in the form [property]_[operator]
                     *     Available operators:
                     *       eq  	Filters by equality
                     *       ne  	Filters by inequality
                     *       gt  	Filters by greater
                     *       gte 	Filters by greater or equal
                     *       lt  	Filters by lower
                     *       lte 	Filters by lower or equal
                     *       like	Filters by partial match *
                     *       start	Filters properties that start with a value *
                     *       end   Filters properties that end with a value *
                     *     """
                     *      */
                    "[propety]_[operation]"?: components["parameters"]["[propety]_[operation]"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["AutomationPageResponse"];
                401: components["responses"]["UnauthorizedResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get automation */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description ID of the automation */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["AutomationSingleResponse"];
                401: components["responses"]["UnauthorizedResponse"];
                404: components["responses"]["EntityNotFoundResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automations/{id}/logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get automation logs */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description ID of the automation */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["AutomationLogResponse"];
                401: components["responses"]["UnauthorizedResponse"];
                404: components["responses"]["EntityNotFoundResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automation-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List automation types */
        get: {
            parameters: {
                query?: {
                    /** @description Enable pagination. Supplied value used as page number */
                    page?: components["parameters"]["page"];
                    /** @description Number of records to be returned. */
                    limit?: components["parameters"]["limit"];
                    /** @description  You can sort by any property in the objects (strings or numbers) */
                    sort?: components["parameters"]["sort"];
                    /** @description You can order by either ascending or descending order */
                    order?: components["parameters"]["order"];
                    /** @description To search an array, you can use the search query parameter. Search is a special kind of filter that will look for a partial match in any values (with nesting) in the array */
                    search?: components["parameters"]["search"];
                    /** @description """
                     *     To filter an array, you can use query parameters in the form [property]_[operator]
                     *     Available operators:
                     *       eq  	Filters by equality
                     *       ne  	Filters by inequality
                     *       gt  	Filters by greater
                     *       gte 	Filters by greater or equal
                     *       lt  	Filters by lower
                     *       lte 	Filters by lower or equal
                     *       like	Filters by partial match *
                     *       start	Filters properties that start with a value *
                     *       end   Filters properties that end with a value *
                     *     """
                     *      */
                    "[propety]_[operation]"?: components["parameters"]["[propety]_[operation]"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["AutomationTypePageResponse"];
                401: components["responses"]["UnauthorizedResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automation-types/{type}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get automation type */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description The automation type */
                    type: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["AutomationTypeSingleResponse"];
                401: components["responses"]["UnauthorizedResponse"];
                404: components["responses"]["EntityNotFoundResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List SAS */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["SASResponse"];
                401: components["responses"]["UnauthorizedResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runners": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List runners */
        get: {
            parameters: {
                query?: {
                    /** @description Enable pagination. Supplied value used as page number */
                    page?: components["parameters"]["page"];
                    /** @description Number of records to be returned. */
                    limit?: components["parameters"]["limit"];
                    /** @description  You can sort by any property in the objects (strings or numbers) */
                    sort?: components["parameters"]["sort"];
                    /** @description You can order by either ascending or descending order */
                    order?: components["parameters"]["order"];
                    /** @description To search an array, you can use the search query parameter. Search is a special kind of filter that will look for a partial match in any values (with nesting) in the array */
                    search?: components["parameters"]["search"];
                    /** @description """
                     *     To filter an array, you can use query parameters in the form [property]_[operator]
                     *     Available operators:
                     *       eq  	Filters by equality
                     *       ne  	Filters by inequality
                     *       gt  	Filters by greater
                     *       gte 	Filters by greater or equal
                     *       lt  	Filters by lower
                     *       lte 	Filters by lower or equal
                     *       like	Filters by partial match *
                     *       start	Filters properties that start with a value *
                     *       end   Filters properties that end with a value *
                     *     """
                     *      */
                    "[propety]_[operation]"?: components["parameters"]["[propety]_[operation]"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["RunnerPageResponse"];
                401: components["responses"]["UnauthorizedResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runners/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get runner */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Id of the entity to be returned. */
                    id: components["parameters"]["id"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["RunnerSingleResponse"];
                401: components["responses"]["UnauthorizedResponse"];
                404: components["responses"]["EntityNotFoundResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/jobs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List jobs */
        get: {
            parameters: {
                query?: {
                    /** @description Enable pagination. Supplied value used as page number */
                    page?: components["parameters"]["page"];
                    /** @description Number of records to be returned. */
                    limit?: components["parameters"]["limit"];
                    /** @description  You can sort by any property in the objects (strings or numbers) */
                    sort?: components["parameters"]["sort"];
                    /** @description You can order by either ascending or descending order */
                    order?: components["parameters"]["order"];
                    /** @description To search an array, you can use the search query parameter. Search is a special kind of filter that will look for a partial match in any values (with nesting) in the array */
                    search?: components["parameters"]["search"];
                    /** @description """
                     *     To filter an array, you can use query parameters in the form [property]_[operator]
                     *     Available operators:
                     *       eq  	Filters by equality
                     *       ne  	Filters by inequality
                     *       gt  	Filters by greater
                     *       gte 	Filters by greater or equal
                     *       lt  	Filters by lower
                     *       lte 	Filters by lower or equal
                     *       like	Filters by partial match *
                     *       start	Filters properties that start with a value *
                     *       end   Filters properties that end with a value *
                     *     """
                     *      */
                    "[propety]_[operation]"?: components["parameters"]["[propety]_[operation]"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["JobPageResponse"];
                401: components["responses"]["UnauthorizedResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/jobs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get job */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Id of the entity to be returned. */
                    id: components["parameters"]["id"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["JobSingleResponse"];
                401: components["responses"]["UnauthorizedResponse"];
                404: components["responses"]["EntityNotFoundResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description List metrics */
        get: {
            parameters: {
                query?: {
                    /** @description Enable pagination. Supplied value used as page number */
                    page?: components["parameters"]["page"];
                    /** @description Number of records to be returned. */
                    limit?: components["parameters"]["limit"];
                    /** @description  You can sort by any property in the objects (strings or numbers) */
                    sort?: components["parameters"]["sort"];
                    /** @description You can order by either ascending or descending order */
                    order?: components["parameters"]["order"];
                    /** @description To search an array, you can use the search query parameter. Search is a special kind of filter that will look for a partial match in any values (with nesting) in the array */
                    search?: components["parameters"]["search"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["MetricsPageResponse"];
                401: components["responses"]["UnauthorizedResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/metrics/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Get metrics by runner */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Id of the entity to be returned. */
                    id: components["parameters"]["id"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: components["responses"]["MetricsSingleResponse"];
                401: components["responses"]["UnauthorizedResponse"];
                404: components["responses"]["EntityNotFoundResponse"];
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        State: string;
        AutomationTypeId: string;
        Automation: {
            id: string;
            type: components["schemas"]["AutomationTypeId"];
            sas: components["schemas"]["SAS"];
            state: components["schemas"]["State"];
            /** Format: date-time */
            last_activity: string;
        };
        AutomationLog: {
            automation_id: string;
            /** Format: date-time */
            timestamp: string;
            level: string;
            type: components["schemas"]["AutomationTypeId"];
            from_state: components["schemas"]["State"];
            to_state: components["schemas"]["State"];
            description: string;
        };
        AutomationType: {
            type?: components["schemas"]["AutomationTypeId"];
            states?: components["schemas"]["State"][];
            initial_state?: components["schemas"]["State"];
            end_state?: components["schemas"]["State"];
            transitions?: components["schemas"]["Transition"][];
        };
        Transition: {
            from_state?: components["schemas"]["State"];
            to_state?: components["schemas"]["State"];
            event?: string | null;
            action?: string | null;
        };
        SAS: string;
        /** @enum {string} */
        RunnerState: "idle" | "active" | "failed" | "offline";
        Runner: {
            id?: string;
            state?: components["schemas"]["RunnerState"];
            runner_group?: string;
            organization?: string;
        };
        /** @enum {string} */
        JobState: "success" | "failed" | "queued" | "in_progress";
        Job: {
            id?: string;
            state?: components["schemas"]["JobState"];
            organization?: string;
            SAS?: components["schemas"]["SAS"];
            runner?: string;
            /** Format: date-time */
            timestamp?: string;
        };
        Metric: {
            /** Format: float */
            cpu?: number;
            memory?: number;
            network_receive?: number;
            network_transmit?: number;
            fs_reads?: number;
            fs_writes?: number;
        };
        MetricWithRunner: {
            runner?: string;
            /** @description """
             *     Array of last N metrics. From the oldest to the newest.
             *
             *     1 fixed point in time:
             *     For offline runners - from unspecified past to the runner termination (equal to the timestamp of the runner's job with success or failed state).
             *     For idle runners - from unspecified past to the present.
             *     - steps between metrics are unspecified, choose a reasonable constant.
             *
             *     2 fixed points in time:
             *     For active runners - from the runner start (equal to the timestamp of the runner's job with in_progress state) to the present.
             *     - steps between metrics should be scaled to the runner activity time window.
             *     """
             *      */
            metrics?: components["schemas"]["Metric"][];
        };
        ErrorResponse: {
            code: string;
            error?: string;
            message: string;
        };
        EmptyResponse: {
            data?: Record<string, never>;
        };
    };
    responses: {
        /** @description Automation response */
        AutomationSingleResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Automation"];
            };
        };
        /** @description Collection of automation instances response */
        AutomationPageResponse: {
            headers: {
                "X-Total-Count": components["headers"]["X-Total-Count"];
                "X-Filtered-Count": components["headers"]["X-Filtered-Count"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Automation"][];
            };
        };
        /** @description Collection of automation instance logs */
        AutomationLogResponse: {
            headers: {
                "X-Total-Count": components["headers"]["X-Total-Count"];
                "X-Filtered-Count": components["headers"]["X-Filtered-Count"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["AutomationLog"][];
            };
        };
        /** @description Automation type response */
        AutomationTypeSingleResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["AutomationType"];
            };
        };
        /** @description Collection of automation types response */
        AutomationTypePageResponse: {
            headers: {
                "X-Total-Count": components["headers"]["X-Total-Count"];
                "X-Filtered-Count": components["headers"]["X-Filtered-Count"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["AutomationType"][];
            };
        };
        /** @description Collection of SAS response */
        SASResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["SAS"][];
            };
        };
        /** @description Single runner pod response */
        RunnerSingleResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Runner"];
            };
        };
        /** @description Collection of runner pods instances response */
        RunnerPageResponse: {
            headers: {
                "X-Total-Count": components["headers"]["X-Total-Count"];
                "X-Filtered-Count": components["headers"]["X-Filtered-Count"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Runner"][];
            };
        };
        /** @description Single job response */
        JobSingleResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Job"];
            };
        };
        /** @description Collection of jobs response */
        JobPageResponse: {
            headers: {
                "X-Total-Count": components["headers"]["X-Total-Count"];
                "X-Filtered-Count": components["headers"]["X-Filtered-Count"];
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Job"][];
            };
        };
        /** @description Single metrics response */
        MetricsSingleResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Metric"];
            };
        };
        /** @description Collection of metrics response */
        MetricsPageResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Metric"][];
            };
        };
        /** @description An Entity with the specified ID was not found */
        EntityNotFoundResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["EmptyResponse"];
            };
        };
        /** @description Method not Allowed */
        MethodNotAllowedResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
        /** @description Unauthorized */
        UnauthorizedResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorResponse"];
            };
        };
    };
    parameters: {
        /** @description Id of the entity to be returned. */
        id: string;
        /** @description Enable pagination. Supplied value used as page number */
        page: number;
        /** @description Number of records to be returned. */
        limit: number;
        /** @description  You can sort by any property in the objects (strings or numbers) */
        sort: string;
        /** @description You can order by either ascending or descending order */
        order: "asc" | "desc";
        /** @description To search an array, you can use the search query parameter. Search is a special kind of filter that will look for a partial match in any values (with nesting) in the array */
        search: string;
        /** @description """
         *     To filter an array, you can use query parameters in the form [property]_[operator]
         *     Available operators:
         *       eq  	Filters by equality
         *       ne  	Filters by inequality
         *       gt  	Filters by greater
         *       gte 	Filters by greater or equal
         *       lt  	Filters by lower
         *       lte 	Filters by lower or equal
         *       like	Filters by partial match *
         *       start	Filters properties that start with a value *
         *       end   Filters properties that end with a value *
         *     """
         *      */
        "[propety]_[operation]": string;
    };
    requestBodies: never;
    headers: {
        /** @description total number of items in the bucket */
        "X-Total-Count": number;
        /** @description number of items after filtering (not taking into account pagination) */
        "X-Filtered-Count": number;
    };
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
