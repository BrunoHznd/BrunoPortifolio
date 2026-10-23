# Portfólio de Bruno Oliveira Carvalho

Site estático em português, sem dependências de produção e sem etapa de build. Os arquivos prontos para hospedagem ficam em `dist/`.

## Executar

Requer Node.js 20 ou superior. Execute `npm run dev` e abra http://127.0.0.1:4173. Use `npm run check` para verificar sintaxe, arquivos, referências e integridade do conteúdo.

## Personalizar e hospedar

- Conteúdo, contatos e metadados: `dist/index.html`.
- Estilos e responsividade: `dist/style.css`.
- Filtros, navegação e cópia de e-mail: `dist/app.js`.
- Inclinação 3D, importada sob demanda: `dist/depth.js`.
- Para hospedagem estática, publique `dist/`. Ao mudar o domínio, atualize URLs de Open Graph e JSON-LD.

## Conteúdo e imagens

Os dados pessoais e projetos seguem o briefing fornecido. Imagens do App Clima e marca/foto da GB Climatização foram obtidas dos respectivos sites públicos. Os demais mockups são representações ilustrativas e têm identificação visível. Os gráficos ilustrativos não representam métricas reais. Tecnologias do tiResolve foram confirmadas em seu [README](https://github.com/BrunoHznd/Projeto---Lab.-Multiplataforma/blob/BrunoDev/ci-support-system/README.md): React, React Native/Expo, Electron e Python/FastAPI. Fontes Manrope e Space Grotesk, distribuídas pelo Google Fonts, são servidas localmente.

## Acessibilidade e desempenho

Menu móvel com Escape, filtros com estado acessível, região de confirmação de cópia, foco visível, links diretos e conteúdo sem JavaScript. Animações respeitam `prefers-reduced-motion`; profundidade só é ativada em dispositivos com mouse e capacidade adequada. Recursos visuais abaixo da dobra usam carregamento preguiçoso. Não há formulário ou coleta de dados.
