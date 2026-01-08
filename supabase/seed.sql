-- ==========================================
-- SEED DATA - CONEXÃO ANCESTRAL
-- ==========================================

-- 1. Inserir Categorias
insert into categories (name, slug) values
('Educação', 'educacao'),
('Saúde', 'saude'),
('Sustentabilidade', 'sustentabilidade'),
('Cultura', 'cultura')
on conflict (name) do nothing;

-- 2. Inserir Projetos Iniciais
insert into projects (title, category, description, full_description, image_url, goal_amount, raised_amount, status, beneficiaries_count, year, impact_data, gallery) values
(
  'Sistema Sustentável de Captação e Distribuição de Água na T.I. Campinas/Katukina', 
  'Educação', 
  'Implementação de solução sustentável de captação e distribuição de água para assegurar água de qualidade no território Katukina.',
  'Este projeto nasce do movimento de fortalecimento cultural e territorial do povo Katukina, cujo nome significa “povo verdadeiro”. Ao longo dos anos, as aldeias localizadas às margens da BR-364, que atravessa a Terra Indígena Campinas/Katukina, passaram a enfrentar pressões crescentes sobre seus territórios, seus recursos naturais e seu modo de vida tradicional, gerando impactos ambientais, riscos à saúde e desafios à preservação cultural. Diante desse cenário, cerca de 12 famílias Katukina decidiram criar uma nova aldeia em uma área mais preservada do território, distante da rodovia, reafirmando seu compromisso com a floresta, com os saberes ancestrais e com uma vida em harmonia com a natureza. Esse deslocamento representa um gesto de resistência cultural, autonomia e fortalecimento da identidade indígena. Para que a nova aldeia possa se consolidar de forma digna e sustentável, o projeto prevê a implantação de um sistema de abastecimento de água potável, por meio da perfuração de um poço artesiano e da instalação de um sistema de bombeamento movido a energia solar fotovoltaica. A proposta busca reduzir a dependência de rios e igarapés, diminuir riscos de contaminação e garantir melhores condições de saúde e bem-estar para a comunidade. Mais do que uma solução de infraestrutura, o projeto representa um investimento no futuro do povo Katukina, fortalecendo a autonomia comunitária e contribuindo para a preservação cultural e ambiental da Terra Indígena Campinas/Katukina.',
  '/assets/img/project-details-gallery-1.jpg',
  60000, 
  45000, 
  'Em Andamento',
  120,
  2024,
  '{"objectives": ["Perfuração de poço artesiano", "Energia solar fotovoltaica", "Água potável para a nova aldeia", "Saneamento e saúde"], "testimonials": [{"name": "Txai Katukina", "role": "Liderança Local", "quote": "Ter água limpa brotando na nossa nova aldeia é devolver a saúde e a dignidade para nossas crianças.", "avatar": "/assets/img/team-joao.jpg"}, {"name": "Maria Katukina", "role": "Agente de Saúde Indígena", "quote": "O poço artesiano reduziu as doenças na comunidade. É uma vitória da nossa resistência.", "avatar": "/assets/img/team-mariana.jpg"}]}',
  '{"/assets/img/project-details-gallery-1.jpg", "/assets/img/project-details-gallery-2.jpg", "/assets/img/project-details-gallery-3.jpg", "/assets/img/project-details-gallery-4.jpg", "/assets/img/project-details-gallery-5.jpg", "/assets/img/project-details-gallery-6.jpg", "/assets/img/project-details-gallery-7.jpg"}'
),
(
  'Projeto Aldeia Sagrada - Construção do Centro Yuvanapanamaritiru de Cura, cultura e formação dos Guardiões Shawãdawa Panamaritiru', 
  'Sustentabilidade', 
  'Projeto de fortalecimento cultural e espiritual do povo Shawãdawa, por meio da criação do Centro Yuvanapanamaritiru, dedicado à cura tradicional, à transmissão de saberes ancestrais e à formação de guardiões da cultura.',
  'O Centro Yuvanapanamaritiru é a materialização de um sonho de resistência e fortalecimento cultural do povo Shawãdawa (Arara), que habita o Alto Rio Juruá, no Acre. Após uma história marcada pela luta contra a opressão e o massacre durante os ciclos extrativistas, nossa comunidade, composta por aproximadamente 1.600 indígenas em um território de 876 hectares, organiza-se para garantir a continuidade de seu knowledge ancestral. O Centro, cujo nome significa ''Centro de Cura, Cultura e Formação dos Guardiões'', nasce do compromisso espiritual transmitido por nossos anciãos e Pajés, visando ser um santuário para a preservação da medicina tradicional e a transmissão desse saber milenar às futuras gerações. O projeto está estruturado para oferecer um espaço adequado para a prática de curas tradicionais e o acolhimento de pessoas que buscam tratamento físico, emocional e espiritual. Isso se concretiza através da construção do Kupixawa para rituais sagrados como o Mariri e a Caiçumada; de uma Pousada para receber pacientes e alunos que necessitam de dietas especiais e isolamento para concentração profunda; de uma Casa de Cura dedicada ao preparo e armazenamento de medicinas de poder como Ayahuasca, Rapé e Sananga; e de uma Casa de Banhos Curativos com ervas tradicionais. Além da missão espiritual, o Yuvanapanamaritiru é um pilar de sustentabilidade e autonomia. A construção de um poço artesiano garantirá água potável para o Centro e toda a comunidade. A criação de um viveiro para plantas medicinais em risco de extinção, juntamente com o plantio de Kawá (folha) e Mariri (cipó) nas proximidades, assegura o suprimento permanente da Ayahuasca, medicina primordial para o despertar espiritual, e promove a segurança alimentar com o cultivo de alimentos orgânicos e diversificados. O projeto também gera trabalho e renda para os membros da aldeia envolvidos em sua manutenção, reforçando a auto sustentabilidade buscada pelo povo Shawãdawa, na defesa inegociável de nossos direitos culturais e religiosos.',
  '/assets/img/project-agrofloresta.jpg',
  30000, 
  12500, 
  'Em Andamento',
  50,
  2024,
  '{"objectives": ["Construção do Kupixawa", "Viveiro medicinal", "Poço artesiano comunitário", "Autonomia Shawãdawa"], "testimonials": [{"name": "Pajé Shawãdawa", "role": "Líder Espiritual", "quote": "O Centro Yuvanapanamaritiru é o coração da nossa cura. Aqui guardamos o espírito da floresta.", "avatar": "/assets/img/team-joao.jpg"}, {"name": "Arara Shawã", "role": "Coordenadora de Cultura", "quote": "Nosso centro de cultura garante que os jovens aprendam os cantos e as medicinas dos avós.", "avatar": "/assets/img/team-mariana.jpg"}]}',
  '{"/assets/img/project-agrofloresta.jpg", "/assets/img/project-details-gallery-2.jpg", "/assets/img/project-details-gallery-5.jpg", "/assets/img/project-details-gallery-3.jpg"}'
),
(
  'Água Limpa para Todos', 
  'Saúde', 
  'Instalação de poços artesianos e sistemas de filtragem para garantir acesso à água potável em áreas remotas.',
  'O acesso à água potável é um direito fundamental. Este projeto instala sistemas de captação e purificação de água.',
  '/assets/img/project-agua-limpa.jpg',
  80000, 
  78000, 
  'Quase Lá',
  200,
  2024,
  '{"objectives": ["Instalação de 5 poços.", "Distribuição de filtros.", "Treinamento comunitário."]}',
  '{"/assets/img/project-agua-limpa.jpg", "/assets/img/project-details-gallery-4.jpg", "/assets/img/project-details-gallery-6.jpg", "/assets/img/project-details-gallery-7.jpg"}'
),
(
  'Centro Cerimonial de Cultura Huni Kuin do Rio Breu',
  'Cultura',
  'Criação de um Centro Cerimonial de Cultura para fortalecer a identidade, os saberes ancestrais e a continuidade cultural do povo Huni Kuin.',
  'Este projeto tem como objetivo fortalecer e valorizar a cultura do povo Huni Kuin, autodenominado “gente verdadeira”, promovendo a preservação de seus saberes ancestrais, de sua língua, espiritualidade e expressões culturais. Em um contexto de constantes pressões externas, a iniciativa reafirma a identidade, a autonomia e a resistência cultural profundamente enraizadas na floresta amazônica. O foco central do projeto é a construção e manutenção de um Centro Cerimonial de Cultura, concebido como um espaço vivo de reunião, ensino e celebração. O Centro será dedicado à preservação da língua Hãtxa Kuin, ao fortalecimento das medicinas tradicionais, à realização de cerimônias, aos cantos sagrados e à valorização das artes Huni Kuin, como o kenê, a tecelagem e a cerâmica. Mais do que uma estrutura física, o Centro Cerimonial representa um espaço de autodeterminação, onde a própria comunidade conduz a gestão de seu patrimônio cultural. Ao fortalecer a cultura, o projeto também promove sustentabilidade, geração de renda e continuidade do modo de vida tradicional, garantindo que o legado do povo Huni Kuin siga vivo para as futuras gerações.',
  '/assets/img/project-huni-kuin.png',
  50000,
  0,
  'Em Planejamento',
  0,
  2025,
  '{"objectives": ["Fortalecimento da identidade Huni Kuin", "Preservação da língua Hãtxa Kuin", "Construção do Centro Cerimonial", "Valorização das artes tradicionais (kenê, tecelagem)"], "testimonials": [{"name": "Bixku Huni Kuin", "role": "Guardião da Cultura", "quote": "Nossa maloca é o lugar onde nossa língua Hãtxa Kuin volta a ecoar com força total.", "avatar": "/assets/img/team-joao.jpg"}, {"name": "Kenê Huni Kuin", "role": "Tecelã e Artista", "quote": "Pintar nossos grafismos no novo centro cerimonial é tecer o futuro do nosso povo.", "avatar": "/assets/img/team-mariana.jpg"}]}',
  '{"/assets/img/project-huni-kuin.png"}'
);

-- 3. Inserir Pilares de Impacto (Substituindo estatísticas numéricas)
insert into impact_stats (label, value, description, icon, suffix) values
('Cultura', 'Saberes Ancestrais', 'Preservamos a riqueza cultural e a sabedoria milenar dos povos originários.', 'diversity_2', ''),
('Território', 'Autonomia e Proteção', 'Defendemos os direitos territoriais e a autogestão dos povos tradicionais.', 'forest', ''),
('Futuro', 'Sustentabilidade Viva', 'Construímos um amanhã mais justo, com respeito à natureza e às gerações futuras.', 'eco', '')
on conflict (label) do update set value = excluded.value, description = excluded.description;
