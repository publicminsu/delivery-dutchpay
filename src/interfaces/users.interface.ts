export interface User {
  id: number;

  studentId: number;

  phone: string;

  section: string;

  isVerified: boolean;

  nickname: string;

  password: string;

  mannerRate: number;

  email: string;
}
export interface RequestWithReportUser extends Request {
  user: User;
  reportType: number;
}
