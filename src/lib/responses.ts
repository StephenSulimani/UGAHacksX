export interface APIResponse<T> {
    success: 0 | 1;
    error: 0 | 1;
    message: T;
}
