
export interface RedType
{
    addView(fn: Function): void;
    removeView(fn: Function): void;
    run(): void;
}