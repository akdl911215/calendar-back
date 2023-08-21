// 500 error : Internal Server Error
// 서버가 예상하지 못한 상황에 놓였다는 것을 나타낸다.
// 이 에러 응답은 "서버 에러를 총칭하는" (catch-all) 구체적이지 않은 응답이다.
// 종종, 서버 관리자들은 미래에 같은 에러를 발생하는 것을 방지하기 위해 500 상태 코드 같은
// 에러 응답들에 더 많은 자세한 내용을 남겨둔다.

export const INTERNAL_SERVER_ERROR = 'internal_server_error';
export const AUTH_SERVER_ERROR = 'server_error_via_auth';
