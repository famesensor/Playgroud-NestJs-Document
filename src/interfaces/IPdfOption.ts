import { Approve } from 'src/trasaction/entity/approve.entity';
import { DocumentRO01 } from 'src/trasaction/entity/document-ro01.entity';
import { DocumentRO16 } from 'src/trasaction/entity/document-ro16.entity';
import { DocumentRO26 } from 'src/trasaction/entity/document-ro26.entity';
import { User } from 'src/user/entity/user.entity';

export interface IPdfOption {
  template: string;
  student: User;
  approves: Approve[];
  data: DocumentRO01 | DocumentRO16 | DocumentRO26;
}
