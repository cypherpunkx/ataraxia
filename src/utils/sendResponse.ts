import type { Response } from 'express';

interface ResponseParams {
  statusCode: number;
  status: 'success' | 'error';
  message: string;
  data?: unknown;
}

function sendResponse(
  { statusCode, status, message, data }: ResponseParams,
  res: Response
) {
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
}

export { sendResponse };
