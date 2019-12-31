export interface ConfigType
{
    name: string;
    method: string;
    url: string;
}

export interface RouteType<T>
{
    routeID: number;
    config: ConfigType;
    data?: T;
    request: () => Promise<any>;
}