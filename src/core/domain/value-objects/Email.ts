// Objeto de valor para emails en la capa de dominio
export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  // Método de factoría que valida antes de crear
  static create(value: string): Email | Error {
    if (!Email.isValid(value)) {
      return new Error('Email no válido');
    }
    
    return new Email(value);
  }

  // Validación del formato del email
  static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Obtener el valor
  getValue(): string {
    return this.value;
  }

  // Para comparar emails
  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
} 