import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { SnValidateStatus } from 'ngx-sedna/core/types';

@Injectable()
export class SnFormStatusService {
  formStatusChanges = new ReplaySubject<{ status: SnValidateStatus; hasFeedback: boolean }>(1);
}
