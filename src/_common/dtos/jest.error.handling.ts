interface returnType {
  status: number;
  response: {
    statueCode: number;
    message: string;
    error: string;
  };
}

export function jestErrorHandling(error: any): {
  status: returnType['status'];
  response: {
    statueCode: returnType['response']['statueCode'];
    message: returnType['response']['message'];
    error: returnType['response']['error'];
  };
} {
  const status: returnType['status'] = error?.getStatus();

  const response: returnType['response'] = error?.getResponse();

  return { status, response };
}
