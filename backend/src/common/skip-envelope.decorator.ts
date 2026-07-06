import { SetMetadata } from '@nestjs/common';

export const SKIP_ENVELOPE = 'skipEnvelope';

/** Return the handler's payload verbatim (no { success, data } wrapper). */
export const SkipEnvelope = () => SetMetadata(SKIP_ENVELOPE, true);
