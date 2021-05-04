export interface IEmailOption {
  to: string;
  subject: string;
  template: string;
  context: {
    type_name: string;
    student_id: string;
    name: string;
    validate_url?: string;
    file?: {
      file_name: string;
      content: Buffer;
    };
  };
}
