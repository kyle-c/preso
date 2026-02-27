export type DSLang = 'en' | 'es-mx' | 'pt-br'

export interface DSStrings {
  nav: {
    designSystem: string
    overview: string
    designPrinciples: string
    thePrinciples: string
    resources: string
    whenPrinciplesOverlap: string
    editorialGuidelines: string
    voiceTone: string
    writingPatterns: string
    multilingual: string
    contentTokens: string
    commonPitfalls: string
    quickReference: string
    colors: string
    primaryPalette: string
    secondaryPalette: string
    colorways: string
    typography: string
    fontFamilies: string
    weights: string
    typeScale: string
    illustrations: string
    brandCharacters: string
    flags3D: string
    flagsOriginal: string
    hands: string
    moneyPayments: string
    communication: string
    statusAlerts: string
    navigationMaps: string
    other: string
    components: string
    buttons: string
    cards: string
    inputs: string
    badges: string
    tokens: string
    semanticTokens: string
    brandTokens: string
    chartTokens: string
    spacing: string
    borderRadius: string
    shadows: string
    typographyTokens: string
    sidebarTokens: string
    reference: string
    referenceMd: string
    refStack: string
    refPrinciples: string
    refColors: string
    refTypography: string
    refComponents: string
    refPatterns: string
    refContentTokens: string
    refFintechFlows: string
    refPresentation: string
    version: string
  }
  pages: {
    overview:      { title: string; description: string }
    principles:    { title: string; description: string }
    editorial:     { title: string; description: string }
    colors:        { title: string; description: string }
    typography:    { title: string; description: string }
    components:    { title: string; description: string }
    tokens:        { title: string; description: string }
    illustrations: { title: string; description: string }
    reference:     { title: string; description: string }
  }
  home: {
    overviewLabel: string
    heroTitle: string
    // Use **text** for bold spans
    para1: string
    para2: string
    para3: string
    para4: string
    felixUses: string
    bullet1: string
    bullet2: string
    bullet3: string
    bullet4: string
    bullet5: string
    gettingStarted: string
    gettingStartedDesc: string
    brandOverview: string
    brandOverviewDesc: string
    feat: {
      principles:   { title: string; desc: string }
      colors:       { title: string; desc: string }
      typography:   { title: string; desc: string }
      components:   { title: string; desc: string }
      tokens:       { title: string; desc: string }
      illustrations: { title: string; desc: string }
    }
  }
  illustrations: {
    pageDesc: string
    brand:         { label: string; description: string }
    flags3d:       { label: string; description: string }
    flagsOg:       { label: string; description: string }
    hands:         { label: string; description: string }
    money:         { label: string; description: string }
    communication: { label: string; description: string }
    status:        { label: string; description: string }
    navigation:    { label: string; description: string }
    other:         { label: string; description: string }
    svg: string
    png: string
  }
}

export const dsStrings: Record<DSLang, DSStrings> = {
  en: {
    nav: {
      designSystem: 'Design System',
      overview: 'Overview',
      designPrinciples: 'Design Principles',
      thePrinciples: 'The Principles',
      resources: 'Resources',
      whenPrinciplesOverlap: 'When Principles Overlap',
      editorialGuidelines: 'Editorial Guidelines',
      voiceTone: 'Voice & Tone',
      writingPatterns: 'Writing Patterns',
      multilingual: 'Multilingual',
      contentTokens: 'Content Tokens',
      commonPitfalls: 'Common Pitfalls',
      quickReference: 'Quick Reference',
      colors: 'Colors',
      primaryPalette: 'Primary Palette',
      secondaryPalette: 'Secondary Palette',
      colorways: 'Colorways',
      typography: 'Typography',
      fontFamilies: 'Font Families',
      weights: 'Weights',
      typeScale: 'Type Scale',
      illustrations: 'Illustrations',
      brandCharacters: 'Brand & Characters',
      flags3D: 'Flags — 3D',
      flagsOriginal: 'Flags — Original',
      hands: 'Hands',
      moneyPayments: 'Money & Payments',
      communication: 'Communication',
      statusAlerts: 'Status & Alerts',
      navigationMaps: 'Navigation & Maps',
      other: 'Other',
      components: 'Components',
      buttons: 'Buttons',
      cards: 'Cards',
      inputs: 'Inputs',
      badges: 'Badges',
      tokens: 'Tokens',
      semanticTokens: 'Semantic Tokens',
      brandTokens: 'Brand Tokens',
      chartTokens: 'Chart Tokens',
      spacing: 'Spacing',
      borderRadius: 'Border Radius',
      shadows: 'Shadows',
      typographyTokens: 'Typography',
      sidebarTokens: 'Sidebar Tokens',
      reference: 'Reference',
      referenceMd: 'Raw Markdown',
      refStack: 'Stack & Setup',
      refPrinciples: 'Principles',
      refColors: 'Colors',
      refTypography: 'Typography',
      refComponents: 'Components',
      refPatterns: 'Patterns',
      refContentTokens: 'Content Tokens',
      refFintechFlows: 'Fintech Flows',
      refPresentation: 'Presentation',
      version: 'Version 1.0.0',
    },
    pages: {
      overview:      { title: '', description: '' },
      principles:    { title: 'Design Principles', description: 'Five principles that define how every experience at Felix Pago should feel.' },
      editorial:     { title: 'Editorial Guidelines', description: 'Voice, tone, and writing standards for every string in the Felix Pago product.' },
      colors:        { title: 'Colors', description: 'Primary and secondary color palettes with WCAG-compliant colorways and usage guidelines.' },
      typography:    { title: 'Typography', description: "Typesetting is at the heart of our brand's visual communication. Consistent application enhances clarity and brand cohesion." },
      components:    { title: 'Components', description: 'A library of UI building blocks for creating consistent, accessible, and on-brand interfaces.' },
      tokens:        { title: 'Design Tokens', description: 'Design tokens mapped to shadcn/ui naming conventions.' },
      illustrations: { title: 'Illustrations', description: 'The Felix illustration library. Download SVG for web and product use, PNG for presentations and documents.' },
      reference:     { title: 'Reference', description: 'Comprehensive design system reference — everything needed to replicate every screen, component, and pattern.' },
    },
    home: {
      overviewLabel: 'Overview',
      heroTitle: 'Designing for Presence',
      para1: "Remittances aren't transactions, they're **acts of presence**. When someone sends money through Felix, they're **showing up for family** back home.",
      para2: "When they build credit here, they're ensuring **future presence**, the ability to **stay available** for the people they love. But presence isn't just about today, it's about building the **capability to show up tomorrow**.",
      para3: "The product should make users **stronger over time**: more knowledgeable about their finances, more confident in their decisions, more capable of building the future they want.",
      para4: "Felix **grows with users**, from their first send home to comprehensive financial management across borders. We **meet people where they are**, then **gradually reveal new possibilities** as they're ready. **Future presence** requires **capability across your entire financial life**, and we're here for that **full journey**.",
      felixUses: 'Felix uses',
      bullet1: 'Language that reflects **relationships**, not just transactions',
      bullet2: 'Interfaces that **teach** financial concepts without condescension',
      bullet3: 'Features that **increase capability**, not just provide convenience',
      bullet4: '**Progressive revelation** of tools as users are ready for them',
      bullet5: 'Celebrations that **acknowledge growth**, not just completion',
      gettingStarted: 'Getting Started',
      gettingStartedDesc: 'Explore the design system documentation to build consistent and beautiful interfaces.',
      brandOverview: 'Brand Overview',
      brandOverviewDesc: 'The Felix Pago brand identity is built around presence, trust, accessibility, and modern financial technology.',
      feat: {
        principles:    { title: 'Principles', desc: 'Core design principles that guide how we build experiences at Felix Pago.' },
        colors:        { title: 'Colors', desc: 'Primary and secondary color palettes with WCAG-compliant colorways.' },
        typography:    { title: 'Typography', desc: 'Font families, weights, and type scale for consistent text styling.' },
        components:    { title: 'Components', desc: 'Pre-built UI components following the Felix Pago design language.' },
        tokens:        { title: 'Tokens', desc: 'Design tokens mapped to shadcn/ui naming conventions.' },
        illustrations: { title: 'Illustrations', desc: 'The full illustration library with SVG and PNG downloads for every asset.' },
      },
    },
    illustrations: {
      pageDesc: 'The Felix illustration library. Download SVG for web and product use, PNG for presentations and documents.',
      brand:         { label: 'Brand & Characters', description: 'Core brand illustrations featuring the Félix character used across the product experience.' },
      flags3d:       { label: 'Flags — 3D', description: 'Three-dimensional flag illustrations for supported send-to countries.' },
      flagsOg:       { label: 'Flags — Original Style', description: 'Flat-style flag illustrations in the original hand-drawn aesthetic.' },
      hands:         { label: 'Hands', description: 'Hand illustrations for CTAs, feature explanations, and onboarding moments.' },
      money:         { label: 'Money & Payments', description: 'Illustrations for payment flows, transfer confirmations, and financial feature moments.' },
      communication: { label: 'Communication', description: 'Illustrations for messaging, notifications, support, and social sharing.' },
      status:        { label: 'Status & Alerts', description: 'Illustrations for confirmation, error, loading, and other state communication.' },
      navigation:    { label: 'Navigation & Maps', description: 'Location and map illustrations for the store finder and cash payment flows.' },
      other:         { label: 'Other', description: 'Supporting illustrations for product features, onboarding, and utility moments.' },
      svg: 'SVG',
      png: 'PNG',
    },
  },

  'es-mx': {
    nav: {
      designSystem: 'Sistema de Diseño',
      overview: 'Resumen',
      designPrinciples: 'Principios de Diseño',
      thePrinciples: 'Los Principios',
      resources: 'Recursos',
      whenPrinciplesOverlap: 'Cuando se Superponen',
      editorialGuidelines: 'Guía Editorial',
      voiceTone: 'Voz y Tono',
      writingPatterns: 'Patrones de Escritura',
      multilingual: 'Multilingüe',
      contentTokens: 'Tokens de Contenido',
      commonPitfalls: 'Errores Comunes',
      quickReference: 'Referencia Rápida',
      colors: 'Colores',
      primaryPalette: 'Paleta Primaria',
      secondaryPalette: 'Paleta Secundaria',
      colorways: 'Combinaciones de Color',
      typography: 'Tipografía',
      fontFamilies: 'Familias de Fuentes',
      weights: 'Pesos',
      typeScale: 'Escala Tipográfica',
      illustrations: 'Ilustraciones',
      brandCharacters: 'Marca y Personajes',
      flags3D: 'Banderas — 3D',
      flagsOriginal: 'Banderas — Original',
      hands: 'Manos',
      moneyPayments: 'Dinero y Pagos',
      communication: 'Comunicación',
      statusAlerts: 'Estado y Alertas',
      navigationMaps: 'Navegación y Mapas',
      other: 'Otros',
      components: 'Componentes',
      buttons: 'Botones',
      cards: 'Tarjetas',
      inputs: 'Campos',
      badges: 'Etiquetas',
      tokens: 'Tokens',
      semanticTokens: 'Tokens Semánticos',
      brandTokens: 'Tokens de Marca',
      chartTokens: 'Tokens de Gráficas',
      spacing: 'Espaciado',
      borderRadius: 'Radio de Borde',
      shadows: 'Sombras',
      typographyTokens: 'Tipografía',
      sidebarTokens: 'Tokens de Barra Lateral',
      reference: 'Referencia',
      referenceMd: 'Markdown Crudo',
      refStack: 'Stack y Config',
      refPrinciples: 'Principios',
      refColors: 'Colores',
      refTypography: 'Tipografía',
      refComponents: 'Componentes',
      refPatterns: 'Patrones',
      refContentTokens: 'Tokens de Contenido',
      refFintechFlows: 'Flujos Fintech',
      refPresentation: 'Presentación',
      version: 'Versión 1.0.0',
    },
    pages: {
      overview:      { title: '', description: '' },
      principles:    { title: 'Principios de Diseño', description: 'Cinco principios que definen cómo debe sentirse cada experiencia en Felix Pago.' },
      editorial:     { title: 'Guía Editorial', description: 'Voz, tono y estándares de escritura para cada texto en el producto Felix Pago.' },
      colors:        { title: 'Colores', description: 'Paletas de colores primaria y secundaria con combinaciones compatibles con WCAG y guías de uso.' },
      typography:    { title: 'Tipografía', description: 'La tipografía está en el corazón de la comunicación visual de nuestra marca. Su aplicación consistente mejora la claridad y la cohesión de marca.' },
      components:    { title: 'Componentes', description: 'Una biblioteca de elementos de interfaz para crear interfaces consistentes, accesibles y acordes a la marca.' },
      tokens:        { title: 'Design Tokens', description: 'Tokens de diseño mapeados a las convenciones de nomenclatura de shadcn/ui.' },
      illustrations: { title: 'Ilustraciones', description: 'La biblioteca de ilustraciones de Felix. Descarga SVG para web y PNG para presentaciones y documentos.' },
      reference:     { title: 'Referencia', description: 'Referencia completa del sistema de diseño — todo lo necesario para replicar cada pantalla, componente y patrón.' },
    },
    home: {
      overviewLabel: 'Resumen',
      heroTitle: 'Diseñando para la Presencia',
      para1: "Las remesas no son transacciones, son **actos de presencia**. Cuando alguien envía dinero a través de Felix, **está presente para su familia** en casa.",
      para2: "Cuando construyen crédito aquí, están asegurando **presencia futura**, la capacidad de **mantenerse disponibles** para quienes aman. Pero la presencia no se trata solo del hoy, sino de construir la **capacidad de estar mañana**.",
      para3: "El producto debe hacer a los usuarios **más fuertes con el tiempo**: más informados sobre sus finanzas, más seguros en sus decisiones, más capaces de construir el futuro que desean.",
      para4: "Felix **crece con los usuarios**, desde su primer envío hasta la gestión financiera completa a través de fronteras. **Encontramos a las personas donde están**, y luego **revelamos gradualmente nuevas posibilidades** conforme están listos. La **presencia futura** requiere **capacidad en toda tu vida financiera**, y estamos aquí para ese **camino completo**.",
      felixUses: 'Felix usa',
      bullet1: 'Lenguaje que refleja **relaciones**, no solo transacciones',
      bullet2: 'Interfaces que **enseñan** conceptos financieros sin condescendencia',
      bullet3: 'Funciones que **aumentan la capacidad**, no solo proporcionan conveniencia',
      bullet4: '**Revelación progresiva** de herramientas conforme los usuarios están listos',
      bullet5: 'Celebraciones que **reconocen el crecimiento**, no solo la finalización',
      gettingStarted: 'Para Comenzar',
      gettingStartedDesc: 'Explora la documentación del sistema de diseño para crear interfaces consistentes y hermosas.',
      brandOverview: 'Visión de Marca',
      brandOverviewDesc: 'La identidad de marca de Felix Pago está construida sobre la presencia, la confianza, la accesibilidad y la tecnología financiera moderna.',
      feat: {
        principles:    { title: 'Principios', desc: 'Principios fundamentales de diseño que guían cómo creamos experiencias en Felix Pago.' },
        colors:        { title: 'Colores', desc: 'Paletas de colores primaria y secundaria con combinaciones de color compatibles con WCAG.' },
        typography:    { title: 'Tipografía', desc: 'Familias de fuentes, pesos y escala tipográfica para un estilo de texto consistente.' },
        components:    { title: 'Componentes', desc: 'Componentes de interfaz prediseñados siguiendo el lenguaje de diseño de Felix Pago.' },
        tokens:        { title: 'Tokens', desc: 'Tokens de diseño mapeados a las convenciones de nomenclatura de shadcn/ui.' },
        illustrations: { title: 'Ilustraciones', desc: 'La biblioteca completa de ilustraciones con descargas de SVG y PNG para cada recurso.' },
      },
    },
    illustrations: {
      pageDesc: 'La biblioteca de ilustraciones de Felix. Descarga SVG para web y PNG para presentaciones y documentos.',
      brand:         { label: 'Marca y Personajes', description: 'Ilustraciones principales de marca con el personaje Félix, usadas en toda la experiencia del producto.' },
      flags3d:       { label: 'Banderas — 3D', description: 'Ilustraciones tridimensionales de banderas para los países de destino compatibles.' },
      flagsOg:       { label: 'Banderas — Estilo Original', description: 'Ilustraciones de banderas en estilo plano con la estética artesanal original.' },
      hands:         { label: 'Manos', description: 'Ilustraciones de manos para llamadas a la acción, explicaciones de funciones y momentos de incorporación.' },
      money:         { label: 'Dinero y Pagos', description: 'Ilustraciones para flujos de pago, confirmaciones de transferencias y momentos de funciones financieras.' },
      communication: { label: 'Comunicación', description: 'Ilustraciones para mensajería, notificaciones, soporte y compartir en redes sociales.' },
      status:        { label: 'Estado y Alertas', description: 'Ilustraciones para confirmación, error, carga y otras comunicaciones de estado.' },
      navigation:    { label: 'Navegación y Mapas', description: 'Ilustraciones de ubicación y mapas para el buscador de tiendas y los flujos de pago en efectivo.' },
      other:         { label: 'Otros', description: 'Ilustraciones de apoyo para funciones del producto, incorporación y momentos utilitarios.' },
      svg: 'SVG',
      png: 'PNG',
    },
  },

  'pt-br': {
    nav: {
      designSystem: 'Sistema de Design',
      overview: 'Visão Geral',
      designPrinciples: 'Princípios de Design',
      thePrinciples: 'Os Princípios',
      resources: 'Recursos',
      whenPrinciplesOverlap: 'Quando se Sobrepõem',
      editorialGuidelines: 'Guia Editorial',
      voiceTone: 'Voz e Tom',
      writingPatterns: 'Padrões de Escrita',
      multilingual: 'Multilíngue',
      contentTokens: 'Tokens de Conteúdo',
      commonPitfalls: 'Erros Comuns',
      quickReference: 'Referência Rápida',
      colors: 'Cores',
      primaryPalette: 'Paleta Primária',
      secondaryPalette: 'Paleta Secundária',
      colorways: 'Combinações de Cores',
      typography: 'Tipografia',
      fontFamilies: 'Famílias de Fontes',
      weights: 'Pesos',
      typeScale: 'Escala Tipográfica',
      illustrations: 'Ilustrações',
      brandCharacters: 'Marca e Personagens',
      flags3D: 'Bandeiras — 3D',
      flagsOriginal: 'Bandeiras — Original',
      hands: 'Mãos',
      moneyPayments: 'Dinheiro e Pagamentos',
      communication: 'Comunicação',
      statusAlerts: 'Status e Alertas',
      navigationMaps: 'Navegação e Mapas',
      other: 'Outros',
      components: 'Componentes',
      buttons: 'Botões',
      cards: 'Cards',
      inputs: 'Campos',
      badges: 'Etiquetas',
      tokens: 'Tokens',
      semanticTokens: 'Tokens Semânticos',
      brandTokens: 'Tokens de Marca',
      chartTokens: 'Tokens de Gráficos',
      spacing: 'Espaçamento',
      borderRadius: 'Raio de Borda',
      shadows: 'Sombras',
      typographyTokens: 'Tipografia',
      sidebarTokens: 'Tokens da Barra Lateral',
      reference: 'Referência',
      referenceMd: 'Markdown Bruto',
      refStack: 'Stack e Config',
      refPrinciples: 'Princípios',
      refColors: 'Cores',
      refTypography: 'Tipografia',
      refComponents: 'Componentes',
      refPatterns: 'Padrões',
      refContentTokens: 'Tokens de Conteúdo',
      refFintechFlows: 'Fluxos Fintech',
      refPresentation: 'Apresentação',
      version: 'Versão 1.0.0',
    },
    pages: {
      overview:      { title: '', description: '' },
      principles:    { title: 'Princípios de Design', description: 'Cinco princípios que definem como cada experiência no Felix Pago deve ser sentida.' },
      editorial:     { title: 'Guia Editorial', description: 'Voz, tom e padrões de escrita para cada texto no produto Felix Pago.' },
      colors:        { title: 'Cores', description: 'Paletas de cores primária e secundária com combinações compatíveis com WCAG e diretrizes de uso.' },
      typography:    { title: 'Tipografia', description: 'A tipografia está no coração da comunicação visual da nossa marca. A aplicação consistente melhora a clareza e a coesão da marca.' },
      components:    { title: 'Componentes', description: 'Uma biblioteca de elementos de interface para criar interfaces consistentes, acessíveis e alinhadas à marca.' },
      tokens:        { title: 'Design Tokens', description: 'Design tokens mapeados às convenções de nomenclatura do shadcn/ui.' },
      illustrations: { title: 'Ilustrações', description: 'A biblioteca de ilustrações do Felix. Baixe SVG para web e PNG para apresentações e documentos.' },
      reference:     { title: 'Referência', description: 'Referência completa do sistema de design — tudo o que é necessário para replicar cada tela, componente e padrão.' },
    },
    home: {
      overviewLabel: 'Visão Geral',
      heroTitle: 'Projetando para a Presença',
      para1: "As remessas não são transações, são **atos de presença**. Quando alguém envia dinheiro pelo Felix, está **presente para a família** em casa.",
      para2: "Quando constroem crédito aqui, estão garantindo **presença futura**, a capacidade de **permanecer disponíveis** para quem amam. Mas a presença não é apenas sobre hoje — é sobre construir a **capacidade de estar presente amanhã**.",
      para3: "O produto deve tornar os usuários **mais fortes com o tempo**: mais informados sobre suas finanças, mais confiantes em suas decisões, mais capazes de construir o futuro que desejam.",
      para4: "O Felix **cresce com os usuários**, desde o primeiro envio para casa até a gestão financeira completa além das fronteiras. **Encontramos as pessoas onde elas estão**, e então **revelamos gradualmente novas possibilidades** conforme estão prontas. A **presença futura** requer **capacidade em toda a sua vida financeira**, e estamos aqui para essa **jornada completa**.",
      felixUses: 'Felix usa',
      bullet1: 'Linguagem que reflete **relações**, não apenas transações',
      bullet2: 'Interfaces que **ensinam** conceitos financeiros sem condescendência',
      bullet3: 'Recursos que **aumentam a capacidade**, não apenas oferecem conveniência',
      bullet4: '**Revelação progressiva** de ferramentas conforme os usuários estão prontos',
      bullet5: 'Celebrações que **reconhecem o crescimento**, não apenas a conclusão',
      gettingStarted: 'Para Começar',
      gettingStartedDesc: 'Explore a documentação do sistema de design para criar interfaces consistentes e bonitas.',
      brandOverview: 'Visão da Marca',
      brandOverviewDesc: 'A identidade de marca do Felix Pago é construída em torno da presença, confiança, acessibilidade e tecnologia financeira moderna.',
      feat: {
        principles:    { title: 'Princípios', desc: 'Princípios fundamentais de design que guiam como construímos experiências no Felix Pago.' },
        colors:        { title: 'Cores', desc: 'Paletas de cores primária e secundária com combinações compatíveis com WCAG.' },
        typography:    { title: 'Tipografia', desc: 'Famílias de fontes, pesos e escala tipográfica para estilização de texto consistente.' },
        components:    { title: 'Componentes', desc: 'Componentes de interface pré-construídos seguindo a linguagem de design do Felix Pago.' },
        tokens:        { title: 'Tokens', desc: 'Design tokens mapeados às convenções de nomenclatura do shadcn/ui.' },
        illustrations: { title: 'Ilustrações', desc: 'A biblioteca completa de ilustrações com downloads SVG e PNG para cada ativo.' },
      },
    },
    illustrations: {
      pageDesc: 'A biblioteca de ilustrações do Felix. Baixe SVG para web e PNG para apresentações e documentos.',
      brand:         { label: 'Marca e Personagens', description: 'Ilustrações principais da marca com o personagem Félix, usadas em toda a experiência do produto.' },
      flags3d:       { label: 'Bandeiras — 3D', description: 'Ilustrações tridimensionais de bandeiras para os países de destino suportados.' },
      flagsOg:       { label: 'Bandeiras — Estilo Original', description: 'Ilustrações de bandeiras em estilo plano com a estética artesanal original.' },
      hands:         { label: 'Mãos', description: 'Ilustrações de mãos para chamadas à ação, explicações de recursos e momentos de integração.' },
      money:         { label: 'Dinheiro e Pagamentos', description: 'Ilustrações para fluxos de pagamento, confirmações de transferências e momentos de recursos financeiros.' },
      communication: { label: 'Comunicação', description: 'Ilustrações para mensagens, notificações, suporte e compartilhamento em redes sociais.' },
      status:        { label: 'Status e Alertas', description: 'Ilustrações para confirmação, erro, carregamento e outras comunicações de estado.' },
      navigation:    { label: 'Navegação e Mapas', description: 'Ilustrações de localização e mapas para o buscador de lojas e os fluxos de pagamento em dinheiro.' },
      other:         { label: 'Outros', description: 'Ilustrações de suporte para recursos do produto, integração e momentos utilitários.' },
      svg: 'SVG',
      png: 'PNG',
    },
  },
}
