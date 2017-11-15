export class ClientTypeHelper {
    static get isWeChatMiniProgram(): boolean {
        // return true;
        return (window.__wxjs_environment === 'miniprogram');
    }
}
