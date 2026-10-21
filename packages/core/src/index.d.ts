export type CaveTheme = 'system' | 'light' | 'dark' | 'black';
export type CaveNumberingSystem = 'auto' | 'latn' | 'arab';
export type CaveDirection = 'auto' | 'ltr' | 'rtl';
export interface CaveState { readonly numberingSystem: CaveNumberingSystem; readonly resolvedNumberingSystem: 'latn' | 'arab'; readonly locale: string; readonly theme: CaveTheme; readonly direction: CaveDirection; readonly resolvedDirection: 'ltr' | 'rtl'; readonly resolvedTheme: Exclude<CaveTheme,'system'>; }
export interface CaveOptions { numberingSystem?: CaveNumberingSystem; root?: HTMLElement; locale?: string; theme?: CaveTheme; direction?: CaveDirection; storageKey?: string; messages?: Partial<Record<'en' | 'ar', Record<string,string>>>; }
export interface CaveController { readonly state: CaveState; setNumberingSystem(value: CaveNumberingSystem): CaveState; setLocale(locale: string): CaveState; setTheme(theme: CaveTheme): CaveState; setDirection(direction: CaveDirection): CaveState; t(key: string): string; number(value: number | bigint, options?: Intl.NumberFormatOptions): string; date(value: Date | number, options?: Intl.DateTimeFormatOptions): string; destroy(): void; }
export declare const messages: Readonly<Record<'en' | 'ar', Readonly<Record<string,string>>>>;
export declare function createCave(options?: CaveOptions): CaveController;
export declare function openDialog(dialog: HTMLDialogElement, returnFocus?: HTMLElement): void;
export declare function closeDialog(dialog: HTMLDialogElement, value?: string): void;
export declare function mountTabs(tablist: HTMLElement): () => void;
