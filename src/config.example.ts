import { InjectionToken } from "@angular/core";

export interface ApiConfig {
    apiUrl:string;
    recipeCacheSize:number;
}

export const APP_CONFIG: ApiConfig = {
    apiUrl: 'http://localhost:3000/api',
    recipeCacheSize: 10
};

export const CONFIG_TOKEN = new InjectionToken<ApiConfig>('APP_CONFIG',{
    providedIn:'root',
    factory: () => APP_CONFIG
});
  // private apiUrl2 = 'http://172.21.227.48:9000/api/recipes';