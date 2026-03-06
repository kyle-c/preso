import type { Language } from '../fintechtestflow/content'

export interface TopupTokens {
  badge: string
  // Numero
  numeroTitle: string
  numeroHelper: string
  phonePlaceholder: string
  continueBtn: string
  // Tipo
  tipoTitle: string
  tipoHelper: string
  balanceName: string
  balanceDesc: string
  balanceBadge1: string
  balanceBadge2: string
  dataName: string
  dataDesc: string
  dataBadge1: string
  dataBadge2: string
  packageName: string
  packageDesc: string
  packageBadge1: string
  packageBadge2: string
  // Monto
  montoTitle: string
  rechargeFor: string
  editNumber: string
  exchangeRateLabel: string
  popular: string
  youPay: string
  noFees: string
  montoSummary: string
  continueToPay: string
  // Pago
  pagoTitle: string
  numberLabel: string
  youReceive: string
  paymentMethod: string
  change: string
  totalFees: string
  payBtn: string
  previous: string
  legalText: string
  legalLink: string
  // Listo
  successTitle: string
  successBody: string
  referralTitle: string
  referralBody: string
  shareWhatsApp: string
  anotherTopup: string
}

const en: TopupTokens = {
  badge: 'Recargas',
  numeroTitle: 'Who are you topping up?',
  numeroHelper: "Enter their number and we'll find the carrier.",
  phonePlaceholder: '55 1234 5678',
  continueBtn: 'Continue',
  tipoTitle: 'What do they need?',
  tipoHelper: 'Pick the right recharge for them.',
  balanceName: 'Balance',
  balanceDesc: 'Airtime credit, sent instantly.',
  balanceBadge1: 'Most popular',
  balanceBadge2: 'Instant',
  dataName: 'Data',
  dataDesc: 'Mobile data for internet access.',
  dataBadge1: 'MB / GB',
  dataBadge2: '30 days',
  packageName: 'Package',
  packageDesc: 'Minutes, SMS, and data in one plan.',
  packageBadge1: 'All-in-one',
  packageBadge2: 'Best value',
  montoTitle: 'How much are you sending?',
  rechargeFor: 'Recharge for',
  editNumber: 'Edit number',
  exchangeRateLabel: 'Exchange rate',
  popular: 'Popular',
  youPay: 'You pay',
  noFees: '$0 fees',
  montoSummary: "You'll pay {usd} USD for {mxn} MXN",
  continueToPay: 'Continue to payment',
  pagoTitle: 'Looking good!',
  numberLabel: 'Number',
  youReceive: 'They receive',
  paymentMethod: 'Payment method',
  change: 'Change',
  totalFees: 'Total + fees',
  payBtn: 'Pay',
  previous: 'Change amount',
  legalText: 'For questions or complaints, contact your state regulatory agency.',
  legalLink: 'Learn more.',
  successTitle: 'All done!',
  successBody: '{phone} ({carrier}) just got {amount} MXN. Nice one.',
  referralTitle: 'Spread the love',
  referralBody: 'Invite your friends and you both earn a bonus.',
  shareWhatsApp: 'Share on WhatsApp',
  anotherTopup: 'Top up again',
}

const esMx: TopupTokens = {
  badge: 'Recargas',
  numeroTitle: '¿A quién recargas?',
  numeroHelper: 'Ingresa su número y encontramos la compañía.',
  phonePlaceholder: '55 1234 5678',
  continueBtn: 'Continuar',
  tipoTitle: '¿Qué necesitan?',
  tipoHelper: 'Elige la recarga ideal.',
  balanceName: 'Saldo',
  balanceDesc: 'Crédito de tiempo aire, al instante.',
  balanceBadge1: 'Más popular',
  balanceBadge2: 'Instantáneo',
  dataName: 'Datos',
  dataDesc: 'Datos móviles para navegar.',
  dataBadge1: 'MB / GB',
  dataBadge2: '30 días',
  packageName: 'Paquete',
  packageDesc: 'Minutos, SMS y datos en un plan.',
  packageBadge1: 'Todo en uno',
  packageBadge2: 'Mejor valor',
  montoTitle: '¿Cuánto envías?',
  rechargeFor: 'Recarga para',
  editNumber: 'Editar número',
  exchangeRateLabel: 'Tipo de cambio',
  popular: 'Popular',
  youPay: 'Tú pagas',
  noFees: '$0 comisión',
  montoSummary: 'Pagarás {usd} USD por {mxn} MXN',
  continueToPay: 'Continuar al pago',
  pagoTitle: '¡Se ve bien!',
  numberLabel: 'Número',
  youReceive: 'Recibe',
  paymentMethod: 'Método de pago',
  change: 'Cambiar',
  totalFees: 'Total + comisiones',
  payBtn: 'Pagar',
  previous: 'Cambiar monto',
  legalText: 'Para preguntas o quejas, contacta a tu agencia reguladora estatal.',
  legalLink: 'Más info.',
  successTitle: '¡Listo!',
  successBody: '{phone} ({carrier}) acaba de recibir {amount} MXN. Bien hecho.',
  referralTitle: 'Comparte el amor',
  referralBody: 'Invita a tus amigos y ambos reciben un bono.',
  shareWhatsApp: 'Compartir por WhatsApp',
  anotherTopup: 'Recargar de nuevo',
}

const ptBr: TopupTokens = {
  badge: 'Recargas',
  numeroTitle: 'Pra quem é a recarga?',
  numeroHelper: 'Digite o número e a gente encontra a operadora.',
  phonePlaceholder: '55 1234 5678',
  continueBtn: 'Continuar',
  tipoTitle: 'O que precisam?',
  tipoHelper: 'Escolha a recarga ideal.',
  balanceName: 'Saldo',
  balanceDesc: 'Crédito de ligação, na hora.',
  balanceBadge1: 'Mais popular',
  balanceBadge2: 'Instantâneo',
  dataName: 'Dados',
  dataDesc: 'Dados móveis pra acessar a internet.',
  dataBadge1: 'MB / GB',
  dataBadge2: '30 dias',
  packageName: 'Pacote',
  packageDesc: 'Minutos, SMS e dados em um plano.',
  packageBadge1: 'Tudo em um',
  packageBadge2: 'Melhor valor',
  montoTitle: 'Quanto você envia?',
  rechargeFor: 'Recarga para',
  editNumber: 'Editar número',
  exchangeRateLabel: 'Taxa de câmbio',
  popular: 'Popular',
  youPay: 'Você paga',
  noFees: '$0 taxas',
  montoSummary: 'Você pagará {usd} USD por {mxn} MXN',
  continueToPay: 'Continuar para pagamento',
  pagoTitle: 'Tudo certo!',
  numberLabel: 'Número',
  youReceive: 'Recebe',
  paymentMethod: 'Forma de pagamento',
  change: 'Alterar',
  totalFees: 'Total + taxas',
  payBtn: 'Pagar',
  previous: 'Alterar valor',
  legalText: 'Para dúvidas ou reclamações, entre em contato com sua agência reguladora.',
  legalLink: 'Saiba mais.',
  successTitle: 'Prontinho!',
  successBody: '{phone} ({carrier}) recebeu {amount} MXN. Muito bem.',
  referralTitle: 'Espalhe o amor',
  referralBody: 'Convide seus amigos e ambos ganham um bônus.',
  shareWhatsApp: 'Compartilhar no WhatsApp',
  anotherTopup: 'Recarregar de novo',
}

const esDo: TopupTokens = {
  badge: 'Recargas',
  numeroTitle: '¿A quién recargas?',
  numeroHelper: 'Ingresa su número y encontramos la compañía.',
  phonePlaceholder: '55 1234 5678',
  continueBtn: 'Continuar',
  tipoTitle: '¿Qué necesitan?',
  tipoHelper: 'Elige la recarga ideal.',
  balanceName: 'Saldo',
  balanceDesc: 'Crédito de tiempo aire, al instante.',
  balanceBadge1: 'Más popular',
  balanceBadge2: 'Instantáneo',
  dataName: 'Datos',
  dataDesc: 'Datos móviles para navegar.',
  dataBadge1: 'MB / GB',
  dataBadge2: '30 días',
  packageName: 'Paquete',
  packageDesc: 'Minutos, SMS y datos en un plan.',
  packageBadge1: 'Todo en uno',
  packageBadge2: 'Mejor valor',
  montoTitle: '¿Cuánto envías?',
  rechargeFor: 'Recarga para',
  editNumber: 'Editar número',
  exchangeRateLabel: 'Tasa de cambio',
  popular: 'Popular',
  youPay: 'Tú pagas',
  noFees: '$0 comisión',
  montoSummary: 'Pagarás {usd} USD por {mxn} MXN',
  continueToPay: 'Continuar al pago',
  pagoTitle: '¡Se ve bien!',
  numberLabel: 'Número',
  youReceive: 'Recibe',
  paymentMethod: 'Método de pago',
  change: 'Cambiar',
  totalFees: 'Total + comisiones',
  payBtn: 'Pagar',
  previous: 'Cambiar monto',
  legalText: 'Para preguntas o quejas, contacta a tu agencia reguladora estatal.',
  legalLink: 'Más info.',
  successTitle: '¡Listo!',
  successBody: '{phone} ({carrier}) acaba de recibir {amount} MXN. Bien hecho.',
  referralTitle: 'Comparte el amor',
  referralBody: 'Invita a tus amigos y ambos reciben un bono.',
  shareWhatsApp: 'Compartir por WhatsApp',
  anotherTopup: 'Recargar de nuevo',
}

const esCo: TopupTokens = {
  ...esDo,
  exchangeRateLabel: 'Tipo de cambio',
}

const esPe: TopupTokens = {
  ...esDo,
  exchangeRateLabel: 'Tipo de cambio',
}

const esEc: TopupTokens = {
  ...esDo,
  exchangeRateLabel: 'Tipo de cambio',
}

export const topupContent: Record<Language, TopupTokens> = {
  'en': en,
  'es-mx': esMx,
  'pt-br': ptBr,
  'es-do': esDo,
  'es-co': esCo,
  'es-pe': esPe,
  'es-ec': esEc,
}
