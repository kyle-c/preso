export type Language = 'en' | 'es-mx' | 'pt-br' | 'es-do' | 'es-co' | 'es-pe' | 'es-ec'

export interface Country {
  code: Language
  label: string
  shortLabel: string
  flag: string
  country: string
  countryCode: string
  role: 'static' | 'pinnable'
}

export const countries: Country[] = [
  { code: 'en',    label: 'English',             shortLabel: 'US', flag: '🇺🇸', country: 'United States',    countryCode: 'US', role: 'static' },
  { code: 'es-mx', label: 'Español (MX)',         shortLabel: 'MX', flag: '🇲🇽', country: 'Mexico',           countryCode: 'MX', role: 'static' },
  { code: 'pt-br', label: 'Português (BR)',       shortLabel: 'BR', flag: '🇧🇷', country: 'Brazil',           countryCode: 'BR', role: 'pinnable' },
  { code: 'es-do', label: 'Español (DO)',         shortLabel: 'DR', flag: '🇩🇴', country: 'Dominican Republic', countryCode: 'DO', role: 'pinnable' },
  { code: 'es-co', label: 'Español (CO)',         shortLabel: 'CO', flag: '🇨🇴', country: 'Colombia',         countryCode: 'CO', role: 'pinnable' },
  { code: 'es-pe', label: 'Español (PE)',         shortLabel: 'PE', flag: '🇵🇪', country: 'Peru',             countryCode: 'PE', role: 'pinnable' },
  { code: 'es-ec', label: 'Español (EC)',         shortLabel: 'EC', flag: '🇪🇨', country: 'Ecuador',          countryCode: 'EC', role: 'pinnable' },
]

export const staticCountries = countries.filter(c => c.role === 'static')
export const pinnableCountries = countries.filter(c => c.role === 'pinnable')

/** @deprecated Use `countries` instead */
export const languages: { code: Language; label: string; flag: string }[] = countries.map(c => ({
  code: c.code,
  label: c.label,
  flag: c.flag,
}))

export interface ContentTokens {
  common: {
    badge: string
    continue: string
    cancel: string
    previous: string
    selected: string
    change: string
  }
  paymentMethod: {
    titleLine1: string
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
    titleBank: string
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
    addressLabel: string
    addressPlaceholder: string
    storeFeeLabel: string
    limitBadge: string
    infoText: string
    selectStore: string
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
    changeSheetTitle: string
    changeCard: string
    changeBank: string
    changeStore: string
    changeMethod: string
  }
  success: {
    title: string
    body: string
    referralTitle: string
    referralBody: string
    shareWhatsApp: string
    backToWhatsApp: string
  }
  achError: {
    identityTitle: string
    identityBody: string
    bankAuthTitle: string
    bankAuthBody: string
    insufficientTitle: string
    insufficientBody: string
    cta: string
  }
  pausedPayments: {
    reviewTitle: string
    reviewBody: string
    processingTitle: string
    processingBody: string
    whatsappValidating: string
    whatsappInProcess: string
    whatsappDeclined: string
    whatsappApproved: string
    cta: string
  }
  pennyTest: {
    cardDetailsTitle: string
    verifyIntroTitle: string
    verifyIntroStep1: string
    verifyIntroStep2: string
    verifyIntroNote: string
    verifyIntroSkip: string
    verifyAmountTitle: string
    verifyAmountBody: string
    verifyAmountHint: string
    verifyAmountRetry: string
    verifyCta: string
    errorIdentityTitle: string
    errorIdentityBody: string
    errorBankTitle: string
    errorBankBody: string
    errorFundsTitle: string
    errorFundsBody: string
    errorCta: string
  }
  bankConsent: {
    title: string
    body: string
    agree: string
  }
  bankConnect: {
    title: string
    subtitle: string
    fieldFirstName: string
    fieldMiddleName: string
    fieldLastName: string
    linkAccount: string
  }
  stripe: {
    selectTitle: string
    selectSearch: string
    introTitle: string
    introFast: string
    introFastDesc: string
    introEncrypted: string
    introEncryptedDesc: string
    introConsent: string
    introAccept: string
    introManual: string
    accountTitle: string
    accountConnect: string
    linkTitle: string
    linkDesc: string
    linkSave: string
    linkSkip: string
    completedTitle: string
    completedSubtitle: string
    completedDone: string
  }
}

const enContent: ContentTokens = {
  common: {
    badge: 'Authorized UniTeller Agent',
    continue: 'Continue',
    cancel: 'Cancel',
    previous: 'Previous',
    selected: 'Selected',
    change: 'Change',
  },
  paymentMethod: {
    titleLine1: 'How do you want to pay?',
    subtitle: 'Express Pay',
    orPayAnotherWay: 'or pay another way',
    creditDebitName: 'Credit/debit card',
    creditDebitDesc: 'Credit cards may carry extra fees.',
    applePayName: 'Apple Pay',
    applePayDesc: 'Pay with Face ID or Touch ID.',
    bankName: 'Bank account',
    bankDesc: 'Checking or savings account.',
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
    titleBank: 'Enter the address linked to your account',
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
    addressLabel: 'Address',
    addressPlaceholder: '8040 Brothers Walk Lane, Jacksonville',
    storeFeeLabel: '{fee} store fee',
    limitBadge: 'Limit $20 - $500',
    infoText: 'Select this store to generate your code, then you can pay at any {store}.',
    selectStore: 'Select store',
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
    changeSheetTitle: 'Change payment',
    changeCard: 'Use a different card',
    changeBank: 'Use a different bank account',
    changeStore: 'Use a different store',
    changeMethod: 'Change payment method',
  },
  success: {
    title: 'Your payment went through!',
    body: '💸 Patricia Caballero will receive 52.26 MXN for your $3 USD transfer.',
    referralTitle: 'Earn up to $1,000 USD',
    referralBody: 'Earn $20 USD for each friend who makes their first transfer',
    shareWhatsApp: 'Share on WhatsApp',
    backToWhatsApp: 'Back to WhatsApp',
  },
  achError: {
    identityTitle: 'We couldn\'t complete your payment',
    identityBody: 'There seems to be a problem with the payment. Verify your identity to try again.',
    bankAuthTitle: 'We couldn\'t complete your payment',
    bankAuthBody: 'Try again or use another account. If the problem persists, contact your bank to authorize payments to Félix Pago.',
    insufficientTitle: 'We couldn\'t complete your payment',
    insufficientBody: 'Your account doesn\'t have sufficient funds. Check your balance or choose another account to continue.',
    cta: 'Back to WhatsApp',
  },
  pausedPayments: {
    reviewTitle: 'Review your transfer details',
    reviewBody: 'Review the details of your transfer to Daniela Moreno',
    processingTitle: 'Processing your transaction',
    processingBody: 'We are validating your transaction, no charges have been made. In a moment, an agent will contact you via WhatsApp to continue.',
    whatsappValidating: 'Please enter this secure link to make your payment',
    whatsappInProcess: 'Your transfer is in process. We are reviewing your information and have not made any charges. Don\'t worry, we\'ll let you know when everything is ready.',
    whatsappDeclined: 'Your transaction cannot be processed at this time. We apologize for the inconvenience.',
    whatsappApproved: 'Great news! We are ready to process your payment.',
    cta: 'Back to WhatsApp',
  },
  pennyTest: {
    cardDetailsTitle: 'Enter your card details',
    verifyIntroTitle: 'Let\'s verify your card',
    verifyIntroStep1: 'Step 1: We\'ll make a charge of less than $1 which will be reversed once verification is complete.',
    verifyIntroStep2: 'Step 2: Check the amount we charged and enter the exact amount to verify.',
    verifyIntroNote: 'The charge will be reversed within a maximum of 14 business days.',
    verifyIntroSkip: 'Verify later',
    verifyAmountTitle: 'Verify your card',
    verifyAmountBody: 'Enter the amount of the charge we made to your card, remember it is less than $1.',
    verifyAmountHint: 'The charge may take a few minutes to appear, check your bank app or notifications.',
    verifyAmountRetry: 'Amount doesn\'t match. You have 2 attempts left.',
    verifyCta: 'Verify',
    errorIdentityTitle: 'We couldn\'t verify your card',
    errorIdentityBody: 'There seems to be a problem with the verification. Try with another card to continue.',
    errorBankTitle: 'We couldn\'t verify your card',
    errorBankBody: 'Try again or use another card. If the problem persists, contact your bank to authorize payments to Félix Pago.',
    errorFundsTitle: 'We couldn\'t verify your card',
    errorFundsBody: 'Your card doesn\'t have sufficient funds. Check your balance or choose another card to continue.',
    errorCta: 'Continue',
  },
  bankConsent: {
    title: 'Consent for bank charges',
    body: 'By clicking I agree, you authorize Félix Pago to charge the previously specified bank account for any amount owed for expenses derived from the use of Félix Pago services and/or the purchase of Félix Pago products, in accordance with the website and the terms of Félix Pago, until this authorization is revoked. You may modify or cancel this authorization at any time by notifying Félix Pago.',
    agree: 'I agree',
  },
  bankConnect: {
    title: 'Connect your account',
    subtitle: "Enter the account holder's information",
    fieldFirstName: 'First name *',
    fieldMiddleName: 'Middle name',
    fieldLastName: 'Last name *',
    linkAccount: 'Link account',
  },
  stripe: {
    selectTitle: 'Select your bank',
    selectSearch: 'Search',
    introTitle: 'Félix uses Stripe to connect your accounts',
    introFast: 'Fast and simple',
    introFastDesc: 'Connect your account in seconds.',
    introEncrypted: 'Your data is encrypted',
    introEncryptedDesc: 'Félix can access your data. You can disconnect at any time.',
    introConsent: "By continuing, you accept Stripe's Terms and Privacy Policy.",
    introAccept: 'Accept and continue',
    introManual: 'Or verify manually (may take 1–2 business days)',
    accountTitle: 'Choose an account',
    accountConnect: 'Connect Account',
    linkTitle: 'Save your account with Link',
    linkDesc: 'Connect faster everywhere that accepts Link. Link encrypts your data and never shares your login information.',
    linkSave: 'Save with Link',
    linkSkip: 'Finish without saving',
    completedTitle: 'Completed successfully',
    completedSubtitle: 'Your account has been connected.',
    completedDone: 'Done',
  },
}

const esMxContent: ContentTokens = {
  common: {
    badge: 'Agente Autorizado UniTeller',
    continue: 'Continuar',
    cancel: 'Cancelar',
    previous: 'Anterior',
    selected: 'Seleccionado',
    change: 'Cambiar',
  },
  paymentMethod: {
    titleLine1: '¿Cómo quieres pagar?',
    subtitle: 'Pago Express',
    orPayAnotherWay: 'o paga de otra forma',
    creditDebitName: 'Tarjeta crédito/débito',
    creditDebitDesc: 'El crédito puede tener cargos extra.',
    applePayName: 'Apple Pay',
    applePayDesc: 'Paga con Face ID o Touch ID.',
    bankName: 'Cuenta bancaria',
    bankDesc: 'Desde tu cuenta bancaria.',
    cashName: 'Efectivo en tienda',
    cashDesc: 'Efectivo cerca de ti.',
    badgeNoFeeDebit: 'Débito sin cargo',
    badgeInstant: 'Inmediato',
    badgeNoFee: 'Sin cargo',
    badgeBusinessDays: '1–3 días hábiles',
    badgeCashFee: '$3.95',
    badgeSameDay: 'El mismo día',
  },
  address: {
    titleBilling: '¿Cuál es la dirección de facturación de tu tarjeta?',
    titleBank: 'Ingresa la dirección vinculada a tu cuenta',
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
    addressLabel: 'Dirección',
    addressPlaceholder: '8040 Brothers Walk Lane, Jacksonville',
    storeFeeLabel: '{fee} comisión de tienda',
    limitBadge: 'Límite $20 - $500',
    infoText: 'Selecciona esta tienda para generar tu código, luego puedes pagar en cualquier {store}.',
    selectStore: 'Seleccionar tienda',
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
    changeSheetTitle: 'Cambiar pago',
    changeCard: 'Usar otra tarjeta',
    changeBank: 'Usar otra cuenta bancaria',
    changeStore: 'Usar otra tienda',
    changeMethod: 'Cambiar método de pago',
  },
  success: {
    title: '¡Tu pago fue exitoso!',
    body: '💸 Patricia Caballero recibirá 52.26 MXN por tu transferencia de $3 USD.',
    referralTitle: 'Gana hasta $1,000 USD',
    referralBody: 'Gana $20 USD por cada amigo que realice su primera transferencia',
    shareWhatsApp: 'Compartir en WhatsApp',
    backToWhatsApp: 'Volver a WhatsApp',
  },
  achError: {
    identityTitle: 'No pudimos completar tu pago',
    identityBody: 'Parece que hubo un problema con el pago. Verifica tu identidad para intentarlo de nuevo.',
    bankAuthTitle: 'No pudimos completar tu pago',
    bankAuthBody: 'Intenta de nuevo o usa otra cuenta. Si persiste, contacta tu banco para autorizar pagos a Félix Pago.',
    insufficientTitle: 'No pudimos completar tu pago',
    insufficientBody: 'Tu cuenta no tiene fondos suficientes. Revisa tu saldo o elige otra cuenta para continuar.',
    cta: 'Volver a WhatsApp',
  },
  pausedPayments: {
    reviewTitle: 'Revisa los detalles de tu envío',
    reviewBody: 'Revisa los detalles de tu envío para Daniela Moreno',
    processingTitle: 'Procesando tu transacción',
    processingBody: 'Estamos validando tu transacción, no se ha hecho ningún cargo. En un momento, un agente te contactará por WhatsApp para continuar.',
    whatsappValidating: 'Por favor entra a esta liga segura para realizar tu pago',
    whatsappInProcess: 'Tu envío está en proceso. Estamos revisando tu información y aún no hemos hecho ningún cargo. No te preocupes, te avisaremos cuando todo esté listo.',
    whatsappDeclined: 'Tu transacción no puede ser procesada en este momento. Lamentamos el inconveniente.',
    whatsappApproved: '¡Buenas noticias! Estamos listos para procesar tu pago.',
    cta: 'Volver a WhatsApp',
  },
  pennyTest: {
    cardDetailsTitle: 'Ingresa los datos de tu tarjeta',
    verifyIntroTitle: 'Verifiquemos tu tarjeta',
    verifyIntroStep1: 'Paso 1: Te haremos un cargo de menos de $1 el cual será reversible una vez finalizada la verificación.',
    verifyIntroStep2: 'Paso 2: Revisa el monto que tomamos e ingresa el monto exacto para poder verificarlo.',
    verifyIntroNote: 'El cargo será reversado en un lapso máximo de 14 días naturales.',
    verifyIntroSkip: 'Verificar después',
    verifyAmountTitle: 'Verifica tu tarjeta',
    verifyAmountBody: 'Ingresa el monto del cargo que realizamos en tu tarjeta, recuerda que es menor a $1.',
    verifyAmountHint: 'El cargo puede tardar unos minutos en reflejarse, revisa tu app de banco o tus notificaciones.',
    verifyAmountRetry: 'El monto no coincide. Te quedan 2 intentos.',
    verifyCta: 'Verificar',
    errorIdentityTitle: 'No pudimos verificar tu tarjeta',
    errorIdentityBody: 'Parece que hubo un problema con la verificación. Intenta con otra tarjeta para continuar.',
    errorBankTitle: 'No pudimos verificar tu tarjeta',
    errorBankBody: 'Intenta de nuevo o usa otra tarjeta. Si persiste, contacta a tu banco para autorizar pagos a Félix Pago.',
    errorFundsTitle: 'No pudimos verificar tu tarjeta',
    errorFundsBody: 'Tu tarjeta no tiene fondos suficientes. Revisa tu saldo o elige otra tarjeta para continuar.',
    errorCta: 'Continuar',
  },
  bankConsent: {
    title: 'Consentimiento para cargos bancarios',
    body: 'Al hacer clic en Estoy de acuerdo, usted autoriza a Félix Pago a cargar en la cuenta bancaria especificada anteriormente cualquier importe adeudado por los gastos derivados del uso de los servicios de Félix Pago y/o la compra de productos de Félix Pago, de conformidad con el sitio web y los términos de Félix Pago, hasta que se revoque esta autorización. Puede modificar o cancelar esta autorización en cualquier momento notificándolo a Félix Pago.',
    agree: 'De acuerdo',
  },
  bankConnect: {
    title: 'Conecta tu cuenta',
    subtitle: 'Ingresa los datos del titular de la cuenta',
    fieldFirstName: 'Nombre *',
    fieldMiddleName: 'Segundo nombre',
    fieldLastName: 'Apellidos *',
    linkAccount: 'Vincular cuenta',
  },
  stripe: {
    selectTitle: 'Selecciona el banco',
    selectSearch: 'Busca',
    introTitle: 'Félix utiliza Stripe para conectar tus cuentas',
    introFast: 'Rápido y sencillo',
    introFastDesc: 'Conecta tu cuenta en cuestión de segundos.',
    introEncrypted: 'Tus datos están cifrados',
    introEncryptedDesc: 'Félix puede acceder a los datos. Puedes desconectarte en cualquier momento.',
    introConsent: 'Al continuar, aceptas las Condiciones y Política de privacidad de Stripe.',
    introAccept: 'Acepta y continúa',
    introManual: 'O verifica manualmente (puede tardar de 1 a 2 días hábiles)',
    accountTitle: 'Elige una cuenta',
    accountConnect: 'Cuenta Connect',
    linkTitle: 'Guarda la cuenta con Link',
    linkDesc: 'Conecta más rápido en todos los comercios que acepten Link. Link cifra tus datos y nunca comparte tus datos de inicio de sesión.',
    linkSave: 'Guárdala con Link',
    linkSkip: 'Termina sin guardar',
    completedTitle: 'Completado correctamente',
    completedSubtitle: 'Tu cuenta se ha conectado.',
    completedDone: 'Listo',
  },
}

const ptBrContent: ContentTokens = {
  common: {
    badge: 'Agente Autorizado UniTeller',
    continue: 'Continuar',
    cancel: 'Cancelar',
    previous: 'Anterior',
    selected: 'Selecionado',
    change: 'Alterar',
  },
  paymentMethod: {
    titleLine1: 'Como você quer pagar?',
    subtitle: 'Pagamento Express',
    orPayAnotherWay: 'ou pague de outra forma',
    creditDebitName: 'Cartão de crédito/débito',
    creditDebitDesc: 'Crédito pode ter taxas extras.',
    applePayName: 'Apple Pay',
    applePayDesc: 'Pague com Face ID ou Touch ID.',
    bankName: 'Conta bancária',
    bankDesc: 'Da sua conta bancária.',
    cashName: 'Dinheiro em loja',
    cashDesc: 'Dinheiro perto de você.',
    badgeNoFeeDebit: 'Débito sem taxa',
    badgeInstant: 'Instantâneo',
    badgeNoFee: 'Sem taxa',
    badgeBusinessDays: '1–3 dias úteis',
    badgeCashFee: '$3.95',
    badgeSameDay: 'Mesmo dia',
  },
  address: {
    titleBilling: 'Qual é o endereço de cobrança do seu cartão?',
    titleBank: 'Insira o endereço vinculado à sua conta',
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
    addressLabel: 'Endereço',
    addressPlaceholder: '8040 Brothers Walk Lane, Jacksonville',
    storeFeeLabel: '{fee} taxa da loja',
    limitBadge: 'Limite $20 - $500',
    infoText: 'Selecione esta loja para gerar seu código, então você pode pagar em qualquer {store}.',
    selectStore: 'Selecionar loja',
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
    changeSheetTitle: 'Alterar pagamento',
    changeCard: 'Usar outro cartão',
    changeBank: 'Usar outra conta bancária',
    changeStore: 'Usar outra loja',
    changeMethod: 'Alterar forma de pagamento',
  },
  success: {
    title: 'Seu pagamento foi realizado!',
    body: '💸 Patricia Caballero receberá 52,26 MXN pela sua transferência de $3 USD.',
    referralTitle: 'Ganhe até $1.000 USD',
    referralBody: 'Ganhe $20 USD por cada amigo que fizer sua primeira transferência',
    shareWhatsApp: 'Compartilhar no WhatsApp',
    backToWhatsApp: 'Voltar ao WhatsApp',
  },
  achError: {
    identityTitle: 'Não conseguimos completar seu pagamento',
    identityBody: 'Parece que houve um problema com o pagamento. Verifique sua identidade para tentar novamente.',
    bankAuthTitle: 'Não conseguimos completar seu pagamento',
    bankAuthBody: 'Tente novamente ou use outra conta. Se persistir, entre em contato com seu banco para autorizar pagamentos ao Félix Pago.',
    insufficientTitle: 'Não conseguimos completar seu pagamento',
    insufficientBody: 'Sua conta não tem fundos suficientes. Verifique seu saldo ou escolha outra conta para continuar.',
    cta: 'Voltar ao WhatsApp',
  },
  pausedPayments: {
    reviewTitle: 'Revise os detalhes da sua transferência',
    reviewBody: 'Revise os detalhes da sua transferência para Daniela Moreno',
    processingTitle: 'Processando sua transação',
    processingBody: 'Estamos validando sua transação, nenhuma cobrança foi feita. Em um momento, um agente entrará em contato via WhatsApp para continuar.',
    whatsappValidating: 'Por favor entre neste link seguro para realizar seu pagamento',
    whatsappInProcess: 'Sua transferência está em processo. Estamos revisando suas informações e ainda não fizemos nenhuma cobrança. Não se preocupe, avisaremos quando tudo estiver pronto.',
    whatsappDeclined: 'Sua transação não pode ser processada neste momento. Lamentamos o inconveniente.',
    whatsappApproved: 'Boas notícias! Estamos prontos para processar seu pagamento.',
    cta: 'Voltar ao WhatsApp',
  },
  pennyTest: {
    cardDetailsTitle: 'Insira os dados do seu cartão',
    verifyIntroTitle: 'Vamos verificar seu cartão',
    verifyIntroStep1: 'Passo 1: Faremos uma cobrança de menos de $1 que será revertida após a verificação.',
    verifyIntroStep2: 'Passo 2: Verifique o valor cobrado e insira o valor exato para verificar.',
    verifyIntroNote: 'A cobrança será revertida em no máximo 14 dias úteis.',
    verifyIntroSkip: 'Verificar depois',
    verifyAmountTitle: 'Verifique seu cartão',
    verifyAmountBody: 'Insira o valor da cobrança que fizemos no seu cartão, lembre-se que é menor que $1.',
    verifyAmountHint: 'A cobrança pode levar alguns minutos para aparecer, verifique seu app do banco ou notificações.',
    verifyAmountRetry: 'O valor não confere. Você tem 2 tentativas restantes.',
    verifyCta: 'Verificar',
    errorIdentityTitle: 'Não conseguimos verificar seu cartão',
    errorIdentityBody: 'Parece que houve um problema com a verificação. Tente com outro cartão para continuar.',
    errorBankTitle: 'Não conseguimos verificar seu cartão',
    errorBankBody: 'Tente novamente ou use outro cartão. Se persistir, entre em contato com seu banco para autorizar pagamentos ao Félix Pago.',
    errorFundsTitle: 'Não conseguimos verificar seu cartão',
    errorFundsBody: 'Seu cartão não tem fundos suficientes. Verifique seu saldo ou escolha outro cartão para continuar.',
    errorCta: 'Continuar',
  },
  bankConsent: {
    title: 'Consentimento para cobranças bancárias',
    body: 'Ao clicar em Concordo, você autoriza o Félix Pago a debitar na conta bancária especificada anteriormente qualquer valor devido por despesas decorrentes do uso dos serviços do Félix Pago e/ou da compra de produtos do Félix Pago, de acordo com o site e os termos do Félix Pago, até que esta autorização seja revogada. Você pode modificar ou cancelar esta autorização a qualquer momento notificando o Félix Pago.',
    agree: 'Concordo',
  },
  bankConnect: {
    title: 'Conecte sua conta',
    subtitle: 'Insira os dados do titular da conta',
    fieldFirstName: 'Nome *',
    fieldMiddleName: 'Nome do meio',
    fieldLastName: 'Sobrenome *',
    linkAccount: 'Vincular conta',
  },
  stripe: {
    selectTitle: 'Selecione seu banco',
    selectSearch: 'Buscar',
    introTitle: 'Félix usa o Stripe para conectar suas contas',
    introFast: 'Rápido e simples',
    introFastDesc: 'Conecte sua conta em segundos.',
    introEncrypted: 'Seus dados são criptografados',
    introEncryptedDesc: 'O Félix pode acessar seus dados. Você pode se desconectar a qualquer momento.',
    introConsent: 'Ao continuar, você aceita os Termos e a Política de Privacidade do Stripe.',
    introAccept: 'Aceitar e continuar',
    introManual: 'Ou verifique manualmente (pode levar de 1 a 2 dias úteis)',
    accountTitle: 'Escolha uma conta',
    accountConnect: 'Conectar Conta',
    linkTitle: 'Salve sua conta com o Link',
    linkDesc: 'Conecte mais rápido em todos os comerciantes que aceitam Link. O Link criptografa seus dados e nunca compartilha suas informações de login.',
    linkSave: 'Salvar com Link',
    linkSkip: 'Finalizar sem salvar',
    completedTitle: 'Concluído com sucesso',
    completedSubtitle: 'Sua conta foi conectada.',
    completedDone: 'Pronto',
  },
}

// New LATAM locales — cloned from es-mx as initial defaults
const newLatamCodes: Language[] = ['es-do', 'es-co', 'es-pe', 'es-ec']

export const content: Record<Language, ContentTokens> = {
  en: enContent,
  'es-mx': esMxContent,
  'pt-br': ptBrContent,
  ...Object.fromEntries(
    newLatamCodes.map(code => [code, JSON.parse(JSON.stringify(esMxContent)) as ContentTokens])
  ) as Record<'es-do' | 'es-co' | 'es-pe' | 'es-ec', ContentTokens>,
}
