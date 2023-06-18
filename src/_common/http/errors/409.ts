// 409 error: Conflict
// 서버의 현재 상태와 요청이 충돌했음을 나타낸다. 충돌은 PUT 요청에 대응하여 발생할 가능성이 가장 높다.
// ex) 서버에 이미 있는 파일보다 오래된 파일을 업로드할 때 409 응답이 발생하여 버전 제어 충돌이 발생할 수 있다.

export const REFRESH_TOKEN_MODIFY_FAILED = 'refresh_token';
export const UPDATE_FAILED = 'update_failed';
