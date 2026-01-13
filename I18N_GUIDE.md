# Guia de Internacionalização (i18n)

Este projeto utiliza `i18next` e `react-i18next` para gerenciar múltiplos idiomas (Português e Inglês).
Ao contrário de tradutores automáticos (como widgets do Google Translate), esta abordagem oferece:
- **Melhor SEO**: O Google indexa seu site nativamente em ambas as línguas.
- **Experiência Profissional**: Você controla exatamente o que está escrito.
- **Performance**: Não depende de scripts externos pesados.

---

## Como Traduzir Novas Páginas

Sempre que você criar uma nova página ou adicionar novo texto, siga estes 3 passos:

### 1. Defina as Chaves no Arquivo de Tradução (Português)

Abra `public/locales/pt/translation.json` e adicione a nova seção:

```json
"nova_pagina": {
    "titulo": "Meu Título Novo",
    "descricao": "Minha descrição incrível."
}
```

### 2. Adicione a Tradução em Inglês

Abra `public/locales/en/translation.json` e adicione a MESMA estrutura, mas traduzida:

```json
"nova_pagina": {
    "titulo": "My New Title",
    "descricao": "My amazing description."
}
```

### 3. Use o Hook no Componente React

No seu arquivo `.tsx`:

```tsx
import { useTranslation } from 'react-i18next'; // 1. Importe

const NovaPagina = () => {
    const { t } = useTranslation(); // 2. Inicialize o hook

    return (
        <div>
            {/* 3. Chame a função t usando a chave criada (seção.chave) */}
            <h1>{t('nova_pagina.titulo')}</h1> 
            <p>{t('nova_pagina.descricao')}</p>
        </div>
    );
};
```

### Dicas Importantes

- **Texto com Formatação (Negrito/Itálico)**: Use o componente `<Trans>` (veja exemplo em `About.tsx` ou `Home.tsx`).
- **Listas (Arrays)**: Você pode retornar arrays do JSON usando `t('chave', { returnObjects: true })`.
- **Faltou Tradução?**: Se uma chave não existir no inglês, o sistema usará o português (fallback) automaticamente.

---
**Este é o padrão de mercado para aplicações Web robustas e escaláveis.**
