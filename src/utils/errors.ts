export const getErrorMessage = (error: unknown) => {
  if (!error) return 'Something went wrong';

  if (typeof error === 'string') return error;

  if (typeof error === 'object' && error !== null) {
    const anyError = error as {
      response?: {
        data?: {
          message?: string | string[];
          error?: string;
        };
        status?: number;
      };
      message?: string;
    };

    const responseMessage = anyError.response?.data?.message;
    if (Array.isArray(responseMessage)) return responseMessage.join(', ');
    if (responseMessage) return responseMessage;

    if (anyError.response?.data?.error) return anyError.response.data.error;
    if (anyError.message) return anyError.message;
  }

  return 'Something went wrong';
};
