import { Consultation, ConsultationStatus } from '@/types';
import { parseScheduledDate } from '@/utils/dateUtils';

// Consultation entity business logic
export class ConsultationEntity {
  constructor(private consultation: Consultation) {}

  get id(): string {
    return this.consultation.id;
  }

  get subject(): string {
    return this.consultation.subject;
  }

  get description(): string {
    return this.consultation.description;
  }

  get scheduledAt(): Date {
    return parseScheduledDate(this.consultation.scheduledAt);
  }

  get duration(): number {
    return this.consultation.duration;
  }

  get status(): ConsultationStatus {
    return this.consultation.status;
  }

  get price(): number {
    return this.consultation.price;
  }

  get currency(): string {
    return this.consultation.currency;
  }

  get teacherId(): string {
    return this.consultation.teacherId;
  }

  get studentId(): string {
    return this.consultation.studentId;
  }

  get meetingLink(): string | undefined {
    return this.consultation.meetingLink;
  }

  get rating(): number | undefined {
    return this.consultation.rating;
  }

  get feedback(): string | undefined {
    return this.consultation.feedback;
  }

  // Business logic methods
  isPending(): boolean {
    return this.consultation.status === 'pending';
  }

  isConfirmed(): boolean {
    return this.consultation.status === 'confirmed';
  }

  isInProgress(): boolean {
    return this.consultation.status === 'in_progress';
  }

  isCompleted(): boolean {
    return this.consultation.status === 'completed';
  }

  isCancelled(): boolean {
    return this.consultation.status === 'cancelled';
  }

  isNoShow(): boolean {
    return this.consultation.status === 'no_show';
  }

  canBeCancelled(): boolean {
    const now = new Date();
    const scheduledTime = this.scheduledAt;
    const hoursUntilConsultation = (scheduledTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return (this.isPending() || this.isConfirmed()) && hoursUntilConsultation > 24;
  }

  canBeStarted(): boolean {
    const now = new Date();
    const scheduledTime = this.scheduledAt;
    const minutesUntilConsultation = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);
    
    return this.isConfirmed() && minutesUntilConsultation <= 15 && minutesUntilConsultation >= -this.duration;
  }

  canBeRated(): boolean {
    return this.isCompleted() && !this.rating;
  }

  getEndTime(): Date {
    const endTime = parseScheduledDate(this.consultation.scheduledAt);
    endTime.setMinutes(endTime.getMinutes() + this.duration);
    return endTime;
  }

  getStatusLabel(): string {
    switch (this.consultation.status) {
      case 'pending':
        return 'În așteptare';
      case 'confirmed':
        return 'Confirmată';
      case 'in_progress':
        return 'În desfășurare';
      case 'completed':
        return 'Finalizată';
      case 'cancelled':
        return 'Anulată';
      case 'no_show':
        return 'Neprezentare';
      default:
        return 'Necunoscută';
    }
  }

  getStatusColor(): string {
    switch (this.consultation.status) {
      case 'pending':
        return 'yellow';
      case 'confirmed':
        return 'blue';
      case 'in_progress':
        return 'green';
      case 'completed':
        return 'gray';
      case 'cancelled':
        return 'red';
      case 'no_show':
        return 'red';
      default:
        return 'gray';
    }
  }

  getFormattedPrice(): string {
    return `${this.consultation.price} ${this.consultation.currency}`;
  }

  getFormattedDuration(): string {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  }

  getFormattedSchedule(): string {
    const date = this.scheduledAt;
    const endTime = this.getEndTime();
    
    return `${date.toLocaleDateString('ro-RO')} ${date.toLocaleTimeString('ro-RO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })} - ${endTime.toLocaleTimeString('ro-RO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  }

  isUpcoming(): boolean {
    return this.scheduledAt > new Date() && (this.isPending() || this.isConfirmed());
  }

  isPast(): boolean {
    return this.getEndTime() < new Date();
  }

  getTimeUntilStart(): string {
    const now = new Date();
    const timeDiff = this.scheduledAt.getTime() - now.getTime();
    
    if (timeDiff < 0) return 'Started';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `în ${days} zile`;
    if (hours > 0) return `în ${hours} ore`;
    return `în ${minutes} minute`;
  }

  // Static factory methods
  static fromApiResponse(consultationData: any): ConsultationEntity {
    return new ConsultationEntity(consultationData);
  }

  static createEmpty(): ConsultationEntity {
    return new ConsultationEntity({
      id: '',
      teacherId: '',
      studentId: '',
      subject: '',
      description: '',
      scheduledAt: new Date().toISOString(),
      duration: 60,
      status: 'pending',
      price: 0,
      currency: 'RON',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}
