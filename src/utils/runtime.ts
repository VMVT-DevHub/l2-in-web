const VKS_PREFIX = '/vks';

const pathname = window.location.pathname;

export const isVksPortal = pathname === VKS_PREFIX || pathname.startsWith(`${VKS_PREFIX}/`);
export const routerBasename = isVksPortal ? VKS_PREFIX : undefined;
export const apiBasePath = isVksPortal ? `${VKS_PREFIX}/api` : '/api';
export const appHost = `${window.origin}${isVksPortal ? VKS_PREFIX : ''}`;
