import { BadRequestException } from '@nestjs/common';
import { CheckBillStatus } from '@prisma/client';
import { assertLegalTransition } from '../status-transition.util';

describe('assertLegalTransition (çek/senet v2)', () => {
    it('allows IN_PORTFOLIO -> SENT_TO_BANK', () => {
        expect(() =>
            assertLegalTransition(CheckBillStatus.IN_PORTFOLIO, CheckBillStatus.SENT_TO_BANK),
        ).not.toThrow();
    });

    it('allows SENT_TO_BANK -> DISCOUNTED', () => {
        expect(() =>
            assertLegalTransition(CheckBillStatus.SENT_TO_BANK, CheckBillStatus.DISCOUNTED),
        ).not.toThrow();
    });

    it('rejects COLLECTED -> RETURNED (terminal)', () => {
        expect(() => assertLegalTransition(CheckBillStatus.COLLECTED, CheckBillStatus.RETURNED)).toThrow(
            BadRequestException,
        );
    });

    it('no-op when from is null', () => {
        expect(() => assertLegalTransition(null, CheckBillStatus.IN_PORTFOLIO)).not.toThrow();
    });
});
