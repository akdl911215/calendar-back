// 201 요청 : Created
// 요청이 성공적으로 처리되었으며, 자원이 생성되었음을 나타내는 성공 상태 응답 코드이다.
// 해당 HTTP 요청에 대해 회신되기 이전에 정상적으로 생성된 자원은 회신 메시지의 본문(body)에 동봉되고,
// 구체적으로는 요청 메시지의 URL이나, Location 헤더의 내용에 위치하게 된다.
// 이 상태코드(status code)는 일반적으로 POST 요청(request)에 대한 응답 결과(result)로써 사용한다.

export const CREATE_SUCCESS = 'CREATE_SUCCESS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
