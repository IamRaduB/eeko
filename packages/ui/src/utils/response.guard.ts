import type {
  LocaleContentDto,
  ProjectTranslation,
} from '../types/translation';
import type { FailedResponse } from '../types/response';

export function isFailedResponse(
  payload:
    | ProjectTranslation[]
    | ProjectTranslation
    | LocaleContentDto
    | FailedResponse
): payload is FailedResponse {
  return !!(
    (payload as FailedResponse).status && (payload as FailedResponse).message
  );
}
