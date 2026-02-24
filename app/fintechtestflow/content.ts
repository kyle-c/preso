export type Language = 'en' | 'es-mx' | 'pt-br'

export const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en',    label: 'English',         flag: '🇺🇸' },
  { code: 'es-mx', label: 'Español (MX)',     flag: '🇲🇽' },
  { code: 'pt-br', label: 'Português (BR)',   flag: '🇧🇷' },
]

export interface ContentTokens {
  common: {
    badge: string
    continue: string
    cancel: string
    selected: string
    change: string
  }
  paymentMethod: {
    titleLine1: string
    titleLine2: string
    subtitle: string
    orPayAnotherWay: string
    creditDebitName: string
    creditDebitDesc: string
    applePayName: string
    applePayDesc: string
    bankName: string
    bankDesc: string
    cashName: string
    cashDesc: string
    badgeNoFeeDebit: string
    badgeInstant: string
    badgeNoFee: string
    badgeBusinessDays: string
    badgeCashFee: string
    badgeSameDay: string
  }
  address: {
    titleBilling: string
    titleCash: string
    helperCash: string
    fieldAddress: string
    fieldApt: string
    fieldZip: string
    fieldCity: string
    fieldState: string
  }
  cardDetails: {
    title: string
    fieldFullName: string
    fieldCardNumber: string
    fieldExpiry: string
    fieldCvv: string
    helperName: string
    termsPre: string
    termsLink: string
    termsAnd: string
    privacyLink: string
    securityTitle: string
    securityBody: string
  }
  storeSelection: {
    title: string
    minMax: string
    greenDot: string
  }
  review: {
    title: string
    youSend: string
    recipientGets: string
    paymentMethodLabel: string
    amountFees: string
    exchangeRate: string
    amountToSend: string
    felixFee: string
    storeFee: string
    otherFees: string
    taxes: string
    total: string
    sendNow: string
    legal: string
    learnMore: string
  }
  success: {
    title: string
    body: string
    referralTitle: string
    referralBody: string
    shareWhatsApp: string
    backToWhatsApp: string
  }
}

export const content: Record<Language, ContentTokens> = {
  en: {
    common: {
      badge: 'Authorized UniTeller Agent',
      continue: 'Continue',
      cancel: 'Cancel',
      selected: 'Selected',
      change: 'Change',
    },
    paymentMethod: {
      titleLine1: 'Almost done.',
      titleLine2: 'How do you want to pay?',
      subtitle: 'Express Pay',
      orPayAnotherWay: 'or pay another way',
      creditDebitName: 'Credit/debit card',
      creditDebitDesc: 'Credit cards may carry extra fees.',
      applePayName: 'Apple Pay',
      applePayDesc: 'Pay with Face ID or Touch ID.',
      bankName: 'Bank account',
      bankDesc: 'From your checking or savings account.',
      cashName: 'Cash at a store',
      cashDesc: 'Pay cash at a store near you.',
      badgeNoFeeDebit: 'No fee for debit',
      badgeInstant: 'Instant',
      badgeNoFee: 'No fee',
      badgeBusinessDays: '1–3 business days',
      badgeCashFee: '$3.95',
      badgeSameDay: 'Same day',
    },
    address: {
      titleBilling: "What's the billing address on your card?",
      titleCash: "What's your address?",
      helperCash: "We'll use this to find the closest store locations where you can pay.",
      fieldAddress: 'Address *',
      fieldApt: 'Apt, suite, or floor',
      fieldZip: 'ZIP Code *',
      fieldCity: 'City *',
      fieldState: 'State *',
    },
    cardDetails: {
      title: 'Enter your card details',
      fieldFullName: 'Full name on card *',
      fieldCardNumber: 'Card number *',
      fieldExpiry: 'Expiry date * (MM / YY)',
      fieldCvv: 'CVV *',
      helperName: "If your card shows a bank name, enter the account holder's name.",
      termsPre: 'By tapping Continue, you agree to our',
      termsLink: 'terms and conditions',
      termsAnd: 'and',
      privacyLink: 'privacy policy',
      securityTitle: 'Your payment is safe with us',
      securityBody: 'Encrypted with 256-bit SSL — your info stays private.',
    },
    storeSelection: {
      title: 'Where do you want to pay?',
      minMax: 'Min: $20 · Max: $500',
      greenDot: 'Service provided by Green Dot®. ©2024 Green Dot Corporation. All rights reserved. Green Dot Corporation NMLS #914924; Green Dot Bank NMLS #908739.',
    },
    review: {
      title: 'Review your transfer to Patricia Caballero',
      youSend: 'You send',
      recipientGets: 'Recipient gets',
      paymentMethodLabel: 'Payment method',
      amountFees: 'Amount + fees',
      exchangeRate: 'Exchange rate',
      amountToSend: 'Amount to send',
      felixFee: 'Felix fee',
      storeFee: '{store} fee',
      otherFees: 'Other fees',
      taxes: 'Taxes',
      total: 'Total',
      sendNow: 'Send now',
      legal: "For questions or complaints about Zero Hash LLC, contact your state's regulatory agency.",
      learnMore: 'Learn more.',
    },
    success: {
      title: 'Your payment went through!',
      body: '💸 Patricia Caballero will receive 52.26 MXN for your $3 USD transfer.',
      referralTitle: 'Earn up to $1,000 USD',
      referralBody: 'Earn $20 USD for each friend who makes their first transfer',
      shareWhatsApp: 'Share on WhatsApp',
      backToWhatsApp: 'Back to WhatsApp',
    },
  },

  'es-mx': {
    common: {
      badge: 'Agente Autorizado UniTeller',
      continue: 'Continuar',
      cancel: 'Cancelar',
      selected: 'Seleccionado',
      change: 'Cambiar',
    },
    paymentMethod: {
      titleLine1: 'Ya casi.',
      titleLine2: '¿Cómo quieres pagar?',
      subtitle: 'Pago Express',
      orPayAnotherWay: 'o paga de otra forma',
      creditDebitName: 'Tarjeta de crédito/débito',
      creditDebitDesc: 'Las tarjetas de crédito pueden tener cargos adicionales.',
      applePayName: 'Apple Pay',
      applePayDesc: 'Paga con Face ID o Touch ID.',
      bankName: 'Cuenta bancaria',
      bankDesc: 'Desde tu cuenta de cheques o ahorro.',
      cashName: 'Efectivo en tienda',
      cashDesc: 'Paga en efectivo en una tienda cercana.',
      badgeNoFeeDebit: 'Sin cargo para débito',
      badgeInstant: 'Inmediato',
      badgeNoFee: 'Sin cargo',
      badgeBusinessDays: '1–3 días hábiles',
      badgeCashFee: '$3.95',
      badgeSameDay: 'El mismo día',
    },
    address: {
      titleBilling: '¿Cuál es la dirección de facturación de tu tarjeta?',
      titleCash: '¿Cuál es tu dirección?',
      helperCash: 'Usaremos esto para encontrar las tiendas más cercanas donde puedes pagar.',
      fieldAddress: 'Dirección *',
      fieldApt: 'Apt, suite o piso',
      fieldZip: 'Código Postal *',
      fieldCity: 'Ciudad *',
      fieldState: 'Estado *',
    },
    cardDetails: {
      title: 'Ingresa los datos de tu tarjeta',
      fieldFullName: 'Nombre completo en la tarjeta *',
      fieldCardNumber: 'Número de tarjeta *',
      fieldExpiry: 'Fecha de vencimiento * (MM / AA)',
      fieldCvv: 'CVV *',
      helperName: 'Si tu tarjeta muestra el nombre de un banco, ingresa el nombre del titular de la cuenta.',
      termsPre: 'Al tocar Continuar, aceptas nuestros',
      termsLink: 'términos y condiciones',
      termsAnd: 'y',
      privacyLink: 'política de privacidad',
      securityTitle: 'Tu pago está seguro con nosotros',
      securityBody: 'Encriptado con SSL de 256 bits — tu información es privada.',
    },
    storeSelection: {
      title: '¿Dónde quieres pagar?',
      minMax: 'Mín: $20 · Máx: $500',
      greenDot: 'Servicio proporcionado por Green Dot®. ©2024 Green Dot Corporation. Todos los derechos reservados. Green Dot Corporation NMLS #914924; Green Dot Bank NMLS #908739.',
    },
    review: {
      title: 'Revisa tu envío a Patricia Caballero',
      youSend: 'Envías',
      recipientGets: 'Patricia recibe',
      paymentMethodLabel: 'Método de pago',
      amountFees: 'Monto + cargos',
      exchangeRate: 'Tipo de cambio',
      amountToSend: 'Monto a enviar',
      felixFee: 'Cargo de Felix',
      storeFee: 'Cargo de {store}',
      otherFees: 'Otros cargos',
      taxes: 'Impuestos',
      total: 'Total',
      sendNow: 'Enviar ahora',
      legal: 'Para preguntas o quejas sobre Zero Hash LLC, contacta a la agencia reguladora de tu estado.',
      learnMore: 'Más información.',
    },
    success: {
      title: '¡Tu pago fue exitoso!',
      body: '💸 Patricia Caballero recibirá 52.26 MXN por tu transferencia de $3 USD.',
      referralTitle: 'Gana hasta $1,000 USD',
      referralBody: 'Gana $20 USD por cada amigo que realice su primera transferencia',
      shareWhatsApp: 'Compartir en WhatsApp',
      backToWhatsApp: 'Volver a WhatsApp',
    },
  },

  'pt-br': {
    common: {
      badge: 'Agente Autorizado UniTeller',
      continue: 'Continuar',
      cancel: 'Cancelar',
      selected: 'Selecionado',
      change: 'Alterar',
    },
    paymentMethod: {
      titleLine1: 'Quase lá.',
      titleLine2: 'Como você quer pagar?',
      subtitle: 'Pagamento Express',
      orPayAnotherWay: 'ou pague de outra forma',
      creditDebitName: 'Cartão de crédito/débito',
      creditDebitDesc: 'Cartões de crédito podem ter taxas adicionais.',
      applePayName: 'Apple Pay',
      applePayDesc: 'Pague com Face ID ou Touch ID.',
      bankName: 'Conta bancária',
      bankDesc: 'Direto da sua conta corrente ou poupança.',
      cashName: 'Dinheiro em loja',
      cashDesc: 'Pague em dinheiro em uma loja próxima.',
      badgeNoFeeDebit: 'Sem taxa para débito',
      badgeInstant: 'Instantâneo',
      badgeNoFee: 'Sem taxa',
      badgeBusinessDays: '1–3 dias úteis',
      badgeCashFee: '$3.95',
      badgeSameDay: 'Mesmo dia',
    },
    address: {
      titleBilling: 'Qual é o endereço de cobrança do seu cartão?',
      titleCash: 'Qual é o seu endereço?',
      helperCash: 'Usaremos isso para encontrar as lojas mais próximas onde você pode pagar.',
      fieldAddress: 'Endereço *',
      fieldApt: 'Apt, suíte ou andar',
      fieldZip: 'CEP *',
      fieldCity: 'Cidade *',
      fieldState: 'Estado *',
    },
    cardDetails: {
      title: 'Insira os dados do seu cartão',
      fieldFullName: 'Nome completo no cartão *',
      fieldCardNumber: 'Número do cartão *',
      fieldExpiry: 'Data de validade * (MM / AA)',
      fieldCvv: 'CVV *',
      helperName: 'Se o seu cartão mostrar um nome de banco, insira o nome do titular da conta.',
      termsPre: 'Ao tocar em Continuar, você concorda com nossos',
      termsLink: 'termos e condições',
      termsAnd: 'e',
      privacyLink: 'política de privacidade',
      securityTitle: 'Seu pagamento está seguro conosco',
      securityBody: 'Criptografado com SSL de 256 bits — suas informações são privadas.',
    },
    storeSelection: {
      title: 'Onde você quer pagar?',
      minMax: 'Mín: $20 · Máx: $500',
      greenDot: 'Serviço fornecido pela Green Dot®. ©2024 Green Dot Corporation. Todos os direitos reservados. Green Dot Corporation NMLS #914924; Green Dot Bank NMLS #908739.',
    },
    review: {
      title: 'Revise sua transferência para Patricia Caballero',
      youSend: 'Você envia',
      recipientGets: 'Patricia recebe',
      paymentMethodLabel: 'Forma de pagamento',
      amountFees: 'Valor + taxas',
      exchangeRate: 'Taxa de câmbio',
      amountToSend: 'Valor a enviar',
      felixFee: 'Taxa Felix',
      storeFee: 'Taxa {store}',
      otherFees: 'Outras taxas',
      taxes: 'Impostos',
      total: 'Total',
      sendNow: 'Enviar agora',
      legal: 'Para dúvidas ou reclamações sobre a Zero Hash LLC, entre em contato com o órgão regulador do seu estado.',
      learnMore: 'Saiba mais.',
    },
    success: {
      title: 'Seu pagamento foi realizado!',
      body: '💸 Patricia Caballero receberá 52,26 MXN pela sua transferência de $3 USD.',
      referralTitle: 'Ganhe até $1.000 USD',
      referralBody: 'Ganhe $20 USD por cada amigo que fizer sua primeira transferência',
      shareWhatsApp: 'Compartilhar no WhatsApp',
      backToWhatsApp: 'Voltar ao WhatsApp',
    },
  },
}
