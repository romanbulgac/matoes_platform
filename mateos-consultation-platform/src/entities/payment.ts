import { Payment, PaymentStatus, PaymentMethod } from '@/types';

// Payment entity business logic
export class PaymentEntity {
  constructor(private payment: Payment) {}

  get id(): string {
    return this.payment.id;
  }

  get consultationId(): string {
    return this.payment.consultationId;
  }

  get userId(): string {
    return this.payment.userId;
  }

  get amount(): number {
    return this.payment.amount;
  }

  get currency(): string {
    return this.payment.currency;
  }

  get status(): PaymentStatus {
    return this.payment.status;
  }

  get method(): PaymentMethod {
    return this.payment.method;
  }

  get paymentIntentId(): string | undefined {
    return this.payment.paymentIntentId;
  }

  get transactionId(): string | undefined {
    return this.payment.transactionId;
  }

  get createdAt(): Date {
    return new Date(this.payment.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.payment.updatedAt);
  }

  get failureReason(): string | undefined {
    return this.payment.failureReason;
  }

  get refundAmount(): number | undefined {
    return this.payment.refundAmount;
  }

  get refundedAt(): Date | undefined {
    return this.payment.refundedAt ? new Date(this.payment.refundedAt) : undefined;
  }

  // Business logic methods
  isPending(): boolean {
    return this.payment.status === 'pending';
  }

  isProcessing(): boolean {
    return this.payment.status === 'processing';
  }

  isSucceeded(): boolean {
    return this.payment.status === 'succeeded';
  }

  isFailed(): boolean {
    return this.payment.status === 'failed';
  }

  isCancelled(): boolean {
    return this.payment.status === 'cancelled';
  }

  isRefunded(): boolean {
    return this.payment.status === 'refunded';
  }

  isPartiallyRefunded(): boolean {
    return this.payment.status === 'partially_refunded';
  }

  canBeRefunded(): boolean {
    return this.isSucceeded() && !this.isRefunded() && !this.isPartiallyRefunded();
  }

  canBeRetried(): boolean {
    return this.isFailed() || this.isCancelled();
  }

  isCompleted(): boolean {
    return this.isSucceeded() || this.isRefunded() || this.isPartiallyRefunded();
  }

  hasFailure(): boolean {
    return this.isFailed() && !!this.failureReason;
  }

  getStatusLabel(): string {
    switch (this.payment.status) {
      case 'pending':
        return 'În așteptare';
      case 'processing':
        return 'În procesare';
      case 'succeeded':
        return 'Finalizată';
      case 'failed':
        return 'Eșuată';
      case 'cancelled':
        return 'Anulată';
      case 'refunded':
        return 'Rambursată';
      case 'partially_refunded':
        return 'Parțial rambursată';
      default:
        return 'Necunoscută';
    }
  }

  getStatusColor(): string {
    switch (this.payment.status) {
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
      case 'succeeded':
        return 'green';
      case 'failed':
        return 'red';
      case 'cancelled':
        return 'gray';
      case 'refunded':
        return 'orange';
      case 'partially_refunded':
        return 'orange';
      default:
        return 'gray';
    }
  }

  getMethodLabel(): string {
    switch (this.payment.method) {
      case 'card':
        return 'Card';
      case 'bank_transfer':
        return 'Transfer bancar';
      case 'paypal':
        return 'PayPal';
      case 'crypto':
        return 'Criptomonedă';
      default:
        return 'Necunoscut';
    }
  }

  getFormattedAmount(): string {
    return `${this.payment.amount.toFixed(2)} ${this.payment.currency}`;
  }

  getFormattedRefundAmount(): string {
    if (!this.refundAmount) return '0.00';
    return `${this.refundAmount.toFixed(2)} ${this.payment.currency}`;
  }

  getRemainingAmount(): number {
    if (!this.refundAmount) return this.payment.amount;
    return this.payment.amount - this.refundAmount;
  }

  getFormattedRemainingAmount(): string {
    return `${this.getRemainingAmount().toFixed(2)} ${this.payment.currency}`;
  }

  getRefundPercentage(): number {
    if (!this.refundAmount) return 0;
    return (this.refundAmount / this.payment.amount) * 100;
  }

  getTimeSinceCreation(): string {
    const now = new Date();
    const timeDiff = now.getTime() - this.createdAt.getTime();
    
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `acum ${days} zile`;
    if (hours > 0) return `acum ${hours} ore`;
    if (minutes > 0) return `acum ${minutes} minute`;
    return 'acum';
  }

  getFormattedCreatedAt(): string {
    return this.createdAt.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getFormattedRefundedAt(): string {
    if (!this.refundedAt) return '';
    return this.refundedAt.toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isRecent(): boolean {
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceCreation <= 24;
  }

  isOld(): boolean {
    const now = new Date();
    const daysSinceCreation = (now.getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation > 30;
  }

  getProcessingTime(): string | null {
    if (!this.isCompleted()) return null;
    
    const processingTime = this.updatedAt.getTime() - this.createdAt.getTime();
    const seconds = Math.floor(processingTime / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) return `${minutes} minute`;
    return `${seconds} secunde`;
  }

  // Static factory methods
  static fromApiResponse(paymentData: any): PaymentEntity {
    return new PaymentEntity(paymentData);
  }

  static createPending(consultationId: string, userId: string, amount: number, currency: string = 'RON', method: PaymentMethod = 'card'): PaymentEntity {
    return new PaymentEntity({
      id: '',
      consultationId,
      userId,
      amount,
      currency,
      status: 'pending',
      method,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Validation methods
  isValidAmount(): boolean {
    return this.payment.amount > 0 && this.payment.amount <= 10000; // Max 10,000 RON per transaction
  }

  isValidCurrency(): boolean {
    const validCurrencies = ['RON', 'EUR', 'USD'];
    return validCurrencies.includes(this.payment.currency);
  }

  isValidMethod(): boolean {
    const validMethods: PaymentMethod[] = ['card', 'bank_transfer', 'paypal', 'crypto'];
    return validMethods.includes(this.payment.method);
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isValidAmount()) {
      errors.push('Suma trebuie să fie între 0 și 10,000 RON');
    }

    if (!this.isValidCurrency()) {
      errors.push('Moneda nu este validă');
    }

    if (!this.isValidMethod()) {
      errors.push('Metoda de plată nu este validă');
    }

    if (!this.consultationId) {
      errors.push('ID-ul consultației este obligatoriu');
    }

    if (!this.userId) {
      errors.push('ID-ul utilizatorului este obligatoriu');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
